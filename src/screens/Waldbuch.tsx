import { useState } from 'react';
import { Img } from '../assets/Img';
import { karten } from '../content/cards';
import type { WaldbuchKarte } from '../content/types';
import { SpeakButton } from '../components/ui';
import { useProgress } from '../store/progress';

const FILTER = [
  { id: 'alle', titel: 'Alle' },
  { id: 'baum', titel: '🌳 Bäume' },
  { id: 'tier', titel: '🐿️ Tiere' },
  { id: 'begriff', titel: '💡 Begriffe' },
] as const;

/** Waldbuch: Sammelalbum. Vor dem Freischalten Silhouette mit Fragezeichen. */
export function Waldbuch() {
  const buch = useProgress((s) => s.waldbuch);
  const leitner = useProgress((s) => s.leitner);
  const [filter, setFilter] = useState<(typeof FILTER)[number]['id']>('alle');
  const [detail, setDetail] = useState<WaldbuchKarte | null>(null);
  const liste = karten.filter((k) => filter === 'alle' || k.kategorie === filter);
  const frei = karten.filter((k) => buch[k.id]?.frei).length;

  return (
    <div className="waldbuch">
      <div className="kopfzeile">
        <h1>📖 Waldbuch</h1>
        <p>
          {frei} von {karten.length} Karten gesammelt
        </p>
        <div className="filter">
          {FILTER.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip ${filter === f.id ? 'an' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.titel}
            </button>
          ))}
        </div>
      </div>
      <div className="karten-raster">
        {liste.map((k) => {
          const st = buch[k.id];
          const offen = st?.frei;
          return (
            <button
              key={k.id}
              type="button"
              className={`sammelkarte ${offen ? 'frei' : 'zu'}`}
              onClick={() => offen && setDetail(k)}
              aria-label={offen ? k.titel : 'Noch nicht freigeschaltet'}
            >
              <span className="sammel-bild">
                <Img id={k.bild} />
                {!offen && <span className="fragezeichen">?</span>}
              </span>
              <span className="sammel-name">{offen ? k.titel : '???'}</span>
              {!offen && <span className="sammel-fort">{st?.treffer ?? 0} / 3</span>}
            </button>
          );
        })}
      </div>
      {detail && (
        <div className="overlay" role="dialog" aria-label={detail.titel} onClick={() => setDetail(null)}>
          <div className="dialog karte-detail" onClick={(e) => e.stopPropagation()}>
            <Img id={detail.bild} className="detail-bild" />
            <h2>
              {detail.titel} <SpeakButton text={`${detail.titel}. ${detail.fakten.join(' ')}`} />
            </h2>
            <ul>
              {detail.fakten.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Fortschrittsring factIds={detail.factIds} leitner={leitner} />
            <button type="button" className="knopf" onClick={() => setDetail(null)}>
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Fortschrittsring({
  factIds,
  leitner,
}: {
  factIds: string[];
  leitner: Record<string, { fach: number }>;
}) {
  // höchstes Leitner-Fach der Fragen zu diesen Fakten
  const faecher = Object.entries(leitner)
    .filter(([id]) => factIds.some((f) => id.startsWith(f.slice(0, 3))))
    .map(([, e]) => e.fach);
  const fach = faecher.length ? Math.round(faecher.reduce((a, b) => a + b, 0) / faecher.length) : 1;
  const r = 22;
  const u = 2 * Math.PI * r;
  return (
    <div className="ring" title={`Wissensfach ${fach} von 5`}>
      <svg viewBox="0 0 60 60" width="64" height="64">
        <circle cx="30" cy="30" r={r} fill="none" stroke="#E5DFCF" strokeWidth="7" />
        <circle
          cx="30"
          cy="30"
          r={r}
          fill="none"
          stroke="#2F6B3B"
          strokeWidth="7"
          strokeDasharray={`${(u * fach) / 5} ${u}`}
          transform="rotate(-90 30 30)"
          strokeLinecap="round"
        />
        <text x="30" y="35" textAnchor="middle" fontSize="15" fontWeight="700" fill="#2B2B2B">
          {fach}/5
        </text>
      </svg>
      <span>Wissensfach</span>
    </div>
  );
}
