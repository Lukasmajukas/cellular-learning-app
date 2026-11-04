import { motion, type Transition } from 'motion/react';
import { c } from '../theme';
import type { TokenKey } from '../theme/tokens';
import { SPRING, useCalm, useEntrance, INSTANT } from '../theme/motion';

// A progress bar. `value` is 0 to 1. The fill slides in from the left with a spring (it moves, it never changes width,
// so it stays smooth: DESIGN.md section 7). `glow` = the signal-to-on-air colour fade from look A.
// `testId` goes on the bar; it carries data-value (0-100) and the usual progressbar role for screen readers.
// `from` (0 to 1): show this amount first and spring to `value` (the top bar's goal after a lesson, R07), with
// `transition` instead of the plain fill spring if given. It uses useEntrance, so it moves even where Motion skips first animations.
export function ProgressBar({ value, label, testId, height = 10, tone = 'glow', animateIn = false, from, transition }:
  { value: number; label: string; testId?: string; height?: number; tone?: 'glow' | TokenKey; animateIn?: boolean; from?: number; transition?: Transition }) {
  const calm = useCalm(), on = useEntrance();
  const clamp = (x: number) => Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0));
  const v = clamp(value), pct = Math.round(v * 100);
  const shown = from !== undefined && !on && !calm ? clamp(from) : v;
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} data-testid={testId} data-value={pct}
      style={{ position: 'relative', height, borderRadius: height / 2, background: c.track, overflow: 'hidden' }}>
      <motion.div data-fill initial={animateIn && !calm ? { x: '-100%' } : false} animate={{ x: `${(shown - 1) * 100}%` }}
        transition={calm ? INSTANT : transition ?? SPRING.fill}
        style={{ position: 'absolute', inset: 0, borderRadius: height / 2,
          background: tone === 'glow' ? `linear-gradient(90deg, ${c.signal}, ${c.onAir})` : c[tone] }} />
    </div>
  );
}
