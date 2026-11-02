# Handoff note: 2026-11-02, T26 photos retry

**Status:** DONE (T26 itself is still partly open)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** claude/robot-t26-photos-retry / #80

## In simple words (for the owner)
The photo website still says "too many visitors" most of the time, but one more photo got through. 15 of 18 lesson photos are saved now. Robot found a tip in the error message: ask for a standard picture size (960) instead of 1200.

## What was done
- Re-ran the download script: at width 1200 all 3 tries got 429; at width 960 site-camouflaged-01 downloaded (webp, eye-checked clean earlier). Still missing: site-fake-tree-02, site-fake-tree-03, site-monopole-01.
- Updated `credits.yaml` header and `TASKS.md`. Panel not republished (robot run). Nothing asked for approval or was blocked.

## What's next
- Next task: T26 remainder (3 photos, use width 960) or T35 drawings (lattice, guyed, DAS), Medium (Sonnet), Medium effort, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- None.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
Use `Special:FilePath/<name>?width=960` (a standard thumbnail size), 25 s apart; only missing files are fetched. site-monopole-01 was only eye-checked at 157 px: check the full-size picture for readable plates before using it large.
