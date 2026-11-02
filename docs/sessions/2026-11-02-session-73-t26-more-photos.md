# Handoff note: 2026-11-02, T26 more photos (small cells, plate crops)

**Status:** DONE (T26 itself is still partly open)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** claude/robot-t26-photos-more

## In simple words (for the owner)
Two photos showed car number plates. Robot downloaded them and cut off the part with the plate, so they are safe to use in lessons.

## What was done
- Downloaded small-cell-pole-02 and site-tower-01 from Commons (Special:FilePath, 20 s apart, no 429 this time), cropped with Pillow (left 580 px / bottom 455 px), saved as webp in `app/public/photos/`. Notes in `credits.yaml` updated. Checker passes (215 facts, 18 photos, 320 questions).
- Did not add more small cells or Flickr photos (one job per run).
- Panel not republished (robot run); `panel/live.json` updated and `index.html` rebuilt. Nothing asked for approval or was blocked.

## What's next
- Next task: T35 part 4, Medium (Sonnet), Medium effort, `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- None yet.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- Download recipe that worked: `curl -sL -A "cellular-learning-app/0.1 (...)" "https://commons.wikimedia.org/wiki/Special:FilePath/<file>?width=1200"`, then Pillow. The crops were not re-opened by eye after saving; the plates are outside the crop boxes by arithmetic.
- Other 16 photos still not downloaded.
