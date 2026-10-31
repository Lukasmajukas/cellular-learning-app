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
| 2026-10-31 | The robot works 24/7 until the plan's limit, replacing twice a day. Each robot chat starts the next one (the chain), and a scheduled check every 2 hours restarts it if it stopped (the heartbeat). | Owner's request: work while awake and asleep |
| 2026-10-31 | Robot chats run on Sonnet. Small tasks go to a new Haiku chat and Large tasks to a new Opus chat (`create_session`). Effort follows the model through `modelSettings` in `.claude/settings.json`: Haiku Low, Sonnet Medium, Opus High. | Owner's request and answer: the model table |
| 2026-10-31 | The robot never uses paid extra usage. It stops when `isUsingOverage` is true and resumes after the plan's limit resets. | Owner's answer |
| 2026-10-31 | The robot may draft the app plan. It builds the app only after `docs/PRD.md` has a "Signed off by owner" line, which the owner adds by typing `I sign off the plan`. | Owner's answer |
| 2026-10-31 | The owner controls the robot from any chat or device: `Stop the robot`, `Start the robot`, `Robot status` | Owner's request: a simple way to stop and resume |
| 2026-10-31 | Everything runs in the cloud, so the owner's PC can be off. The PC is only needed later to try the app. | Owner's question |
| 2026-10-31 | The robot's 2-hour alarm wakes a small permanent chat, the Robot launcher, which starts each robot run with `create_session`. The first design (the alarm starts the robot chat directly) was built and tested, and failed: a chat started that way gets no project, no GitHub tools and no chat tools. | T13 test. A chat started with `create_session` gets all of them (tested end to end). |
| 2026-10-31 | The first alarm is paused and renamed "Robot (old, paused: no project attached)", not deleted. Asking the owner in T20. | Nothing is deleted without the owner's OK; it's harmless while paused |
| 2026-10-31 | Bypass permissions can't be turned on in cloud chats (it isn't offered, and settings files can't turn it on). Auto mode is the hands-free setting. Single actions are allowed through `permissions.allow` in `.claude/settings.json`, which only the owner adds. | The owner asked for bypass mode to get hands-free; Claude's documentation says it isn't available |
| 2026-10-31 | Robot chats send their own phone notification (with `PushNotification`) when they did a job or got stuck, not for "Another chat is working" or "Nothing for me to do". This changes "a notification after each run". The owner can ask for one every run. | An alarm that wakes an existing chat can't send notifications by itself, and empty runs every 2 hours would be noise |
| 2026-10-31 | The owner wants the robot hands-free and running around the clock, using the whole usage limit. An approval pop-up for "opening a new chat" did appear in a chat the owner was watching. The fix is to allow `create_session` and a few other robot actions in `.claude/settings.json`, which only the owner can add (task T21). | Owner's answer (T20) |
| 2026-10-31 | The old paused alarm was deleted, along with its two empty test chats | Owner said yes (T20) |
| 2026-10-31 | The progress panel is a separate app, connected to the project: clean, app-like, plain words, no task numbers. It's a private claude.ai page, pinned like an app. Details at the top of `docs/panel-plan.md`. | Owner's wishes |
| 2026-10-31 | The robot only uses the usage limit while it has tasks it's allowed to do. When none are left it waits ("Nothing for me to do"). More robot-safe tasks, and the plan sign-off that lets it build the app, keep it busy. | Told to the owner, who wants the whole limit used |
| 2026-10-31 | No force-pushes: the safety check blocks them. If the old copy of a branch is still on GitHub, merge it into the fresh branch instead. | The safety check refused `git push --force-with-lease` during T20 |
| 2026-10-31 | Panel v1 is a snapshot: `panel/build.py` bakes the project's files into the page, which says "as of <time>". The live-connector route couldn't be tested from a cloud chat (task T23). | T18 |
| 2026-10-31 | The panel stays a snapshot. No GitHub connector exists, and the `files` route needs a project id the robot can't see. Chats refresh it at the end (WORKFLOW section C, 2a). | T23 |
