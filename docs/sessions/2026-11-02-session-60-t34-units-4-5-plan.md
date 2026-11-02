# Handoff note: 2026-11-02, T34 units 4–5 plan

**Status:** DONE (T34 stays open: the lessons are still to write)
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** claude/t34-units-4-5-plan, PR #64

## In simple words (for the owner)
The robot wrote the lesson plan for units 4 and 5, like a teacher's plan before the lessons. Unit 4 covers the wide, fast bands (n41, the n77 family, CBRS and the very high mmWave bands). Unit 5 is about which carrier uses what. It is smaller than planned, because many carrier facts are still unchecked and the app may only quiz checked facts.

## What was done
- Wrote `docs/curriculum/units-4-5.md` (same layout as the units 1–3 plan) from `content/bands.json`, `content/carrier-codes.md` and the PRD.
- Listed which facts are CURRENT (6 carrier rows) and which stay grey; found gaps: no row for "upper C-band", n77 slices, or satellite-to-phone carriers; icon names live only in note fields; no `code:` fact kind for carrier codes.
- Added 3 glossary words, a decision line, a progress-log line, and updated the T34 row.
- No app code. Nothing asked for approval. Panel not republished (robot run); `panel/live.json` not changed.

## What's next
- T34 continues: data plumbing (section 8 of the plan), then write unit 4, then unit 5.
- Next task: T34 part 2, Medium (Sonnet), Medium effort, type: `Go`

## Decisions made (also added to docs/DECISIONS.md)
- Units 4–5 plan shape (see the plan, section 6).

## Questions for the owner
- Two small ones in section 9 of the plan (smaller unit 5 OK; how to ask one-answer carrier questions). Neither blocks work; the robot's suggestions stand if you say nothing.

## New words (also added to GLOSSARY.md)
- Capacity band, CBRS, fingerprint band.

## Notes for the next Claude
Some plan rows are marked as open design points (GHz tolerance on mmWave number items; CBRS "shared with radar" needs a source before it goes on a card). The plan was written from the data without running `check_content.py` against lessons (no lesson files yet).
