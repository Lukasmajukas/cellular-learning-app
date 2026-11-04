// The ONE speed file (redesign R04, DESIGN.md section 7): every spring, every timing, and the "Reduce motion" rules.
// Screens and building blocks never type a speed themselves: they take one from here (a unit test, src/motion.test.ts,
// checks that), so changing how the app moves means changing this file only.
import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { MotionConfig, useReducedMotionConfig, type Transition } from 'motion/react';
import { prefs } from '../prefs';

// Springs. A spring moves like a real thing on a rubber band: "stiffness" = how strong the band, "damping" = how quickly it stops wobbling.
export const SPRING = {
  snappy: { type: 'spring', stiffness: 500, damping: 30 },   // tap and hover: a press squishes and springs back
  bouncy: { type: 'spring', stiffness: 300, damping: 14 },   // pop-ins (lesson circles, the speech bubble, the lesson-complete card)
  sheet: { type: 'spring', stiffness: 380, damping: 36 },    // the bottom sheet sliding up (about 0.35 s, no wobble)
  fill: { type: 'spring', stiffness: 170, damping: 26 },     // a progress bar filling
  tab: { type: 'spring', stiffness: 420, damping: 36 },      // the bottom tabs' marker gliding to the tab you picked
} as const satisfies Record<string, Transition>;

// Timings in seconds (DESIGN.md section 7, "Speeds").
export const TIME = {
  tap: 0.15,          // tap / hover (120-180 ms)
  feedback: 0.25,     // small feedback: a tile glows, a wrong tile shakes (200-300 ms)
  screenIn: 0.3,      // a screen gliding in ...
  screenOut: 0.12,    // ... after the old one glides out: 0.42 s together (screen change: 320-420 ms)
  stagger: 0.06,      // pop-ins: time between items (40-80 ms) ...
  popInMax: 0.4,      // ... and never more than this for all of them together
  celebration: 1.6,   // the longest a celebration may take (it never blocks a tap)
  ambient: 2.4,       // one round of a background loop (2-4 s)
  calmFade: 0.15,     // with Reduce motion: things appear with a quick fade of at most 150 ms
  burstWait: 0.2,     // the lesson-complete burst waits this long, so the last question has left first
} as const;

// Ease curves: "out" starts fast and lands softly (for things arriving), "in" starts softly and leaves fast.
export const EASE = { out: [0.22, 1, 0.36, 1], in: [0.4, 0, 1, 1], inOut: [0.45, 0, 0.55, 1] } as const;

// How much things grow on hover and shrink when pressed. Big tiles move less than small buttons.
export const PRESS = { hover: 1.03, tap: 0.95 };
export const PRESS_BIG = { hover: 1.015, tap: 0.97 };
export const PRESS_ROUND = { hover: 1.08, tap: 0.9 };  // round icon buttons, tabs and lesson circles
export const PRESS_PILL = { hover: 1.06, tap: 0.92 };

// A reduce-motion fade (DESIGN.md: "a quick fade, 150 ms at most"), and "no movement at all, it just happens".
export const QUICK_FADE = { duration: TIME.calmFade } as const;
export const INSTANT = { duration: 0 } as const;

// Item number i of `count` popping in: 60 ms apart, but squeezed so the last one starts within 400 ms.
export const popInDelay = (i: number, count = 1) => i * Math.min(TIME.stagger, TIME.popInMax / Math.max(1, count));

// A background loop (like the old mascot's antenna): one round every TIME.ambient seconds, forever.
export const LOOP = { repeat: Infinity, duration: TIME.ambient } as const;

// Pop-ins as you scroll (redesign R06): things that come into view at about the same moment (within 0.1 s) pop in one
// after another, 60 ms apart and all started within 400 ms; something that scrolls in on its own pops in at once.
let batch = { at: -Infinity, n: 0 };
export function popInQueue(now = performance.now()) {
  if (now - batch.at > 100) batch = { at: now, n: 0 };
  return Math.min(batch.n++ * TIME.stagger, TIME.popInMax);
}

// The current lesson's rings "breathe" (DESIGN.md section 7, background loop): a little bigger and fainter, then back,
// once every TIME.ambient seconds. The rings and their glow move as ONE layer, so the path has only one loop running.
export const BREATHE = {
  on: { scale: [1, 1.07, 1], opacity: [1, 0.5, 1] },
  off: { scale: 1, opacity: 1 },
  transition: { ...LOOP, ease: 'easeInOut' as const },
};

// "Coming on air" (DESIGN.md section 7, moment 1), after you finish a lesson for the first time and the path comes back.
// All in 1.6 s at most (TIME.celebration), and it never stops you tapping. In order:
// 1. the finished circle turns from blue to green (the blue disc fades and shrinks away), and its check badge pops on;
// 2. two green rings spread out from it and fade (the "ring burst");
// 3. the dotted line to the next lesson draws itself;
// 4. the next lesson's lock flies off, and its circle pops up as the new current lesson.
// If that finished the whole unit, every circle of the unit sends out a ring, from the one you just did up to the first
// (a wave), the unit's banner flashes and its "done" check pops on, and the next unit's banner bar draws itself down.
export const ON_AIR = {
  turn: { duration: 0.35, delay: 0.35, ease: EASE.out },          // 1 (0.35 s: the path has glided in by then)
  check: { ...SPRING.bouncy, delay: 0.55 },                         // 1, the check badge
  burst: { duration: 0.8, delay: 0.45, ease: EASE.out },           // 2, first ring ...
  burstGap: 0.15,                                                  // ... and the second one this much later
  line: { duration: 0.5, delay: 0.55, ease: EASE.inOut },           // 3
  lockOff: { duration: 0.35, delay: 0.85, ease: EASE.in },         // 4, the lock ...
  arrive: { ...SPRING.bouncy, delay: 0.9 },                        // 4, ... and the new current circle
  wave: { duration: 0.7, delay: 0.5, ease: EASE.out },             // the unit's wave: first ring ...
  waveSpread: 0.4,                                                 // ... and the last one starts at most this much later
  banner: { duration: 0.6, delay: 0.8, ease: EASE.out },           // the finished unit's banner flash and sweep
  bannerCheck: { ...SPRING.bouncy, delay: 0.85 },                   // its "done" check
  barDraw: { duration: 0.45, delay: 0.9, ease: EASE.out },         // the next unit's banner bar
} as const;
// The k-th circle up the unit (0 = the one just above the lesson you finished) in a wave of `count` circles.
export const waveDelay = (k: number, count: number) =>
  ON_AIR.wave.delay + k * Math.min(TIME.stagger, ON_AIR.waveSpread / Math.max(1, count));

// True from the second render on. Things that move the moment they appear need it: the app's screens sit inside an
// AnimatePresence with initial={false} (so nothing animates in when the app starts), and Motion then skips EVERY first
// animation inside them, jumping straight to the end (found in R06). So such a piece starts at its "from" look and
// switches to its "to" look one render later, which Motion does animate: animate={on ? to : from}.
export function useEntrance() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  return on;
}

// False while the app's window is hidden (minimised or covered), so background loops can pause (DESIGN.md section 7).
const onVisibility = (cb: () => void) => { document.addEventListener('visibilitychange', cb); return () => document.removeEventListener('visibilitychange', cb); };
export const useAwake = () => useSyncExternalStore(onVisibility, () => document.visibilityState !== 'hidden', () => true);

// Screens gliding into each other (DESIGN.md: "screens glide; nothing jumps").
// Tabs: the new screen slides in from the side of the tab you picked (dir 1 = from the right, -1 = from the left);
// the old one slides a little the other way and fades. A lesson rises from below and sinks back down when you leave it.
// The whole frame (top bar and tabs) only fades, because sliding it would carry the fixed tab bar along.
// With Reduce motion: only a quick fade, nothing slides.
const GLIDE = 28, RISE = 56;
export function screenGlide(kind: 'tab' | 'lesson' | 'frame', calm: boolean) {
  const fadeIn = { duration: TIME.screenIn, ease: EASE.out }, fadeOut = { duration: TIME.screenOut, ease: EASE.in };
  const variants = calm
    ? { enter: { opacity: 0 }, center: { opacity: 1, transition: QUICK_FADE }, leave: { opacity: 0, transition: INSTANT } }
    : kind === 'frame'
      ? { enter: { opacity: 0 }, center: { opacity: 1, transition: fadeIn }, leave: { opacity: 0, transition: fadeOut } }
    : kind === 'lesson'
      ? { enter: { y: RISE, opacity: 0 }, center: { y: 0, opacity: 1, transition: fadeIn }, leave: { y: RISE, opacity: 0, transition: fadeOut } }
      : { enter: (dir: number) => ({ x: dir * GLIDE, opacity: 0 }), center: { x: 0, opacity: 1, transition: fadeIn },
          leave: (dir: number) => ({ x: -dir * GLIDE, opacity: 0, transition: fadeOut }) };
  return { variants, initial: 'enter', animate: 'center', exit: 'leave' } as const;
}

// True when the app's own "Reduce motion" switch is on. Read it in every piece that moves: Motion only reads the setting
// when a piece first appears, so without this a switch flipped on the Settings screen would keep sliding (found in R03).
export const useCalm = () => !!useReducedMotionConfig();

// Reduce motion, in one place: wrap the app (or a test page) in this. It tells Motion, and it tells the code outside
// React (the confetti) through prefs. Only the app's own switch counts, never Windows' setting (T46).
export function MotionKit({ calm, children }: { calm: boolean; children: ReactNode }) {
  prefs.reduceMotion = calm;
  return <MotionConfig reducedMotion={calm ? 'always' : 'never'}>{children}</MotionConfig>;
}
