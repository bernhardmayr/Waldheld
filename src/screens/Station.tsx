import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Img } from '../assets/Img';
import { configs } from '../content';
import { abzeichen } from '../content/badges';
import { karteById } from '../content/cards';
import { pflichtStationen, stationById } from '../content/stations';
import type { GameType } from '../content/types';
import { istOffen } from '../engine/unlock';
import { GamePlayer } from '../components/GamePlayer';
import { Konfetti } from '../components/Konfetti';
import { Pinsel } from '../components/Pinsel';
import { Eichel, Rich, SpeakButton, Sterne } from '../components/ui';
import { sound } from '../lib/sound';
import { sprich } from '../lib/tts';
import { useProgress } from '../store/progress';
import { useSettings } from '../store/settings';

const TYP_FUER_KIND: Record<string, GameType> = {
  quiz: 'quiz',
  truefalse: 'truefalse',
  sort: 'sort',
  memory: 'memory',
  riddle: 'riddle',
  cloze: 'cloze',
};
const PFLICHT_IDS = pflichtStationen.map((s) => s.id);

/** Station: Infotext → Spiele nacheinander → Abschluss-Seite. */
export function StationScreen() {
  const { pathname } = useLocation();
  return <StationAblauf key={pathname} />;
}

function StationAblauf() {
  const { id = '', nr } = useParams();
  const station = stationById[id];
  const nav = useNavigate();
  const stand = useProgress((s) => s.stationen);
  const allesFrei = useSettings((s) => s.allesFrei);
  const autoVorlesen = useSettings((s) => s.autoVorlesen);
  const quittiere = useProgress((s) => s.quittiere);
  const [phase, setPhase] = useState<'info' | 'spiel' | 'ende'>(nr !== undefined ? 'spiel' : 'info');
  const [spiel, setSpiel] = useState(nr !== undefined ? Number(nr) : 0);
  const [extra, setExtra] = useState<string | null>(null);
  const [ergebnisse, setErgebnisse] = useState<{ titel: string; sterne: number }[]>([]);
  const [eicheln, setEicheln] = useState(0);
  const einzeln = nr !== undefined;

  useEffect(() => {
    if (phase === 'info' && autoVorlesen && station) sprich(station.info.saetze.join(' '));
  }, [phase]);
  useEffect(() => {
    quittiere();
  }, [id]);

  if (!station) return <Navigate to="/" replace />;
  if (!istOffen(station, stand, PFLICHT_IDS, allesFrei)) return <Navigate to="/" replace />;

  const extras =
    station.modul !== 'alle'
      ? Object.keys(configs).filter(
          (k) =>
            k.startsWith(station.modul + '-') &&
            !station.spiele.some((s) => s.configId === k) &&
            TYP_FUER_KIND[configs[k].kind],
        )
      : [];

  if (extra) {
    const c = configs[extra];
    return (
      <GamePlayer
        type={TYP_FUER_KIND[c.kind]}
        config={c}
        titel={`Mehr üben: ${station.titel}`}
        onFertig={(r, sterne, e) => {
          setErgebnisse([{ titel: 'Zusatzübung', sterne }]);
          setEicheln(e);
          setExtra(null);
          setPhase('ende');
          void r;
        }}
        onAbbruch={() => setExtra(null)}
      />
    );
  }

  if (phase === 'info')
    return (
      <div className="station-info">
        <div className="info-bild">
          <Img id={station.info.bild} />
        </div>
        <div className="info-text">
          <p className="station-typ">
            {station.typ === 'pflicht'
              ? '! Pflichtstation'
              : station.typ === 'zusatz'
                ? '★ Zusatzstation'
                : station.typ === 'abschluss'
                  ? '🏅 Abschluss'
                  : 'Werkstatt'}
            {station.schulNr ? ` · Station ${station.schulNr}` : ''}
          </p>
          <h1>{station.titel}</h1>
          <ul>
            {station.info.saetze.map((s) => (
              <li key={s}>
                <Rich text={s} />
              </li>
            ))}
          </ul>
          <SpeakButton text={station.info.saetze.join(' ')} label="Infotext vorlesen" />
          <button
            type="button"
            className="knopf gross los"
            onClick={() => {
              setSpiel(0);
              setErgebnisse([]);
              setPhase('spiel');
            }}
          >
            Los geht’s!
          </button>
          <div className="spiele-liste">
            <h3>Spiele einzeln wiederholen</h3>
            {station.spiele.map((s, i) => (
              <Link key={i} to={`/station/${station.id}/spiel/${i}`} className="spiel-chip">
                {s.titel} <Sterne n={stand[station.id]?.bestProSpiel[String(i)] ?? 0} />
              </Link>
            ))}
            {extras.map((k) => (
              <button key={k} type="button" className="spiel-chip extra" onClick={() => setExtra(k)}>
                ➕ Mehr üben:{' '}
                {configs[k].kind === 'truefalse'
                  ? 'Richtig oder falsch'
                  : configs[k].kind === 'quiz'
                    ? 'Quiz'
                    : configs[k].kind === 'riddle'
                      ? 'Wer bin ich?'
                      : configs[k].kind === 'memory'
                        ? 'Memory'
                        : configs[k].kind === 'cloze'
                          ? 'Lückentext'
                          : 'Sortieren'}
              </button>
            ))}
          </div>
        </div>
      </div>
    );

  if (phase === 'spiel') {
    const s = station.spiele[spiel];
    return (
      <GamePlayer
        key={`${station.id}-${spiel}`}
        type={s.type}
        config={configs[s.configId]}
        titel={`${station.titel}: ${s.titel}`}
        stationId={station.id}
        spielKey={String(spiel)}
        oben={einzeln ? undefined : { nr: spiel, von: station.spiele.length }}
        onFertig={(r, sterne, e) => {
          void r;
          const neu = [...ergebnisse, { titel: s.titel, sterne }];
          setErgebnisse(neu);
          setEicheln((x) => x + e);
          if (station.id === 'WP') {
            const quote = r.gesamt ? r.richtig / r.gesamt : 0;
            if (quote >= 0.8) useProgress.getState().zaehle('pruefung');
          }
          if (!einzeln && spiel + 1 < station.spiele.length) setSpiel(spiel + 1);
          else {
            sound.geschafft();
            setPhase('ende');
          }
        }}
        onAbbruch={() => (einzeln ? nav(`/station/${station.id}`) : setPhase('info'))}
      />
    );
  }

  return <Abschluss stationId={station.id} ergebnisse={ergebnisse} eicheln={eicheln} />;
}

function Abschluss({
  stationId,
  ergebnisse,
  eicheln,
}: {
  stationId: string;
  ergebnisse: { titel: string; sterne: number }[];
  eicheln: number;
}) {
  const station = stationById[stationId];
  const sterne = useProgress((s) => s.stationen[stationId]?.sterne ?? 0);
  const neuKarten = useProgress((s) => s.neuKarten);
  const neuAbzeichen = useProgress((s) => s.neuAbzeichen);
  const form = useProgress((s) => s.spieler?.form ?? 'w');
  const bestanden = useProgress((s) => (s.zaehler.pruefung ?? 0) > 0);
  const reduziert =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="abschluss">
      {!reduziert && <Konfetti />}
      <Pinsel pose="feiert" size={150} />
      <h1>Geschafft!</h1>
      <p className="station-name">{station.titel}</p>
      {station.typ !== 'abschluss' && <Sterne n={sterne} gross />}
      <ul className="spiel-ergebnisse">
        {ergebnisse.map((e, i) => (
          <li key={i}>
            {e.titel}: <Sterne n={e.sterne} />
          </li>
        ))}
      </ul>
      <p className="verdient">
        <Eichel size={36} /> +{eicheln} Eicheln
      </p>
      {neuKarten.length > 0 && (
        <div className="neu">
          <h3>Neue Waldbuch-Karten</h3>
          <div className="neu-karten">
            {neuKarten.map((k) => (
              <div key={k} className="mini-karte">
                <Img id={karteById[k].bild} size={64} />
                <span>{karteById[k].titel}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {neuAbzeichen.length > 0 && (
        <div className="neu">
          <h3>Neue Abzeichen</h3>
          {neuAbzeichen.map((a) => {
            const ab = abzeichen.find((x) => x.id === a)!;
            return (
              <p key={a} className="medaille-zeile">
                <span className="medaille">{ab.symbol}</span> {ab[form]}
              </p>
            );
          })}
        </div>
      )}
      {stationId === 'WP' && bestanden && (
        <Link to="/urkunde" className="knopf gross">
          📜 Urkunde ansehen
        </Link>
      )}
      <Link to="/" className="knopf gross">
        Zur Waldkarte
      </Link>
    </div>
  );
}
