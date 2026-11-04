# Handoff note: 2026-11-04, T59 R06 path map: movement

**Status:** DONE
**Model used:** Large (Opus), High effort (took over the claim after the first Opus chat stopped on the usage limit) · **Branch / pull request:** claude/t59-r06-path-map-movement, #129

## In simple words (for the owner)
The path map moves now. Lesson circles pop in as you scroll down to them, but only the first time, so coming back to the Path tab no longer replays it. Your next lesson's rings slowly "breathe". When you finish a lesson for the first time, the path "comes on air": the blue circle turns green with rings spreading out, the dotted line to the next lesson draws itself, and the next lesson's lock flies off as its circle pops up. Finish a whole unit and a wave of rings runs up it, its banner says "done" with a little pop, and the next unit's bar draws itself. "Reduce motion" switches all of it off.

## What was done
- **Speed file** (`app/src/theme/motion.tsx`): `BREATHE` (the breathing loop: scale 1 → 1.07, see-through 1 → 0.5, one round every 2.4 s), `ON_AIR` (every step of "coming on air" and the unit moment, all ending within 1.6 s), `waveDelay`, `popInQueue` (things that scroll into view together pop 60 ms apart, all within 0.4 s), `useAwake` (false while the window is hidden, so the loop pauses), `useEntrance` (see Notes) and `EASE.inOut`.
- **What came on air** (`app/src/path.ts`): `onAirMoment(units, before, after)` gives the lesson that was just finished, the lesson it unlocked, whether it finished its unit and whether it opened the next one. Only for exactly one newly finished lesson (no show for a replay, at start-up, or for a restored backup). 4 unit tests.
- **Lesson circle** (`app/src/ui/LessonNode.tsx`): pops in when it first scrolls into view (an IntersectionObserver), and only once per app start (I17, ticked). The current lesson's two rings and glow breathe together as one layer (one background loop on the path), stopped while the window is hidden and with Reduce motion. Three moments: `onAir` (a blue "ghost" disc fades and shrinks off the new green circle, the check badge pops on, two green rings spread out), `unlock` (the old dashed disc fades, the lock flies up and off, the new current circle pops up), `wave` (one ring, for the unit wave).
- **Unit banner** (`app/src/ui/UnitBanner.tsx`): the bar is now its own layer (looks the same). Moments: `done` (a soft green sweep across, the "✓ done" pops on) and `opened` (the blue bar draws itself down over the dim one).
- **Path map** (`app/src/PathMap.tsx`): remembers the last progress it showed (until the app closes) to find the moment; the dotted line piece to the newly unlocked lesson draws itself (a mask growing along the curve over the dim dots, removed when done). After a first finish it frames the finished lesson and the next one together, and the finished unit's banner too when all of it fits (otherwise the last lesson of a unit came on air off screen).
- **Click tests**: new `tests/pathmotion.spec.ts`, 6 tests: pop-in on scroll with a bounce at 60 fps, and no second pop-in after another tab; breathing (see-through 0.50–1, scale 1–1.07, 60 fps, only one loop on screen, stops when the window is hidden); coming on air (the ghost fades over 20 frames, the check pops, the rings reach 2×, the line's mask runs for many frames then goes, the lock rises and fades, the next circle pops from 0, 59.6 fps, both circles on screen; a 5-picture flip book); a whole unit (wave goes upward, "done" pops, sweep, next bar draws, banner and next lesson on screen, 60 fps); a replay shows nothing; Reduce motion (no pop-ins, no breathing, no moment layers at all in any frame).
- **Unit tests**: 3 new in `motion.test.ts` (everything in `ON_AIR` ends within 1.6 s; the breathing loop is one soft 2–4 s loop of size and see-through-ness only; the pop-in queue).
- **Checks**: unit tests 150 pass (143 + 7). Click tests 38 pass (32 + 6) in a full run; the path, motion and frame specs passed again in a second run (19). TypeScript OK. Content checker OK (253 facts, 27 photos, 635 questions; `content/` untouched). No colour codes, no emoji, no hand-typed speeds (the guards pass).
- **Gallery**: all pictures redone. 01 and 09 (path, Night and Day, narrow and wide) look as in R05, with the rings caught mid-breath; the other screens are unchanged by this session.

## What I looked at (by eye)
- **Flip book of coming on air** (5 pictures, 0.25–1.45 s after pressing Continue): 1) the finished lesson still blue, next one locked; 2) green with the check and the rings spreading, the line half drawn, the lock lifting off; 3–5) the new current circle popped up with its rings, the line bright all the way. Reads clearly as "this one came on, now that one is next".
- **Unit done** (1.1 s in): the whole short sample unit fits, "UNIT 1 ✓ DONE" popped on with the green sweep across the banner, a wave ring around lesson 3, unit 2's bar half drawn, lesson 4 arriving. My first try framed only the two lessons and hid the banner's pop under the top bar; fixed by framing the banner too when it fits.
- **Gallery** `01-path-map` and `09-path-map-day-wide`: same layout as R05, the current lesson's rings slightly bigger mid-breath. Nothing jumps.
- **Still looks weak:** the lesson-complete confetti keeps falling over the path during "coming on air" (two celebrations overlap; idea I23, for R12). For long units (5–7 lessons) the finished unit's banner is too far up to see its "done" pop; you see the wave and the next unit's bar (idea I25). The line only draws itself for the one piece that just opened; it doesn't carry across units yet (I22).

## What's next
- Next task: T59, session R07 (Top bar and daily goal). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- How the path map moves (pop-in once on scroll, one breathing loop, when "coming on air" plays and what it does, the framing after a finish, `ON_AIR` within 1.6 s).
- `useEntrance()` for anything that moves the moment it appears inside a screen.

## Questions for the owner
- None. Optional: open the newest build, finish a lesson, and say whether "coming on air" feels right (too slow, too much, just right).

## New words (also added to GLOSSARY.md)
- Coming on air, breathing (animation).

## Approvals and blocks
- Nothing asked for approval; nothing was blocked. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.

## Notes for the next Claude
- **Gotcha (found this session):** the screens sit inside `<AnimatePresence initial={false}>` in `main.tsx`, and Motion then skips EVERY mount animation inside them (`initial` → `animate` jumps to the end). Pop-ins worked in R04/R05 only because tab changes re-mount the screen. Anything that should move the moment it appears: `const on = useEntrance()` and `animate={on ? to : from}`. Changing `animate` later (state, scroll) animates normally.
- Bouncy springs (300/14) take about 0.7 s to settle (measured: overshoot to about 1.25, then a dip to 0.94). Count them as 0.7 s when fitting a timeline into 1.6 s; the motion unit test does.
- The test helper `film()` in `pathmotion.spec.ts` records own see-through-ness (`op`), the real visibility with parents (`vis`), scale x/y and top for several selectors each frame. Reuse it for R07's count-ups and R11/R12.
- Test ids: `pop-<lessonId>` (pop-in wrapper, `data-pop` = still / waiting / in), `lesson-breath` (`data-breathing`), `on-air-ghost`, `on-air-ring`, `lock-off`, `lock-disc`, `wave-ring`, `line-draw-<id>` (the mask path), `line-to-<id>` (`data-drawing`), `banner-bar`, `banner-sweep`, `banner-done`, and `data-moment` on banners.
- The path's memory of the last progress it showed is a module variable in `PathMap.tsx` (`lastShown`); the "already popped in" set is in `LessonNode.tsx` (`seen`). Both reset when the app restarts.
- Playwright: circles far down the path stay invisible (scale 0.6, see-through 0) until scrolled to. `click()` scrolls them in itself; measuring their size without scrolling gives the shrunken size.
