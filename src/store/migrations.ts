import type { Progress } from './progress';

export const SCHEMA_VERSION = 1;

/** Migrationen je Schema-Version. Nie still löschen: fehlende Felder werden ergänzt. */
export function migrate(p: Partial<Progress>): Partial<Progress> {
  const out: Partial<Progress> = { ...p };
  // v0 → v1: Zähler, Fehlerwörter und Serie ergänzen
  out.zaehler ??= {};
  out.fehlerwoerter ??= [];
  out.serie ??= 0;
  out.meinWald ??= [];
  out.schemaVersion = SCHEMA_VERSION;
  return out;
}
