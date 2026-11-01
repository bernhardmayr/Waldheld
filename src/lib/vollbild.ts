import { useEffect } from 'react';

let aktiv = 0;

/**
 * Blendet die Kopfleiste aus, solange die Komponente sichtbar ist (Station und Spiel).
 * Gezählt, damit verschachtelte Nutzer (Station → Spiel) sich nicht gegenseitig aufheben.
 */
export function useOhneKopfleiste() {
  useEffect(() => {
    aktiv++;
    document.body.classList.add('im-spiel');
    return () => {
      aktiv--;
      if (aktiv === 0) document.body.classList.remove('im-spiel');
    };
  }, []);
}
