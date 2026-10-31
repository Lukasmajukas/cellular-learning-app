# ✅ Tasks

**How to use this list:**
1. Start a new chat with this repository selected.
2. Pick the model size shown.
3. Type `Do the next task in TASKS.md`.

Claude ticks tasks off and adds new ones. ⭐ means "do this next".

## Now
| # | Task | Who | Model size | Status |
|---|---|---|---|---|
| T02 | Do you have an app name idea? (Computers are answered: Windows PC + Mac.) | You | — | Half done: name still open. Claude will ask again in T04 |
| T04 | Write the plan (`docs/PRD.md`) using the research and `docs/reuse-review.md`, including which app engine to use (Electron or Tauri). You read it, ask for changes, and sign off. | Claude + you | Large (Opus) | ⭐ Next |

## After you sign off on the plan
| # | Task | Who | Model size | Status |
|---|---|---|---|---|
| T05 | Test build: one animated lesson screen. GitHub builds a Windows installer you download and try. | Claude | Medium | Later |
| T06 | Build the bands data file from `docs/research/notes/band_verification.md`, with a status, date and source on every row | Claude | Medium, then a Large review | Later |
| T07 | Check the band numbers against the official 3GPP documents. This needs etsi.org allowed in network settings, or PDFs you upload. | Claude | Medium | Later |
| T08 | List copyright-free photo sources for each lesson topic | Claude | Medium | Later |

## Done
| # | Task | Finished |
|---|---|---|
| T03 | Reuse review of your other projects → `docs/reuse-review.md`. Short version: little code to reuse; SpectrumScope's 125 sourced tower sites are the best find. | 2026-10-31 |
| T01 | Set up this binder: start page, roadmap, tasks, glossary, cheat sheet, memory card, research | 2026-10-31 (merge the setup pull request to finish) |
