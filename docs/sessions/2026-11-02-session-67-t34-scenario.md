# Handoff note: 2026-11-02, T34 part 8: scenario puzzles

**Status:** DONE (T34 is complete)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** robot-t34-scenario

## In simple words (for the owner)
There is a new kind of question: a little story with several clues. For each clue you pick what it tells you (for example "the band is n260" → "high band"). You get it right only if every clue is right, and the answer screen marks each clue ✅ or ❌ with a short reason. The unit 4 checkpoint now has one.

## What was done
- New `scenario` question type: `questions.ts` (type, marking, right-answer text), `resolve.ts` (checks clues, fills `{band:..}` templates), `LessonPlayer.tsx` (clue rows with choice buttons, per-clue feedback).
- One scenario in `content/lessons/unit-04/lesson-5-check.yaml` (n260 → high band, Verizon) and one in the sample demo lesson. Content checker passes (320 questions); all 25 lessons still 3 to 5 minutes.
- Tests: 2 new unit tests; click test `types.spec.ts` now plays the scenario (XP +55). 58 unit tests and 9 click tests pass (`npm run build` first, then `xvfb-run -a npx playwright test`).
- Why T26 was skipped: Commons still answered 429.
- Nothing asked for approval. Panel rebuilt, not republished (robot run).

## What's next
- T35: photo questions and tap-the-clue; units 6–7 (needs T26 photos checked). Medium (Sonnet), Medium effort, type: `Go`
- More scenario puzzles can be added in later units (same YAML shape: `clues:` list with `text`, `choices`, `answer`, `why`).

## Decisions made (also added to docs/DECISIONS.md)
- A scenario is one question with 2+ clues; right only if every clue is right.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- Scenario puzzle

## Notes for the next Claude
- `lesson_timing.py` treats scenarios like a choice step (fallback branch); it may under-count slightly. Only one exists so lessons stay in range.
- Scenario clue answers are not shuffled; keep correct answers varied when writing more.
