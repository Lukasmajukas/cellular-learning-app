# Handoff note: 2026-11-02, T35 drawings (lattice, guyed, DAS)

**Status:** DONE (T35 itself is still partly open)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** claude/robot-t35-drawings / #81

## In simple words (for the owner)
The photo website still said "too many visitors", so Claude drew three pictures itself: an open steel-frame tower, a cable-held mast, and the little antennas inside a stadium. Now the lessons have a picture for each of those three, with no photo needed.

## What was done
- Probed Commons first (429 again), so T26 was not touched.
- Drew `lattice`, `guyed` and `das` as SVG (sources in `content/photos/drawings/`), rendered to `app/public/photos/*-drawing-01.webp` (800x480), looked at by eye.
- Added 3 rows to `content/photos/credits.yaml` (ids `type-lattice-drawing-01`, `type-guyed-drawing-01`, `type-das-drawing-01`, CC0, author "Claude (own drawing)").
- Checks: fact checker OK (21 photos), 23 content tests, 62 app tests pass. Panel not republished (robot run). Nothing asked for approval or was blocked.

## What's next
- Next task: T35 units 6 and 7 (plan in `docs/curriculum/units-6-7.md`), Medium (Sonnet), Medium effort, type: `Do the next task in TASKS.md`. T26 remainder (3 photos, width 960) waits for Commons.

## Decisions made (also added to docs/DECISIONS.md)
- None.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
The checker demands `.webp` for every photo row, so drawings are rendered from SVG via Playwright screenshot + PIL. Re-render the same way if a drawing changes.
