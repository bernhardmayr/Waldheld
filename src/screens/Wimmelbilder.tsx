import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Img } from '../assets/Img';
import { sceneUnlock, scenes } from '../content/scenes';
import { stationById } from '../content/stations';
import { szeneOffen } from '../engine/unlock';
import { GamePlayer } from '../components/GamePlayer';
import { Sterne } from '../components/ui';
import { useProgress } from '../store/progress';
import { useSettings } from '../store/settings';

const VORSCHAU: Record<string, string> = {
  fruehling: 'laubbaum-fruehling',
  sommer: 'laubbaum-sommer',
  herbst: 'laubbaum-herbst',
  winter: 'laubbaum-winter',
  querschnitt: 'waldquerschnitt',
};

/** Auswahl der freigeschalteten Wimmelbilder und freies Spielen. */
export function Wimmelbilder() {
  const { id } = useParams();
  const nav = useNavigate();
  const stand = useProgress((s) => s.stationen);
  const allesFrei = useSettings((s) => s.allesFrei);
  const [ergebnis, setErgebnis] = useState<number | null>(null);

  if (id && scenes[id] && szeneOffen(sceneUnlock[id], stand, allesFrei)) {
    if (ergebnis !== null)
      return (
        <div className="abschluss">
          <h1>Alles gefunden!</h1>
          <Sterne n={ergebnis} gross />
          <Link to="/wimmelbilder" className="knopf gross">
            Zurück zu den Suchbildern
          </Link>
        </div>
      );
    return (
      <GamePlayer
        type="hidden"
        config={{ kind: 'hidden', szenen: [id], modus: 'suchen' }}
        titel={scenes[id].titel}
        onFertig={(_, sterne) => setErgebnis(sterne)}
        onAbbruch={() => nav('/wimmelbilder')}
      />
    );
  }

  return (
    <div className="wimmel-auswahl">
      <h1>🔍 Wimmelbilder</h1>
      <div className="karten-raster">
        {Object.values(scenes).map((s) => {
          const offen = szeneOffen(sceneUnlock[s.id], stand, allesFrei);
          return offen ? (
            <Link key={s.id} to={`/wimmelbilder/${s.id}`} className="sammelkarte frei">
              <span className="sammel-bild">
                <Img id={VORSCHAU[s.id]} />
              </span>
              <span className="sammel-name">{s.titel}</span>
            </Link>
          ) : (
            <div key={s.id} className="sammelkarte zu">
              <span className="sammel-bild">🔒</span>
              <span className="sammel-name">{s.titel}</span>
              <small>Spiele erst „{stationById[sceneUnlock[s.id]].titel}“</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
