import { useRef } from 'react';
import type { PointerEvent as RPE } from 'react';

/**
 * Ziehen per Pointer Events (Touch, Maus, Stift). Ziele tragen data-drop="id".
 * Ein kurzer Tipp ohne Bewegung löst onTap aus (Antippen-dann-Ziel-Antippen).
 */
export function useDrag(onDrop: (dropId: string) => void, onTap: () => void, disabled = false) {
  const st = useRef<{ x: number; y: number; moved: boolean; el: HTMLElement; id: number } | null>(null);
  return {
    onPointerDown(e: RPE<HTMLElement>) {
      if (disabled || (e.pointerType === 'mouse' && e.button !== 0)) return;
      const el = e.currentTarget;
      st.current = { x: e.clientX, y: e.clientY, moved: false, el, id: e.pointerId };
    },
    onPointerMove(e: RPE<HTMLElement>) {
      const s = st.current;
      if (!s || s.id !== e.pointerId) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (!s.moved && Math.hypot(dx, dy) > 10) {
        s.moved = true;
        try {
          s.el.setPointerCapture(e.pointerId);
        } catch {
          /* ignorieren */
        }
        s.el.classList.add('ziehen');
      }
      if (s.moved) {
        s.el.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;
        document.querySelectorAll('.drop-hover').forEach((n) => n.classList.remove('drop-hover'));
        const t = ziel(s.el, e.clientX, e.clientY);
        t?.classList.add('drop-hover');
      }
    },
    onPointerUp(e: RPE<HTMLElement>) {
      const s = st.current;
      st.current = null;
      if (!s) return;
      document.querySelectorAll('.drop-hover').forEach((n) => n.classList.remove('drop-hover'));
      if (!s.moved) {
        onTap();
        return;
      }
      const t = ziel(s.el, e.clientX, e.clientY);
      s.el.style.transform = '';
      s.el.classList.remove('ziehen');
      if (t) onDrop(t.dataset.drop!);
    },
    onPointerCancel() {
      const s = st.current;
      st.current = null;
      if (s) {
        s.el.style.transform = '';
        s.el.classList.remove('ziehen');
      }
    },
    style: { touchAction: 'none' as const },
  };
}

function ziel(el: HTMLElement, x: number, y: number): HTMLElement | null {
  const vis = el.style.visibility;
  el.style.visibility = 'hidden';
  const t = document.elementFromPoint(x, y) as HTMLElement | null;
  el.style.visibility = vis;
  return t?.closest('[data-drop]') ?? null;
}
