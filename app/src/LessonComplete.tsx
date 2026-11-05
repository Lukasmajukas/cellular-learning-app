import { useLayoutEffect, useRef } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { c, mono } from './theme';
import { Icon } from './Icon';
import { Beacon, BEACON_SIZE, BEACON_HEIGHT } from './ui/Beacon';
import { SpeechBubble } from './ui/SpeechBubble';
import { beaconLine, completeMoment } from './questionScreen';
import { Button, Card, Pill } from './ui';
import { SignalBurst } from './ui/SignalBurst';
import { COMPLETE, nth, useCalm } from './theme/motion';

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

export function LessonComplete({ stars, right, total, fixed, xp, bars, seed = '', onFinish, onAgain }:
  { stars: number; right: number; total: number; fixed: number; xp: number; bars: number; seed?: string; onFinish: () => void; onAgain: () => void }) {
  const calm = useCalm();
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
  // Before it moves, a piece that will animate starts at its "from" look (set here, so the first paint is right).
  const from = (k: keyof typeof COMPLETE & ('growKeys' | 'starKeys' | 'barKeys')) => (calm ? {} : { transform: COMPLETE[k].transform[0] });
  return (
    <div ref={root} data-testid="complete" style={{ textAlign: 'center', position: 'relative' }}>
      <div style={{ position: 'relative', width: BIG, margin: '8px auto 0' }}>
        <SignalBurst x={HEAD.x} y={HEAD.y} />
        <div data-grow style={{ position: 'relative', zIndex: 1, transformOrigin: '50% 60%', ...from('growKeys') }}>
          <Beacon face="cheering" size={BIG} />
        </div>
        <SpeechBubble data-testid="beacon-says" delay={calm ? 0 : COMPLETE.says}
          style={{ position: 'absolute', left: HEAD.x + SAYS_GAP, bottom: BEACON_HEIGHT(BIG) - HEAD.y - 16, zIndex: 2, width: 'max-content', maxWidth: 168, boxSizing: 'border-box', fontSize: 14, textWrap: 'balance' }}>
          {beaconLine(completeMoment(stars, fixed), seed)}</SpeechBubble>
      </div>
      <h2 data-testid="done" style={{ fontSize: 28, lineHeight: 1.25, fontWeight: 700, margin: '4px 0 10px', position: 'relative', zIndex: 1 }}>Lesson complete!</h2>
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
      <p data-testid="first-time" style={{ margin: '10px 0 0', color: c.textMuted, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span>{right} of {total} right the first time</span>
        {fixed > 0 && <span title={`${fixed} missed ${fixed === 1 ? 'question' : 'questions'} right on the comeback`}>
          <Pill data-testid="fixed" icon="check" style={{ fontSize: 13, fontWeight: 500, padding: '0 8px' }}>{fixed} fixed</Pill></span>}
      </p>
      {/* The two numbers side by side: XP counting up like a meter, and the signal bars filling from the bottom. */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '18px 0 20px', textAlign: 'left' }}>
        <Card title="XP earned" style={{ padding: '12px 16px 14px' }}>
          <motion.div data-testid="xp" aria-label={`+${xp} XP`} style={{ ...mono, fontSize: 40, lineHeight: 1.1, color: c.signal, fontVariantNumeric: 'tabular-nums' }}>{shownXp}</motion.div>
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
      <Button full kind="quiet" icon="repeat" data-testid="again" onClick={onAgain} style={{ marginTop: 10 }}>Again</Button>
    </div>
  );
}
