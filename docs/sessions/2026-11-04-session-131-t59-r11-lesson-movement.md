# Handoff note: 2026-11-04, T59 redesign R11 (lesson movement)

**Status:** DONE
**Model used:** Large (Opus), High effort (a Sonnet robot run claimed it and handed it to this Opus chat) · **Branch / pull request:** claude/t59-r11-lesson-movement, #135

## In simple words (for the owner)
Lessons move now. After Check, the right answer pops a little and glows green, and a wrong pick shakes gently three times, like a head shaking "no". The confetti after every right answer is gone (it fell over the words); it's kept for the end of the lesson. Each new question glides in from the right, and the progress bar springs forward with a little spark at its tip. A missed question that comes back no longer makes the counter grow: it says "Comeback" instead. In "put them in order", a band glides into its slot.

## What was done
- **The speed file** (`app/src/theme/motion.tsx`): new `FEEDBACK` (shake, pop, glow, number-box pop, order glide, spark), `questionGlide(calm)`, and a spring `step` for the lesson bar (stiffness 260, damping 21: about 7% past a step, then settles).
- **New file `app/src/ui/feedback.tsx`:**
  - `useFeedback(state)`: a block that turns `right` pops (3.5% bigger and back, 0.28 s); one that turns `wrong` shakes 3 times (6, 4, 2 px, 0.3 s). `initial={false}`, so a block that is already right or wrong when it appears doesn't move. Marks `data-move` while set (for tests).
  - `Glow`: the green glow is always there, see-through until the tile is right, then flashes to full and settles at 75% (see-through-ness only; the shadow itself never animates). `data-glow` when on (as before), `data-glow-layer` always.
  - `Fly`: an item that changes place glides from where it was (a whole `transform`), measured inside its group (`data-fly-group`).
- **Answer tiles and chips** use `useFeedback` and `Glow`. A tile's number box pops in when `n` arrives later (a match tile taking its partner's number).
- **Question types** (`app/src/QuestionTypes.tsx`): the number box pops or shakes and glows; the tap dot (`TapDot`) lands with a pop or a shake (it uses `useEntrance`, since it appears already marked); "put them in order" wraps the slots' tiles and the pool's chips in `Fly`.
- **Lesson screen** (`app/src/LessonPlayer.tsx`):
  - No confetti after a right answer (idea I31). The lesson-complete burst stays (R12 replaces it).
  - Questions use `questionGlide(calm)`: in from 40 px right, out 40 px left; with Reduce motion only a fade (R10 had seen the body start 60 px off with Reduce motion on; now nothing slides). The body is `data-testid="question-body"`.
  - The progress bar springs with `SPRING.step` and has a spark (`ProgressBar spark`).
  - The counter (idea I37): `questionCount(ids, index)` in `app/src/questionScreen.ts` counts first-time questions only; a comeback shows a quiet "Comeback" pill (`data-testid="comeback"`, repeat icon) beside the label, and the counter's spoken label says ", a comeback".
- **Progress bar** (`app/src/ui/ProgressBar.tsx`): optional `spark`: a soft light on the fill's tip that flashes when the value grows.
- **Tests:**
  - `src/motion.test.ts` (+5): the new speeds are small feedback (200-300 ms); the shake is 3 times, at most 6 px, smaller each time; the pop at most 5%; glow and spark are see-through-ness only; the bar's spring overshoots 2-10% of a step; the question glide fits a screen change and only fades with Reduce motion.
  - `src/questionScreen.test.ts`: the counter, plus a run with a miss ("1 / 5", "2 / 5", "3 / 5", "4 / 5", "4 / 5 comeback", "5 / 5").
  - `src/ui.test.ts`: the block list has `feedback.tsx`; it and `AnswerTile.tsx` read Reduce motion live.
  - New `tests/lessonmotion.spec.ts` (5 click tests): shake, pop and glow (and no confetti) at 50+ fps; the question glide and the bar's spring and spark at 50+ fps; the counter and the Comeback pill; Reduce motion (nothing moves); order chips glide in and back, and the match number box pops, at 50+ fps.
  - `tests/smooth.spec.ts`: the two confetti tests now play the lesson to the end (the burst is only there now).

## Test results
RESULTS_PLACEHOLDER

## What I looked at (by eye)
LOOKED_PLACEHOLDER

## What's next
- Next task: T59, session R12 (lesson complete). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- The lesson movement above (pop, glow, shake, glide, springy bar with a spark).
- No confetti after a right answer; the burst only at lesson complete (I31).
- The counter counts first-time questions; a "Comeback" pill (I37). Replaces R09's "6 / 13".
- Order chips glide; match number boxes pop (I40).

## Questions for the owner
- None. Optional: try a build and tell any chat if the shake feels too much or too little.

## New words (also added to GLOSSARY.md)
- Keyframes; comeback question.

## Approvals and blocks
- Nothing asked for approval; nothing was blocked. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.

## Notes for the next Claude
- **R12:** the lesson-complete screen still uses the old `btn()` helper and the confetti (`confetti()` in `LessonPlayer.tsx`, `__confettiBursts` for tests). Ideas for R12: I32 (one main button), I34 (Beacon's size jump), I43 (a "fixed" tally for comebacks).
- **Pops and shakes use Motion's separate `x` / `scale` values**, not a whole `transform` string, because they share the tile with its hover squish (`usePress`). 60 fps in the cloud. If the Windows build ever measures under 50 fps in `tests/lessonmotion.spec.ts`, switch `FEEDBACK.shakeKeys` / `popKeys` to transform strings (and check the hover squish still works).
- **`Fly`** looks for its group with `closest('[data-fly-group]')`. A ref to the group did not work: it isn't hooked up when the items first measure themselves (React fills refs and runs layout effects child-first), so the first tap never glided.
- `node tools/gallery.mjs --types-only --out <folder>` re-shoots just 18-27 (build first).
