import { useEffect, useMemo, useState } from 'react';
import { Img } from '../assets/Img';
import type { CacheConfig, CleanupConfig, LeafLabConfig } from '../content/types';
import { shuffle } from '../engine/rng';
import { sound } from '../lib/sound';
import { Pinsel } from '../components/Pinsel';
import { Frage, SpeakButton } from '../components/ui';
import { useDrag } from '../components/drag';
import { Karte, WeiterKnopf, useVersuche, type GameProps } from './common';

const VERSTECKE: [number, number, string][] = [
  [10, 70, 'Baumstumpf'],
  [24, 52, 'Wurzel'],
  [40, 78, 'Moos'],
  [52, 46, 'Astloch'],
  [66, 74, 'Stein'],
  [82, 58, 'Laubhaufen'],
  [16, 38, 'Strauch'],
  [32, 64, 'Pilz'],
  [46, 60, 'Farn'],
  [60, 34, 'Kobel'],
  [74, 42, 'Zweig'],
  [90, 76, 'Baumhöhle'],
];

/** G20 Eichhörnchen-Vorrat: Herbst verstecken, Winter wiederfinden. */
export function CacheGame({ config, api }: GameProps<CacheConfig>) {
  const [anzahl, setAnzahl] = useState<6 | 12>(config.verstecke);
  const plaetze = VERSTECKE.slice(0, anzahl);
  const [phase, setPhase] = useState<'wahl' | 'herbst' | 'winter' | 'ende'>('wahl');
  const nuesse = useMemo(
    () => shuffle(plaetze.map((_, i) => i)).slice(0, Math.ceil(anzahl / 2)),
    [anzahl, phase === 'herbst'],
  );
  const [gezeigt, setGezeigt] = useState(0);
  const [offen, setOffen] = useState<number[]>([]);
  const [gefunden, setGefunden] = useState<number[]>([]);
  const [versuche, setVersuche] = useState(0);
  const maxVersuche = nuesse.length + Math.ceil(anzahl / 3);

  useEffect(() => api.setTipp('Merke dir genau, wo Pinsel die Nüsse versteckt. Im Winter liegt Schnee!'), []);
  useEffect(() => {
    if (phase !== 'herbst') return;
    if (gezeigt >= nuesse.length) {
      const t = setTimeout(() => setPhase('winter'), 1600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setGezeigt((g) => g + 1), 1300);
    return () => clearTimeout(t);
  }, [phase, gezeigt]);

  function suche(i: number) {
    if (phase !== 'winter' || offen.includes(i)) return;
    setOffen([...offen, i]);
    setVersuche((v) => v + 1);
    if (nuesse.includes(i)) {
      sound.richtig();
      const neu = [...gefunden, i];
      setGefunden(neu);
      if (neu.length === nuesse.length) ende(neu.length);
    } else {
      sound.falsch();
      if (versuche + 1 >= maxVersuche) ende(gefunden.length);
    }
  }

  function ende(n: number) {
    api.task({
      id: 'vorrat',
      factIds: ['m09-winterruhe'],
      versuch: n === nuesse.length ? 1 : n >= nuesse.length / 2 ? 2 : 3,
      ohneLeitner: true,
    });
    if (n === nuesse.length) api.zaehle('vorrat');
    api.sag(
      'Das Eichhörnchen hält Winterruhe, keinen Winterschlaf. Es wacht immer wieder auf und sucht seine Vorräte.',
      'info',
    );
    setPhase('ende');
    setTimeout(() => api.finish({ richtig: n, gesamt: nuesse.length, versuche, fehler: [] }), 3500);
  }

  if (phase === 'wahl')
    return (
      <div className="cache-wahl">
        <Frage text="Wie viele Verstecke möchtest du?" />
        <div className="optionen">
          <button
            type="button"
            className="option"
            onClick={() => {
              setAnzahl(6);
              setPhase('herbst');
            }}
          >
            6 Verstecke (leicht)
          </button>
          <button
            type="button"
            className="option"
            onClick={() => {
              setAnzahl(12);
              setPhase('herbst');
            }}
          >
            12 Verstecke (schwer)
          </button>
        </div>
      </div>
    );

  return (
    <div className={`cache-game ${phase === 'winter' || phase === 'ende' ? 'winter' : 'herbst'}`}>
      <p className="cache-text">
        {phase === 'herbst'
          ? '🍂 Herbst: Pinsel versteckt Nüsse. Schau genau hin!'
          : phase === 'winter'
            ? `❄️ Winter: Finde die ${nuesse.length} Nüsse! Noch ${maxVersuche - versuche} Versuche.`
            : `Du hast ${gefunden.length} von ${nuesse.length} Nüssen gefunden.`}
      </p>
      <div className="cache-flaeche">
        {plaetze.map(([x, y, name], i) => {
          const zeige =
            (phase === 'herbst' && nuesse.slice(0, gezeigt).includes(i)) ||
            (offen.includes(i) && nuesse.includes(i)) ||
            (phase === 'ende' && nuesse.includes(i));
          return (
            <button
              key={i}
              type="button"
              className={`versteck ${offen.includes(i) ? 'offen' : ''}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => suche(i)}
              aria-label={name}
              disabled={phase !== 'winter'}
            >
              {zeige ? <Img id="nuss" size={48} /> : <span className="versteck-name">{name}</span>}
            </button>
          );
        })}
        <div className="cache-pinsel">
          <Pinsel pose={phase === 'herbst' ? 'zeigt' : phase === 'ende' ? 'feiert' : 'denkt'} size={110} />
        </div>
      </div>
    </div>
  );
}

function Muell({
  id,
  label,
  bild,
  aktiv,
  onTap,
  onDrop,
}: {
  id: string;
  label: string;
  bild: string;
  aktiv: boolean;
  onTap: () => void;
  onDrop: (z: string) => void;
}) {
  const drag = useDrag(onDrop, onTap);
  return (
    <button
      type="button"
      className={`zieh-karte muell ${aktiv ? 'aktiv' : ''}`}
      data-muell={id}
      aria-pressed={aktiv}
      {...drag}
    >
      <Karte bild={bild} text={label} klein />
    </button>
  );
}

/** G21 Waldputz: Müll einsammeln und in Tonnen sortieren, danach Recycling-Weg der Dose. */
export function CleanupGame({ config, api }: GameProps<CleanupConfig>) {
  const runde = useMemo(
    () =>
      shuffle([...config.teile, ...shuffle(config.teile).slice(0, 4)]).map((t, i) => ({
        ...t,
        uid: `${t.id}-${i}`,
        x: 6 + ((i * 37) % 86),
        y: 10 + ((i * 53) % 70),
      })),
    [],
  );
  const v = useVersuche(api);
  const [phase, setPhase] = useState<'sammeln' | 'sortieren' | 'dose'>('sammeln');
  const [gesammelt, setGesammelt] = useState<string[]>([]);
  const [sortiert, setSortiert] = useState<string[]>([]);
  const [wahl, setWahl] = useState<string | null>(null);

  useEffect(
    () =>
      api.setTipp(
        phase === 'sammeln'
          ? 'Tippe jedes Müllteil im Wald an.'
          : 'Verpackungen in die gelbe Tonne, Papier in die blaue, Glas in den Container, Essensreste in die Biotonne.',
      ),
    [phase],
  );
  useEffect(() => {
    api.fortschritt(gesammelt.length + sortiert.length, runde.length * 2);
    if (phase === 'sammeln' && gesammelt.length === runde.length)
      setTimeout(() => setPhase('sortieren'), 600);
    if (phase === 'sortieren' && sortiert.length === runde.length) setTimeout(() => setPhase('dose'), 600);
  }, [gesammelt.length, sortiert.length]);

  function werfe(uid: string, tonne: string) {
    const t = runde.find((x) => x.uid === uid)!;
    const ziel = config.tonnen.find((x) => x.id === t.tonne)!;
    const r = v.pruefe(t.tonne === tonne, {
      id: `muell-${uid}`,
      factIds: ['m12-recycling'],
      ohneLeitner: true,
      antwort: tonne,
      tipp: `Gehört ${t.label} wirklich hier hinein?`,
      loesung: `${t.label} gehört in: ${ziel.titel}.`,
    });
    if (r === 'richtig') api.zaehle('muell');
    if (r !== 'tipp') setSortiert([...sortiert, uid]);
    setWahl(null);
  }

  if (phase === 'sammeln')
    return (
      <div className="waldputz">
        <Frage text="Oje, jemand hat Müll im Wald gelassen! Sammle alles ein." />
        <div className="waldputz-wald">
          {runde.map((t) =>
            gesammelt.includes(t.uid) ? null : (
              <button
                key={t.uid}
                type="button"
                className="muell-im-wald"
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
                onClick={() => {
                  sound.klick();
                  setGesammelt([...gesammelt, t.uid]);
                }}
                aria-label={t.label}
              >
                <Img id={t.bild} size={56} />
              </button>
            ),
          )}
        </div>
      </div>
    );

  if (phase === 'sortieren')
    return (
      <div className="waldputz">
        <Frage text="Sortiere den Müll in die richtige Tonne." autoRead={false} />
        <div className="tonnen">
          {config.tonnen.map((t) => (
            <div
              key={t.id}
              className={`tonne ${wahl ? 'bereit' : ''}`}
              style={{ background: t.farbe }}
              data-drop={t.id}
              onClick={() => wahl && werfe(wahl, t.id)}
              role="button"
              tabIndex={0}
            >
              <span>🗑</span>
              <strong>{t.titel}</strong>
            </div>
          ))}
        </div>
        <div className="stapel">
          {runde
            .filter((t) => !sortiert.includes(t.uid))
            .slice(0, 5)
            .map((t) => (
              <Muell
                key={t.uid}
                id={t.uid}
                label={t.label}
                bild={t.bild}
                aktiv={wahl === t.uid}
                onTap={() => setWahl(wahl === t.uid ? null : t.uid)}
                onDrop={(z) => werfe(t.uid, z)}
              />
            ))}
        </div>
      </div>
    );

  return (
    <div className="dosen-weg">
      <Frage text="Der Weg einer Dose beim Wiederverwerten" />
      <ol className="weg">
        <li>
          <Img id="dose" size={80} /> Die Dose wird <strong>gesammelt</strong>.
        </li>
        <li>
          <Img id="fabrik" size={80} /> Sie kommt zurück in die <strong>Fabrik</strong>.
        </li>
        <li>
          <Img id="recycling" size={80} /> Daraus entsteht ein <strong>neues Produkt</strong>.
        </li>
      </ol>
      <p>
        So entsteht weniger Abfall und wir sparen Rohstoffe.{' '}
        <SpeakButton
          text="Die Dose wird gesammelt. Sie kommt zurück in die Fabrik. Daraus entsteht ein neues Produkt. So entsteht weniger Abfall und wir sparen Rohstoffe."
          klein
        />
      </p>
      <WeiterKnopf onClick={() => api.finish(v.ergebnis())} text="Fertig" />
    </div>
  );
}

/** G24 Blatt-Labor: Zutaten ins Blatt ziehen, dann Jahreszeiten-Regler, Abschluss Blutbuche. */
export function LeafLabGame({ api }: GameProps<LeafLabConfig>) {
  const v = useVersuche(api);
  const ZUTATEN = [
    { id: 'wasser', label: 'Wasser', richtig: true },
    { id: 'co2', label: 'Kohlenstoffdioxid', richtig: true },
    { id: 'sonnenlicht', label: 'Sonnenlicht', richtig: true },
    { id: 'zucker', label: 'Zucker', richtig: false },
    { id: 'pilz', label: 'Pilz', richtig: false },
  ];
  const auswahl = useMemo(() => shuffle(ZUTATEN), []);
  const [drin, setDrin] = useState<string[]>([]);
  const [wahl, setWahl] = useState<string | null>(null);
  const [phase, setPhase] = useState<'zutaten' | 'herbst' | 'blutbuche'>('zutaten');
  const [stufe, setStufe] = useState(0);
  const produziert = drin.length === 3;

  const STUFEN = [
    { text: 'Sommer: Lange Tage. Das Blatt ist grün und macht viel Zucker.', bild: 'blatt-gruen' },
    { text: 'Herbst: Die Tage werden kürzer. Der Baum macht weniger Nahrung.', bild: 'blatt-gruen' },
    { text: 'Das wertvolle Grün wird in die Zweige zurückgeholt.', bild: 'zweig-speicher' },
    { text: 'Jetzt sieht man Gelb und Rot. Sie waren vorher vom Grün verdeckt.', bild: 'blatt-gelb' },
    { text: 'Das Blatt fällt ab. So trocknet der Baum im Winter nicht aus.', bild: 'blatt-rot' },
  ];

  useEffect(() => api.setTipp('Was braucht der Baum, um Zucker zu machen? Drei Zutaten!'), []);
  useEffect(
    () => api.fortschritt(phase === 'zutaten' ? drin.length : phase === 'herbst' ? 3 + stufe : 8, 9),
    [drin.length, stufe, phase],
  );

  function gib(id: string) {
    const z = ZUTATEN.find((x) => x.id === id)!;
    if (drin.includes(id)) return;
    const r = v.pruefe(z.richtig, {
      id: `labor-${id}`,
      factIds: ['m15-zutaten'],
      ohneLeitner: true,
      antwort: id,
      tipp: `${z.label} ist keine Zutat. ${id === 'zucker' ? 'Zucker entsteht erst im Blatt!' : 'Überlege noch einmal.'}`,
      loesung: 'Die drei Zutaten sind Wasser, Kohlenstoffdioxid und Sonnenlicht.',
      lobText: `Ja! ${z.label} kommt ins Blatt.`,
    });
    if (r !== 'tipp' && z.richtig) setDrin([...drin, id]);
    if (r === 'loesung') setDrin(['wasser', 'co2', 'sonnenlicht']);
    setWahl(null);
  }

  if (phase === 'zutaten')
    return (
      <div className="labor">
        <Frage text="Ziehe die drei Zutaten ins Blatt." />
        <div className="labor-flaeche">
          <div
            className={`labor-blatt ${wahl ? 'bereit' : ''}`}
            data-drop="blatt"
            onClick={() => wahl && gib(wahl)}
            role="button"
            tabIndex={0}
            aria-label="Blatt"
          >
            <Img id="blatt-gruen" />
            <div className="labor-drin">
              {drin.map((d) => (
                <Img key={d} id={d} size={48} />
              ))}
            </div>
            {produziert && (
              <div className="labor-produkt">
                <span>
                  <Img id="zucker" size={56} /> Zucker
                </span>
                <span>
                  <Img id="sauerstoff" size={56} /> Sauerstoff
                </span>
              </div>
            )}
          </div>
          <div className="stapel senkrecht">
            {auswahl
              .filter((z) => !drin.includes(z.id))
              .map((z) => (
                <LaborKarte
                  key={z.id}
                  id={z.id}
                  label={z.label}
                  aktiv={wahl === z.id}
                  onTap={() => setWahl(wahl === z.id ? null : z.id)}
                  onDrop={() => gib(z.id)}
                />
              ))}
          </div>
        </div>
        {produziert && (
          <>
            <p className="ergebnis-text">
              Das Blatt macht <strong>Zucker</strong> (Nahrung für den Baum) und <strong>Sauerstoff</strong>{' '}
              (für uns Menschen).
            </p>
            <WeiterKnopf onClick={() => setPhase('herbst')} text="Zum Herbst" />
          </>
        )}
      </div>
    );

  if (phase === 'herbst')
    return (
      <div className="labor">
        <Frage text="Schiebe den Regler: Was passiert im Herbst?" autoRead={false} />
        <div className="labor-herbst">
          <Img id={STUFEN[stufe].bild} className={`labor-stufe-bild ${stufe === 4 ? 'faellt' : ''}`} />
          <p>
            {STUFEN[stufe].text} <SpeakButton text={STUFEN[stufe].text} klein />
          </p>
          <input
            type="range"
            min={0}
            max={4}
            value={stufe}
            onChange={(e) => setStufe(Number(e.target.value))}
            aria-label="Jahreszeiten-Regler"
            className="regler"
          />
          <div className="regler-beschriftung">
            <span>☀️ Sommer</span>
            <span>🍂 Herbst</span>
          </div>
        </div>
        {stufe === 4 && <WeiterKnopf onClick={() => setPhase('blutbuche')} />}
      </div>
    );

  return (
    <div className="labor">
      <Frage text="Die Blutbuche hat das ganze Jahr rote Blätter. Macht sie mehr oder weniger Nahrung?" />
      <Img id="blutbuche-baum" className="frage-bild" />
      <div className="optionen">
        {['mehr Nahrung', 'weniger Nahrung'].map((o) => (
          <button
            key={o}
            type="button"
            className="option"
            onClick={() => {
              const r = v.pruefe(o === 'weniger Nahrung', {
                id: 'labor-blutbuche',
                factIds: ['m15-blutbuche'],
                antwort: o,
                tipp: 'Denk daran: Nur das Grün macht Nahrung. Wie viel Grün hat die Blutbuche?',
                loesung: 'Viel Rot, wenig Grün: Die Blutbuche macht weniger Nahrung.',
                lobText: 'Genau! Viel Rot, wenig Grün – darum weniger Nahrung.',
              });
              if (r !== 'tipp') {
                api.zaehle('blattlabor');
                setTimeout(() => api.finish(v.ergebnis()), 2200);
              }
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function LaborKarte({
  id,
  label,
  aktiv,
  onTap,
  onDrop,
}: {
  id: string;
  label: string;
  aktiv: boolean;
  onTap: () => void;
  onDrop: (z: string) => void;
}) {
  const drag = useDrag(onDrop, onTap);
  return (
    <button type="button" className={`zieh-karte ${aktiv ? 'aktiv' : ''}`} aria-pressed={aktiv} {...drag}>
      <Karte bild={id} text={label} klein />
    </button>
  );
}
