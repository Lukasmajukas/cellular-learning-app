import { motion } from 'motion/react';
import { c, RADIUS } from '../theme';
import { SPRING, QUICK_FADE, useCalm, INSTANT } from '../theme/motion';

// An on/off switch. Inside is a real (see-through) checkbox, so clicking the row's words, the Space key and
// screen readers all work, and it reports itself as a "switch". On = the track fills with signal blue
// (a layer that fades in) and the knob springs to the right. `testId` goes on the checkbox; the knob is `<testId>-knob`.
// The 52 x 44 box is the clickable area (DESIGN.md: at least 44 x 44).
export function Switch({ checked, onChange, testId, label }: { checked: boolean; onChange: (on: boolean) => void; testId?: string; label?: string }) {
  const calm = useCalm();
  return (
    <span className="ui-switch" style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: 52, height: 44, flexShrink: 0 }}>
      <input type="checkbox" role="switch" data-testid={testId} checked={checked} aria-label={label} onChange={e => onChange(e.target.checked)}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', margin: 0, opacity: 0, cursor: 'pointer', zIndex: 1 }} />
      <span aria-hidden className="ui-switch-track" style={{ position: 'relative', width: 46, height: 28, borderRadius: RADIUS.pill, boxSizing: 'border-box',
        background: c.track, border: `1.5px solid ${checked ? c.signal : c.borderStrong}` }}>
        <motion.span initial={false} animate={{ opacity: checked ? 1 : 0 }} transition={QUICK_FADE}
          style={{ position: 'absolute', inset: -1.5, borderRadius: RADIUS.pill, background: c.signal }} />
        <motion.span data-testid={testId && `${testId}-knob`} initial={false} animate={{ x: checked ? 18 : 0 }} transition={calm ? INSTANT : SPRING.snappy}
          style={{ position: 'absolute', top: 3, left: 3, width: 19, height: 19, borderRadius: '50%', background: checked ? c.onBright : c.textMuted }} />
      </span>
    </span>
  );
}
