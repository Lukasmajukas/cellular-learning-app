import type { CSSProperties } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { c, RADIUS } from '../theme';
import { Icon, type IconName } from '../Icon';
import { BUTTON, type ButtonKind } from './tones';
import { usePress } from './press';
import { PRESS_ROUND } from '../theme/motion';

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'style' | 'children'> & {
  kind?: ButtonKind; icon?: IconName; full?: boolean; big?: boolean; style?: CSSProperties; children?: React.ReactNode;
};

// A button in one of four looks: signal (the main action), on-air (go on / done), miss (after a wrong answer), quiet (everything else).
// It grows a little on hover and squishes when pressed (see ./press.ts). At least 44 px tall.
export function Button({ kind = 'signal', icon, full, big, disabled, style, children, ...rest }: ButtonProps) {
  const t: { bg: keyof typeof c; fg: keyof typeof c; border?: keyof typeof c } = BUTTON[kind];
  const press = usePress(!disabled);
  return (
    <motion.button type="button" data-kind={kind} disabled={disabled} {...press} {...rest}
      style={{
        display: full ? 'flex' : 'inline-flex', width: full ? '100%' : undefined, alignItems: 'center', justifyContent: 'center', gap: 8,
        minHeight: big ? 52 : 44, padding: big ? '12px 28px' : '8px 16px', boxSizing: 'border-box',
        fontSize: big ? 18 : 16, fontWeight: kind === 'quiet' ? 500 : 700, borderRadius: RADIUS.tile,
        border: `1.5px solid ${c[t.border ?? t.bg]}`, background: c[t.bg], color: c[t.fg],
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style,
      }}>
      {icon && <Icon name={icon} size={big ? 22 : 20} />}{children}
    </motion.button>
  );
}

// A round 44 x 44 button with only an icon. `label` is required: it's what a screen reader says and the hover tip shows.
export function IconButton({ icon, label, disabled, style, ...rest }: Omit<HTMLMotionProps<'button'>, 'style' | 'children'> & { icon: IconName; label: string; style?: CSSProperties }) {
  const press = usePress(!disabled, PRESS_ROUND);
  return (
    <motion.button type="button" aria-label={label} title={label} disabled={disabled} {...press} {...rest}
      style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', flexShrink: 0, padding: 0, border: 0, borderRadius: '50%',
        background: 'transparent', color: c.textMuted, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }}>
      <Icon name={icon} />
    </motion.button>
  );
}
