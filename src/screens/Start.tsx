import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pinsel } from '../components/Pinsel';
import { SpeakButton } from '../components/ui';
import { useProgress } from '../store/progress';
import { useSettings } from '../store/settings';

const INTRO = [
  'Hallo! Ich bin Pinsel, das Eichhörnchen. Siehst du meine Pinselohren?',
  'Ich zeige dir den Wald: Bäume, Tiere und viele Geheimnisse.',
  'Für jede richtige Antwort bekommst du Eicheln. Damit pflanzt du deinen eigenen Wald!',
];

/** Erststart: Name, Form der Rangbezeichnung, Vorlesen, Intro von Pinsel. */
export function Start() {
  const setSpieler = useProgress((s) => s.setSpieler);
  const autoVorlesen = useSettings((s) => s.autoVorlesen);
  const set = useSettings((s) => s.set);
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [form, setForm] = useState<'w' | 'm'>('w');
  const [schritt, setSchritt] = useState(0);

  if (schritt > 0)
    return (
      <div className="start">
        <Pinsel pose={schritt === 3 ? 'feiert' : 'zeigt'} size={180} />
        <div className="sprechblase gross">
          {INTRO[schritt - 1]} <SpeakButton text={INTRO[schritt - 1]} />
        </div>
        <button
          type="button"
          className="knopf gross"
          onClick={() => {
            if (schritt < 3) setSchritt(schritt + 1);
            else {
              setSpieler(name || 'Waldkind', form);
              nav('/');
            }
          }}
        >
          {schritt < 3 ? 'Weiter ➜' : 'Los geht’s!'}
        </button>
      </div>
    );

  return (
    <div className="start">
      <h1>🌳 Waldheld</h1>
      <Pinsel pose="freut" size={160} />
      <form
        className="start-form"
        onSubmit={(e) => {
          e.preventDefault();
          setSchritt(1);
        }}
      >
        <label>
          Wie heißt du?
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoComplete="off"
            placeholder="Dein Vorname"
          />
        </label>
        <fieldset>
          <legend>Wie soll dein Titel heißen?</legend>
          <label className={`wahl ${form === 'w' ? 'an' : ''}`}>
            <input type="radio" name="form" checked={form === 'w'} onChange={() => setForm('w')} /> Waldheldin
          </label>
          <label className={`wahl ${form === 'm' ? 'an' : ''}`}>
            <input type="radio" name="form" checked={form === 'm'} onChange={() => setForm('m')} /> Waldheld
          </label>
        </fieldset>
        <label className="schalter">
          <input
            type="checkbox"
            checked={autoVorlesen}
            onChange={(e) => set({ autoVorlesen: e.target.checked })}
          />{' '}
          Fragen automatisch vorlesen
        </label>
        <button type="submit" className="knopf gross" disabled={!name.trim()}>
          Weiter ➜
        </button>
        <p className="klein">Dein Name bleibt nur auf diesem Gerät.</p>
      </form>
    </div>
  );
}
