import { Link } from 'react-router-dom';
import { Img } from '../assets/Img';
import { pflichtStationen, stations } from '../content/stations';
import { istOffen, pflichtMitStern, PFLICHT_FUER_ZUSATZ } from '../engine/unlock';
import { Pinsel } from '../components/Pinsel';
import { SpeakButton, Sterne } from '../components/ui';
import { useProgress } from '../store/progress';
import { useSettings } from '../store/settings';
import { useRang } from '../app/Layout';

const PFLICHT_IDS = pflichtStationen.map((s) => s.id);

/** Waldkarte: zentraler Hub mit allen Stationen als Orte. */
export function Waldkarte() {
  const stand = useProgress((s) => s.stationen);
  const name = useProgress((s) => s.spieler?.name ?? '');
  const allesFrei = useSettings((s) => s.allesFrei);
  const rang = useRang();
  const geschafft = pflichtMitStern(stand, PFLICHT_IDS);
  const sichtbar = stations.filter((s) => s.typ !== 'dauerhaft');

  let tipp: string;
  if (!stand.H1?.sterne)
    tipp = `Hallo ${name}! Fang doch mit „Was ist ein Wald?“ an. Tippe auf die Lichtung!`;
  else if (geschafft < PFLICHT_FUER_ZUSATZ)
    tipp = `Noch ${PFLICHT_FUER_ZUSATZ - geschafft} Pflichtstationen, dann öffnen sich die Zusatzstationen mit dem Stern.`;
  else if (geschafft < PFLICHT_IDS.length)
    tipp = `Super! Noch ${PFLICHT_IDS.length - geschafft} Pflichtstationen bis zur Waldprüfung.`;
  else tipp = 'Du hast alle Pflichtstationen geschafft! Die Waldprüfung im Försterhaus wartet auf dich.';

  return (
    <div className="karte-screen">
      <div className="karte-pinsel">
        <Pinsel pose="zeigt" size={64} items={rang.items} />
        <div className="sprechblase">
          {tipp} <SpeakButton text={tipp} klein />
        </div>
      </div>
      <div className="waldkarte" role="list" aria-label="Waldkarte mit Stationen">
        <svg className="karte-hg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <rect width="100" height="100" fill="#DCEBC6" />
          <path d="M0 0 H100 V22 Q70 30 50 20 T0 18Z" fill="#B9D59A" />
          <path d="M55 0 L72 0 L100 0 L100 30 Q86 34 74 26 L64 12Z" fill="#8FB77A" />
          <path d="M0 92 Q25 78 50 88 T100 82" stroke="#7CC0E0" strokeWidth="3" fill="none" />
          <path
            d="M14 72 C24 60 26 56 27 56 S40 44 44 46 S60 60 62 62 S78 50 80 50 S68 80 60 82 S40 70 50 64 S36 86 34 86"
            stroke="#C9A86A"
            strokeWidth="1.2"
            strokeDasharray="2 1.4"
            fill="none"
          />
          {Array.from({ length: 40 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 37) % 100}
              cy={(i * 61) % 100}
              r={1.6 + (i % 3)}
              fill={i % 4 ? '#7FA650' : '#2F6B3B'}
              opacity="0.45"
            />
          ))}
        </svg>
        {sichtbar.map((s) => {
          const offen = istOffen(s, stand, PFLICHT_IDS, allesFrei);
          const sterne = stand[s.id]?.sterne ?? 0;
          return (
            <div
              key={s.id}
              role="listitem"
              className="ort"
              style={{ left: `${s.karte.x}%`, top: `${s.karte.y}%` }}
            >
              {offen ? (
                <Link
                  to={`/station/${s.id}`}
                  className={`ort-knopf typ-${s.typ} ${sterne ? 'besucht' : ''} ${s.id === 'H1' && !sterne ? 'empfohlen' : ''}`}
                >
                  <span className="ort-bild">
                    <Img id={s.info.bild} size={52} />
                  </span>
                  <span
                    className="ort-symbol"
                    aria-label={s.typ === 'pflicht' ? 'Pflicht' : s.typ === 'zusatz' ? 'Zusatz' : 'Abschluss'}
                  >
                    {s.typ === 'pflicht' ? '!' : s.typ === 'zusatz' ? '★' : '🏅'}
                  </span>
                  <span className="ort-name">{s.titel}</span>
                  {s.typ !== 'abschluss' && <Sterne n={sterne} />}
                </Link>
              ) : (
                <span className={`ort-knopf gesperrt typ-${s.typ}`} title="Noch gesperrt">
                  <span className="ort-bild">🔒</span>
                  <span className="ort-name">{s.titel}</span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
