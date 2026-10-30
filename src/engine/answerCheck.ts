import { levenshtein } from '../lib/levenshtein';
import { normalize } from '../lib/normalize';

export type CheckResult = { ok: true; exakt: boolean; korrekt: string } | { ok: false; korrekt: string };

/**
 * Sachaufgaben: Groß-/Kleinschreibung egal, bis 6 Buchstaben 1 Tippfehler, länger 2.
 * Ist die Antwort nicht exakt, wird die korrekte Schreibweise zurückgegeben.
 */
export function checkSachantwort(eingabe: string, loesungen: string[]): CheckResult {
  const e = normalize(eingabe);
  const el = e.toLowerCase();
  let best: { l: string; d: number } | null = null;
  for (const l of loesungen) {
    const n = normalize(l);
    if (n === e) return { ok: true, exakt: true, korrekt: n };
    const d = levenshtein(el, n.toLowerCase());
    if (!best || d < best.d) best = { l: n, d };
  }
  if (!best) return { ok: false, korrekt: '' };
  const erlaubt = best.l.length <= 6 ? 1 : 2;
  if (best.d <= erlaubt) return { ok: true, exakt: false, korrekt: best.l };
  return { ok: false, korrekt: best.l };
}

/** Schreib-Werkstatt: exakter Vergleich inklusive Groß-/Kleinschreibung. */
export function checkExakt(eingabe: string, loesung: string): boolean {
  return normalize(eingabe) === normalize(loesung);
}
