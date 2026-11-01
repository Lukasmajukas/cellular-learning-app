# Handoff note: 2026-11-01, T33 frequency ranges (FR1/FR2)
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE (T33 stays open) <!-- change to DONE when the chat finishes -->
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** `claude/robot-t33-ranges` / #48

## In simple words (for the owner)
The phone world has two big "neighbourhoods" of frequencies: FR1 (410 MHz to 7.125 GHz) and FR2 (24.25 to 71 GHz, the mmWave one). They're now in the bands file as proper checked facts, so lessons can quiz them later.

## What was done
- Added `frequency_ranges` (FR1, FR2: status CURRENT, as-of date, source) to `build_bands.py`; rebuilt `bands.json`/`bands.md` (new section 4). The FR2-1/FR2-2 split is left out: the research could not verify it.
- `check_content.py` now checks these rows and lets questions point at `range:FR1` / `range:FR2`; new unit test. 12 checker tests pass, 163 facts checked, content OK.
- No app code changed, so click tests weren't run. Nothing asked for approval or was blocked. Panel `live.json` updated; panel not republished (robot run).


## What's next
- Next task: T33 (rest: time one lesson per unit; carrier questions after T47), model: Medium (Sonnet), effort: Medium, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- None.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None (FR1/FR2 already explained in unit 1).

## Notes for the next Claude
No lesson question uses `range:FR1/FR2` yet; unit 1 still teaches them through each band's `kind`. Timing a lesson needs a real run of the app (not done).
