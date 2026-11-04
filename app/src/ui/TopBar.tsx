import { useEffect, useRef, useState, type RefObject } from 'react';
import { animate, motion, useMotionValue, useTransform, type DOMKeyframesDefinition, type Transition } from 'motion/react';
import { c, mono, RADIUS } from '../theme';
import { Icon } from '../Icon';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { TOP_BAR, useCalm } from '../theme/motion';

// The top bar (redesign R07, DESIGN.md section 6 "stat chip" and section 7 moment 5): streak, XP, streak freezes and
// the daily goal. Its numbers move only when they really went up while the app was open (a lesson or review finished,
// a streak repaired): XP counts up with a "+30" rising off it, the flame flickers once, the goal bar springs forward
// and flashes when the goal is reached, a new freeze pops in. At start-up it simply shows the numbers.
// Reduce motion: the numbers just change. Every speed comes from TOP_BAR in the speed file.

const hidden = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const;

// What the top bar showed last for each number, kept while the app runs: the top bar disappears during a lesson and
// comes back with the new numbers, so it needs to remember the old ones. Restarting the app forgets them (no moment).
const shown = new Map<string, number>();
export type Change = { from: number; to: number; n: number };
export const grew = (m: Change) => m.to > m.from;
// The number to show for `key`, with where it came from. `n` goes up with every change, so a moment can play again.
export function useChange(key: string, value: number): Change {
  const [m, setM] = useState<Change>(() => ({ from: shown.get(key) ?? value, to: value, n: 0 }));
  let now = m;
  if (m.to !== value) { now = { from: m.to, to: value, n: m.n + 1 }; setM(now); }
  useEffect(() => { shown.set(key, value); }, [key, value]);
  return now;
}

// Plays `keys` on the element once each time `play` turns up for a new change (never with Reduce motion).
function useMoment(ref: RefObject<Element | null>, m: Change, play: boolean, keys: DOMKeyframesDefinition, transition: Transition) {
  const calm = useCalm();
  useEffect(() => {
    if (!ref.current || calm || !play) return;
    const a = animate(ref.current, keys, transition);
    return () => a.stop();
  }, [m]); // eslint-disable-line react-hooks/exhaustive-deps -- once per change
}

// A number that counts up from the old value to the new one, like a meter (the measured exception in DESIGN.md section 7).
function Count({ m }: { m: Change }) {
  const calm = useCalm();
  const mv = useMotionValue(grew(m) && !calm ? m.from : m.to);
  const text = useTransform(mv, v => String(Math.round(v)));
  useEffect(() => {
    if (calm || !grew(m)) { mv.set(m.to); return; }
    mv.set(m.from);
    const a = animate(mv, m.to, TOP_BAR.count);
    return () => a.stop();
  }, [m, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  return <motion.span>{text}</motion.span>;
}

export function TopBar({ streak, xp, xpToday, freezes, done, goal }:
  { streak: number; xp: number; xpToday: number; freezes: number; done: number; goal: number }) {
  const calm = useCalm();
  const s = useChange('streak', streak), x = useChange('xp', xp), t = useChange('xpToday', xpToday);
  const f = useChange('freezes', freezes), d = useChange('done', done);
  const reached = done >= goal, justReached = grew(d) && reached && d.from < goal;

  const flame = useRef<HTMLSpanElement>(null), glow = useRef<HTMLSpanElement>(null), num = useRef<HTMLSpanElement>(null);
  const float = useRef<HTMLSpanElement>(null), pill = useRef<HTMLSpanElement>(null), flash = useRef<HTMLSpanElement>(null), check = useRef<HTMLSpanElement>(null);
  useMoment(flame, s, grew(s), TOP_BAR.flickerKeys, TOP_BAR.flicker);
  useMoment(glow, s, grew(s), TOP_BAR.glowKeys, TOP_BAR.flicker);
  useMoment(num, s, grew(s), TOP_BAR.popKeys, TOP_BAR.pop);
  useMoment(float, x, grew(x), TOP_BAR.floatKeys, TOP_BAR.float);
  useMoment(pill, f, grew(f), TOP_BAR.popKeys, TOP_BAR.pop);
  useMoment(flash, d, justReached, TOP_BAR.flashKeys, TOP_BAR.flash);
  useMoment(check, d, justReached, { scale: [0, 1] }, TOP_BAR.check);
  const waiting = !calm; // things that only appear during a moment start invisible (their moment shows them)

  return <>
    <div data-testid="hud" style={{ display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
      {/* Streak: the flame has a soft still glow while your streak is alive ("glow means on air"). */}
      <span data-testid="streak" title="Streak (days in a row)" data-moment={grew(s) ? s.n + 1 : undefined}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 18, fontWeight: 700, ...mono, color: c.streak }}>
        <span ref={flame} data-testid="streak-flame" style={{ position: 'relative', display: 'grid', placeItems: 'center', width: 22, height: 22 }}>
          <span ref={glow} data-testid="streak-glow" aria-hidden style={{ position: 'absolute', inset: -9, borderRadius: '50%',
            background: `radial-gradient(circle, ${c.streak} 0%, transparent 65%)`, opacity: streak > 0 ? 0.25 : 0 }} />
          <Icon name="flame" size={22} style={{ position: 'relative' }} />
        </span>
        <span ref={num} style={{ display: 'inline-block' }}>{streak}</span>
      </span>
      {/* XP: the total counts up; today's XP sits beside it, smaller. */}
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
        <span data-testid="xp-total" title="XP in total" data-to={xp}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 18, fontWeight: 700, ...mono, color: c.signal, alignSelf: 'center' }}>
          <Icon name="bolt" size={20} /><Count m={x} /><span style={hidden}> XP</span>
        </span>
        <span data-testid="xp-today" title="XP earned today" style={{ ...mono, fontSize: 13, color: c.textMuted }}>+<Count m={t} /><span style={hidden}> XP today</span></span>
        {grew(x) && !calm && <span key={x.n} ref={float} data-testid="xp-float" aria-hidden
          style={{ position: 'absolute', left: 26, top: -6, fontSize: 13, fontWeight: 700, ...mono, color: c.signal, opacity: 0, pointerEvents: 'none' }}>+{x.to - x.from}</span>}
      </span>
      {/* Streak freezes: a small pill, only when you have one. */}
      {freezes > 0 && <span ref={pill} data-testid="freezes" title="Streak freezes: a missed day that won't break your streak"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px 2px 6px', borderRadius: RADIUS.pill, fontSize: 15, fontWeight: 700, ...mono,
          color: c.review, background: c.surface2, border: `1px solid ${c.borderStrong}` }}>
        <Icon name="freeze" size={16} label="Streak freezes:" />{freezes}
      </span>}
    </div>
    {/* The daily goal: look A's bar (signal fading to on-air); solid on-air with a check once you reach it. */}
    <div data-testid="goal" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ position: 'relative', display: 'block', width: 76 }}>
        <ProgressBar testId="goal-bar" label="Daily goal" value={done / goal} height={10} tone={reached ? 'onAir' : 'glow'}
          from={grew(d) ? d.from / goal : undefined} transition={grew(d) ? TOP_BAR.fill : undefined} />
        {justReached && !calm && <span key={d.n} ref={flash} data-testid="goal-flash" aria-hidden
          style={{ position: 'absolute', inset: -2, borderRadius: 7, background: c.onAir, opacity: 0 }} />}
      </span>
      <span data-testid="goal-text" style={{ ...mono, fontSize: 13, color: reached ? c.onAir : c.textMuted, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
        <span style={hidden}>Daily goal: </span>{Math.min(done, goal)} of {goal}
        {reached && <span key={d.n} ref={check} data-testid="goal-check" style={{ display: 'inline-grid', transform: justReached && waiting ? 'scale(0)' : undefined }}>
          <Icon name="check" size={16} label="reached" /></span>}
      </span>
    </div>
  </>;
}

// Shown at the top of the path for 48 hours after a missed day broke your streak (T54): one tap gives it back.
export function RepairCard({ days, onRepair }: { days: number; onRepair: () => void }) {
  return (
    <div data-testid="repair-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: RADIUS.card,
      background: c.surface, border: `1px solid ${c.streak}` }}>
      <span aria-hidden style={{ width: 40, height: 40, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center', background: c.surface2, color: c.streak }}>
        <Icon name="flame" size={22} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, lineHeight: 1.25 }}>Save your {days}-day streak</div>
        <div style={{ fontSize: 14, lineHeight: 1.4, color: c.textMuted, marginTop: 2 }}>You missed a day. You can repair it for 48 hours.</div>
      </div>
      <Button kind="streak" icon="repair" data-testid="repair" aria-label={`Repair your ${days}-day streak`} onClick={onRepair}>Repair</Button>
    </div>
  );
}
