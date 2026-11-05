# Handoff note: 2026-11-05, T59 idea I44 (one "signal locked" moment)

**Status:** DONE
**Model used:** Large, High effort (Opus, handed over by a robot run) · **Branch:** claude/robot-run

## In simple words (for the owner)
When you get an answer right, three little lights go off: the right answer glows, Beacon sends out a ring, and a spark flashes at the tip of the progress bar. Before, they didn't happen together: the glow and the ring came straight away, but the spark only came later, when you pressed Continue, like a drummer coming in a beat late. Now all three start in the same instant, a blink (0.08 s) after you answer, so it feels like one "got it!" moment. The spark now only comes after a right answer, so a "Not quite" no longer gets a cheerful flash.

## What was done
- **The speed file** (`app/src/theme/motion.tsx`): a new shared start, `LOCK` = 0.08 s. `FEEDBACK.pop`, `FEEDBACK.glow` and `FEEDBACK.spark` start at it, and a new `FEEDBACK.pulse` / `FEEDBACK.pulseKeys` give Beacon's happy ring the same start in a lesson.
  - Why 0.08 s and not the idea's 0.1 s: `DESIGN.md` says Beacon reacts within 0.1 s of an answer. Its face (and the tile's green colour) still change at once; 0.08 s keeps the rest under the rule with a frame to spare.
  - A trap found by the new test: Motion paints an animation's first keyframe straight away, even while it waits for its delay. The tile and the spark start from their resting look, so that can't be seen, but Beacon's ring starts at 0.9 visible, so it showed at 0 ms while the others waited. The lesson's ring keyframes now start see-through and jump to 0.9 in the first 12 ms (`times: [0, 0.02, 1]`).
- **Beacon** (`app/src/ui/Beacon.tsx`): an optional `pulse` (keyframes and timing). The lesson passes `FEEDBACK`'s; everywhere else (the path) keeps `BEACON.pulse`, which still starts at once. Idea I64 times that one.
- **Progress bar** (`app/src/ui/ProgressBar.tsx`): `spark` is now a count of right answers. Each time it grows, the tip flashes. It no longer flashes when the bar steps forward on Continue. The bar's spring on Continue is unchanged.
- **Lesson** (`app/src/LessonPlayer.tsx`): counts right answers (`locks`) for the spark and gives Beacon the lesson's pulse.
- **Tests:**
  - `app/src/motion.test.ts` (+1): the pop, glow, spark and lesson ring share `LOCK`; `LOCK` is above 0 and under 0.1 s minus a frame; the lesson ring is the path's ring (same length, same keyframes after a see-through start); the path's ring still starts at once; a wrong pick shakes at once.
  - `app/tests/lessonmotion.spec.ts`: a new click test films a right answer. The tile's pop and glow, Beacon's ring and the bar's spark must each start 30-150 ms after the answer and within 40 ms of each other, the spark must light up and fade, at 50+ fps; then a wrong pick must not spark. The Continue test now checks that the spark stays dark while the bar springs.
- **Docs:** `DESIGN.md` (moment 2), `IDEAS.md` (I44 ✅, new I87, I88, I89), `TASKS.md` (the T59 row), `DECISIONS.md`, `PROGRESS-LOG.md`, the panel.

## Test results
- Unit tests: 268 pass (1 new). TypeScript and the build: OK.
- Content checker: OK (253 facts, 27 photos, 635 questions). Nothing in `content/` changed.
- Click tests (cloud, `xvfb-run -a npx playwright test`): **128 of 128 pass** (17.0 min), the speed tests included.
- The new test, 3 runs: pop 83 ms, glow 83 ms, ring 83 ms, spark 83 ms after the answer (all in the same frame); peaks: glow 0.96-0.99, ring 0.86-0.89, spark 0.91-0.94; 60.0 fps.
- **It bites:** the same test on the old code (`main`'s `src/`) fails: pop 0 ms, glow 0 ms, ring 0 ms, and no spark at all on the answer.
- First try of the new code also failed it (the ring at 0 ms, see the trap above); fixed, then 3 passes.
- Windows build on GitHub: still stopped (T62), so not run.
- Panel not republished (robot run).

## What I looked at (by eye)
- **Flip book** (620 × 960, real speed, pictures at about 45, 160, 270 and 470 ms after the click): at 45 ms Beacon's face is already happy and nothing else has started; at 160 ms the spark at the bar's start, Beacon's ring and the tile's green glow are all lit together; at 270 ms the spark fades and the ring grows; at 470 ms everything has settled.
- **Gallery:** see "Gallery check" below.
- **Still weak (new ideas):** I87: the "right" sound plays one frame after the answer, 0.08 s before the lights; it may already land together on a PC (sound has its own delay) but nobody has measured it on Windows. I88: a right tap dot now waits 0.08 s while a wrong one shows at once; it may read as lag. I89: on the first question the bar is empty, so the spark is only half a light at the bar's left end.

## What's next
- Next task: T59, the top unticked idea in `docs/redesign/IDEAS.md`: I64 (Beacon's happy ring on the path starts with the unlock sound). Large (Opus), High effort. This was idea chat 6 of 8 after R24; the 8th is design review 4. Type `Do the next task in TASKS.md`.

## Decisions made (also added to docs/DECISIONS.md)
- After a right answer, the tile's pop and glow, Beacon's ring pulse and the progress bar's spark start at one shared moment, `LOCK` = 0.08 s after the answer. The spark marks right answers only, not the bar's step on Continue.

## Questions for the owner
- None new. T62 (the Windows build on GitHub) and T57 (the green start-up picture) are still open.
- Nothing asked for approval or was blocked during this chat.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- A delayed Motion animation whose first keyframe differs from the element's current look shows that first keyframe at once, during the delay. Start such keyframes from the resting look (and use `times` for a quick jump), or the delay is invisible.
- The film tool's frames are timed from the frame the verdict appears (`from` = the verdict), which is the frame the answer shows.
