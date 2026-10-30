import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { alleFragen, frageById } from '../content';
import { pflichtStationen } from '../content/stations';
import { faellige } from '../engine/leitner';
import { shuffle } from '../engine/rng';
import { EICHELN } from '../engine/scoring';
import { GamePlayer } from '../components/GamePlayer';
import { Pinsel } from '../components/Pinsel';
import { Sterne } from '../components/ui';
import { heute, useProgress } from '../store/progress';

/** Tägliche Waldaufgabe: 5 fällige Wiederholungsfragen aus dem Leitner-System, gemischt aus allen Modulen. */
export function Tagesaufgabe() {
  const erledigt = useProgress((s) => s.tagesaufgabe === heute());
  const spieltage = useProgress((s) => s.spieltage.length);
  const [phase, setPhase] = useState<'start' | 'spiel' | 'ende'>('start');
  const [sterne, setSterne] = useState(0);
  const fragen = useMemo(() => {
    const p = useProgress.getState();
    const due = faellige(p.leitner, heute()).filter((id) => frageById[id]);
    const module = new Set(pflichtStationen.map((s) => s.modul as string));
    const besucht = new Set(
      Object.keys(p.stationen)
        .map((id) => pflichtStationen.find((s) => s.id === id)?.modul)
        .filter(Boolean),
    );
    const neu = shuffle(
      alleFragen.filter(
        (q) =>
          !p.leitner[q.id] &&
          (besucht.has(q.id.slice(0, 3) as never) || besucht.size === 0) &&
          module.has(q.id.slice(0, 3)),
      ),
    );
    const liste = [...due.map((id) => frageById[id]), ...neu];
    if (liste.length < 5) liste.push(...shuffle(alleFragen.filter((q) => !liste.includes(q))));
    return liste.slice(0, 5);
  }, [phase === 'start']);

  if (phase === 'spiel')
    return (
      <GamePlayer
        type="quiz"
        config={{ kind: 'quiz', fragen, anzahl: 5 }}
        titel="Tägliche Waldaufgabe"
        onFertig={(_, s) => {
          setSterne(s);
          useProgress.getState().tagesaufgabeErledigt();
          setPhase('ende');
        }}
        onAbbruch={() => setPhase('start')}
      />
    );

  return (
    <div className="tagesaufgabe">
      <Pinsel pose={phase === 'ende' ? 'feiert' : 'zeigt'} size={140} />
      <h1>📅 Tägliche Waldaufgabe</h1>
      {phase === 'ende' ? (
        <>
          <Sterne n={sterne} gross />
          <p>Toll! Du hast heute deine Waldaufgabe geschafft. +{EICHELN.tagesaufgabe} Eicheln</p>
        </>
      ) : (
        <>
          <p>5 Fragen zum Wiederholen. Was du falsch hattest, kommt wieder dran, bis du es sicher weißt.</p>
          {erledigt && <p className="hinweis">Heute schon erledigt! Du kannst trotzdem noch einmal üben.</p>}
          <button
            type="button"
            className="knopf gross"
            onClick={() => setPhase('spiel')}
            disabled={!fragen.length}
          >
            Los geht’s!
          </button>
        </>
      )}
      <p className="klein">Du hast an {spieltage} Tagen im Wald gespielt.</p>
      <Link to="/" className="knopf leise">
        Zur Waldkarte
      </Link>
    </div>
  );
}
