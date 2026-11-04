// The ONE speed file (redesign R04, DESIGN.md section 7): every spring, every timing, and the "Reduce motion" rules.
// Screens and building blocks never type a speed themselves: they take one from here (a unit test, src/motion.test.ts,
// checks that), so changing how the app moves means changing this file only.
import type { ReactNode } from 'react';
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
export const EASE = { out: [0.22, 1, 0.36, 1], in: [0.4, 0, 1, 1] } as const;

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
