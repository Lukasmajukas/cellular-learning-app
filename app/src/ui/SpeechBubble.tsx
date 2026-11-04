import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'motion/react';
import { c } from '../theme';
import { SPRING, QUICK_FADE, useCalm } from '../theme/motion';

// What Beacon says, in a bubble whose pointy corner (bottom left) points back at Beacon. It pops in with a little bounce.
// Beacon's lines are 8 words or fewer, plain and kind (DESIGN.md section 8); they'll live in one data file (R18).
// Give it a new `key` when the words change, so it pops in again.
export function SpeechBubble({ children, style, ...rest }: { children: ReactNode; style?: CSSProperties; 'data-testid'?: string }) {
  const calm = useCalm(); // with Reduce motion: a quick fade, no pop
  return (
    <motion.div role="status" {...rest} initial={{ scale: calm ? 1 : 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={calm ? QUICK_FADE : SPRING.bouncy}
      style={{ display: 'inline-block', maxWidth: 240, padding: '10px 14px', fontSize: 15, lineHeight: 1.35, textAlign: 'left', transformOrigin: '0% 100%',
        background: c.surface2, border: `1px solid ${c.borderStrong}`, borderRadius: '14px 14px 14px 4px', color: c.text, ...style }}>
      {children}
    </motion.div>
  );
}
