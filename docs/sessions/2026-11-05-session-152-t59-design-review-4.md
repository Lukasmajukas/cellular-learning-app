# Handoff note: 2026-11-05, T59 design review 4 (claimed by robot)
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE
**Model used:** Large (Opus), High effort · **Branch / pull request:** claude/robot-design-review-4, #157

## In simple words (for the owner)
The robot looked at every screen of the app again, in Night and in Day, to check that its last 7 small improvements fit in with everything else. They do. The score stays at 4.7 out of 5 (three scores went up a point, none went down), and no screen was wrong.

The one thing that looked wrong was a photo, not the app: in one gallery picture a button looked a little bigger than the same button in a lesson. That was only because the mouse was resting on it, and our buttons grow a tiny bit under the mouse. The picture-taker now moves the mouse out of the way before every picture. The ideas board has a new order: next up is the squeezed line on a narrow lesson-complete screen, then a "flip book" of each animation, so the next review can see movement too.

## What was done
- **Fresh gallery** at the start, Night and Day (101 pictures each), looked at in contact sheets: every screen at 620 × 960, the main ones at 1280 × 800, the 4 phone-narrow ones, and the Day set's main screens.
- **Scores:** `docs/reviews/2026-11-05-design-review-4.md`: 4.71, rounded 4.7 (review 3: 4.7). Up: top bar movement (I30), the right-answer moment's movement (I44), notices "one app" (I69's notice matches the old one exactly, checked side by side in both looks). None down.
- **Checked, and fine:** the two warm notices (same card, icon size and 25 px gap above the tab head); the Keys sheet's "1-9" matches the app's keys (`src/keys.ts`); the welcome's goal keys (I78); the restart arrow on "Again" (I59) in Night, Day and narrow; the shared tab head (I58) on all four tabs.
- **Fix 1 (gallery):** `app/tools/gallery.mjs` `shot()` moves the mouse to (0, 0) before every picture. Found with a one-off probe in the app: on the blocks page the "Not quite" Continue is 400 px wide at x 103, the same as in a lesson; the gallery's `12-blocks-sheet` showed it 410 px wide because the sheet slid up under the mouse that had just clicked "Show 'Not quite'" (buttons scale to 1.03 on hover, `src/ui/press.ts`). That's what idea I79 described, so I79 is crossed out with the reason.
- **Gallery retaken** after fix 1, Night and Day.
- **Ideas board** re-ordered (I61, I10, I89, I85, I47, the path, the keyboard, speed, the idea chats' own ideas, I92, I93, I80, then the rest); new **I92** (the lesson's top row moves up 16 px when a tall "Not quite" panel makes the page scroll, `23-order-wrong`) and **I93** (a fixed answer order for the gallery, so Night and Day pictures compare like with like).
- **Docs:** `PLAN.md` (design review 4 ✅ under "After R24"), `IDEAS.md`, `TASKS.md` (T59 row), `DECISIONS.md`, `PROGRESS-LOG.md`, `GLOSSARY.md` (hover), the panel.
- **No app code changed.** `DESIGN.md` unchanged (no new rule needed).

## Checks
- Unit tests (`npx vitest run`): 269 of 269 pass.
- Click tests (`xvfb-run -a npx playwright test`): CLICK_RESULT
- The content checker isn't needed: nothing in `content/` changed.
- Windows build on GitHub: not running since 2026-11-05 09:17 UTC (T62), as for every chat since; nothing here touches the app's code.

## What's next
- Next task: T59, idea I61 (idea chat 1 of 8 after review 4), model: Large (Opus), effort: High. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- The gallery parks the mouse in the top-left corner before every picture; I79 crossed out (it was the picture, not the app).

## Questions for the owner
- None new. Still open for you: T62 (the Windows build on GitHub), T57, T60.

## New words (also added to GLOSSARY.md)
- Hover.

## Notes for the next Claude
- Contact sheets make a review cheap: a small Pillow script that pastes 4-8 gallery pictures (resized to 400 px wide, with their names) into one image, so one Read shows 8 screens.
- Electron click tests and probes need a pretend screen in the cloud: `xvfb-run -a npx playwright test ...` (the gallery restarts itself inside xvfb-run on its own).
- The gallery's answer order is random per run (I93), so compare Night and Day pictures of a question by tile look, not by position.
- Approvals: nothing asked for approval or was blocked during this chat. Panel not republished (robot run).
