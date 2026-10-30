import { useEffect, useRef, useState } from 'react';
import { Img } from '../assets/Img';
import { scenes } from '../content/scenes';
import type { HiddenConfig, Scene } from '../content/types';
import { useProgress } from '../store/progress';
import { rangIndex } from '../content/ranks';
import { Frage } from '../components/ui';
import { WeiterKnopf, useVersuche, type GameApi, type GameProps } from './common';

const HG: Record<Scene['hintergrund'], { himmel: string; boden: string; extra?: string }> = {
  fruehling: { himmel: '#D7EEF6', boden: '#9CCB5E' },
  sommer: { himmel: '#BFE3F2', boden: '#5E9B3E' },
  herbst: { himmel: '#E9E4D4', boden: '#C9A04A' },
  winter: { himmel: '#E6EEF3', boden: '#FFFFFF' },
  querschnitt: { himmel: '#CDE7F0', boden: '#7A5A3A' },
};

function Hintergrund({ szene }: { szene: Scene }) {
  const W = szene.hoch ? 1600 : 2400;
  const H = szene.hoch ? 2400 : 1600;
  const c = HG[szene.hintergrund];
  if (szene.hoch)
    return (
      <g>
        <rect width={W} height={H} fill={c.himmel} />
        <rect y="800" width={W} height="300" fill="#CFE2B8" opacity="0.6" />
        <rect y="1450" width={W} height="300" fill="#9CCB5E" />
        <rect y="1750" width={W} height="200" fill="#6E9E43" />
        <rect y="1950" width={W} height="450" fill="#7A5A3A" />
        <path
          d="M400 1950 L420 200 L480 200 L500 1950Z M1200 1950 L1215 150 L1265 150 L1280 1950Z"
          fill="#6B4A2B"
        />
        <ellipse cx="450" cy="250" rx="380" ry="240" fill="#3E7A35" opacity="0.85" />
        <path d="M1240 60 L1000 600 L1480 600Z" fill="#245C33" opacity="0.85" />
        <circle cx="800" cy="1300" r="200" fill="#5E9B3E" opacity="0.7" />
        {[
          ['Kronenschicht', 120],
          ['Strauchschicht', 1000],
          ['Krautschicht', 1480],
          ['Moosschicht', 1780],
          ['Wurzelschicht', 2000],
        ].map(([t, y]) => (
          <text
            key={t}
            x="30"
            y={Number(y) + 50}
            fontSize="56"
            fill="#1F4A28"
            opacity="0.55"
            fontWeight="700"
          >
            {t}
          </text>
        ))}
      </g>
    );
  return (
    <g>
      <rect width={W} height={H} fill={c.himmel} />
      <path d={`M0 1000 Q600 900 1200 1000 T2400 980 V${H} H0Z`} fill={c.boden} />
      {szene.hintergrund === 'winter' &&
        Array.from({ length: 60 }, (_, i) => (
          <circle key={i} cx={(i * 397) % W} cy={(i * 251) % 1000} r="8" fill="#fff" opacity="0.9" />
        ))}
      {szene.hintergrund === 'herbst' &&
        Array.from({ length: 30 }, (_, i) => (
          <ellipse
            key={i}
            cx={(i * 397) % W}
            cy={1050 + ((i * 131) % 500)}
            rx="14"
            ry="8"
            fill={i % 2 ? '#D9822B' : '#B83A2E'}
          />
        ))}
    </g>
  );
}

/** Eine Szene mit Pan/Zoom und Trefferflächen (mind. 44 px). */
function SzeneView({
  szene,
  modus,
  api,
  onEnde,
}: {
  szene: Scene;
  modus: 'suchen' | 'fehler';
  api: GameApi;
  onEnde: (ohneTipp: boolean) => void;
}) {
  const v = useVersuche(api);
  const W = szene.hoch ? 1600 : 2400;
  const H = szene.hoch ? 2400 : 1600;
  const extraZoom = rangIndex(useProgress((s) => s.eichelnGesamt)) >= 3;
  const maxZoom = extraZoom ? 4 : 2.5;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const auftraege =
    modus === 'fehler'
      ? szene.fehler.map((f) => ({ ...f, anzahl: f.objektIds.length, reihenfolge: false }))
      : szene.auftraege;
  const [a, setA] = useState(0);
  const [gefunden, setGefunden] = useState<string[]>([]);
  const [fehlTipps, setFehlTipps] = useState(0);
  const [lupe, setLupe] = useState<string | null>(null);
  const [tippBenutzt, setTippBenutzt] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);
  const pinch = useRef<{ d: number; z: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const auftrag = auftraege[a];
  const objekte = szene.objekte.filter((o) => modus === 'fehler' || !o.nurFehler);
  const fertig = auftrag && gefunden.length >= auftrag.anzahl;

  useEffect(() => {
    api.setTipp(null);
    setGefunden([]);
    setFehlTipps(0);
  }, [a]);

  function treffer(id: string) {
    if (!auftrag || fertig || (drag.current?.moved ?? false)) return;
    const passt = auftrag.objektIds.includes(id) && !gefunden.includes(id);
    const inReihe = !auftrag.reihenfolge || auftrag.objektIds[gefunden.length] === id;
    if (passt && inReihe) {
      const neu = [...gefunden, id];
      setGefunden(neu);
      if (neu.length >= auftrag.anzahl) {
        v.pruefe(true, {
          id: `wimmel-${szene.id}-${modus}-${a}`,
          factIds: auftrag.factIds,
          ohneLeitner: true,
          tipp: '',
          loesung: '',
        });
      }
    } else {
      const o = szene.objekte.find((x) => x.id === id);
      api.sag(
        passt
          ? 'Achte auf die Reihenfolge der Kette!'
          : `Das ist ${o?.label ?? 'etwas anderes'}. Such weiter!`,
        'tipp',
      );
      setFehlTipps((f) => f + 1);
    }
  }

  function lupenTipp() {
    const ziel = auftrag.objektIds.find(
      (id) => !gefunden.includes(id) && (!auftrag.reihenfolge || id === auftrag.objektIds[gefunden.length]),
    );
    if (!ziel) return;
    setTippBenutzt(true);
    setLupe(ziel);
    setTimeout(() => setLupe(null), 1800);
  }

  function aufloesen() {
    v.pruefe(false, {
      id: `wimmel-${szene.id}-${modus}-${a}`,
      factIds: auftrag.factIds,
      ohneLeitner: true,
      tipp: '',
      loesung: '',
    });
    v.pruefe(false, {
      id: `wimmel-${szene.id}-${modus}-${a}`,
      factIds: auftrag.factIds,
      ohneLeitner: true,
      tipp: '',
      loesung: 'Hier sind sie!',
    });
    setTippBenutzt(true);
    setGefunden(auftrag.objektIds.slice(0, auftrag.anzahl));
  }

  function weiter() {
    if (a + 1 >= auftraege.length) onEnde(!tippBenutzt);
    else setA(a + 1);
  }

  // Pan & Pinch-Zoom
  function onDown(e: React.PointerEvent) {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [p1, p2] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(p1.x - p2.x, p1.y - p2.y), z: zoom };
    } else drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, moved: false };
  }
  function onMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [p1, p2] = [...pointers.current.values()];
      setZoom(
        Math.min(
          maxZoom,
          Math.max(1, (pinch.current.z * Math.hypot(p1.x - p2.x, p1.y - p2.y)) / pinch.current.d),
        ),
      );
      return;
    }
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) > 8) d.moved = true;
    if (d.moved) setPan(begrenze({ x: d.px + dx, y: d.py + dy }, zoom));
  }
  function onUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    setTimeout(() => (drag.current = null), 0);
  }
  function begrenze(p: { x: number; y: number }, z: number) {
    const el = box.current;
    if (!el) return p;
    const mx = (el.clientWidth * (z - 1)) / 2;
    const my = (el.clientHeight * (z - 1)) / 2;
    return { x: Math.max(-mx, Math.min(mx, p.x)), y: Math.max(-my, Math.min(my, p.y)) };
  }
  function zoome(f: number) {
    const z = Math.min(maxZoom, Math.max(1, zoom * f));
    setZoom(z);
    setPan((p) => begrenze(p, z));
  }

  // Mindest-Trefferfläche: 44 px bei Standard-Zoom
  const pxProEinheit = (box.current?.clientWidth ?? 900) / W;
  const minR = 22 / pxProEinheit;

  return (
    <div className={`wimmel ${szene.hoch ? 'hoch' : ''}`}>
      <div className="wimmel-auftrag">
        {auftrag && <Frage text={auftrag.text} />}
        <p className="zaehler-anzeige">
          Gefunden: {Math.min(gefunden.length, auftrag?.anzahl ?? 0)} / {auftrag?.anzahl}
        </p>
        <div className="wimmel-knoepfe">
          <button type="button" className="knopf rund" onClick={() => zoome(1.4)} aria-label="Hineinzoomen">
            +
          </button>
          <button
            type="button"
            className="knopf rund"
            onClick={() => zoome(1 / 1.4)}
            aria-label="Herauszoomen"
          >
            −
          </button>
          {!fertig && (
            <button type="button" className="knopf leise" onClick={lupenTipp}>
              🔍 Lupen-Tipp
            </button>
          )}
          {!fertig && fehlTipps >= 3 && (
            <button type="button" className="knopf leise" onClick={aufloesen}>
              Zeig es mir
            </button>
          )}
        </div>
        <div className="kompass" aria-hidden="true">
          <div
            style={{
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`,
              left: `${50 - 50 / zoom - (pan.x / ((box.current?.clientWidth ?? 1) * zoom)) * 100}%`,
              top: `${50 - 50 / zoom - (pan.y / ((box.current?.clientHeight ?? 1) * zoom)) * 100}%`,
            }}
          />
        </div>
        {fertig && <WeiterKnopf onClick={weiter} />}
      </div>
      <div
        className="wimmel-box"
        ref={box}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ touchAction: 'none' }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          role="img"
          aria-label={szene.titel}
        >
          <Hintergrund szene={szene} />
          {objekte.map((o) => {
            const r = Math.max(o.s / 2, minR);
            const istGefunden = gefunden.includes(o.id);
            return (
              <g
                key={o.id}
                onClick={() => treffer(o.id)}
                className="wimmel-objekt"
                role="button"
                aria-label={o.label}
              >
                <svg x={o.x - o.s / 2} y={o.y - o.s / 2} width={o.s} height={o.s} overflow="visible">
                  <Img id={o.asset} />
                </svg>
                <circle cx={o.x} cy={o.y} r={r} fill="transparent" />
                {istGefunden && (
                  <circle cx={o.x} cy={o.y} r={r} fill="none" stroke="#F6C33B" strokeWidth="14" />
                )}
                {lupe === o.id && <circle cx={o.x} cy={o.y} r={r * 1.3} className="lupe-glow" />}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/** G07 Wimmelbild: Suchen oder Fehlerbild, eine oder mehrere Szenen. */
export function HiddenGame({ config, api }: GameProps<HiddenConfig>) {
  const [i, setI] = useState(0);
  const [ohneTippAlle, setOhneTippAlle] = useState(true);
  const szene = scenes[config.szenen[i]];

  useEffect(() => api.fortschritt(i, config.szenen.length), [i]);

  function ende(ohneTipp: boolean) {
    const alle = ohneTippAlle && ohneTipp;
    setOhneTippAlle(alle);
    if (i + 1 < config.szenen.length) {
      setI(i + 1);
      return;
    }
    if (alle && config.modus === 'suchen') api.zaehle('adlerauge');
    api.finish(ergebnisRef.current());
  }
  // Ergebnis wird von den Szenen über api.task gesammelt; Quote über alle Aufträge
  const zaehler = useRef({ r: 0, g: 0 });
  const ergebnisRef = useRef(() => ({
    richtig: zaehler.current.r,
    gesamt: zaehler.current.g,
    versuche: 0,
    fehler: [],
  }));
  const innerApi: GameApi = {
    ...api,
    task(e) {
      zaehler.current.g += 1;
      zaehler.current.r += e.versuch === 1 ? 1 : e.versuch === 2 ? 0.5 : 0;
      api.task(e);
    },
  };

  return (
    <div>
      {config.modus === 'fehler' && (
        <p className="hinweis">
          Fehlerbild {i + 1} von {config.szenen.length}: {szene.titel}
        </p>
      )}
      <SzeneView key={szene.id} szene={szene} modus={config.modus} api={innerApi} onEnde={ende} />
    </div>
  );
}

export function WimmelFrei({ szeneId, api }: { szeneId: string; api: GameApi }) {
  return <HiddenGame config={{ kind: 'hidden', szenen: [szeneId], modus: 'suchen' }} api={api} />;
}
