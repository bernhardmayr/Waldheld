import type { Progress } from './progress';

const z = (p: Progress, k: string) => p.zaehler[k] ?? 0;
const sterne = (p: Progress, id: string) => p.stationen[id]?.sterne ?? 0;

const regeln: Record<string, (p: Progress) => boolean> = {
  lebensraum: (p) => sterne(p, 'H1') === 3,
  anatomie: (p) => sterne(p, 'S01') === 3,
  jahreszeiten: (p) => sterne(p, 'S02') === 3,
  blattlabor: (p) => z(p, 'blattlabor') >= 1,
  stockwerk: (p) => z(p, 'liftFehlerfrei') >= 1,
  blattdetektiv: (p) => z(p, 'blaetter') >= 10,
  nadelprofi: (p) => ['fichte', 'kiefer', 'laerche', 'tanne'].every((k) => p.waldbuch[k]?.frei),
  ahornass: (p) => ['m07-q1', 'm07-q2', 'm07-q3'].every((id) => z(p, `ahorn-${id}`) >= 1),
  sirup: (p) => z(p, 'sirup') >= 1,
  tierfamilien: (p) => sterne(p, 'S10') === 3 && !!p.stationen.S10?.fehlerfrei,
  kette: (p) => z(p, 'ketten') >= 5,
  netz: (p) => z(p, 'netz') >= 1,
  adlerauge: (p) => z(p, 'adlerauge') >= 1,
  recycling: (p) => z(p, 'recyclingReihe') >= 1 && z(p, 'muell') >= 30,
  suchsel: (p) => z(p, 'suchsel') >= 1,
  raetsel: (p) => z(p, 'kreuzOhneTipp') >= 1,
  schreibprofi: (p) => Object.values(p.werkstatt).reduce((a, w) => a + w.richtig, 0) >= 20,
  dehnungsh: (p) => z(p, 'dehnungshMax') >= 10,
  vorrat: (p) => z(p, 'vorrat') >= 1,
  dranbleiben: (p) => p.spieltage.length >= 5,
  waldheld: (p) => z(p, 'pruefung') >= 1,
};

export function neueAbzeichen(p: Progress): string[] {
  return Object.entries(regeln)
    .filter(([id, ok]) => !p.abzeichen.includes(id) && ok(p))
    .map(([id]) => id);
}
