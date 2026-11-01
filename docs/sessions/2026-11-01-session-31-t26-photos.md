# Handoff note: 2026-11-01, T26 pick and licence-check photos
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE (partly; T26 stays open) <!-- change to DONE when the chat finishes -->
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** `claude/t26-photo-credits` / #35

## In simple words (for the owner)
I started the photo list. I found 7 free photos of US cell towers and wrote down the photographer and licence for each. The free photo website kept saying "slow down", so I only got through one group of towers.

## What was done
- Commons answered 200 at first, then 429 on and off. Added retry with 30 s waits; got licence data for `Category:Mobile phone towers in the United States` only (the 5G and fake-tree categories hit 429).
- Wrote `content/photos/credits.yaml`: 7 photos (fake tree x2, camouflaged, plain tower x3, cell on wheels), licences Public domain / CC0 / CC BY / CC BY-SA from each file's own metadata. Fact checker passes (7 photos).
- Nothing asked for approval or was blocked. Panel not republished (robot run); `panel/live.json` untouched.

## What's next
- Next task: T26 again (Medium, Medium effort): still needed are small cells, rooftops, water tanks, monopoles, Flickr. type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- None.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
Pictures are NOT downloaded or looked at; picked from titles and licence data, so each needs a look (no faces, no readable plates) before a lesson uses it. Author names are as Commons shows them. Space Commons calls at least 10 s apart, retry 429 after 30 s+. Script idea: category query with `prop=imageinfo&iiprop=extmetadata`.
