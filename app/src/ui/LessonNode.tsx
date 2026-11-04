import { motion } from 'motion/react';
import { c } from '../theme';
import { Icon } from '../Icon';
import { SPRING, PRESS_ROUND } from '../theme/motion';
import { usePress } from './press';
import type { Status } from '../path';

// One lesson circle on the path map (redesign R05, DESIGN.md section 6 "lesson node"), in three looks:
// - done: a dark green disc with a green tower and a small check badge (on air);
// - current: the biggest, a bright signal-blue disc with two still rings and a soft glow around it (on air next);
// - locked: a small dark disc with a dashed outline and a lock.
// Every look has its own icon too, so colour is never the only clue. R06 makes the rings breathe.
export const NODE_SIZE: Record<Status, number> = { done: 64, current: 80, locked: 56 };
export const NODE_BOX = 128; // the square every node is centred in (the current one's outer ring fits inside)
const RINGS = [100, 122];    // the current lesson's two rings (diameters)
export const NODE_RING = RINGS[0]; // its name starts beside the inner ring (the outer one is faint enough to pass behind words)

const LOOK = {
  done: { background: c.onAirBg, color: c.onAir, border: `2px solid ${c.onAir}` },
  current: { background: c.signal, color: c.onBright, border: `2px solid ${c.signal}` },
  locked: { background: c.bg, color: c.lockedIcon, border: `2px dashed ${c.locked}` },
};

// It pops in (the "bouncy" spring, one after another) and squishes when pressed, like every button.
// The pop-in is on the wrapper, so the press keeps its own quick spring (and no pop-in delay).
export function LessonNode({ id, title, status, delay, onClick }: { id: string; title: string; status: Status; delay: number; onClick: () => void }) {
  const open = status !== 'locked', size = NODE_SIZE[status];
  const press = usePress(open, PRESS_ROUND);
  const centred = { position: 'absolute', left: '50%', top: '50%', borderRadius: '50%', pointerEvents: 'none' } as const;
  return (
    <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...SPRING.bouncy, delay }}
      style={{ position: 'relative', width: NODE_BOX, height: NODE_BOX, display: 'grid', placeItems: 'center' }}>
      {status === 'current' && <>
        {/* A still glow (its own layer: R06 may fade it in and out, never blur it), then the two rings. */}
        <span aria-hidden data-testid="lesson-glow" style={{ ...centred, width: NODE_BOX, height: NODE_BOX, margin: -NODE_BOX / 2,
          background: `radial-gradient(circle, color-mix(in srgb, ${c.signal} 28%, transparent) 30%, transparent 70%)` }} />
        {RINGS.map((d, k) => <span key={d} aria-hidden data-testid="lesson-ring" style={{ ...centred, width: d, height: d, margin: -d / 2, boxSizing: 'border-box',
          border: `1.5px solid ${c.signal}`, opacity: k ? 0.18 : 0.38 }} />)}
      </>}
      <motion.button data-testid={`lesson-${id}`} data-status={status} disabled={!open} onClick={onClick} aria-label={`${title}, ${status}`} {...press}
        style={{ position: 'relative', width: size, height: size, borderRadius: '50%', padding: 0, display: 'grid', placeItems: 'center', boxSizing: 'border-box',
          ...LOOK[status], cursor: open ? 'pointer' : 'not-allowed' }}>
        <Icon name={status === 'locked' ? 'lock' : 'tower'} size={status === 'current' ? 40 : status === 'done' ? 30 : 24} />
        {status === 'done' && <span data-testid="lesson-check" style={{ position: 'absolute', right: -4, bottom: -4, width: 24, height: 24, borderRadius: '50%',
          display: 'grid', placeItems: 'center', background: c.onAir, color: c.onBright, border: `2px solid ${c.bg}` }}><Icon name="check" size={14} /></span>}
      </motion.button>
    </motion.span>
  );
}
