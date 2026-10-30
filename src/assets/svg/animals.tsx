/* Tiere und weitere Motive. Wildschwein- und Reh-Familie eigens gezeichnet (Hauer, Streifen, Gehörn, Flecken). */
import type { ReactNode } from 'react';
import { C, EmojiArt } from './shapes';

function Schwein({ hauer, streifen, klein }: { hauer?: boolean; streifen?: boolean; klein?: boolean }) {
  const fell = streifen ? '#9A6A44' : '#4E3B2E';
  return (
    <g transform={klein ? 'translate(18 22) scale(0.68)' : undefined}>
      <ellipse cx="50" cy="58" rx="32" ry="20" fill={fell} />
      <path d="M22 52 L10 60 L12 70 L24 66Z" fill={fell} />
      <ellipse cx="11" cy="65" rx="4" ry="5" fill="#3A2A20" />
      <path d="M26 42 L22 32 L32 40Z" fill={fell} />
      <circle cx="26" cy="54" r="2" fill="#111" />
      {[30, 44, 58, 70].map((x) => (
        <rect key={x} x={x} y="72" width="6" height="16" rx="2" fill="#2A2018" />
      ))}
      <path d="M82 52 q8 2 6 10" stroke={fell} strokeWidth="2" fill="none" />
      {hauer && (
        <path d="M16 66 q-6 -6 -2 -14" stroke="#F4EFE4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
      {streifen &&
        [44, 50, 56, 62, 68].map((y) => (
          <path key={y} d={`M30 ${y} Q50 ${y - 8} 80 ${y}`} stroke="#E9D9B4" strokeWidth="2.4" fill="none" />
        ))}
      {!streifen && <path d="M30 40 Q50 32 76 42" stroke="#2A1E16" strokeWidth="4" fill="none" />}
    </g>
  );
}

function Reh({ gehoern, flecken, klein }: { gehoern?: boolean; flecken?: boolean; klein?: boolean }) {
  const fell = flecken ? '#C08A4E' : '#A9713E';
  return (
    <g transform={klein ? 'translate(18 26) scale(0.66)' : undefined}>
      <ellipse cx="54" cy="54" rx="26" ry="14" fill={fell} />
      <path d="M30 50 L22 26 L30 24 L38 48Z" fill={fell} />
      <ellipse cx="22" cy="24" rx="10" ry="7" fill={fell} />
      <path d="M14 26 l-4 2" stroke="#222" strokeWidth="3" strokeLinecap="round" />
      <circle cx="21" cy="21" r="1.8" fill="#111" />
      <path d="M26 18 l6 -6 l2 6Z" fill={fell} />
      {[36, 44, 66, 74].map((x) => (
        <rect key={x} x={x} y="62" width="4" height="28" rx="2" fill="#7A4F2A" />
      ))}
      <ellipse cx="80" cy="50" rx="4" ry="5" fill="#fff" />
      {gehoern && (
        <path
          d="M24 16 L22 2 M22 8 l-5 -3 M22 6 l4 -4 M28 16 L30 3 M30 9 l4 -3"
          stroke="#6B4A2B"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {flecken &&
        [
          [44, 48],
          [52, 44],
          [60, 48],
          [68, 46],
          [48, 56],
          [58, 54],
          [66, 56],
          [74, 50],
        ].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" fill="#fff" />)}
    </g>
  );
}

function Eichhoernchen() {
  return (
    <g>
      <path d="M62 86 C96 80 96 30 76 16 C70 30 82 50 64 60Z" fill="#B5542A" />
      <ellipse cx="44" cy="64" rx="18" ry="22" fill="#C2622F" />
      <ellipse cx="42" cy="70" rx="10" ry="14" fill="#FBF3E6" />
      <circle cx="40" cy="36" r="14" fill="#C2622F" />
      <path d="M32 26 L28 8 L36 22Z M44 24 L46 6 L50 24Z" fill="#B5542A" />
      <path d="M28 8 l-2 -4 M46 6 l1 -5" stroke="#6B2A10" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="35" cy="35" r="2.6" fill="#111" />
      <circle cx="27" cy="40" r="1.8" fill="#4A2A1A" />
      <ellipse cx="44" cy="86" rx="10" ry="4" fill="#9C4422" />
    </g>
  );
}

function Maulwurf() {
  return (
    <g>
      <rect x="0" y="62" width="100" height="38" fill="#8A6A44" />
      <ellipse cx="54" cy="56" rx="30" ry="18" fill="#2E2A2A" />
      <path d="M24 56 L12 58 L24 62Z" fill="#E8A0A0" />
      <path d="M30 66 l-10 8 l8 2 l6 -6Z M70 66 l10 8 l-8 2 l-6 -6Z" fill="#E8A0A0" />
      <circle cx="30" cy="52" r="1.2" fill="#666" />
    </g>
  );
}

function Vogel({ farbe, schnabel, kappe }: { farbe: string; schnabel: string; kappe?: string }) {
  return (
    <g>
      <path d="M70 52 L94 44 L90 56Z" fill={farbe} />
      <ellipse cx="54" cy="56" rx="24" ry="16" fill={farbe} />
      <circle cx="34" cy="40" r="12" fill={farbe} />
      {kappe && <path d="M26 34 a10 10 0 0 1 16 -4 l-2 4Z" fill={kappe} />}
      <path d="M22 40 L10 43 L22 46Z" fill={schnabel} />
      <circle cx="30" cy="38" r="2" fill={kappe ? '#111' : '#E8C33A'} />
      <path d="M50 72 l-2 14 M60 72 l2 14" stroke="#8A6A44" strokeWidth="2" />
      <path d="M48 52 Q60 46 72 56" stroke="#000" strokeOpacity="0.25" strokeWidth="2" fill="none" />
    </g>
  );
}

function Marder() {
  return (
    <g>
      <path
        d="M70 58 C86 56 94 46 92 36"
        stroke="#5A3A24"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="52" cy="60" rx="26" ry="11" fill="#6A4428" />
      <circle cx="26" cy="54" r="10" fill="#6A4428" />
      <path d="M22 44 l-2 -6 l6 4Z M30 44 l2 -6 l-6 4Z" fill="#6A4428" />
      <path d="M22 58 Q30 70 40 60" fill="#F2E3B3" />
      <circle cx="22" cy="52" r="1.6" fill="#111" />
      <circle cx="17" cy="56" r="1.6" fill="#111" />
      {[32, 42, 62, 72].map((x) => (
        <rect key={x} x={x} y="66" width="5" height="14" rx="2" fill="#4A2E1A" />
      ))}
    </g>
  );
}

function Kobel() {
  return (
    <g>
      <path d="M0 70 L100 60" stroke={C.rinde} strokeWidth="6" />
      <ellipse cx="50" cy="48" rx="30" ry="24" fill="#8A6A44" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <path
            key={i}
            d={`M${50 + Math.cos(a) * 20} ${48 + Math.sin(a) * 16} l${Math.cos(a + 1) * 14} ${Math.sin(a + 1) * 10}`}
            stroke="#5A3A1A"
            strokeWidth="2"
          />
        );
      })}
      <circle cx="44" cy="52" r="7" fill="#3A2410" />
    </g>
  );
}

function Nuss() {
  return (
    <g>
      <path
        d="M50 18 C26 30 24 78 50 86 C76 78 74 30 50 18Z"
        fill="#B88A50"
        stroke="#6B4A2B"
        strokeWidth="1.5"
      />
      <path d="M34 28 C40 14 60 14 66 28 C58 24 42 24 34 28Z" fill="#7FA650" />
      <path d="M50 30 L50 80" stroke="#6B4A2B" strokeWidth="1" opacity="0.5" />
    </g>
  );
}

function Pilz() {
  return (
    <g>
      <path d="M40 88 L42 54 L58 54 L60 88Z" fill="#F4EDE0" stroke="#C9B9A0" />
      <path d="M14 56 C14 20 86 20 86 56Z" fill="#C03A2B" />
      {[
        [30, 40],
        [50, 32],
        [68, 42],
        [42, 48],
        [60, 50],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#fff" />
      ))}
    </g>
  );
}

function Sonne() {
  return (
    <g>
      <circle cx="50" cy="50" r="20" fill="#F6C33B" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <path
            key={i}
            d={`M${50 + Math.cos(a) * 26} ${50 + Math.sin(a) * 26} L${50 + Math.cos(a) * 40} ${50 + Math.sin(a) * 40}`}
            stroke="#F6C33B"
            strokeWidth="5"
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function Dose() {
  return (
    <g>
      <rect x="32" y="16" width="36" height="70" rx="6" fill="#C9CED3" stroke="#6A7178" strokeWidth="2" />
      <rect x="32" y="36" width="36" height="30" fill="#D24A3A" />
      <ellipse cx="50" cy="18" rx="18" ry="4" fill="#A9AFB5" />
    </g>
  );
}
function Flasche() {
  return (
    <g>
      <path
        d="M44 10 h12 v18 c10 6 12 14 12 24 v32 a6 6 0 0 1 -6 6 h-24 a6 6 0 0 1 -6 -6 v-32 c0 -10 2 -18 12 -24Z"
        fill="#7CBF9A"
        opacity="0.85"
        stroke="#2F6B4B"
        strokeWidth="2"
      />
      <rect x="38" y="52" width="24" height="18" fill="#FBF7EE" />
    </g>
  );
}
function Tuete() {
  return (
    <g>
      <path d="M22 30 h56 l-6 60 h-44Z" fill="#EAF2F8" stroke="#8AA0B0" strokeWidth="2" />
      <path d="M36 30 C36 10 64 10 64 30" stroke="#8AA0B0" strokeWidth="3" fill="none" />
    </g>
  );
}
function Apfelrest() {
  return (
    <g>
      <path
        d="M38 22 C30 22 28 34 36 40 C30 48 30 60 36 66 C28 72 30 84 40 84 h20 C70 84 72 72 64 66 C70 60 70 48 64 40 C72 34 70 22 62 22Z"
        fill="#F7E7B4"
        stroke="#C04A3A"
        strokeWidth="3"
      />
      <path d="M50 22 L52 10" stroke={C.rinde} strokeWidth="2.5" />
      <ellipse cx="48" cy="52" rx="2" ry="3" fill="#4A2A1A" />
      <ellipse cx="54" cy="56" rx="2" ry="3" fill="#4A2A1A" />
    </g>
  );
}
function Pulli() {
  return (
    <g>
      <path
        d="M30 20 L14 30 L10 56 L22 58 L24 44 L26 86 h48 l2 -42 l2 14 l12 -2 l-4 -26 l-16 -10 q-20 10 -40 0Z"
        fill="#6A8CC7"
        stroke="#3A5A8A"
        strokeWidth="2"
      />
      <path d="M40 40 h20 M38 54 h24 M36 70 h28" stroke="#9AB5E0" strokeWidth="3" />
      <circle cx="56" cy="62" r="4" fill="#FBF7EE" stroke="#3A5A8A" />
    </g>
  );
}
function Brotdose() {
  return (
    <g>
      <rect x="14" y="36" width="72" height="44" rx="8" fill="#7FA650" stroke="#2F6B3B" strokeWidth="2" />
      <rect x="10" y="28" width="80" height="14" rx="6" fill="#A8CF6A" stroke="#2F6B3B" strokeWidth="2" />
      <path d="M30 56 q6 -8 14 0 q8 8 14 0" stroke="#FBF7EE" strokeWidth="3" fill="none" />
    </g>
  );
}
function Zeitung() {
  return (
    <g>
      <rect x="16" y="20" width="68" height="62" fill="#F2F0E8" stroke="#888" strokeWidth="2" />
      <rect x="22" y="26" width="56" height="10" fill="#555" />
      {[44, 52, 60, 68].map((y) => (
        <path key={y} d={`M22 ${y} h56`} stroke="#999" strokeWidth="2.5" />
      ))}
    </g>
  );
}
function Erde({ gefroren }: { gefroren?: boolean }) {
  return (
    <g>
      <rect x="0" y="40" width="100" height="60" fill={gefroren ? '#C9DCE6' : '#7A5A3A'} />
      <rect x="0" y="34" width="100" height="10" fill={gefroren ? '#fff' : C.moos} />
      {gefroren
        ? [
            [20, 60],
            [50, 70],
            [78, 58],
            [34, 84],
            [66, 86],
          ].map(([x, y], i) => (
            <path
              key={i}
              d={`M${x - 5} ${y} h10 M${x} ${y - 5} v10 M${x - 3} ${y - 3} l6 6 M${x + 3} ${y - 3} l-6 6`}
              stroke="#5A8AA8"
              strokeWidth="1.5"
            />
          ))
        : [
            [20, 60],
            [50, 70],
            [78, 58],
            [34, 84],
            [66, 86],
          ].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill="#5A3A1A" />)}
    </g>
  );
}

const e = (emoji: string, bg?: string) => () => <EmojiArt e={emoji} bg={bg} />;

export const animalArt: Record<string, () => ReactNode> = {
  keiler: () => <Schwein hauer />,
  bache: () => <Schwein />,
  frischling: () => <Schwein streifen klein />,
  rehbock: () => <Reh gehoern />,
  ricke: () => <Reh />,
  rehkitz: () => <Reh flecken klein />,
  eichhoernchen: () => <Eichhoernchen />,
  kobel: () => <Kobel />,
  maus: e('🐭'),
  eule: e('🦉'),
  fuchs: e('🦊'),
  schnecke: e('🐌'),
  kaninchen: e('🐇'),
  hase: e('🐰'),
  habicht: e('🦅', '#DCE7EE'),
  adler: e('🦅', '#F2E6C9'),
  marder: () => <Marder />,
  katze: e('🐈'),
  regenwurm: e('🪱', '#E9DCC6'),
  maulwurf: () => <Maulwurf />,
  kaefer: e('🪲'),
  ameise: e('🐜'),
  eidechse: e('🦎'),
  amsel: () => <Vogel farbe="#222" schnabel="#F2A900" />,
  specht: () => <Vogel farbe="#3A3A3A" schnabel="#666" kappe="#C8102E" />,
  fledermaus: e('🦇', '#DAD7EA'),
  raupe: e('🐛'),
  // Pflanzen und Nahrung
  moos: () => (
    <g>
      <rect x="0" y="60" width="100" height="40" fill="#7A5A3A" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={8 + i * 6.5} cy={58 + (i % 3) * 2} r="9" fill={i % 2 ? '#6E9E43' : '#88B456'} />
      ))}
    </g>
  ),
  farn: () => (
    <g>
      {[-40, -15, 10, 35].map((a) => (
        <g key={a} transform={`rotate(${a} 50 92)`}>
          <path d="M50 92 Q48 50 50 12" stroke="#3E7A35" strokeWidth="2" fill="none" />
          {Array.from({ length: 10 }, (_, k) => (
            <g key={k}>
              <ellipse cx={44} cy={20 + k * 7} rx={6 - k * 0.2} ry="2.2" fill="#5A9A3A" />
              <ellipse cx={56} cy={20 + k * 7} rx={6 - k * 0.2} ry="2.2" fill="#5A9A3A" />
            </g>
          ))}
        </g>
      ))}
    </g>
  ),
  strauch: () => (
    <g>
      <path d="M40 92 L46 70 M60 92 L54 70 M50 92 L50 66" stroke={C.rinde} strokeWidth="3" />
      {[
        [30, 60],
        [50, 50],
        [70, 60],
        [40, 70],
        [62, 72],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="18" fill={i % 2 ? '#4E8A35' : '#5E9B3E'} />
      ))}
      {[
        [34, 56],
        [58, 48],
        [72, 64],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={C.rot} />
      ))}
    </g>
  ),
  boden: () => <Erde />,
  'boden-gefroren': () => <Erde gefroren />,
  nuss: () => <Nuss />,
  gras: () => (
    <g>
      {Array.from({ length: 14 }, (_, i) => (
        <path
          key={i}
          d={`M${10 + i * 6} 92 Q${12 + i * 6} 50 ${4 + i * 6 + (i % 3) * 6} ${20 + (i % 4) * 8}`}
          stroke={i % 2 ? '#5E9B3E' : '#7FA650'}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </g>
  ),
  koerner: e('🌾', '#F3EBD3'),
  beeren: () => (
    <g>
      <path
        d="M50 10 Q40 30 30 50 M50 10 Q60 30 70 46 M50 10 L50 50"
        stroke="#3E7A35"
        strokeWidth="2"
        fill="none"
      />
      {[
        [30, 56],
        [42, 62],
        [54, 58],
        [68, 52],
        [48, 72],
        [36, 72],
        [60, 70],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8" fill="#B83A2E" stroke="#7A1A10" />
      ))}
    </g>
  ),
  pilz: () => <Pilz />,
  vogelei: () => (
    <g>
      <ellipse cx="50" cy="56" rx="22" ry="30" fill="#CFE6EA" stroke="#7A9AA0" strokeWidth="2" />
      {[
        [42, 44],
        [56, 52],
        [46, 66],
        [58, 72],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#7A6A5A" />
      ))}
    </g>
  ),
  bakterien: () => (
    <g>
      <circle cx="44" cy="44" r="32" fill="#EAF4F6" stroke="#555" strokeWidth="5" />
      <path d="M66 66 L90 90" stroke="#6B4A2B" strokeWidth="9" strokeLinecap="round" />
      {[
        [34, 36],
        [50, 32],
        [40, 52],
        [56, 48],
        [30, 48],
        [48, 60],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="9"
          height="4.5"
          rx="2.2"
          fill={i % 2 ? '#8E6CB8' : '#5AA06A'}
          transform={`rotate(${i * 30} ${x} ${y})`}
        />
      ))}
    </g>
  ),
  sonne: () => <Sonne />,
  sonnenlicht: () => <Sonne />,
  // Blatt-Labor
  'blatt-gruen': () => (
    <g>
      <path d="M50 94 L50 80" stroke={C.rinde} strokeWidth="3" />
      <path
        d="M50 84 C14 74 12 36 50 6 C88 36 86 74 50 84Z"
        fill="#3E8E3A"
        stroke={C.dunkel}
        strokeWidth="2"
      />
      <path d="M50 82 L50 12" stroke={C.dunkel} strokeWidth="1.5" />
    </g>
  ),
  'blatt-gelb': () => (
    <g>
      <path d="M50 94 L50 80" stroke={C.rinde} strokeWidth="3" />
      <path d="M50 84 C14 74 12 36 50 6 C88 36 86 74 50 84Z" fill={C.gelb} stroke="#A07A1A" strokeWidth="2" />
    </g>
  ),
  'blatt-rot': () => (
    <g>
      <path d="M50 94 L50 80" stroke={C.rinde} strokeWidth="3" />
      <path d="M50 84 C14 74 12 36 50 6 C88 36 86 74 50 84Z" fill={C.rot} stroke="#701A10" strokeWidth="2" />
    </g>
  ),
  wasser: () => (
    <path
      d="M50 10 C30 40 24 54 24 64 a26 26 0 0 0 52 0 C76 54 70 40 50 10Z"
      fill="#5AA9D6"
      stroke="#2A6A96"
      strokeWidth="2"
    />
  ),
  co2: () => (
    <g>
      <path
        d="M22 66 a16 16 0 0 1 6 -30 a20 20 0 0 1 38 -4 a16 16 0 0 1 14 34Z"
        fill="#D7DCE0"
        stroke="#8A9399"
        strokeWidth="2"
      />
      <text x="50" y="58" fontSize="18" textAnchor="middle" fill="#3A4148" fontWeight="700">
        CO₂
      </text>
    </g>
  ),
  zucker: () => (
    <g>
      <path d="M30 40 L50 28 L70 40 L70 64 L50 76 L30 64Z" fill="#fff" stroke="#9A9A9A" strokeWidth="2" />
      <path d="M30 40 L50 52 L70 40 M50 52 L50 76" stroke="#BDBDBD" strokeWidth="2" fill="none" />
    </g>
  ),
  sauerstoff: () => (
    <g>
      {[
        [40, 60, 14],
        [62, 40, 10],
        [58, 70, 8],
        [34, 34, 7],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#E3F4FB" stroke="#5AA9D6" strokeWidth="2" />
      ))}
      <text x="40" y="66" fontSize="14" textAnchor="middle" fill="#2A6A96" fontWeight="700">
        O₂
      </text>
    </g>
  ),
  'zweig-speicher': () => (
    <g>
      <path d="M6 60 L94 46" stroke={C.rinde} strokeWidth="8" strokeLinecap="round" />
      <rect
        x="38"
        y="44"
        width="24"
        height="16"
        rx="5"
        fill="#3E8E3A"
        stroke={C.dunkel}
        strokeWidth="2"
        transform="rotate(-9 50 52)"
      />
      <text x="50" y="84" fontSize="10" textAnchor="middle" fill={C.text}>
        Grün-Speicher
      </text>
    </g>
  ),
  // Wald ist wichtig
  holz: e('🪵', '#F1E4CF'),
  erholung: e('🚶', '#E3F0DA'),
  wasserspeicher: e('💧', '#DDEFF8'),
  'saubere-luft': e('🌬️', '#E6F3F7'),
  bodenschutz: () => <Erde />,
  lebensraum: e('🏡', '#E7F0DA'),
  nahrung: () => <Nuss />,
  schutz: () => <Kobel />,
  // Müll
  dose: () => <Dose />,
  glasflasche: () => <Flasche />,
  zeitung: () => <Zeitung />,
  plastiktuete: () => <Tuete />,
  apfelrest: () => <Apfelrest />,
  pulli: () => <Pulli />,
  fabrik: e('🏭', '#E6E6E6'),
  brotdose: () => <Brotdose />,
  recycling: e('♻️', '#E3F0DA'),
  zapfhahn: () => (
    <g>
      <rect x="6" y="0" width="36" height="100" fill={C.rinde} />
      <path d="M42 34 h22 v8 h-22Z" fill="#9AA0A6" />
      <path d="M60 42 v8" stroke="#9AA0A6" strokeWidth="4" />
      <path d="M62 56 l0 6" stroke="#E8C88A" strokeWidth="3" strokeDasharray="2 3" />
      <path d="M48 66 h30 l-4 28 h-22Z" fill="#B0B6BC" stroke="#6A7178" strokeWidth="2" />
    </g>
  ),
  sirup: () => (
    <g>
      <path
        d="M42 8 h16 v14 c12 6 14 16 14 26 v38 a6 6 0 0 1 -6 6 h-32 a6 6 0 0 1 -6 -6 v-38 c0 -10 2 -20 14 -26Z"
        fill="#8A4A1A"
        stroke="#4A2410"
        strokeWidth="2"
      />
      <rect x="34" y="48" width="32" height="24" rx="3" fill="#FBF7EE" />
      <g transform="translate(37 47) scale(0.26)">
        <path d="M50 10 L60 40 L90 40 L64 58 L74 90 L50 70 L26 90 L36 58 L10 40 L40 40Z" fill={C.rot} />
      </g>
    </g>
  ),
  ureinwohner: e('🧑', '#F1E4CF'),
  siedler: e('👨‍🌾', '#F1E4CF'),
  kochtopf: e('🍲', '#F1E4CF'),
  messer: e('🔪', '#F1E4CF'),
  kalender: e('📅', '#F1E4CF'),
  eimer: e('🪣', '#F1E4CF'),
  // Deko für Mein Wald
  stein: () => <ellipse cx="50" cy="66" rx="34" ry="22" fill="#9AA0A6" stroke="#6A7178" strokeWidth="2" />,
  baumstumpf: () => (
    <g>
      <path d="M26 50 v34 h48 v-34Z" fill={C.rinde} />
      <ellipse cx="50" cy="50" rx="24" ry="8" fill="#D9B88A" />
      <ellipse cx="50" cy="50" rx="14" ry="4" fill="none" stroke={C.rinde} />
    </g>
  ),
  bach: () => (
    <path
      d="M0 50 C20 30 40 70 60 50 C80 30 90 60 100 50 L100 70 C90 80 80 50 60 70 C40 90 20 50 0 70Z"
      fill="#7CC0E0"
    />
  ),
  pilzkreis: () => (
    <g>
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <g
            key={i}
            transform={`translate(${50 + Math.cos(a) * 30 - 10} ${56 + Math.sin(a) * 18 - 12}) scale(0.22)`}
          >
            <Pilz />
          </g>
        );
      })}
    </g>
  ),
  futterkrippe: () => (
    <g>
      <path d="M20 40 L50 20 L80 40Z" fill={C.rot} />
      <rect x="26" y="40" width="48" height="28" fill="#C9A86A" stroke={C.rinde} strokeWidth="2" />
      <path d="M32 92 L36 68 M68 92 L64 68" stroke={C.rinde} strokeWidth="4" />
      <path d="M30 52 h40" stroke="#7FA650" strokeWidth="6" />
    </g>
  ),
  hochsitz: () => (
    <g>
      <path d="M30 96 L40 40 M70 96 L60 40 M34 76 h32 M37 58 h26" stroke={C.rinde} strokeWidth="4" />
      <rect x="34" y="22" width="32" height="20" fill="#B0804A" stroke={C.rinde} strokeWidth="2" />
      <path d="M30 22 L50 8 L70 22Z" fill="#6B4A2B" />
    </g>
  ),
  // Waldarten-Szenen werden in scenes zusammengesetzt; hier kleine Symbolbilder
  eichel: () => (
    <g>
      <ellipse cx="50" cy="58" rx="20" ry="28" fill="#B07A3E" stroke={C.rinde} strokeWidth="2" />
      <path d="M28 46 C28 26 72 26 72 46 C72 52 28 52 28 46Z" fill="#6B4A2B" />
      <path d="M50 26 L52 14" stroke={C.rinde} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  stern: () => (
    <path
      d="M50 8 L62 38 L94 40 L68 60 L78 92 L50 74 L22 92 L32 60 L6 40 L38 38Z"
      fill="#F6C33B"
      stroke="#C08A10"
      strokeWidth="2"
    />
  ),
  'stockwerk-haus': e('🏠', '#E7F0DA'),
  knospe: () => (
    <g>
      <path d="M50 96 L50 40" stroke={C.rinde} strokeWidth="4" />
      <path
        d="M50 42 C40 34 42 16 50 8 C58 16 60 34 50 42Z"
        fill="#9CBF5A"
        stroke="#5F8A2E"
        strokeWidth="1.5"
      />
      <path
        d="M50 70 C44 66 44 56 50 52 C56 56 56 66 50 70Z"
        fill="#9CBF5A"
        stroke="#5F8A2E"
        transform="rotate(40 50 70)"
      />
    </g>
  ),
};
