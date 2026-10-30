import { abzeichen } from '../content/badges';
import { raenge } from '../content/ranks';
import { Fortschritt } from '../components/ui';
import { Pinsel } from '../components/Pinsel';
import { useProgress } from '../store/progress';
import { useRang } from '../app/Layout';

/** Abzeichen und Rang: Medaillen-Wand und Fortschritt bis zum nächsten Rang. */
export function AbzeichenScreen() {
  const meine = useProgress((s) => s.abzeichen);
  const form = useProgress((s) => s.spieler?.form ?? 'w');
  const rang = useRang();
  return (
    <div className="abzeichen-screen">
      <div className="rang-karte">
        <Pinsel pose="feiert" size={110} items={rang.items} />
        <div>
          <h1>{rang.name}</h1>
          <p>{rang.gesamt} Eicheln gesammelt</p>
          {rang.naechster ? (
            <>
              <Fortschritt
                wert={rang.gesamt - raenge[rang.i].ab}
                max={rang.naechster.ab - raenge[rang.i].ab}
              />
              <p>
                Noch {rang.naechster.ab - rang.gesamt} Eicheln bis „{rang.naechster[form]}“ (
                {rang.naechster.belohnung})
              </p>
            </>
          ) : (
            <p>Du hast den höchsten Rang erreicht!</p>
          )}
        </div>
      </div>
      <ol className="raenge">
        {raenge.map((r, i) => (
          <li key={r.ab} className={i <= rang.i ? 'erreicht' : ''}>
            <strong>{r[form]}</strong> ab {r.ab} · {r.belohnung}
          </li>
        ))}
      </ol>
      <h2>
        Abzeichen ({meine.length} / {abzeichen.length})
      </h2>
      <div className="medaillen">
        {abzeichen.map((a) => {
          const hat = meine.includes(a.id);
          return (
            <div key={a.id} className={`medaille-karte ${hat ? 'hat' : ''}`}>
              <span className="medaille">{hat ? a.symbol : '🔒'}</span>
              <strong>{a[form]}</strong>
              <small>{a.bedingung}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
