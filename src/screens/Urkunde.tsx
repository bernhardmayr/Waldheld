import { Link } from 'react-router-dom';
import { Pinsel } from '../components/Pinsel';
import { useProgress } from '../store/progress';
import { useRang } from '../app/Layout';

/** Druckbare Urkunde (eine A4-Seite) mit Name, Datum und Rang. */
export function Urkunde() {
  const spieler = useProgress((s) => s.spieler);
  const bestanden = useProgress((s) => (s.zaehler.pruefung ?? 0) > 0);
  const rang = useRang();
  if (!bestanden)
    return (
      <div className="urkunde-hinweis">
        <p>Die Urkunde gibt es nach bestandener Waldprüfung.</p>
        <Link to="/">Zur Waldkarte</Link>
      </div>
    );
  const titel = spieler?.form === 'm' ? 'Waldheld' : 'Waldheldin';
  return (
    <div className="urkunde-seite">
      <div className={`urkunde ${rang.items.includes('rahmen') ? 'gold' : ''}`}>
        <p className="urkunde-klein">Urkunde</p>
        <h1>{titel}</h1>
        <p>Hiermit wird bestätigt, dass</p>
        <p className="urkunde-name">{spieler?.name}</p>
        <p>die Waldprüfung erfolgreich bestanden hat.</p>
        <p>
          Rang: <strong>{rang.name}</strong>
        </p>
        <Pinsel pose="feiert" size={140} items={rang.items} />
        <p>{new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p className="unterschrift">Pinsel, Waldhüter</p>
      </div>
      <div className="nicht-drucken">
        <button type="button" className="knopf" onClick={() => window.print()}>
          🖨 Drucken
        </button>
        <Link to="/" className="knopf leise">
          Zur Waldkarte
        </Link>
      </div>
    </div>
  );
}
