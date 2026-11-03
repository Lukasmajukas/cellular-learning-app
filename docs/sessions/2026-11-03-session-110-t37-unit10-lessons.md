# Handoff note: 2026-11-03, T37 unit 10 lessons 2-4 and exam (robot run)

**Status:** DONE (T37 continues: only the Opus review is left)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** robot/t37-unit10-lessons2-4 (#114)

## In simple words (for the owner)
The detective unit is finished. Lessons 2 to 4 and the no-hints final exam are written and in the app, after unit 9. No new facts: every clue uses facts already checked.

## What was done
- Moved lesson 1 out of the draft folder and wrote lessons 2 (two clues), 3 (phone screen), 4 (full cases, one where clues disagree, one "can't tell yet") and `lesson-5-check.yaml` (final exam, 14 steps).
- Checker passes (635 questions), IDs locked. Lesson times: 3.1, 3.4, 3.9, 3.8, 3.6 minutes.
- Fixed one slip on the way: the "shortcuts go stale" question first pointed at the wrong spectrum deal; it now uses the UScellular to T-Mobile deal (`change:0`).
- Tests: 79 unit tests pass (3 new). A click test for unit 10 lesson 1 was added to `app/tests/units89.spec.ts`; see the result below.
- Panel not republished (robot run).

## What's next
- T37: Large (Opus, High) review of the whole app. Optional: the exam badge (units-10.md question 2).

## Decisions made
- None new (H1–H4 in `docs/curriculum/units-10.md` were followed; they are still waiting for the owner's reading).

## Questions for the owner
- None.

## Notes for the next Claude
Click tests need a display here: run `xvfb-run -a npx playwright test` in `app/`. No approvals were asked for and nothing was blocked.
