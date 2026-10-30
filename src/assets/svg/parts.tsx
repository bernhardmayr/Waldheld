/* Baumteile, Waldarten und Waldquerschnitt. */
import type { ReactNode } from 'react';
import { C } from './shapes';
import { treeArt } from './trees';

function SmallLeaf({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) rotate(${r})`}
      d="M0 0 C-4 -3 -4 -8 0 -12 C4 -8 4 -3 0 0Z"
      fill="#4E9A3A"
      stroke={C.dunkel}
      strokeWidth="0.5"
    />
  );
}
function Flower({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={Math.cos((a * Math.PI) / 180) * 2.4}
          cy={Math.sin((a * Math.PI) / 180) * 2.4}
          r="1.9"
          fill="#FADADD"
          stroke="#D88"
          strokeWidth="0.3"
        />
      ))}
      <circle r="1.3" fill={C.gelb} />
    </g>
  );
}
function Fruit({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y - 4} v-2`} stroke={C.rinde} strokeWidth="0.8" />
      <circle cx={x} cy={y} r="3.4" fill="#C0392B" stroke="#7A1A10" strokeWidth="0.5" />
    </g>
  );
}

/** Beschriftbarer Laubbaum (viewBox -40 0 180 100). */
function BaumTeile() {
  return (
    <g>
      <rect x="-40" y="64" width="180" height="36" fill="#9A7A54" />
      <rect x="-40" y="62" width="180" height="3" fill={C.moos} />
      {/* Wurzeln */}
      <path
        d="M50 66 C44 74 34 78 22 92 M50 66 C56 76 68 80 80 94 M50 66 L48 96 M46 70 C40 76 30 74 24 78 M54 70 C60 76 72 72 78 76"
        stroke="#5A3A1A"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Stamm mit Rinde */}
      <path d="M44 66 L46 36 L54 36 L56 66Z" fill={C.rinde} />
      <path d="M48 62 l1 -6 M52 58 l-1 -7 M49 50 l1 -6 M52 46 l0 -6" stroke="#3E2A16" strokeWidth="0.9" />
      {/* Krone (Klammer) */}
      <path
        d="M8 34 C8 4 92 4 92 34 C92 44 8 44 8 34Z"
        fill="#CFE8B5"
        opacity="0.55"
        stroke={C.moos}
        strokeDasharray="2 2"
        strokeWidth="0.8"
      />
      {/* Äste */}
      <path
        d="M48 40 L28 26 M52 38 L72 24 M50 36 L50 16"
        stroke={C.rinde}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* Zweige */}
      <path
        d="M28 26 L18 22 M28 26 L24 14 M72 24 L82 20 M72 24 L76 12 M50 16 L42 8 M50 16 L58 8 M38 33 L32 38"
        stroke={C.rinde}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {[
        [18, 22, -60],
        [24, 14, -20],
        [82, 20, 60],
        [76, 12, 20],
        [42, 8, -30],
        [58, 8, 30],
        [32, 38, -110],
        [14, 26, -90],
        [86, 26, 90],
      ].map(([x, y, r], i) => (
        <SmallLeaf key={i} x={x} y={y} r={r} />
      ))}
      <Flower x={64} y={14} />
      <Flower x={70} y={10} />
      <Flower x={34} y={18} />
      <Fruit x={86} y={32} />
      <Fruit x={80} y={30} />
      <Fruit x={22} y={30} />
    </g>
  );
}

function Wald({ typ }: { typ: 'laub' | 'nadel' | 'misch' }) {
  const laub = ['buche-baum', 'eiche-baum', 'ahorn-baum'];
  const nadel = ['fichte-baum', 'kiefer-baum', 'tanne-baum'];
  const reihe = typ === 'laub' ? laub : typ === 'nadel' ? nadel : ['buche-baum', 'fichte-baum', 'eiche-baum'];
  return (
    <g>
      <rect width="100" height="100" fill={C.himmel} />
      <rect y="78" width="100" height="22" fill={C.moos} />
      {reihe.map((id, i) => (
        <g key={id} transform={`translate(${i * 32 - 4} 14) scale(0.4)`}>
          {treeArt[id]()}
        </g>
      ))}
      {reihe.map((id, i) => (
        <g key={id + 'b'} transform={`translate(${i * 32 + 10} 38) scale(0.48)`}>
          {treeArt[typ === 'misch' ? (i % 2 ? 'kiefer-baum' : 'ahorn-baum') : reihe[(i + 1) % 3]]()}
        </g>
      ))}
    </g>
  );
}

/** Waldquerschnitt mit 5 Stockwerken (viewBox 0 0 100 140). */
export function Querschnitt({ mitTieren = false }: { mitTieren?: boolean }) {
  return (
    <g>
      <rect width="100" height="140" fill={C.himmel} />
      <rect y="112" width="100" height="28" fill="#7A5A3A" />
      <rect y="106" width="100" height="6" fill="#88B456" />
      {/* Wurzeln */}
      <path
        d="M30 108 C26 118 20 124 14 132 M30 108 L32 134 M30 108 C36 120 42 124 46 132 M76 108 C72 120 66 126 62 134 M76 108 C82 120 88 124 94 130"
        stroke="#4A2E16"
        strokeWidth="1.6"
        fill="none"
      />
      {/* Bäume */}
      <path d="M28 108 L29 30 L31 30 L32 108Z" fill={C.rinde} />
      <path d="M74 108 L75 26 L77 26 L78 108Z" fill={C.rinde} />
      <ellipse cx="30" cy="24" rx="26" ry="16" fill="#3E7A35" />
      <path d="M76 4 L60 34 L92 34Z" fill="#245C33" />
      <path d="M76 16 L58 44 L94 44Z" fill="#245C33" />
      {/* Sträucher und junge Bäume */}
      <circle cx="50" cy="80" r="10" fill="#5E9B3E" />
      <circle cx="12" cy="84" r="8" fill="#4E8A35" />
      <path d="M90 104 L90 70" stroke={C.rinde} strokeWidth="1.5" />
      <path d="M90 64 L84 78 L96 78Z" fill="#2F6B3B" />
      {/* Kräuter */}
      {[8, 18, 40, 56, 64, 86].map((x) => (
        <g key={x}>
          <path
            d={`M${x} 106 Q${x - 2} 98 ${x - 3} 94 M${x} 106 Q${x + 2} 98 ${x + 3} 94`}
            stroke="#5A9A3A"
            strokeWidth="1.4"
            fill="none"
          />
          <circle cx={x} cy={96} r="1.6" fill={x % 3 ? '#E8C33A' : '#C77DC0'} />
        </g>
      ))}
      {/* Moos und Pilze */}
      {Array.from({ length: 20 }, (_, i) => (
        <circle key={i} cx={i * 5.2 + 2} cy={107} r="2.5" fill={i % 2 ? '#6E9E43' : '#88B456'} />
      ))}
      <path d="M44 107 v-3 M44 104 a3 2 0 0 1 0 0" stroke="#F4EDE0" strokeWidth="1.2" />
      <path d="M41 104 a3 2.4 0 0 1 6 0Z" fill="#C03A2B" />
      {mitTieren && null}
    </g>
  );
}

export interface ArtEntry {
  render: () => ReactNode;
  viewBox?: string;
}

export const partArt: Record<string, ArtEntry> = {
  'baum-teile': { render: () => <BaumTeile />, viewBox: '-40 0 180 100' },
  'teil-wurzeln': {
    render: () => (
      <g>
        <rect y="30" width="100" height="70" fill="#9A7A54" />
        <rect y="26" width="100" height="5" fill={C.moos} />
        <path d="M44 0 L46 30 L54 30 L56 0Z" fill={C.rinde} />
        <path
          d="M50 30 C40 50 26 60 12 86 M50 30 C60 52 74 62 88 88 M50 30 L48 94 M46 40 C36 50 24 48 14 56 M54 40 C64 50 76 46 86 54"
          stroke="#5A3A1A"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    ),
  },
  'teil-stamm': {
    render: () => (
      <g>
        <path d="M36 98 L40 2 L60 2 L64 98Z" fill={C.rinde} />
        <path
          d="M46 90 l2 -14 M54 70 l-2 -16 M46 46 l2 -14 M54 26 l-1 -16"
          stroke="#3E2A16"
          strokeWidth="2"
        />
      </g>
    ),
  },
  'teil-rinde': {
    render: () => (
      <g>
        <rect x="10" y="10" width="80" height="80" rx="6" fill="#5A3A20" />
        {Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M${16 + i * 11} 12 C${12 + i * 11} 36 ${22 + i * 11} 60 ${16 + i * 11} 88`}
            stroke="#3A2410"
            strokeWidth="3.5"
            fill="none"
          />
        ))}
      </g>
    ),
  },
  'teil-ast': {
    render: () => (
      <g>
        <path d="M0 80 L30 70 L90 30" stroke={C.rinde} strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M30 70 L0 60" stroke={C.rinde} strokeWidth="14" />
      </g>
    ),
  },
  'teil-zweig': {
    render: () => (
      <g>
        <path
          d="M10 80 L50 50 L90 20 M50 50 L70 70 M30 65 L26 40"
          stroke={C.rinde}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <SmallLeaf x={90} y={20} r={50} />
        <SmallLeaf x={70} y={70} r={130} />
        <SmallLeaf x={26} y={40} r={-10} />
      </g>
    ),
  },
  'teil-blatt': { render: () => treeArt['buche-blatt']() },
  'teil-bluete': {
    render: () => (
      <g transform="translate(50 50) scale(7)">
        <Flower x={0} y={0} />
      </g>
    ),
  },
  'teil-frucht': {
    render: () => (
      <g>
        <path d="M50 10 Q54 22 50 32" stroke={C.rinde} strokeWidth="3" fill="none" />
        <circle cx="50" cy="58" r="26" fill="#C0392B" stroke="#7A1A10" strokeWidth="2" />
        <ellipse cx="40" cy="48" rx="6" ry="4" fill="#fff" opacity="0.4" />
      </g>
    ),
  },
  'teil-krone': {
    render: () => (
      <g>
        <path d="M46 98 L47 70 L53 70 L54 98Z" fill={C.rinde} />
        <ellipse cx="50" cy="44" rx="42" ry="32" fill="#4E9A3A" />
        <path d="M50 72 L30 40 M50 70 L70 38 M50 70 L50 24" stroke={C.rinde} strokeWidth="3" opacity="0.6" />
      </g>
    ),
  },
  laubwald: { render: () => <Wald typ="laub" /> },
  nadelwald: { render: () => <Wald typ="nadel" /> },
  mischwald: { render: () => <Wald typ="misch" /> },
  waldquerschnitt: { render: () => <Querschnitt />, viewBox: '0 0 100 140' },
};
