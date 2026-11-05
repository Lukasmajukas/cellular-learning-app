# Handoff note: 2026-11-05, T59 idea I89 (lit stub on an empty progress bar)
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** IN PROGRESS <!-- change to DONE when the chat finishes -->
**Model used:** Large, High effort (Opus robot worker, handed over from a Sonnet robot run) · **Branch / pull request:** claude/robot-t59-i89, #161

## In simple words (for the owner)
When you get an answer right, a little spark flashes at the tip of the lesson's progress bar. On the first question the bar was empty, so the spark landed on the bar's round left end and half of it was cut off. Now the bar always keeps a small lit start, like the little flame that's always on in a gas heater, and the first spark sits whole on its tip. The bar still counts as 0 until you finish a question.

## What was done
- **The progress bar** (`app/src/ui/ProgressBar.tsx`) has a new switch, `stub`. With it on, the first `height` px of the track stay lit (12 px on the lesson bar), even at 0. The cover that slides off the colour now starts after the stub, so its slide covers only the rest and 100% is still full.
- **Only the lesson's bar** has it (`app/src/LessonPlayer.tsx`). The daily goal's bar on the path doesn't: an empty goal should look empty, and nothing sparks there.
- **Nothing else changes:** the value read out to a screen reader (`aria-valuenow`) and `data-value` stay the real ones (0 at the start); the spark's timing (I44) is untouched.
- **The spark's place:** it rides on the cover's left edge, so it is now centred 12 px in from the bar's left edge (measured), instead of right on the edge.
- **New click test** in `tests/lessonmotion.spec.ts`: the goal bar has no stub; at the first question the lesson bar reads 0, its stub is 12 px, a pixel in the stub isn't the track's colour, and the first right answer's spark is centred at least a bar-height in and lights up (0.91).
- **Docs:** `DESIGN.md` (moment 2), `IDEAS.md` (I89 ✅), `TASKS.md`, `DECISIONS.md`, `PROGRESS-LOG.md`, `GLOSSARY.md` ("Lit stub"), the panel.

## Test results
- (filled in below)

## What I looked at (by eye)
- (filled in below)

## What's next
- Next task: T59, idea **I85** (during the top bar's moment, show the gain once instead of two "+10"s side by side; idea chat 4 of 8 after review 4). Large (Opus), High effort. Type `Do the next task in TASKS.md`.

## Decisions made (also added to docs/DECISIONS.md)
- The lesson's progress bar keeps a lit stub as long as the bar is tall (12 px), even at 0. Only the lesson bar: the daily goal's bar stays empty when empty.

## Questions for the owner
- None new. T62 (the Windows build on GitHub) and T57 (the green start-up picture) are still open.

## New words (also added to GLOSSARY.md)
- **Lit stub**: the little lit start at the left end of a lesson's progress bar.

## Notes for the next Claude
- `stub` sets the cover's `left` to `height`; `translateX(%)` is relative to the cover's own width, so it now moves over `width - stub`. Film tests that read the fill's x see it start 12 px further right; step sizes are a little shorter (still well over 30 px).
- Approvals: nothing asked for approval and nothing was blocked in this run (so far).
