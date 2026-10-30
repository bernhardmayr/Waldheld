import { useSettings } from '../store/settings';

let deVoice: SpeechSynthesisVoice | null = null;

function pickVoice() {
  if (typeof speechSynthesis === 'undefined') return;
  const voices = speechSynthesis.getVoices();
  deVoice =
    voices.find((v) => v.lang === 'de-DE' && v.localService) ??
    voices.find((v) => v.lang.startsWith('de')) ??
    null;
}
if (typeof speechSynthesis !== 'undefined') {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

export const ttsVerfuegbar = () => typeof speechSynthesis !== 'undefined';

/** Text vorlesen (Web Speech API, de-DE). Markdown-Sternchen werden entfernt. */
export function sprich(text: string) {
  if (!ttsVerfuegbar()) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(
    text.replace(/\*\*/g, '').replace(/→/g, ', wird gefressen von, ').replace(/–/g, ' nichts '),
  );
  u.lang = 'de-DE';
  if (deVoice) u.voice = deVoice;
  u.rate = useSettings.getState().sprechtempo;
  speechSynthesis.speak(u);
}

export function stoppeSprache() {
  if (ttsVerfuegbar()) speechSynthesis.cancel();
}
