# Handoff note: cellular learning app (session 1: research)

**Date:** 2026-10-31
**Next step:** set up the GitHub project "binder", then draft the PRD in a fresh session on Opus 5.5.

---

## What we're building
A personal, Duolingo-style desktop app (Windows/Mac/Linux) with learning paths, short lessons, XP and streaks, and smooth animations. It teaches:
1. **US LTE and 5G bands:** frequencies, FDD/TDD, and which carrier uses which.
2. **Cell identification:**
   - site types (tower spotting)
   - equipment vendors and models
   - which carrier runs a site
   - logical cell types (macro/small/femto, sectors, eNB/gNB IDs, PCI, ARFCN)

## Decisions so far
| Decision | Choice |
|---|---|
| Audience | The owner only (personal hobby use, not sold) |
| Platform | Cross-platform desktop app |
| Band scope | US only; Wikipedia's global band tables used only as a cross-check |
| Process | Research report (done), then PRD for sign-off, then build. **No code before PRD sign-off.** |
| Look and feel | Original radio/tower theme; not Duolingo's owl, green, name, art or sounds |

## About the owner (answers given 2026-10-31)
- **Coding:** none. Claude writes and tests all the code; the owner decides what they want and tries each version.
- **RF knowledge:** knows the band names n25, n41, n66, n71, n77, n258, n260 and n261, and the low/mid/high band idea, but not frequency ranges or details. Start at beginner level, anchored on those 8 bands.
- **Photos:** has none.
  - Use copyright-free photos (Wikimedia Commons, Flickr Creative Commons; credit them in the app), plus diagrams drawn by Claude.
  - No AI-generated equipment photos for identification questions: image generators invent antenna shapes and logos. AI art only for decoration.

## Where everything is
- **Research report:** `reports/Cellular learning app research.md` (also sent to the owner)
- **Research notes**, in `research_notes/Cellular learning app research/`:
  - `us_bands.md`
  - `band_verification.md`, which overrides `us_bands.md` for band values
  - `sites_and_carriers.md`
  - `vendors_and_cells.md`
  - `learning_design.md`
  - `tech_stack.md`
- **Warning:** these files live on a temporary cloud computer. Move them into the GitHub repo. A backup zip was sent to the owner.

## Key findings (short version)
- **Feasible.** Estimate: ~115–220 hours of engineering plus 30–80 hours of content. The estimate assumed a TypeScript-fluent builder. With Claude coding, the owner's time goes into reviewing and testing.
- **Stack in the report:** Tauri 2 + React + Motion (animations) + Rive (mascot) + ts-fsrs (spaced repetition) + SQLite. Flutter is the runner-up.
  - **Reconsider in the PRD:** Electron may fit better now that Claude builds and tests everything. It uses the same Chromium engine on every OS, the same one Claude can test in the cloud. The choice depends on the owner's computer(s).
- **Band frequencies:** 52 of 53 rows match Wikipedia's 3GPP Release 19 tables. B252/B255 were corrected to satellite bands. Not yet checked against the 3GPP documents directly.
- **Biggest risk: stale carrier facts.** These changed repeatedly in 2025–26 (Boost onto AT&T, AT&T bought EchoStar spectrum, T-Mobile sold 800 MHz).
  - Fix: keep one dated, sourced bands data file.
  - Teach the order of evidence: carrier sticker, then permit filing, then the radio's band label, then the brand.
- **Learning design:** FSRS spaced recall for facts, plus many short photo drills for identification. Keep path, streak and XP; drop hearts/energy and leagues.
- **Price confirmed:** the Haiku 5.5 price in the report ($0.10/$0.50 per million tokens, prompts ≤100K) matches Anthropic's pricing table (cached 2026-10-06).

## Proposed way of working (DRAFT, awaiting the owner's OK)
1. **One GitHub repo is the project "binder"**, the permanent home. It contains:
   - `CLAUDE.md`: the memory card every session reads
   - `TASKS.md`: ordered to-do list, with a model per task
   - `docs/`: PRD, decision log, research, session handoff notes
   - later, `content/` (band data, lessons) and `app/` (code)
2. **One task = one fresh session.** Claude starts each one by reading `CLAUDE.md` and `TASKS.md`, and ends by writing a handoff note and ticking the task.
3. **Branch + pull request for every change.** The owner tries the test version and says "merge" only when happy.
4. **Start a new chat** for each new task, when a chat runs long, or when Claude forgets a decision. Ask for a handoff note first.

## Model guide (draft)
| Model | Use for | Price vs Sonnet |
|---|---|---|
| Haiku 5.5 | Chores: typos, renaming, reformatting | ~1/20× |
| Sonnet 5.5 | Most building: features, lessons from checked data, ordinary bugs | 1× |
| Opus 5.5 | Thinking jobs: PRD, curriculum design, reviews, bugs Sonnet couldn't fix in 2 tries | 2× |
| Fable 5.1 | Rarely: only when Opus is stuck on something hard | 5× |

Rule: start on Sonnet, move up when stuck, move down for chores. Helper agents run on Sonnet or Haiku unless a task needs more. Big multi-agent research only when truly needed: session 1's research used well over a million tokens.

## Open threads
1. The owner approves or changes the way of working above.
2. GitHub setup:
   - owner: create an account and an empty private repo, then connect it at https://claude.ai/connect-github (install the Claude GitHub App on the repo);
   - Claude: push this note plus all research into it.
3. Owner's computer(s): Windows, Mac or Linux? This affects the stack choice and testing.
4. App name: original, not "-lingo".
5. **Next:** draft the PRD (Opus 5.5) in a fresh session.
6. Later checks:
   - band values against the 3GPP PDFs (TS 36.101 / 38.101-1)
   - spot-check the deal dates and dollar figures
   - build a vendor visual guide from FCC filing photos
   - make a list of photo sources

## Update (later on 2026-10-31)
- **Way of working approved.** The owner approved it and asked Claude to set up the binder.
- **New must-rule:** Claude tells the owner when to start a fresh chat or a new branch. It's now in `CLAUDE.md`.
- **GitHub account:** Lukasmajukas.
  - Sessions can't create repositories, so the owner creates `cellular-learning-app` (private, with a README) on github.com.
  - Claude then pushes this binder on a branch and opens a draft pull request.
- **Related repos to review for reuse before the PRD (task T03):** CellAtlas, bandmon, SpectrumScope, TowerScope, NetScopeiOS, NetScopeMac.
- **Still open (T02):** the owner's computer(s) and an app name.

## Update 2 (end of session 1)
- **Repository:** the owner created `Lukasmajukas/cellular-learning-app` (private). Claude pushed the binder on branch `setup/project-binder` with a draft pull request.
- **New rule: explain everything like the owner is 12.** It's in `CLAUDE.md`, and new words go in `GLOSSARY.md`.
- **Owner's main computer: Windows PC.** This was seen in their Remote Control list; whether they also use a Mac or Linux is still to confirm (T02).
  - On Windows, Tauri also uses a Chromium engine (WebView2), so both Electron and Tauri are viable. Decide in the PRD.
- **Added for the long haul:**
  - `ROADMAP.md` (levels)
  - `GLOSSARY.md`
  - `CHEATSHEET.md` (copy-paste prompts)
  - `docs/PROGRESS-LOG.md` (diary)
  - `docs/sessions/TEMPLATE.md`
  - a PR template
  - `.gitignore`
  - placeholder `content/` and `app/` folders
- **Next:** T03, the reuse review of the owner's other repos, in a fresh chat on Sonnet.
