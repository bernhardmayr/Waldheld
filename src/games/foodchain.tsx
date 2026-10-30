import { useEffect, useMemo, useState } from 'react';
import { Img } from '../assets/Img';
import type { FoodWebConfig } from '../content/types';
import { shuffle } from '../engine/rng';
import { Frage } from '../components/ui';
import { useDrag } from '../components/drag';
import { WeiterKnopf, useVersuche, type GameProps } from './common';

const NAMEN: Record<string, string> = {
  nuss: 'Nuss',
  maus: 'Maus',
  eule: 'Eule',
  gras: 'Gras',
  schnecke: 'Schnecke',
  fuchs: 'Fuchs',
  'eiche-frucht': 'Eichel',
  eichhoernchen: 'Eichhörnchen',
  habicht: 'Habicht',
  marder: 'Marder',
  koerner: 'Körner',
  'buche-blatt': 'Blatt',
  raupe: 'Raupe',
};
const ALLE = Object.keys(NAMEN);

const POS: Record<string, [number, number]> = {
  blatt: [12, 55],
  raupe: [38, 22],
  regenwurm: [38, 85],
  maus: [62, 52],
  eule: [88, 20],
  pilz: [88, 84],
};

function KettenKarte({
  id,
  aktiv,
  onTap,
  onDrop,
}: {
  id: string;
  aktiv: boolean;
  onTap: () => void;
  onDrop: (z: string) => void;
}) {
  const drag = useDrag(onDrop, onTap);
  return (
    <button type="button" className={`zieh-karte ${aktiv ? 'aktiv' : ''}`} aria-pressed={aktiv} {...drag}>
      <Img id={id} size={64} />
      <span>{NAMEN[id]}</span>
    </button>
  );
}

/** G10 Nahrungskette und Nahrungsnetz (mit beiden Pfeilarten). */
export function FoodChainGame({ config, api }: GameProps<FoodWebConfig>) {
  const v = useVersuche(api);
  const [phase, setPhase] = useState<'kette' | 'netz' | 'fertig'>('kette');
  const [k, setK] = useState(0);
  const [slots, setSlots] = useState<string[]>([]);
  const [wahl, setWahl] = useState<string | null>(null);
  const [kettenFehler, setKettenFehler] = useState(false);

  const kette = config.ketten[k];
  const karten = useMemo(
    () =>
      shuffle([
        ...kette,
        ...shuffle(ALLE.filter((x) => !kette.includes(x) && x !== 'buche-blatt' && x !== 'raupe')).slice(
          0,
          2,
        ),
      ]),
    [k],
  );

  // Netz
  const [kanten, setKanten] = useState<{ von: string; zu: string; art: 'gefressen' | 'energie' }[]>([]);
  const [start, setStart] = useState<string | null>(null);
  const [frage, setFrage] = useState<{ von: string; zu: string } | null>(null);
  const [netzFehler, setNetzFehler] = useState(0);

  useEffect(() => {
    api.setTipp(
      phase === 'kette'
        ? 'Am Anfang steht immer eine Pflanze. Der Pfeil heißt „wird gefressen von“.'
        : 'Tippe erst auf ein Lebewesen, dann auf das zweite. Der Pfeil zeigt vom Gefressenen zum Fresser – oder als „Energie geht an“ zum Pilz.',
    );
  }, [phase]);
  useEffect(() => {
    if (phase === 'kette') api.fortschritt(k, config.ketten.length + 1);
    if (phase === 'netz') api.fortschritt(config.ketten.length, config.ketten.length + 1);
  }, [k, phase]);

  function lege(id: string, slot: number) {
    if (slot !== slots.length) return;
    const soll = kette[slot];
    const r = v.pruefe(id === soll, {
      id: `kette-${kette.join('-')}-${slot}`,
      factIds: ['m10-pfeil'],
      ohneLeitner: true,
      antwort: id,
      tipp:
        slot === 0
          ? 'Am Anfang steht, was nicht selbst frisst: eine Pflanze oder Frucht.'
          : `Wer frisst ${NAMEN[kette[slot - 1]]}?`,
      loesung: `Hier kommt ${NAMEN[soll]} hin.`,
    });
    if (r !== 'richtig') setKettenFehler(true);
    if (r !== 'tipp') setSlots([...slots, soll]);
    setWahl(null);
  }

  useEffect(() => {
    if (phase !== 'kette' || slots.length !== kette.length) return;
    if (!kettenFehler) api.zaehle('ketten');
    api.sag(`${kette.map((x) => NAMEN[x]).join(' → ')}. Prima Kette!`, 'richtig');
  }, [slots.length]);

  function naechsteKette() {
    if (k + 1 >= config.ketten.length) setPhase('netz');
    else {
      setK(k + 1);
      setSlots([]);
      setKettenFehler(false);
    }
  }

  function tippeKnoten(id: string) {
    if (!start) return setStart(id);
    if (start === id) return setStart(null);
    setFrage({ von: start, zu: id });
    setStart(null);
  }

  function waehleArt(art: 'gefressen' | 'energie') {
    if (!frage) return;
    const { von, zu } = frage;
    setFrage(null);
    const soll = config.kanten.find((e) => e.von === von && e.zu === zu);
    const schon = kanten.some((e) => e.von === von && e.zu === zu);
    if (schon) return;
    const name = (id: string) => config.knoten.find((n) => n.id === id)!.label;
    const umgekehrt = config.kanten.some((e) => e.von === zu && e.zu === von);
    const ok = !!soll && soll.art === art;
    const id = `netz-${von}-${zu}`;
    if (ok) {
      v.pruefe(true, {
        id,
        factIds: [art === 'energie' ? 'm10-energie' : 'm10-pfeil'],
        ohneLeitner: true,
        tipp: '',
        loesung: '',
      });
      setKanten([...kanten, { von, zu, art }]);
    } else {
      setNetzFehler((n) => n + 1);
      if (soll) {
        const msg = `Die Richtung stimmt! Aber die Pfeilart ist hier „${soll.art === 'gefressen' ? 'wird gefressen von' : 'Energie geht an'}“.`;
        const t = { id, factIds: ['m10-energie'], ohneLeitner: true, tipp: msg, loesung: msg };
        v.pruefe(false, t);
        v.pruefe(false, t);
        setKanten([...kanten, soll]);
      } else {
        api.sag(
          umgekehrt
            ? `Andersherum! ${name(zu)} → ${name(von)}.`
            : `Zwischen ${name(von)} und ${name(zu)} gibt es im Heft-Netz keinen Pfeil.`,
          'tipp',
        );
      }
    }
  }

  useEffect(() => {
    if (phase === 'netz' && kanten.length === config.kanten.length) {
      if (netzFehler === 0) api.zaehle('netz');
      api.sag(
        'Das Nahrungsnetz ist fertig! Der Pilz gibt Nährstoffe an den Boden zurück, neue Blätter wachsen.',
        'richtig',
      );
      setTimeout(() => api.finish(v.ergebnis()), 1500);
    }
  }, [kanten.length]);

  if (phase === 'kette')
    return (
      <div className="kette-game">
        <Frage text="Baue die Nahrungskette. Der Pfeil heißt „wird gefressen von“." autoRead={k === 0} />
        <div className="kette-slots">
          {kette.map((_, i) => (
            <div key={i} className="kette-slot-wrap">
              <div
                className={`slot ${i === slots.length ? 'naechster' : ''}`}
                data-drop={String(i)}
                onClick={() => wahl && lege(wahl, i)}
              >
                {slots[i] ? (
                  <>
                    <Img id={slots[i]} size={72} />
                    <span>{NAMEN[slots[i]]}</span>
                  </>
                ) : (
                  <span className="slot-leer">?</span>
                )}
              </div>
              {i < kette.length - 1 && (
                <span className="pfeil" aria-label="wird gefressen von">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
        {slots.length < kette.length ? (
          <div className="stapel">
            {karten
              .filter((c) => !slots.includes(c))
              .map((c) => (
                <KettenKarte
                  key={c}
                  id={c}
                  aktiv={wahl === c}
                  onTap={() => setWahl(wahl === c ? null : c)}
                  onDrop={(z) => lege(c, Number(z))}
                />
              ))}
          </div>
        ) : (
          <WeiterKnopf
            onClick={naechsteKette}
            text={k + 1 >= config.ketten.length ? 'Zum Nahrungsnetz' : 'Nächste Kette'}
          />
        )}
      </div>
    );

  return (
    <div className="netz-game">
      <Frage
        text="Lege das Nahrungsnetz aus dem Heft. Tippe zwei Lebewesen an und wähle die Pfeilart."
        autoRead={false}
      />
      <p className="hinweis">
        Gefunden: {kanten.length} von {config.kanten.length} Pfeilen ·{' '}
        <span className="legende gefressen">→ wird gefressen von</span> ·{' '}
        <span className="legende energie">⇢ Energie geht an</span>
      </p>
      <div className="netz-flaeche">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="netz-linien" aria-hidden="true">
          <defs>
            <marker
              id="spitze"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10Z" fill="#2B2B2B" />
            </marker>
            <marker
              id="spitze-e"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10Z" fill="#B07A10" />
            </marker>
          </defs>
          {kanten.map((e) => {
            const [x1, y1] = POS[e.von];
            const [x2, y2] = POS[e.zu];
            const t = 0.78;
            return (
              <line
                key={`${e.von}-${e.zu}`}
                x1={x1 + (x2 - x1) * 0.18}
                y1={y1 + (y2 - y1) * 0.18}
                x2={x1 + (x2 - x1) * t}
                y2={y1 + (y2 - y1) * t}
                stroke={e.art === 'energie' ? '#B07A10' : '#2B2B2B'}
                strokeWidth="0.8"
                strokeDasharray={e.art === 'energie' ? '2 1.5' : undefined}
                markerEnd={`url(#${e.art === 'energie' ? 'spitze-e' : 'spitze'})`}
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: 3 }}
              />
            );
          })}
        </svg>
        {config.knoten.map((n) => (
          <button
            key={n.id}
            type="button"
            className={`netz-knoten ${start === n.id ? 'aktiv' : ''}`}
            style={{ left: `${POS[n.id][0]}%`, top: `${POS[n.id][1]}%` }}
            onClick={() => tippeKnoten(n.id)}
          >
            <Img id={n.bild} size={64} />
            <span>{n.label}</span>
          </button>
        ))}
      </div>
      {frage && (
        <div className="art-wahl" role="dialog" aria-label="Pfeilart wählen">
          <p>
            {config.knoten.find((n) => n.id === frage.von)!.label} →{' '}
            {config.knoten.find((n) => n.id === frage.zu)!.label}
          </p>
          <button type="button" className="knopf" onClick={() => waehleArt('gefressen')}>
            → wird gefressen von
          </button>
          <button type="button" className="knopf energie" onClick={() => waehleArt('energie')}>
            ⇢ Energie geht an
          </button>
          <button type="button" className="knopf leise" onClick={() => setFrage(null)}>
            Abbrechen
          </button>
        </div>
      )}
    </div>
  );
}
