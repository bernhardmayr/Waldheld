import { createRng, shuffle } from '../rng';

export interface CrosswordEntry {
  wort: string;
  hinweis: string;
  bild?: string;
}
export interface PlacedEntry extends CrosswordEntry {
  nr: number;
  row: number;
  col: number;
  dir: 'h' | 'v';
}
export interface CrosswordResult {
  rows: number;
  cols: number;
  entries: PlacedEntry[];
  /** Lösungsbuchstabe je Zelle oder null */
  cells: (string | null)[][];
}

function up(w: string) {
  return w.toUpperCase();
}

/** Kreuzwort-Generator: legt Wörter verbunden über gemeinsame Buchstaben. Deterministisch per Seed. */
export function generateCrossword(eintraege: CrosswordEntry[], seed: number): CrosswordResult {
  let best: { placed: Omit<PlacedEntry, 'nr'>[] } | null = null;
  for (let versuch = 0; versuch < 60; versuch++) {
    const rnd = createRng(seed + versuch * 104729);
    const order = shuffle(eintraege, rnd).sort((a, b) => b.wort.length - a.wort.length);
    const grid = new Map<string, string>();
    const placed: Omit<PlacedEntry, 'nr'>[] = [];
    const key = (r: number, c: number) => `${r},${c}`;
    const canPlace = (W: string, r: number, c: number, dir: 'h' | 'v') => {
      const dr = dir === 'v' ? 1 : 0;
      const dc = dir === 'h' ? 1 : 0;
      if (grid.has(key(r - dr, c - dc)) || grid.has(key(r + dr * W.length, c + dc * W.length))) return -1;
      let crossings = 0;
      for (let i = 0; i < W.length; i++) {
        const rr = r + dr * i;
        const cc = c + dc * i;
        const g = grid.get(key(rr, cc));
        if (g !== undefined) {
          if (g !== W[i]) return -1;
          crossings++;
        } else {
          // Nachbarn quer zur Richtung müssen frei sein
          if (grid.has(key(rr + dc, cc + dr)) || grid.has(key(rr - dc, cc - dr))) return -1;
        }
      }
      return crossings;
    };
    const put = (e: CrosswordEntry, r: number, c: number, dir: 'h' | 'v') => {
      const W = up(e.wort);
      for (let i = 0; i < W.length; i++)
        grid.set(key(r + (dir === 'v' ? i : 0), c + (dir === 'h' ? i : 0)), W[i]);
      placed.push({ ...e, row: r, col: c, dir });
    };
    put(order[0], 0, 0, 'h');
    for (const e of order.slice(1)) {
      const W = up(e.wort);
      const options: [number, number, 'h' | 'v'][] = [];
      for (const p of placed) {
        const P = up(p.wort);
        for (let i = 0; i < P.length; i++)
          for (let j = 0; j < W.length; j++) {
            if (P[i] !== W[j]) continue;
            const dir = p.dir === 'h' ? 'v' : 'h';
            const pr = p.row + (p.dir === 'v' ? i : 0);
            const pc = p.col + (p.dir === 'h' ? i : 0);
            const r = dir === 'v' ? pr - j : pr;
            const c = dir === 'h' ? pc - j : pc;
            if (canPlace(W, r, c, dir) > 0) options.push([r, c, dir]);
          }
      }
      if (options.length) {
        const [r, c, dir] = options[Math.floor(rnd() * options.length)];
        put(e, r, c, dir);
      }
    }
    if (!best || placed.length > best.placed.length) best = { placed };
    if (placed.length === eintraege.length) break;
  }
  const placed = best!.placed;
  const minR = Math.min(...placed.map((p) => p.row));
  const minC = Math.min(...placed.map((p) => p.col));
  const norm = placed.map((p) => ({ ...p, row: p.row - minR, col: p.col - minC }));
  const rows = Math.max(...norm.map((p) => p.row + (p.dir === 'v' ? p.wort.length : 1)));
  const cols = Math.max(...norm.map((p) => p.col + (p.dir === 'h' ? p.wort.length : 1)));
  const cells: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  for (const p of norm) {
    const W = up(p.wort);
    for (let i = 0; i < W.length; i++)
      cells[p.row + (p.dir === 'v' ? i : 0)][p.col + (p.dir === 'h' ? i : 0)] = W[i];
  }
  // Nummern nach Leserichtung vergeben
  const starts = [...new Set(norm.map((p) => `${p.row},${p.col}`))].sort((a, b) => {
    const [ar, ac] = a.split(',').map(Number);
    const [br, bc] = b.split(',').map(Number);
    return ar - br || ac - bc;
  });
  const entries = norm.map((p) => ({ ...p, nr: starts.indexOf(`${p.row},${p.col}`) + 1 }));
  return { rows, cols, entries, cells };
}
