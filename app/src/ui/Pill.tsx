import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
import { motion } from 'motion/react';
import { c, RADIUS, mono } from '../theme';
import type { TokenKey } from '../theme/tokens';
import { Icon, type IconName } from '../Icon';
import { PILL, type PillTone } from './tones';
import { usePress } from './press';
import { PRESS_PILL } from '../theme/motion';

// A small rounded label, like "6 due". Not clickable (for a clickable one, see PillChoice).
export function Pill({ tone = 'quiet', icon, children, style, ...rest }: { tone?: PillTone; icon?: IconName; children: ReactNode; style?: CSSProperties; 'data-testid'?: string }) {
  const t: { bg: TokenKey; fg: TokenKey; border?: TokenKey } = PILL[tone];
  return (
    <span {...rest} data-tone={tone} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: RADIUS.pill,
      fontSize: 14, fontWeight: 700, lineHeight: 1.4, whiteSpace: 'nowrap', background: c[t.bg], color: c[t.fg], border: `1px solid ${c[t.border ?? t.bg]}`, ...style }}>
      {icon && <Icon name={icon} size={16} />}{children}
    </span>
  );
}

// A number with its icon, like the streak flame or XP bolt in the top bar. Numbers use the "code" font.
export function StatChip({ icon, tone, iconLabel, children, style, ...rest }: { icon: IconName; tone: TokenKey; iconLabel?: string; children: ReactNode; style?: CSSProperties; 'data-testid'?: string; title?: string }) {
  return (
    <span {...rest} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 18, ...mono, whiteSpace: 'nowrap', color: c[tone], ...style }}>
      <Icon name={icon} size={20} label={iconLabel} />{children}
    </span>
  );
}

// One choice out of a few, as a row of pills (like the daily goal: 1, 2, 3 or 5). Arrow keys move between them.
// `testId` goes on the group; each pill gets `<testId>-<value>`. An option may have an icon before its words (R15: Night / Day).
export function PillChoice<T extends string | number>({ label, options, value, onChange, testId }:
  { label: string; options: { value: T; text: string; icon?: IconName }[]; value: T; onChange: (v: T) => void; testId?: string }) {
  const move = (e: KeyboardEvent, i: number) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = options[(i + step + options.length) % options.length];
    onChange(next.value);
    (e.currentTarget.parentElement?.children[options.indexOf(next)] as HTMLElement | undefined)?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} data-testid={testId} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((o, i) => <PillButton key={String(o.value)} on={o.value === value} code={typeof o.value === 'number'} testId={testId && `${testId}-${o.value}`}
        onClick={() => onChange(o.value)} onKeyDown={e => move(e, i)}>{o.icon && <Icon name={o.icon} size={18} />}{o.text}</PillButton>)}
    </div>
  );
}

function PillButton({ on, code, testId, children, onClick, onKeyDown }: { on: boolean; code: boolean; testId?: string; children: ReactNode; onClick: () => void; onKeyDown: (e: KeyboardEvent) => void }) {
  const t: { bg: TokenKey; fg: TokenKey; border?: TokenKey } = on ? PILL.signal : PILL.quiet;
  const press = usePress(true, PRESS_PILL);
  return (
    <motion.button type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} data-testid={testId} onClick={onClick} onKeyDown={onKeyDown} {...press}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: 44, height: 44, padding: '0 16px', borderRadius: RADIUS.pill, fontSize: 16, fontWeight: 700, ...(code ? mono : {}), cursor: 'pointer',
        background: c[t.bg], color: c[t.fg], border: `1.5px solid ${c[t.border ?? t.bg]}` }}>{children}</motion.button>
  );
}
