# Handoff note: 2026-10-31, T06 Build the bands data file

**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort (robot run) · **Branch / pull request:** claude/t06-bands-data, #25

## In simple words (for the owner)
I turned the research into a real table the app can read. It lists 81 phone bands with their frequencies, and 64 notes on which carrier uses which band. Every row says how sure we are. Most carrier notes say UNVERIFIED because the research couldn't reach official sources, and the app will never quiz you on those.

## What was done
- `content/tools/extract_band_definitions.py` copies tables A–E of `band_verification.md` into rows (no retyping of numbers).
- `content/tools/build_bands.py` adds 64 carrier rows from the `us_bands.md` matrix and writes `content/bands.json` (for the app) and `content/bands.md` (to read).
- Rule used: a carrier claim keeps its status (CURRENT/HISTORICAL/PENDING/PLANNED) only if the matrix tagged it [S] (cited). [W] and [U] claims become UNVERIFIED (16 of 64 kept a status). Original claim is kept in `claim`.
- Band definitions: status CURRENT, as of 2026-10-31, source = the Wikipedia revision + 3GPP spec version for each table.
- Updated content/README, TASKS (T06 done, new T42 review), PROGRESS-LOG, DECISIONS, GLOSSARY, panel/live.json + index.html. Panel not republished (robot run).
- Nothing asked for approval; nothing was blocked.

## What's next
- Next task: T42 (Large review) or T07 (needs etsi.org access). Model: Opus, High effort for T42, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Bands file is script-built; only cited carrier claims keep a status.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- UNVERIFIED, Core band

## Notes for the next Claude
- Band definitions all say CURRENT because they are standard definitions, not carrier facts; `verification` holds the research note's own wording (incl. "unresolved" items such as B70 bandwidth footnote and "no US label" bands).
- Text cells (uplink, bandwidths, spacing) are free text copied from the tables, not numbers. T29/T32 will need cleaner numeric fields for the quiz engine (a parse step, or fix at source).
- Carrier names like "SpaceX (from Grain)" are rough; T42 should check names against `carrier-codes.md`.
