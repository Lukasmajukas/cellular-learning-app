# Handoff note: 2026-11-02, T26 download the remaining photos

**Status:** DONE (T26 itself is still partly open)
**Model used:** Medium (Sonnet), Medium effort · **Branch:** claude/robot-t26-photos-download

## In simple words (for the owner)
The lesson photos live on a website that sometimes says "slow down, too many visitors". Robot asked politely, one photo at a time, and got 14 of the 18. The last 4 will be fetched next time.

## What was done
- Downloaded 12 photos from Commons (Special:FilePath, width 1200, 25 s apart), saved as webp (max 1200 px) in `app/public/photos/`; with the 2 cropped ones, 14 of 18 are in. No cropping needed (all were eye-checked clean earlier).
- 429 on site-fake-tree-02, site-fake-tree-03, site-camouflaged-01, site-monopole-01 (two passes). `credits.yaml` header and `TASKS.md` updated.
- Panel not republished (robot run). Nothing asked for approval or was blocked.

## What's next
- Next task: T26 remainder (4 photos) or T35 drawings, Medium (Sonnet), Medium effort, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- None.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
Script used: loop over credits.yaml, urllib with a descriptive User-Agent, Pillow thumbnail((1200,1200)) to webp q80, 25 s sleep, stop after 3 fails in a row. Only files missing in `app/public/photos/` are fetched, so re-running it picks up the last 4. Photo files are not yet referenced by any lesson.
