import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Settings {
  autoVorlesen: boolean;
  sprechtempo: number;
  toene: boolean;
  blitzrunden: boolean;
  suchselStufe: 1 | 2 | 3;
  allesFrei: boolean;
  pausenHinweis: boolean;
  pin: string;
  set(patch: Partial<Omit<Settings, 'set'>>): void;
}

export const useSettings = create<Settings>()(
  persist(
    (set) => ({
      autoVorlesen: false,
      sprechtempo: 0.9,
      toene: true,
      blitzrunden: false,
      suchselStufe: 1,
      allesFrei: false,
      pausenHinweis: true,
      pin: '',
      set: (patch) => set(patch),
    }),
    { name: 'waldheld:settings', version: 1 },
  ),
);
