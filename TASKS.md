# ✅ Tasks

**How to use this list:**
1. Start a new chat with this repository selected (leave the branch on **main**).
2. Pick the model size shown.
3. Type `Do the next task in TASKS.md`, or just `Go`.

Claude ticks tasks off, adds new ones, and saves (merges) its own work. ⭐ means "do this next". Rows where "Who" is "You" are things only you can answer: answer them in any chat. How chats avoid doing the same task twice: `docs/WORKFLOW.md`.

## Now
| # | Task | Who | Model size | Status |
|---|---|---|---|---|
| T02 | Tell Claude: do you have an app name idea? (Your Mac/iPhone, `cellatlas-data` and South Hadley answers are recorded in `docs/DECISIONS.md`. Two chats heard different Mac answers; the latest one stands: Mac later.) | You | — | Open: tell Claude in any chat |
| T04 | Write the plan (`docs/PRD.md`) using the research and `docs/reuse-review.md`, including which app engine to use (Electron or Tauri). You read it, ask for changes, and sign off. | Claude + you | Large (Opus) | ⭐ Next |
| T11 | Read the **progress panel + automation plan** (`docs/panel-plan.md`, now saved in the binder as a draft) and answer its 6 questions (§10) in any chat. Claude then updates the plan with your answers and with the new way chats share work (`docs/WORKFLOW.md`: the robot follows the same start-up check, and the panel shows the 🔴/🟡/🟢 traffic light). | You, then Claude | Medium for the update | 👉 Your turn: plan written |
| T16 | Optional: add the permission file, so Claude's safety check never stops chats from putting old chats away or merging their work. Open the link under "Settings" in `docs/WORKFLOW.md` and click **Commit changes** twice. | You | — | Optional, any time |

## After you sign off on the plan
| # | Task | Who | Model size | Status |
|---|---|---|---|---|
| T05 | Test build: one animated lesson screen. GitHub builds a Windows installer you download and try. | Claude | Medium | Later |
| T06 | Build the bands data file from `docs/research/notes/band_verification.md`, with a status, date and source on every row | Claude | Medium, then a Large review | Later |
| T07 | Check the band numbers against the official 3GPP documents. This needs etsi.org allowed in network settings, or PDFs you upload. | Claude | Medium | Later |
| T08 | List copyright-free photo sources for each lesson topic | Claude | Medium | Later |
| T09 | Build a sourced carrier-code (MCC/MNC) list: which code means AT&T, Verizon, T-Mobile and others, each with a status, date and source. Start from bandmon's list and fix its mistakes (see `docs/reuse-review.md` §2c). | Claude | Medium | Later |
| T10 | Turn SpectrumScope's South Hadley / Western MA sites into a "local field trip" content file, every site marked UNVERIFIED with its original evidence (owner said yes on 2026-10-31) | Claude | Medium | Later |
| T13 | Build the progress panel and robot runs, in the 5 steps in `docs/panel-plan.md` §9 | Claude | Medium | After you sign off T11 |
| T12 | When your Mac is back: put the `cellatlas-data` folder on GitHub (Claude will give exact steps) so its cell-site research can be reviewed | You + Claude | Medium | Later (needs the Mac) |

## Done
| # | Task | Finished |
|---|---|---|
| T15 | Old chats now put themselves away: when a chat starts a task, it archives this project's older chats (`docs/WORKFLOW.md`, rule 5). | 2026-10-31 |
| T14 | Fixed how chats share work: a start-up check, a "busy" sign, and Claude merging its own work (`docs/WORKFLOW.md`). Closed the 3 duplicate T03 pull requests and saved their extra findings. | 2026-10-31 |
| T03 | Checked your 6 other projects for reusable material; findings in `docs/reuse-review.md` | 2026-10-31 |
| T01 | Set up this binder: start page, roadmap, tasks, glossary, cheat sheet, memory card, research | 2026-10-31 |
