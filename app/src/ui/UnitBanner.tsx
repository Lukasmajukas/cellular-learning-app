import { motion } from 'motion/react';
import { c, mono } from '../theme';
import type { TokenKey } from '../theme/tokens';
import { Icon } from '../Icon';
import { ON_AIR, useCalm, useEntrance } from '../theme/motion';

// A unit's banner on the path map (redesign R05, DESIGN.md section 6): a glowing bar on the left, a small "UNIT 3" label,
// the unit's name, and how many of its lessons are done ("2 / 5"). The bar's colour says where you are:
// signal blue = you're in this unit, on-air green = all done (with a check, so colour is never the only clue), dim = not reached yet.
// R06 gives it two moments, right after the lesson that caused them (see ON_AIR in the speed file):
// - done: you just finished the whole unit: a green sweep runs across the banner and the "done" check pops on;
// - opened: you just reached this unit: its blue bar draws itself down over the dim one.
const TONE: Record<'done' | 'open' | 'locked', { bar: TokenKey; label: TokenKey; title: TokenKey }> = {
  open: { bar: 'signal', label: 'signal', title: 'text' },
  done: { bar: 'onAir', label: 'onAir', title: 'text' },
  locked: { bar: 'locked', label: 'textMuted', title: 'textMuted' },
};
export type BannerMoment = 'done' | 'opened';

export function UnitBanner({ number, title, status, done, total, testId, moment }:
  { number: number; title: string; status: keyof typeof TONE; done: number; total: number; testId?: string; moment?: BannerMoment }) {
  const t = TONE[status], calm = useCalm(), on = useEntrance(), show = calm ? undefined : moment;
  const bar = { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, pointerEvents: 'none' } as const;
  return (
    <div data-testid={testId} data-status={status} data-moment={show} style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', gap: 12, padding: '2px 0 2px 17px' }}>
      {/* The bar. Reaching the unit: the dim bar first, and the bright one draws itself down over it. */}
      {show === 'opened' && <span aria-hidden style={{ ...bar, background: c.locked }} />}
      <motion.span aria-hidden data-testid="banner-bar" style={{ ...bar, background: c[t.bar], originY: 0 }}
        initial={false} animate={{ scaleY: show === 'opened' && !on ? 0 : 1 }} transition={ON_AIR.barDraw} />
      {/* Finishing the unit: a soft green band sweeps across once (its own layer: it slides and fades, never blurs). */}
      {show === 'done' && <motion.span aria-hidden data-testid="banner-sweep" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '60%', pointerEvents: 'none',
        background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${c.onAir} 22%, transparent), transparent)` }}
        initial={{ x: '-100%', opacity: 1 }} animate={on ? { x: '170%', opacity: 0.6 } : { x: '-100%', opacity: 1 }} transition={ON_AIR.banner} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...mono, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, color: c[t.label],
          display: 'flex', alignItems: 'center', gap: 6 }}>
          Unit {number}{status === 'done' && <motion.span data-testid="banner-done" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, originX: 0 }}
            initial={false} animate={show === 'done' && !on ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }} transition={ON_AIR.bannerCheck}>
            <Icon name="check" size={14} /><span>done</span></motion.span>}
        </div>
        <h2 style={{ margin: '2px 0 0', fontSize: 23, color: c[t.title] }}>{title}</h2>
      </div>
      <span aria-label={`${done} of ${total} lessons done`} style={{ ...mono, fontSize: 14, color: c.textMuted, whiteSpace: 'nowrap', paddingBottom: 3 }}>{done} / {total}</span>
    </div>
  );
}
