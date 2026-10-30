import type { Station } from '../content/types';

type StationsStand = Record<string, { sterne: number } | undefined>;

export const PFLICHT_FUER_ZUSATZ = 3;

export function pflichtMitStern(stand: StationsStand, pflichtIds: string[]): number {
  return pflichtIds.filter((id) => (stand[id]?.sterne ?? 0) >= 1).length;
}

/** Freischaltregeln aus SPEC Abschnitt 6. */
export function istOffen(
  station: Station,
  stand: StationsStand,
  pflichtIds: string[],
  allesFrei = false,
): boolean {
  if (allesFrei) return true;
  switch (station.typ) {
    case 'pflicht':
    case 'dauerhaft':
      return true;
    case 'zusatz':
      return pflichtMitStern(stand, pflichtIds) >= PFLICHT_FUER_ZUSATZ;
    case 'abschluss':
      return pflichtMitStern(stand, pflichtIds) >= pflichtIds.length;
  }
}

export function szeneOffen(stationId: string, stand: StationsStand, allesFrei = false): boolean {
  return allesFrei || (stand[stationId]?.sterne ?? 0) >= 1;
}
