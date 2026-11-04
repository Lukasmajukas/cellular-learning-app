import { useEffect, useRef } from 'react';
import { motion, animate, type Transition } from 'motion/react';
import { c } from '../theme';
import type { TokenKey } from '../theme/tokens';
import { SPRING, FEEDBACK, useCalm, useEntrance, INSTANT } from '../theme/motion';

// A progress bar. `value` is 0 to 1. The fill grows from the left with a spring (a cover slides away: it moves, nothing
// changes width, so it stays smooth: DESIGN.md section 7). It animates a whole `transform`, which the browser runs off the main thread (R07). `glow` = the signal-to-on-air colour fade from look A.
// `testId` goes on the bar; it carries data-value (0-100) and the usual progressbar role for screen readers.
// `from` (0 to 1): show this amount first and spring to `value` (the top bar's goal after a lesson, R07), with
// `transition` instead of the plain fill spring if given. It uses useEntrance, so it moves even where Motion skips first animations.
// `spark` (the lesson's bar, R11): each time the bar steps forward, a soft light at its tip flashes on and fades
// (see-through-ness only; off with Reduce motion).
export function ProgressBar({ value, label, testId, height = 10, tone = 'glow', animateIn = false, from, transition, spark = false }:
  { value: number; label: string; testId?: string; height?: number; tone?: 'glow' | TokenKey; animateIn?: boolean; from?: number; transition?: Transition; spark?: boolean }) {
  const calm = useCalm(), on = useEntrance();
  const clamp = (x: number) => Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0));
  const v = clamp(value), pct = Math.round(v * 100);
  const shown = from !== undefined && !on && !calm ? clamp(from) : v;
  const tip = useRef<HTMLDivElement>(null), last = useRef(v);
  useEffect(() => {
    if (spark && !calm && v > last.current && tip.current) animate(tip.current, FEEDBACK.sparkKeys, FEEDBACK.spark);
    last.current = v;
  }, [v, spark, calm]);
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} data-testid={testId} data-value={pct}
      style={{ position: 'relative', height, borderRadius: height / 2, background: c.track, overflow: 'hidden' }}>
      {/* The colour stays put across the whole track, and a cover in the track's own colour slides off it to the right
          (R09). So the fill always starts signal-blue at the left and turns on-air green as it nears the end, as in look A;
          before, the whole colour fade slid in with the fill, so a short fill showed only its green end. The cover's
          rounded left corners give the fill a rounded end. `data-fill` marks the moving edge. */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: tone === 'glow' ? `linear-gradient(90deg, ${c.signal}, ${c.onAir})` : c[tone] }} />
      <motion.div data-fill initial={animateIn && !calm ? { transform: 'translateX(0%)' } : false} animate={{ transform: `translateX(${shown * 100}%)` }}
        transition={calm ? INSTANT : transition ?? SPRING.fill}
        style={{ position: 'absolute', inset: 0, borderRadius: `${height / 2}px 0 0 ${height / 2}px`, background: c.track }}>
        {/* The spark rides on the cover's left edge, which is the fill's tip. A still soft light; only its see-through-ness moves. */}
        {spark && <div ref={tip} aria-hidden data-spark style={{ position: 'absolute', top: 0, bottom: 0, left: -height * 1.5, width: height * 3, opacity: 0,
          background: `radial-gradient(closest-side, ${c.text}, color-mix(in srgb, ${c.onAir} 60%, transparent) 55%, transparent)` }} />}
      </motion.div>
    </div>
  );
}
