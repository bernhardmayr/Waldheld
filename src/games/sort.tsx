import { useEffect, useMemo, useState } from 'react';
import { Img } from '../assets/Img';
import type { LiftConfig, SortConfig } from '../content/types';
import { shuffle } from '../engine/rng';
import { useDrag } from '../components/drag';
import { Frage, SpeakButton } from '../components/ui';
import { Karte, useVersuche, type GameProps } from './common';

function ZiehKarte({
  id,
  text,
  bild,
  aktiv,
  onTap,
  onDrop,
}: {
  id: string;
  text?: string;
  bild?: string;
  aktiv: boolean;
  onTap: () => void;
  onDrop: (z: string) => void;
}) {
  const drag = useDrag(onDrop, onTap);
  return (
    <button
      type="button"
      className={`zieh-karte ${aktiv ? 'aktiv' : ''}`}
      data-karte={id}
      aria-pressed={aktiv}
      {...drag}
    >
      <Karte text={text} bild={bild} />
    </button>
  );
}

/** G04 Sortieren: Karten in 2–5 Körbe. */
export function SortGame({ config, api }: GameProps<SortConfig>) {
  const karten = useMemo(() => shuffle(config.karten).slice(0, config.anzahl ?? config.karten.length), []);
  const v = useVersuche(api);
  const [platz, setPlatz] = useState<Record<string, string>>({});
  const [wahl, setWahl] = useState<string | null>(null);
  const [wackel, setWackel] = useState<string | null>(null);
  const offen = karten.filter((k) => !platz[k.id]);

  useEffect(() => {
    api.setTipp('Tippe eine Karte an und dann den richtigen Korb. Du kannst die Karte auch hineinziehen.');
  }, []);
  useEffect(() => {
    api.fortschritt(karten.length - offen.length, karten.length);
    if (offen.length === 0) setTimeout(() => api.finish(v.ergebnis()), 700);
  }, [offen.length]);

  function lege(kid: string, korb: string) {
    const k = karten.find((x) => x.id === kid)!;
    const richtigerKorb = config.koerbe.find((b) => b.id === k.korb)!;
    const r = v.pruefe(k.korb === korb, {
      id: `${api.seed}-${k.id}`,
      factIds: k.factIds,
      ohneLeitner: true,
      antwort: korb,
      tipp: `„${k.text ?? ''}“ passt nicht in diesen Korb. Überlege noch einmal.`,
      loesung: `„${k.text ?? ''}“ gehört zu: ${richtigerKorb.titel}.`,
    });
    if (r === 'tipp') {
      setWackel(kid);
      setTimeout(() => setWackel(null), 500);
    } else setPlatz({ ...platz, [kid]: k.korb });
    setWahl(null);
  }

  return (
    <div className="sort-game">
      <Frage text={config.frage} />
      <div
        className="koerbe"
        style={{ gridTemplateColumns: `repeat(${config.koerbe.length}, minmax(0, 1fr))` }}
      >
        {config.koerbe.map((b) => (
          <div
            key={b.id}
            className={`korb ${wahl ? 'bereit' : ''}`}
            data-drop={b.id}
            onClick={() => wahl && lege(wahl, b.id)}
            role="button"
            tabIndex={0}
            aria-label={`Korb ${b.titel}`}
          >
            <div className="korb-kopf">
              {b.bild && <Img id={b.bild} className="korb-bild" />}
              <strong>{b.titel}</strong>
              <SpeakButton text={b.titel} klein />
            </div>
            <div className="korb-inhalt">
              {karten
                .filter((k) => platz[k.id] === b.id)
                .map((k) => (
                  <span key={k.id} className="abgelegt">
                    <Karte text={k.text} bild={k.bild} klein />
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="stapel">
        {offen.map((k) => (
          <span key={k.id} className={wackel === k.id ? 'wackeln' : ''}>
            <ZiehKarte
              id={k.id}
              text={k.text}
              bild={k.bild}
              aktiv={wahl === k.id}
              onTap={() => setWahl(wahl === k.id ? null : k.id)}
              onDrop={(z) => lege(k.id, z)}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/** G23 Stockwerk-Aufzug: Tier in das richtige Stockwerk fahren. */
export function LiftGame({ config, api }: GameProps<LiftConfig>) {
  const tiere = useMemo(() => shuffle(config.tiere), []);
  const v = useVersuche(api);
  const [i, setI] = useState(0);
  const [etage, setEtage] = useState<number | null>(null);
  const [fehler, setFehler] = useState(0);
  const [bewohner, setBewohner] = useState<Record<string, string[]>>({});
  const tier = tiere[i];
  const oben = [...config.stockwerke].reverse();

  useEffect(() => {
    api.setTipp('Ganz unten ist die Wurzelschicht (1), ganz oben die Kronenschicht (5).');
  }, []);
  useEffect(() => api.fortschritt(i, tiere.length), [i]);

  function fahre(nr: number) {
    if (!tier) return;
    setEtage(nr);
    const sw = config.stockwerke[nr];
    const ziel = config.stockwerke.find((s) => s.id === tier.stockwerk)!;
    const r = v.pruefe(sw.id === tier.stockwerk, {
      id: `lift-${tier.id}`,
      factIds: tier.factIds,
      ohneLeitner: true,
      antwort: sw.titel,
      tipp: `Wohnt ${tier.label} wirklich in der ${sw.titel}? Denk an das Haus mit fünf Stockwerken.`,
      loesung: `${tier.label} gehört in die ${ziel.titel}.`,
      lobText: `Richtig! ${tier.label} wohnt in der ${ziel.titel}.`,
    });
    if (r !== 'richtig') setFehler((f) => f + 1);
    if (r !== 'tipp') {
      setBewohner((b) => ({ ...b, [ziel.id]: [...(b[ziel.id] ?? []), tier.bild] }));
      setTimeout(() => {
        if (i + 1 >= tiere.length) {
          if (fehler === 0 && r === 'richtig') api.zaehle('liftFehlerfrei');
          api.finish(v.ergebnis());
        } else {
          setI(i + 1);
          setEtage(null);
        }
      }, 900);
    }
  }

  return (
    <div className="lift-game">
      <div className="lift-schacht">
        {oben.map((s) => {
          const nr = config.stockwerke.indexOf(s);
          return (
            <div key={s.id} className={`etage etage-${s.id} ${etage === nr ? 'hier' : ''}`}>
              <span className="etage-nr">{nr + 1}</span>
              <span className="etage-name">{s.titel}</span>
              <span className="etage-tiere">
                {(bewohner[s.id] ?? []).map((b, k) => (
                  <Img key={k} id={b} size={40} />
                ))}
              </span>
              {etage === nr && tier && <Img id={tier.bild} className="lift-tier" />}
            </div>
          );
        })}
      </div>
      <div className="lift-steuer">
        {tier && (
          <>
            <Frage text={`In welches Stockwerk gehört: ${tier.label}?`} />
            <Img id={tier.bild} className="lift-gast" />
            <div className="lift-knoepfe">
              {oben.map((s) => {
                const nr = config.stockwerke.indexOf(s);
                return (
                  <button key={s.id} type="button" className="knopf lift-knopf" onClick={() => fahre(nr)}>
                    {nr + 1} · {s.titel}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
