import { useEffect, useMemo, useState } from 'react';
import { Img } from '../assets/Img';
import type { KeyConfig, RiddleConfig } from '../content/types';
import { EICHELN } from '../engine/scoring';
import { shuffle } from '../engine/rng';
import { sound } from '../lib/sound';
import { Frage, SpeakButton } from '../components/ui';
import { WeiterKnopf, type GameProps } from './common';

/** G11 Wer bin ich? Bis zu 3 Hinweise, je früher gelöst, desto mehr Eicheln (30/20/10). */
export function RiddleGame({ config, api }: GameProps<RiddleConfig>) {
  const raetsel = useMemo(() => shuffle(config.raetsel).slice(0, config.anzahl ?? 4), []);
  const [i, setI] = useState(0);
  const [hinweise, setHinweise] = useState(1);
  const [geloest, setGeloest] = useState<'' | 'ja' | 'nein'>('');
  const [falsch, setFalsch] = useState<string[]>([]);
  const [punkte, setPunkte] = useState(0);
  const r = raetsel[i];
  const optionen = useMemo(() => shuffle(r.optionen), [i]);

  useEffect(() => {
    api.fortschritt(i, raetsel.length);
    api.setTipp('Lies alle Hinweise. Brauchst du noch einen? Tippe auf „Nächster Hinweis“.');
  }, [i]);

  function rate(o: string) {
    if (geloest) return;
    if (o === r.loesung) {
      const e = EICHELN.raetsel[hinweise - 1];
      api.task({ id: r.id, factIds: r.factIds, versuch: 1, ohneLeitner: true });
      // Bonus über den normalen Wert hinaus (30/20/10 statt 10)
      sound.richtig();
      api.sag(`Richtig, ich bin ${r.loesung}! +${e} Eicheln`, 'richtig');
      setPunkte((p) => p + [1, 1, 0.5][hinweise - 1]);
      setGeloest('ja');
      if (e > 10) api.bonus(e - 10);
    } else {
      setFalsch([...falsch, o]);
      if (hinweise < 3) {
        setHinweise(hinweise + 1);
        api.sag('Noch nicht. Hier ist ein neuer Hinweis!', 'tipp');
      } else {
        api.task({ id: r.id, factIds: r.factIds, versuch: 3, ohneLeitner: true });
        api.sag(`Ich bin ${r.loesung}.`, 'loesung');
        setGeloest('nein');
      }
    }
  }

  function weiter() {
    if (i + 1 >= raetsel.length)
      api.finish({ richtig: punkte, gesamt: raetsel.length, versuche: 0, fehler: [] });
    else {
      setI(i + 1);
      setHinweise(1);
      setGeloest('');
      setFalsch([]);
    }
  }

  return (
    <div className="riddle-game">
      <Frage text="Wer bin ich?" autoRead={false} />
      <div className="riddle-flaeche">
        <div className="riddle-bild">
          {geloest && r.bild ? <Img id={r.bild} /> : <span className="silhouette">?</span>}
        </div>
        <ol className="hinweise">
          {r.hinweise.slice(0, hinweise).map((h, k) => (
            <li key={k}>
              {h} <SpeakButton text={h} klein />
            </li>
          ))}
        </ol>
      </div>
      {!geloest && hinweise < 3 && (
        <button type="button" className="knopf leise" onClick={() => setHinweise(hinweise + 1)}>
          Nächster Hinweis
        </button>
      )}
      <div className="optionen">
        {optionen.map((o) => (
          <button
            key={o}
            type="button"
            className={`option ${geloest && o === r.loesung ? 'korrekt' : ''} ${falsch.includes(o) ? 'gesperrt' : ''}`}
            disabled={!!geloest || falsch.includes(o)}
            onClick={() => rate(o)}
          >
            {o}
          </button>
        ))}
      </div>
      {geloest && <WeiterKnopf onClick={weiter} />}
    </div>
  );
}

/** G12 Baum-Detektiv: Bestimmungsschlüssel mit Ja/Nein-Fragen. */
export function KeyGame({ config, api }: GameProps<KeyConfig>) {
  const ziele = useMemo(() => shuffle(config.ziele), []);
  const [i, setI] = useState(0);
  const [knoten, setKnoten] = useState(config.start);
  const [pfad, setPfad] = useState<string[]>([]);
  const [punkte, setPunkte] = useState(0);
  const [versuch, setVersuch] = useState(1);
  const ziel = ziele[i];
  const k = config.knoten.find((x) => x.id === knoten)!;

  useEffect(() => {
    api.fortschritt(i, ziele.length);
    api.setTipp('Schau ganz genau auf die Bilder und beantworte jede Frage mit Ja oder Nein.');
  }, [i]);

  function antwort(ja: boolean) {
    if (!('frage' in k)) return;
    setPfad([...pfad, `${k.frage} ${ja ? 'Ja' : 'Nein'}`]);
    setKnoten(ja ? k.ja : k.nein);
  }

  const ergebnis = 'ergebnis' in k ? k.ergebnis : null;
  const stimmt = ergebnis === ziel.baum;

  useEffect(() => {
    if (!ergebnis) return;
    if (stimmt) {
      api.task({
        id: `key-${ziel.baum}`,
        factIds: ziel.factIds,
        versuch: versuch as 1 | 2,
        ohneLeitner: true,
      });
      api.sag(`Du hast es herausgefunden: ${ziel.baum}!`, 'richtig');
      setPunkte((p) => p + (versuch === 1 ? 1 : 0.5));
    } else if (versuch === 1) {
      api.sag(`Hm, ${ergebnis}? Schau noch einmal genau hin und starte neu.`, 'tipp');
    } else {
      api.task({ id: `key-${ziel.baum}`, factIds: ziel.factIds, versuch: 3, ohneLeitner: true });
      api.sag(`Das ist die ${ziel.baum}.`, 'loesung');
    }
  }, [ergebnis]);

  function neu() {
    setVersuch(2);
    setKnoten(config.start);
    setPfad([]);
  }
  function weiter() {
    if (i + 1 >= ziele.length) api.finish({ richtig: punkte, gesamt: ziele.length, versuche: 0, fehler: [] });
    else {
      setI(i + 1);
      setKnoten(config.start);
      setPfad([]);
      setVersuch(1);
    }
  }

  return (
    <div className="key-game">
      <div className="key-bilder">
        {ziel.bilder.map((b) => (
          <Img key={b} id={b} className="key-bild" />
        ))}
      </div>
      <div className="key-panel">
        <ul className="key-pfad">
          {pfad.map((p, n) => (
            <li key={n}>{p}</li>
          ))}
        </ul>
        {'frage' in k ? (
          <>
            <Frage text={k.frage} />
            <div className="daumen">
              <button type="button" className="option" onClick={() => antwort(true)}>
                ✔ Ja
              </button>
              <button type="button" className="option" onClick={() => antwort(false)}>
                ✖ Nein
              </button>
            </div>
          </>
        ) : stimmt || versuch === 2 ? (
          <div className="steckbrief">
            <h3>Steckbrief: {ziel.baum}</h3>
            <ul>
              {ziel.steckbrief.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <SpeakButton text={`${ziel.baum}. ${ziel.steckbrief.join('. ')}`} />
            <WeiterKnopf onClick={weiter} />
          </div>
        ) : (
          <button type="button" className="knopf" onClick={neu}>
            Noch einmal bestimmen
          </button>
        )}
      </div>
    </div>
  );
}
