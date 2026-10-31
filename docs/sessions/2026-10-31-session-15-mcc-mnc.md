# Handoff note: 2026-10-31, T09 carrier-code (MCC/MNC) list
**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** claude/t09-mcc-mnc

## In simple words (for the owner)
Every phone carrier has a secret number pair, like a name tag. The phone shows it so we can tell who runs a tower. I'm making a checked list of these tags.

## What was done
- Fetched Wikipedia's North America MCC/MNC table and built `content/carrier-codes.md` (big carriers, other codes seen, corrections to bandmon's list, gotchas).
- Found: 312/530 is T-Mobile (ex-Sprint), not Charter Spectrum; 310/280 is an old AT&T Puerto Rico code (HISTORICAL).
- Added follow-up T27 (check against official ITU list / imsiadmin; needs network access).
- Approvals/blocks: nothing asked for approval; ITU PDF URL returned 404. Panel not republished: waiting for T21.

## What's next
- Next task: T04 (PRD first draft), Large (Opus), High effort, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Only 3 codes CURRENT; rest UNVERIFIED until T27.

## Questions for the owner
- None. (T27 needs etsi/itu/imsiadmin allowed in network settings, or uploaded files.)

## New words (also added to GLOSSARY.md)
- MVNO, FirstNet

## Notes for the next Claude
Source: https://en.wikipedia.org/wiki/Mobile_network_codes_in_ITU_region_3xx_(North_America) via raw wikitext. Only content/carrier-codes.md, TASKS.md and logs touched. No app code.
