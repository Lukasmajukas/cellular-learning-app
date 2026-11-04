import type { CSSProperties, ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { c, RADIUS, mono } from '../theme';
import { Icon } from '../Icon';
import { TILE, type TileState } from './tones';
import { PRESS_BIG, QUICK_FADE } from '../theme/motion';
import { usePress } from './press';

// One answer you can pick, with its number key on the left (keys 1-4 start working in R04).
// state: idle, selected (picked, not checked yet), paired (matched or placed, R10), right, wrong, dim (the others after checking).
// `n` can also be a pair's number (match the pairs, R10); `keyEmpty` draws an empty dashed number box (not paired yet).
// Right and wrong also get a tick or a cross on the right, so colour is never the only clue.
// The right tile glows: the glow is its own layer and only its see-through-ness changes (DESIGN.md section 7).
export function AnswerTile({ n, keyEmpty, state = 'idle', disabled, children, style, ...rest }:
  Omit<HTMLMotionProps<'button'>, 'style' | 'children'> & { n?: number; keyEmpty?: boolean; state?: TileState; style?: CSSProperties; children?: ReactNode }) {
  const t: { bg: keyof typeof c; fg: keyof typeof c; border: keyof typeof c; key: keyof typeof c } = TILE[state];
  const press = usePress(!disabled, PRESS_BIG);
  return (
    <motion.button type="button" data-state={state} disabled={disabled} {...press} {...rest}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, margin: '8px 0', padding: '12px 16px',
        boxSizing: 'border-box', textAlign: 'left', fontSize: 18, borderRadius: RADIUS.tile, border: `1.5px solid ${c[t.border]}`,
        background: c[t.bg], color: c[t.fg], cursor: disabled ? 'default' : 'pointer', ...style }}>
      {state === 'right' && <motion.span aria-hidden data-glow initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={QUICK_FADE}
        style={{ position: 'absolute', inset: -1.5, borderRadius: RADIUS.tile, pointerEvents: 'none',
          boxShadow: `0 0 16px color-mix(in srgb, ${c.onAir} 40%, transparent)` }} />}
      {n !== undefined && <span aria-hidden data-key style={{ ...mono, width: 26, height: 26, flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 13,
        borderRadius: 7, border: `1.5px solid ${c[t.key]}`, color: c[t.key] }}>{n}</span>}
      {n === undefined && keyEmpty && <span aria-hidden data-key="empty" style={{ width: 26, height: 26, flexShrink: 0, boxSizing: 'border-box',
        borderRadius: 7, border: `1.5px dashed ${c.borderStrong}` }} />}
      <span style={{ flex: 1 }}>{children}</span>
      {state === 'right' && <Icon name="check" size={20} label="right answer" style={{ color: c.onAir }} />}
      {state === 'wrong' && <Icon name="cross" size={20} label="your pick, not right" style={{ color: c.miss }} />}
    </motion.button>
  );
}
