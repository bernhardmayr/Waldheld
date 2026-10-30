import { animalArt } from './animals';
import { partArt, type ArtEntry } from './parts';
import { treeArt } from './trees';

/** Alle eigenen SVG-Zeichnungen, Schlüssel = fallbackSvg aus manifest.json. */
export const SVG: Record<string, ArtEntry> = {
  ...Object.fromEntries(Object.entries(treeArt).map(([k, render]) => [k, { render }])),
  ...Object.fromEntries(Object.entries(animalArt).map(([k, render]) => [k, { render }])),
  ...partArt,
};
