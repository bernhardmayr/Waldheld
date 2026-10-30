export type ModuleId =
  | 'm01'
  | 'm02'
  | 'm03'
  | 'm04'
  | 'm05'
  | 'm06'
  | 'm07'
  | 'm08'
  | 'm09'
  | 'm10'
  | 'm11'
  | 'm12'
  | 'm13'
  | 'm14'
  | 'm15';
export type AssetId = string;
export type GameType =
  | 'quiz'
  | 'truefalse'
  | 'label'
  | 'sort'
  | 'grid'
  | 'memory'
  | 'hidden'
  | 'puzzle'
  | 'sequence'
  | 'foodchain'
  | 'riddle'
  | 'key'
  | 'wordsearch'
  | 'scramble'
  | 'crossword'
  | 'cloze'
  | 'reading'
  | 'errorwords'
  | 'spelling'
  | 'cache'
  | 'cleanup'
  | 'exam'
  | 'lift'
  | 'leaflab';

export interface Fact {
  id: string;
  modul: ModuleId;
  text: string;
  bild?: AssetId;
  ergaenzung?: boolean;
}

export interface Station {
  id: string;
  schulNr?: number;
  titel: string;
  typ: 'pflicht' | 'zusatz' | 'dauerhaft' | 'abschluss';
  modul: ModuleId | 'alle';
  info: { saetze: string[]; bild: AssetId; schluesselwoerter: string[] };
  spiele: { type: GameType; configId: string; titel: string }[];
  karte: { x: number; y: number };
  ort: string;
}

export type Question =
  | {
      kind: 'mc';
      id: string;
      factIds: string[];
      frage: string;
      fragewort?: string;
      bild?: AssetId;
      optionen: { text?: string; bild?: AssetId }[];
      richtig: number[];
      erklaerung: string;
    }
  | {
      kind: 'tf';
      id: string;
      factIds: string[];
      aussage: string;
      wahr: boolean;
      erklaerung: string;
      bild?: AssetId;
    }
  | {
      kind: 'text';
      id: string;
      factIds: string[];
      frage: string;
      fragewort?: string;
      bild?: AssetId;
      loesungen: string[];
      istNomen: boolean;
      erklaerung: string;
    };

export interface QuizConfig {
  kind: 'quiz';
  fragen: Question[];
  anzahl?: number;
}
export interface TrueFalseConfig {
  kind: 'truefalse';
  fragen: Extract<Question, { kind: 'tf' }>[];
  anzahl?: number;
}
export interface LabelConfig {
  kind: 'label';
  bild: AssetId;
  hotspots: {
    id: string;
    x: number;
    y: number;
    lx: number;
    ly: number;
    loesung: string;
    alternativ?: string;
    factIds: string[];
  }[];
  /** zusätzliche Ablenker-Wortkarten */
  extra?: string[];
}
export interface SortConfig {
  kind: 'sort';
  frage: string;
  koerbe: { id: string; titel: string; bild?: AssetId }[];
  karten: { id: string; text?: string; bild?: AssetId; korb: string; factIds: string[] }[];
  anzahl?: number;
}
export interface GridConfig {
  kind: 'grid';
  zeilen: string[];
  spalten: string[];
  zellen: { zeile: number; spalte: number; text?: string; bild?: AssetId; factIds: string[] }[];
}
export interface MemoryConfig {
  kind: 'memory';
  paare: {
    id: string;
    a: { text?: string; bild?: AssetId };
    b: { text?: string; bild?: AssetId };
    factIds: string[];
  }[];
}
export interface HiddenObject {
  id: string;
  asset: AssetId;
  x: number;
  y: number;
  /** Größe in Szenen-Einheiten (Szene ist 2400 × 1600 bzw. 1600 × 2400) */
  s: number;
  label: string;
  /** nur im Fehlerbild-Modus sichtbar */
  nurFehler?: boolean;
}
export interface HiddenConfig {
  kind: 'hidden';
  /** eine oder mehrere Szenen nacheinander */
  szenen: string[];
  modus: 'suchen' | 'fehler';
}
export interface Scene {
  id: string;
  titel: string;
  hintergrund: 'fruehling' | 'sommer' | 'herbst' | 'winter' | 'querschnitt';
  hoch?: boolean;
  objekte: HiddenObject[];
  auftraege: {
    text: string;
    objektIds: string[];
    anzahl: number;
    reihenfolge?: boolean;
    factIds: string[];
  }[];
  fehler: { text: string; objektIds: string[]; factIds: string[] }[];
}
export interface PuzzleConfig {
  kind: 'puzzle';
  frage: string;
  /** von unten nach oben */
  teile: { id: string; label: string; factIds: string[] }[];
}
export interface SequenceConfig {
  kind: 'sequence';
  frage: string;
  schritte: { id: string; text: string; bild?: AssetId; factIds: string[] }[];
}
export type Rolle = 'produzent' | 'pflanzenfresser' | 'fleischfresser' | 'allesfresser' | 'destruent';
export interface FoodWebConfig {
  kind: 'foodchain';
  knoten: { id: string; label: string; bild: AssetId; rolle: Rolle }[];
  kanten: { von: string; zu: string; art: 'gefressen' | 'energie' }[];
  ketten: string[][];
}
export interface RiddleConfig {
  kind: 'riddle';
  raetsel: {
    id: string;
    hinweise: [string, string, string];
    loesung: string;
    optionen: string[];
    bild?: AssetId;
    factIds: string[];
  }[];
  anzahl?: number;
}
export type KeyNode =
  { id: string; frage: string; ja: string; nein: string } | { id: string; ergebnis: string };
export interface KeyConfig {
  kind: 'key';
  start: string;
  knoten: KeyNode[];
  /** zu bestimmende Bäume: Bilder, auf die das Kind beim Antworten schaut */
  ziele: { baum: string; bilder: AssetId[]; steckbrief: string[]; factIds: string[] }[];
}
export interface WordsearchConfig {
  kind: 'wordsearch';
  liste: string[];
  seed: number;
}
export interface ScrambleConfig {
  kind: 'scramble';
  woerter: { wort: string; bild: AssetId }[];
  anzahl: number;
}
export interface CrosswordConfig {
  kind: 'crossword';
  woerter: { wort: string; hinweis: string; bild?: AssetId }[];
  seed: number;
}
export interface ClozeConfig {
  kind: 'cloze';
  titel: string;
  /** Text mit Lücken in eckigen Klammern: „Der [Stamm] trägt den Baum.“ */
  saetze: { text: string; factIds: string[] }[];
  ablenker: string[];
}
export interface ReadingConfig {
  kind: 'reading';
  titel: string;
  zeilen: string[];
  fragen: { id: string; frage: string; fragewort: string; zeile: number; factIds: string[] }[];
}
export interface ErrorWordsConfig {
  kind: 'errorwords';
  saetze: {
    id: string;
    satz: string;
    fehler: { falsch: string; richtig: string; optionen: string[] }[];
    factIds: string[];
  }[];
}
export interface SpellingConfig {
  kind: 'spelling';
  schwerpunkt?: string;
}
export interface CacheConfig {
  kind: 'cache';
  verstecke: 6 | 12;
}
export interface CleanupConfig {
  kind: 'cleanup';
  tonnen: { id: string; titel: string; farbe: string }[];
  teile: { id: string; label: string; bild: AssetId; tonne: string }[];
}
export interface ExamConfig {
  kind: 'exam';
  anzahl: number;
}
export interface LiftConfig {
  kind: 'lift';
  stockwerke: { id: string; titel: string; alternativ?: string }[];
  tiere: { id: string; label: string; bild: AssetId; stockwerk: string; factIds: string[] }[];
}
export interface LeafLabConfig {
  kind: 'leaflab';
}

export type GameConfig =
  | QuizConfig
  | TrueFalseConfig
  | LabelConfig
  | SortConfig
  | GridConfig
  | MemoryConfig
  | HiddenConfig
  | PuzzleConfig
  | SequenceConfig
  | FoodWebConfig
  | RiddleConfig
  | KeyConfig
  | WordsearchConfig
  | ScrambleConfig
  | CrosswordConfig
  | ClozeConfig
  | ReadingConfig
  | ErrorWordsConfig
  | SpellingConfig
  | CacheConfig
  | CleanupConfig
  | ExamConfig
  | LiftConfig
  | LeafLabConfig;

export interface WaldbuchKarte {
  id: string;
  titel: string;
  kategorie: 'baum' | 'tier' | 'begriff';
  bild: AssetId;
  fakten: string[];
  /** Wird ein Fakt mit dieser ID richtig beantwortet, zählt das als Treffer. */
  factIds: string[];
  /** im Mein-Wald-Shop: Laub- oder Nadelbaum */
  waldTyp?: 'laub' | 'nadel';
}
