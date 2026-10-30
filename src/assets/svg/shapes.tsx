/* Wiederverwendbare Zeichenbausteine für die SVG-Illustrationen (viewBox 0 0 100 100). */
import type { ReactNode } from 'react';

export const C = {
  wald: '#2F6B3B',
  moos: '#7FA650',
  hell: '#A8CF6A',
  rinde: '#6B4A2B',
  rindeHell: '#8B6A45',
  orange: '#D9822B',
  rot: '#B83A2E',
  gelb: '#E8C33A',
  himmel: '#CDE7F0',
  papier: '#FBF7EE',
  text: '#2B2B2B',
  grau: '#9AA0A6',
  dunkel: '#1F4A28',
};

type P = [number, number];

function polar(cx: number, cy: number, r: number, deg: number): P {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function toPath(pts: P[], closed = true) {
  return (
    pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') + (closed ? 'Z' : '')
  );
}

/** Glatter Pfad durch Punkte (Catmull-Rom → Bézier). */
function smoothPath(pts: P[]) {
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

function teeth(a: P, b: P, n: number, h: number): P[] {
  const out: P[] = [];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const o = i % 2 ? h : 0;
    out.push([a[0] + dx * t + nx * o, a[1] + dy * t + ny * o]);
  }
  return out;
}

export interface PalmOpts {
  lobes: number;
  spread: number;
  R: number;
  sinus: number;
  zaehne?: number;
  zahnTiefe?: number;
  rund?: boolean;
  zipfel?: boolean;
  farbe?: string;
}

/** Handförmig gelapptes Blatt (Ahorn-Arten). */
export function PalmLeaf({
  lobes,
  spread,
  R,
  sinus,
  zaehne = 0,
  zahnTiefe = 2,
  rund,
  zipfel,
  farbe = C.moos,
}: PalmOpts) {
  const cx = 50;
  const cy = 60;
  const angles = Array.from({ length: lobes }, (_, i) => -spread / 2 + (spread * i) / (lobes - 1));
  const pts: P[] = [polar(cx, cy, 6, -spread / 2 - 40)];
  angles.forEach((ang, i) => {
    const r = R * (1 - Math.abs(ang) / (spread * 1.6));
    const tip = polar(cx, cy, r, ang);
    const prevSin =
      i === 0 ? polar(cx, cy, sinus * 0.7, ang - 30) : polar(cx, cy, sinus, (angles[i - 1] + ang) / 2);
    const nextSin =
      i === lobes - 1
        ? polar(cx, cy, sinus * 0.7, ang + 30)
        : polar(cx, cy, sinus, (angles[i + 1] + ang) / 2);
    const left = polar(cx, cy, r * 0.62, ang - 13);
    const right = polar(cx, cy, r * 0.62, ang + 13);
    if (zipfel) {
      const zl = polar(cx, cy, r * 0.78, ang - 24);
      const zr = polar(cx, cy, r * 0.78, ang + 24);
      pts.push(...[prevSin, left, zl, left, tip, right, zr, right]);
    } else if (zaehne) {
      pts.push(
        prevSin,
        ...teeth(prevSin, left, 2, zahnTiefe),
        left,
        ...teeth(left, tip, zaehne, zahnTiefe),
        tip,
        ...teeth(tip, right, zaehne, zahnTiefe),
        right,
      );
    } else {
      pts.push(prevSin, left, tip, right);
    }
    if (i === lobes - 1) pts.push(nextSin);
  });
  pts.push(polar(cx, cy, 6, spread / 2 + 40));
  const d = rund ? smoothPath(pts) : toPath(pts);
  return (
    <g>
      <path d={`M${cx} ${cy} L${cx} 96`} stroke={C.rinde} strokeWidth="2.5" strokeLinecap="round" />
      <path d={d} fill={farbe} stroke={C.dunkel} strokeWidth="1.4" strokeLinejoin="round" />
      {angles.map((a) => {
        const r = R * (1 - Math.abs(a) / (spread * 1.6)) * 0.85;
        const [x, y] = polar(cx, cy, r, a);
        return (
          <path
            key={a}
            d={`M${cx} ${cy} L${x.toFixed(1)} ${y.toFixed(1)}`}
            stroke={C.dunkel}
            strokeWidth="1"
            opacity="0.6"
          />
        );
      })}
    </g>
  );
}

/** Eiförmiges Blatt mit glattem Rand (Buche). */
export function OvalLeaf({ farbe = C.moos, rand = C.dunkel }: { farbe?: string; rand?: string }) {
  return (
    <g>
      <path d="M50 96 L50 82" stroke={C.rinde} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 84 C20 76 18 40 50 8 C82 40 80 76 50 84Z" fill={farbe} stroke={rand} strokeWidth="1.5" />
      <path d="M50 84 L50 12" stroke={rand} strokeWidth="1.2" />
      {[24, 36, 48, 60, 70].map((y) => (
        <g key={y} stroke={rand} strokeWidth="0.9" opacity="0.7">
          <path d={`M50 ${y + 6} L${30 + (y > 60 ? 4 : 0)} ${y}`} />
          <path d={`M50 ${y + 6} L${70 - (y > 60 ? 4 : 0)} ${y}`} />
        </g>
      ))}
    </g>
  );
}

/** Gebuchtetes Blatt (Eiche). */
export function OakLeaf({ farbe = C.moos }: { farbe?: string }) {
  const d =
    'M50 90 C44 88 40 84 42 80 C32 82 28 76 34 70 C24 70 22 62 30 58 C22 54 22 46 30 44 C24 38 28 30 36 32 ' +
    'C34 24 40 18 46 22 C46 14 54 14 54 22 C60 18 66 24 64 32 C72 30 76 38 70 44 C78 46 78 54 70 58 ' +
    'C78 62 76 70 66 70 C72 76 68 82 58 80 C60 84 56 88 50 90Z';
  return (
    <g>
      <path d="M50 97 L50 88" stroke={C.rinde} strokeWidth="2.5" strokeLinecap="round" />
      <path d={d} fill={farbe} stroke={C.dunkel} strokeWidth="1.5" />
      <path d="M50 88 L50 22" stroke={C.dunkel} strokeWidth="1.1" />
    </g>
  );
}

/** Gefingertes Blatt (Kastanie): 7 Einzelblättchen. */
export function ChestnutLeaf({ farbe = C.moos }: { farbe?: string }) {
  const angs = [-105, -70, -35, 0, 35, 70, 105];
  const len = [22, 32, 40, 44, 40, 32, 22];
  return (
    <g>
      <path d="M50 62 L50 97" stroke={C.rinde} strokeWidth="2.5" strokeLinecap="round" />
      {angs.map((a, i) => (
        <g key={a} transform={`rotate(${a} 50 62)`}>
          <path
            d={`M50 62 C44 ${62 - len[i] * 0.4} 43 ${62 - len[i] * 0.8} 50 ${62 - len[i]} C57 ${62 - len[i] * 0.8} 56 ${62 - len[i] * 0.4} 50 62Z`}
            fill={farbe}
            stroke={C.dunkel}
            strokeWidth="1.3"
          />
          <path d={`M50 62 L50 ${62 - len[i] + 3}`} stroke={C.dunkel} strokeWidth="0.8" />
        </g>
      ))}
    </g>
  );
}

export function Trunk({
  x = 50,
  w = 8,
  top = 50,
  bottom = 92,
  farbe = C.rinde,
}: {
  x?: number;
  w?: number;
  top?: number;
  bottom?: number;
  farbe?: string;
}) {
  return (
    <path
      d={`M${x - w / 2} ${bottom} L${x - w / 3} ${top} L${x + w / 3} ${top} L${x + w / 2} ${bottom}Z`}
      fill={farbe}
    />
  );
}

export function Ground() {
  return <ellipse cx="50" cy="93" rx="40" ry="4" fill={C.moos} opacity="0.5" />;
}

/** Krone aus mehreren Kreisen. */
export function Blob({
  cx,
  cy,
  rx,
  ry,
  farbe,
  punkte = 7,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  farbe: string;
  punkte?: number;
}) {
  const circles: ReactNode[] = [];
  for (let i = 0; i < punkte; i++) {
    const a = (i / punkte) * Math.PI * 2;
    circles.push(
      <circle
        key={i}
        cx={cx + Math.cos(a) * rx * 0.55}
        cy={cy + Math.sin(a) * ry * 0.55}
        r={Math.min(rx, ry) * 0.55}
        fill={farbe}
      />,
    );
  }
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx * 0.8} ry={ry * 0.8} fill={farbe} />
      {circles}
    </g>
  );
}

/** Kahle Äste eines Laubbaums. */
export function BareBranches({ farbe = C.rinde }: { farbe?: string }) {
  return (
    <g stroke={farbe} strokeLinecap="round" fill="none">
      <path d="M50 92 L50 45" strokeWidth="8" />
      <path
        d="M50 60 L30 38 L22 26 M30 38 L34 22 M50 55 L70 36 L80 26 M70 36 L66 20 M50 46 L46 22 L40 12 M46 22 L54 10"
        strokeWidth="3.5"
      />
      <path
        d="M22 26 L16 22 M22 26 L20 16 M80 26 L86 20 M80 26 L84 16 M40 12 L36 8 M54 10 L58 5"
        strokeWidth="1.8"
      />
    </g>
  );
}

/** Emoji auf rundem Hintergrund als Platzhalter-Illustration. */
export function EmojiArt({ e, bg = '#E7F0DA' }: { e: string; bg?: string }) {
  return (
    <g>
      <circle cx="50" cy="50" r="46" fill={bg} />
      <text
        x="50"
        y="52"
        fontSize="56"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
      >
        {e}
      </text>
    </g>
  );
}
