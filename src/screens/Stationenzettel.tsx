import { Link } from 'react-router-dom';
import { stations } from '../content/stations';
import { Sterne } from '../components/ui';
import { useProgress } from '../store/progress';

/** Digitaler Stationenzettel wie in der Schule: erledigt (ab 1 Stern) und kontrolliert (Eltern). */
export function Stationenzettel() {
  const stand = useProgress((s) => s.stationen);
  const name = useProgress((s) => s.spieler?.name);
  const liste = stations.filter((s) => s.typ === 'pflicht' || s.typ === 'zusatz');
  return (
    <div className="zettel">
      <h1>📋 Stationenzettel</h1>
      <p>Name: {name}</p>
      <table>
        <thead>
          <tr>
            <th>Nr.</th>
            <th>Station</th>
            <th>Art</th>
            <th>Sterne</th>
            <th>erledigt</th>
            <th>kontrolliert</th>
          </tr>
        </thead>
        <tbody>
          {liste.map((s) => {
            const st = stand[s.id];
            return (
              <tr key={s.id}>
                <td>{s.schulNr ?? s.id}</td>
                <td>
                  <Link to={`/station/${s.id}`}>{s.titel}</Link>
                </td>
                <td className="symbol" aria-label={s.typ === 'pflicht' ? 'Pflicht' : 'Zusatz'}>
                  {s.typ === 'pflicht' ? '!' : '★'}
                </td>
                <td>
                  <Sterne n={st?.sterne ?? 0} />
                </td>
                <td className="haken">{(st?.sterne ?? 0) >= 1 ? '✔' : ''}</td>
                <td className="haken">{st?.kontrolliert ? `✔ ${st.kontrolliert.kuerzel}` : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="klein">„kontrolliert“ setzt ein Erwachsener im Elternbereich.</p>
    </div>
  );
}
