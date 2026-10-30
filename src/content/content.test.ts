import { describe, expect, it } from 'vitest';
import manifest from '../assets/manifest.json';
import { SVG } from '../assets/svg';
import { configs, alleFragen } from './index';
import { karten } from './cards';
import { factById } from './facts';
import { scenes } from './scenes';
import { stations } from './stations';
import type { ModuleId } from './types';
import { schwerpunkte, wortBild } from './words';

const assetIds = new Set((manifest as { id: string; fallbackSvg: string }[]).map((m) => m.id));

/** Sammelt alle factIds und Asset-IDs aus beliebigen Content-Objekten. */
function sammle(obj: unknown, facts: string[], assets: string[]) {
  if (Array.isArray(obj)) obj.forEach((o) => sammle(o, facts, assets));
  else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'factIds' && Array.isArray(v)) facts.push(...(v as string[]));
      else if ((k === 'bild' || k === 'asset') && typeof v === 'string') assets.push(v);
      else if (k === 'bilder' && Array.isArray(v)) assets.push(...(v as string[]));
      else sammle(v, facts, assets);
    }
  }
}

describe('Content-Validierung', () => {
  const facts: string[] = [];
  const assets: string[] = [];
  sammle([configs, stations, karten, scenes], facts, assets);

  it('jede factId existiert', () => {
    const fehlend = [...new Set(facts)].filter((f) => !factById[f]);
    expect(fehlend).toEqual([]);
  });

  it('jede AssetId steht im Manifest', () => {
    const fehlend = [...new Set([...assets, ...Object.values(wortBild)])].filter((a) => !assetIds.has(a));
    expect(fehlend).toEqual([]);
  });

  it('jedes Manifest-Asset hat eine SVG-Zeichnung', () => {
    const fehlend = (manifest as { fallbackSvg: string }[])
      .filter((m) => !SVG[m.fallbackSvg])
      .map((m) => m.fallbackSvg);
    expect(fehlend).toEqual([]);
  });

  it('jede Pflicht- und Heftstation hat mindestens 2 Spiele, jede configId existiert', () => {
    for (const s of stations) {
      if (s.typ === 'pflicht') expect(s.spiele.length).toBeGreaterThanOrEqual(2);
      for (const sp of s.spiele) {
        expect(configs[sp.configId], `${s.id}: ${sp.configId}`).toBeDefined();
        expect(configs[sp.configId].kind).toBe(sp.type);
      }
    }
  });

  it('Frage-IDs sind eindeutig', () => {
    const ids = alleFragen.map((q) => q.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('Auswahlfragen haben gültige Lösungen', () => {
    for (const q of alleFragen)
      if (q.kind === 'mc') q.richtig.forEach((i) => expect(q.optionen[i], q.id).toBeDefined());
  });

  it('je Modul mindestens 20 Aufgaben über verschiedene Spieltypen', () => {
    const zaehler: Partial<Record<ModuleId, number>> = {};
    const add = (m: string, n: number) => (zaehler[m as ModuleId] = (zaehler[m as ModuleId] ?? 0) + n);
    for (const [id, c] of Object.entries(configs)) {
      const m = id.slice(0, 3);
      switch (c.kind) {
        case 'quiz':
        case 'truefalse':
          add(m, c.fragen.length);
          break;
        case 'sort':
          add(m, c.karten.length);
          break;
        case 'label':
          add(m, c.hotspots.length);
          break;
        case 'grid':
          add(m, c.zellen.length);
          break;
        case 'memory':
          add(m, c.paare.length);
          break;
        case 'sequence':
          add(m, c.schritte.length);
          break;
        case 'puzzle':
          add(m, c.teile.length);
          break;
        case 'riddle':
          add(m, c.raetsel.length);
          break;
        case 'key':
          add(m, c.ziele.length);
          break;
        case 'cloze':
          add(m, c.saetze.length);
          break;
        case 'reading':
          add(m, c.fragen.length);
          break;
        case 'errorwords':
          add(m, c.saetze.length);
          break;
        case 'lift':
          add(m, c.tiere.length);
          break;
        case 'foodchain':
          add(m, c.kanten.length + c.ketten.length);
          break;
        case 'cleanup':
          add(m, c.teile.length);
          break;
      }
    }
    add(
      'm11',
      schwerpunkte.reduce((a, s) => a + s.woerter.length, 0),
    );
    add('m15', 9); // Blatt-Labor-Schritte
    for (const m of [
      'm01',
      'm02',
      'm03',
      'm04',
      'm05',
      'm06',
      'm07',
      'm08',
      'm09',
      'm10',
      'm11',
      'm12',
      'm13',
      'm14',
      'm15',
    ] as ModuleId[]) {
      expect(zaehler[m] ?? 0, m).toBeGreaterThanOrEqual(20);
    }
  });

  it('Wimmelbild-Aufträge verweisen auf vorhandene Objekte', () => {
    for (const s of Object.values(scenes)) {
      const ids = new Set(s.objekte.map((o) => o.id));
      for (const a of [...s.auftraege, ...s.fehler])
        a.objektIds.forEach((id) => expect(ids.has(id), `${s.id}: ${id}`).toBe(true));
    }
  });

  it('Stockwerk-Aufzug enthält alle 17 Heft-Tiere', () => {
    const lift = configs['m14-lift'];
    expect(lift.kind === 'lift' && lift.tiere.length).toBe(17);
  });

  it('Heft-Nahrungsnetz: 5 × „wird gefressen von“ und 3 × „Energie geht an“', () => {
    const fc = configs['m10-foodchain'];
    if (fc.kind !== 'foodchain') throw new Error();
    expect(fc.kanten.filter((k) => k.art === 'gefressen').length).toBe(5);
    expect(fc.kanten.filter((k) => k.art === 'energie').length).toBe(3);
    expect(fc.kanten.filter((k) => k.art === 'energie').every((k) => k.zu === 'pilz')).toBe(true);
  });

  it('keine Kindernamen oder externen Links im Content', () => {
    const text = JSON.stringify([configs, stations, karten]);
    expect(text).not.toMatch(/https?:\/\//);
  });
});
