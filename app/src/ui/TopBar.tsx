import { useEffect, useRef, useState, type RefObject } from 'react';
import { animate, motion, useMotionValue, useTransform, type DOMKeyframesDefinition, type Transition } from 'motion/react';
import { c, mono, RADIUS } from '../theme';
import { Icon } from '../Icon';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { TOP_BAR, barAt, useCalm } from '../theme/motion';
import { play } from '../sound';

// The top bar (redesign R07, DESIGN.md section 6 "stat chip" and section 7 moment 5): streak, XP, streak freezes and
// the daily goal. Its numbers move only when they really went up while the app was open (a lesson or review finished,
// a streak repaired): XP counts up with a "+30" rising off it, the flame flickers once, the goal bar springs forward
// and flashes when the goal is reached, a new freeze pops in. At start-up it simply shows the numbers.
// Until its move starts, each number that went up still shows its old value (idea I30, `useHeld`): after a lesson's
// first finish the path plays first, and the top bar then adds it all up in one go.
// Idea I85: the gain is shown once. Today's "+N XP today" keeps its old value (or stays away) while the "+N" rises off
// the total, and fades in, in its own place, as the "+N" fades out (TOP_BAR.todayAt, 0.7 s into the moment).
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

// Idea I30: the number to SHOW for a change. A number that went up keeps its old value until `at` seconds (the start of
// its own move in the top bar's moment), so nothing shows the new value while the path still plays "coming on air".
// With Reduce motion, or when nothing went up, it's simply the new value.
export function useHeld(m: Change, at: number): number {
  const calm = useCalm();
  const hold = grew(m) && !calm;
  const [over, setOver] = useState(-1); // the change (`n`) whose wait is over
  useEffect(() => {
    if (!hold) return;
    const t = setTimeout(() => setOver(m.n), at * 1000);
    return () => clearTimeout(t);
  }, [m, hold, at]);
  return hold && over !== m.n ? m.from : m.to;
}

// A number that counts up from the old value to the new one, like a meter (the measured exception in DESIGN.md section 7).
function Count({ m, wait }: { m: Change; wait: number }) {
  const calm = useCalm();
  const mv = useMotionValue(grew(m) && !calm ? m.from : m.to);
  const text = useTransform(mv, v => String(Math.round(v)));
  useEffect(() => {
    if (calm || !grew(m)) { mv.set(m.to); return; }
    mv.set(m.from);
    const a = animate(mv, m.to, barAt(TOP_BAR.count, wait));
    return () => a.stop();
  }, [m, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  // A fixed width (in digits) and its own layout box, so each tick doesn't move or re-measure the rest of the bar (R07).
  return <motion.span style={{ display: 'inline-block', minWidth: `${String(Math.max(m.from, m.to)).length}ch`, contain: 'layout paint' }}>{text}</motion.span>;
}

// `wait`: when the moments start (TOP_BAR.wait, or TOP_BAR.afterPath while the path plays "coming on air").
export function TopBar({ streak, xp, xpToday, freezes, done, goal, wait = TOP_BAR.wait }:
  { streak: number; xp: number; xpToday: number; freezes: number; done: number; goal: number; wait?: number }) {
  const calm = useCalm();
  const s = useChange('streak', streak), x = useChange('xp', xp);
  const f = useChange('freezes', freezes), d = useChange('done', done), t = useChange('xpToday', xpToday);
  // I30: what the numbers show until their move starts (the streak and freezes with their pop, today's XP with the
  // count, the goal's "1 of 1" with its bar, its colour with the flash).
  const showStreak = useHeld(s, wait + TOP_BAR.pop.delay), showFreezes = useHeld(f, wait + TOP_BAR.pop.delay);
  const showToday = useHeld(t, wait + TOP_BAR.todayAt), showDone = useHeld(d, wait + TOP_BAR.fill.delay);
  const showReached = useHeld(d, wait + TOP_BAR.flash.delay) >= goal;
  const reached = done >= goal, justReached = grew(d) && reached && d.from < goal;

  const flame = useRef<HTMLSpanElement>(null), glow = useRef<HTMLSpanElement>(null), num = useRef<HTMLSpanElement>(null);
  const float = useRef<HTMLSpanElement>(null), today = useRef<HTMLSpanElement>(null), pill = useRef<HTMLSpanElement>(null), flash = useRef<HTMLSpanElement>(null), check = useRef<HTMLSpanElement>(null);
  useMoment(flame, s, grew(s), TOP_BAR.flickerKeys, barAt(TOP_BAR.flicker, wait));
  useMoment(glow, s, grew(s), TOP_BAR.glowKeys, barAt(TOP_BAR.flicker, wait));
  useMoment(num, s, grew(s), TOP_BAR.popKeys, barAt(TOP_BAR.pop, wait));
  useMoment(float, x, grew(x), TOP_BAR.floatKeys, barAt(TOP_BAR.float, wait));
  useMoment(pill, f, grew(f), TOP_BAR.popKeys, barAt(TOP_BAR.pop, wait));
  useMoment(flash, d, justReached, TOP_BAR.flashKeys, barAt(TOP_BAR.flash, wait));
  useMoment(check, d, justReached, TOP_BAR.checkKeys, barAt(TOP_BAR.check, wait));
  // I85: today's new figure starts unseen (so its first frame isn't a flash) and fades in the moment its wait is over.
  const todayFresh = grew(t) && !calm && showToday === t.to;
  useEffect(() => {
    if (!todayFresh || !today.current) return;
    const a = animate(today.current, TOP_BAR.todayKeys, TOP_BAR.today);
    return () => a.stop();
  }, [todayFresh, t.n]); // eslint-disable-line react-hooks/exhaustive-deps -- once per change
  // R19: the streak sound, with the flame's flicker (at the same moment with Reduce motion, though nothing moves).
  useEffect(() => (grew(s) ? play('streak', barAt(TOP_BAR.flicker, wait).delay) : undefined), [s]); // eslint-disable-line react-hooks/exhaustive-deps -- once per change
  const waiting = !calm; // things that only appear during a moment start invisible (their moment shows them)

  return <>
    {/* R22: on a narrow window (down to 360 px) the gaps and the goal bar shrink, and today's "+30" steps aside
        (theme.css), so the bar never runs past the window's edge. */}
    <div data-testid="hud" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2.6vw, 16px)', whiteSpace: 'nowrap' }}>
      {/* Streak: the flame has a soft still glow while your streak is alive ("glow means on air"). */}
      <span data-testid="streak" title="Streak (days in a row)" data-moment={grew(s) ? s.n + 1 : undefined}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 18, fontWeight: 700, ...mono, color: c.streak }}>
        <span ref={flame} data-testid="streak-flame" style={{ position: 'relative', display: 'grid', placeItems: 'center', width: 22, height: 22 }}>
          <span ref={glow} data-testid="streak-glow" aria-hidden style={{ position: 'absolute', inset: -9, borderRadius: '50%',
            background: `radial-gradient(circle, ${c.streak} 0%, transparent 65%)`, opacity: showStreak > 0 ? 0.25 : 0 }} />
          <Icon name="flame" size={22} style={{ position: 'relative' }} />
        </span>
        <span ref={num} style={{ display: 'inline-block' }}>{showStreak}</span>
      </span>
      {/* XP: the total counts up; today's XP sits beside it, smaller. */}
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
        <span data-testid="xp-total" title="XP in total" data-to={xp}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 18, fontWeight: 700, ...mono, color: c.signal, alignSelf: 'center' }}>
          <Icon name="bolt" size={20} /><Count m={x} wait={wait} /><span style={hidden}> XP</span>
        </span>
        {/* Only once you've earned some today: a "+0" at the start of a day was just noise (design review 1, R08). */}
        {/* I85: keyed by the number shown, so the new figure is a fresh element that fades in. */}
        {showToday > 0 && <span key={showToday} ref={today} data-testid="xp-today" className="hud-wide-only" title="XP earned today"
          style={{ ...mono, fontSize: 13, color: c.textMuted, opacity: todayFresh ? 0 : undefined }}>+{showToday}<span style={hidden}> XP today</span></span>}
        {grew(x) && !calm && <span key={x.n} ref={float} data-testid="xp-float" aria-hidden
          style={{ position: 'absolute', left: 26, top: -6, fontSize: 13, fontWeight: 700, ...mono, color: c.signal, opacity: 0, pointerEvents: 'none' }}>+{x.to - x.from}</span>}
      </span>
      {/* Streak freezes: a small pill, only when you have one. A first freeze's pill keeps its place but stays unseen
          until its pop (I30), so the pop has something to move and nothing beside it jumps. */}
      {freezes > 0 && <span ref={pill} data-testid="freezes" title="Streak freezes: a missed day that won't break your streak"
        style={{ visibility: showFreezes > 0 ? undefined : 'hidden', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px 2px 6px', borderRadius: RADIUS.pill, fontSize: 15, fontWeight: 700, ...mono,
          color: c.review, background: c.surface2, border: `1px solid ${c.borderStrong}` }}>
        <Icon name="freeze" size={16} label="Streak freezes:" />{showFreezes}
      </span>}
    </div>
    {/* The daily goal: look A's bar (signal fading to on-air); solid on-air with a check once you reach it. */}
    <div data-testid="goal" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ position: 'relative', display: 'block', width: 'clamp(40px, 12.5vw, 76px)' }}>
        <ProgressBar testId="goal-bar" label="Daily goal" value={done / goal} height={10} tone={showReached ? 'onAir' : 'glow'}
          from={grew(d) ? d.from / goal : undefined} transition={grew(d) ? barAt(TOP_BAR.fill, wait) : undefined} />
        {justReached && !calm && <span key={d.n} ref={flash} data-testid="goal-flash" aria-hidden
          style={{ position: 'absolute', inset: -2, borderRadius: 7, background: c.onAir, opacity: 0 }} />}
      </span>
      <span data-testid="goal-text" style={{ ...mono, fontSize: 13, color: showReached ? c.onAir : c.textMuted, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
        <span style={hidden}>Daily goal: </span>{Math.min(showDone, goal)} of {goal}
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
