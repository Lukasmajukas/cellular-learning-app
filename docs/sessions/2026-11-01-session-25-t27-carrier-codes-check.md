# Handoff note: 2026-11-01, T27 Check the carrier-code list
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE <!-- change to DONE when the chat finishes -->
**Model used:** Medium, Medium effort (Sonnet) · **Branch / pull request:** claude/robot-t27-carrier-codes, PR #28

## In simple words (for the owner)
Every phone company has a number tag. I checked our list of tags against the official American list (the one the phone industry uses to hand out the tags). Most of our list was right, so those rows are now marked as trusted. A few tags aren't in the official list at all, so they stay marked "not checked".

## What was done
- Fetched the ATIS HNI table from imsiadmin.com (558 codes, 2026-11-01) and compared every code in `content/carrier-codes.md`.
- Upgraded to CURRENT where the registry holder matches: 313-100, 313-340, 311-580, 312-530, 310-010/012/013, 311-270/271, five AT&T GSM-era codes, 311-490/870/882, 312-190, 311-660, 311-230, 311-840/850. Confirmed that 312-530 is T-Mobile, not Charter.
- Left UNVERIFIED: 310-004/005/006 and 310-053 (not in the registry), 312-250 (LTE shut down), 312-670 (registry says AT&T Mobility, not FirstNet).
- Found 310-300 was returned in 2017; added 310-660, 310-800 and new codes for Comcast (314-680), Spectrum Wireless Holdings (313-450, 314-020), Google (312-580).
- The ITU list was not reachable (page says "publication not available"); etsi.org and 3gpp.org return 403, so T07 still can't run.

## What's next
- Next task: nothing left for the robot that has network access (T07 needs etsi.org; T26 photos and later tasks are marked Later). T26 may be tried next since commons.wikimedia.org is reachable. Model: Sonnet, Medium effort, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- In the carrier-codes file, CURRENT means the US registry shows the code held by the named company and nothing says it is dead. The registry proves who holds a code, not that it's switched on.

## Questions for the owner
- None. (Optional: download the ITU list PDF for a second check.)

## New words (also added to GLOSSARY.md)
- HNI, ATIS

## Notes for the next Claude
Only `content/carrier-codes.md` changed (plus logs). The registry page is a plain HTML table at https://imsiadmin.com/assignments/hni/ (use `curl -L`; `www.imsiadmin.com` paths 404). Entity names are legal names, e.g. "MetroPCS Wireless, Inc". Nothing asked for approval and nothing was blocked. Panel not republished (robot run).
