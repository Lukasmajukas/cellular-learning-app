import type { CSSProperties } from 'react';
import { ICONS, type IconName } from './theme/icons';
export type { IconName } from './theme/icons';

// One of our own icons (src/theme/icons.ts). It takes the colour of the text around it (currentColor).
// `label` = what it means, for screen readers; leave it out when words next to it already say it.
// `solid` fills the shape too (used for stars that were earned).
export function Icon({ name, size = 24, label, solid = false, style }: { name: IconName; size?: number; label?: string; solid?: boolean; style?: CSSProperties }) {
  const shape = ICONS[name] as { lines: string[]; dots?: [number, number, number][] };
  return (
    <svg data-icon={name} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}>
      {shape.lines.map(d => <path key={d} d={d} fill={solid ? 'currentColor' : 'none'} />)}
      {shape.dots?.map(([x, y, r]) => <circle key={`${x},${y}`} cx={x} cy={y} r={r} fill="currentColor" stroke="none" />)}
    </svg>
  );
}

// Signal bars (0 to 5), like a phone's. Filled bars are "on"; the rest are dim outlines. Used on the lesson-complete screen.
export function SignalBars({ on, of = 5, size = 32, style }: { on: number; of?: number; size?: number; style?: CSSProperties }) {
  const w = size * 1.6, gap = 3, bw = (w - gap * (of - 1)) / of;
  return (
    <svg data-icon="signal-bars" width={w} height={size} viewBox={`0 0 ${w} ${size}`} aria-hidden style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      {Array.from({ length: of }, (_, i) => {
        const h = size * (0.28 + (0.72 * (i + 1)) / of), lit = i < on;
        return <rect key={i} data-on={lit} x={i * (bw + gap) + 1} y={size - h + 1} width={bw - 2} height={h - 2} rx={2}
          fill={lit ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={lit ? 0 : 1.5} opacity={lit ? 1 : 0.45} />;
      })}
    </svg>
  );
}
