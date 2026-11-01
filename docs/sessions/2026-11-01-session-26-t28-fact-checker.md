# Handoff note: 2026-11-01, T28 Build the fact checker
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE <!-- change to DONE when the chat finishes -->
**Model used:** Medium, Medium effort (robot run) · **Branch / pull request:** claude/t28-fact-checker, PR #29

## In simple words (for the owner)
We built a strict proofreader for our facts. Before the app is built, it reads every band and carrier fact and shouts if one has no source or date. It also stops us from ever quizzing you on a fact we haven't proven yet.

## What was done
- Tried T07 (needs etsi.org: HTTP 403 blocked) and T26 (Wikimedia Commons: HTTP 429 twice, even with a polite user-agent). Both skipped; rows in `TASKS.md` updated (T07 now "You + Claude").
- Built `content/tools/check_content.py` (Python, stdlib; PyYAML only for lessons/credits) and `content/tools/test_check_content.py` (11 tests, all pass). The real `bands.json` passes: 161 facts.
- Rules: fact needs status/date/source; photo needs allowed licence (public domain, CC0, CC BY, CC BY-SA), author, source link, date, `.webp`; question lists `facts:` refs; UNVERIFIED never an answer; HISTORICAL needs `label: history`, PENDING/PLANNED `label: coming`; AI photo refused in `kind: identify`; IDs locked in `content/question-ids.json` (`--update-ids` to add new ones).
- Panel: `panel/live.json` updated, `panel/index.html` rebuilt; panel not republished (robot run).
- Nothing asked for approval and nothing was blocked, apart from the two network blocks above.

## What's next
- Next task for the robot: T26 (retry when Commons answers). Otherwise T29 needs design first (T31 Large/Opus). Type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Lesson question schema for the checker (see DECISIONS 2026-11-01).

## Questions for the owner
- T07: allow etsi.org in the network settings, or upload the 3GPP TS 36.101 / 38.101-1 PDFs.

## New words (also added to GLOSSARY.md)
- Fact checker, Locked question ID

## Notes for the next Claude
Lesson/credits file formats are my design (PRD only says "yaml"); T31 (unit design) should follow the `facts:` ref format: `band:B2`, `carrier_use:B2/att` (band/carrier_id; if a band has several techs the key collides, so revisit when LTE+NR share ids), `change:<index>`. Hook the checker into the build when the app build scripts exist (T29).
