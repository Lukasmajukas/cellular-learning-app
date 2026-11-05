# Handoff note: 2026-11-05, T59 redesign R14 (heatmap)

**Status:** IN PROGRESS
**Model used:** Large (Opus), High effort (a Sonnet robot run claimed it and handed it to this Opus chat) · **Branch / pull request:** claude/robot-t59-r14, #138

## In simple words (for the owner)
The Heatmap tab now looks like a glowing control panel. Every band is a tile, and the better you remember a band, the brighter its tile glows: green and bright for strong, gold for okay, red and dim for fading. Bands no lesson has asked about yet are dim dashed outlines. Each tile also has little signal bars and a %, so you can read it without the colours. A key at the top counts your strong, okay, fading and new bands. When you open the tab, the tiles fill up one after another, like lights on a panel. Tap a tile (or press Enter on it) to see the lessons that ask about that band, and play one straight from there.

## What was done
- **Heatmap tab, `app/src/HeatMapScreen.tsx`** (rewritten):
  - "BAND MEMORY" label, "Heatmap" title (28 px), one line of help. On a fresh save it says how bands light up.
  - A legend card: four tiny tiles (Strong, Okay, Fading, New) with how many bands are at each level. This is idea I09.
  - Tiles five to a row (64 px tall) under "LOW BAND · BELOW 1 GHZ", "MID BAND · 1 TO 24 GHZ" and "MMWAVE · 24 GHZ AND UP".
  - A tile: the band name (code font), signal bars (1 fading, 2-3 okay, 4 strong) and the %. Outline in the level's colour, filled with 16% of it, and a **glow layer** behind it whose see-through-ness is how well you remember the band (0.15 at 50% or less, up to 1 at 100%). New bands: a dim dashed outline and "new".
  - **Fill-in:** the first time you open the tab after the app starts, each quizzed tile's colour fills from the bottom like a meter (a `scaleY` grow and a fade, 0.25 s), then its glow comes up (0.3 s); 60 ms apart, starting as the tab glide settles (0.15 s), all done by about 1 s. Only again for a band whose level changed (a module-level `seen` map, the R13 blip lesson). No loop on this screen.
  - **Tap a tile:** an info sheet with the band, its level in words and bars, how many questions ask about it, and its lessons in path order. Done and next lessons are buttons that start the lesson; locked ones are short quiet lines with a lock (n41 is in 22 lessons). Leaving the lesson comes back to the heatmap.
- **Numbers, `app/src/heatmap.ts`:** `heatLabel` now goes by the whole % the tile shows (89.6% showed as "90%" but was called okay: found in this session's first picture). New: `HEAT_TONE`, `LEVEL_WORD`, `HEAT_TINT`, `heatGlow`, `heatBars`, `heatCounts`, `lessonsByBand`. The old `heatColor` blend is gone.
- **Bottom sheet, `app/src/ui/BottomSheet.tsx`:** a third tone, `info` (`surface2`, signal-blue edge), an `icon` choice, and `onClose`: a close button (the keyboard goes there when the sheet opens), Esc closes it first (a "capture" listener, so the app's own Esc doesn't also leave the tab), and a dark scrim behind it that closes it when clicked. Answer sheets are unchanged.
- **Speed file:** `HEAT` (start, fill, fillKeys, glow) and `SCRIM`.
- **`app/src/main.tsx`:** the heatmap gets each band's lessons with their status, and can start a lesson.
- **Gallery** (`app/tools/gallery.mjs`): new `34-heatmap-fill` (mid fill-in) and `35-heatmap-sheet` (B71's lessons).
- **Tests:**
  - Unit (+12, 208 in all): levels by the whole %, the tones, glow rising with the score, the bars, legend counts, lessons by band, tile words and bars readable on the tint (Night and Day), the `HEAT` and `SCRIM` speed rules, the info sheet tone, the screen built from the blocks, the sheet's Esc and close button.
  - `app/tests/heatmap.spec.ts` rewritten (4 click tests): fill-in one after another (frame by frame) with its frame rate, glow brighter for better levels, the legend counts, no second fill-in; the sheet (lessons and their status, focus, Esc, Enter, the scrim, a second Esc leaves the tab, playing a lesson and coming back); a fresh save; Reduce motion.

## Test results
- (filled in below when the runs finish)

## What I looked at (by eye)
- (filled in below)

## What's next
- Next task: T59, session R15 (Settings). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- The heatmap's tiles, glow, bars, legend, fill-in and lessons sheet; levels by the whole % shown; the bottom sheet's closable `info` tone; band frequencies not shown in the sheet (the redesign doesn't add facts).

## Questions for the owner
- None. Optional: open the Heatmap tab on your PC and tell any chat whether the glow and the fill-in look right.

## New words (also added to GLOSSARY.md)
- Scrim, glow layer (and the Heatmap entry updated).

## Approvals and blocks
- (filled in below)

## Notes for the next Claude
- A sheet with `onClose` catches Esc in the capture step and stops it; anything else listening for Esc on `window` won't see it while that sheet is open.
- `[data-part=fill]` and `[data-part=glow]` are the tile's layers; `data-glow` holds the glow's target see-through-ness; `[data-fill-new]` marks tiles that fill in this time.
- The heatmap reads bands from the real lessons even when a test uses the sample path; lessons not in the current path show as locked ("missing").
- R15 (Settings): idea I11 (an icon per settings row) belongs to it.
