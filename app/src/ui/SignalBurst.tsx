import { useLayoutEffect, useRef } from 'react';
import { animate } from 'motion/react';
import { c } from '../theme';
import { COMPLETE, nth, useCalm } from '../theme/motion';

// The "signal burst" (redesign R12, DESIGN.md section 7, moment 3): the lesson-complete celebration, instead of confetti.
// Three rings spread out from a point (Beacon's head) and fade, while 12 small wave pieces, like bits of a radio wave,
// fly outward and fade. All within 1.6 s, then it's gone; it plays once, when it appears.
// It's drawn in the page from plain boxes and lines (not on a canvas like the old confetti), so it shows the same on every
// computer, with or without a graphics chip (the confetti the owner never saw on Windows: T46, T57). Only whole
// transforms and see-through-ness move. It sits behind everything and never catches a tap.
// With Reduce motion it doesn't play at all. `window.__signalBursts` counts the bursts played, for the click tests.
const COLORS = [c.signal, c.onAir, c.streak, c.review];
const RING = 60;   // the rings' size before they grow (px)

export function SignalBurst({ x, y, 'data-testid': testId = 'signal-burst' }: { x: number; y: number; 'data-testid'?: string }) {
  const calm = useCalm();
  const box = useRef<HTMLDivElement>(null);
  // Started before the first paint, so nothing is ever seen at its end position first.
  useLayoutEffect(() => {
    const el = box.current;
    if (!el || calm) return;
    const w = window as unknown as { __signalBursts?: number };
    w.__signalBursts = (w.__signalBursts ?? 0) + 1;
    const runs = [
      ...[...el.querySelectorAll<HTMLElement>('[data-ring]')].map((r, k) => animate(r, COMPLETE.ringKeys, nth(COMPLETE.ring, k, COMPLETE.ringGap))),
      ...[...el.querySelectorAll<HTMLElement>('[data-piece]')].map(p => {
        const turn = `rotate(${p.dataset.piece}deg)`;
        return animate(p, { transform: [`${turn} translateY(-${COMPLETE.pieceFrom}px)`, `${turn} translateY(-${COMPLETE.pieceTo}px)`],
          opacity: COMPLETE.pieceFade }, COMPLETE.piece);
      }),
    ];
    return () => runs.forEach(a => a.stop());
  }, [calm]);
  if (calm) return null;
  return (
    <div ref={box} data-testid={testId} aria-hidden style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: COMPLETE.rings }, (_, k) => (
        <div key={k} data-ring={k} style={{ position: 'absolute', left: -RING / 2, top: -RING / 2, width: RING, height: RING, borderRadius: '50%',
          border: `2px solid ${k % 2 ? c.signal : c.onAir}`, boxSizing: 'border-box', opacity: 0, transform: 'scale(0.35)', willChange: 'transform, opacity' }} />
      ))}
      {Array.from({ length: COMPLETE.pieces }, (_, k) => {
        const deg = Math.round((360 / COMPLETE.pieces) * k + 15);
        // A short arc curving away from the middle, like a piece of a radio wave.
        return (
          <div key={`p${k}`} data-piece={deg} style={{ position: 'absolute', left: -8, top: -4, width: 16, height: 8, opacity: 0,
            transformOrigin: '8px 4px', transform: `rotate(${deg}deg) translateY(-${COMPLETE.pieceFrom}px)`, willChange: 'transform, opacity' }}>
            <svg width="16" height="8" viewBox="0 0 16 8" style={{ display: 'block' }}>
              <path d="M2 7Q8 0 14 7" fill="none" stroke={COLORS[k % COLORS.length]} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
