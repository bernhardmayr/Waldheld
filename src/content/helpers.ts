import type { Question } from './types';

type MC = Extract<Question, { kind: 'mc' }>;
type TF = Extract<Question, { kind: 'tf' }>;
type TX = Extract<Question, { kind: 'text' }>;

/** Einfach- oder Mehrfachauswahl mit Wort-Optionen. `richtig` sind die Indizes. */
export function mc(
  id: string,
  factIds: string[],
  frage: string,
  optionen: (string | { text?: string; bild?: string })[],
  richtig: number | number[],
  erklaerung: string,
  bild?: string,
): MC {
  return {
    kind: 'mc',
    id,
    factIds,
    frage,
    optionen: optionen.map((o) => (typeof o === 'string' ? { text: o } : o)),
    richtig: Array.isArray(richtig) ? richtig : [richtig],
    erklaerung,
    ...(bild ? { bild } : {}),
  };
}

/** Bild-Optionen: [bildId, Beschriftung] */
export function mcBild(
  id: string,
  factIds: string[],
  frage: string,
  optionen: [string, string][],
  richtig: number,
  erklaerung: string,
): MC {
  return mc(
    id,
    factIds,
    frage,
    optionen.map(([bild, text]) => ({ bild, text })),
    richtig,
    erklaerung,
  );
}

export function tf(
  id: string,
  factIds: string[],
  aussage: string,
  wahr: boolean,
  erklaerung: string,
  bild?: string,
): TF {
  return { kind: 'tf', id, factIds, aussage, wahr, erklaerung, ...(bild ? { bild } : {}) };
}

export function txt(
  id: string,
  factIds: string[],
  frage: string,
  loesungen: string[],
  erklaerung: string,
  bild?: string,
  istNomen = true,
): TX {
  return { kind: 'text', id, factIds, frage, loesungen, istNomen, erklaerung, ...(bild ? { bild } : {}) };
}
