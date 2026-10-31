# ✅ Tasks

**How to use this list:**
1. Start a new chat with this repository selected.
2. Pick the model size shown.
3. Type `Do the next task in TASKS.md`.

Claude ticks tasks off and adds new ones. ⭐ means "do this next".

## Now
| # | Task | Who | Model size | Status |
|---|---|---|---|---|
| T02 | Tell Claude: do you have an app name idea? (Computers answered: Windows + Mac.) | You | — | Open: tell Claude in any chat |
| T04 | Write the plan (`docs/PRD.md`) using the research and `docs/reuse-review.md`, including which app engine to use (Electron or Tauri). You read it, ask for changes, and sign off. | Claude + you | Large (Opus) | ⭐ Next |
| T09 | Optional: on your Mac, check whether a `cellatlas-data` folder exists (steps in `docs/reuse-review.md`, section 5) and tell Claude. | You | — | Optional, any time |

## After you sign off on the plan
| # | Task | Who | Model size | Status |
|---|---|---|---|---|
| T05 | Test build: one animated lesson screen. GitHub builds a Windows installer you download and try. | Claude | Medium | Later |
| T06 | Build the bands data file from `docs/research/notes/band_verification.md`, with a status, date and source on every row | Claude | Medium, then a Large review | Later |
| T07 | Check the band numbers against the official 3GPP documents. Also check the channel-number math borrowed from bandmon (EARFCN ranges, NR-ARFCN formula). This needs etsi.org allowed in network settings, or PDFs you upload. | Claude | Medium | Later |
| T08 | List copyright-free photo sources for each lesson topic | Claude | Medium | Later |

## Done
| # | Task | Finished |
|---|---|---|
| T01 | Set up this binder: start page, roadmap, tasks, glossary, cheat sheet, memory card, research | 2026-10-31 |
| T03 | Reuse review of your 6 other projects → `docs/reuse-review.md` | 2026-10-31 (merge the pull request to finish) |

## Ideas for your other projects (not part of this app)
| Project | Idea | Model size |
|---|---|---|
| bandmon | Add the missing bands n258, n70, n26, n29 and B70 to its decode tables, so it can name them from a channel number. Use only checked numbers. | Small |
