# Handoff note: 2026-11-04, T58 plan the graphic redesign

**Status:** DONE
**Model used:** Large (Opus), High effort · **Branch / pull request:** `claude/cool-pasteur-jaimdf` / [#123](https://github.com/Lukasmajukas/cellular-learning-app/pull/123)

## In simple words (for the owner)
We planned the app's big makeover together. Claude drew three possible looks; you picked **Night Signal** (dark and glowing, like a radio screen at night) and **Beacon**, a glowing tower mascot. You chose to let the robot build it by itself, nonstop, and then keep improving it, so the plan has 24 small sessions, a rulebook every session follows, and an ideas board for afterwards. You signed it off, so the robot starts with session R01 (new colours and letters) at its next run.

## What was done
- Start-up: 🟢 (nothing open). Claimed with #123. Archived 2 old chats ("Go" and "Session setup").
- Read the app's code and took 7 "before" screenshots of the real Electron app at the owner's window size (620 × 960): `docs/redesign/gallery/before/`.
- Findings: the app uses **Duolingo's exact colours** (`#58CC02`, `#1CB0F6`, `#FF9600`, `#CE82FF`, `#D7FFB8`, `#FFDFE0` in `main.tsx`, `PathMap.tsx`, `LessonPlayer.tsx`), against the 2026-10-31 decision; the **keys 1–4 / Enter** promised in PRD 4e were never built; emoji icons look different on each operating system; dark mode leaves the daily-review button light grey.
- Asked the owner 9 questions in three rounds (answers in `docs/redesign/PLAN.md`, "Your choices"). Pointed out the clash between "3 a week" / "can't rush it" and "robot runs them, never wait"; the owner explained ("I want it to just keep improving and make more designs") and kept nonstop.
- Drew 3 looks as HTML mockups (path map + a wrong-answer question + mascot with two faces + colours + letters + motion notes), rendered them, fixed overlaps and faces after looking, and showed them: `docs/redesign/looks/` (source `looks.html`, pictures as WebP).
- Wrote `docs/redesign/PLAN.md` (choices, 24 sessions, checklist, design reviews, risks, the "Redesign switch"), `docs/redesign/DESIGN.md` (the style guide), `docs/redesign/IDEAS.md` (7 seed ideas), `docs/redesign/gallery/README.md`, PRD section 12 (what the redesign changes in the plan, as a table). The owner typed **"I sign off the redesign plan"**; the sign-off is written in PLAN.md, DESIGN.md and the PRD.
- Updated: `TASKS.md` (T58 done; T59 the redesign; T60 the alarm-message problem), `docs/WORKFLOW.md` (section 6 bullet; G3 rule for T59; owner commands `Pause the redesign` / `Resume the redesign`), `CLAUDE.md` (model table, robot line, where things are), `ROADMAP.md` and `README.md` (Level 5 renamed "Redesign" and started; the "you are here" marker stays at Level 4 because the owner hasn't called Level 4 done), `docs/redesign-brief.md` (marked replaced), `docs/DECISIONS.md` (7 rows; the earlier "slow program" row marked as changed), `GLOSSARY.md` (9 words), `docs/PROGRESS-LOG.md`.
- No app code changed.

## What's next
- The robot: T59 session R01 (paint and letters), Large (Opus), High effort. It starts by itself at the next hourly heartbeat (about :33 past the hour).
- The owner: T60 (paste the heartbeat message into the launcher chat again; until then, no `/clear` there). T57 step 1 (screenshots of the start-up picture) when convenient.
- For a chat the owner starts: `Robot status`, or T57/T60 (Medium or Small).

## Decisions made (also added to docs/DECISIONS.md)
- Look A "Night Signal" and mascot Beacon; style guide `docs/redesign/DESIGN.md`.
- The robot runs the redesign nonstop and decides alone; PRD 8's "nothing moves on until you've said so" doesn't apply to the redesign; design reviews at R08, R16, R24, then every 8th chat.
- One TASKS row (T59) with sessions in PLAN.md; a "Redesign switch" for pause/resume; failed-twice per session.
- CC0 sound effects (code-made fallback); Mac/iPhone carry-over design, Windows-only builds.
- R01 removes the Duolingo colours and R02 the emoji, each with a test; frame-rate bar 50 fps in the cloud.

## Questions for the owner
- None blocking. T60 needs your paste in the launcher chat.

## New words (also added to GLOSSARY.md)
- Style guide, design tokens, mockup, font licence (OFL), spring (animation), contrast, gallery, ideas board, design review.

## Notes for the next Claude
- **R01 should start by building the gallery tool**, because every later session's checklist needs it. My throwaway screenshot script (not in the repo) launched Electron with `_electron.launch({ cwd: 'app', args: ['.', '--no-sandbox'], env: { CELL_SAMPLE_PATH: '', CELL_DATA_DIR: <temp dir> } })`, resized with `app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setSize(620, 960))`, and needed `xvfb-run -a`. The first Electron launch in a fresh container downloads the Electron binary (takes a minute).
- The mockup `docs/redesign/looks/looks.html` loads Google Fonts from the internet (fine for a mockup); the app must bundle its fonts (`@fontsource/space-grotesk`, `@fontsource/jetbrains-mono` from npm worked from the cloud).
- The look A colours in `DESIGN.md` were checked by hand for contrast (`text-muted` on `surface` ≈ 6.6:1); the Day colours are only starting values: R20's contrast test decides.
- `kenney.nl` answers 403 from the cloud and `github.com/KenneyNL` too; `opengameart.org` answered 200 (R19).
- The "Robot" alarm (`trig_01RH9EsLZizd6JyPGw7NVSEc`) still has the old one-line prompt (from `list_triggers`, 2026-11-04 02:50 UTC) although T51 is ticked; only the launcher chat can change it (WORKFLOW G, setup step 6). That's T60.
- Usage: weekly limit at "allowed_warning", resetting Wednesdays 10:00 UTC. The previous Opus chat ("Session setup") cost about $10.50.
- Panel: republished from this chat (see the pull request), or noted below if it failed.
