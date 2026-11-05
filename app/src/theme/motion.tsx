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
  // The lesson's progress bar stepping forward (R11): it springs a touch past its new place (about 7% of one step,
  // 2-3 px) and settles, so each answer feels like a step forward. The only spring here allowed a little overshoot.
  step: { type: 'spring', stiffness: 260, damping: 21 },
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
  // Beacon (R18) stands beside the current lesson, so it pops up with the new current circle (inside it), then gives
  // one happy ring pulse as the circle lands, and goes back to waiting. Its pulse (0.6 s) ends before the top bar's
  // moment starts (TOP_BAR.afterPath, 1.6 s): one celebration at a time.
  beaconHappy: 0.95,                                               // seconds after the path appears: Beacon is happy ...
  beaconRest: 2.6,                                                 // ... and back to its waiting face
} as const;
// The k-th circle up the unit (0 = the one just above the lesson you finished) in a wave of `count` circles.
export const waveDelay = (k: number, count: number) =>
  ON_AIR.wave.delay + k * Math.min(TIME.stagger, ON_AIR.waveSpread / Math.max(1, count));

// The top bar (redesign R07, DESIGN.md section 7, moment 5). It plays only when a number really went up while the app
// was open (a lesson or review finished, a streak repaired), never at start-up. Its own moment takes 1.6 s at most.
// When it starts (`barAt`): `wait` (0.3 s) lets the frame fade in first; after a lesson's FIRST finish it waits
// `afterPath` (1.6 s) instead, so the path's "coming on air" plays first and the top bar then adds it up: one
// celebration at a time (idea I29). Found in R07: both at once dropped the Windows build under 50 fps, and two
// celebrations at once are also harder to follow.
// Design review 1 (R08): 1.4 s still overlapped the end of the new current circle's bounce (`ON_AIR.arrive`, a spring
// counted as 0.7 s), and "coming on air" fell to 47.9-49.8 fps on GitHub's Windows machines. At 1.6 s, with the CPU slowed 6x in
// the cloud, it measured 52.0-55.1 fps (45.3-56.1 at 1.4 s).
// - XP counts up like a meter, and a small "+30" rises off it and fades;
// - the flame flickers once (a little bigger, a wiggle) while its glow brightens and dims, and the new number pops;
// - the goal bar springs from the old amount to the new one; reaching the goal flashes the bar and pops its check on;
// - a newly earned streak freeze pops in.
// Each moving piece animates a whole `transform` (and opacity), never separate x / scale / rotate values: the browser
// then runs it on its own graphics side, not in the app's JavaScript each frame. Found in R07: with the separate values,
// the top bar playing together with the path's "coming on air" dropped the Windows build under 50 fps.
const FLAME = { scale: [1, 1.32, 0.94, 1.12, 1], rotate: [0, -9, 7, -3, 0] };   // the flicker: size and turn (degrees)
const POP = [1, 1.28, 1];
export const TOP_BAR = {
  wait: 0.3, afterPath: 1.6,
  flame: FLAME, popScale: POP,                                                       // the numbers behind the keyframes below
  count: { duration: 0.8, delay: 0, ease: EASE.out },                          // XP counting up
  float: { duration: 0.9, delay: 0, ease: EASE.out },                          // the "+30" rising and fading ...
  floatKeys: { transform: ['translateY(8px)', 'translateY(-6px)'], opacity: [0, 1, 0] }, // ... off the number, inside the bar
  flicker: { duration: 0.6, delay: 0.05, ease: 'easeInOut' as const },    // the flame
  flickerKeys: { transform: FLAME.scale.map((sc, i) => `scale(${sc}) rotate(${FLAME.rotate[i]}deg)`) },
  glowKeys: { opacity: [0.25, 0.9, 0.25] },                                         // the flame's glow layer (still: 0.25)
  pop: { duration: 0.4, delay: 0.15, ease: 'easeOut' as const },          // a number that changed (streak, freezes)
  popKeys: { transform: POP.map(sc => `scale(${sc})`) },
  fill: { ...SPRING.fill, delay: 0 },                                         // the goal bar
  flash: { duration: 0.6, delay: 0.5, ease: EASE.out },                   // goal reached: the bar flashes ...
  flashKeys: { opacity: [0, 0.85, 0] },
  check: { ...SPRING.bouncy, delay: 0.55 },                              // ... and its check pops on
  checkKeys: { transform: ['scale(0)', 'scale(1)'] },
}; // not "as const": Motion wants plain (changeable) keyframe lists
// Beacon, the mascot (redesign R17, DESIGN.md section 8). Its two background loops are the rings breathing (BREATHE, the
// same breath as the current lesson's rings) and the blink, so a screen with Beacon on it has no room for another loop
// (at most 2, DESIGN.md section 7). Its one-off moves start the moment its face changes (it reacts within 0.1 s):
// - blink (idle, thinking, oops): the eyes squeeze shut and open again, every 4-7 s (a new random gap each time);
// - happy: one ring pulses out of the head and fades;
// - cheering: the head hops three times, each hop smaller (on a little mast, so it stays joined to the tower), while two
//   rings burst out of it, one after the other. All within a celebration (1.6 s); nothing loops.
// Only transforms and see-through-ness move. With Reduce motion nothing moves: the face just changes.
export const BEACON = {
  blinkGap: [4, 7] as [number, number],                                    // seconds between blinks (random in between)
  blinkShut: { duration: 0.08, ease: EASE.in },                            // the eyes close ...
  blinkOpen: { duration: 0.1, ease: EASE.out },                            // ... and open again
  blinkScale: 0.1,                                                         // how shut: 10% of their height
  pulse: { duration: 0.6, delay: 0, ease: EASE.out },                      // happy: one ring out of the head
  pulseKeys: { scale: [1, 1.45], opacity: [0.9, 0] },
  hop: { duration: 1.2, delay: 0, ease: 'easeInOut' as const },            // cheering: three hops ...
  hopKeys: { y: [0, -6, 0, -3.5, 0, -1.5, 0] },                           // ... in viewBox units (the drawing is 100 wide)
  burst: { duration: 0.9, delay: 0.05, ease: EASE.out },                   // ... and two rings bursting out
  burstGap: 0.3,                                                           // the second ring this much later
  burstKeys: { scale: [0.7, 2.3], opacity: [0.85, 0] },
  dim: 0.45,                                                               // the rings' see-through-ness when oops or sleepy
}; // not "as const": Motion wants plain (changeable) keyframe lists
// Lesson movement (redesign R11, DESIGN.md section 7, moment 2 "Right / not quite"). Small feedback, 200-300 ms each:
// - the right tile (or chip, number box, tap dot) pops a little bigger and back, while its glow layer flashes on and
//   settles (see-through-ness only: the glow itself is a still shadow, never animated);
// - a wrong one shakes gently: 3 times side to side, smaller each time (6, 4, 2 px);
// - in "match the pairs", a right-column tile's number box pops when it takes its partner's number;
// - in "put them in order", a chip glides from the pool into its slot (and back when you take it out), and the others
//   glide to close the gap (FLY, a whole transform, so the browser runs it on its graphics side).
// Questions glide in from the right and out to the left (questionGlide). The progress bar springs forward (SPRING.step)
// with a soft spark at its tip. With Reduce motion none of these move: the colours and icons just change, and a new
// question fades in (150 ms at most).
export const FEEDBACK = {
  shake: { duration: 0.3, ease: 'easeInOut' as const },                    // a wrong pick ...
  shakeKeys: { x: [0, -6, 6, -4, 4, -2, 2, 0] },                           // ... 3 times, in px
  pop: { duration: 0.28, ease: EASE.out },                                 // the right one ...
  popKeys: { scale: [1, 1.035, 1] },                                       // ... 3.5% bigger and back
  dotKeys: { scale: [0, 1.25, 1] },                                        // the tap dot lands (from nothing)
  glow: { duration: 0.3, ease: EASE.out },                                 // the right one's glow flashes on ...
  glowKeys: { opacity: [0, 1, 0.75] },                                     // ... and settles a little softer
  keyPop: { duration: 0.25, ease: EASE.out },                              // a match tile's number box ...
  keyPopKeys: { scale: [0.5, 1.2, 1] },                                    // ... grows in with a tiny overshoot
  fly: { duration: 0.28, ease: EASE.out },                                 // an order chip gliding into its slot (and back)
  spark: { duration: 0.5, ease: EASE.out },                                // the progress bar's tip ...
  sparkKeys: { opacity: [0, 1, 0] },                                       // ... lights up and fades as it steps forward
}; // not "as const": Motion wants plain (changeable) keyframe lists

// Lesson complete (redesign R12, DESIGN.md section 7, moment 3). It starts the moment the end screen appears (the last
// question has glided out first) and is all over within a celebration (1.6 s). It never stops you tapping: "Back to the
// path" works from the first moment. In order:
// - Beacon grows from its question size to its big size with a spring (idea I34: it used to jump from 58 to 112 px), and
//   cheers (its own hop and two rings, BEACON above);
// - the "signal burst" (instead of confetti): three rings spread out from Beacon's head and fade, while 12 small wave
//   pieces fly outward and fade. Drawn in the page (not on a canvas), so it shows on every computer (T46/T57);
// - the stars you earned drop into their places one by one (the empty places are there from the start, dim);
// - XP counts up like a meter from 0;
// - the signal bars you earned fill one by one, from the bottom.
// Every piece moves a whole `transform` (and opacity), so the browser runs it on its graphics side (the R07 lesson).
// With Reduce motion nothing moves and no burst plays: the screen simply shows the result.
const GROW_FROM = 58 / 112;                                                // BEACON_SIZE.question / BEACON_SIZE.complete
export const COMPLETE = {
  sound: 0.1,                                                              // R19: the lesson-complete sound, with the burst's first ring
  grow: { ...SPRING.bouncy, delay: 0 },                                    // Beacon growing (I34) ...
  growKeys: { transform: [`scale(${GROW_FROM.toFixed(3)})`, 'scale(1)'] },   // ... from its question size
  ring: { duration: 0.9, delay: 0.1, ease: EASE.out },                     // the burst's rings ...
  ringGap: 0.15,                                                           // ... three of them, this far apart
  rings: 3,
  ringKeys: { transform: ['scale(0.35)', 'scale(2.2)'], opacity: [0.9, 0] },
  piece: { duration: 0.8, delay: 0.15, ease: EASE.out },                   // the wave pieces flying out ...
  pieces: 12,
  pieceFrom: 28, pieceTo: 84,                                              // ... from this far from the head to this far (px):
                                                                           // short of the lesson's top row (R12, seen in the pictures)
  pieceFade: [0, 1, 1, 0],
  star: { ...SPRING.bouncy, delay: 0.3 },                                  // the stars drop in ...
  starGap: 0.2,                                                            // ... one after another
  starKeys: { transform: ['translateY(-28px) scale(0.4)', 'translateY(0px) scale(1)'] },
  starFade: { duration: 0.15, ease: EASE.out },
  count: { duration: 0.8, delay: 0.4, ease: EASE.out },                    // XP counting up from 0 (soon: a still "+0" looked odd)
  bar: { duration: 0.25, delay: 0.6, ease: EASE.out },                     // the signal bars fill ...
  barGap: 0.1,                                                             // ... one by one
  barKeys: { transform: ['scaleY(0)', 'scaleY(1)'] },
  says: 0.9,                                                               // Beacon's speech bubble pops in once the wave pieces are gone (R18)
}; // not "as const": Motion wants plain (changeable) keyframe lists
// The Review tab, "drive test" (redesign R13). A round radar scope with one blip for each question waiting:
// - the blips pop in one after another (the "bouncy" spring, 60 ms apart, all started within 400 ms), only the first time
//   you see them after the app starts, or when new questions have come due since (movement explains: "these are new");
// - while questions are due, a soft sweep turns round the scope: the screen's ONE background loop (DESIGN.md allows 2),
//   a whole `transform: rotate`, 4 s a turn, paused while the window is hidden (idea I03, on the Review tab).
// With Reduce motion nothing moves: the blips are simply there and the sweep stands still.
export const SCOPE = {
  blip: { ...SPRING.bouncy },                                              // a blip popping in (its delay: popInDelay)
  blipKeys: { transform: ['scale(0)', 'scale(1)'], opacity: [0, 1] },
  sweep: { duration: 4, repeat: Infinity, ease: 'linear' as const },       // one turn of the sweep (2-4 s, a background loop)
  sweepKeys: { transform: ['rotate(0deg)', 'rotate(360deg)'] },
}; // not "as const": Motion wants plain (changeable) keyframe lists

// Notices at the top of the frame (R13): the "This changed" card and "your save was restored". A notice slides down a
// little and fades in (small feedback); "Got it" or the close button fades it out and lifts it, THEN the page under it
// glides up into the space instead of jumping (`shift`, a layout move: Motion does it with a transform). One after the
// other, because together the page slid up through the fading card and their words overlapped (seen in R13's pictures).
// A card that takes another one's place waits for it to fade, too.
// With Reduce motion: a quick fade in, gone at once, and the page moves up at once.
const NOTICE_OUT = 0.2;
export const NOTICE = {
  in: { duration: TIME.feedback, delay: NOTICE_OUT, ease: EASE.out },
  out: { duration: NOTICE_OUT, ease: EASE.in },
  from: { opacity: 0, y: -12 },
  to: { opacity: 1, y: 0 },
  gone: { opacity: 0, y: -8, scale: 0.98 },
  shift: { duration: TIME.screenIn, delay: NOTICE_OUT, ease: EASE.out },
};
export function noticeMotion(calm: boolean) {
  return calm
    ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: QUICK_FADE }, exit: { opacity: 0, transition: INSTANT } }
    : { initial: NOTICE.from, animate: { ...NOTICE.to, transition: NOTICE.in }, exit: { ...NOTICE.gone, transition: NOTICE.out } };
}
export const noticeShift = (calm: boolean) => (calm ? INSTANT : NOTICE.shift);

// The Heatmap tab (redesign R14). Band tiles "fill in" one after another, like the lights on a panel coming up:
// each tile's colour fills from the bottom (a `scaleY` grow, like a meter) and fades in, then its glow layer fades up to
// its brightness (see-through-ness only; brighter = remembered better). One after another in the pop-in rhythm (60 ms
// apart, all started within 400 ms), only the first time you open the tab after the app starts, or for a band whose
// level changed since (movement explains: "this one changed"). Nothing loops on this screen.
// Tapping a tile opens a sheet with its lessons: the sheet slides up (SPRING.sheet) over a dark scrim that fades in (SCRIM).
// With Reduce motion: the tiles are simply there.
export const HEAT = {
  start: 0.15,                                                             // the first tile waits until the tab has nearly glided in
  fill: { duration: TIME.feedback, ease: EASE.out },                       // a tile's colour filling up (its delay: popInDelay)
  fillKeys: { transform: ['scaleY(0)', 'scaleY(1)'], opacity: [0, 1] },
  glow: { duration: 0.3, delay: 0.15, ease: EASE.out },                    // then its glow coming up to its brightness
};
// The dark layer behind a sheet you can close (R14: the heatmap's lessons sheet). Small feedback; with Reduce motion a quick fade.
export const SCRIM = { duration: TIME.feedback, ease: EASE.out };

// Settings (redesign R15). "Play a sample" shows the sound you hear: a soft ring goes out from the play icon with
// each sound, growing to 1.9 times and fading, like a signal leaving a tower. R19 (idea I55): four real sounds in a
// row (a pick, right, not quite, lesson done), so four rings, `gap` apart (the same gap as SAMPLE_GAP in src/sound.ts);
// all gone within a celebration time. Transform and see-through-ness only; nothing loops. With Reduce motion: no
// rings, the icon's glow layer fades in for the sample and back out (a quick fade).
export const SAMPLE = {
  ring: { duration: 0.6, ease: EASE.out },
  gap: 0.32,                                                               // the next ring, with the next sound
  from: { scale: 1, opacity: 0.8 }, to: { scale: 1.9, opacity: 0 },
};

// The look changing between Night and Day (R20, idea I56): a cover painted like the old page's background lies over the
// whole window and fades away (see-through-ness only), so the new look comes up like dawn or dusk instead of every
// colour snapping at once. With Reduce motion it's the quick fade (nothing moves either way).
export const LOOK_FADE = { duration: 0.3, ease: EASE.inOut };
export const lookFade = (calm: boolean) => (calm ? QUICK_FADE : LOOK_FADE);

// When the k-th of a row (stars, bars, rings) starts.
export const nth = <T extends { delay: number }>(t: T, k: number, gap: number): T => ({ ...t, delay: t.delay + k * gap });

// A question gliding in and out (R11): in from the right, out to the left, like a page turning; together within a
// screen change (320-420 ms). With Reduce motion: only a quick fade in, and the old one goes at once.
const STEP = 40;
export function questionGlide(calm: boolean) {
  return calm
    ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: QUICK_FADE }, exit: { opacity: 0, transition: INSTANT } }
    : { initial: { x: STEP, opacity: 0 }, animate: { x: 0, opacity: 1, transition: { duration: TIME.screenIn, ease: EASE.out } },
        exit: { x: -STEP, opacity: 0, transition: { duration: TIME.screenOut, ease: EASE.in } } };
}

// A top bar timing, started `wait` seconds after the top bar appears (TOP_BAR.wait or TOP_BAR.afterPath).
export const barAt = <T extends { delay: number }>(t: T, wait: number): T => ({ ...t, delay: t.delay + wait });

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
// React (the sound code) through prefs. Only the app's own switch counts, never Windows' setting (T46).
export function MotionKit({ calm, children }: { calm: boolean; children: ReactNode }) {
  prefs.reduceMotion = calm;
  return <MotionConfig reducedMotion={calm ? 'always' : 'never'}>{children}</MotionConfig>;
}
