import { useSettings } from '../store/settings';

let ctx: AudioContext | null = null;

function ton(freqs: number[], dauer: number, typ: OscillatorType, laut = 0.15) {
  if (!useSettings.getState().toene) return;
  try {
    ctx ??= new AudioContext();
    const t0 = ctx.currentTime;
    freqs.forEach((f, i) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      osc.type = typ;
      osc.frequency.value = f;
      const start = t0 + i * dauer * 0.8;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(laut, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dauer);
      osc.connect(gain).connect(ctx!.destination);
      osc.start(start);
      osc.stop(start + dauer + 0.05);
    });
  } catch {
    /* Audio nicht verfügbar */
  }
}

export const sound = {
  richtig: () => ton([660, 880], 0.14, 'sine'),
  falsch: () => ton([330, 262], 0.18, 'triangle', 0.08),
  geschafft: () => ton([523, 659, 784, 1047], 0.16, 'sine'),
  klick: () => ton([520], 0.05, 'sine', 0.05),
};
