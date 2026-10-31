# Handoff note: 2026-10-31, T05 test build (v0.1)

**Status:** DRAFT (cloud tests pass; the owner has not tried the installer yet)
**Model used:** Medium, Medium effort (robot) · **Branch:** `claude/robot-t05-test-build`

## In simple words (for the owner)
I built a tiny practice version of the app: one lesson with 3 sample questions. The buttons bounce, confetti pops when you get one right, it beeps, and a little tower waves. The questions are just samples, not real facts. I tested it in the cloud, and GitHub makes a Windows installer for you to try.

## What was done
- `app/`: Electron + React + TypeScript (Vite), Motion springs, canvas-confetti, Web Audio beep, SVG mascot.
- Tests: Vitest (3 passing) and a Playwright click-through of the real Electron app under a virtual screen (passes; screenshots checked).
- `.github/workflows/app-build.yml`: on Windows runs tests, the click test, `electron-forge make` (Squirrel installer + zip), and uploads `windows-installer` and `screenshots`.
- Licence check of the building blocks (T05's other duty): all MIT/ISC/Apache as in PRD section 6 (npm packages used: electron, react, motion, canvas-confetti, vite, vitest, playwright).

## What's next
- T40 (owner tries the installer). Then T06 (bands data file), Medium.

## Decisions made (also added to docs/DECISIONS.md)
- None new.

## Questions for the owner
- T40: install and say if it feels smooth.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
The Windows CI job had NOT started after the push (no workflow runs listed; Actions may be off or needs a first approval for new workflows). Next Claude: check `actions_list` after merge; if still nothing, ask the owner to open the repo's Actions tab and enable workflows. Then run the workflow by hand (`workflow_dispatch`) and fix any Windows failure before the owner does T40. check the Actions run on the PR (installer artifact path `app/out/make`). Panel not republished (robot run). Run the click test with `xvfb-run -a npx playwright test` in `app/`. Sound is a plain beep (no sound files, so no licence issue).
