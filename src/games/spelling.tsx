import { useEffect, useMemo, useState } from 'react';
import { Img } from '../assets/Img';
import type { SpellingConfig } from '../content/types';
import { schwerpunkte, wortBild, type WerkstattWort } from '../content/words';
import { checkExakt } from '../engine/answerCheck';
import { shuffle } from '../engine/rng';
import { sprich } from '../lib/tts';
import { useProgress } from '../store/progress';
import { Frage, SpeakButton, Tastatur } from '../components/ui';
import { WeiterKnopf, lob, useVersuche, type GameApi, type GameProps } from './common';

/** Ein Wort in der Werkstatt: erst Lücke oder Silben, dann ganz schreiben (exakte Prüfung). */
function WerkstattAufgabe({
  w,
  api,
  v,
  schwerpunkt,
  onFertig,
}: {
  w: WerkstattWort;
  api: GameApi;
  v: ReturnType<typeof useVersuche>;
  schwerpunkt: string;
  onFertig: (ok: boolean) => void;
}) {
  const [schritt, setSchritt] = useState<'luecke' | 'silben' | 'schreiben' | 'fertig'>(
    w.luecke ? 'luecke' : w.silben ? 'silben' : 'schreiben',
  );
  const [lueckeGewaehlt, setLueckeGewaehlt] = useState<string | null>(null);
  const [silben, setSilben] = useState<number[]>([]);
  const silbenGemischt = useMemo(() => (w.silben ? shuffle(w.silben.map((_, i) => i)) : []), [w.wort]);
  const [eingabe, setEingabe] = useState('');
  const [gross, setGross] = useState(/^[A-ZÄÖÜ]/.test(w.wort));
  const [fehlschlaege, setFehlschlaege] = useState(0);
  const [ok, setOk] = useState(false);
  const werkstattErgebnis = useProgress((s) => s.werkstattErgebnis);

  useEffect(() => {
    sprich(w.wort);
    api.setTipp(w.hinweis ?? 'Sprich das Wort langsam und deutlich. Hörst du einen langen oder kurzen Laut?');
  }, [w.wort]);

  function waehleLuecke(o: string) {
    const r = v.pruefe(o === w.luecke!.richtig, {
      id: `werkstatt-${schwerpunkt}-${w.wort}`,
      factIds: ['m11-woerter'],
      ohneLeitner: true,
      antwort: o,
      tipp: w.hinweis ?? 'Hör noch einmal genau hin.',
      loesung: `Richtig ist: ${w.wort}`,
    });
    if (r === 'tipp') return;
    setLueckeGewaehlt(w.luecke!.richtig);
    setTimeout(() => setSchritt('schreiben'), 700);
  }

  function legeSilbe(i: number) {
    const neu = [...silben, i];
    const soll = neu.length - 1;
    if (i !== soll) {
      api.sag('Diese Silbe kommt später. Klatsche das Wort langsam mit.', 'tipp');
      return;
    }
    setSilben(neu);
    if (neu.length === w.silben!.length) {
      v.pruefe(true, {
        id: `silben-${w.wort}`,
        factIds: ['m11-woerter'],
        ohneLeitner: true,
        tipp: '',
        loesung: '',
      });
      setTimeout(() => setSchritt('schreiben'), 700);
    }
  }

  function pruefeSchreiben() {
    if (!eingabe) return;
    if (checkExakt(eingabe, w.wort)) {
      api.task({
        id: `schreib-${w.wort}`,
        factIds: ['m11-woerter'],
        versuch: (fehlschlaege + 1) as 1 | 2,
        ohneLeitner: true,
      });
      werkstattErgebnis(w.wort, fehlschlaege === 0);
      api.sag(lob(), 'richtig');
      setOk(true);
      setSchritt('fertig');
      return;
    }
    if (fehlschlaege === 0) {
      const tipp =
        eingabe.toLowerCase() === w.wort.toLowerCase()
          ? 'Fast! Achte auf große und kleine Buchstaben.'
          : 'Noch nicht ganz. Vergleiche Buchstabe für Buchstabe.';
      api.sag(tipp, 'tipp');
      setFehlschlaege(1);
      return;
    }
    api.task({ id: `schreib-${w.wort}`, factIds: ['m11-woerter'], versuch: 3, ohneLeitner: true });
    werkstattErgebnis(w.wort, false);
    api.sag(`So schreibt man es: ${w.wort}`, 'loesung');
    setSchritt('fertig');
  }

  return (
    <div className="werkstatt-aufgabe">
      {wortBild[w.wort] && <Img id={wortBild[w.wort]} className="werkstatt-bild" />}
      <button type="button" className="knopf leise" onClick={() => sprich(w.wort)}>
        🔊 Wort anhören
      </button>
      {schritt === 'luecke' && w.luecke && (
        <>
          <p className="luecken-wort">
            {w.luecke.vor}
            <span className="luecke gross">{lueckeGewaehlt === '–' ? '' : (lueckeGewaehlt ?? '?')}</span>
            {w.luecke.nach}
          </p>
          <div className="optionen">
            {w.luecke.optionen.map((o) => (
              <button
                key={o}
                type="button"
                className="option"
                onClick={() => waehleLuecke(o)}
                disabled={!!lueckeGewaehlt}
              >
                {o === '–' ? 'nichts' : o}
              </button>
            ))}
          </div>
        </>
      )}
      {schritt === 'silben' && w.silben && (
        <>
          <p className="luecken-wort">{silben.map((i) => w.silben![i]).join('·') || '…'}</p>
          <div className="optionen">
            {silbenGemischt.map((i) => (
              <button
                key={i}
                type="button"
                className="option silbe"
                disabled={silben.includes(i)}
                onClick={() => legeSilbe(i)}
              >
                {w.silben![i]}
              </button>
            ))}
          </div>
        </>
      )}
      {schritt === 'schreiben' && (
        <>
          <p className="hinweis">Jetzt schreibe das ganze Wort.</p>
          <div className="eingabe gross">
            {eingabe || <span className="platzhalter">…</span>}
            <span className="cursor">|</span>
          </div>
          <Tastatur
            gross={gross}
            setGross={setGross}
            onEnter={pruefeSchreiben}
            onKey={(k) => {
              if (k === '⌫') setEingabe(eingabe.slice(0, -1));
              else {
                setEingabe(eingabe + k);
                if (gross) setGross(false);
              }
            }}
          />
        </>
      )}
      {schritt === 'fertig' && (
        <>
          <p className={`schreibweise gross ${ok ? 'ok' : ''}`}>{w.wort}</p>
          <WeiterKnopf onClick={() => onFertig(ok)} />
        </>
      )}
    </div>
  );
}

/** Eine Übungsrunde zu einem Schwerpunkt oder zur Fehlerwörter-Kiste. */
function Runde({ id, api, onEnde }: { id: string; api: GameApi; onEnde: () => void }) {
  const fehlerwoerter = useProgress((s) => s.fehlerwoerter);
  const zaehler = useProgress((s) => s.zaehler);
  const zaehle = useProgress((s) => s.zaehle);
  const sp = schwerpunkte.find((s) => s.id === id);
  const woerter = useMemo<WerkstattWort[]>(() => {
    if (id === 'kiste')
      return shuffle(fehlerwoerter)
        .slice(0, 8)
        .map((wort) => ({ wort }));
    const liste = shuffle(sp!.woerter);
    if (id === 'dehnungs-h') return [...liste, ...shuffle(sp!.woerter)].slice(0, 10);
    return liste.slice(0, 8);
  }, [id]);
  const v = useVersuche(api);
  const [i, setI] = useState(0);

  useEffect(() => api.fortschritt(i, woerter.length), [i]);

  function fertig(ok: boolean) {
    if (id === 'dehnungs-h') {
      const serie = ok ? (zaehler.dehnungshSerie ?? 0) + 1 : 0;
      zaehle('dehnungshSerie', serie, true);
      if (serie > (zaehler.dehnungshMax ?? 0)) zaehle('dehnungshMax', serie, true);
    }
    if (i + 1 >= woerter.length) {
      api.finish(v.ergebnis());
      onEnde();
    } else setI(i + 1);
  }

  if (!woerter.length) return <p>Die Fehlerwörter-Kiste ist leer. Super!</p>;
  return (
    <div>
      {sp && (
        <div className="regel">
          <strong>{sp.titel}:</strong> {sp.regel} <SpeakButton text={sp.regel} klein />
        </div>
      )}
      <WerkstattAufgabe
        key={`${i}-${woerter[i].wort}`}
        w={woerter[i]}
        api={api}
        v={v}
        schwerpunkt={id}
        onFertig={fertig}
      />
    </div>
  );
}

/** G19 Schreib-Werkstatt: Auswahl der Schwerpunkte und Fehlerwörter-Kiste. */
export function SpellingGame({ config, api }: GameProps<SpellingConfig>) {
  const [wahl, setWahl] = useState<string | null>(config.schwerpunkt ?? null);
  const fehlerwoerter = useProgress((s) => s.fehlerwoerter);
  const werkstatt = useProgress((s) => s.werkstatt);

  if (wahl) return <Runde id={wahl} api={api} onEnde={() => undefined} />;
  return (
    <div className="werkstatt-wahl">
      <Frage text="Was möchtest du üben?" autoRead={false} />
      <div className="kacheln-gross">
        <button
          type="button"
          className="werkstatt-kachel kiste"
          onClick={() => setWahl('kiste')}
          disabled={!fehlerwoerter.length}
        >
          <span className="emoji">📦</span>
          <strong>Fehlerwörter-Kiste</strong>
          <span>{fehlerwoerter.length} Wörter</span>
        </button>
        {schwerpunkte.map((s) => {
          const richtig = s.woerter.filter((w) => (werkstatt[w.wort]?.richtig ?? 0) > 0).length;
          return (
            <button key={s.id} type="button" className="werkstatt-kachel" onClick={() => setWahl(s.id)}>
              <strong>{s.titel}</strong>
              <span>
                {richtig} / {s.woerter.length} geübt
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
