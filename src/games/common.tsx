import { createContext, useContext, useRef, useState } from 'react';
import { Img } from '../assets/Img';
import { punkteFuerVersuch, sterneAusQuote, type Versuch } from '../engine/scoring';
import type { TaskEvent } from '../store/progress';

export interface GameResult {
  richtig: number;
  gesamt: number;
  versuche: number;
  fehler: { frageId: string; antwort: string }[];
  /** überschreibt die Sterne aus der Quote (z. B. Memory nach Zügen) */
  sterne?: 0 | 1 | 2 | 3;
}

export type Stimmung = 'richtig' | 'falsch' | 'tipp' | 'loesung' | 'info';

export interface GameApi {
  /** Aufgabe werten: Eicheln, Leitner, Waldbuch */
  task(e: TaskEvent): void;
  /** Pinsel spricht */
  sag(text: string, stimmung: Stimmung): void;
  /** Tipp für den Tipp-Knopf setzen */
  setTipp(text: string | null): void;
  /** Fortschritt innerhalb des Spiels */
  fortschritt(done: number, total: number): void;
  finish(r: GameResult): void;
  zaehle(key: string, n?: number, absolut?: boolean): void;
  /** zusätzliche Eicheln (z. B. Rätsel-Bonus) */
  bonus(n: number): void;
  seed: number;
}

export interface GameProps<C> {
  config: C;
  api: GameApi;
}

export const GameContext = createContext<GameApi | null>(null);
export const useGame = () => useContext(GameContext)!;

export function quote(r: GameResult) {
  return r.gesamt ? r.richtig / r.gesamt : 0;
}

export function sterneFuer(r: GameResult): 0 | 1 | 2 | 3 {
  return r.sterne ?? sterneAusQuote(quote(r));
}

const LOB = ['Super!', 'Richtig!', 'Toll gemacht!', 'Klasse!', 'Genau!', 'Prima!', 'Stark!'];
export const lob = () => LOB[Math.floor(Math.random() * LOB.length)];

/**
 * Fehler als Chance: 1. Fehlversuch → Tipp, 2. Fehlversuch → Lösung mit Erklärung.
 * Zählt Punkte (voll, halb, keine) für die Sterne.
 */
export function useVersuche(api: GameApi) {
  const fehlversuche = useRef<Record<string, number>>({});
  const [stats, setStats] = useState({
    punkte: 0,
    gesamt: 0,
    versuche: 0,
    fehler: [] as GameResult['fehler'],
  });
  const statsRef = useRef(stats);
  statsRef.current = stats;

  function abschluss(
    id: string,
    factIds: string[],
    versuch: Versuch,
    antwort: string,
    ohneLeitner?: boolean,
  ) {
    api.task({ id, factIds, versuch, antwort, ohneLeitner });
    const s = statsRef.current;
    const next = {
      punkte: s.punkte + punkteFuerVersuch(versuch),
      gesamt: s.gesamt + 1,
      versuche: s.versuche + versuch,
      fehler: versuch > 1 ? [...s.fehler, { frageId: id, antwort }] : s.fehler,
    };
    statsRef.current = next;
    setStats(next);
  }

  return {
    /** liefert 'richtig' | 'tipp' | 'loesung' */
    pruefe(
      ok: boolean,
      t: {
        id: string;
        factIds: string[];
        tipp: string;
        loesung: string;
        antwort?: string;
        ohneLeitner?: boolean;
        lobText?: string;
      },
    ): 'richtig' | 'tipp' | 'loesung' {
      const n = fehlversuche.current[t.id] ?? 0;
      if (ok) {
        abschluss(t.id, t.factIds, (n + 1) as Versuch, t.antwort ?? '', t.ohneLeitner);
        api.sag(t.lobText ?? lob(), 'richtig');
        return 'richtig';
      }
      fehlversuche.current[t.id] = n + 1;
      if (n === 0) {
        api.sag(t.tipp, 'tipp');
        return 'tipp';
      }
      abschluss(t.id, t.factIds, 3, t.antwort ?? '', t.ohneLeitner);
      api.sag(t.loesung, 'loesung');
      return 'loesung';
    },
    versuch: (id: string) => (fehlversuche.current[id] ?? 0) + 1,
    ergebnis(): GameResult {
      const s = statsRef.current;
      return { richtig: s.punkte, gesamt: s.gesamt, versuche: s.versuche, fehler: s.fehler };
    },
    stats,
  };
}

/** Karte mit Bild und/oder Text. */
export function Karte({ text, bild, klein }: { text?: string; bild?: string; klein?: boolean }) {
  return (
    <span className={`karte-inhalt ${klein ? 'klein' : ''}`}>
      {bild && <Img id={bild} className="karte-bild" title={text} />}
      {text && <span className="karte-text">{text}</span>}
    </span>
  );
}

export function WeiterKnopf({ onClick, text = 'Weiter' }: { onClick: () => void; text?: string }) {
  return (
    <button type="button" className="knopf weiter" onClick={onClick} autoFocus>
      {text} ➜
    </button>
  );
}
