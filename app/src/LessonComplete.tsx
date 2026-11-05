import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { c, mono } from './theme';
import { Icon } from './Icon';
import { Beacon, BEACON_SIZE, BEACON_HEIGHT } from './ui/Beacon';
import { SpeechBubble } from './ui/SpeechBubble';
import { beaconLine, completeMoment } from './questionScreen';
import { Button, Card, Pill } from './ui';
import { SignalBurst } from './ui/SignalBurst';
import { COMPLETE, nth, useCalm } from './theme/motion';
import { play } from './sound';

// The lesson-complete screen (redesign R12, DESIGN.md section 7, moment 3). Beacon grows to its big size and cheers while a
// "signal burst" (rings and wave pieces) goes off behind its head; the stars you earned drop into their places one by one;
// XP counts up like a meter; your signal bars fill one by one. One main button, "Back to the path"; "Again" is a quiet one
// under it (design review 1, idea I32). If you fixed missed questions on their comeback, a small "1 fixed" says so (I43).
// Everything plays once, within 1.6 s, and never blocks a tap. With Reduce motion the screen simply shows the result.
// R18: Beacon says one line, in a bubble beside its head, once it has grown: it goes with your stars, or says you fixed
// the tricky ones (src/questionScreen.ts). It pops in after the burst's wave pieces are gone (COMPLETE.says), never over words.
// Speeds: COMPLETE in src/theme/motion.tsx.
const BIG = BEACON_SIZE.complete;
const HEAD = { x: BIG * 0.5, y: BIG * 0.4 };   // Beacon's head, in its 100-wide drawing at (50, 40)
const BARS = 5;
const SAYS_GAP = 40;  // from the head's centre to the bubble's pointy corner: just past the outer ring (34 px at this size)
// R22: the bubble starts SAYS_GAP right of the window's middle, so on a phone-narrow window it gets narrower (and taller)
// instead of running past the edge: at most half the window, less that gap and the 20 px side margin.
const SAYS_MAX = `min(168px, calc(50vw - ${SAYS_GAP + 20}px))`;
// Idea I61: on a window of 400 px or less, that spot beside the head is only about 100 px wide, so a line breaks into 3 or 4
// short rows. There the bubble sits under the "Lesson complete!" title instead, in the middle, with its pointy corner up
// at Beacon: as wide as the column allows (one line, usually). Same width rule as the top bar's "+30" (theme.css).
const NARROW = '(max-width: 400px)';
const watchNarrow = (on: () => void) => { const m = matchMedia(NARROW); m.addEventListener('change', on); return () => m.removeEventListener('change', on); };
const useNarrow = () => useSyncExternalStore(watchNarrow, () => matchMedia(NARROW).matches);

export function LessonComplete({ stars, right, total, fixed, xp, bars, seed = '', onFinish, onAgain }:
  { stars: number; right: number; total: number; fixed: number; xp: number; bars: number; seed?: string; onFinish: () => void; onAgain: () => void }) {
  const calm = useCalm();
  const narrow = useNarrow();
  // The bubble pops in at COMPLETE.says when the screen appears. If the window crosses 400 px later, it moves (a new spot is a
  // new bubble) and pops in at once, without waiting again.
  // (React's "remember the last value" pattern: once the window has crossed 400 px, every later bubble pops in at once.)
  const [was, setWas] = useState(narrow), [moved, setMoved] = useState(false);
  if (narrow !== was) { setWas(narrow); setMoved(true); }
  const saysDelay = calm || moved ? 0 : COMPLETE.says;
  const says = beaconLine(completeMoment(stars, fixed), seed);
  // The bubble under the title adds about 55 px, so on a narrow window the gaps around it shrink by about 32 px: the whole
  // screen still fits a 360 x 640 window without scrolling (I61). Wider windows keep the gaps they had.
  const gap = narrow ? { top: 0, title: 8, first: 6, cards: '12px 0 14px' } : { top: 8, title: 10, first: 10, cards: '18px 0 20px' };
  const root = useRef<HTMLDivElement>(null);
  const count = useMotionValue(calm ? xp : 0);
  const shownXp = useTransform(count, v => `+${Math.round(v)} XP`);
  // Everything starts before the first paint (so nothing is seen at its end position first), all at once, each piece
  // with its own delay from COMPLETE. Stopped if you leave early, so nothing keeps running behind the path.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || calm) { count.set(xp); return; }
    const all = (sel: string) => [...el.querySelectorAll<HTMLElement>(sel)];
    const runs = [
      ...all('[data-grow]').map(b => animate(b, COMPLETE.growKeys, COMPLETE.grow)),
      ...all('[data-star-fill]').map((s, k) => animate(s, { ...COMPLETE.starKeys, opacity: [0, 1] },
        { ...nth(COMPLETE.star, k, COMPLETE.starGap), opacity: nth({ ...COMPLETE.starFade, delay: COMPLETE.star.delay }, k, COMPLETE.starGap) })),
      ...all('[data-bar-fill]').map((b, k) => animate(b, COMPLETE.barKeys, nth(COMPLETE.bar, k, COMPLETE.barGap))),
      animate(count, xp, COMPLETE.count),
    ];
    return () => runs.forEach(a => a.stop());
  }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps -- once, when the screen appears
  // R19: the lesson-complete sound, as Beacon grows in and the burst goes out (also with Reduce motion: sound isn't
  // movement). Not if you leave before it starts.
  useEffect(() => play('complete', COMPLETE.sound), []);
  // Before it moves, a piece that will animate starts at its "from" look (set here, so the first paint is right).
  const from = (k: keyof typeof COMPLETE & ('growKeys' | 'starKeys' | 'barKeys')) => (calm ? {} : { transform: COMPLETE[k].transform[0] });
  return (
    <div ref={root} data-testid="complete" style={{ textAlign: 'center', position: 'relative' }}>
      <div style={{ position: 'relative', width: BIG, margin: `${gap.top}px auto 0` }}>
        <SignalBurst x={HEAD.x} y={HEAD.y} />
        <div data-grow style={{ position: 'relative', zIndex: 1, transformOrigin: '50% 60%', ...from('growKeys') }}>
          <Beacon face="cheering" size={BIG} />
        </div>
        {!narrow && <SpeechBubble data-testid="beacon-says" delay={saysDelay}
          style={{ position: 'absolute', left: HEAD.x + SAYS_GAP, bottom: BEACON_HEIGHT(BIG) - HEAD.y - 16, zIndex: 2, width: 'max-content', maxWidth: SAYS_MAX, boxSizing: 'border-box', fontSize: 14, textWrap: 'balance' }}>
          {says}</SpeechBubble>}
      </div>
      <h2 data-testid="done" style={{ fontSize: 28, lineHeight: 1.25, fontWeight: 700, margin: `4px 0 ${gap.title}px`, position: 'relative', zIndex: 1 }}>Lesson complete!</h2>
      {narrow && <SpeechBubble data-testid="beacon-says" point="up" delay={saysDelay}
        style={{ margin: '2px 0 10px', zIndex: 1, maxWidth: '100%', boxSizing: 'border-box', fontSize: 14, textWrap: 'balance' }}>
        {says}</SpeechBubble>}
      {/* The stars: three places, dim; the ones you earned drop in, filled, one by one. */}
      <div data-testid="stars" data-count={stars} role="img" aria-label={`${stars} of 3 stars`}
        style={{ display: 'flex', justifyContent: 'center', gap: 10, color: c.streak, minHeight: 44, position: 'relative', zIndex: 1 }}>
        {[0, 1, 2].map(k => (
          <span key={k} style={{ position: 'relative', width: 44, height: 44 }}>
            <Icon name="star" size={44} style={{ opacity: 0.35, position: 'absolute', inset: 0 }} />
            {k < stars && <span data-star-fill={k} style={{ position: 'absolute', inset: 0, ...(calm ? {} : { opacity: 0, ...from('starKeys') }) }}>
              <Icon name="star" size={44} solid /></span>}
          </span>
        ))}
      </div>
      <p data-testid="first-time" style={{ margin: `${gap.first}px 0 0`, color: c.textMuted, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span>{right} of {total} right the first time</span>
        {fixed > 0 && <span title={`${fixed} missed ${fixed === 1 ? 'question' : 'questions'} right on the comeback`}>
          <Pill data-testid="fixed" icon="check" style={{ fontSize: 13, fontWeight: 500, padding: '0 8px' }}>{fixed} fixed</Pill></span>}
      </p>
      {/* The two numbers side by side: XP counting up like a meter, and the signal bars filling from the bottom. */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: gap.cards, textAlign: 'left' }}>
        <Card title="XP earned" style={{ padding: '12px 16px 14px' }}>
          <motion.div data-testid="xp" aria-label={`+${xp} XP`} style={{ ...mono, fontSize: 'clamp(28px, 8vw, 40px)', lineHeight: 1.1, whiteSpace: 'nowrap', color: c.signal, fontVariantNumeric: 'tabular-nums' }}>{shownXp}</motion.div>
        </Card>
        <Card title="Signal" style={{ padding: '12px 16px 14px' }}>
          <div data-testid="bars" data-count={bars} role="img" aria-label={`${bars} of ${BARS} signal bars`}
            style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 44, color: c.onAir }}>
            {Array.from({ length: BARS }, (_, i) => (
              <span key={i} data-on={i < bars} style={{ position: 'relative', flex: 1, maxWidth: 16, height: `${28 + (72 * (i + 1)) / BARS}%`,
                borderRadius: 3, border: `1.5px solid ${c.onAir}`, opacity: i < bars ? 1 : 0.45, boxSizing: 'border-box', overflow: 'hidden' }}>
                {i < bars && <span data-bar-fill={i} style={{ position: 'absolute', inset: -1, background: c.onAir, transformOrigin: '50% 100%', ...from('barKeys') }} />}
              </span>
            ))}
          </div>
        </Card>
      </div>
      <Button full big kind="onAir" data-testid="finish" data-primary aria-keyshortcuts="Enter" onClick={onFinish}>Back to the path</Button>
      <Button full kind="quiet" icon="restart" data-testid="again" onClick={onAgain} style={{ marginTop: 10 }}>Again</Button>
    </div>
  );
}
