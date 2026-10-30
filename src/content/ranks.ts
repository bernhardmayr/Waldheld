export interface Rang {
  ab: number;
  w: string;
  m: string;
  belohnung: string;
  item?: 'lupe' | 'rucksack' | 'fernglas' | 'hut' | 'rahmen';
}

export const raenge: Rang[] = [
  { ab: 0, w: 'Waldentdeckerin', m: 'Waldentdecker', belohnung: 'Lupe für Pinsel', item: 'lupe' },
  { ab: 200, w: 'Spurenleserin', m: 'Spurenleser', belohnung: 'Rucksack für Pinsel', item: 'rucksack' },
  { ab: 600, w: 'Baumkennerin', m: 'Baumkenner', belohnung: 'neue Hintergründe für Mein Wald' },
  {
    ab: 1200,
    w: 'Waldforscherin',
    m: 'Waldforscher',
    belohnung: 'Fernglas: Wimmelbilder mit Extra-Zoom',
    item: 'fernglas',
  },
  { ab: 2000, w: 'Försterin', m: 'Förster', belohnung: 'Försterhut für Pinsel', item: 'hut' },
  { ab: 3000, w: 'Waldheldin', m: 'Waldheld', belohnung: 'goldener Rahmen und Urkunde', item: 'rahmen' },
];

export function rangIndex(eichelnGesamt: number): number {
  let i = 0;
  raenge.forEach((r, k) => {
    if (eichelnGesamt >= r.ab) i = k;
  });
  return i;
}
