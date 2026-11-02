# Handoff note: 2026-11-02, T35 swap in real photos (monopole, fake tree 03)

**Status:** DONE
**Model used:** Medium, Medium effort (Sonnet) · **Branch / pull request:** claude/robot-run-t35-real-photos

## In simple words (for the owner)
Robot is putting two newly downloaded real photos (a monopole tower and a fake tree) into unit 6 lessons.

## What was done
- Added `u6-tall-photo-03` (real monopole photo, outline drawn) to unit 6 lesson 1 and `u6-stealth-photo-05` (real fake-tree photo) to lesson 2.
- Rebuilt lessons, locked the 2 new question ids, checker OK (572 questions), timing still 3 to 5 minutes, 76 unit tests pass.
- Panel not republished (robot run). Nothing asked for approval or was blocked.

## What's next
- T26 leftovers, T37 (Later).

## Decisions made
- None.

## Questions for the owner
- None.

## New words
- None.

## Notes for the next Claude
Monopole photo is a tiny 157 px original; it looks soft when large. Fake-tree-02 is still missing (T26). Run `npm ci` in `app/` before tests in a fresh container.
