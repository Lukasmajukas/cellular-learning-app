import type { CSSProperties, ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { c, RADIUS } from '../theme';
import { Icon } from '../Icon';
import { TILE, type TileState } from './tones';
import { PRESS_PILL } from '../theme/motion';
import { usePress } from './press';
import { useFeedback, Glow } from './feedback';

// A small answer you can pick, as a rounded chip (redesign R10): the scenario clues' answers ("Low band" / "Mid band")
// and the items you put in order. The same looks as the answer tiles (src/ui/tones.ts TILE), only smaller and as wide
// as its words, so several fit in a row. Right and wrong add a tick or a cross, so colour is never the only clue.
// At least 44 px tall (the smallest thing you can click, DESIGN.md section 4).
// R11: like the tiles, a right chip pops and glows after Check, and a wrong pick shakes gently.
export function Chip({ state = 'idle', disabled, children, style, ...rest }:
  Omit<HTMLMotionProps<'button'>, 'style' | 'children'> & { state?: TileState; style?: CSSProperties; children?: ReactNode }) {
  const t: { bg: keyof typeof c; fg: keyof typeof c; border: keyof typeof c } = TILE[state];
  const press = usePress(!disabled, PRESS_PILL), move = useFeedback(state);
  return (
    <motion.button type="button" data-state={state} disabled={disabled} {...press} {...move} {...rest}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '8px 16px', boxSizing: 'border-box',
        fontSize: 16, fontWeight: 500, borderRadius: RADIUS.pill, border: `1.5px solid ${c[t.border]}`, background: c[t.bg], color: c[t.fg],
        cursor: disabled ? 'default' : 'pointer', ...style }}>
      <Glow on={state === 'right'} radius={RADIUS.pill} />
      {state === 'right' && <Icon name="check" size={18} label="right answer" style={{ color: c.onAir }} />}
      {state === 'wrong' && <Icon name="cross" size={18} label="your pick, not right" style={{ color: c.miss }} />}
      {children}
    </motion.button>
  );
}
