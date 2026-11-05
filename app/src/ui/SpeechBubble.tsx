import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'motion/react';
import { c } from '../theme';
import { SPRING, QUICK_FADE, useCalm } from '../theme/motion';

// What Beacon says, in a bubble whose pointy corner (bottom left) points back at Beacon. It pops in with a little bounce
// (after `delay` seconds, if given). Beacon's lines are 8 words or fewer, plain and kind (DESIGN.md section 8); they live
// in one data file (src/questionScreen.ts). Give it a new `key` when the words change, so it pops in again.
// Idea I61: `point="up"` is for a bubble that sits under Beacon, in the middle (lesson complete on a narrow window): all four
// corners round, and a small pointy corner in the middle of its top edge points up at Beacon. It pops from that corner.
const TIP = 10;   // the pointy corner: a 10 px square turned on its corner, half of it showing above the bubble
export function SpeechBubble({ children, style, delay = 0, point = 'left', ...rest }:
  { children: ReactNode; style?: CSSProperties; delay?: number; point?: 'left' | 'up'; 'data-testid'?: string }) {
  const calm = useCalm(); // with Reduce motion: a quick fade, no pop
  const up = point === 'up';
  return (
    <motion.div role="status" data-point={point} {...rest} initial={{ scale: calm ? 1 : 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={calm ? QUICK_FADE : { ...SPRING.bouncy, delay }}
      style={{ display: 'inline-block', maxWidth: 240, padding: '10px 14px', fontSize: 15, lineHeight: 1.35, textAlign: 'left',
        transformOrigin: up ? '50% 0%' : '0% 100%', position: 'relative',
        background: c.surface2, border: `1px solid ${c.borderStrong}`, borderRadius: up ? 14 : '14px 14px 14px 4px', color: c.text, ...style }}>
      {up && <span aria-hidden data-tip style={{ position: 'absolute', top: -TIP / 2 - 1, left: `calc(50% - ${TIP / 2}px)`, width: TIP, height: TIP,
        transform: 'rotate(45deg)', borderRadius: '3px 0 0 0', background: c.surface2,
        borderTop: `1px solid ${c.borderStrong}`, borderLeft: `1px solid ${c.borderStrong}`, boxSizing: 'border-box' }} />}
      {children}
    </motion.div>
  );
}
