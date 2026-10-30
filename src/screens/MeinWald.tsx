import { useRef, useState } from 'react';
import { Img } from '../assets/Img';
import { karten } from '../content/cards';
import { Pinsel } from '../components/Pinsel';
import { Eichel, SpeakButton } from '../components/ui';
import { sound } from '../lib/sound';
import { useProgress } from '../store/progress';
import { useRang } from '../app/Layout';

type Jahreszeit = 'fruehling' | 'sommer' | 'herbst' | 'winter';

const DEKO = [
  { id: 'stein', preis: 10 },
  { id: 'baumstumpf', preis: 10 },
  { id: 'pilzkreis', preis: 15 },
  { id: 'bach', preis: 20 },
  { id: 'futterkrippe', preis: 20 },
  { id: 'hochsitz', preis: 20 },
];
const LAUB_JZ: Record<Jahreszeit, string> = {
  fruehling: 'laubbaum-fruehling',
  sommer: 'laubbaum-sommer',
  herbst: 'laubbaum-herbst',
  winter: 'laubbaum-winter',
};

/** Bild eines Baumes je nach Jahreszeit. */
function baumBild(kartenId: string, jz: Jahreszeit): string {
  const k = karten.find((x) => x.id === kartenId)!;
  if (k.id === 'laerche')
    return jz === 'herbst' ? 'laerche-gelb' : jz === 'winter' ? 'laerche-kahl' : 'laerche-baum';
  if (k.waldTyp === 'nadel') return k.bild;
  if (k.id === 'blutbuche') return jz === 'winter' ? 'laubbaum-winter' : k.bild;
  return jz === 'sommer' ? k.bild : LAUB_JZ[jz];
}

/** Mein Wald: Lichtung mit Bäumen, Tieren und Deko aus Eicheln. */
export function MeinWald() {
  const items = useProgress((s) => s.meinWald);
  const eicheln = useProgress((s) => s.eicheln);
  const buch = useProgress((s) => s.waldbuch);
  const ausgeben = useProgress((s) => s.ausgeben);
  const setzen = useProgress((s) => s.waldSetzen);
  const rang = useRang();
  const [jz, setJz] = useState<Jahreszeit>('sommer');
  const [tab, setTab] = useState<'baum' | 'tier' | 'deko'>('baum');
  const [frage, setFrage] = useState<string | null>(null);
  const [antwort, setAntwort] = useState<string | null>(null);
  const flaeche = useRef<HTMLDivElement>(null);
  const zieh = useRef<{ uid: string; dx: number; dy: number } | null>(null);

  const freiBaeume = karten.filter((k) => k.kategorie === 'baum' && k.waldTyp && buch[k.id]?.frei);
  const freiTiere = karten.filter((k) => k.kategorie === 'tier' && buch[k.id]?.frei);

  const baeume = items.filter((i) => i.assetId.startsWith('baum:'));
  const laub = baeume.filter(
    (b) => karten.find((k) => k.id === b.assetId.slice(5))?.waldTyp === 'laub',
  ).length;
  const nadel = baeume.length - laub;
  const waldart = !baeume.length ? null : laub && nadel ? 'Mischwald' : laub ? 'Laubwald' : 'Nadelwald';

  function kaufe(assetId: string, preis: number) {
    if (!ausgeben(preis)) return;
    sound.richtig();
    const vorher = waldart;
    const neu = [
      ...items,
      { uid: `${Date.now()}`, assetId, x: 15 + Math.random() * 70, y: 40 + Math.random() * 45 },
    ];
    setzen(neu);
    if (assetId.startsWith('baum:') && vorher && Math.random() < 0.5) setFrage(vorher);
  }

  function bewege(e: React.PointerEvent) {
    const z = zieh.current;
    const el = flaeche.current;
    if (!z || !el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(2, Math.min(98, ((e.clientX - r.left) / r.width) * 100 - z.dx));
    const y = Math.max(20, Math.min(98, ((e.clientY - r.top) / r.height) * 100 - z.dy));
    setzen(items.map((i) => (i.uid === z.uid ? { ...i, x, y } : i)));
  }

  const neueArt = (() => {
    if (!frage) return null;
    return waldart;
  })();

  return (
    <div className="mein-wald">
      <div className="mw-kopf">
        <h1>🌳 Mein Wald</h1>
        <div className="jz-schalter" role="group" aria-label="Jahreszeit">
          {(['fruehling', 'sommer', 'herbst', 'winter'] as Jahreszeit[]).map((j) => (
            <button key={j} type="button" className={`chip ${jz === j ? 'an' : ''}`} onClick={() => setJz(j)}>
              {{ fruehling: '🌸 Frühling', sommer: '☀️ Sommer', herbst: '🍂 Herbst', winter: '❄️ Winter' }[j]}
            </button>
          ))}
        </div>
        <div className="waldart-anzeige" aria-live="polite">
          {frage
            ? 'Was für ein Wald ist das jetzt?'
            : waldart
              ? `Dein Wald ist ein ${waldart}.`
              : 'Pflanze deinen ersten Baum!'}
        </div>
      </div>
      <div
        className={`lichtung jz-${jz} hg-${rang.i >= 2 ? 'extra' : 'normal'}`}
        ref={flaeche}
        onPointerMove={bewege}
        onPointerUp={() => (zieh.current = null)}
        onPointerLeave={() => (zieh.current = null)}
        style={{ touchAction: 'none' }}
      >
        {[...items]
          .sort((a, b) => a.y - b.y)
          .map((i) => {
            const [art, id] = i.assetId.split(':');
            const bild = art === 'baum' ? baumBild(id, jz) : id;
            const groesse = art === 'baum' ? 22 : art === 'tier' ? 10 : 9;
            return (
              <div
                key={i.uid}
                className="mw-objekt"
                style={{ left: `${i.x}%`, top: `${i.y}%`, width: `${groesse}%`, zIndex: Math.round(i.y) }}
                onPointerDown={(e) => {
                  const r = flaeche.current!.getBoundingClientRect();
                  zieh.current = {
                    uid: i.uid,
                    dx: ((e.clientX - r.left) / r.width) * 100 - i.x,
                    dy: ((e.clientY - r.top) / r.height) * 100 - i.y,
                  };
                  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                }}
                onDoubleClick={() => setzen(items.filter((x) => x.uid !== i.uid))}
              >
                <Img id={bild} />
              </div>
            );
          })}
        <div className="mw-pinsel">
          <Pinsel pose={jz === 'winter' ? 'schlaeft' : 'freut'} size={70} items={rang.items} />
        </div>
      </div>
      {frage && (
        <div className="optionen mw-frage">
          {['Laubwald', 'Nadelwald', 'Mischwald'].map((o) => (
            <button
              key={o}
              type="button"
              className={`option ${antwort && o === neueArt ? 'korrekt' : ''}`}
              onClick={() => {
                setAntwort(o);
                if (o === neueArt) sound.richtig();
                else sound.falsch();
                setTimeout(() => {
                  setFrage(null);
                  setAntwort(null);
                }, 1500);
              }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
      <div className="shop">
        <div className="shop-tabs">
          {(['baum', 'tier', 'deko'] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`chip ${tab === t ? 'an' : ''}`}
              onClick={() => setTab(t)}
            >
              {{ baum: 'Bäume (30)', tier: 'Tiere (50)', deko: 'Deko (10–20)' }[t]}
            </button>
          ))}
          <span className="kontostand">
            <Eichel /> {eicheln}
          </span>
        </div>
        <div className="shop-leiste">
          {tab === 'baum' &&
            (freiBaeume.length ? (
              freiBaeume.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  className="shop-item"
                  disabled={eicheln < 30}
                  onClick={() => kaufe(`baum:${k.id}`, 30)}
                >
                  <Img id={k.bild} size={56} />
                  <span>{k.titel}</span>
                  <small>30 🌰</small>
                </button>
              ))
            ) : (
              <p>Schalte Bäume im Waldbuch frei, dann kannst du sie hier pflanzen.</p>
            ))}
          {tab === 'tier' &&
            (freiTiere.length ? (
              freiTiere.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  className="shop-item"
                  disabled={eicheln < 50}
                  onClick={() => kaufe(`tier:${k.bild}`, 50)}
                >
                  <Img id={k.bild} size={56} />
                  <span>{k.titel}</span>
                  <small>50 🌰</small>
                </button>
              ))
            ) : (
              <p>Schalte Tiere im Waldbuch frei, dann kannst du sie hier ansiedeln.</p>
            ))}
          {tab === 'deko' &&
            DEKO.map((d) => (
              <button
                key={d.id}
                type="button"
                className="shop-item"
                disabled={eicheln < d.preis}
                onClick={() => kaufe(`deko:${d.id}`, d.preis)}
              >
                <Img id={d.id} size={56} />
                <small>{d.preis} 🌰</small>
              </button>
            ))}
        </div>
        <p className="klein">
          Ziehe Dinge mit dem Finger an einen anderen Platz. Doppelt tippen entfernt sie.{' '}
          <SpeakButton text="Ziehe Dinge mit dem Finger an einen anderen Platz." klein />
        </p>
      </div>
    </div>
  );
}
