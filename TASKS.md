# ✅ Tasks

**How to use this list:**
1. Start a new chat with this repository selected (leave the branch on **main**).
2. Pick the model and effort shown.
3. Type `Do the next task in TASKS.md`, or just `Go`.

Claude ticks tasks off, adds new ones, and saves (merges) its own work. ⭐ means "do this next". Rows where "Who" is "You" are things only you can answer: answer them in any chat. How chats avoid doing the same task twice: `docs/WORKFLOW.md`.

**What are T13, T20 and so on?** They're just labels so chats don't mix up tasks. You can ignore them. The progress panel (T18) will show plain names instead.

## Now
| # | Task | Who | Model + effort | Status |
|---|---|---|---|---|
| T22 | Open the progress panel (link in `panel/README.md`), pin it, and tell Claude in any chat if it looks right on your PC and phone. | You | — | Open: tell Claude in any chat |
| T21 | Make the robot hands-free, in three small steps: click Approve if a robot chat is waiting on you; set the page-publishing tools to Allowed on claude.ai; add a few lines to the permission file. The clicks are in `docs/permission-lines.md`. Only you can do these. | You | — | Open: needs about 5 minutes from you |
| T02 | Tell Claude: do you have an app name idea? (Your Mac/iPhone, `cellatlas-data` and South Hadley answers are recorded in `docs/DECISIONS.md`. Two chats heard different Mac answers; the latest one stands: Mac later.) | You | — | Open: tell Claude in any chat |
| T04 | Write the plan (`docs/PRD.md`) using the research and `docs/reuse-review.md`, including which app engine to use (Electron or Tauri). You read it, ask for changes, and sign off. | Claude + you | Large (Opus), High effort | The robot may write the first draft; then you read it and type `I sign off the plan` |

## After you sign off on the plan
| # | Task | Who | Model + effort | Status |
|---|---|---|---|---|
| T05 | Test build: one animated lesson screen. GitHub builds a Windows installer you download and try. | Claude | Medium (Sonnet), Medium effort | Later |
| T27 | Check the carrier-code list (`content/carrier-codes.md`) against the official ITU list and the US registry (imsiadmin.com). Needs those sites allowed or files uploaded. | Claude | Medium (Sonnet), Medium effort | Later (needs network access or files) |
| T06 | Build the bands data file from `docs/research/notes/band_verification.md`, with a status, date and source on every row | Claude | Medium (Sonnet), Medium effort; then a Large (Opus) review, High effort | Later |
| T07 | Check the band numbers against the official 3GPP documents. This needs etsi.org allowed in network settings, or PDFs you upload. | Claude | Medium (Sonnet), Medium effort | Later |
| T26 | Pick and licence-check 2 to 4 photos per lesson topic from the places listed in `docs/research/photo-sources.md`, into a credits file in `content/`. Unit 8 (equipment brands) may start as drawings. | Claude | Medium (Sonnet), Medium effort | Later |
| T10 | Turn SpectrumScope's South Hadley / Western MA sites into a "local field trip" content file, every site marked UNVERIFIED with its original evidence (owner said yes on 2026-10-31) | Claude | Medium (Sonnet), Medium effort | Later |
| T12 | When your Mac is back: put the `cellatlas-data` folder on GitHub (Claude will give exact steps) so its cell-site research can be reviewed | You + Claude | Medium (Sonnet), Medium effort | Later (needs the Mac) |

## Done
| # | Task | Finished |
|---|---|---|
| T28 | Robot chats now tidy up after themselves: each one names itself after its job (like "Robot: Photo sources list") and puts itself away when it's done. You asked because finished robot chats were piling up, all called "Robot run". | 2026-10-31 |
| T09 | Built a first carrier-code list (`content/carrier-codes.md`): which number tag means T-Mobile, AT&T, Verizon and others. It fixes bandmon's mistakes (312/530 is T-Mobile, not Spectrum). It is marked DRAFT because the only source I could reach was Wikipedia. | 2026-10-31 |
| T08 | Listed copyright-free photo sources for each lesson topic (`docs/research/photo-sources.md`): Wikimedia Commons works well for tower types, fake trees, small cells and US sites. There are big gaps for equipment brands and site signs, so those will need your own photos later or Claude's drawings. | 2026-10-31 |
| T25 | The robot's launcher had paused itself, taking quick restarts for a runaway loop. Fixed: close firings are expected, and a safety limit allows at most 6 runs an hour. | 2026-10-31 |
| T24 | Answered: effort follows the model (measured Haiku Low, Sonnet Medium), so the robot moves up a model size after a failed try; it restarts after your limit, picks up crashed work right away, and pings you when it's waiting for your approval. | 2026-10-31 |
| T23 | Tested whether the panel can read the project live: it can't (there is no GitHub connector). The panel stays a snapshot, and chats now refresh it at the end of each task. | 2026-10-31 |
| T18 | Built the progress panel: a clean private page showing the levels, what Claude is doing, what waits for you, and recent work. First version is a snapshot Claude refreshes (`panel/`). | 2026-10-31 |
| T20 | You answered: yes, a pop-up once asked to approve opening a new chat (so the permission file gets a few more lines: task T21), and yes to deleting the old paused alarm (done). You also said what the progress panel should be. | 2026-10-31 |
| T13 | Switched on the 24/7 robot. The plan's first recipe failed the test (a chat started by the alarm gets no copy of your project), so the alarm now wakes a small "Robot launcher" chat that starts each robot run with the project attached. Tested end to end. | 2026-10-31 |
| T19 | Rules for a robot that works 24/7 until your plan's limit, with `Stop the robot` / `Start the robot`, and the right model and effort for each task (`docs/WORKFLOW.md` section G) | 2026-10-31 |
| T11 | You answered the panel plan's questions: robot twice a day, restart work plus safe tasks, panel built now, pause by typing `Pause the robot` (answers at the top of `docs/panel-plan.md`) | 2026-10-31 |
| T17 | Claude now says the effort level along with the model, like "Opus, High effort" | 2026-10-31 |
| T16 | You added the permission file, so the safety check won't stop chats from putting old chats away or merging their work | 2026-10-31 |
| T15 | Old chats now put themselves away: when a chat starts a task, it archives this project's older chats (`docs/WORKFLOW.md`, rule 5). | 2026-10-31 |
| T14 | Fixed how chats share work: a start-up check, a "busy" sign, and Claude merging its own work (`docs/WORKFLOW.md`). Closed the 3 duplicate T03 pull requests and saved their extra findings. | 2026-10-31 |
| T03 | Checked your 6 other projects for reusable material; findings in `docs/reuse-review.md` | 2026-10-31 |
| T01 | Set up this binder: start page, roadmap, tasks, glossary, cheat sheet, memory card, research | 2026-10-31 |
