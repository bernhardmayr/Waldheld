import { useEffect, useMemo, useState } from 'react';
import { Img } from '../assets/Img';
import type { GridConfig, LabelConfig } from '../content/types';
import { shuffle } from '../engine/rng';
import { useDrag } from '../components/drag';
import { Frage } from '../components/ui';
import { Karte, useVersuche, type GameProps } from './common';

function Wort({
  text,
  bild,
  aktiv,
  onTap,
  onDrop,
}: {
  text?: string;
  bild?: string;
  aktiv: boolean;
  onTap: () => void;
  onDrop: (z: string) => void;
}) {
  const drag = useDrag(onDrop, onTap);
  return (
    <button type="button" className={`zieh-karte ${aktiv ? 'aktiv' : ''}`} aria-pressed={aktiv} {...drag}>
      <Karte text={text} bild={bild} klein />
    </button>
  );
}

/** G03 Beschriften: Wortkarten auf Hotspots eines Bildes. */
export function LabelGame({ config, api }: GameProps<LabelConfig>) {
  const woerter = useMemo(
    () => shuffle([...config.hotspots.map((h) => h.loesung), ...(config.extra ?? [])]),
    [],
  );
  const v = useVersuche(api);
  const [fertig, setFertig] = useState<Record<string, boolean>>({});
  const [wahl, setWahl] = useState<string | null>(null);
  const breit = config.bild === 'baum-teile';

  useEffect(() => api.setTipp('Tippe ein Wort an und dann das passende Kästchen am Bild.'), []);
  useEffect(() => {
    const n = Object.keys(fertig).length;
    api.fortschritt(n, config.hotspots.length);
    if (n === config.hotspots.length) setTimeout(() => api.finish(v.ergebnis()), 700);
  }, [fertig]);

  function lege(wort: string, hid: string) {
    const h = config.hotspots.find((x) => x.id === hid)!;
    if (fertig[hid]) return;
    const ok = h.loesung === wort;
    const r = v.pruefe(ok, {
      id: `label-${config.bild}-${h.id}`,
      factIds: h.factIds,
      ohneLeitner: true,
      antwort: wort,
      tipp: `„${wort}“ passt hier noch nicht. Schau genau, wohin die Linie zeigt.`,
      loesung: `Hier gehört „${h.loesung}“ hin.`,
    });
    if (r !== 'tipp') setFertig({ ...fertig, [hid]: true });
    setWahl(null);
  }

  const offen = woerter.filter((w) => !config.hotspots.some((h) => h.loesung === w && fertig[h.id]));

  return (
    <div className={`label-game ${breit ? 'breit' : 'hoch'}`}>
      <Frage text="Beschrifte das Bild." autoRead={false} />
      <div className="label-flaeche">
        <div className="label-bild">
          <Img id={config.bild} />
          <svg className="label-linien" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {config.hotspots.map((h) => (
              <g key={h.id}>
                <line
                  x1={h.x}
                  y1={h.y}
                  x2={h.lx}
                  y2={h.ly}
                  stroke="#2B2B2B"
                  strokeWidth="0.4"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx={h.x} cy={h.y} r="0.9" fill="#D9822B" />
              </g>
            ))}
          </svg>
          {config.hotspots.map((h) => (
            <div
              key={h.id}
              className={`label-box ${fertig[h.id] ? 'gefuellt' : ''} ${wahl ? 'bereit' : ''}`}
              style={{ left: `${h.lx}%`, top: `${h.ly}%` }}
              data-drop={h.id}
              role="button"
              tabIndex={0}
              aria-label={fertig[h.id] ? h.loesung : 'leeres Kästchen'}
              onClick={() => wahl && lege(wahl, h.id)}
            >
              {fertig[h.id] ? h.loesung : '?'}
            </div>
          ))}
        </div>
        <div className="stapel label-stapel">
          {offen.map((w) => (
            <Wort
              key={w}
              text={w}
              aktiv={wahl === w}
              onTap={() => setWahl(wahl === w ? null : w)}
              onDrop={(z) => lege(w, z)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** G05 Raster füllen: Tabelle wie auf dem Arbeitsblatt. */
export function GridGame({ config, api }: GameProps<GridConfig>) {
  const karten = useMemo(() => shuffle(config.zellen.map((z, i) => ({ ...z, id: `k${i}` }))), []);
  const v = useVersuche(api);
  const [platz, setPlatz] = useState<Record<string, string>>({});
  const [wahl, setWahl] = useState<string | null>(null);
  const offen = karten.filter((k) => !platz[k.id]);

  useEffect(
    () =>
      api.setTipp(
        'Lege jede Karte in die passende Zeile und Spalte. Schau dir Form, Blatt oder Zapfen genau an.',
      ),
    [],
  );
  useEffect(() => {
    api.fortschritt(karten.length - offen.length, karten.length);
    if (!offen.length) setTimeout(() => api.finish(v.ergebnis()), 700);
  }, [offen.length]);

  function lege(kid: string, zelle: string) {
    const k = karten.find((x) => x.id === kid)!;
    const [z, s] = zelle.split('-').map(Number);
    const r = v.pruefe(k.zeile === z && k.spalte === s, {
      id: `grid-${k.bild ?? k.text}`,
      factIds: k.factIds,
      ohneLeitner: true,
      antwort: zelle,
      tipp: 'Diese Karte passt hier nicht. Prüfe Zeile und Spalte.',
      loesung: `Die Karte gehört zu ${config.zeilen[k.zeile]} – ${config.spalten[k.spalte]}.`,
    });
    if (r !== 'tipp') setPlatz({ ...platz, [kid]: `${k.zeile}-${k.spalte}` });
    setWahl(null);
  }

  return (
    <div className="grid-game">
      <div className="raster" style={{ gridTemplateColumns: `auto repeat(${config.spalten.length}, 1fr)` }}>
        <div />
        {config.spalten.map((s) => (
          <div key={s} className="raster-kopf">
            {s}
          </div>
        ))}
        {config.zeilen.map((z, zi) => (
          <div key={z} style={{ display: 'contents' }}>
            <div className="raster-kopf zeile">{z}</div>
            {config.spalten.map((_, si) => (
              <div
                key={si}
                className={`raster-zelle ${wahl ? 'bereit' : ''}`}
                data-drop={`${zi}-${si}`}
                onClick={() => wahl && lege(wahl, `${zi}-${si}`)}
                role="button"
                tabIndex={0}
                aria-label={`${z}, ${config.spalten[si]}`}
              >
                {karten
                  .filter((k) => platz[k.id] === `${zi}-${si}`)
                  .map((k) => (
                    <Karte key={k.id} text={k.text} bild={k.bild} klein />
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="stapel raster-stapel">
        {offen.slice(0, 6).map((k) => (
          <Wort
            key={k.id}
            text={k.text}
            bild={k.bild}
            aktiv={wahl === k.id}
            onTap={() => setWahl(wahl === k.id ? null : k.id)}
            onDrop={(z) => lege(k.id, z)}
          />
        ))}
        {offen.length > 6 && <span className="noch">+{offen.length - 6}</span>}
      </div>
    </div>
  );
}
