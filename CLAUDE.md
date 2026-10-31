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

Before the owner switches, do the end-of-session steps below. Then tell them which model to pick and exactly what to type.

## Every session
**Start:** read this file, `TASKS.md`, and the newest note in `docs/sessions/`.

**Work:**
- One task per session.
- All changes go on a branch with a draft pull request. Never push to `main`; the owner merges.
- Confirm before anything destructive.
- No app code until the owner signs off on `docs/PRD.md`.

**End (always, in this order):**
1. Write a handoff note in `docs/sessions/` (copy `docs/sessions/TEMPLATE.md`).
2. Add one plain-English line at the top of `docs/PROGRESS-LOG.md`.
3. Tick or add tasks in `TASKS.md`. If a level changed, move the "you are here" marker in `ROADMAP.md` and `README.md`.
4. Add new decisions to `docs/DECISIONS.md` and new words to `GLOSSARY.md`.
5. Commit, push, and open or update the pull request using the template: simple words, plus "how to check it" steps.

## Models: pick by size (versions change, sizes don't)
| Size | Current model | Use for |
|---|---|---|
| Small | Haiku 5.5 | Chores: typos, renames, formatting |
| Medium (default) | Sonnet 5.5 | Features, lessons from checked data, normal bugs |
| Large | Opus 5.5 | Planning (PRD), curriculum design, reviews, bugs Sonnet failed twice |
| Extra large | Fable 5.1 | Only when Opus is stuck |

- Tell the owner which size each task needs.
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
- **Logs:** `docs/PROGRESS-LOG.md`, `docs/DECISIONS.md`, `docs/sessions/`
- **Research:** `docs/research/`, the report and notes. `band_verification.md` overrides `us_bands.md`.
- **Later:** `content/` (facts and lessons), `app/` (code)
- **Owner's other GitHub repos to check for reuse (task T03):** CellAtlas, bandmon, SpectrumScope, TowerScope, NetScopeiOS, NetScopeMac.

Keep this file short (under about 100 lines). Put details in the docs above.
