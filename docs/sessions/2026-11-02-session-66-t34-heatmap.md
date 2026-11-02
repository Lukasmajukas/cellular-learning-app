# Handoff note: 2026-11-02, T34 part 7: spectrum heatmap

**Status:** DONE (T34 stays open: scenario puzzles)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** robot-t34-heatmap (#70)

## In simple words (for the owner)
The app now has a 🌡️ button on the main screen. It opens a "band memory" page: every band you have lessons for is a little tile. Green means you remember it well, red means it is fading (time to review), grey means you have not been quizzed on it yet. Today everything is grey, because the memory timers only start once you answer questions.

## What was done
- `app/src/heatmap.ts`: finds the questions tagged with each band in the lesson files, averages the "chance you still remember" (FSRS retrievability) over the ones you answered, and sorts bands into low (below 1 GHz), mid, high (24 GHz and up, mmWave). Only bands that have quiz questions are shown (33).
- `app/src/HeatMap.tsx` (the page) and a 🌡️ button plus screen switch in `app/src/main.tsx`.
- 5 new unit tests (`heatmap.test.ts`), 1 new click test (`tests/heatmap.spec.ts`). All 56 unit tests and all 9 click tests pass (click tests need `xvfb-run -a npx playwright test` in the cloud).
- Nothing asked for approval. Panel rebuilt, not republished (robot run).

## What's next
- Scenario puzzles (T34 rest, or fold into T35). Medium (Sonnet), Medium effort, type: `Go`
- Owner: after the first lessons, open 🌡️ on your PC and say if the colours make sense.

## Decisions made (also added to docs/DECISIONS.md)
- Heatmap shows only bands with quiz questions, as tiles in low/mid/high groups (not a to-scale ruler), so the tiles stay readable. Groups follow the owner's T48 suggestion (low below 1 GHz, high = mmWave).

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- Heatmap

## Notes for the next Claude
- Score = average retrievability over a band's non-learn questions; a question counts for every band in its `facts` list.
- The carrier part of the heatmap (colour by carrier) is not built; carrier rows are mostly UNVERIFIED (T47).
