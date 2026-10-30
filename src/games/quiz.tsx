import { useEffect, useMemo, useState } from 'react';
import { Img } from '../assets/Img';
import { alleFragen } from '../content';
import { stationById, pflichtStationen } from '../content/stations';
import type { ExamConfig, Question, QuizConfig, TrueFalseConfig } from '../content/types';
import { checkSachantwort } from '../engine/answerCheck';
import { shuffle } from '../engine/rng';
import { useProgress } from '../store/progress';
import { useSettings } from '../store/settings';
import { Frage, SpeakButton, Tastatur } from '../components/ui';
import { WeiterKnopf, useVersuche, type GameApi, type GameProps } from './common';

type V = ReturnType<typeof useVersuche>;

/** Eine Frage (Auswahl, Richtig/Falsch oder Freitext) mit Tipp- und Lösungslogik. */
export function QuestionView({
  q,
  v,
  api,
  onWeiter,
}: {
  q: Question;
  v: V;
  api: GameApi;
  onWeiter: () => void;
}) {
  const [status, setStatus] = useState<'offen' | 'richtig' | 'loesung'>('offen');
  const [gewaehlt, setGewaehlt] = useState<number[]>([]);
  const [gesperrt, setGesperrt] = useState<number[]>([]);
  const [eingabe, setEingabe] = useState('');
  const [gross, setGross] = useState(true);
  const [hinweis, setHinweis] = useState<string | null>(null);
  const fehlerwort = useProgress((s) => s.fehlerwort);

  const reihenfolge = useMemo(() => (q.kind === 'mc' ? shuffle(q.optionen.map((_, i) => i)) : []), [q.id]);

  useEffect(() => {
    setStatus('offen');
    setGewaehlt([]);
    setGesperrt([]);
    setEingabe('');
    setGross(true);
    setHinweis(null);
    api.setTipp(
      q.kind === 'tf'
        ? 'Lies die Aussage langsam. Stimmt jedes Wort?'
        : 'Lies die Frage genau. Achte auf das farbige Fragewort!',
    );
  }, [q.id]);

  const fertig = status !== 'offen';
  const multi = q.kind === 'mc' && q.richtig.length > 1;

  function werte(ok: boolean, antwort: string) {
    const loesungText =
      q.kind === 'mc'
        ? `Die Lösung: ${q.richtig.map((i) => q.optionen[i].text ?? '').join(', ')}. ${q.erklaerung}`
        : q.kind === 'tf'
          ? `Die Aussage ist ${q.wahr ? 'richtig' : 'falsch'}. ${q.erklaerung}`
          : `Die Lösung: ${q.loesungen[0]}. ${q.erklaerung}`;
    const tipp =
      q.kind === 'mc'
        ? 'Fast! Ich habe eine falsche Antwort weggenommen. Versuch es noch einmal.'
        : q.kind === 'tf'
          ? 'Bist du sicher? Lies die Aussage noch einmal genau.'
          : 'Noch nicht. Schau dir das Bild an und versuch es noch einmal.';
    const r = v.pruefe(ok, {
      id: q.id,
      factIds: q.factIds,
      tipp,
      loesung: loesungText,
      antwort,
      lobText: ok ? `Richtig! ${'erklaerung' in q ? q.erklaerung : ''}` : undefined,
    });
    if (r === 'tipp' && q.kind === 'mc') {
      const falsche = q.optionen
        .map((_, i) => i)
        .filter((i) => !q.richtig.includes(i) && !gesperrt.includes(i));
      if (falsche.length > 1) setGesperrt([...gesperrt, falsche[0]]);
      setGewaehlt([]);
    }
    if (r !== 'tipp') setStatus(r);
  }

  function waehle(i: number) {
    if (fertig || gesperrt.includes(i) || q.kind !== 'mc') return;
    if (multi) {
      setGewaehlt(gewaehlt.includes(i) ? gewaehlt.filter((x) => x !== i) : [...gewaehlt, i]);
      return;
    }
    setGewaehlt([i]);
    werte(q.richtig.includes(i), q.optionen[i].text ?? String(i));
  }

  function pruefeMulti() {
    if (q.kind !== 'mc') return;
    const ok = gewaehlt.length === q.richtig.length && gewaehlt.every((i) => q.richtig.includes(i));
    werte(ok, gewaehlt.map((i) => q.optionen[i].text).join(', '));
  }

  function pruefeText() {
    if (q.kind !== 'text' || !eingabe.trim()) return;
    const r = checkSachantwort(eingabe, q.loesungen);
    if (r.ok && !r.exakt) {
      setHinweis(`Richtig! So schreibt man es: ${r.korrekt}`);
      fehlerwort(r.korrekt);
    }
    if (!r.ok) fehlerwort(q.loesungen[0]);
    werte(r.ok, eingabe);
  }

  const optRichtig = (i: number) => fertig && q.kind === 'mc' && q.richtig.includes(i);

  return (
    <div className="frage-view">
      <Frage text={q.kind === 'tf' ? q.aussage : q.frage} />
      {'bild' in q && q.bild && <Img id={q.bild} className="frage-bild" />}

      {q.kind === 'mc' && (
        <>
          {multi && <p className="hinweis">Mehrere Antworten sind richtig.</p>}
          <div className={`optionen ${q.optionen.some((o) => o.bild) ? 'mit-bild' : ''}`}>
            {reihenfolge.map((i) => {
              const o = q.optionen[i];
              const cls = [
                'option',
                gewaehlt.includes(i) ? 'gewaehlt' : '',
                gesperrt.includes(i) ? 'gesperrt' : '',
                optRichtig(i) ? 'korrekt' : '',
              ].join(' ');
              return (
                <div key={i} className="option-wrap">
                  <button
                    type="button"
                    className={cls}
                    onClick={() => waehle(i)}
                    disabled={gesperrt.includes(i)}
                    aria-pressed={gewaehlt.includes(i)}
                  >
                    {o.bild && <Img id={o.bild} className="option-bild" />}
                    {o.text && <span>{o.text}</span>}
                    {optRichtig(i) && (
                      <span className="haken" aria-label="richtig">
                        ✔
                      </span>
                    )}
                  </button>
                  {o.text && <SpeakButton text={o.text} klein />}
                </div>
              );
            })}
          </div>
          {multi && !fertig && (
            <button type="button" className="knopf" onClick={pruefeMulti} disabled={!gewaehlt.length}>
              Prüfen
            </button>
          )}
        </>
      )}

      {q.kind === 'tf' && (
        <div className="daumen">
          <button
            type="button"
            className={`option daumen-hoch ${fertig && q.wahr ? 'korrekt' : ''}`}
            disabled={fertig}
            onClick={() => werte(q.wahr, 'richtig')}
          >
            <span className="emoji">👍</span> richtig
          </button>
          <button
            type="button"
            className={`option daumen-runter ${fertig && !q.wahr ? 'korrekt' : ''}`}
            disabled={fertig}
            onClick={() => werte(!q.wahr, 'falsch')}
          >
            <span className="emoji">👎</span> falsch
          </button>
        </div>
      )}

      {q.kind === 'text' && (
        <div className="freitext">
          <div className="eingabe" aria-live="polite">
            {eingabe || <span className="platzhalter">Tippe dein Wort …</span>}
            <span className="cursor">|</span>
          </div>
          {!fertig && (
            <Tastatur
              gross={gross}
              setGross={setGross}
              onEnter={pruefeText}
              onKey={(k) => {
                if (k === '⌫') setEingabe(eingabe.slice(0, -1));
                else {
                  setEingabe(eingabe + k);
                  if (gross) setGross(false);
                }
              }}
            />
          )}
          {hinweis && <p className="schreibweise">{hinweis}</p>}
          {fertig && q.kind === 'text' && <p className="schreibweise gross">{q.loesungen[0]}</p>}
        </div>
      )}

      {fertig && <WeiterKnopf onClick={onWeiter} />}
    </div>
  );
}

/** G01 Bild-Quiz und G02 Richtig oder falsch (gemischte Fragenliste). */
export function QuizGame({ config, api }: GameProps<QuizConfig | TrueFalseConfig>) {
  const fragen = useMemo(() => shuffle(config.fragen).slice(0, config.anzahl ?? 7), []);
  return <FragenFolge fragen={fragen} api={api} blitz={config.kind === 'truefalse'} />;
}

export function FragenFolge({
  fragen,
  api,
  blitz,
  onEnde,
}: {
  fragen: Question[];
  api: GameApi;
  blitz?: boolean;
  onEnde?: (r: ReturnType<V['ergebnis']>) => void;
}) {
  const v = useVersuche(api);
  const [i, setI] = useState(0);
  const blitzAn = useSettings((s) => s.blitzrunden) && blitz;
  const [zeit, setZeit] = useState(60);

  useEffect(() => api.fortschritt(i, fragen.length), [i]);
  useEffect(() => {
    if (!blitzAn) return;
    const t = setInterval(() => setZeit((z) => z - 1), 1000);
    return () => clearInterval(t);
  }, [blitzAn]);
  useEffect(() => {
    if (blitzAn && zeit <= 0) ende();
  }, [zeit]);

  function ende() {
    const r = v.ergebnis();
    if (onEnde) onEnde(r);
    else api.finish({ ...r, gesamt: Math.max(r.gesamt, blitzAn ? r.gesamt : fragen.length) });
  }

  function weiter() {
    if (i + 1 >= fragen.length) ende();
    else setI(i + 1);
  }

  return (
    <div>
      {blitzAn && <div className="blitz">⏱ {zeit} s</div>}
      <QuestionView key={fragen[i].id} q={fragen[i]} v={v} api={api} onWeiter={weiter} />
    </div>
  );
}

/** G22 Waldprüfung: 20 gemischte Aufgaben aus allen Pflichtmodulen. */
export function ExamGame({ config, api }: GameProps<ExamConfig>) {
  const fragen = useMemo(() => {
    const module = new Set(pflichtStationen.map((s) => s.modul));
    const pool = alleFragen.filter((q) => module.has(q.id.slice(0, 3) as never));
    // aus jedem Modul mindestens eine Frage, dann auffüllen
    const jeModul = [...module]
      .map((m) => shuffle(pool.filter((q) => q.id.startsWith(m)))[0])
      .filter(Boolean);
    const rest = shuffle(pool.filter((q) => !jeModul.includes(q)));
    return shuffle([...jeModul, ...rest].slice(0, config.anzahl));
  }, []);
  return <FragenFolge fragen={fragen} api={api} />;
}

export const stationTitel = (id: string) => stationById[id]?.titel ?? id;
