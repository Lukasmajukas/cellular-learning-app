# Handoff note: 2026-11-01, T47 Check carrier facts for units 2–3
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE (BLOCKED: official carrier/FCC pages not reachable) <!-- change to DONE when the chat finishes -->
**Model used:** Medium (Sonnet), Medium effort (robot run) · **Branch:** claude/robot-run

## In simple words (for the owner)
I tried to check which carrier uses which band using the carriers' own web pages. Most of those pages either say "page not found" or block me, and the web search only finds blogs and phone-review sites. Blogs are not good enough for our rules, so I changed no facts. I added a row asking you for help.

## What was done
- Tried att.com (KM1008837 gives a fake 404), firstnet.com, t-mobile.com, verizon.com (redirect), fcc.gov (403), ecfr.gov (406). docs.fcc.gov answers but I had no exact document address.
- Web search returned only third-party sites (phonescoop, phonearena, etc.): they agree AT&T uses B2/4/5/12/14/17/29/30/66, but that is not an official source, so no row was upgraded.
- No data files changed.

## What's next
- Next task: T32, model: Sonnet Medium, effort: Medium, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- 

## Questions for the owner
- Can you paste exact official page addresses (carrier band pages, FirstNet band 14 page, FCC documents) or upload PDFs? See TASKS.md T47.

## New words (also added to GLOSSARY.md)
- 

## Notes for the next Claude
Only TASKS.md, PROGRESS-LOG.md, panel/live.json and this note changed. Panel not republished (robot run).
