import { Link } from 'react-router-dom';
import { Img, MANIFEST } from '../assets/Img';
import { facts, moduleTitel } from '../content/facts';
import type { ModuleId } from '../content/types';

/** Entwicklerseite: alle Grafiken mit ID und Alt-Text. */
export function DevAssets() {
  const gruppen = [...new Set(Object.values(MANIFEST).map((m) => m.gruppe))];
  return (
    <div className="dev">
      <h1>Grafiken ({Object.keys(MANIFEST).length})</h1>
      <Link to="/">Zurück</Link>
      {gruppen.map((g) => (
        <section key={g}>
          <h2>{g}</h2>
          <div className="dev-raster">
            {Object.values(MANIFEST)
              .filter((m) => m.gruppe === g)
              .map((m) => (
                <figure key={m.id}>
                  <Img id={m.id} />
                  <figcaption>
                    <code>{m.id}</code>
                    <br />
                    {m.alt}
                  </figcaption>
                </figure>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Druckbare Faktenübersicht pro Modul zur Prüfung gegen die Arbeitsblätter. */
export function DevFakten() {
  return (
    <div className="dev">
      <h1>Faktenübersicht</h1>
      <Link to="/">Zurück</Link>
      {(Object.keys(moduleTitel) as ModuleId[]).map((m) => (
        <section key={m}>
          <h2>
            {m.toUpperCase()} {moduleTitel[m]}
          </h2>
          <ul>
            {facts
              .filter((f) => f.modul === m)
              .map((f) => (
                <li key={f.id}>
                  <code>{f.id}</code> {f.text} {f.ergaenzung && <em>(Ergänzung)</em>}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
