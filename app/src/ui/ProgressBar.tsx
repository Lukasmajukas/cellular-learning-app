import { motion } from 'motion/react';
import { c } from '../theme';
import type { TokenKey } from '../theme/tokens';
import { SPRING, useCalm, INSTANT } from '../theme/motion';

// A progress bar. `value` is 0 to 1. The fill slides in from the left with a spring (it moves, it never changes width,
// so it stays smooth: DESIGN.md section 7). `glow` = the signal-to-on-air colour fade from look A.
// `testId` goes on the bar; it carries data-value (0-100) and the usual progressbar role for screen readers.
export function ProgressBar({ value, label, testId, height = 10, tone = 'glow', animateIn = false }:
  { value: number; label: string; testId?: string; height?: number; tone?: 'glow' | TokenKey; animateIn?: boolean }) {
  const calm = useCalm();
  const v = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0)), pct = Math.round(v * 100);
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} data-testid={testId} data-value={pct}
      style={{ position: 'relative', height, borderRadius: height / 2, background: c.track, overflow: 'hidden' }}>
      <motion.div data-fill initial={animateIn && !calm ? { x: '-100%' } : false} animate={{ x: `${(v - 1) * 100}%` }} transition={calm ? INSTANT : SPRING.fill}
        style={{ position: 'absolute', inset: 0, borderRadius: height / 2,
          background: tone === 'glow' ? `linear-gradient(90deg, ${c.signal}, ${c.onAir})` : c[tone] }} />
    </div>
  );
}
