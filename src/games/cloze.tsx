import { useEffect, useMemo, useState } from 'react';
import type { ClozeConfig } from '../content/types';
import { shuffle } from '../engine/rng';
import { useDrag } from '../components/drag';
import { Frage, SpeakButton } from '../components/ui';
import { useVersuche, type GameProps } from './common';

function Wort({
  w,
  aktiv,
  onTap,
  onDrop,
}: {
  w: string;
  aktiv: boolean;
  onTap: () => void;
  onDrop: (z: string) => void;
}) {
  const drag = useDrag(onDrop, onTap);
  return (
    <button
      type="button"
      className={`zieh-karte wort ${aktiv ? 'aktiv' : ''}`}
      aria-pressed={aktiv}
      {...drag}
    >
      {w}
    </button>
  );
}

/** G16 Lückentext: Wörter aus dem Wortspeicher in Lücken. */
export function ClozeGame({ config, api }: GameProps<ClozeConfig>) {
  const luecken = useMemo(
    () =>
      config.saetze.flatMap((s, si) =>
        [...s.text.matchAll(/\[([^\]]+)\]/g)].map((m, li) => ({
          key: `${si}-${li}`,
          wort: m[1],
          factIds: s.factIds,
        })),
      ),
    [],
  );
  const speicher = useMemo(() => shuffle([...luecken.map((l) => l.wort), ...config.ablenker]), []);
  const v = useVersuche(api);
  const [gefuellt, setGefuellt] = useState<Record<string, string>>({});
  const [wahl, setWahl] = useState<string | null>(null);
  const [aktiveLuecke, setAktiveLuecke] = useState<string | null>(null);

  useEffect(() => api.setTipp('Lies den ganzen Satz. Welches Wort passt in die Lücke?'), []);
  useEffect(() => {
    const n = Object.keys(gefuellt).length;
    api.fortschritt(n, luecken.length);
    if (n === luecken.length) setTimeout(() => api.finish(v.ergebnis()), 800);
  }, [gefuellt]);

  function fuelle(wort: string, key: string) {
    const l = luecken.find((x) => x.key === key)!;
    if (gefuellt[key]) return;
    const r = v.pruefe(l.wort === wort, {
      id: `cloze-${config.titel}-${key}`,
      factIds: l.factIds,
      ohneLeitner: true,
      antwort: wort,
      tipp: `„${wort}“ passt hier nicht. Lies den Satz noch einmal.`,
      loesung: `In die Lücke gehört „${l.wort}“.`,
    });
    if (r !== 'tipp') setGefuellt({ ...gefuellt, [key]: l.wort });
    setWahl(null);
    setAktiveLuecke(null);
  }

  const benutzt = Object.values(gefuellt);
  const verfuegbar = speicher.filter((w) => !benutzt.includes(w));

  return (
    <div className="cloze-game">
      <Frage text={`${config.titel}: Fülle die Lücken.`} autoRead={false} />
      <div className="cloze-text">
        {config.saetze.map((s, si) => {
          let li = 0;
          const teile = s.text.split(/(\[[^\]]+\])/g);
          return (
            <p key={si}>
              {teile.map((t, k) => {
                if (!t.startsWith('[')) return <span key={k}>{t}</span>;
                const key = `${si}-${li++}`;
                return (
                  <span
                    key={k}
                    className={`luecke ${gefuellt[key] ? 'gefuellt' : ''} ${aktiveLuecke === key ? 'aktiv' : ''}`}
                    data-drop={key}
                    role="button"
                    tabIndex={0}
                    onClick={() => (wahl ? fuelle(wahl, key) : setAktiveLuecke(key))}
                  >
                    {gefuellt[key] ?? '______'}
                  </span>
                );
              })}
              <SpeakButton text={s.text.replace(/\[[^\]]+\]/g, ' Lücke ')} klein />
            </p>
          );
        })}
      </div>
      <div className="wortspeicher">
        {verfuegbar.map((w, i) => (
          <Wort
            key={`${w}-${i}`}
            w={w}
            aktiv={wahl === w}
            onTap={() => (aktiveLuecke ? fuelle(w, aktiveLuecke) : setWahl(wahl === w ? null : w))}
            onDrop={(z) => fuelle(w, z)}
          />
        ))}
      </div>
    </div>
  );
}
