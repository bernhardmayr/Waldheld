import { useEffect, useMemo, useState } from 'react';
import { Img } from '../assets/Img';
import type { PuzzleConfig, SequenceConfig } from '../content/types';
import { shuffle } from '../engine/rng';
import { Frage, SpeakButton } from '../components/ui';
import { useDrag } from '../components/drag';
import { Karte, useVersuche, type GameProps } from './common';

function Teil({
  children,
  aktiv,
  onTap,
  onDrop,
}: {
  children: React.ReactNode;
  aktiv: boolean;
  onTap: () => void;
  onDrop: (z: string) => void;
}) {
  const drag = useDrag(onDrop, onTap);
  return (
    <button type="button" className={`zieh-karte ${aktiv ? 'aktiv' : ''}`} aria-pressed={aktiv} {...drag}>
      {children}
    </button>
  );
}

/** G09 Reihenfolge: Karten in die richtige Abfolge legen. Slot für Slot. */
export function SequenceGame({ config, api }: GameProps<SequenceConfig>) {
  const gemischt = useMemo(() => {
    let s = shuffle(config.schritte);
    while (s.length > 1 && s.every((x, i) => x.id === config.schritte[i].id)) s = shuffle(config.schritte);
    return s;
  }, []);
  const v = useVersuche(api);
  const [gelegt, setGelegt] = useState<string[]>([]);
  const [wahl, setWahl] = useState<string | null>(null);
  const [fehlerfrei, setFehlerfrei] = useState(true);
  const naechster = gelegt.length;

  useEffect(() => api.setTipp('Was passiert zuerst? Lies jede Karte und überlege, was danach kommt.'), []);
  useEffect(() => {
    api.fortschritt(gelegt.length, config.schritte.length);
    if (gelegt.length === config.schritte.length) {
      if (fehlerfrei) {
        if (config.schritte[0].factIds.includes('m07-sirup')) api.zaehle('sirup');
        if (config.schritte[0].factIds.includes('m12-recycling')) api.zaehle('recyclingReihe');
      }
      setTimeout(() => api.finish(v.ergebnis()), 800);
    }
  }, [gelegt.length]);

  function lege(id: string, slot: number) {
    if (slot !== naechster) {
      api.sag('Lege die Karten der Reihe nach, beginne beim ersten freien Platz.', 'info');
      setWahl(null);
      return;
    }
    const soll = config.schritte[slot];
    const r = v.pruefe(id === soll.id, {
      id: `seq-${soll.id}-${config.schritte[0].id}`,
      factIds: soll.factIds,
      ohneLeitner: true,
      antwort: id,
      tipp: 'Das kommt noch nicht dran. Was passiert davor?',
      loesung: `An Platz ${slot + 1} kommt: „${soll.text}“`,
    });
    if (r !== 'richtig') setFehlerfrei(false);
    if (r !== 'tipp') setGelegt([...gelegt, soll.id]);
    setWahl(null);
  }

  const offen = gemischt.filter((s) => !gelegt.includes(s.id));
  return (
    <div className="sequence-game">
      <Frage text={config.frage} />
      <ol className="slots">
        {config.schritte.map((s, i) => {
          const belegt = gelegt[i] ? config.schritte.find((x) => x.id === gelegt[i]) : null;
          return (
            <li
              key={s.id}
              className={`slot ${i === naechster ? 'naechster' : ''} ${belegt ? 'belegt' : ''}`}
              data-drop={String(i)}
              onClick={() => wahl && lege(wahl, i)}
            >
              <span className="slot-nr">{i + 1}</span>
              {belegt ? (
                <Karte text={belegt.text} bild={belegt.bild} klein />
              ) : (
                <span className="slot-leer">?</span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="stapel">
        {offen.map((s) => (
          <span key={s.id} className="mit-speak">
            <Teil
              aktiv={wahl === s.id}
              onTap={() => setWahl(wahl === s.id ? null : s.id)}
              onDrop={(z) => lege(s.id, Number(z))}
            >
              <Karte text={s.text} bild={s.bild} klein />
            </Teil>
            <SpeakButton text={s.text} klein />
          </span>
        ))}
      </div>
    </div>
  );
}

/** G08a Baum-Puzzle: von unten nach oben bauen. */
export function PuzzleGame({ config, api }: GameProps<PuzzleConfig>) {
  const gemischt = useMemo(() => shuffle(config.teile), []);
  const v = useVersuche(api);
  const [gebaut, setGebaut] = useState<string[]>([]);
  const [wahl, setWahl] = useState<string | null>(null);
  const bilder: Record<string, string> = {
    wurzeln: 'teil-wurzeln',
    stamm: 'teil-stamm',
    aeste: 'teil-ast',
    zweige: 'teil-zweig',
    blaetter: 'teil-krone',
  };

  useEffect(() => api.setTipp('Ein Baum wächst von unten nach oben: Was ist ganz unten in der Erde?'), []);
  useEffect(() => {
    api.fortschritt(gebaut.length, config.teile.length);
    if (gebaut.length === config.teile.length) setTimeout(() => api.finish(v.ergebnis()), 900);
  }, [gebaut.length]);

  function baue(id: string) {
    const soll = config.teile[gebaut.length];
    const r = v.pruefe(id === soll.id, {
      id: `puzzle-${soll.id}`,
      factIds: soll.factIds,
      ohneLeitner: true,
      antwort: id,
      tipp: 'Das kommt erst später. Was kommt als Nächstes von unten?',
      loesung: `Als Nächstes kommt: ${soll.label}.`,
    });
    if (r !== 'tipp') setGebaut([...gebaut, soll.id]);
    setWahl(null);
  }

  return (
    <div className="puzzle-game">
      <Frage text={config.frage} />
      <div className="puzzle-bau" data-drop="bau" onClick={() => wahl && baue(wahl)}>
        <div className="puzzle-turm">
          {[...gebaut].reverse().map((id) => {
            const t = config.teile.find((x) => x.id === id)!;
            return (
              <div key={id} className="puzzle-stufe">
                <Img id={bilder[id]} size={80} />
                <span>{t.label}</span>
              </div>
            );
          })}
          {gebaut.length < config.teile.length && <div className="puzzle-frei">Hier anbauen ⬆</div>}
        </div>
      </div>
      <div className="stapel">
        {gemischt
          .filter((t) => !gebaut.includes(t.id))
          .map((t) => (
            <Teil
              key={t.id}
              aktiv={wahl === t.id}
              onTap={() => (wahl === t.id ? baue(t.id) : setWahl(t.id))}
              onDrop={() => baue(t.id)}
            >
              <Karte text={t.label} bild={bilder[t.id]} klein />
            </Teil>
          ))}
      </div>
      <p className="hinweis">Tippe ein Teil zweimal an oder ziehe es auf den Baum.</p>
    </div>
  );
}
