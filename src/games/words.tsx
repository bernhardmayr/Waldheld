import { useEffect, useMemo, useRef, useState } from 'react';
import { Img } from '../assets/Img';
import type { CrosswordConfig, ScrambleConfig, WordsearchConfig } from '../content/types';
import { wortBild } from '../content/words';
import { generateCrossword } from '../engine/generators/crossword';
import { generateWordsearch } from '../engine/generators/wordsearch';
import { createRng, shuffle } from '../engine/rng';
import { sound } from '../lib/sound';
import { sprich } from '../lib/tts';
import { useSettings } from '../store/settings';
import { useProgress } from '../store/progress';
import { SpeakButton, Tastatur } from '../components/ui';
import { WeiterKnopf, lob, useVersuche, type GameProps } from './common';

/** G13 Suchsel: deterministisch per Seed, Stufe aus den Einstellungen. */
export function WordsearchGame({ config, api }: GameProps<WordsearchConfig>) {
  const stufe = useSettings((s) => s.suchselStufe);
  const woerter = useMemo(
    () => (stufe === 1 ? shuffle(config.liste, createRng(config.seed + api.seed)).slice(0, 9) : config.liste),
    [stufe],
  );
  const raetsel = useMemo(() => generateWordsearch(woerter, stufe, config.seed + api.seed), [woerter]);
  const [gefunden, setGefunden] = useState<string[]>([]);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [hover, setHover] = useState<[number, number] | null>(null);
  const [tipp, setTipp] = useState<string | null>(null);
  const tippZaehler = useRef(0);
  const neueGeste = useRef(false);

  useEffect(
    () =>
      api.setTipp(
        'Tippe auf den ersten und dann auf den letzten Buchstaben eines Wortes. Oder ziehe mit dem Finger darüber.',
      ),
    [],
  );
  useEffect(() => {
    api.fortschritt(gefunden.length, raetsel.placed.length);
    if (gefunden.length === raetsel.placed.length) {
      api.zaehle('suchsel');
      setTimeout(
        () =>
          api.finish({
            richtig: raetsel.placed.length - tippZaehler.current * 0.5,
            gesamt: raetsel.placed.length,
            versuche: 0,
            fehler: [],
          }),
        800,
      );
    }
  }, [gefunden.length]);

  function linie(a: [number, number], b: [number, number]): [number, number][] | null {
    const dr = Math.sign(b[0] - a[0]);
    const dc = Math.sign(b[1] - a[1]);
    const len = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
    if (!(a[0] === b[0] || a[1] === b[1] || Math.abs(b[0] - a[0]) === Math.abs(b[1] - a[1]))) return null;
    return Array.from({ length: len + 1 }, (_, i) => [a[0] + dr * i, a[1] + dc * i]);
  }

  function pruefe(a: [number, number], b: [number, number]) {
    const cells = linie(a, b);
    if (!cells) return;
    const key = cells.map((c) => c.join(',')).join('|');
    const keyR = [...cells]
      .reverse()
      .map((c) => c.join(','))
      .join('|');
    const p = raetsel.placed.find((x) => {
      const k = x.cells.map((c) => c.join(',')).join('|');
      return k === key || k === keyR;
    });
    if (p && !gefunden.includes(p.wort)) {
      setGefunden([...gefunden, p.wort]);
      sound.richtig();
      api.task({ id: `suchsel-${p.wort}`, factIds: ['m11-woerter'], versuch: 1, ohneLeitner: true });
      api.sag(`${lob()} ${p.wort}`, 'richtig');
    } else if (cells.length > 1) {
      sound.falsch();
    }
  }

  const markiert = new Set(
    raetsel.placed.filter((p) => gefunden.includes(p.wort)).flatMap((p) => p.cells.map((c) => c.join(','))),
  );
  const vorschau = new Set(start && hover ? (linie(start, hover) ?? []).map((c) => c.join(',')) : []);

  function zelleAus(e: React.PointerEvent): [number, number] | null {
    const t = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const d = t?.closest('[data-rc]') as HTMLElement | null;
    if (!d) return null;
    const [r, c] = d.dataset.rc!.split(',').map(Number);
    return [r, c];
  }

  return (
    <div className="suchsel-game">
      <div
        className="suchsel"
        style={{ gridTemplateColumns: `repeat(${raetsel.size}, 1fr)`, touchAction: 'none' }}
        onPointerDown={(e) => {
          const z = zelleAus(e);
          if (!z) return;
          neueGeste.current = !start;
          if (!start) setStart(z);
          setHover(z);
        }}
        onPointerMove={(e) => {
          if (e.buttons || e.pointerType === 'touch') {
            const z = zelleAus(e);
            if (z) setHover(z);
          }
        }}
        onPointerUp={(e) => {
          const z = zelleAus(e);
          if (start && z && (z[0] !== start[0] || z[1] !== start[1])) {
            pruefe(start, z);
            setStart(null);
          } else if (start && z && !neueGeste.current) setStart(null);
          setHover(null);
        }}
      >
        {raetsel.grid.map((reihe, r) =>
          reihe.map((ch, c) => (
            <button
              type="button"
              key={`${r}-${c}`}
              data-rc={`${r},${c}`}
              className={`suchsel-zelle ${markiert.has(`${r},${c}`) ? 'gefunden' : ''} ${start && start[0] === r && start[1] === c ? 'start' : ''} ${vorschau.has(`${r},${c}`) ? 'vorschau' : ''} ${tipp && raetsel.placed.find((p) => p.wort === tipp)?.cells[0].join(',') === `${r},${c}` ? 'tipp' : ''}`}
            >
              {ch}
            </button>
          )),
        )}
      </div>
      <div className="suchsel-liste">
        <h3>Finde diese Wörter:</h3>
        <ul>
          {raetsel.placed.map((p) => (
            <li key={p.wort} className={gefunden.includes(p.wort) ? 'gefunden' : ''}>
              {wortBild[p.wort] && <Img id={wortBild[p.wort]} size={36} />}
              <span>{p.wort}</span>
              <SpeakButton text={p.wort} klein />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="knopf leise"
          onClick={() => {
            const w = raetsel.placed.find((p) => !gefunden.includes(p.wort));
            if (w) {
              tippZaehler.current++;
              setTipp(w.wort);
              setTimeout(() => setTipp(null), 2500);
            }
          }}
        >
          🔍 Anfangsbuchstabe zeigen
        </button>
      </div>
    </div>
  );
}

/** G14 Buchstabensuppe: Wort aus gemischten Buchstaben legen. */
export function ScrambleGame({ config, api }: GameProps<ScrambleConfig>) {
  const woerter = useMemo(() => shuffle(config.woerter).slice(0, config.anzahl), []);
  const v = useVersuche(api);
  const [i, setI] = useState(0);
  const [gelegt, setGelegt] = useState<number[]>([]);
  const [fix, setFix] = useState(false);
  const [status, setStatus] = useState<'offen' | 'fertig'>('offen');
  const w = woerter[i];
  const kacheln = useMemo(() => {
    let s = shuffle([...w.wort]);
    while (s.join('') === w.wort && w.wort.length > 2) s = shuffle([...w.wort]);
    return s;
  }, [i]);
  const fehlerwort = useProgress((s) => s.fehlerwort);

  useEffect(() => {
    api.fortschritt(i, woerter.length);
    api.setTipp('Sprich das Wort langsam. Welcher Buchstabe kommt zuerst? Nomen beginnen groß!');
    setGelegt([]);
    setFix(false);
    setStatus('offen');
  }, [i]);

  const wort = gelegt.map((k) => kacheln[k]).join('');

  function lege(k: number) {
    if (status !== 'offen' || gelegt.includes(k)) return;
    const neu = [...gelegt, k];
    setGelegt(neu);
    if (neu.length === w.wort.length) {
      const ergebnis = neu.map((x) => kacheln[x]).join('');
      const r = v.pruefe(ergebnis === w.wort, {
        id: `suppe-${w.wort}`,
        factIds: ['m11-woerter'],
        ohneLeitner: true,
        antwort: ergebnis,
        tipp: 'Noch nicht ganz. Ich halte den Anfangsbuchstaben für dich fest.',
        loesung: `Das Wort heißt: ${w.wort}`,
      });
      if (r === 'tipp') {
        const erster = kacheln.findIndex((ch) => ch === w.wort[0]);
        setFix(true);
        setGelegt([erster]);
      } else {
        if (r === 'loesung') fehlerwort(w.wort);
        setStatus('fertig');
      }
    }
  }

  return (
    <div className="suppe-game">
      <Img id={w.bild} className="suppe-bild" />
      <button type="button" className="knopf leise" onClick={() => sprich(w.wort)}>
        🔊 Wort anhören
      </button>
      <div className="suppe-wort" aria-live="polite">
        {[...w.wort].map((_, k) => (
          <span key={k} className={`buchstabe-slot ${k === 0 && fix ? 'fix' : ''}`}>
            {status === 'fertig' ? w.wort[k] : (wort[k] ?? '')}
          </span>
        ))}
      </div>
      {status === 'offen' ? (
        <>
          <div className="kacheln">
            {kacheln.map((ch, k) => (
              <button
                key={k}
                type="button"
                className="kachel"
                disabled={gelegt.includes(k)}
                onClick={() => lege(k)}
              >
                {ch}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="knopf leise"
            onClick={() => setGelegt(fix ? gelegt.slice(0, 1) : gelegt.slice(0, -1))}
            disabled={gelegt.length === (fix ? 1 : 0)}
          >
            ⌫ zurück
          </button>
        </>
      ) : (
        <WeiterKnopf onClick={() => (i + 1 >= woerter.length ? api.finish(v.ergebnis()) : setI(i + 1))} />
      )}
    </div>
  );
}

/** G15 Kreuzworträtsel: 8–12 Wörter, Bildschirmtastatur mit Ä, Ö, Ü, ß. */
export function CrosswordGame({ config, api }: GameProps<CrosswordConfig>) {
  const kw = useMemo(() => {
    const rnd = createRng(config.seed + api.seed);
    const auswahl = shuffle(config.woerter, rnd).slice(0, 12);
    return generateCrossword(auswahl, config.seed + api.seed);
  }, []);
  const [eingabe, setEingabe] = useState<Record<string, string>>({});
  const [aktiv, setAktiv] = useState<{ nr: number; dir: 'h' | 'v' } | null>(null);
  const [pos, setPos] = useState(0);
  const [gross, setGross] = useState(true);
  const [geloest, setGeloest] = useState<number[]>([]);
  const [tipps, setTipps] = useState(0);
  const entry = aktiv ? kw.entries.find((e) => e.nr === aktiv.nr && e.dir === aktiv.dir)! : null;

  useEffect(
    () =>
      api.setTipp('Tippe auf eine Nummer im Rätsel oder auf einen Hinweis. Dann schreibe mit der Tastatur.'),
    [],
  );
  useEffect(() => {
    api.fortschritt(geloest.length, kw.entries.length);
    if (geloest.length === kw.entries.length) {
      if (tipps === 0) api.zaehle('kreuzOhneTipp');
      setTimeout(
        () =>
          api.finish({
            richtig: kw.entries.length - tipps * 0.5,
            gesamt: kw.entries.length,
            versuche: 0,
            fehler: [],
          }),
        900,
      );
    }
  }, [geloest.length]);

  const zelle = (e: (typeof kw.entries)[number], i: number) =>
    `${e.row + (e.dir === 'v' ? i : 0)},${e.col + (e.dir === 'h' ? i : 0)}`;

  function pruefeWoerter(neu: Record<string, string>) {
    const neuGeloest = kw.entries
      .map((e, idx) => ({ e, idx }))
      .filter(({ e }) =>
        [...e.wort.toUpperCase()].every((ch, i) => (neu[zelle(e, i)] ?? '').toUpperCase() === ch),
      )
      .map(({ idx }) => idx);
    const frisch = neuGeloest.filter((x) => !geloest.includes(x));
    frisch.forEach((x) => {
      const e = kw.entries[x];
      api.task({ id: `kreuz-${e.wort}`, factIds: ['m11-woerter'], versuch: 1, ohneLeitner: true });
      api.sag(`${lob()} ${e.wort}`, 'richtig');
    });
    if (frisch.length) setGeloest(neuGeloest);
  }

  function taste(k: string) {
    if (!entry) return;
    const neu = { ...eingabe };
    if (k === '⌫') {
      const p = Math.max(0, eingabe[zelle(entry, pos)] ? pos : pos - 1);
      delete neu[zelle(entry, p)];
      setPos(p);
    } else if (k.length === 1 && k !== ' ' && k !== '-') {
      neu[zelle(entry, pos)] = k.toUpperCase();
      setPos(Math.min(entry.wort.length - 1, pos + 1));
      if (gross) setGross(false);
    }
    setEingabe(neu);
    pruefeWoerter(neu);
  }

  function zeigeBuchstabe() {
    if (!entry) return;
    setTipps((t) => t + 1);
    const i = [...entry.wort].findIndex(
      (_, k) => (eingabe[zelle(entry, k)] ?? '') !== entry.wort[k].toUpperCase(),
    );
    if (i >= 0) {
      const neu = { ...eingabe, [zelle(entry, i)]: entry.wort[i].toUpperCase() };
      setEingabe(neu);
      pruefeWoerter(neu);
    }
  }

  const aktiveZellen = new Set(entry ? [...entry.wort].map((_, i) => zelle(entry, i)) : []);
  const nummern = new Map(kw.entries.map((e) => [`${e.row},${e.col}`, e.nr]));

  return (
    <div className="kreuz-game">
      <div className="kreuz-links">
        <div className="kreuz-gitter" style={{ gridTemplateColumns: `repeat(${kw.cols}, 1fr)` }}>
          {kw.cells.map((reihe, r) =>
            reihe.map((ch, c) => {
              const k = `${r},${c}`;
              if (!ch) return <div key={k} className="kreuz-leer" />;
              return (
                <button
                  key={k}
                  type="button"
                  className={`kreuz-zelle ${aktiveZellen.has(k) ? 'aktiv' : ''} ${entry && zelle(entry, pos) === k ? 'cursor' : ''}`}
                  onClick={() => {
                    const e =
                      kw.entries.find(
                        (x) => [...x.wort].some((_, i) => zelle(x, i) === k) && (!entry || x !== entry),
                      ) ?? kw.entries.find((x) => [...x.wort].some((_, i) => zelle(x, i) === k));
                    if (e) {
                      setAktiv({ nr: e.nr, dir: e.dir });
                      setPos([...e.wort].findIndex((_, i) => zelle(e, i) === k));
                      setGross(true);
                    }
                  }}
                >
                  {nummern.has(k) && <span className="kreuz-nr">{nummern.get(k)}</span>}
                  {eingabe[k] ?? ''}
                </button>
              );
            }),
          )}
        </div>
        {entry && <Tastatur gross={gross} setGross={setGross} onKey={taste} />}
      </div>
      <div className="kreuz-hinweise">
        {(['h', 'v'] as const).map((dir) => (
          <div key={dir}>
            <h3>{dir === 'h' ? 'Waagerecht →' : 'Senkrecht ↓'}</h3>
            <ul>
              {kw.entries
                .filter((e) => e.dir === dir)
                .sort((a, b) => a.nr - b.nr)
                .map((e) => (
                  <li
                    key={e.nr + dir}
                    className={`${entry === e ? 'aktiv' : ''} ${geloest.includes(kw.entries.indexOf(e)) ? 'gefunden' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAktiv({ nr: e.nr, dir: e.dir });
                        setPos(0);
                        setGross(true);
                      }}
                    >
                      <strong>{e.nr}</strong> {e.bild && <Img id={e.bild} size={32} />} {e.hinweis} (
                      {e.wort.length})
                    </button>
                    <SpeakButton text={e.hinweis} klein />
                  </li>
                ))}
            </ul>
          </div>
        ))}
        {entry && (
          <button type="button" className="knopf leise" onClick={zeigeBuchstabe}>
            🔍 Buchstaben zeigen
          </button>
        )}
      </div>
    </div>
  );
}
