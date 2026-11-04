# Handoff note: 2026-11-04, T53 Daily review (drive test)
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE <!-- change to DONE when the chat finishes -->
**Model used:** Medium, Medium effort · **Branch / pull request:** robot/run-2026-11-04, PR #118

## In simple words (for the owner)
The app now has a 🚗 "Daily review" button on the path map. It brings back the questions the app thinks you are about to forget, up to 20 at a time. Doing it keeps your streak alive.

## What was done
- `app/src/dailyReview.ts`: picks due questions (oldest first, cap 20, ignores ids no longer in lessons).
- `finishReview` in `finish.ts`: updates review dates, streak, XP; no path progress.
- Button in `PathMap.tsx`, wiring in `main.tsx`.
- Tests: `dailyReview.test.ts` (5), `tests/dailyreview.spec.ts` (click test). All 92 unit and 14 click tests pass.
- Panel not republished (robot run).

## What's next
- Next task: T54 (streak and goal extras), Medium (Sonnet), Medium effort, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Cap of 20 questions per review; counts for streak and XP, not stars.

## Questions for the owner
- 

## New words (also added to GLOSSARY.md)
- Daily review (drive test)

## Notes for the next Claude
Review uses fake lesson id `daily-review`. Local `main` in the container was stale, so I branched from origin/main instead of resetting. A 'This changed' card and daily-goal bar are still T54.
