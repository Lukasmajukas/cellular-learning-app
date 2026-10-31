# ✅ Tasks

**How to use this list:**
1. Start a new chat with this repository selected.
2. Pick the model size shown.
3. Type `Do the next task in TASKS.md`.

Claude ticks tasks off and adds new ones. ⭐ means "do this next".

## Now
| # | Task | Who | Model size | Status |
|---|---|---|---|---|
| T02 | Tell Claude: do you use only Windows, or also a Mac or Linux? Do you have an app name idea? | You | — | Open: tell Claude in any chat |
| T03 | Look through your other projects (CellAtlas, bandmon, SpectrumScope, TowerScope, NetScopeiOS, NetScopeMac) for band data, code or content we can reuse. Write the findings in `docs/reuse-review.md`. | Claude | Medium (Sonnet) | ⭐ Next |
| T04 | Write the plan (`docs/PRD.md`) using the research and T03, including which app engine to use (Electron or Tauri). You read it, ask for changes, and sign off. | Claude + you | Large (Opus) | After T03 |

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
| T01 | Set up this binder: start page, roadmap, tasks, glossary, cheat sheet, memory card, research | 2026-10-31 (merge the setup pull request to finish) |
