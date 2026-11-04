# Handoff note: 2026-11-04, T55 Content tidy-ups

**Status:** DONE
**Model used:** Medium, Medium effort · **Branch / pull request:** robot/run-2026-11-04-t55 (#120)

## In simple words (for the owner)
Lessons used to point at "spectrum deal number 6" by its place in a list, and a few lessons had numbers typed in by hand. If the list had been reordered, a lesson could have quietly told the wrong story. Now each deal has a short name (like `array-verizon`) and those numbers are filled in from the fact files. Nothing you see in the app changes.

## What was done
- (a) Each spectrum deal has an `id` in `build_bands.py`. Lessons use `{change:array-verizon.date}`. The checker refuses a deal without a short name or with a repeated one. The app looks deals up by name.
- (b) Unit 9 channel numbers (B66 66436/67335, B12, B13, B71 ranges) and 2110 MHz, plus unit 8 panel lengths and the "700/850 MHz" radio, are now fill-ins. Rows can carry a `values` block; the fill-in looks there (`{cellid:lte:earfcn-b66.n_low}`, `{hardware:ports:panel-length.len_a}`).
- (c) `__pycache__` removed from git, added to `.gitignore` (with `*.pyc`).
- (d) A learn card may list a teach-only (`quiz: false`) fact; questions still may not. `u9-eci-vendor-01` now lists its fact.
- Tests: Python 38 pass (2 new), app 96 pass (2 new); checker OK (253 facts, 635 questions). Question IDs unchanged. Click tests not re-run (no UI code changed).
- Panel not republished (robot run).

## What's next
- T54 rest: "this changed" cards and final-exam badge (owner's yes). Medium (Sonnet), Medium effort.

## Decisions made (also added to docs/DECISIONS.md)
- Spectrum deals are referenced by short name, never by list position.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
Nothing asked for approval or was blocked. Other hand-typed numbers may still exist in lessons (only the ones the review named were done). Run Python with `-B` to avoid new `__pycache__`.
