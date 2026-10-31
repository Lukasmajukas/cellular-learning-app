# Handoff note: 2026-10-31, T03 reuse review

**Model used:** Large (the session was set to Medium/Sonnet but was served on Opus partway through) · **Branch / pull request:** `claude/fervent-galileo-ipl0mo` (pull request link in `docs/PROGRESS-LOG.md`)

## In simple words (for the owner)
We looked through your six other projects like a garage full of old car parts. The engines (the Apple-only code) don't fit a Windows app. But the maps, notes and tricks do: real disguised cell sites in South Hadley, a channel-number decoder, and iPhone Field Test instructions. Some old band numbers turned out wrong or out of date, so we only use them as clues.

## What was done
- Read all six repos (read-only, newest commit each). Ran none of their code.
- Wrote `docs/reuse-review.md`: a verdict per project, ranked reuse ideas, a fact check against `band_verification.md`, the cellatlas-data question, and what it means for the PRD.
- Recorded the owner's answers: uses Windows **and** a Mac (mostly the PC for this app); doesn't know what cellatlas-data is; skip claude-projects and LinkBond; drop the "From your own phone" log-import idea.

## What's next
- Next task: **T04, write the plan (PRD)**. Model: **Large (Opus)**. Type: `Do the next task in TASKS.md`
- Still open from T02: an app name idea (any time, any chat).

## Decisions made (also added to docs/DECISIONS.md)
- Owner uses Windows + Mac; the app must work on both, mainly used on the PC.
- "From your own phone" log-import idea dropped.
- Old projects are a source of ideas and leads only. No band or carrier fact is copied from them; everything goes through the bands data file.
- claude-projects and LinkBond are not reviewed.

## Questions for the owner
- Optional: does `~/Developer/cellatlas-data` exist on your Mac? (Steps in `docs/reuse-review.md`, section 5.)
- For the PRD: want a "Your town" lesson pack from the South Hadley sites? Would you take a few photos of them yourself?
- An app name idea?

## New words (also added to GLOSSARY.md)
- Stealth site, monopole, carrier code (PLMN / MCC-MNC), TAC, Field Test mode, RSRP

## Notes for the next Claude
- Fact-check findings worth carrying into T06/T07:
  - bandmon's NR table lacks **n258** (and n70, n26, n29); its LTE table lacks B70.
  - bandmon's EARFCN ranges and NR-ARFCN formula are UNVERIFIED. Check them against TS 36.101 / 38.104 in T07.
  - SpectrumScope's n25 span is wrong (1850–1990; should be 1850–1915 / 1930–1995), and its n77 shows the US slices (3.45–3.98 GHz) instead of the band (3300–4200 MHz).
- SpectrumScope's carrier notes are dated June 2026 and predate the Grain close (Aug 10, 2026) and AT&T's EchoStar close (Jul 28, 2026).
- bandmon's `sample-capture.log` contains the owner's real Cell ID and TAC. Don't copy these into lessons.
- The other repos were cloned to `/home/user/{cellatlas,bandmon,spectrumscope}` and `/home/user/lukasmajukas/{towerscope,netscopeios,netscopemac}` in this container only. They're gone in a new session; re-clone if needed.
- The auto-mode safety check blocked running bandmon's script. That's expected for code from another repo. Read-only review didn't need it.
