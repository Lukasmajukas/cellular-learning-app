# Handoff note: 2026-10-31, T42: Review the draft bands file

**Status:** DONE
**Model used:** Large (Opus), High effort (robot worker) · **Branch / pull request:** claude/robot-t42-bands-review, #26

## In simple words (for the owner)
I marked the bands file like homework. The frequency table is all correct. The "which carrier uses which band" part has 4 rows marked "trusted" without good enough evidence, and a few well-sourced rows marked "not checked". I wrote the problems down; fixing them is the next task (T43).

## What was done
- Re-ran `content/tools/build_bands.py`. It rebuilt both files with no changes, so they really come from the script.
- Checked the band table against research tables A–E, plus number checks: spacing, widths, subsets, status/date/source on every row, and every carrier row's band exists. All passed, except 4 satellite bands with unequal up/down widths (as Wikipedia prints them; for T07).
- Checked all 64 carrier rows against the us_bands.md matrix, its cited findings, the Q4 timeline, and Wikipedia's deployment table (band_verification Q3).
- Wrote `docs/reviews/2026-10-31-bands-review.md`: 5 band-table notes (A1–A5) and 16 carrier-row notes (B1–B16), each with evidence, a suggested fix and a severity.
- Did **not** change `content/`: the task was to flag. Added T43 to apply the fixes through the scripts.
- Updated TASKS (T42 done, T43 added), PROGRESS-LOG, DECISIONS, GLOSSARY, content/README, and panel/live.json + index.html. Panel not republished (robot run).
- Approvals and blocks: nothing asked for approval and nothing was blocked. The chat was interrupted once by the usage limit and carried on after the reset.

## What's next
- Next task for Claude: T43 (fix the bands file), model: Medium (Sonnet), effort: Medium, type: `Do the next task in TASKS.md`. The robot will pick it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- "Carrier uses band" means a phone sees the band on that carrier's own sites. Spectrum sales and satellite use go in a separate dated "spectrum changes" list. Rows backed by the same source get the same status.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- Spectrum change, LRA (LTE in Rural America)

## Notes for the next Claude
- Top fixes, in order: B1 (B5 Cellcom: the source says n5, not B5), B2 (B13 Cellcom: "access to" ≠ broadcasts), B3 (B26 SpaceX: headline only), B4/B5 (move SpaceX and AST to a spectrum-changes list), B6 (Boost n70/n71/n66 → HISTORICAL, cited by the EchoStar 10-Q), B7 (Verizon n77 → CURRENT, same evidence as n260/n261).
- The C Spire rows to add (B25, B41) and the "consistent with Wikipedia (undated)" evidence label come from band_verification.md Q3.
- A1 (B23 "not applicable") needs a status choice. HISTORICAL fits the fixed status list; a `not_applicable` flag is the alternative.
- The number-check script was a throwaway (in /tmp). T28 (fact checker) should include the same checks.
