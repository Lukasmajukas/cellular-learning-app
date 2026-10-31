# 🧭 Decisions

Every decision, with the date and why. Newest at the bottom.

| Date | Decision | Why |
|---|---|---|
| 2026-10-31 | Personal hobby app, not for sale | Owner's choice |
| 2026-10-31 | Cross-platform desktop app (Windows/Mac/Linux) | Owner's choice |
| 2026-10-31 | US bands only; Wikipedia's global tables used only as a cross-check | Owner's choice |
| 2026-10-31 | Research, then plan (PRD) sign-off, then build; no code before sign-off | Owner's working rule |
| 2026-10-31 | Original radio/tower look; nothing copied from Duolingo (name, owl, green, art, sounds) | Copying the look and feel is the legal risk (*Tetris v. Xio*); the mechanics themselves are free to use |
| 2026-10-31 | Images: copyright-free photos plus Claude-drawn diagrams; no AI-generated equipment photos for identification questions | Owner has no photos; AI image generators invent equipment details |
| 2026-10-31 | One GitHub repo as the project binder; one task per chat; a branch and pull request for every change | Long chats use more of the limit and lose detail |
| 2026-10-31 | Claude must say when to start a fresh chat or a new branch | Owner's request |
| 2026-10-31 | Model guide by size (Small/Medium/Large/Extra large): Sonnet by default, Opus for thinking jobs, Haiku for chores, Fable only when stuck | Balances cost and capability, and stays valid when new versions come out |
| 2026-10-31 | App engine still open; Electron is favored over Tauri (the research report's pick). Decide in the PRD. | Owner has no coding background, and Electron behaves the same everywhere |
| 2026-10-31 | Repository: `Lukasmajukas/cellular-learning-app` (private; working name) | Owner created it |
| 2026-10-31 | Everything is explained like the owner is 12; new words go in `GLOSSARY.md` | Owner's request |
| 2026-10-31 | Owner's main computer is a Windows PC (confirm whether Mac/Linux is also used). On Windows, Tauri also uses a Chromium engine, so both app engines are viable. | Seen in the owner's Remote Control computer list |
| 2026-10-31 | Build for Windows first; keep a Mac version possible. The owner will use a Mac and an iPhone 15 Pro again later. | Owner's answer (T02): the Mac and iPhone are in use elsewhere for now |
| 2026-10-31 | South Hadley / Western MA sites (from SpectrumScope) may be used in lessons | Owner's answer (T02) |
| 2026-10-31 | `cellatlas-data` is on the owner's Mac; review it when the Mac is back (T12) | Owner's answer (T02) |
| 2026-10-31 | Progress panel: a separate small web page (not part of the app) for phone and PC. It reads the repo's live files, costs no Claude tokens to view, and shows when it's pulling data. Planned in T11. | Owner's request |
| 2026-10-31 | Automation wanted: a self-refreshing panel, Claude running tasks on a schedule (with guard rails), and carrier-fact re-checks every 3 months. Details and sign-off in T11. | Owner's request; scheduled runs use tokens and must not pile up unreviewed pull requests |
| 2026-10-31 | Claude merges its own pull request at the end of every chat. The owner never has to open GitHub; approvals (plan sign-off, "it works") are typed in chat. | Owner's choice. Waiting for the owner to merge is what let 4 chats redo T03. |
| 2026-10-31 | Every chat runs a start-up check (the traffic light in `docs/WORKFLOW.md`) and claims its task with an "[in progress]" pull request before any work. A chat counts as busy if it saved in the last 2 hours or is running; a quiet one gets taken over. | Stops two chats doing the same task |
| 2026-10-31 | Chats always start from the newest `main`, even if a different branch was picked when the chat started | The owner was worried about clicking the wrong branch |
| 2026-10-31 | Pull requests are squash-merged (one save point per task), and none is left open waiting for the owner. Drafts are merged with "Status: DRAFT" inside the file. | An open pull request now means only "a chat is working"; one save point per task makes "undo" one step |
| 2026-10-31 | No move to a claude.ai project or anywhere else. The repo stays the one binder. The progress panel (T13) will show the traffic light, but the rules above are what prevent overlap. | Chats would still start from the same files and still collide; moving only moves the problem |
| 2026-10-31 | Pull requests #2, #3 and #4 (duplicate T03 reviews) closed without merging; their extra findings saved in `docs/reuse-review.md`. Pull request #6 (the T11 plan) merged as a DRAFT plan; T11 still needs the owner's answers. | Clean-up of the overlap |
| 2026-10-31 | Dropped the "From your own phone" log-import idea. Skip the `claude-projects` and `LinkBond` repos. The finished app will mostly be used on the PC. | Owner's answers, recorded only in closed pull request #4 |
| 2026-10-31 | Where two chats heard different answers, the latest answer stands: the Mac comes later, and `cellatlas-data` is on the Mac | Rule for conflicting answers: the newest one wins |
| 2026-10-31 | When a chat starts a task, it archives this project's older chats. It never archives a chat that is working, belongs to another project, or is named in an open "[in progress]" pull request. | Owner's request: keep the chat list short without clicking |
| 2026-10-31 | Claude never adds permissions to itself. The optional permission file (`.claude/settings.json`) is the owner's choice, added from a link in `docs/WORKFLOW.md`. | The safety check blocked Claude from writing it, and blocked 2 of 5 archives when there was no such file |
| 2026-10-31 | Whenever Claude names a model, it names the effort too: Small with Low, Medium with Medium, Large and Extra large with High. One step higher (Extra high) only after a failed try; Max only if that fails too. | Owner's request |
| 2026-10-31 | The owner added the permission file `.claude/settings.json` (task T16) | Owner's choice |
| 2026-10-31 | Chats wait for a usage limit to reset and then carry on by themselves (`autoContinueAtUsageLimit` in `.claude/settings.json`) | Owner's request: restart after usage limits |
| 2026-10-31 | Robot: a scheduled chat twice a day at about 2 AM and 2 PM US Eastern. It restarts unfinished work and does safe tasks: Claude-only, Small or Medium, not needing the owner, not app code, never the app plan. Phone notification after each run. Pause by typing `Pause the robot`. No practice week. Rules in `docs/WORKFLOW.md` section G. | Owner's answers |
| 2026-10-31 | The progress panel may be built before the app plan is signed off. It lives in this project (a `panel/` folder); no new repository. | Owner's answer; one project keeps chats from getting confused |
| 2026-10-31 | Time zone for schedules: US Eastern | Inferred from the owner's GitHub change (stamped −04:00) and South Hadley; the owner can correct it |
| 2026-10-31 | T08 (photo sources) and T09 (carrier codes) moved before the plan sign-off: they're research lists, not app code, so the robot may do them | Lets the robot do useful work while the owner is away |
