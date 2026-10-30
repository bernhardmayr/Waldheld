/* Bäume, Blätter, Nadeln, Zapfen, Blüten und Früchte. Merkmale gemäß SPEC Abschnitt 4. */
import type { ReactNode } from 'react';
import { BareBranches, Blob, C, ChestnutLeaf, Ground, OakLeaf, OvalLeaf, PalmLeaf, Trunk } from './shapes';

const ahornBlatt = (farbe?: string) => (
  <PalmLeaf lobes={5} spread={200} R={44} sinus={18} zaehne={3} zahnTiefe={2.5} farbe={farbe} />
);

export const treeArt: Record<string, () => ReactNode> = {
  // ---------- Blätter ----------
  'ahorn-blatt': () => ahornBlatt(),
  'buche-blatt': () => <OvalLeaf />,
  'eiche-blatt': () => <OakLeaf />,
  'kastanie-blatt': () => <ChestnutLeaf />,
  'bergahorn-blatt': () => <PalmLeaf lobes={5} spread={190} R={42} sinus={22} zaehne={7} zahnTiefe={1.6} />,
  'feldahorn-blatt': () => <PalmLeaf lobes={5} spread={200} R={38} sinus={17} rund farbe="#8DB255" />,
  'spitzahorn-blatt': () => (
    <PalmLeaf lobes={7} spread={230} R={46} sinus={20} zipfel rund={false} farbe="#6E9E43" />
  ),

  // ---------- Blüten ----------
  'ahorn-bluete': () => (
    <g>
      <path d="M50 4 Q52 20 50 30" stroke={C.rinde} strokeWidth="2.5" fill="none" />
      <path
        d="M50 30 Q46 55 44 80 M50 30 Q56 55 58 78 M50 30 Q50 60 51 88"
        stroke="#9BAF3A"
        strokeWidth="1.5"
        fill="none"
      />
      {[
        [44, 40],
        [56, 42],
        [47, 52],
        [55, 56],
        [45, 64],
        [57, 66],
        [51, 72],
        [44, 78],
        [58, 76],
        [51, 86],
        [48, 46],
        [53, 62],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#C9D84A" stroke="#8C9C2A" strokeWidth="0.8" />
      ))}
    </g>
  ),
  'buche-bluete': () => (
    <g>
      <path d="M10 20 Q50 14 90 22" stroke={C.rinde} strokeWidth="3" fill="none" />
      {[25, 50, 75].map((x) => (
        <g key={x}>
          <path d={`M${x} 18 L${x} 52`} stroke="#8C9C2A" strokeWidth="1.5" />
          <circle cx={x} cy="58" r="8" fill="#C7B85A" stroke="#8C7C2A" strokeWidth="1" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle
              key={a}
              cx={x + Math.cos((a * Math.PI) / 180) * 6}
              cy={58 + Math.sin((a * Math.PI) / 180) * 6}
              r="2"
              fill="#E2D37A"
            />
          ))}
        </g>
      ))}
      <path d="M40 22 C30 40 34 60 44 76 C54 60 56 40 40 22Z" fill={C.moos} opacity="0.7" />
    </g>
  ),
  'eiche-bluete': () => (
    <g>
      <path d="M50 96 L50 10" stroke={C.rinde} strokeWidth="3" />
      <g transform="translate(0 6) scale(0.55) translate(40 40)">
        <OakLeaf />
      </g>
      {[30, 70].map((x) => (
        <path
          key={x}
          d={`M50 30 Q${x} 34 ${x} 60`}
          stroke="#B3A55A"
          strokeWidth="2.5"
          strokeDasharray="2 2"
          fill="none"
        />
      ))}
      <circle cx="56" cy="18" r="2" fill="#B3A55A" />
    </g>
  ),
  'kastanie-bluete': () => (
    <g>
      <g transform="translate(0 30) scale(0.7) translate(20 10)">
        <ChestnutLeaf />
      </g>
      <path d="M50 70 L50 50" stroke={C.rinde} strokeWidth="2" />
      <path
        d="M50 6 C38 30 38 46 40 54 L60 54 C62 46 62 30 50 6Z"
        fill="#fff"
        stroke="#C9B9A0"
        strokeWidth="1.2"
      />
      {[
        [46, 22],
        [54, 28],
        [45, 36],
        [55, 42],
        [48, 48],
        [50, 16],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill={i % 2 ? '#F4C2C2' : '#F2E27A'} />
      ))}
    </g>
  ),

  // ---------- Früchte ----------
  'ahorn-frucht': () => (
    <g>
      <path
        d="M50 52 C40 40 22 30 10 34 C14 46 30 54 46 56Z"
        fill="#C9A86A"
        stroke={C.rinde}
        strokeWidth="1.3"
      />
      <path
        d="M50 52 C60 40 78 30 90 34 C86 46 70 54 54 56Z"
        fill="#C9A86A"
        stroke={C.rinde}
        strokeWidth="1.3"
      />
      <ellipse cx="45" cy="56" rx="6" ry="5" fill={C.rindeHell} />
      <ellipse cx="55" cy="56" rx="6" ry="5" fill={C.rindeHell} />
      <path d="M50 52 L50 30" stroke={C.rinde} strokeWidth="1.5" />
    </g>
  ),
  'buche-frucht': () => (
    <g>
      <path
        d="M50 60 L30 30 L44 34Z M50 60 L70 30 L56 34Z M50 60 L50 22"
        stroke="#7A5A30"
        strokeWidth="3"
        fill="#A07A44"
      />
      <g stroke="#6B4A2B" strokeWidth="1.3">
        {Array.from({ length: 18 }, (_, i) => {
          const a = Math.PI * (0.15 + (i / 17) * 0.7);
          return (
            <path
              key={i}
              d={`M${50 + Math.cos(a) * 16} ${70 + Math.sin(a) * 12} l${Math.cos(a) * 6} ${Math.sin(a) * 6}`}
            />
          );
        })}
      </g>
      <path d="M32 70 Q50 96 68 70 Q50 64 32 70Z" fill="#A07A44" stroke="#6B4A2B" strokeWidth="1.3" />
      <path d="M40 66 L46 46 L52 66Z" fill="#7A5230" stroke="#4A321C" />
      <path d="M50 66 L56 44 L62 66Z" fill="#8A6038" stroke="#4A321C" />
    </g>
  ),
  'eiche-frucht': () => (
    <g>
      <path d="M50 20 L50 10" stroke={C.rinde} strokeWidth="3" />
      <ellipse cx="50" cy="58" rx="16" ry="24" fill="#B07A3E" stroke={C.rinde} strokeWidth="1.5" />
      <path
        d="M32 46 C32 30 68 30 68 46 C68 52 32 52 32 46Z"
        fill="#7A5A30"
        stroke="#4A321C"
        strokeWidth="1.5"
      />
      <path d="M36 42 h28 M38 38 h24" stroke="#4A321C" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M50 82 l0 4" stroke={C.rinde} strokeWidth="2" />
    </g>
  ),
  'kastanie-frucht': () => (
    <g>
      <path
        d="M18 60 C18 34 40 26 50 40 C60 26 82 34 82 60 C82 80 18 80 18 60Z"
        fill="#9CBF5A"
        stroke="#5F8A2E"
        strokeWidth="1.5"
      />
      <g stroke="#5F8A2E" strokeWidth="1.5">
        {[
          [20, 50],
          [24, 40],
          [32, 32],
          [70, 32],
          [78, 40],
          [82, 50],
          [22, 70],
          [80, 70],
          [30, 78],
          [70, 78],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} l${(x - 50) / 8} ${(y - 55) / 8}`} />
        ))}
      </g>
      <ellipse cx="50" cy="58" rx="22" ry="18" fill="#7A3F1D" stroke="#4A2410" strokeWidth="1.5" />
      <ellipse cx="50" cy="66" rx="12" ry="6" fill="#D9C4A0" />
      <ellipse cx="43" cy="52" rx="5" ry="3" fill="#fff" opacity="0.5" />
    </g>
  ),

  // ---------- Laubbäume (Baumform) ----------
  'ahorn-baum': () => (
    <g>
      <Ground />
      <Trunk w={9} top={52} />
      <Blob cx={50} cy={38} rx={32} ry={28} farbe="#5E9B3E" />
    </g>
  ),
  'buche-baum': () => (
    <g>
      <Ground />
      <Trunk w={6} top={40} farbe="#8D8C86" />
      <Blob cx={50} cy={30} rx={20} ry={27} farbe="#4E8A35" />
    </g>
  ),
  'eiche-baum': () => (
    <g>
      <Ground />
      <path d="M40 92 C42 78 38 70 44 58 L56 58 C62 70 58 78 62 92Z" fill={C.rinde} />
      <path
        d="M44 62 C38 52 28 54 22 46 M56 60 C64 52 72 56 80 46 M50 58 C48 48 54 42 50 34"
        stroke={C.rinde}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M44 72 c2 -4 0 -6 2 -8 M54 80 c-2 -4 2 -6 0 -9"
        stroke="#4A321C"
        strokeWidth="1.5"
        fill="none"
      />
      <Blob cx={50} cy={36} rx={42} ry={22} farbe="#4F7F33" punkte={9} />
    </g>
  ),
  'kastanie-baum': () => (
    <g>
      <Ground />
      <Trunk w={10} top={58} />
      <path d="M10 60 C10 20 90 20 90 60Z" fill="#5A9A3A" />
      <Blob cx={50} cy={44} rx={38} ry={20} farbe="#5A9A3A" punkte={9} />
      {[
        [25, 40],
        [40, 30],
        [58, 32],
        [72, 42],
        [34, 50],
        [64, 50],
        [50, 42],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l-2 6 h4Z`} fill="#fff" />
      ))}
    </g>
  ),
  'esche-baum': () => (
    <g>
      <Ground />
      <Trunk w={7} top={46} farbe="#7E7A70" />
      <Blob cx={50} cy={34} rx={28} ry={26} farbe="#7DA850" punkte={10} />
    </g>
  ),
  'birke-baum': () => (
    <g>
      <Ground />
      <Trunk w={6} top={30} farbe="#F2F0E8" />
      {[40, 52, 64, 76, 86].map((y) => (
        <path key={y} d={`M${47 + (y % 3)} ${y} h4`} stroke="#222" strokeWidth="1.5" />
      ))}
      <Blob cx={50} cy={30} rx={18} ry={24} farbe="#9CC25E" punkte={8} />
    </g>
  ),
  'ulme-baum': () => (
    <g>
      <Ground />
      <Trunk w={8} top={56} />
      <path d="M50 58 L36 36 M50 58 L64 36" stroke={C.rinde} strokeWidth="4" />
      <Blob cx={50} cy={30} rx={38} ry={20} farbe="#5C8F3C" punkte={9} />
    </g>
  ),
  'blutbuche-baum': () => (
    <g>
      <Ground />
      <Trunk w={7} top={42} farbe="#8D8C86" />
      <Blob cx={50} cy={32} rx={26} ry={26} farbe="#7A2430" />
    </g>
  ),
  'zuckerahorn-baum': () => (
    <g>
      <Ground />
      <Trunk w={9} top={52} />
      <Blob cx={50} cy={38} rx={32} ry={28} farbe={C.orange} />
      <g transform="translate(62 50) scale(0.3)">{ahornBlatt(C.rot)}</g>
    </g>
  ),

  // ---------- Nadelbäume ----------
  'fichte-baum': () => (
    <g>
      <Ground />
      <Trunk w={5} top={20} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 10 + i * 13;
        const w = 8 + i * 6;
        return (
          <path
            key={i}
            d={`M50 ${y} L${50 - w} ${y + 18} Q50 ${y + 14} ${50 + w} ${y + 18}Z`}
            fill="#245C33"
          />
        );
      })}
    </g>
  ),
  'kiefer-baum': () => (
    <g>
      <Ground />
      <path d="M47 92 L48 30 L52 30 L53 92Z" fill="#B0603A" />
      <path d="M48 40 L36 30 M52 36 L64 28" stroke="#B0603A" strokeWidth="2.5" />
      <path d="M18 30 C24 10 76 10 82 30 C70 36 30 36 18 30Z" fill="#3F7A4A" />
      <path d="M30 26 C34 18 50 16 56 22" stroke="#2E5E37" strokeWidth="2" fill="none" />
    </g>
  ),
  'laerche-baum': () => (
    <g>
      <Ground />
      <Trunk w={5} top={14} />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 14 + i * 15;
        const w = 6 + i * 7;
        return (
          <g key={i}>
            <path d={`M50 ${y} L${50 - w} ${y + 12}`} stroke={C.rinde} strokeWidth="1.5" />
            <path d={`M50 ${y} L${50 + w} ${y + 12}`} stroke={C.rinde} strokeWidth="1.5" />
            {Array.from({ length: 4 }, (_, k) => (
              <g key={k}>
                <circle cx={50 - (w * (k + 1)) / 4} cy={y + (12 * (k + 1)) / 4} r="3.2" fill="#9CCB5E" />
                <circle cx={50 + (w * (k + 1)) / 4} cy={y + (12 * (k + 1)) / 4} r="3.2" fill="#9CCB5E" />
              </g>
            ))}
          </g>
        );
      })}
    </g>
  ),
  'laerche-gelb': () => (
    <g>
      <Ground />
      <Trunk w={5} top={14} />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 14 + i * 15;
        const w = 6 + i * 7;
        return (
          <g key={i}>
            <path
              d={`M50 ${y} L${50 - w} ${y + 12} M50 ${y} L${50 + w} ${y + 12}`}
              stroke={C.rinde}
              strokeWidth="1.5"
            />
            {Array.from({ length: 4 }, (_, k) => (
              <g key={k}>
                <circle cx={50 - (w * (k + 1)) / 4} cy={y + (12 * (k + 1)) / 4} r="3.2" fill={C.gelb} />
                <circle cx={50 + (w * (k + 1)) / 4} cy={y + (12 * (k + 1)) / 4} r="3.2" fill={C.gelb} />
              </g>
            ))}
          </g>
        );
      })}
      {[
        [20, 88],
        [76, 90],
        [30, 84],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill={C.gelb} />
      ))}
    </g>
  ),
  'laerche-kahl': () => (
    <g>
      <Ground />
      <Trunk w={5} top={14} />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 14 + i * 15;
        const w = 6 + i * 7;
        return (
          <path
            key={i}
            d={`M50 ${y} L${50 - w} ${y + 12} M50 ${y} L${50 + w} ${y + 12}`}
            stroke={C.rinde}
            strokeWidth="1.5"
          />
        );
      })}
    </g>
  ),
  'tanne-baum': () => (
    <g>
      <Ground />
      <Trunk w={5} top={20} />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 12 + i * 15;
        const w = 10 + i * 6.5;
        return <rect key={i} x={50 - w} y={y} width={w * 2} height="9" rx="4" fill="#2C5A3C" />;
      })}
      <path d="M50 4 L44 14 L56 14Z" fill="#2C5A3C" />
      <rect x="40" y="10" width="3" height="6" rx="1.5" fill="#7A5A30" />
      <rect x="57" y="25" width="3" height="6" rx="1.5" fill="#7A5A30" />
    </g>
  ),

  // ---------- Nadelzweige ----------
  'fichte-zweig': () => (
    <g>
      <path d="M8 50 L92 50" stroke={C.rinde} strokeWidth="3" />
      {Array.from({ length: 28 }, (_, i) => {
        const x = 12 + i * 2.9;
        const a = (i * 47) % 360;
        const r = (a * Math.PI) / 180;
        return (
          <path
            key={i}
            d={`M${x} 50 l${(Math.cos(r) * 6).toFixed(1)} ${(Math.sin(r) * 9).toFixed(1)}`}
            stroke="#24603A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i} stroke="#2F7A48" strokeWidth="2" strokeLinecap="round">
          <path d={`M${14 + i * 5.5} 50 l2 -10`} />
          <path d={`M${15 + i * 5.5} 50 l2 10`} />
        </g>
      ))}
    </g>
  ),
  'kiefer-zweig': () => (
    <g>
      <path d="M8 60 L92 50" stroke="#B0603A" strokeWidth="3" />
      {Array.from({ length: 7 }, (_, i) => {
        const x = 16 + i * 11;
        const y = 59 - i * 1.2;
        return (
          <g key={i} stroke="#3B7A4A" strokeWidth="1.8" strokeLinecap="round" fill="none">
            <path d={`M${x} ${y} Q${x - 4} ${y - 20} ${x - 8} ${y - 36}`} />
            <path d={`M${x} ${y} Q${x + 4} ${y - 20} ${x + 6} ${y - 36}`} />
            <circle cx={x} cy={y} r="1.6" fill="#7A5A30" stroke="none" />
          </g>
        );
      })}
      <text x="50" y="88" textAnchor="middle" fontSize="9" fill={C.text}>
        immer zu zweit
      </text>
    </g>
  ),
  'laerche-zweig': () => (
    <g>
      <path d="M8 60 L92 56" stroke={C.rinde} strokeWidth="3" />
      {[20, 42, 64, 84].map((x) => (
        <g key={x} stroke="#86BF4E" strokeWidth="1.4" strokeLinecap="round">
          <circle cx={x} cy="58" r="2.5" fill="#7A5A30" stroke="none" />
          {Array.from({ length: 13 }, (_, k) => {
            const a = ((-170 + k * 13) * Math.PI) / 180;
            return (
              <path
                key={k}
                d={`M${x} 57 l${(Math.cos(a) * 12).toFixed(1)} ${(Math.sin(a) * 14).toFixed(1)}`}
              />
            );
          })}
        </g>
      ))}
      <text x="50" y="88" textAnchor="middle" fontSize="9" fill={C.text}>
        weich, in Büscheln
      </text>
    </g>
  ),
  'tanne-zweig': () => (
    <g>
      <path d="M8 50 L92 50" stroke={C.rinde} strokeWidth="3" />
      {Array.from({ length: 12 }, (_, i) => {
        const x = 14 + i * 6.5;
        return (
          <g key={i}>
            {[-1, 1].map((s) => (
              <g key={s} transform={`translate(${x} 50) rotate(${s * 80})`}>
                <rect x="-2.6" y="-22" width="5.2" height="20" rx="2.6" fill="#2C6A44" />
                <path d="M-1 -20 v16 M1 -20 v16" stroke="#E8F2EA" strokeWidth="0.8" />
              </g>
            ))}
          </g>
        );
      })}
      <text x="50" y="88" textAnchor="middle" fontSize="9" fill={C.text}>
        flach, 2 helle Streifen
      </text>
    </g>
  ),

  // ---------- Zapfen ----------
  'fichte-zapfen': () => (
    <g>
      <path d="M10 10 L90 10" stroke={C.rinde} strokeWidth="3" />
      <path d="M50 10 L50 18" stroke={C.rinde} strokeWidth="2" />
      <path
        d="M50 18 C40 24 38 70 50 94 C62 70 60 24 50 18Z"
        fill="#9A6A3A"
        stroke="#5A3A1A"
        strokeWidth="1.3"
      />
      {Array.from({ length: 10 }, (_, i) => (
        <path
          key={i}
          d={`M42 ${26 + i * 6.5} Q50 ${30 + i * 6.5} 58 ${26 + i * 6.5}`}
          stroke="#5A3A1A"
          strokeWidth="1"
          fill="none"
        />
      ))}
      <path d="M70 40 l0 14 l-4 -4 M70 54 l4 -4" stroke={C.text} strokeWidth="2" fill="none" />
    </g>
  ),
  'kiefer-zapfen': () => (
    <g>
      <path d="M50 8 L50 30" stroke="#B0603A" strokeWidth="2.5" />
      <path
        d="M50 28 C30 34 28 70 50 80 C72 70 70 34 50 28Z"
        fill="#8A6038"
        stroke="#4A321C"
        strokeWidth="1.5"
      />
      {[
        [42, 42],
        [58, 42],
        [50, 50],
        [40, 58],
        [60, 58],
        [50, 66],
        [45, 74],
        [55, 74],
        [50, 36],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 5} l5 5 l-5 5 l-5 -5Z`}
          fill="#A57848"
          stroke="#4A321C"
          strokeWidth="1"
        />
      ))}
    </g>
  ),
  'laerche-zapfen': () => (
    <g>
      <path d="M10 82 L90 76" stroke={C.rinde} strokeWidth="3" />
      <path d="M50 78 L50 70" stroke={C.rinde} strokeWidth="2" />
      {[0, 1, 2].map((ring) =>
        Array.from({ length: 6 + ring }, (_, k) => {
          const a = (k / (6 + ring)) * Math.PI * 2 + ring;
          const r = 14 - ring * 4;
          return (
            <ellipse
              key={`${ring}-${k}`}
              cx={50 + Math.cos(a) * r * 0.9}
              cy={48 + Math.sin(a) * r * 0.8}
              rx="8"
              ry="6"
              fill={ring === 2 ? '#B48A5A' : '#9C7044'}
              stroke="#5A3A1A"
              strokeWidth="1"
              transform={`rotate(${(a * 180) / Math.PI} ${50 + Math.cos(a) * r * 0.9} ${48 + Math.sin(a) * r * 0.8})`}
            />
          );
        }),
      )}
    </g>
  ),
  'tanne-zapfen': () => (
    <g>
      <path d="M10 90 L90 90" stroke={C.rinde} strokeWidth="3" />
      <path
        d="M50 88 C36 82 38 30 50 6 C62 30 64 82 50 88Z"
        fill="#7A6A4A"
        stroke="#4A3A1A"
        strokeWidth="1.3"
      />
      {Array.from({ length: 10 }, (_, i) => (
        <path
          key={i}
          d={`M42 ${80 - i * 7} Q50 ${76 - i * 7} 58 ${80 - i * 7}`}
          stroke="#4A3A1A"
          strokeWidth="1"
          fill="none"
        />
      ))}
      <path d="M74 60 l0 -14 l-4 4 M74 46 l4 4" stroke={C.text} strokeWidth="2" fill="none" />
    </g>
  ),

  // ---------- Jahreszeiten ----------
  'laubbaum-fruehling': () => (
    <g>
      <Ground />
      <BareBranches />
      <Blob cx={50} cy={32} rx={34} ry={24} farbe="#B6DB7A" />
      {[
        [30, 24],
        [44, 16],
        [60, 20],
        [72, 32],
        [36, 38],
        [56, 34],
        [26, 34],
        [66, 42],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#FCE4EC" stroke="#E7A1B5" strokeWidth="0.8" />
      ))}
    </g>
  ),
  'laubbaum-sommer': () => (
    <g>
      <Ground />
      <BareBranches />
      <Blob cx={50} cy={32} rx={40} ry={28} farbe="#2F6B3B" punkte={9} />
    </g>
  ),
  'laubbaum-herbst': () => (
    <g>
      <Ground />
      <BareBranches />
      <Blob cx={50} cy={32} rx={36} ry={24} farbe={C.orange} />
      {[
        [30, 26, C.rot],
        [60, 22, C.gelb],
        [44, 40, C.rot],
        [70, 36, C.gelb],
        [36, 18, C.gelb],
      ].map(([x, y, f], i) => (
        <circle key={i} cx={x as number} cy={y as number} r="7" fill={f as string} />
      ))}
      {[
        [20, 70],
        [78, 64],
        [30, 84],
        [68, 82],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l4 -3 l1 5Z`} fill={i % 2 ? C.rot : C.gelb} />
      ))}
    </g>
  ),
  'laubbaum-winter': () => (
    <g>
      <rect x="0" y="88" width="100" height="12" fill="#fff" />
      <BareBranches />
      {[
        [22, 28],
        [80, 28],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="#7A3F1D" />
      ))}
      <path d="M22 26 h-4 M80 26 h4" stroke="#fff" strokeWidth="2" />
    </g>
  ),
};
