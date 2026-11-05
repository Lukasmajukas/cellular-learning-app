# Handoff note: 2026-11-05, T65 fair animation speed test

**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort (robot run) · **Branch / pull request:** claude/t65-speed-test-fix, #158

## In simple words (for the owner)
One of our speed tests was unfair: it failed when the cloud computer was slow, even though the app was fine. Now it times a small fixed job on the same computer at the same moment and lowers the bar a little on a slow day. A real stutter still fails it.

## What was done
- `app/tests/speed.spec.ts`: the yardstick (a fixed DOM job) moved out of the path-scroll test into a shared helper (`rounds` argument). "Every animation at a quarter speed" now times the yardstick (8 rounds, at the same quarter speed) right before and after each move and uses floor = max(12, 30 × min(1, 75 ÷ yardstick)). The table prints each floor and yardstick.
- Measured in the cloud, 3 runs: yardstick 57-91 ms (usually 75), every move 44-60 fps; all passed. A deliberate stutter (12 ms busy loop every frame, temporary, not committed) failed 10 of 13 moves, so it still bites. All 4 speed tests pass; no app code changed.

## What's next
- Next task: T63 (Haiku, Low) or T61 (Sonnet, Medium), or the next redesign idea (T59).

## Decisions made (also added to docs/DECISIONS.md)
- Floor scales with the yardstick, never below 12 fps (YARD_FAST = 75, MIN_FLOOR = 12).

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None (yardstick was already explained in T64).

## Notes for the next Claude
Robot run: panel not republished (robot run). `panel/live.json` not changed (no panel number moved). A single very low yardstick reading only makes the floor stricter (back to the old 30), never looser.
