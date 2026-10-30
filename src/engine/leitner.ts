export type Fach = 1 | 2 | 3 | 4 | 5;
export interface LeitnerEintrag {
  fach: Fach;
  faelligAm: string;
}

const TAGE: Record<Fach, number> = { 1: 0, 2: 1, 3: 2, 4: 4, 5: 7 };

export function isoDatum(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const t = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${t}`;
}

export function plusTage(iso: string, tage: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  return isoDatum(new Date(y, m - 1, d + tage));
}

export function leitnerUpdate(
  alt: LeitnerEintrag | undefined,
  richtig: boolean,
  heute: string,
): LeitnerEintrag {
  const fach: Fach = richtig ? (Math.min(5, (alt?.fach ?? 0) + 1) as Fach) : 1;
  return { fach, faelligAm: plusTage(heute, TAGE[fach]) };
}

/** Fällige Einträge, niedrige Fächer zuerst. */
export function faellige(leitner: Record<string, LeitnerEintrag>, heute: string): string[] {
  return Object.entries(leitner)
    .filter(([, e]) => e.faelligAm <= heute)
    .sort((a, b) => a[1].fach - b[1].fach || a[1].faelligAm.localeCompare(b[1].faelligAm))
    .map(([id]) => id);
}
