# Handoff note: 2026-10-31, T02 (computers) + T03 reuse review

**Model used:** Large (Opus; the task only needed Medium) · **Branch / pull request:** `claude/affectionate-bell-8owy2r` (draft PR linked in the PR list)

## In simple words (for the owner)
You told me you use a Windows PC and a Mac, so the app has to work on both. Then I looked through your 6 other projects for anything to reuse. They're all built for Apple only, so their code won't work in the new app. But SpectrumScope has 125 real cell sites, each with a source, which could become tower-spotting practice.

## What was done
- T02, part 1: recorded that the owner uses a Windows PC + Mac (`CLAUDE.md`, `docs/DECISIONS.md`).
- T03: wrote `docs/reuse-review.md`. The owner asked for a quick, token-saving pass: README + file list per repo, and only 2 data files opened (bandmon `native/BandCore.swift` tables, SpectrumScope `Resources/carriers.json` shape).

## What's next
- Next task: T04 (write the PRD), model: **Large (Opus)**, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Windows + Mac → Electron favored even more (Tauri uses WebKit on Mac). Final pick in the PRD.
- No code reuse; other repos' data is a cross-check only.

## Questions for the owner
- App name idea? (T02, still open)
- May the tower-spotting units use SpectrumScope's 125 Western-MA sites? Do you live in that area?

## New words (also added to GLOSSARY.md)
- Swift, browser engine (Chromium / WebKit), notarization, FCC ASR, stealth site

## Notes for the next Claude
- The other repos aren't attached by default. Private ones (CellAtlas, bandmon, SpectrumScope) need `add_repo`; public ones (TowerScope, NetScopeiOS, NetScopeMac) can be cloned anonymously.
- bandmon's NR decode table lacks n258, n70, n85 and n105. Don't treat it as complete.
- SpectrumScope carrier facts are dated 2026-06-23, older than our research. Sites have `type` values: macro, tower, rooftop, watertank, chimney, steeple, smallcell, proposed; all 125 have a `source`.
- Owner has a free Apple personal team (per CellAtlas notes), so no Mac notarization. Plan the first-open warning in the PRD.
- Not read: SpectrumScope `tools/gen_seed.py`, the full `docs/SOUTH_HADLEY.md`, and bandmon's Python files.
