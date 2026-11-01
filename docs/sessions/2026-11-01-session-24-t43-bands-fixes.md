# Handoff note: 2026-11-01, T43 Fix the bands file (robot run)

**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** `claude/robot-t43`, PR #27

## In simple words (for the owner)
Last time a review found the bands file said some things it couldn't prove. I fixed those. Four "trusted" rows are now marked "not checked", the SpaceX spectrum sales have their own list, and each band has plain numbers the app can read. Nothing changes in the app yet, because it doesn't use this file.

## What was done
- All changes are in `content/tools/build_bands.py` and `extract_band_definitions.py`. The two data files were rebuilt by the scripts, not edited by hand. A second run gives the same files.
- Review items applied: A1 (B23 → HISTORICAL + `not_applicable`), A2 (B35/B36/B37 split), A3 (`ul_low_mhz`, `ul_high_mhz`, `dl_low_mhz`, `dl_high_mhz`; TDD bands repeat the one range both ways; GHz converted to MHz), A5 (`core` replaced by `has_carrier_rows` and `us_active_claim`), B1–B4 (Cellcom B5 and B13 → UNVERIFIED; SpaceX B26 and B70 rows moved out), B5 (new `spectrum_changes` list, 10 entries from the Q4 timeline), B6 (Boost n66/n70/n71 → HISTORICAL, cited EchoStar 10-Q; Boost LTE rows keep UNVERIFIED with a note), B7 (Verizon n77 → CURRENT; the "~161 MHz" bit is kept in a `weak_note`), B8, B9, B10, B11 (C Spire B25 and B41 added), B13 (B4/B66 and B12/B17 split, `group` field), B14 (shared `carriers` id list), B15, B16.
- Trusted carrier rows: 16 before, 16 now (lost 4, gained Verizon n77 and three Boost NR rows).
- Sanity checks run: unique band ids, every carrier row points at an existing band, every row has status/date/source, every non-UNVERIFIED carrier row is "cited source", numeric ranges are sensible.
- Panel: `panel/live.json` updated and `panel/index.html` rebuilt. Panel not republished (robot run). Nothing asked for approval and nothing was blocked.

## What's next
- Next task: T07 (check against 3GPP, needs etsi.org or uploaded PDFs) and T27 are both blocked on access; otherwise T10, T26, T28 are the next Claude tasks. T28 (fact checker) is the natural follow-up: it should refuse `not_applicable` bands and UNVERIFIED answers. Model: Medium (Sonnet), Medium effort, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Bands file v2 shape (see DECISIONS, 2026-11-01).

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- Has carrier rows / active claim, not_applicable.

## Notes for the next Claude
- Left as is on purpose: A4 (asymmetric satellite bands, check in T07); B12 items (dropped matrix entries are listed in "Known problems"); no B85 carrier row (the research never says who uses B85 on its own); AST direct-to-cell is not modelled.
- Rows for T-Mobile B4/B66 are one per band now, copied from the research's "B4/B66" claim; each says so in its note.
- Spectrum-change sources are web-search summaries (the pages weren't opened), same caveat as section 2.
