import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { frageById } from '../content';
import { moduleTitel } from '../content/facts';
import { stations } from '../content/stations';
import type { ModuleId } from '../content/types';
import { Sterne } from '../components/ui';
import { useProgress, type Progress } from '../store/progress';
import { useSettings } from '../store/settings';

/** Zugang über Erwachsenen-Rechenaufgabe oder 4-stellige PIN. */
function Zugang({ onOk }: { onOk: () => void }) {
  const pin = useSettings((s) => s.pin);
  const aufgabe = useMemo(() => {
    const a = 6 + Math.floor(Math.random() * 4);
    const b = 6 + Math.floor(Math.random() * 4);
    return { a, b, l: a * b };
  }, []);
  const [eingabe, setEingabe] = useState('');
  const [fehler, setFehler] = useState(false);
  return (
    <form
      className="eltern-zugang"
      onSubmit={(e) => {
        e.preventDefault();
        if (pin ? eingabe === pin : Number(eingabe) === aufgabe.l) onOk();
        else setFehler(true);
      }}
    >
      <h1>⚙️ Elternbereich</h1>
      <label>
        {pin ? 'Bitte PIN eingeben:' : `Für Erwachsene: Wie viel ist ${aufgabe.a} × ${aufgabe.b}?`}
        <input
          inputMode="numeric"
          value={eingabe}
          onChange={(e) => setEingabe(e.target.value.replace(/\D/g, ''))}
          autoFocus
        />
      </label>
      {fehler && <p className="fehler">Das stimmt leider nicht.</p>}
      <button type="submit" className="knopf">
        Öffnen
      </button>
      <Link to="/" className="knopf leise">
        Zurück
      </Link>
    </form>
  );
}

export function Eltern() {
  const [offen, setOffen] = useState(false);
  if (!offen) return <Zugang onOk={() => setOffen(true)} />;
  return <ElternBereich />;
}

function ElternBereich() {
  const p = useProgress();
  const settings = useSettings();
  const [kuerzel, setKuerzel] = useState('');
  const [reset, setReset] = useState(false);
  const datei = useRef<HTMLInputElement>(null);
  const [meldung, setMeldung] = useState<string | null>(null);

  const fehlerJeModul = useMemo(() => {
    const m: Partial<Record<ModuleId, { id: string; n: number }[]>> = {};
    Object.entries(p.fehler).forEach(([id, n]) => {
      const mod = id.slice(0, 3) as ModuleId;
      if (!moduleTitel[mod]) return;
      (m[mod] ??= []).push({ id, n });
    });
    Object.values(m).forEach((l) => l!.sort((a, b) => b.n - a.n));
    return m;
  }, [p.fehler]);

  function exportiere() {
    const daten: Partial<Progress> = Object.fromEntries(
      Object.entries(useProgress.getState()).filter(([, v]) => typeof v !== 'function'),
    );
    const blob = new Blob([JSON.stringify(daten, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `waldheld-spielstand-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importiere(f: File) {
    try {
      const d = JSON.parse(await f.text()) as Progress;
      if (typeof d !== 'object' || !('eichelnGesamt' in d)) throw new Error('kein Spielstand');
      p.importiere(d);
      setMeldung('Spielstand wurde geladen.');
    } catch {
      setMeldung('Die Datei ist kein gültiger Waldheld-Spielstand.');
    }
  }

  return (
    <div className="eltern">
      <h1>⚙️ Elternbereich</h1>

      <section>
        <h2>Fortschritt je Station</h2>
        <table>
          <thead>
            <tr>
              <th>Station</th>
              <th>Sterne</th>
              <th>zuletzt gespielt</th>
              <th>kontrolliert</th>
            </tr>
          </thead>
          <tbody>
            {stations
              .filter((s) => s.typ === 'pflicht' || s.typ === 'zusatz')
              .map((s) => {
                const st = p.stationen[s.id];
                return (
                  <tr key={s.id}>
                    <td>
                      {s.typ === 'pflicht' ? '!' : '★'} {s.titel}
                    </td>
                    <td>
                      <Sterne n={st?.sterne ?? 0} />
                    </td>
                    <td>{st?.zuletzt ? new Date(st.zuletzt).toLocaleString('de-DE') : '–'}</td>
                    <td>
                      {st?.kontrolliert ? (
                        `✔ ${st.kontrolliert.kuerzel} (${st.kontrolliert.datum})`
                      ) : (
                        <button
                          type="button"
                          className="knopf klein"
                          disabled={!kuerzel.trim()}
                          onClick={() => p.kontrolliere(s.id, kuerzel.trim())}
                        >
                          abhaken
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <label>
          Kürzel für „kontrolliert“:{' '}
          <input value={kuerzel} onChange={(e) => setKuerzel(e.target.value)} maxLength={4} />
        </label>
      </section>

      <section>
        <h2>Häufigste Fehler je Modul</h2>
        {Object.keys(fehlerJeModul).length === 0 && <p>Noch keine Fehler gespeichert.</p>}
        {(Object.entries(fehlerJeModul) as [ModuleId, { id: string; n: number }[]][]).map(([mod, liste]) => (
          <details key={mod}>
            <summary>
              {moduleTitel[mod]} ({liste.reduce((a, b) => a + b.n, 0)})
            </summary>
            <ul>
              {liste.slice(0, 5).map(({ id, n }) => {
                const q = frageById[id];
                return (
                  <li key={id}>
                    {n}× {q ? (q.kind === 'tf' ? q.aussage : q.frage) : id}
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
        <h3>Fehlerwörter der Werkstatt</h3>
        <p>{p.fehlerwoerter.length ? p.fehlerwoerter.join(', ') : 'keine'}</p>
      </section>

      <section className="einstellungen">
        <h2>Einstellungen</h2>
        <label className="schalter">
          <input
            type="checkbox"
            checked={settings.autoVorlesen}
            onChange={(e) => settings.set({ autoVorlesen: e.target.checked })}
          />{' '}
          Fragen automatisch vorlesen
        </label>
        <label>
          Sprechtempo:{' '}
          <input
            type="range"
            min={0.6}
            max={1.3}
            step={0.1}
            value={settings.sprechtempo}
            onChange={(e) => settings.set({ sprechtempo: Number(e.target.value) })}
          />{' '}
          {settings.sprechtempo.toFixed(1)}
        </label>
        <label className="schalter">
          <input
            type="checkbox"
            checked={settings.toene}
            onChange={(e) => settings.set({ toene: e.target.checked })}
          />{' '}
          Töne
        </label>
        <label className="schalter">
          <input
            type="checkbox"
            checked={settings.blitzrunden}
            onChange={(e) => settings.set({ blitzrunden: e.target.checked })}
          />{' '}
          Blitzrunden mit Zeitdruck (60 s bei Richtig/Falsch)
        </label>
        <label>
          Suchsel-Stufe:{' '}
          <select
            value={settings.suchselStufe}
            onChange={(e) => settings.set({ suchselStufe: Number(e.target.value) as 1 | 2 | 3 })}
          >
            <option value={1}>1: 10 × 10, waagerecht und senkrecht</option>
            <option value={2}>2: 12 × 12, auch rückwärts</option>
            <option value={3}>3: 12 × 12, auch diagonal</option>
          </select>
        </label>
        <label className="schalter">
          <input
            type="checkbox"
            checked={settings.pausenHinweis}
            onChange={(e) => settings.set({ pausenHinweis: e.target.checked })}
          />{' '}
          Pausen-Hinweis nach 20 Minuten
        </label>
        <label className="schalter">
          <input
            type="checkbox"
            checked={settings.allesFrei}
            onChange={(e) => {
              settings.set({ allesFrei: e.target.checked });
              if (e.target.checked) p.alleKartenFrei();
            }}
          />{' '}
          Alles sofort freischalten
        </label>
        <label>
          PIN statt Rechenaufgabe (4 Ziffern, leer = aus):{' '}
          <input
            inputMode="numeric"
            maxLength={4}
            value={settings.pin}
            onChange={(e) => settings.set({ pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
          />
        </label>
      </section>

      <section>
        <h2>Spielstand</h2>
        <button type="button" className="knopf" onClick={exportiere}>
          ⬇ Als Datei speichern
        </button>
        <button type="button" className="knopf" onClick={() => datei.current?.click()}>
          ⬆ Datei laden
        </button>
        <input
          ref={datei}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => e.target.files?.[0] && importiere(e.target.files[0])}
        />
        {meldung && <p>{meldung}</p>}
        {!reset ? (
          <button type="button" className="knopf gefahr" onClick={() => setReset(true)}>
            Spielstand zurücksetzen …
          </button>
        ) : (
          <div className="warnung">
            <p>Wirklich alles löschen? Eicheln, Sterne, Karten und Abzeichen gehen verloren.</p>
            <button type="button" className="knopf gefahr" onClick={() => p.zuruecksetzen()}>
              Ja, alles löschen
            </button>
            <button type="button" className="knopf leise" onClick={() => setReset(false)}>
              Abbrechen
            </button>
          </div>
        )}
      </section>
      <p className="klein">
        Waldheld speichert alles nur lokal in diesem Browser. Keine Accounts, kein Tracking.{' '}
        <Link to="/dev/fakten">Faktenübersicht</Link> · <Link to="/dev/assets">Grafiken</Link>
      </p>
    </div>
  );
}
