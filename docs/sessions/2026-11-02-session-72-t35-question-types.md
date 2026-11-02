# Handoff note: 2026-11-02, T35 part 3: photo-choice and tap-the-clue question types
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE (T35 itself is still partly open)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** claude/robot-t35-question-types

## In simple words (for the owner)
The app can now ask "what kind of tower is this?" with a picture on top, and "tap the clue" where you tap the right spot on a picture. If you tap the wrong spot, it shows a red dot where you tapped and an orange box where the answer was. Nothing real uses them yet: units 6 and 7 will.

## What was done
- New question types `photo-choice` and `tap-clue` in `app/src/questions.ts` (marking, answer text), `resolve.ts` (checks the photo id, alt words and boxes; loud errors), and `LessonPlayer.tsx` (`PhotoView`: picture, credit line, outline, tap dot, "not downloaded yet" fallback).
- `build_lessons.py` now puts the photo credits list into `content/lessons.json`; `units.ts` hands it to the resolver.
- Demo: sample lesson `u2-l4` plays one of each with a drawing (`app/public/photos/demo-drawing-01.svg`). The sample path now has 7 lessons (old tests updated).
- Tests: `app/src/pictures.test.ts` (7 unit tests), `app/tests/pictures.spec.ts` (click test). Whole suite: 62 unit tests, 10 click tests, 23 checker tests pass; the real content checks OK.
- Bug fixed: `check_content.py` looked for `ai_generated`, but `credits.yaml` uses `ai_made`, so the AI-photo rule never fired. It now reads both and covers `photo-choice` and `tap-clue` too (new test).
- Panel not republished (robot run); `panel/live.json` updated and `index.html` rebuilt. Nothing asked for approval or was blocked.

## What's next
- Next task: T35 part 4 (drawings for lattice, guyed, DAS; then write unit 6), model: Medium (Sonnet), effort: Medium, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Picture boxes are fractions (0 to 1); credit line always shown; a tap on the box edge counts as right.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- Alt text; Tap the clue.

## Notes for the next Claude
- In a lesson YAML: `kind: photo-choice` needs `photo` (id in credits.yaml), `alt`, `choices`, `answer`, optional `outline: {x,y,w,h}`; `kind: tap-clue` needs `photo`, `alt`, `clue` and `target: {x,y,w,h}`. Photos load from `photos/<file>` (put downloaded .webp in `app/public/photos/`). A missing file shows a grey "not downloaded yet" box, so lessons can be written before T26 downloads.
- Click tests need a display and a build first: `npm run build && xvfb-run -a npx playwright test`.
- The checker's `.webp` rule means drawings (SVG) must not go in credits.yaml; decide how to credit drawings when unit 6 needs them.
- In click tests, wait for the next prompt before measuring a picture: the old question is still animating out after Continue.
