import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { karten } from '../content/cards';
import { stationById } from '../content/stations';
import { isoDatum, leitnerUpdate, type LeitnerEintrag } from '../engine/leitner';
import { EICHELN, eichelnFuerVersuch, sterneStation, type Versuch } from '../engine/scoring';
import { neueAbzeichen } from './badges';
import { migrate, SCHEMA_VERSION } from './migrations';

export interface StationProgress {
  sterne: 0 | 1 | 2 | 3;
  bestProSpiel: Record<string, number>;
  kontrolliert?: { kuerzel: string; datum: string };
  zuletzt?: string;
  fehlerfrei?: boolean;
}

export interface Progress {
  schemaVersion: number;
  spieler: { name: string; form: 'w' | 'm' } | null;
  eicheln: number;
  eichelnGesamt: number;
  stationen: Record<string, StationProgress>;
  leitner: Record<string, LeitnerEintrag>;
  fehler: Record<string, number>;
  waldbuch: Record<string, { treffer: number; frei: boolean }>;
  abzeichen: string[];
  meinWald: { uid: string; assetId: string; x: number; y: number }[];
  spieltage: string[];
  werkstatt: Record<string, { richtig: number; falsch: number }>;
  /** Wörter, die schon einmal falsch geschrieben wurden */
  fehlerwoerter: string[];
  /** Zähler für Abzeichen */
  zaehler: Record<string, number>;
  tagesaufgabe?: string;
  serie: number;
}

interface Transient {
  /** in dieser Sitzung neu freigeschaltet (für Abschluss-Seite und Hinweise) */
  neuKarten: string[];
  neuAbzeichen: string[];
  sitzungsStart: number;
}

export interface TaskEvent {
  id: string;
  factIds: string[];
  versuch: Versuch;
  /** gegebene Antwort, für die Elternstatistik */
  antwort?: string;
  /** Bei Einzelteilen in Sortier- und Zuordnungsspielen keine Leitner-Einträge anlegen */
  ohneLeitner?: boolean;
}

interface Actions {
  setSpieler(name: string, form: 'w' | 'm'): void;
  task(e: TaskEvent): number;
  bonus(n: number): void;
  spielEnde(stationId: string, spielKey: string, sterne: number, fehlerfrei: boolean): void;
  zaehle(key: string, n?: number, absolut?: boolean): void;
  ausgeben(n: number): boolean;
  kontrolliere(stationId: string, kuerzel: string): void;
  werkstattErgebnis(wort: string, richtig: boolean): void;
  fehlerwort(wort: string): void;
  waldSetzen(items: Progress['meinWald']): void;
  tagesaufgabeErledigt(): void;
  alleKartenFrei(): void;
  quittiere(): void;
  importiere(p: Progress): void;
  zuruecksetzen(): void;
}

const leer = (): Progress => ({
  schemaVersion: SCHEMA_VERSION,
  spieler: null,
  eicheln: 0,
  eichelnGesamt: 0,
  stationen: {},
  leitner: {},
  fehler: {},
  waldbuch: {},
  abzeichen: [],
  meinWald: [],
  spieltage: [],
  werkstatt: {},
  fehlerwoerter: [],
  zaehler: {},
  serie: 0,
});

export const heute = () => isoDatum(new Date());

const BLATT_FAKTEN = ['m05-blattformen', 'm07-berg', 'm07-feld', 'm07-spitz'];
const AHORN_FRAGEN = ['m07-q1', 'm07-q2', 'm07-q3'];

type State = Progress & Transient & Actions;

export const useProgress = create<State>()(
  persist(
    (set, get) => {
      /** Nach jeder Änderung: Spieltag eintragen und Abzeichen prüfen. */
      const nachher = () => {
        const s = get();
        const tag = heute();
        const patch: Partial<State> = {};
        if (!s.spieltage.includes(tag)) patch.spieltage = [...s.spieltage, tag];
        const neu = neueAbzeichen({ ...s, ...patch });
        if (neu.length) {
          patch.abzeichen = [...s.abzeichen, ...neu];
          patch.neuAbzeichen = [...s.neuAbzeichen, ...neu];
        }
        if (Object.keys(patch).length) set(patch);
      };
      const gutschrift = (n: number) =>
        set((s) => ({ eicheln: s.eicheln + n, eichelnGesamt: s.eichelnGesamt + n }));

      return {
        ...leer(),
        neuKarten: [],
        neuAbzeichen: [],
        sitzungsStart: Date.now(),

        setSpieler(name, form) {
          set({ spieler: { name: name.trim(), form } });
          nachher();
        },

        task({ id, factIds, versuch, ohneLeitner }) {
          const s = get();
          const richtig = versuch < 3;
          let eicheln = eichelnFuerVersuch(versuch);
          const serie = versuch === 1 ? s.serie + 1 : 0;
          if (serie > 0 && serie % 5 === 0) eicheln += EICHELN.serie5;
          const leitner = ohneLeitner
            ? s.leitner
            : { ...s.leitner, [id]: leitnerUpdate(s.leitner[id], versuch === 1, heute()) };
          const fehler = versuch === 1 ? s.fehler : { ...s.fehler, [id]: (s.fehler[id] ?? 0) + 1 };
          // Waldbuch: Treffer für Karten, deren Fakten richtig beantwortet wurden
          const waldbuch = { ...s.waldbuch };
          const neuKarten: string[] = [];
          if (richtig) {
            for (const k of karten) {
              if (!k.factIds.some((f) => factIds.includes(f))) continue;
              const alt = waldbuch[k.id] ?? { treffer: 0, frei: false };
              const treffer = alt.treffer + 1;
              const frei = alt.frei || treffer >= 3;
              if (frei && !alt.frei) neuKarten.push(k.id);
              waldbuch[k.id] = { treffer, frei };
            }
          }
          const zaehler = { ...s.zaehler };
          if (richtig && factIds.some((f) => BLATT_FAKTEN.includes(f)))
            zaehler.blaetter = (zaehler.blaetter ?? 0) + 1;
          if (richtig && AHORN_FRAGEN.includes(id)) zaehler[`ahorn-${id}`] = 1;
          set({
            zaehler,
            serie,
            leitner,
            fehler,
            waldbuch,
            eicheln: s.eicheln + eicheln,
            eichelnGesamt: s.eichelnGesamt + eicheln,
            neuKarten: [...s.neuKarten, ...neuKarten],
          });
          nachher();
          return eicheln;
        },

        bonus(n) {
          gutschrift(n);
          nachher();
        },

        spielEnde(stationId, spielKey, sterne, fehlerfrei) {
          const s = get();
          const alt = s.stationen[stationId] ?? { sterne: 0, bestProSpiel: {} };
          const best = Math.max(alt.bestProSpiel[spielKey] ?? 0, sterne);
          const bestProSpiel = { ...alt.bestProSpiel, [spielKey]: best };
          const keys = stationById[stationId]?.spiele.map((_, i) => String(i)) ?? [spielKey];
          const neuSterne = Math.max(alt.sterne, sterneStation(keys.map((k) => bestProSpiel[k] ?? 0))) as
            0 | 1 | 2 | 3;
          const station = {
            ...alt,
            sterne: neuSterne,
            bestProSpiel,
            zuletzt: new Date().toISOString(),
            fehlerfrei: alt.fehlerfrei || fehlerfrei,
          };
          set({ stationen: { ...s.stationen, [stationId]: station } });
          if (fehlerfrei) gutschrift(EICHELN.fehlerfrei);
          nachher();
        },

        zaehle(key, n = 1, absolut = false) {
          set((s) => ({ zaehler: { ...s.zaehler, [key]: absolut ? n : (s.zaehler[key] ?? 0) + n } }));
          nachher();
        },

        ausgeben(n) {
          if (get().eicheln < n) return false;
          set((s) => ({ eicheln: s.eicheln - n }));
          return true;
        },

        kontrolliere(stationId, kuerzel) {
          const s = get();
          const alt = s.stationen[stationId] ?? { sterne: 0, bestProSpiel: {} };
          const war = !!alt.kontrolliert;
          set({
            stationen: { ...s.stationen, [stationId]: { ...alt, kontrolliert: { kuerzel, datum: heute() } } },
          });
          if (!war) gutschrift(EICHELN.kontrolliert);
          nachher();
        },

        werkstattErgebnis(wort, richtig) {
          set((s) => {
            const alt = s.werkstatt[wort] ?? { richtig: 0, falsch: 0 };
            const fehlerwoerter = richtig
              ? s.fehlerwoerter
              : s.fehlerwoerter.includes(wort)
                ? s.fehlerwoerter
                : [...s.fehlerwoerter, wort];
            return {
              werkstatt: {
                ...s.werkstatt,
                [wort]: { richtig: alt.richtig + (richtig ? 1 : 0), falsch: alt.falsch + (richtig ? 0 : 1) },
              },
              fehlerwoerter,
            };
          });
          nachher();
        },

        fehlerwort(wort) {
          set((s) => (s.fehlerwoerter.includes(wort) ? s : { fehlerwoerter: [...s.fehlerwoerter, wort] }));
        },

        waldSetzen(items) {
          set({ meinWald: items });
        },

        tagesaufgabeErledigt() {
          if (get().tagesaufgabe === heute()) return;
          set({ tagesaufgabe: heute() });
          gutschrift(EICHELN.tagesaufgabe);
          nachher();
        },

        alleKartenFrei() {
          set({ waldbuch: Object.fromEntries(karten.map((k) => [k.id, { treffer: 3, frei: true }])) });
          nachher();
        },

        quittiere() {
          set({ neuKarten: [], neuAbzeichen: [] });
        },

        importiere(p) {
          set({ ...leer(), ...migrate(p) });
        },

        zuruecksetzen() {
          set({ ...leer(), neuKarten: [], neuAbzeichen: [] });
        },
      };
    },
    {
      name: 'waldheld:progress',
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        const p: Partial<State> = { ...s };
        delete p.neuKarten;
        delete p.neuAbzeichen;
        delete p.sitzungsStart;
        return Object.fromEntries(
          Object.entries(p).filter(([, v]) => typeof v !== 'function'),
        ) as unknown as Progress;
      },
      migrate: (persisted) => migrate(persisted as Progress) as unknown as State,
    },
  ),
);
