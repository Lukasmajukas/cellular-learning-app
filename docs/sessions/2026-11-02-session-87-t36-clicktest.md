# Handoff note: 2026-11-02, T36 click test for units 8 and 9

**Status:** DONE (T36 is complete)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** claude/t36-click-test

## In simple words (for the owner)
A robot now opens the real app, plays a whole unit 8 lesson and a whole unit 9 lesson by tapping answers, and checks that the next lesson unlocks and nothing breaks. That was the last piece of units 8 and 9.

## What was done
- `app/tests/units89.spec.ts`: two click tests. Units 1–7 are marked done in a made-up save file (no 34-lesson warm-up). One plays `unit08-l1`, one plays `unit09-l1`; each answers any question type (wrong answers are fine, misses come back once), checks photo credits show, the lesson reaches the end screen, the next lesson unlocks, and the page throws no errors. Both pass (about 1 minute each, under xvfb).
- T36 moved to Done in `TASKS.md`; diary line added; `panel/live.json` updated.

## What's next
- T37 (unit 10 and polish) has no plan yet: the next Claude should write the unit 10 plan first. T26 still has 3 photos to download (Commons 429 from the cloud).

## Decisions made
- None new.

## Questions for the owner
- None.

## New words
- None.

## Notes for the next Claude
I picked T36 over T26 because T26 got 429 on every recent try from the cloud (its notes say so). Learn-card clicks race the card-swap animation, so the test waits 250 ms after "Got it" and "Next". I forgot to open the claim pull request before starting (A3); I opened it right before merging. I did not rerun the 76 app and 36 content tests (only a test file was added; `tsc` passes). Nothing asked for approval, nothing blocked. Panel not republished (robot run); `panel/index.html` rebuilt.
