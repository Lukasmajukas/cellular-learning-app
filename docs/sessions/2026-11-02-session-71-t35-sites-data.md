# Handoff note: 2026-11-02, T35 part 2: site facts data file

**Status:** DONE (T35 itself is still partly open)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** claude/robot-t35-sites

## In simple words (for the owner)
Bands have a data file. Towers did not. Claude is making one for tower facts (what a monopole looks like, the 200 ft rule), with a source and a date on every row, and teaching the fact checker to read it.

## What was done
- Added `content/tools/build_sites.py` and its output `content/sites.json`: 17 rows (9 site types, 3 FCC/FAA rules, the "paint or lights" inference, signs, 2 owner rows, the chain-of-evidence rule), each with status, date, source and grade. Rows come from `docs/research/notes/sites_and_carriers.md`.
- `type:water-tank` is UNVERIFIED: the research found no source for water-tank designs (its Gaps section). Questions can't rest on it until one is found. Rooftop's "painted to match" and "behind screens" were dropped for the same reason.
- `check_content.py` now reads `sites.json` and accepts `site:<id>` facts. It refuses a row with no grade or text, any number in a grade B/C row (decision F2), and anything shaped like a phone number (F4). 5 new tests; 22 pass; the real content checks 215 facts, OK.
- No app code changed. Nothing asked for approval or was blocked. Panel not republished (robot run); `panel/live.json` updated and `index.html` rebuilt.

## What's next
- Next task: T35 part 3 (photo-choice and tap-the-clue question types), model: Medium (Sonnet), effort: Medium, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Already recorded on 2026-11-02 (site facts file; numbers only for grade A). Nothing new.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- T26 got 429 from Commons on the first probe, so nothing changed there.
- `type:temporary` is grade A (FirstNet documents) and carries no numbers. `owner:noc` is grade C on purpose: the "names the owner" part comes from consumer guides, not a rule.
- To add a row: edit `ROWS` in `build_sites.py`, run it, run the checker. Lessons point at rows as `site:type:monopole` etc.
- Still to do for T35: `photo-choice` and `tap-the-clue` question types in the app, drawings, photo crops and download (T26), then units 6 and 7.
