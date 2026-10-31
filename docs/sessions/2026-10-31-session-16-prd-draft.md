# Handoff note: 2026-10-31, T04 Write the plan (PRD) first draft

**Status:** DONE (first draft; the owner's sign-off is still needed)
**Model used:** Large (Opus), High effort · **Branch / pull request:** `claude/t04-prd`, #19 (claimed by a robot run, handed to this Opus worker)

## In simple words (for the owner)
I wrote the blueprint for your app (`docs/PRD.md`). It says what the app will teach, how we'll know it works, what's left out on purpose, and the order we'll build it in. It recommends Electron as the app engine, so what I test in the cloud is exactly what runs on your PC. Your job: read it, ask for changes, then type `I sign off the plan`.

## What was done
- Took over PR #19 from the robot run that claimed T04 (🟡 takeover, as instructed).
- Read the research report, the reuse review, the decisions log, and the tech-stack notes' Windows/signing parts.
- Wrote `docs/PRD.md` (Status: DRAFT): problem, who it's for, 12 success criteria with checks, scope (10 units + bonus field trip, question types, reviews, fun layer, look, settings, out-of-scope list), content and facts design, engine choice (Electron) with building blocks, constraints, building plan v0.1 → v1.0, 7 open questions with suggested answers, risks, and a table of what changed from the research.
- `TASKS.md`: T04 is now a "You" row at the top (read and sign off); T05 reworded for Electron; added T28–T37 (the building plan) under "After you sign off".
- Added 6 decisions (all marked "plan draft") and 7 glossary words.
- Checked that this cloud computer has Xvfb and Node 22, so Electron can probably be run and screenshotted here (to prove in T05).
- Approvals/blocks: nothing asked for approval; nothing blocked. Panel not republished: waiting for T21 (`panel/live.json` and `panel/index.html` refreshed in the repo).

## What's next
- Next task: T04 sign-off by the owner (You). After that: T05, Medium (Sonnet), Medium effort, type: `Do the next task in TASKS.md`.
- Until the sign-off, the robot can do T27 / T06 / T07 only if they fit section G step 3 (T27 and T07 need network access; T06 is in the "after sign-off" table).

## Decisions made (also added to docs/DECISIONS.md)
- Electron over Tauri (recommended, pending sign-off).
- UNVERIFIED facts never quiz answers; a checker enforces it.
- Claude-drawn SVG mascot, not Rive.
- JSON save file with daily backups, not SQLite.
- Unsigned installer, manual updates.
- Build order and tasks T28–T37.

## Questions for the owner
The 7 questions in `docs/PRD.md` section 9: app name (T02), Electron OK, mascot, daily reminder, lesson length, unsigned installer, unit order.

## New words (also added to GLOSSARY.md)
- Browser engine (Chromium), TypeScript / React, Code signing, Save file (JSON), Checker (schema), Automatic test, SVG

## Notes for the next Claude
- The PRD disagrees with the research report on purpose in 6 places; they're listed in PRD section 11, so don't "fix" them back to the research.
- `I sign off the plan` → add `Signed off by owner: YYYY-MM-DD` to `docs/PRD.md` (replace the HTML comment near the top) and merge (WORKFLOW section G, owner commands). If the owner answers section 9 differently, update the PRD, `DECISIONS.md` and the T28–T37 rows first.
- T05 should verify: Electron downloads through the proxy, Playwright's `_electron` launch works under `xvfb-run`, and a `windows-latest` GitHub Actions job can build and smoke-test the installer. GitHub Actions on a private repo uses free minutes (Windows counts double).
- Licences named in the PRD (Electron, Forge, React, Vite, Motion, canvas-confetti, ts-fsrs, Zod, Vitest, Playwright) are from memory; T05 should confirm each from its package.
