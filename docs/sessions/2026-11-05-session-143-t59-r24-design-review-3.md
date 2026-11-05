# Handoff note: 2026-11-05, T59 R24 Design review 3 (final)

**Status:** DONE (the work); the Windows check is BLOCKED on GitHub (T62), see "Approvals and blocks"
**Model used:** Large (Opus), High effort (handed over by a Sonnet robot run) · **Branch / pull request:** claude/t59-r24-design-review-3, #148

## In simple words (for the owner)
This was the last of the 24 makeover steps: a final walk through every screen, in Night and in Day, checking that everything matches the style guide. It does: the app scores 4.7 out of 5 now (4.4 last time). I found three small things that didn't match and fixed them:
1. A long panel from the bottom (like a band's list of lessons on the Heatmap) had its words 8 px to the left of the page above it, because of its own scrollbar. Now they line up at every window size.
2. The "What happened" fold-out on the error screens had the browser's own grey triangle. Now it has our own arrow after the words, like every other fold-out.
3. A type-the-number question said "Type the number" twice (the label, then the help line). The help line now says "Commas are fine, and so is GHz."

The Night Signal redesign is done. From now on the robot improves the app one idea at a time from the ideas board, which got a new order. Your own wishes always go first.

## What was done
- **Looked at everything:** a fresh gallery at the start (99 Night pictures, 99 Day pictures, into a scratch folder), viewed as contact sheets: every Night picture at your size, the narrow ones, the key wide ones, and the main screens in Day. Then scored 19 screens on look, movement, clear and "one app".
- **Review:** `docs/reviews/2026-11-05-design-review-3.md` (scores, what matches look A, fixes with proof, the new ideas order, DESIGN.md changes, what I didn't check).
- **Fix 1** (`app/src/ui/BottomSheet.tsx`): the sheet measures its whole width (scrollbar included) and starts its column at half of what's left, like the page. Before: a sheet that scrolls centred its column in what its scrollbar left, 7-8 px left of the page. The column has `data-sheet-column`.
- **Fix 2** (`app/src/Trouble.tsx`): `summary` is `display: flex; list-style: none` (no browser triangle), with our `chevron` after "What happened", turned 90° when closed and −90° when open (the same as the lesson folds in `QuestionTypes.tsx`).
- **Fix 3** (`app/src/questionScreen.ts`): `KIND_HINT.number` is "Commas are fine, and so is GHz." (`parseNumber` takes "1,710" and "2.5 GHz").
- **Plan and board:** `PLAN.md` R24 ✅ and "the 24 sessions are done"; `IDEAS.md` re-ordered (I59, I58, I78, I69, I30, I44, I64, I61, I47, I21, I20, I22, I02, I75, I76, I77, I73, I74, I10, I79, I80, then the rest), with new I78, I79, I80.
- **Docs:** `DESIGN.md` (the top line and three rules in section 6), `DECISIONS.md` (4 lines), `GLOSSARY.md` (Chevron, Fold-out), `TASKS.md` (the T59 row; new T63 for the "(type the number)" prompts, a content task), `ROADMAP.md` and `README.md` (Level 5: 24 steps done), `PROGRESS-LOG.md`, the panel.
- **Gallery:** only the 20 pictures that changed were replaced in `gallery/latest/` (`19`, `20`, `35`, `45`, `46`, each at both sizes, in Night and Day). The other 178 came out the same apart from things caught mid-movement, so copying them would only make the repository heavier (R23's reasoning).

## Test results
- Unit tests: 250 pass. TypeScript OK (the build).
- Click tests (cloud, `xvfb-run -a npx playwright test`): **123 of 123 pass** in 15.3 min (121 before + 2 new in `tests/review3.spec.ts`).
- **The new checks bite:** with the old `BottomSheet.tsx` and `Trouble.tsx` put back, both new click tests fail: the tall sheet was 8 px off at 620 × 960 (page 103, sheet 95), and the summary was a `list-item` (the browser's triangle).
- **After the fix:** the tall B71 sheet (it scrolls) and the short Keys sheet both start exactly on the page's column at 620 × 960 (103), 1280 × 800 (433), 480 × 760 (33) and 360 × 640 (20).
- **Windows build (GitHub): could not run.** Run 178 (this branch) stopped after 4 seconds, like every run since 09:17 UTC (T62).

## What I looked at (by eye)
- The "after" pictures of every changed screen, in Night and Day: the heatmap's band sheet (its words now line up with "Heatmap" above), both error screens (the chevron after "What happened", down on the crash screen, up on the load screen where it's open), and the type-the-number question and its "Right!" (the new help line).
- **Still weak** (all on the ideas board): the lesson-complete line on a phone-narrow window (I61), the Day scrim (I66), the checkpoint that looks like any lesson (I21), the welcome's "4" beside "5 lessons" (I78), the heatmap's fill-in on a slow PC (I76).

## What's next
- T59 carries on with the top idea in `docs/redesign/IDEAS.md`: I59 (a restart icon for "Again"). Large (Opus), High effort. The robot picks it up by itself; the 8th idea chat is design review 4.

## Decisions made (also added to docs/DECISIONS.md)
- The 24 planned sessions are done; the redesign carries on from the ideas board.
- A sheet's words start on the page's column, scrollbar or not.
- Every fold-out uses our chevron after its words; a help line never repeats its label.
- The new ideas order (consistency first, then I69, the silent lost save).

## Questions for the owner
- None new. T62 (the Windows build on GitHub) is still open, and T57 (the green start-up picture) when a new build is out.

## New words (also added to GLOSSARY.md)
- Chevron, Fold-out.

## Approvals and blocks
- Nothing asked for approval. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.
- **BLOCKED: the Windows build check** (PLAN.md checklist step 3), same as R20 to R23: GitHub gives the build no computer. Not a failed try: every check that could run passed. Merged per `docs/WORKFLOW.md` G7; T62 already asks the owner.

## Notes for the next Claude
- **Contact sheets save context:** three 620 × 960 gallery pictures side by side in one PNG (PIL, a label above each) can be read in one go and still show 8 px differences.
- **Sheet column:** `BottomSheet` sets the column's left margin from a `ResizeObserver` (`max(0, (offsetWidth − COLUMN) / 2)`); before the first measure it falls back to `margin: 0 auto`.
- **Gallery:** the full run takes about 4 minutes per look; don't run it while the click tests run (frame-rate tests would feel the load).
