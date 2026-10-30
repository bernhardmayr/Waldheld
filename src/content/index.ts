import { baeumeConfigs } from './games/baeume';
import { basisConfigs } from './games/basis';
import { tiereConfigs } from './games/tiere';
import type { GameConfig, Question } from './types';
import { wortConfigs } from './words';

export const configs: Record<string, GameConfig> = {
  ...basisConfigs,
  ...baeumeConfigs,
  ...tiereConfigs,
  ...wortConfigs,
  exam: { kind: 'exam', anzahl: 20 },
};

/** Alle Einzelfragen (Quiz und Richtig/Falsch), z. B. für Tagesaufgabe und Prüfung. */
export const alleFragen: Question[] = Object.values(configs).flatMap((c) =>
  c.kind === 'quiz' || c.kind === 'truefalse' ? (c.fragen as Question[]) : [],
);
export const frageById: Record<string, Question> = Object.fromEntries(alleFragen.map((q) => [q.id, q]));
