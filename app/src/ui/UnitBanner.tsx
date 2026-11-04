import { c, mono } from '../theme';
import type { TokenKey } from '../theme/tokens';
import { Icon } from '../Icon';

// A unit's banner on the path map (redesign R05, DESIGN.md section 6): a glowing bar on the left, a small "UNIT 3" label,
// the unit's name, and how many of its lessons are done ("2 / 5"). The bar's colour says where you are:
// signal blue = you're in this unit, on-air green = all done (with a check, so colour is never the only clue), dim = not reached yet.
const TONE: Record<'done' | 'open' | 'locked', { bar: TokenKey; label: TokenKey; title: TokenKey }> = {
  open: { bar: 'signal', label: 'signal', title: 'text' },
  done: { bar: 'onAir', label: 'onAir', title: 'text' },
  locked: { bar: 'locked', label: 'textMuted', title: 'textMuted' },
};

export function UnitBanner({ number, title, status, done, total, testId }:
  { number: number; title: string; status: keyof typeof TONE; done: number; total: number; testId?: string }) {
  const t = TONE[status];
  return (
    <div data-testid={testId} data-status={status} style={{ display: 'flex', alignItems: 'flex-end', gap: 12, padding: '2px 0 2px 14px',
      borderLeft: `3px solid ${c[t.bar]}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...mono, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, color: c[t.label],
          display: 'flex', alignItems: 'center', gap: 6 }}>
          Unit {number}{status === 'done' && <><Icon name="check" size={14} /><span>done</span></>}
        </div>
        <h2 style={{ margin: '2px 0 0', fontSize: 23, color: c[t.title] }}>{title}</h2>
      </div>
      <span aria-label={`${done} of ${total} lessons done`} style={{ ...mono, fontSize: 14, color: c.textMuted, whiteSpace: 'nowrap', paddingBottom: 3 }}>{done} / {total}</span>
    </div>
  );
}
