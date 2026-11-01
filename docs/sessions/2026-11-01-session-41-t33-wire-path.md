# Handoff note: 2026-11-01, T33 show real lessons on the path map

**Status:** DONE (partly; T33 stays open)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** `claude/robot-t33-unit2` / #45

## In simple words (for the owner)
The path map now shows the real unit 1 lessons ("The spectrum ruler") instead of the five sample ones. When you open the app, tap the first circle and the first real lesson opens. The old sample lessons still exist, but only the automatic tests use them.

## What was done
- `app/src/main.tsx` uses `REAL_PATH` (from `units.ts`). The sample path is used only when the test switch `CELL_SAMPLE_PATH=1` is set (passed through `app/electron/preload.cjs`).
- The five older click tests now set that switch, so they keep using the sample ids (`u1-l1`, ...). New click test `app/tests/real.spec.ts` opens the app normally, checks the real lesson ids (`unit01-l1` open, `unit01-l2` locked), opens lesson 1 and quits.
- Checks: `tsc` clean, 41 unit tests pass, all 8 click tests pass (xvfb).
- Not done: playing a whole real lesson in a click test (real lessons have learn cards, matching, etc.; the sample-lesson helper only answers first choices), units 2 and 3, `frequency_ranges`, timing one lesson per unit. Nothing asked for approval or was blocked. Panel not republished (robot run).

## What's next
- Next task: T33 (rest: write unit 2, then unit 3), model: Medium (Sonnet), effort: Medium, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Sample lessons stay for tests behind `CELL_SAMPLE_PATH=1`.

## Questions for the owner
- 

## New words (also added to GLOSSARY.md)
- 

## Notes for the next Claude
Real lesson ids look like `unit01-l1` and `unit01-check`. A save file holding old sample ids (`u1-l1`) is harmless: they just don't match any real lesson. A helper that plays any real lesson (all question types) would let a click test finish one.
