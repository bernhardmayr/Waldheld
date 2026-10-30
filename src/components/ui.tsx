import { useEffect, type ReactNode } from 'react';
import { sprich } from '../lib/tts';
import { useSettings } from '../store/settings';

export function SpeakButton({
  text,
  label = 'Vorlesen',
  klein,
}: {
  text: string;
  label?: string;
  klein?: boolean;
}) {
  return (
    <button
      type="button"
      className={`speak ${klein ? 'speak-klein' : ''}`}
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        sprich(text);
      }}
    >
      🔊
    </button>
  );
}

/** **fett** im Text als <strong> darstellen. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>,
      )}
    </>
  );
}

const FRAGEWOERTER = [
  'In welcher Zeile',
  'Wie viele',
  'Wie lange',
  'Wie hoch',
  'Wie groß',
  'Wofür',
  'Woraus',
  'Woher',
  'Wohin',
  'Warum',
  'Welche',
  'Welcher',
  'Welches',
  'Wann',
  'Wer',
  'Was',
  'Wie',
  'Wo',
];

/** Frage mit farbig hervorgehobenem Fragewort und Vorlese-Knopf. */
export function Frage({ text, autoRead = true }: { text: string; autoRead?: boolean }) {
  const auto = useSettings((s) => s.autoVorlesen);
  useEffect(() => {
    if (auto && autoRead) sprich(text);
  }, [text]);
  const fw = FRAGEWOERTER.find(
    (w) => text.startsWith(w + ' ') || text.startsWith(w + '?') || text.includes(' ' + w.toLowerCase() + ' '),
  );
  let inhalt: ReactNode = text;
  if (fw) {
    const idx = text.startsWith(fw) ? 0 : text.indexOf(' ' + fw.toLowerCase() + ' ') + 1;
    const len = fw.length;
    inhalt = (
      <>
        {text.slice(0, idx)}
        <mark className="fragewort">{text.slice(idx, idx + len)}</mark>
        {text.slice(idx + len)}
      </>
    );
  }
  return (
    <div className="frage">
      <h2>{inhalt}</h2>
      <SpeakButton text={text} />
    </div>
  );
}

export function Sterne({ n, max = 3, gross }: { n: number; max?: number; gross?: boolean }) {
  return (
    <span className={`sterne ${gross ? 'gross' : ''}`} aria-label={`${n} von ${max} Sternen`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < n ? 'an' : 'aus'} style={{ animationDelay: `${i * 0.35}s` }}>
          ★
        </span>
      ))}
    </span>
  );
}

export function Fortschritt({ wert, max }: { wert: number; max: number }) {
  return (
    <div
      className="fortschritt"
      role="progressbar"
      aria-valuenow={wert}
      aria-valuemax={max}
      aria-valuemin={0}
    >
      <div style={{ width: `${(100 * wert) / Math.max(1, max)}%` }} />
    </div>
  );
}

export function Eichel({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <ellipse cx="50" cy="58" rx="20" ry="28" fill="#B07A3E" stroke="#6B4A2B" strokeWidth="4" />
      <path d="M28 46 C28 26 72 26 72 46 C72 52 28 52 28 46Z" fill="#6B4A2B" />
      <path d="M50 26 L52 14" stroke="#6B4A2B" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

const TASTEN = ['QWERTZUIOPÜ', 'ASDFGHJKLÖÄ', 'YXCVBNMß'];

/** Große Bildschirmtastatur mit Ä, Ö, Ü, ß und Umschalttaste. */
export function Tastatur({
  onKey,
  gross,
  setGross,
  onEnter,
}: {
  onKey: (k: string) => void;
  gross: boolean;
  setGross: (g: boolean) => void;
  onEnter?: () => void;
}) {
  return (
    <div className="tastatur" role="group" aria-label="Bildschirmtastatur">
      {TASTEN.map((reihe, i) => (
        <div key={i} className="tastatur-reihe">
          {i === 2 && (
            <button
              type="button"
              className={`taste breit ${gross ? 'aktiv' : ''}`}
              onClick={() => setGross(!gross)}
              aria-label="Großbuchstaben"
            >
              ⇧
            </button>
          )}
          {[...reihe].map((k) => {
            const z = k === 'ß' ? 'ß' : gross ? k : k.toLowerCase();
            return (
              <button type="button" key={k} className="taste" onClick={() => onKey(z)}>
                {z}
              </button>
            );
          })}
          {i === 2 && (
            <button type="button" className="taste breit" onClick={() => onKey('⌫')} aria-label="Löschen">
              ⌫
            </button>
          )}
        </div>
      ))}
      {onEnter && (
        <div className="tastatur-reihe">
          <button type="button" className="taste" onClick={() => onKey('-')}>
            -
          </button>
          <button type="button" className="taste leer" onClick={() => onKey(' ')}>
            Leertaste
          </button>
          <button type="button" className="taste breit ok" onClick={onEnter}>
            Fertig ✔
          </button>
        </div>
      )}
    </div>
  );
}
