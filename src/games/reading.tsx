import { useEffect, useMemo, useState } from 'react';
import type { ErrorWordsConfig, ReadingConfig } from '../content/types';
import { shuffle } from '../engine/rng';
import { Frage, SpeakButton } from '../components/ui';
import { WeiterKnopf, useVersuche, type GameProps } from './common';

/** G17 Lesedetektiv: eigener Text mit Zeilennummern, Zeile antippen und gelb markieren. */
export function ReadingGame({ config, api }: GameProps<ReadingConfig>) {
  const fragen = useMemo(() => shuffle(config.fragen), []);
  const v = useVersuche(api);
  const [i, setI] = useState(0);
  const [markiert, setMarkiert] = useState<number | null>(null);
  const [fertig, setFertig] = useState(false);
  const f = fragen[i];

  useEffect(() => {
    api.fortschritt(i, fragen.length);
    api.setTipp(
      `Achte auf das Fragewort „${f.fragewort}“. Lies Zeile für Zeile und suche das passende Wort.`,
    );
    setMarkiert(null);
    setFertig(false);
  }, [i]);

  function tippe(zeile: number) {
    if (fertig) return;
    setMarkiert(zeile);
    const r = v.pruefe(zeile === f.zeile, {
      id: f.id,
      factIds: f.factIds,
      antwort: String(zeile),
      tipp: `Zeile ${zeile} passt noch nicht. Lies weiter!`,
      loesung: `Es steht in Zeile ${f.zeile}: „${config.zeilen[f.zeile - 1]}“`,
      ohneLeitner: true,
    });
    if (r !== 'tipp') {
      setMarkiert(f.zeile);
      setFertig(true);
    }
  }

  return (
    <div className="lese-game">
      <div className="lese-text">
        <h3>
          {config.titel} <SpeakButton text={config.zeilen.join(' ')} klein label="Ganzen Text vorlesen" />
        </h3>
        <ol>
          {config.zeilen.map((z, n) => (
            <li key={n}>
              <button
                type="button"
                className={`zeile ${markiert === n + 1 ? (fertig ? 'gelb' : 'versuch') : ''}`}
                onClick={() => tippe(n + 1)}
              >
                <span className="zeilen-nr">{n + 1}</span> {z}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="lese-frage">
        <Frage text={f.frage} />
        {fertig && (
          <WeiterKnopf onClick={() => (i + 1 >= fragen.length ? api.finish(v.ergebnis()) : setI(i + 1))} />
        )}
      </div>
    </div>
  );
}

/** G18 Fehlerwörter finden: falsches Wort antippen, richtiges auswählen. */
export function ErrorWordsGame({ config, api }: GameProps<ErrorWordsConfig>) {
  const saetze = useMemo(() => shuffle(config.saetze), []);
  const v = useVersuche(api);
  const [i, setI] = useState(0);
  const [korrigiert, setKorrigiert] = useState<Record<string, string>>({});
  const [auswahl, setAuswahl] = useState<string | null>(null);
  const s = saetze[i];
  const woerter = s.satz.split(' ');
  const fertig = s.fehler.every((f) => korrigiert[f.falsch]);
  const optionen = useMemo(
    () => (auswahl ? shuffle(s.fehler.find((f) => f.falsch === auswahl)!.optionen) : []),
    [auswahl],
  );

  useEffect(() => {
    api.fortschritt(i, saetze.length);
    api.setTipp(
      `In diesem Satz ${s.fehler.length === 1 ? 'ist 1 Wort' : `sind ${s.fehler.length} Wörter`} falsch. Was weißt du über das Thema?`,
    );
    setKorrigiert({});
    setAuswahl(null);
  }, [i]);

  function tippeWort(w: string) {
    if (korrigiert[w]) return;
    const fehler = s.fehler.find((f) => f.falsch === w);
    const r = v.pruefe(!!fehler, {
      id: `${s.id}-finden-${w}`,
      factIds: s.factIds,
      ohneLeitner: true,
      antwort: w,
      tipp: `„${w.replace(/[.,]/g, '')}“ stimmt. Suche weiter!`,
      loesung: `Falsch war: „${s.fehler.find((f) => !korrigiert[f.falsch])!.falsch.replace(/[.,]/g, '')}“.`,
      lobText: 'Gefunden! Welches Wort ist richtig?',
    });
    if (r === 'richtig') setAuswahl(w);
    if (r === 'loesung') setAuswahl(s.fehler.find((f) => !korrigiert[f.falsch])!.falsch);
  }

  function ersetze(o: string) {
    const f = s.fehler.find((x) => x.falsch === auswahl)!;
    const r = v.pruefe(o === f.richtig, {
      id: `${s.id}-${f.falsch}`,
      factIds: s.factIds,
      antwort: o,
      tipp: 'Das passt nicht. Denk an den Text!',
      loesung: `Richtig ist: „${f.richtig}“.`,
    });
    if (r !== 'tipp') {
      setKorrigiert({ ...korrigiert, [f.falsch]: f.richtig });
      setAuswahl(null);
    }
  }

  return (
    <div className="fehler-game">
      <Frage text="Finde das falsche Wort im Satz und tippe es an." autoRead={i === 0} />
      <p className="fehler-satz">
        {woerter.map((w, n) => (
          <button
            key={n}
            type="button"
            className={`satz-wort ${korrigiert[w] ? 'korrigiert' : ''} ${auswahl === w ? 'aktiv' : ''}`}
            onClick={() => tippeWort(w)}
            disabled={fertig}
          >
            {korrigiert[w] ? (
              <>
                <s>{w}</s> {korrigiert[w]}
              </>
            ) : (
              w
            )}
          </button>
        ))}
        <SpeakButton text={s.satz} klein />
      </p>
      {auswahl && !fertig && (
        <div className="optionen">
          {optionen.map((o) => (
            <button key={o} type="button" className="option" onClick={() => ersetze(o)}>
              {o}
            </button>
          ))}
        </div>
      )}
      {fertig && (
        <WeiterKnopf onClick={() => (i + 1 >= saetze.length ? api.finish(v.ergebnis()) : setI(i + 1))} />
      )}
    </div>
  );
}
