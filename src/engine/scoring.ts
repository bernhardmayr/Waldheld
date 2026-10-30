export const EICHELN = {
  versuch1: 10,
  versuch2: 5,
  geloest: 1,
  serie5: 10,
  fehlerfrei: 20,
  raetsel: [30, 20, 10] as const,
  tagesaufgabe: 30,
  kontrolliert: 20,
};

/** Versuch 1 = voll, Versuch 2 = halb, 3 = Lösung gezeigt. */
export type Versuch = 1 | 2 | 3;

export function eichelnFuerVersuch(v: Versuch): number {
  return v === 1 ? EICHELN.versuch1 : v === 2 ? EICHELN.versuch2 : EICHELN.geloest;
}

export function punkteFuerVersuch(v: Versuch): number {
  return v === 1 ? 1 : v === 2 ? 0.5 : 0;
}

export function sterneAusQuote(quote: number): 0 | 1 | 2 | 3 {
  if (quote >= 0.9) return 3;
  if (quote >= 0.7) return 2;
  if (quote >= 0.4) return 1;
  return 0;
}

/** Memory: Sterne nach Zügen im Verhältnis zur Paaranzahl. */
export function sterneMemory(zuege: number, paare: number): 0 | 1 | 2 | 3 {
  if (zuege <= Math.ceil(paare * 1.5)) return 3;
  if (zuege <= paare * 2 + 2) return 2;
  return 1;
}

export function sterneStation(bestProSpiel: number[]): 0 | 1 | 2 | 3 {
  if (bestProSpiel.length === 0) return 0;
  const avg = bestProSpiel.reduce((a, b) => a + b, 0) / bestProSpiel.length;
  return Math.max(0, Math.min(3, Math.round(avg))) as 0 | 1 | 2 | 3;
}
