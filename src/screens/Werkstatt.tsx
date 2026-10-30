import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GamePlayer } from '../components/GamePlayer';
import { Sterne } from '../components/ui';

/** Schreib-Werkstatt: Übungen nach Schwerpunkt, Fehlerwörter-Kiste. */
export function Werkstatt() {
  const nav = useNavigate();
  const [runde, setRunde] = useState(0);
  const [ergebnis, setErgebnis] = useState<number | null>(null);
  if (ergebnis !== null)
    return (
      <div className="abschluss">
        <h1>Runde geschafft!</h1>
        <Sterne n={ergebnis} gross />
        <button
          type="button"
          className="knopf gross"
          onClick={() => {
            setErgebnis(null);
            setRunde(runde + 1);
          }}
        >
          Weiter üben
        </button>
      </div>
    );
  return (
    <GamePlayer
      key={runde}
      type="spelling"
      config={{ kind: 'spelling' }}
      titel="Schreib-Werkstatt"
      stationId="SW"
      spielKey="0"
      onFertig={(_, sterne) => setErgebnis(sterne)}
      onAbbruch={() => nav('/')}
    />
  );
}
