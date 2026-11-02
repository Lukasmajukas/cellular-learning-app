# Handoff note: 2026-11-02, T34 part 1: data plumbing

**Status:** DONE (T34 stays open: the lessons are still to write)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** claude/t34-data-plumbing

## In simple words (for the owner)
The robot is adding small "plumbing" so the units 4–5 lessons can use icons and carrier number codes. Nothing you can see changes yet.

## What was done
- `build_bands.py`: new `icon` field on carrier rows (n41/T-Mobile "Ultra Capacity", n77/AT&T "5G+", n77/Verizon "5G UW"; all other rows ""), with an assert that icon rows are CURRENT. New `carrier_codes` list parsed from the two main tables of `content/carrier-codes.md` (35 codes, 25 CURRENT; the "310-200 to 310-310" range row is skipped).
- `check_content.py`: `code:` fact kind (same status/as_of/source rules, id must look like 310-260); icon refused on non-CURRENT rows.
- 5 new tests (17 total, all pass); `check_content.py` passes (198 facts, 184 questions).
- mmWave number items: use MHz, so no GHz tolerance code. Written in DECISIONS.
- Plan said "12 CURRENT rows"; the file has 14 CURRENT table rows that expand to 25 codes, so the plan's number was a count of something else.
- Not done: app unit tests (no node_modules in this run); only `bands.json` gained new fields, so none are expected to break. No app code touched. Nothing asked for approval. Panel not republished (robot run); panel/live.json not changed.

## What's next
- Next task: T34 part 2 (write unit 4), Medium (Sonnet), Medium effort, type: `Go`

## Decisions made (also added to docs/DECISIONS.md)
-

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
-

## Notes for the next Claude
