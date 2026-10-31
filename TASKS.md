# ✅ Tasks

**How to use this list:**
1. Start a new chat with this repository selected.
2. Pick the model size shown.
3. Type `Do the next task in TASKS.md`.

Claude ticks tasks off and adds new ones. ⭐ means "do this next".

## Now
| # | Task | Who | Model size | Status |
|---|---|---|---|---|
| T02 | Tell Claude: do you have an app name idea? (Your Mac/iPhone, `cellatlas-data` and South Hadley answers are recorded in `docs/DECISIONS.md`.) | You | — | Open: tell Claude in any chat |
| T04 | Write the plan (`docs/PRD.md`) using the research and `docs/reuse-review.md`, including which app engine to use (Electron or Tauri). You read it, ask for changes, and sign off. | Claude + you | Large (Opus) | ⭐ Next |
| T11 | Plan the **progress panel + automation** (a short plan in `docs/panel-plan.md`, separate from the app). The panel is a small web page for phone and PC that reads this repo's live task/roadmap/log files, uses no Claude tokens to view, and clearly shows when it's pulling data and when it last updated. Automation: (a) the panel refreshes itself; (b) Claude runs tasks on a schedule, with guard rails: only tasks marked "Claude", never while a Claude pull request is still waiting for you, never app code before PRD sign-off, and a cap on runs per week; (c) carrier-fact re-checks every 3 months. Includes how the page can read a private repo safely. You sign off before anything is built. | Claude + you | Large (Opus) | After T04, or first if you'd rather |

## After you sign off on the plan
| # | Task | Who | Model size | Status |
|---|---|---|---|---|
| T05 | Test build: one animated lesson screen. GitHub builds a Windows installer you download and try. | Claude | Medium | Later |
| T06 | Build the bands data file from `docs/research/notes/band_verification.md`, with a status, date and source on every row | Claude | Medium, then a Large review | Later |
| T07 | Check the band numbers against the official 3GPP documents. This needs etsi.org allowed in network settings, or PDFs you upload. | Claude | Medium | Later |
| T08 | List copyright-free photo sources for each lesson topic | Claude | Medium | Later |
| T09 | Build a sourced carrier-code (MCC/MNC) list: which code means AT&T, Verizon, T-Mobile and others, each with a status, date and source. Start from bandmon's list and fix its mistakes (see `docs/reuse-review.md` §2c). | Claude | Medium | Later |
| T10 | Turn SpectrumScope's South Hadley / Western MA sites into a "local field trip" content file, every site marked UNVERIFIED with its original evidence (owner said yes on 2026-10-31) | Claude | Medium | Later |
| T12 | When your Mac is back: put the `cellatlas-data` folder on GitHub (Claude will give exact steps) so its cell-site research can be reviewed | You + Claude | Medium | Later (needs the Mac) |

## Done
| # | Task | Finished |
|---|---|---|
| T03 | Checked your 6 other projects for reusable material; findings in `docs/reuse-review.md` | 2026-10-31 |
| T01 | Set up this binder: start page, roadmap, tasks, glossary, cheat sheet, memory card, research | 2026-10-31 (merge the setup pull request to finish) |
