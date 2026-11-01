import { useEffect, useMemo, useRef, useState } from 'react';
import type { GameConfig, GameType } from '../content/types';
import { GAMES } from '../games/registry';
import { GameContext, sterneFuer, type GameApi, type GameResult, type Stimmung } from '../games/common';
import { sound } from '../lib/sound';
import { sprich } from '../lib/tts';
import { useProgress } from '../store/progress';
import { useSettings } from '../store/settings';
import { useRang } from '../app/Layout';
import { useOhneKopfleiste } from '../lib/vollbild';
import { Pinsel, type Pose } from './Pinsel';
import { Eichel, Fortschritt, SpeakButton } from './ui';

const POSE: Record<Stimmung, Pose> = {
  richtig: 'freut',
  falsch: 'denkt',
  tipp: 'denkt',
  loesung: 'zeigt',
  info: 'zeigt',
};

/** Spiel-Container: Fortschrittsbalken, Pinsel-Ecke mit Tipp-Knopf, Abbrechen. Implementiert die GameApi. */
export function GamePlayer({
  type,
  config,
  titel,
  stationId,
  spielKey,
  oben,
  onFertig,
  onAbbruch,
}: {
  type: GameType;
  config: GameConfig;
  titel: string;
  stationId?: string;
  spielKey?: string;
  /** Fortschritt über mehrere Spiele der Station */
  oben?: { nr: number; von: number };
  onFertig: (r: GameResult, sterne: 0 | 1 | 2 | 3, eicheln: number) => void;
  onAbbruch: () => void;
}) {
  const autoVorlesen = useSettings((s) => s.autoVorlesen);
  const rang = useRang();
  const [msg, setMsg] = useState<{ text: string; stimmung: Stimmung; nr: number } | null>(null);
  const eicheln = useProgress((s) => s.eicheln);

  // Im Spiel keine Kopfleiste: mehr Platz, besonders auf dem Handy
  useOhneKopfleiste();

  // Lob verschwindet von selbst, Tipps und Lösungen bleiben bis zum Wegtippen
  useEffect(() => {
    if (!msg || msg.stimmung !== 'richtig') return;
    const t = setTimeout(() => setMsg((m) => (m?.nr === msg.nr ? null : m)), 2500);
    return () => clearTimeout(t);
  }, [msg]);
  const [tipp, setTipp] = useState<string | null>(null);
  const [fort, setFort] = useState({ d: 0, t: 1 });
  const [flieg, setFlieg] = useState(0);
  const eichelnStart = useRef(useProgress.getState().eicheln);
  const seed = useMemo(() => Math.floor(Math.random() * 100000), []);
  const fertig = useRef(false);
  const Game = GAMES[type];

  const api: GameApi = useMemo(
    () => ({
      seed,
      task(e) {
        useProgress.getState().task(e);
        if (e.versuch < 3) {
          sound.richtig();
          setFlieg((f) => f + 1);
        } else sound.falsch();
      },
      sag(text, stimmung) {
        setMsg((m) => ({ text, stimmung, nr: (m?.nr ?? 0) + 1 }));
        if (stimmung === 'tipp') sound.falsch();
        if (autoVorlesen || stimmung === 'loesung' || stimmung === 'tipp') sprich(text);
      },
      setTipp,
      fortschritt(d, t) {
        setFort({ d, t });
      },
      zaehle(k, n, absolut) {
        useProgress.getState().zaehle(k, n, absolut);
      },
      bonus(n) {
        useProgress.getState().bonus(n);
      },
      finish(r) {
        if (fertig.current) return;
        fertig.current = true;
        const sterne = sterneFuer(r);
        const fehlerfrei = r.gesamt > 0 && r.richtig >= r.gesamt;
        if (stationId && spielKey !== undefined)
          useProgress.getState().spielEnde(stationId, spielKey, sterne, fehlerfrei);
        else if (fehlerfrei) useProgress.getState().bonus(20);
        const verdient = useProgress.getState().eicheln - eichelnStart.current;
        onFertig(r, sterne, verdient);
      },
    }),
    [],
  );

  const pose: Pose = msg ? POSE[msg.stimmung] : 'neutral';
  const gesamtFort = oben
    ? (oben.nr + fort.d / Math.max(1, fort.t)) / oben.von
    : fort.d / Math.max(1, fort.t);

  return (
    <GameContext.Provider value={api}>
      <div className="spiel">
        <div className="spiel-kopf">
          <button
            type="button"
            className="knopf leise abbrechen"
            onClick={onAbbruch}
            aria-label="Spiel abbrechen"
          >
            ✖
          </button>
          <div className="spiel-titel">
            <strong>{titel}</strong>
            <Fortschritt wert={gesamtFort * 100} max={100} />
          </div>
          <div className="spiel-eicheln" aria-label={`${eicheln} Eicheln`}>
            <Eichel size={24} /> <strong>{eicheln}</strong>
          </div>
        </div>
        <div className="spiel-flaeche">
          <Game config={config} api={api} />
        </div>
        <div className={`pinsel-ecke ${msg ? 'spricht' : ''} stimmung-${msg?.stimmung ?? 'neutral'}`}>
          {msg && (
            <div
              className="sprechblase"
              role="status"
              aria-live="polite"
              onClick={() => setMsg(null)}
              title="Antippen zum Schließen"
            >
              <span className="sprechblase-text">{msg.text}</span>
              <span className="sprechblase-knoepfe">
                <SpeakButton text={msg.text} klein />
                <button
                  type="button"
                  className="schliessen"
                  aria-label="Hinweis schließen"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMsg(null);
                  }}
                >
                  ✕
                </button>
              </span>
            </div>
          )}
          <div key={flieg} className={`pinsel-huepf ${flieg && msg?.stimmung === 'richtig' ? 'huepft' : ''}`}>
            <Pinsel pose={pose} size={92} items={rang.items} />
          </div>
          {tipp && (
            <button type="button" className="knopf tipp" onClick={() => api.sag(tipp, 'info')}>
              💡 Tipp
            </button>
          )}
          {flieg > 0 && <span key={`e${flieg}`} className="eichel-flug" aria-hidden="true" />}
        </div>
      </div>
    </GameContext.Provider>
  );
}
