import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { abzeichen } from '../content/badges';
import { karteById } from '../content/cards';
import { raenge, rangIndex } from '../content/ranks';
import { Pinsel } from '../components/Pinsel';
import { Eichel } from '../components/ui';
import { heute, useProgress } from '../store/progress';
import { useSettings } from '../store/settings';

export function useRang() {
  const gesamt = useProgress((s) => s.eichelnGesamt);
  const form = useProgress((s) => s.spieler?.form ?? 'w');
  const i = rangIndex(gesamt);
  const items = raenge.slice(0, i + 1).flatMap((r) => (r.item ? [r.item] : []));
  return { i, name: raenge[i][form], items, naechster: raenge[i + 1], gesamt };
}

export function Layout() {
  const eicheln = useProgress((s) => s.eicheln);
  const tagesaufgabe = useProgress((s) => s.tagesaufgabe);
  const neuAbzeichen = useProgress((s) => s.neuAbzeichen);
  const neuKarten = useProgress((s) => s.neuKarten);
  const form = useProgress((s) => s.spieler?.form ?? 'w');
  const start = useProgress((s) => s.sitzungsStart);
  const pausenHinweis = useSettings((s) => s.pausenHinweis);
  const rang = useRang();
  const [pause, setPause] = useState(false);
  const [bump, setBump] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [eicheln]);

  useEffect(() => {
    if (!pausenHinweis) return;
    const rest = start + 20 * 60 * 1000 - Date.now();
    const t = setTimeout(() => setPause(true), Math.max(0, rest));
    return () => clearTimeout(t);
  }, [pausenHinweis, start]);

  const letztes = neuAbzeichen[neuAbzeichen.length - 1];
  const letzteKarte = neuKarten[neuKarten.length - 1];
  useEffect(() => {
    if (!letztes) return;
    const a = abzeichen.find((x) => x.id === letztes);
    if (a) setToast(`${a.symbol} Neues Abzeichen: ${a[form]}`);
  }, [letztes]);
  useEffect(() => {
    if (!letzteKarte) return;
    const k = karteById[letzteKarte];
    if (k) setToast(`📖 Neue Waldbuch-Karte: ${k.titel}`);
  }, [letzteKarte]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="app">
      <header className="leiste">
        <Link to="/" className="logo" aria-label="Zur Waldkarte">
          <Pinsel pose="neutral" size={44} items={rang.items} />
          <span>Waldheld</span>
        </Link>
        <div className={`eicheln ${bump ? 'bump' : ''}`} title="Eicheln" aria-label={`${eicheln} Eicheln`}>
          <Eichel /> <strong id="eichel-zaehler">{eicheln}</strong>
        </div>
        <NavLink to="/abzeichen" className="rang" title="Rang und Abzeichen">
          🏅 {rang.name}
        </NavLink>
        <nav className="menue" aria-label="Hauptmenü">
          <NavLink
            to="/tagesaufgabe"
            title="Tägliche Waldaufgabe"
            className={tagesaufgabe === heute() ? 'erledigt' : 'neu'}
          >
            📅<span>Heute</span>
          </NavLink>
          <NavLink to="/waldbuch" title="Waldbuch">
            📖<span>Waldbuch</span>
          </NavLink>
          <NavLink to="/meinwald" title="Mein Wald">
            🌳<span>Mein Wald</span>
          </NavLink>
          <NavLink to="/zettel" title="Stationenzettel">
            📋<span>Zettel</span>
          </NavLink>
          <NavLink to="/wimmelbilder" title="Wimmelbilder">
            🔍<span>Suchbilder</span>
          </NavLink>
          <NavLink to="/werkstatt" title="Schreib-Werkstatt">
            ✏️<span>Werkstatt</span>
          </NavLink>
          <NavLink to="/eltern" title="Elternbereich">
            ⚙️<span>Eltern</span>
          </NavLink>
        </nav>
      </header>
      <main className="inhalt">
        <Outlet />
      </main>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      {pause && (
        <div className="overlay" role="dialog" aria-label="Pausen-Hinweis">
          <div className="dialog">
            <Pinsel pose="zeigt" size={120} />
            <p>Du spielst schon 20 Minuten. Zeit für einen Ausflug in den echten Wald?</p>
            <button type="button" className="knopf" onClick={() => setPause(false)}>
              Okay!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
