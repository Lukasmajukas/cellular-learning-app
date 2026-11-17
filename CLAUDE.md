# CLAUDE.md: read this first, every session

## The project
A personal, Duolingo-style desktop app with smooth animations, learning paths and short lessons. Personal use only. It teaches the owner:
1. **US LTE and 5G bands:** frequencies, FDD/TDD, and which carrier uses which.
2. **Cell identification:**
   - site types
   - equipment vendors and models
   - which carrier runs a site
   - logical cell types (macro/small/femto, sectors, eNB/gNB IDs, PCI, ARFCN)

Phases and status are in `ROADMAP.md`; the next work is in `TASKS.md`.

## The owner
- **No coding background.** Claude writes and tests all the code.
- **Explain everything like the owner is 12:** short sentences, everyday comparisons, no jargon left unexplained. When a new technical word comes up, add it to `GLOSSARY.md`.
- **Computers:** a Windows PC now. A Mac and an iPhone 15 Pro later (in use elsewhere for now). Build for Windows first; keep a Mac version possible.
- **RF level:** knows the band names n25, n41, n66, n71, n77, n258, n260, n261 and the low/mid/high idea. Lessons start at beginner level.
- **Images:** the owner has no photos.
  - Use copyright-free images (Wikimedia Commons, Flickr Creative Commons) with credits, plus diagrams Claude draws.
  - Never use AI-generated photos for identification questions.

## MUST: say when it's time for a fresh chat or a new branch
Say it plainly, starting with "Time for a fresh chat:" or "Time for a new branch:", when:
- a task is done, or the work switches to a different kind of task;
- the chat has gone long (about 20+ back-and-forth messages, or several big files or long outputs read);
- the chat has been summarized, or you notice you forgot a decision or repeated a mistake;
- a change deserves its own branch (a new feature, a new content unit).

Before the owner switches, do the end-of-session steps below, including merging your pull request. Then tell them which model and effort to pick, and exactly what to type.

## Every session
How chats share work without overlapping is in `docs/WORKFLOW.md`. Follow its "Rules for Claude" exactly. The one exception: the chat titled "Robot launcher (do not archive)" skips this whole section and follows only its launcher prompt (`docs/WORKFLOW.md` section G).

**Start (before any other work):**
1. Read this file, `TASKS.md`, and the newest note in `docs/sessions/` (latest date, then highest session number).
2. Run the start-up check in `docs/WORKFLOW.md` (section A): get the newest `main`, read the traffic light, claim the task with an `[in progress]` pull request, then archive this project's old chats. If another chat is busy, stop and tell the owner.

**Work:**
- One task per chat. If the owner types just `Go`, it means `Do the next task in TASKS.md`.
- Never push straight to `main`. Work reaches `main` only when you merge this chat's own pull request.
- Never leave a pull request waiting for the owner. Owner approvals (sign-offs, "it works") happen in chat.
- Confirm before anything destructive.
- No app code until the owner signs off on `docs/PRD.md`. The progress panel and the robot aren't app code; the owner OK'd building them now.
- The robot (chats that start by themselves, 24/7) follows `docs/WORKFLOW.md` section G. The owner controls it with `Stop the robot`, `Start the robot` and `Robot status`, and the redesign with `Pause the redesign` and `Resume the redesign`.

**End (always, in this order):**
1. Finish the handoff note you started in `docs/sessions/` when you claimed the task. Set its Status to DONE.
2. Add one plain-English line at the top of `docs/PROGRESS-LOG.md`.
3. Tick or add tasks in `TASKS.md`. If a level changed, move the "you are here" marker in `ROADMAP.md` and `README.md`.
4. Add new decisions to `docs/DECISIONS.md` and new words to `GLOSSARY.md`.
5. Commit, push, update the pull request (template: simple words, plus "how to check it"), then **merge it yourself** (squash), as in `docs/WORKFLOW.md` section C.
6. Tell the owner what changed and anything you need from them.

## The robot: what the owner approved
The owner typed this in chat on 2026-11-01 (task T44), word for word:
> I approve this for my robot, any time of day: the "Robot launcher (do not archive)" chat may start one "Robot run" chat (create_session for Lukasmajukas/cellular-learning-app, Sonnet, Auto mode) each time it gets a message, even minutes after the last one, at most 6 an hour. Robot runs may start the next run (fire_trigger on "Robot"), hand a task to one new Haiku or Opus chat (create_session, same repository), and archive themselves and this project's finished robot chats (archive_session).

## Models and effort: pick by size (versions change, sizes don't)
| Size | Current model | Effort | Use for |
|---|---|---|---|
| Small | Haiku 5.5 | Low | Chores: typos, renames, formatting |
| Medium (default) | Sonnet 5.5 | Medium | Features, lessons from checked data, normal bugs |
| Large | Opus 5.5 | High | Planning (PRD), curriculum design, reviews, the redesign sessions (T59), bugs Sonnet failed twice |
| Extra large | Fable 5.2 | High | Only when Opus is stuck |

- Whenever you name a model for the owner, name the effort with it, like "Opus, High effort". Use the table. Go one step higher (Extra high) only after a failed try; Max only if Extra high failed too.
- Run helper agents on Small or Medium unless a task needs more.
- No multi-agent research without the owner's OK: it burns their limit.
- When newer models ship, update this table and `README.md` by size.

## Facts discipline
- Band frequencies and carrier assignments come only from the bands data file in `content/` (to be built from `docs/research/notes/band_verification.md`). Never from memory.
- Every carrier/band fact has:
  - a status: CURRENT, HISTORICAL, PENDING, PLANNED or UNVERIFIED;
  - an as-of date;
  - a source.
- Re-check carrier facts every 3 months (the "Keep it fresh" level in `ROADMAP.md`).

## Where things are
- **For the owner:** `README.md` (their start page), `ROADMAP.md`, `TASKS.md`, `CHEATSHEET.md`, `GLOSSARY.md`
- **How chats share work:** `docs/WORKFLOW.md`
- **Logs:** `docs/PROGRESS-LOG.md`, `docs/DECISIONS.md`, `docs/sessions/`
- **Redesign:** `docs/redesign/` (the plan, the style guide `DESIGN.md`, the ideas board, the gallery)
- **Research:** `docs/research/`, the report and notes. `band_verification.md` overrides `us_bands.md`.
- **The app:** `content/` (facts and lessons), `app/` (code), `update-server/` (the Cloudflare front door for the app's self-update; how it all works: `docs/updates.md`)
- **Owner's other GitHub repos to check for reuse (task T03):** CellAtlas, bandmon, SpectrumScope, TowerScope, NetScopeiOS, NetScopeMac.

Keep this file short (under about 100 lines). Put details in the docs above.
