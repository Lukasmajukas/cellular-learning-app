# Handoff note: 2026-11-02, T34 part 6: code questions in the unit 5 checkpoint

**Status:** DONE (T34 stays open: scenario puzzles and the heatmap)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** robot-t34-unit5-check (#69)

## In simple words (for the owner)
The robot is adding 3 number-tag questions to the unit 5 checkpoint, so the checkpoint also tests lesson 4.

## What was done
- Added 3 questions to `content/lessons/unit-05/lesson-5-check.yaml` (IDs `u5-cp-code-01..03`: Verizon tag, 312-530 is T-Mobile, match 3 tags). IDs locked.
- Checks: `check_content.py` OK (319 questions), Python tests 17 OK, app tests 51 pass, `tsc` clean. Checkpoint timing 4.8 minutes at the top of the range, still inside 3 to 5.
- Nothing asked for approval. Panel rebuilt, not republished (robot run).

## What's next
- Scenario puzzles and the heatmap (T34 rest). Medium (Sonnet), Medium effort, type: `Go`

## Decisions made (also added to docs/DECISIONS.md)
- None.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- Needed `npm ci` in `app/` before tests in a fresh cloud chat.
- Checkpoint is near the 5-minute top; don't add more questions to it.
