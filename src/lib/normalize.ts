/** Leerzeichen und Unicode vereinheitlichen (z. B. „ä“ als ein Zeichen). */
export function normalize(s: string): string {
  return s.normalize('NFC').replace(/[‐-―]/g, '-').replace(/\s+/g, ' ').trim();
}
