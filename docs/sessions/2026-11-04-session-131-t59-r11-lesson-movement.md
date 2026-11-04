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
- Unit tests: 176 pass (171 + 5). TypeScript OK. Content checker OK (253 facts, 27 photos, 635 questions; `content/` untouched).
- Click tests: full run 60 of 60 passed (55 before + 5 new; 8.4 min), first try.
- Frame rates (cloud): shake + pop + glow while the sheet slides up 60.0 fps (wrong tile moved 27.2 to 38.4 px and back; right tile up to 1.035; glow 0 to 0.95 to 0.75); question glide + bar spring 60.0 fps (new question from x 66 to 32.5; the bar's tip went 6.7 px past its new place, then settled; spark up to 0.92); order chip glide 60.0 fps (16 frames from the pool into slot 1, and back); the match number box grew from 0.6 to 1.2 to 1. The older ones still pass: sheet 60, top bar 59.5, coming on air 60.
- With Reduce motion: the wrong tile didn't move (under 0.5 px), the right one didn't grow, the question didn't slide (one x position seen), and the bar jumped in one step.
- Windows build: see the pull request.

## What I looked at (by eye)
- Before and after gallery pictures (620 x 960 and 1280 x 800). `05-feedback-right`: the confetti that covered the screen is gone; the green tile with its glow, Beacon's green face and the sheet say "right" on their own. `04-feedback-wrong`, `23-order-wrong`, `25-scenario-wrong`: everything settles back exactly in place after the shake (same tile positions as R10's pictures, plus 3 px lower: the label row now has a fixed height so a Comeback pill never moves the question).
- New `28-comeback`: the quiet "Comeback" pill (repeat icon) beside PICK ONE, the counter at "3 / 3".
- Frame by frame (test screenshots): mid-shake, the red tile sits about 5 px right of the green one, which is popped a little wider with its glow on; mid-glide, B71's tile is caught arriving in slot 1 while B5, B12 and B2 have closed the gap in the pool.
- **Still looks weak:** the shake and the sheet start at the same moment, so the eye goes to the sheet; the shake is easy to miss (on purpose, it's gentle). The "Comeback" pill is very quiet; Beacon doesn't say anything about it yet (idea I43, R18). With Reduce motion the glow still fades in over 150 ms (allowed: a quick fade).

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
