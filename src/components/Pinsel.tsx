export type Pose = 'neutral' | 'freut' | 'denkt' | 'zeigt' | 'schlaeft' | 'feiert';

/** Pinsel, das Eichhörnchen, in 6 Posen. Ausrüstung je nach Rang. */
export function Pinsel({
  pose = 'neutral',
  items = [],
  size = 96,
}: {
  pose?: Pose;
  items?: string[];
  size?: number;
}) {
  const augenZu = pose === 'schlaeft' || pose === 'freut';
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`pinsel pinsel-${pose}`}
      role="img"
      aria-label="Pinsel, das Eichhörnchen"
    >
      {/* Schwanz */}
      <path d="M74 104 C118 98 120 40 94 18 C86 38 102 62 78 76Z" fill="#B5542A" />
      <path d="M86 40 C96 52 96 70 88 80" stroke="#D9824A" strokeWidth="3" fill="none" />
      {/* Körper */}
      <ellipse cx="54" cy="80" rx="22" ry="26" fill="#C2622F" />
      <ellipse cx="52" cy="86" rx="12" ry="17" fill="#FBF3E6" />
      {/* Arme */}
      {pose === 'feiert' ? (
        <path d="M36 72 L22 48 M70 72 L84 48" stroke="#C2622F" strokeWidth="7" strokeLinecap="round" />
      ) : pose === 'zeigt' ? (
        <path d="M36 78 L26 90 M70 74 L94 62" stroke="#C2622F" strokeWidth="7" strokeLinecap="round" />
      ) : pose === 'denkt' ? (
        <path
          d="M36 78 L30 92 M66 76 Q66 56 58 54"
          stroke="#C2622F"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path d="M38 80 L34 94 M68 80 L72 94" stroke="#C2622F" strokeWidth="7" strokeLinecap="round" />
      )}
      {/* Kopf */}
      <circle cx="50" cy="46" r="18" fill="#C2622F" />
      <path d="M38 34 L32 10 L44 30Z M56 30 L60 8 L64 32Z" fill="#B5542A" />
      <path
        d="M32 10 l-3 -6 M32 10 l1 -7 M60 8 l0 -7 M60 8 l4 -6"
        stroke="#6B2A10"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="38" cy="52" rx="6" ry="4" fill="#FBF3E6" />
      {augenZu ? (
        <>
          <path d="M40 43 q3 -3 6 0" stroke="#111" strokeWidth="2" fill="none" />
          <path d="M53 43 q3 -3 6 0" stroke="#111" strokeWidth="2" fill="none" />
        </>
      ) : (
        <>
          <circle cx="43" cy="44" r="3" fill="#111" />
          <circle cx="56" cy="44" r="3" fill="#111" />
          <circle cx="44" cy="43" r="1" fill="#fff" />
          <circle cx="57" cy="43" r="1" fill="#fff" />
        </>
      )}
      <circle cx="35" cy="50" r="2" fill="#4A2A1A" />
      {pose === 'freut' || pose === 'feiert' ? (
        <path d="M40 55 q6 6 12 0" stroke="#4A2A1A" strokeWidth="2" fill="#E88" />
      ) : pose === 'denkt' ? (
        <path d="M41 57 h9" stroke="#4A2A1A" strokeWidth="2" />
      ) : (
        <path d="M41 56 q5 3 10 0" stroke="#4A2A1A" strokeWidth="2" fill="none" />
      )}
      {pose === 'schlaeft' && (
        <text x="70" y="26" fontSize="16" fill="#2F6B3B" fontWeight="700">
          Zzz
        </text>
      )}
      {pose === 'denkt' && (
        <text x="72" y="24" fontSize="20" fill="#D9822B" fontWeight="700">
          ?
        </text>
      )}
      {/* Ausrüstung */}
      {items.includes('hut') && (
        <path d="M28 30 h44 l-6 -4 l-4 -12 h-24 l-4 12Z" fill="#2F6B3B" stroke="#1F4A28" />
      )}
      {items.includes('rucksack') && (
        <rect x="70" y="64" width="12" height="20" rx="4" fill="#D9822B" stroke="#8A4A1A" />
      )}
      {items.includes('lupe') && pose !== 'feiert' && (
        <g>
          <circle cx="26" cy="96" r="7" fill="#E3F4FB" stroke="#555" strokeWidth="2.5" />
          <path d="M30 101 l6 7" stroke="#6B4A2B" strokeWidth="3" />
        </g>
      )}
      {items.includes('fernglas') && (
        <g>
          <rect x="44" y="64" width="6" height="9" rx="2" fill="#333" />
          <rect x="52" y="64" width="6" height="9" rx="2" fill="#333" />
        </g>
      )}
    </svg>
  );
}
