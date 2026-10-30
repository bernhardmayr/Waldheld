import { describe, expect, it } from 'vitest';
import { checkExakt, checkSachantwort } from './answerCheck';
import { generateCrossword } from './generators/crossword';
import { generateWordsearch } from './generators/wordsearch';
import { faellige, leitnerUpdate, plusTage } from './leitner';
import { sterneAusQuote, sterneMemory, sterneStation } from './scoring';
import { istOffen } from './unlock';
import { wortlisten } from '../content/words';
import type { Station } from '../content/types';

describe('answerCheck', () => {
  it('ignoriert Groß-/Kleinschreibung in Sachaufgaben', () => {
    expect(checkSachantwort('stamm', ['Stamm'])).toMatchObject({ ok: true, exakt: false, korrekt: 'Stamm' });
  });
  it('erlaubt 1 Tippfehler bis 6 Buchstaben', () => {
    expect(checkSachantwort('Stam', ['Stamm']).ok).toBe(true);
    expect(checkSachantwort('Sta', ['Stamm']).ok).toBe(false);
  });
  it('erlaubt 2 Tippfehler bei längeren Wörtern', () => {
    expect(checkSachantwort('Buchecke', ['Bucheckern']).ok).toBe(true);
    expect(checkSachantwort('Bucheck', ['Bucheckern']).ok).toBe(false);
  });
  it('normalisiert Leerzeichen und Unicode', () => {
    expect(checkSachantwort('  Lärche ', ['Lärche'])).toMatchObject({ ok: true, exakt: true });
  });
  it('prüft in der Werkstatt exakt', () => {
    expect(checkExakt('Nahrung', 'Nahrung')).toBe(true);
    expect(checkExakt('nahrung', 'Nahrung')).toBe(false);
    expect(checkExakt('Narung', 'Nahrung')).toBe(false);
  });
});

describe('scoring', () => {
  it('Sterne nach Quote', () => {
    expect(sterneAusQuote(0.95)).toBe(3);
    expect(sterneAusQuote(0.9)).toBe(3);
    expect(sterneAusQuote(0.75)).toBe(2);
    expect(sterneAusQuote(0.4)).toBe(1);
    expect(sterneAusQuote(0.39)).toBe(0);
  });
  it('Memory nach Zügen', () => {
    expect(sterneMemory(6, 6)).toBe(3);
    expect(sterneMemory(14, 6)).toBe(2);
    expect(sterneMemory(30, 6)).toBe(1);
  });
  it('Station: gerundeter Durchschnitt', () => {
    expect(sterneStation([3, 3, 2])).toBe(3);
    expect(sterneStation([3, 0, 0])).toBe(1);
    expect(sterneStation([])).toBe(0);
  });
});

describe('leitner', () => {
  it('richtig → ein Fach höher, falsch → Fach 1', () => {
    const e1 = leitnerUpdate(undefined, true, '2026-10-01');
    expect(e1).toEqual({ fach: 1, faelligAm: '2026-10-01' });
    const e2 = leitnerUpdate(e1, true, '2026-10-01');
    expect(e2).toEqual({ fach: 2, faelligAm: '2026-10-02' });
    const e3 = leitnerUpdate({ fach: 4, faelligAm: 'x' }, true, '2026-10-01');
    expect(e3).toEqual({ fach: 5, faelligAm: '2026-10-08' });
    expect(leitnerUpdate(e3, false, '2026-10-01').fach).toBe(1);
  });
  it('fällige zuerst aus niedrigen Fächern', () => {
    const l = {
      a: { fach: 3 as const, faelligAm: '2026-10-01' },
      b: { fach: 1 as const, faelligAm: '2026-10-01' },
      c: { fach: 2 as const, faelligAm: '2026-12-01' },
    };
    expect(faellige(l, '2026-10-05')).toEqual(['b', 'a']);
  });
  it('Datumsrechnung über Monatsgrenzen', () => {
    expect(plusTage('2026-10-30', 7)).toBe('2026-11-06');
  });
});

describe('unlock', () => {
  const st = (typ: Station['typ']) => ({ typ }) as Station;
  const pflicht = ['a', 'b', 'c', 'd'];
  it('Pflicht immer offen, Zusatz ab 3 Pflicht mit Stern, Prüfung erst wenn alle', () => {
    expect(istOffen(st('pflicht'), {}, pflicht)).toBe(true);
    expect(istOffen(st('zusatz'), { a: { sterne: 1 }, b: { sterne: 2 } }, pflicht)).toBe(false);
    expect(istOffen(st('zusatz'), { a: { sterne: 1 }, b: { sterne: 2 }, c: { sterne: 1 } }, pflicht)).toBe(
      true,
    );
    expect(istOffen(st('abschluss'), { a: { sterne: 1 }, b: { sterne: 2 }, c: { sterne: 1 } }, pflicht)).toBe(
      false,
    );
    expect(
      istOffen(
        st('abschluss'),
        { a: { sterne: 1 }, b: { sterne: 2 }, c: { sterne: 1 }, d: { sterne: 3 } },
        pflicht,
      ),
    ).toBe(true);
    expect(istOffen(st('abschluss'), {}, pflicht, true)).toBe(true);
  });
});

describe('Suchsel-Generator', () => {
  for (const stufe of [1, 2, 3] as const) {
    it(`Stufe ${stufe}: alle Wörter platziert, ohne Konflikte`, () => {
      const woerter = stufe === 1 ? wortlisten.A.slice(0, 9) : wortlisten.A;
      for (let seed = 0; seed < 20; seed++) {
        const r = generateWordsearch(woerter, stufe, seed);
        expect(r.placed.map((p) => p.wort).sort()).toEqual([...woerter].sort());
        for (const p of r.placed) {
          const W = p.wort.toUpperCase();
          p.cells.forEach(([row, col], i) => expect(r.grid[row][col]).toBe(W[i]));
        }
        expect(r.grid.length).toBe(stufe === 1 ? 10 : 12);
      }
    });
  }
  it('gleicher Seed → gleiches Rätsel', () => {
    expect(generateWordsearch(wortlisten.A, 2, 42)).toEqual(generateWordsearch(wortlisten.A, 2, 42));
  });
});

describe('Kreuzwort-Generator', () => {
  const eintraege = [
    'Zapfen',
    'Stamm',
    'Kobel',
    'Eule',
    'Moos',
    'Tanne',
    'Fichte',
    'Wurzel',
    'Rinde',
    'Holz',
  ].map((wort) => ({ wort, hinweis: wort }));
  it('legt mindestens 8 Wörter ohne Konflikte', () => {
    for (let seed = 0; seed < 20; seed++) {
      const r = generateCrossword(eintraege, seed);
      expect(r.entries.length).toBeGreaterThanOrEqual(8);
      for (const e of r.entries) {
        const W = e.wort.toUpperCase();
        for (let i = 0; i < W.length; i++) {
          const ch = r.cells[e.row + (e.dir === 'v' ? i : 0)][e.col + (e.dir === 'h' ? i : 0)];
          expect(ch).toBe(W[i]);
        }
      }
    }
  });
  it('gleicher Seed → gleiches Rätsel', () => {
    expect(generateCrossword(eintraege, 5)).toEqual(generateCrossword(eintraege, 5));
  });
});
