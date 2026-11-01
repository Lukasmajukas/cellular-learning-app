# Handoff note: 2026-11-01, T32 Question types, reviews and rewards

**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort (robot run) · **Branch / pull request:** claude/robot-t32-question-types, #42

## In simple words (for the owner)
The app can now ask five kinds of questions: read a card, pick an answer, match pairs, type a number and put bands in order. The numbers in them come straight from the bands file, never typed by hand. If you miss a question it comes back once later in the same lesson. Every question gets a "memory timer" (FSRS) so the app can bring it back at the right time. You also now earn XP, keep a daily streak, and see signal bars at the end of a lesson. A new sample lesson at the end of the path shows all of it. The real lessons are the next task (T33).

## What was done
- `app/src/questions.ts` (5 types and marking), `templates.ts` (fills `{band:..}`, `{carrier_use:..}`, `{change:N..}` and fails loudly), `resolve.ts` (lesson as written → finished items, badge from the weakest carrier status), `fsrs.ts` (review schedule per question ID), `session.ts` (miss comes back once), `gamify.ts` (streak, XP, signal bars), `SpectrumBar.tsx`, `finish.ts`, new `LessonPlayer.tsx`.
- Save file now also holds `reviews` and `game` (`electron/store.cjs` cleans bad data).
- New sample lesson `u2-l3` built from `content/bands.json`; path has 6 lessons.
- Tests: 37 unit tests (`src/t32.test.ts` and older), click tests (`tests/types.spec.ts` plays every type; `tests/helpers.ts`).

## What's next
- Next task: T33 (write units 1-3), Medium (Sonnet), Medium effort. T33 still needs: frequency ranges in `build_bands.py`, the checker teaching `range:FR1/FR2`, real path replacing `SAMPLE_PATH`.
- Not done from the design list: the review queue is saved but nothing shows "due reviews" yet (needs a Review screen, put it in T33 or a small follow-up); daily goal still only saved; the checker (`check_content.py`) doesn't read the new `kind` fields yet beyond what it already did; learn-card "not checked yet" grey line for UNVERIFIED rows not built.

## Decisions made (also added to docs/DECISIONS.md)
- Streak counts a day when a lesson is finished; XP = 10 per right-first-try, 5 per right retry, +20 for a perfect lesson. Signal bars = share right first try, scaled to 5 (min 1).
- Review cards are updated once per question per lesson, from the first try only.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- FSRS, stability, XP, signal bars

## Notes for the next Claude
In the cloud: `cd app && node node_modules/electron/install.js` if Electron "failed to install", then `xvfb-run -a npm run e2e`. Nothing asked for approval or was blocked.
