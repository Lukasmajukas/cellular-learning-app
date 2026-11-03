# Handoff note: 2026-11-03, T37 unit 10 cases (robot run)

**Status:** DONE (partly: T37 continues)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** robot/t37-unit10-cases

## In simple words (for the owner)
The robot is starting the final unit (the detective unit). First step: check the app can show every kind of case, then write the case list.

## What was done
- Claimed T37. Checked the question types: no new app code needed (scenario is text-only; photo clues use photo-choice or tap-clue).
- Wrote unit 10 lesson 1 (12 questions, 3.1 min) in `content/lessons-draft/unit-10/`. Checker passes with it; 76 tests pass without it.
- Panel not republished (robot run).

## What's next
- Next task: T37 (lessons 2-4 and exam), Medium (Sonnet), Medium effort.

## Decisions made (also added to docs/DECISIONS.md)
- None yet.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
The folder is outside `content/lessons/` on purpose: `units.test.ts` needs each unit to end with a checkpoint. When lessons 2-4 and `lesson-5-check.yaml` exist, move it to `content/lessons/unit-10/`, run build_lessons.py, check_content.py --update-ids, and add a click test.
No approvals were asked for and nothing was blocked.
