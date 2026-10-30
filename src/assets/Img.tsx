import manifest from './manifest.json';
import { SVG } from './svg';

export interface ManifestEntry {
  id: string;
  gruppe: string;
  alt: string;
  datei: string | null;
  fallbackSvg: string;
  quelle: string;
  lizenz: string;
  autor: string;
  prompt: string;
}

export const MANIFEST: Record<string, ManifestEntry> = Object.fromEntries(
  (manifest as ManifestEntry[]).map((m) => [m.id, m]),
);

/** Lädt ein Bild nur über seine ID. Fehlt eine Datei, wird das SVG verwendet. */
export function Img({
  id,
  className,
  size,
  title,
}: {
  id: string;
  className?: string;
  size?: number | string;
  title?: string;
}) {
  const m = MANIFEST[id];
  const alt = title ?? m?.alt ?? id;
  const style = size ? { width: size, height: size } : undefined;
  if (m?.datei) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}${m.datei}`}
        alt={alt}
        className={className}
        style={style}
        draggable={false}
      />
    );
  }
  const art = SVG[m?.fallbackSvg ?? id];
  return (
    <svg
      viewBox={art?.viewBox ?? '0 0 100 100'}
      role="img"
      aria-label={alt}
      className={className}
      style={style}
    >
      <title>{alt}</title>
      {art ? (
        art.render()
      ) : (
        <text x="50" y="55" textAnchor="middle" fontSize="14">
          ?
        </text>
      )}
    </svg>
  );
}
