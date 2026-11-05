# Handoff note: 2026-11-05, T59 idea I69 (a save that fails says so)
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE
**Model used:** Large (Opus), High effort (a robot run handed it to this chat) · **Branch / pull request:** `claude/robot-t59-i69`, #152

## In simple words (for the owner)
The app saves your progress after every change. If that ever stopped working (a full disk, or another program holding the file), the app used to keep quiet: it only wrote a line in a log you never see. It was like a phone that says "sent" when the message never left. Now a warm "Couldn't save your last change" box appears at the top, on every tab, with a Try again button. Your progress is still safe inside the app while it stays open. The box goes away by itself as soon as a save works. You should never see it unless something is really wrong with the disk.

## What was done
- **`app/src/Notices.tsx`:** a new notice, `SaveFailedNotice`, always the top one. Same warm colours as "Your progress is safe", the backup icon, the words in `SAVE_FAIL`: "Couldn't save your last change. It's still here while the app stays open, but it isn't in your progress file yet. Keep the app open and try again." From the second try: "Tried N times. A full disk, or another program using the progress file, can cause this." A blue Try again, and the exact error folded under "What happened". **No close button, on purpose:** closing it would hide a change that isn't saved.
- **`app/src/storage.ts`:** `createSaver` saves and reports whether it worked. Only the newest save's answer counts, because each save holds the whole progress: an older save finishing late can't hide a newer failure or bring back a fixed one.
- **`app/src/main.tsx`:** uses `createSaver` instead of a save that ignored its errors; Try again saves the current progress again. Any later change (a lesson, a setting) also tries again, so the notice can go without Try again.
- **`app/src/Trouble.tsx`:** the "What happened" fold is now one shared piece, `WhatHappened`, used by the error screens and the new notice (same look as before on the error screens).
- **`app/electron/main.cjs`:** a test door, `CELL_TEST_SAVE_FAIL=n`: the first n saves fail. Like R21's `CELL_TEST_LOAD_FAIL`. Only automatic tests and the gallery set it.
- **Tests:**
  - `app/src/savefail.test.ts` (5 new): a save that works reports nothing wrong, one that fails reports its words; only the newest save counts (both orders); the words are kind (no blame words) and say the change is still here; it has Try again, the fold, no close button, and the count only from the 2nd try; it sits above the other notices. **It bites:** with the "newest only" check taken out, the order test fails.
  - `app/tests/savefail.spec.ts` (4 new click tests): the notice shows at start (the first save fails), stays on Settings, counts "Tried 2 times" after a change that also can't be saved (and the file still has the old value), then Try again works: the notice fades, the page glides up into its space at 60 fps, and the file has the new value. A later change that saves fine clears it too. Saves that work show nothing. Reduce motion: it goes at once.
  - `app/tests/lookcontrast.spec.ts`: the new notice (count and fold open) is checked in Night and Day: 105 words, none too faint.
- **Docs:** `DESIGN.md` (the notices paragraph), `IDEAS.md` (I69 ✅, new I83 and I84), `TASKS.md` (the T59 row), `DECISIONS.md`, `PROGRESS-LOG.md`, the gallery README, the panel.

## Test results
- Unit tests: 267 pass (262 before + 5 new). TypeScript and the build OK.
- Content checker: OK (253 facts, 27 photos, 635 questions). Nothing in `content/` changed.
- Click tests (cloud, `xvfb-run -a npx playwright test`): RESULT
- Windows build on GitHub: **could not run**, the same as every run since 09:17 UTC (T62): no check run started for this branch.

## What I looked at (by eye)
- `55-savefail` in Night (620 × 960 and 1280 × 800) and Day (620 × 960): the warm box sits at the top of the path, in the 440 px column, above "Your path"; its icon, title, two lines, "Tried 2 times", Try again and "What happened" line up on one left edge; Try again is the normal blue main button (dark teal in Day). Words readable in both looks.
- **Before pictures:** none needed: no existing screen changed (the notice only shows when a save fails). The "What happened" fold on the error screens is the same code moved into one shared piece; the contrast test still reads it on both error screens.
- **Gallery:** 4 new pictures (`55-savefail` and `55-savefail-wide`, in `gallery/latest/` and `gallery/latest/day/`). The gallery was run into the scratchpad and only these copied in.
- **Still weak (new ideas):** I83: on a long screen scrolled down (Settings), the notice appears at the top, out of sight (found by the click test). I84: when Try again fails again, only the count changes, easy to miss.

## What's next
- T59 carries on with the top unticked idea in `docs/redesign/IDEAS.md`: I30 (the top bar's new numbers wait for their moment). Large (Opus), High effort. This was idea chat 4 of 8 after R24; the 8th is design review 4.

## Decisions made (also added to docs/DECISIONS.md)
- A failed save shows "Couldn't save your last change" at the top until a save works; no close button; only the newest save's answer counts.

## Questions for the owner
- None new. T62 (the Windows build on GitHub) and T57 (the green start-up picture) are still open.

## New words (also added to GLOSSARY.md)
- None.

## Approvals and blocks
- Nothing asked for approval. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.
- **BLOCKED: the Windows build check** (PLAN.md checklist step 3), same as R20 to I78: GitHub gives the build no computer. Not a failed try: every check that could run passed. Merged per `docs/WORKFLOW.md` G7; T62 already asks the owner.

## Notes for the next Claude
- To see the notice yourself: start the app with `CELL_TEST_SAVE_FAIL=3`.
- The click test's "no jump" check scales with the move (biggest one-frame step under 35% of the whole move), because this notice with "What happened" open is about 425 px tall.
- Nothing during a lesson saves (progress changes only when it ends), so the notice never interrupts a lesson; it shows when you're back on the path.
