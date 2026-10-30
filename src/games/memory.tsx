import { useEffect, useMemo, useState } from 'react';
import type { MemoryConfig } from '../content/types';
import { shuffle } from '../engine/rng';
import { sterneMemory } from '../engine/scoring';
import { sound } from '../lib/sound';
import { sprich } from '../lib/tts';
import { Karte, lob, type GameProps } from './common';

/** G06 Memory: Paare finden, Sterne nach Zügen. */
export function MemoryGame({ config, api }: GameProps<MemoryConfig>) {
  const karten = useMemo(
    () =>
      shuffle(
        config.paare.flatMap((p) => [
          { key: `${p.id}-a`, paar: p.id, ...p.a },
          { key: `${p.id}-b`, paar: p.id, ...p.b },
        ]),
      ),
    [],
  );
  const [offen, setOffen] = useState<string[]>([]);
  const [gefunden, setGefunden] = useState<string[]>([]);
  const [zuege, setZuege] = useState(0);

  useEffect(() => api.setTipp('Merke dir, wo die Karten liegen. Jede Karte hat genau einen Partner.'), []);
  useEffect(() => {
    api.fortschritt(gefunden.length, config.paare.length);
    if (gefunden.length === config.paare.length) {
      const sterne = sterneMemory(zuege, config.paare.length);
      setTimeout(
        () =>
          api.finish({
            richtig: gefunden.length,
            gesamt: config.paare.length,
            versuche: zuege,
            fehler: [],
            sterne,
          }),
        700,
      );
    }
  }, [gefunden.length]);

  function dreh(key: string) {
    if (
      offen.length === 2 ||
      offen.includes(key) ||
      gefunden.includes(karten.find((k) => k.key === key)!.paar)
    )
      return;
    sound.klick();
    const k = karten.find((x) => x.key === key)!;
    if (k.text) sprich(k.text);
    const neu = [...offen, key];
    setOffen(neu);
    if (neu.length === 2) {
      setZuege((z) => z + 1);
      const [a, b] = neu.map((n) => karten.find((x) => x.key === n)!);
      if (a.paar === b.paar) {
        const p = config.paare.find((x) => x.id === a.paar)!;
        api.task({ id: `memory-${p.id}`, factIds: p.factIds, versuch: 1, ohneLeitner: true });
        api.sag(lob(), 'richtig');
        setTimeout(() => {
          setGefunden((g) => [...g, a.paar]);
          setOffen([]);
        }, 500);
      } else setTimeout(() => setOffen([]), 1100);
    }
  }

  const spalten = karten.length > 12 ? 5 : 4;
  return (
    <div className="memory" style={{ gridTemplateColumns: `repeat(${spalten}, 1fr)` }}>
      {karten.map((k) => {
        const sichtbar = offen.includes(k.key) || gefunden.includes(k.paar);
        return (
          <button
            key={k.key}
            type="button"
            className={`memory-karte ${sichtbar ? 'auf' : ''} ${gefunden.includes(k.paar) ? 'gefunden' : ''}`}
            onClick={() => dreh(k.key)}
            aria-label={sichtbar ? (k.text ?? 'Bildkarte') : 'verdeckte Karte'}
          >
            {sichtbar ? <Karte text={k.text} bild={k.bild} /> : <span className="memory-ruecken">🌰</span>}
          </button>
        );
      })}
    </div>
  );
}
