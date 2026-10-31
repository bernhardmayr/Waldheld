import '@fontsource/andika/latin-400.css';
import '@fontsource/andika/latin-700.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from './app/App';
import './app/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Neue Version sofort übernehmen: Seite lädt einmal neu, sobald ein Update aktiv ist.
// Zusätzlich jede Stunde und beim Zurückkehren in die App nach Updates suchen.
registerSW({
  immediate: true,
  onRegisteredSW(_url, reg) {
    if (!reg) return;
    setInterval(() => reg.update(), 60 * 60 * 1000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update();
    });
  },
});
