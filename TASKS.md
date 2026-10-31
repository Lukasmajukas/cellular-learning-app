# ✅ Tasks

**How to use this list:**
1. Start a new chat with this repository selected (leave the branch on **main**).
2. Pick the model and effort shown.
3. Type `Do the next task in TASKS.md`, or just `Go`.

Claude ticks tasks off, adds new ones, and saves (merges) its own work. ⭐ means "do this next". Rows where "Who" is "You" are things only you can answer: answer them in any chat. How chats avoid doing the same task twice: `docs/WORKFLOW.md`.

## Now
| # | Task | Who | Model + effort | Status |
|---|---|---|---|---|
| T02 | Tell Claude: do you have an app name idea? (Your Mac/iPhone, `cellatlas-data` and South Hadley answers are recorded in `docs/DECISIONS.md`. Two chats heard different Mac answers; the latest one stands: Mac later.) | You | — | Open: tell Claude in any chat |
| T13 | Switch on the robot: create the scheduled task from `docs/WORKFLOW.md` section G (fresh chat each time, twice a day at about 2 AM and 2 PM US Eastern, phone notification on). Start this chat on Sonnet with Medium effort, because the robot will probably copy the setup chat's model. Then run it once with `fire_trigger` and check that the robot's chat had the project files, the GitHub tools and the chat-list tools, wasn't stuck waiting for approval, and used Sonnet. Report what you found. | Claude | Medium (Sonnet), Medium effort | ⭐ Next |
| T18 | Build the progress panel: the private claude.ai page in `docs/panel-plan.md` §5, following §9 steps 1 and 2. Keep its files in a `panel/` folder in this project (no new repository). It should also show the 🔴/🟡/🟢 traffic light. You approved building it before the plan sign-off. | Claude | Medium (Sonnet), Medium effort | The robot may do it |
| T08 | List copyright-free photo sources for each lesson topic | Claude | Medium (Sonnet), Medium effort | The robot may do it |
| T09 | Build a sourced carrier-code (MCC/MNC) list: which code means AT&T, Verizon, T-Mobile and others, each with a status, date and source. Start from bandmon's list and fix its mistakes (see `docs/reuse-review.md` §2c). | Claude | Medium (Sonnet), Medium effort | The robot may do it |
| T04 | Write the plan (`docs/PRD.md`) using the research and `docs/reuse-review.md`, including which app engine to use (Electron or Tauri). You read it, ask for changes, and sign off. | Claude + you | Large (Opus), High effort | Next after T13: do it in a chat with you |

## After you sign off on the plan
| # | Task | Who | Model + effort | Status |
|---|---|---|---|---|
| T05 | Test build: one animated lesson screen. GitHub builds a Windows installer you download and try. | Claude | Medium (Sonnet), Medium effort | Later |
| T06 | Build the bands data file from `docs/research/notes/band_verification.md`, with a status, date and source on every row | Claude | Medium (Sonnet), Medium effort; then a Large (Opus) review, High effort | Later |
| T07 | Check the band numbers against the official 3GPP documents. This needs etsi.org allowed in network settings, or PDFs you upload. | Claude | Medium (Sonnet), Medium effort | Later |
| T10 | Turn SpectrumScope's South Hadley / Western MA sites into a "local field trip" content file, every site marked UNVERIFIED with its original evidence (owner said yes on 2026-10-31) | Claude | Medium (Sonnet), Medium effort | Later |
| T12 | When your Mac is back: put the `cellatlas-data` folder on GitHub (Claude will give exact steps) so its cell-site research can be reviewed | You + Claude | Medium (Sonnet), Medium effort | Later (needs the Mac) |

## Done
| # | Task | Finished |
|---|---|---|
| T11 | You answered the panel plan's questions: robot twice a day, restart work plus safe tasks, panel built now, pause by typing `Pause the robot` (answers at the top of `docs/panel-plan.md`) | 2026-10-31 |
| T17 | Claude now says the effort level along with the model, like "Opus, High effort" | 2026-10-31 |
| T16 | You added the permission file, so the safety check won't stop chats from putting old chats away or merging their work | 2026-10-31 |
| T15 | Old chats now put themselves away: when a chat starts a task, it archives this project's older chats (`docs/WORKFLOW.md`, rule 5). | 2026-10-31 |
| T14 | Fixed how chats share work: a start-up check, a "busy" sign, and Claude merging its own work (`docs/WORKFLOW.md`). Closed the 3 duplicate T03 pull requests and saved their extra findings. | 2026-10-31 |
| T03 | Checked your 6 other projects for reusable material; findings in `docs/reuse-review.md` | 2026-10-31 |
| T01 | Set up this binder: start page, roadmap, tasks, glossary, cheat sheet, memory card, research | 2026-10-31 |
