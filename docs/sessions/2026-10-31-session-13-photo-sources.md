# Handoff note: 2026-10-31, T08 copyright-free photo sources

**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** `claude/t08-photo-sources`

## In simple words (for the owner)
I made a list of where we can get photos we're allowed to use, topic by topic. Wikimedia Commons is the best place, and it has good photos of tower types, fake trees and US sites. It has almost nothing that shows which brand made the radio on a tower, so that part will need your own photos or Claude's drawings.

## What was done
- Wrote `docs/research/photo-sources.md`: sources and licence rules, a per-unit table of Commons categories with file counts, and the gaps.
- Checked Commons category pages directly. Many category names I guessed did not exist, so only categories I saw are listed.
- Added T25 (pick and licence-check photos, later), a licence rule in DECISIONS, and photo words in GLOSSARY.
- Refreshed `panel/live.json` and `panel/index.html`.

## What's next
- Next task: T09 (carrier-code list), Medium (Sonnet), Medium effort, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Allowed photo licences: public domain, CC0, CC BY, CC BY-SA.

## Questions for the owner
- None. (Optional: take photos on field trips for the equipment-brand gap.)

## New words (also added to GLOSSARY.md)
- Licence, public domain, CC0, CC BY, CC BY-SA, NC/ND, Wikimedia Commons, monopine.

## Notes for the next Claude
Robot run.
- No photo's own licence was checked. Commons API calls were rate-limited, so I used page fetches. The Flickr search for vendor-equipment photos and Openverse details (its About page returned 403) were not done.
- Nothing asked for approval and nothing was blocked.
- panel not republished: waiting for T21.
