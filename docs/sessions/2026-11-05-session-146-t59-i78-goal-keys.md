# Handoff note: 2026-11-05, T59 idea I78 (welcome goal keys)
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** IN PROGRESS
**Model used:** Large (Opus), High effort (a robot run handed it to this chat) · **Branch / pull request:** `claude/robot-t59-i78`, #151

## In simple words (for the owner)
On the welcome's second page you pick how many lessons a day: 1, 2, 3 or 5. Each choice has a small key number beside it, and those were 1, 2, 3 and 4, so the key beside "5 lessons" said 4. It was like a lift where the button for floor 5 says 4. Now each key is its own number: press 5 for 5 lessons. Pressing 4 does nothing, because there's no 4-lesson choice. Your own app skips the welcome, so you'd only see this on a brand-new save.

## What was done
- **`app/src/Welcome.tsx`:** each goal tile's number box, its `data-pick` (the key that picks it) and its `aria-keyshortcuts` (what a screen reader says) are now its own lesson count (1, 2, 3, 5), not its place in the list (1-4). Same pattern as the question tiles in `QuestionTypes.tsx`. The goal page (`Goal`) is exported so a unit test can draw it.
- **Settings:** its daily-goal pills have no number keys (`PillChoice` has no `data-pick`), so nothing to change there. If they ever get keys, use the same rule.
- **Tests:**
  - `app/src/firststart.test.ts`, new test: draws the goal page and checks every tile's number box, `data-pick`, `aria-keyshortcuts` and "N lessons" all show the same number, and that there's no key 4. **It bites:** with the old `i + 1` keys back, it fails.
  - `app/tests/firststart.spec.ts`, the welcome keyboard test: now presses 3 (picks 3 lessons), then 4 (nothing changes), then 5 (picks 5 lessons, and the key drawn beside it says 5).
- **Docs:** `DESIGN.md` (the welcome's description), `IDEAS.md` (I78 ✅), `TASKS.md` (the T59 row), `DECISIONS.md`, `PROGRESS-LOG.md`, the panel.

## Test results
- Unit tests: 262 pass (261 before + 1 new). TypeScript and the build OK.
- Content checker: OK (253 facts, 27 photos, 635 questions). Nothing in `content/` changed.
- Click tests (cloud, `xvfb-run -a npx playwright test`): RESULT
- Windows build on GitHub: **could not run**, the same as every run since 09:17 UTC (T62): no check run started for this branch.

## What I looked at (by eye)
LOOKED

## What's next
- T59 carries on with the top unticked idea in `docs/redesign/IDEAS.md`: I69 (a notice if a save fails). Large (Opus), High effort. This was idea chat 3 of 8 after R24; the 8th is design review 4.

## Decisions made (also added to docs/DECISIONS.md)
- A choice whose options are numbers is keyed by those numbers, not by its place in the list (welcome goals: 1, 2, 3, 5; no key 4).

## Questions for the owner
- None new. T62 (the Windows build on GitHub) and T57 (the green start-up picture) are still open.

## New words (also added to GLOSSARY.md)
- None.

## Approvals and blocks
- Nothing asked for approval. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.
- **BLOCKED: the Windows build check** (PLAN.md checklist step 3), same as R20 to I58: GitHub gives the build no computer. Not a failed try: every check that could run passed. Merged per `docs/WORKFLOW.md` G7; T62 already asks the owner.

## Notes for the next Claude
- No frame-rate or reduce-motion test was added: nothing new moves. The welcome's existing glide and reduce-motion tests still run.
- Only `43-welcome-goal` (both sizes, both looks) shows this change in the gallery.
