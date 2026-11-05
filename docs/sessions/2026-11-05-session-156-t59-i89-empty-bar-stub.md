# Handoff note: 2026-11-05, T59 idea I89 (lit stub on an empty progress bar)
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE
**Model used:** Large, High effort (Opus robot worker, handed over from a Sonnet robot run) · **Branch / pull request:** claude/robot-t59-i89, #161

## In simple words (for the owner)
When you get an answer right, a little spark flashes at the tip of the lesson's progress bar. On the first question the bar was empty, so the spark landed on the bar's round left end and half of it was cut off. Now the bar always keeps a small lit start, like the little flame that's always on in a gas heater, and the first spark sits whole on its tip. The bar still counts as 0 until you finish a question.

## What was done
- **The progress bar** (`app/src/ui/ProgressBar.tsx`) has a new switch, `stub`. With it on, the first `height` px of the track stay lit (12 px on the lesson bar), even at 0. The cover that slides off the colour now starts after the stub, so its slide covers only the rest and 100% is still full.
- **Only the lesson's bar** has it (`app/src/LessonPlayer.tsx`). The daily goal's bar on the path doesn't: an empty goal should look empty, and nothing sparks there.
- **Nothing else changes:** the value read out to a screen reader (`aria-valuenow`) and `data-value` stay the real ones (0 at the start); the spark's timing (I44) is untouched.
- **The spark's place:** it rides on the cover's left edge, so it is now centred 12 px in from the bar's left edge (measured), instead of right on the edge.
- **New click test** in `tests/lessonmotion.spec.ts`: the goal bar has no stub; at the first question the lesson bar reads 0, its stub is 12 px, a pixel in the stub isn't the track's colour, and the first right answer's spark is centred at least a bar-height in and lights up (0.91).
- **A click test fixed:** `tests/review3.spec.ts` (chevron) now waits for the browser's toggle event; see Test results.
- **Gallery** retaken in full, Night and Day, with flip books.
- **Docs:** `DESIGN.md` (moment 2), `IDEAS.md` (I89 ✅, new I99), `TASKS.md`, `DECISIONS.md`, `PROGRESS-LOG.md`, `GLOSSARY.md` ("Lit stub"), the panel.

## Test results
- Unit tests: 269 of 269 pass. TypeScript and the build: OK.
- Content checker: OK (253 facts, 27 photos, 635 questions). Nothing in `content/` changed.
- Click tests (cloud, `xvfb-run -a npx playwright test`): **130 of 131 passed** (17.2 min). The one that failed is not about this change: `review3.spec.ts` "What happened folds open with our own chevron" read the chevron's turn in the split second between the fold opening and the browser's "toggle" event (which the chevron waits for). Fixed: the test now waits up to 2 s for the turn (same check, no looser). Passed 5 of 5 after the fix. The new I89 test passed 3 more times alone (spark centred 12.0 px in, peak 0.91-0.94).
- No frame-rate test needed: nothing new moves (the stub is still; the spark's movement is unchanged and still filmed at 60 fps by the I44 test).
- Windows build on GitHub: see the pull request; it has failed without a log since 09:17 UTC (T62, no computer given to the job). Not caused by this change.
- Panel not republished (robot run).

## What I looked at (by eye)
- **Before:** `02-lesson-first-screen` on main had an empty track at 1 / 13. **After** (Night and Day): a small blue lit start at the left end of the bar, about the size of a dot; in Day it's the darker Day blue on the pale track. Bars with real progress (`03-question` at 2 / 13, `28-comeback` at 3 / 3) look the same as before, just 12 px further along.
- **Flip book `f03-answer-right`:** the stub is there in picture 1, and the spark brightens it from 0.12 s to about 0.24 s, then it settles. At 200 px wide it's small (idea I98 already covers that).
- **The daily goal's bar** on the path at 0 of 2 stays empty (also checked by the test).
- **Still weak (new idea I99):** zoomed in, the stub's right end curves inward, because the cover's round end bites into it. Every fill's tip does this, but on a 12 px stub it looks like a little crescent. At normal size it reads as a small lit cap.

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
- Approvals: nothing asked for approval and nothing was blocked in this run.
- New idea added: I99 (an outward round tip for every fill).
