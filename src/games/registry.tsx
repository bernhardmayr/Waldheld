import type { ComponentType } from 'react';
import type { GameType } from '../content/types';
import type { GameProps } from './common';
import { CleanupGame, CacheGame, LeafLabGame } from './world';
import { ClozeGame } from './cloze';
import { FoodChainGame } from './foodchain';
import { HiddenGame } from './hidden';
import { GridGame, LabelGame } from './label';
import { MemoryGame } from './memory';
import { ExamGame, QuizGame } from './quiz';
import { ErrorWordsGame, ReadingGame } from './reading';
import { KeyGame, RiddleGame } from './riddle';
import { PuzzleGame, SequenceGame } from './sequence';
import { LiftGame, SortGame } from './sort';
import { SpellingGame } from './spelling';
import { CrosswordGame, ScrambleGame, WordsearchGame } from './words';

/** Alle 24 Spieltypen (G01–G24), datengetrieben. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GAMES: Record<GameType, ComponentType<GameProps<any>>> = {
  quiz: QuizGame,
  truefalse: QuizGame,
  label: LabelGame,
  sort: SortGame,
  grid: GridGame,
  memory: MemoryGame,
  hidden: HiddenGame,
  puzzle: PuzzleGame,
  sequence: SequenceGame,
  foodchain: FoodChainGame,
  riddle: RiddleGame,
  key: KeyGame,
  wordsearch: WordsearchGame,
  scramble: ScrambleGame,
  crossword: CrosswordGame,
  cloze: ClozeGame,
  reading: ReadingGame,
  errorwords: ErrorWordsGame,
  spelling: SpellingGame,
  cache: CacheGame,
  cleanup: CleanupGame,
  exam: ExamGame,
  lift: LiftGame,
  leaflab: LeafLabGame,
};
