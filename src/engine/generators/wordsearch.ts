import { createRng, shuffle } from '../rng';

export interface WordsearchResult {
  size: number;
  grid: string[][];
  placed: { wort: string; cells: [number, number][] }[];
}

const RICHTUNGEN: Record<1 | 2 | 3, [number, number][]> = {
  1: [
    [0, 1],
    [1, 0],
  ],
  2: [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ],
  3: [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ],
};

const FUELL = 'ABCDEFGHIJKLMNOPRSTUWZÄÖÜ';

/** Suchsel-Generator: Stufe 1 = 10×10 vorwärts, 2 = 12×12 auch rückwärts, 3 = auch diagonal. */
export function generateWordsearch(woerter: string[], stufe: 1 | 2 | 3, seed: number): WordsearchResult {
  const size = stufe === 1 ? 10 : 12;
  for (let versuch = 0; versuch < 200; versuch++) {
    const rnd = createRng(seed + versuch * 7919);
    const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
    const placed: WordsearchResult['placed'] = [];
    const sorted = [...woerter].sort((a, b) => b.length - a.length);
    let ok = true;
    for (const w of sorted) {
      const W = w.toUpperCase().replace(/ẞ/g, 'ß');
      let done = false;
      const starts: [number, number, number, number][] = [];
      for (const [dr, dc] of RICHTUNGEN[stufe])
        for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) starts.push([r, c, dr, dc]);
      for (const [r, c, dr, dc] of shuffle(starts, rnd)) {
        const er = r + dr * (W.length - 1);
        const ec = c + dc * (W.length - 1);
        if (er < 0 || er >= size || ec < 0 || ec >= size) continue;
        let fits = true;
        for (let i = 0; i < W.length; i++) {
          const g = grid[r + dr * i][c + dc * i];
          if (g !== '' && g !== W[i]) {
            fits = false;
            break;
          }
        }
        if (!fits) continue;
        const cells: [number, number][] = [];
        for (let i = 0; i < W.length; i++) {
          grid[r + dr * i][c + dc * i] = W[i];
          cells.push([r + dr * i, c + dc * i]);
        }
        placed.push({ wort: w, cells });
        done = true;
        break;
      }
      if (!done) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        if (grid[r][c] === '') grid[r][c] = FUELL[Math.floor(rnd() * FUELL.length)];
    return { size, grid, placed };
  }
  throw new Error('Suchsel konnte nicht erzeugt werden');
}
