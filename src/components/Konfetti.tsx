import { useMemo } from 'react';

/** Blätter-Konfetti (CSS). Respektiert prefers-reduced-motion über das Stylesheet. */
export function Konfetti() {
  const blaetter = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        dur: 2.2 + Math.random() * 1.6,
        farbe: ['#D9822B', '#B83A2E', '#E8C33A', '#7FA650', '#2F6B3B'][i % 5],
        rot: Math.random() * 360,
      })),
    [],
  );
  return (
    <div className="konfetti" aria-hidden="true">
      {blaetter.map((b, i) => (
        <span
          key={i}
          style={{
            left: `${b.left}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
            background: b.farbe,
            transform: `rotate(${b.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}
