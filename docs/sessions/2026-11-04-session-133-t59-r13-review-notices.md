# Handoff note: 2026-11-05, T59 redesign R13 (daily review and notices)

**Status:** DONE
**Model used:** Large (Opus), High effort (a Sonnet robot run claimed it on 2026-11-04 and handed it to an Opus chat; that chat stopped on the 5-hour limit before starting, so this Opus chat took it over, 🟡) · **Branch / pull request:** claude/t59-r13-review-notices, #137

## In simple words (for the owner)
The Review tab is a "drive test" screen now. A round radar shows one purple dot for each question waiting for you. The farther out a dot is, the longer that question has waited. A soft beam sweeps round while questions wait. Under it you see how many, about how long, a big "Start the review" button, and how many more come due in the next day and the next week. With nothing due it says "All clear for now" and when the next question comes back. The "This changed" card and the "Your progress is safe" notice got the new look too. When you close one, the page glides up instead of jumping.

## What was done
- **Review tab, `app/src/ReviewScreen.tsx`** (rewritten):
  - "DRIVE TEST" label and "Daily review" title (28 px).
  - A radar scope (224 px): three rings and a faint dashed cross. One review-purple blip per question today's review plays (at most 20), oldest first, spread round with the golden angle. Its ring shows how long it has waited: inner = came due today, middle = this week, outer = longer. The count sits in the middle (40 px code font, "DUE"), or a green check and "ALL CLEAR".
  - Blips pop in one after another (bouncy spring, `popInDelay`), only the first time you see them after the app starts, or when new ones came due (a module-level `seen` count; the I17 lesson).
  - While questions wait, a wedge sweeps round, 4 s a turn. It's the screen's only background loop: a whole `rotate`, paused while the window is hidden (`useAwake`). This is idea I03 on the Review tab.
  - Three looks (`data-look`):
    - **due:** "12 questions are waiting" with "About 6 minutes. Oldest first.", or "Today: the oldest 20, about 10 minutes." when more than 20 wait; then "Start the review".
    - **clear:** "All clear for now" with "The next question comes back in 5 hours / tomorrow / in 3 days", and a quiet "Play a new lesson" that goes to the Path tab.
    - **empty:** "Nothing to review yet", a line on how it works, and "Go to your first lesson".
  - A "Coming up" card (+N in the next 24 hours, +N in the next 7 days) and "How it works" with three icon rows.
- **Numbers behind it, `reviewOutlook` and `whenNext` in `app/src/dailyReview.ts`:** due, today (capped at 20), minutes (about 30 s a question), days late per blip, next 24 h, next 7 days, next due time, how many timers exist. Only questions that still exist in the lessons count.
- **Notices, `app/src/Notices.tsx`** (they replace the hand-styled card and the plain strip in `main.tsx`):
  - **"This changed":** a signal-blue card with a round waves badge, "THIS CHANGED" and "1 of 2" when more wait, the title, the text, "As of <date> · Source: <source>", a purple "N questions come back for review" pill, and "Got it".
  - **"Your progress is safe":** the warm notice colours, a spanner icon, "Your save file was damaged, so I restored your backup from yesterday. Anything you did after it may need doing again.", and a close button.
  - A notice slides 12 px down and fades in. Closing one fades it out first (0.2 s); then the page glides up into its space (0.3 s, a layout move). A next card waits for the old one to fade. `AnimatePresence mode="popLayout"` takes the closing notice out of the page's flow at once, so the page measures the gap in the same render (without it the page jumped). The page wrapper in `main.tsx` is a `motion.div layout="position"`.
- **Save code:** `electron/store.cjs` `load()` also returns `backupDay` (the restored backup's day). `backupWhen()` in `app/src/storage.ts` turns it into "from earlier today / from yesterday / from Tuesday, Nov 3".
- **Path:** while a notice shows, the path opens at the top instead of scrolling to your lesson. Before, it scrolled the notice out of sight at start-up, so you'd never see it (found in this session's pictures).
- **Test door:** `CELL_TEST_CHANGES` (a JSON list, read in `electron/preload.cjs`) shows made-up "This changed" cards in tests and the gallery, because `content/changes.json` is empty. `content/` is untouched.
- **Speed file:** `SCOPE` (blip pop, sweep) and `NOTICE`, `noticeMotion()`, `noticeShift()`.
- **Gallery** (`app/tools/gallery.mjs`): new `30-review-blips` (mid-pop), `31-review-clear`, `32-change-card`, `33-restored-notice`. `launch()` takes an optional `edit(dir)` to change the save after seeding.
- **Tests:**
  - Unit (+15, 196 in all): the outlook numbers (nothing yet; due, 24 h, 7 days, next due; the cap and 10 minutes; days late; never "0 minutes"; gone questions ignored), `whenNext`, `backupWhen`, `backupDay` from the store, `SCOPE` and `NOTICE` rules (springs, transforms and see-through-ness only, the loop at 2-4 s, fade before glide, Reduce motion), and the new screens built from the blocks with `useCalm()` and `useAwake()`.
  - New `app/tests/reviewscreen.spec.ts` (5 click tests): blips pop in one after another, the sweep turns, 60 fps, rings by age, no second pop when you come back, Start opens the review; more than 20; all clear; nothing yet; Reduce motion.
  - New `app/tests/notices.spec.ts` (3): "This changed" with "1 of 2", the next card, the glide-up (biggest one-frame step 47 of 228 px, 60 fps), saved `seenChanges` and the restarted questions; the restored notice from yesterday's backup with its glide-up; Reduce motion (the page moves up at once).
  - `app/tests/frame.spec.ts`: the Review tab's first look on a fresh save is now "Nothing to review yet" with "Go to your first lesson". The "no sideways shift" test now uses the owner's window height (960), because at 760 every tab scrolls now.

## Test results
- Unit tests: 196 pass (181 + 15). TypeScript OK. Content checker OK (253 facts, 27 photos, 635 questions; `content/` untouched).
- Click tests: full run 71 of 72 on the first try (9.6 min). The one failure was `frame.spec.ts` "switching tabs doesn't shift the frame sideways": it needs a tab short enough not to scroll, and R13 made the Review tab taller than its 760 px window. My change caused it, and the test's point (no sideways shift between a tab with a scrollbar and one without) still holds, so the test now uses the owner's window height (960 px), where Review fits and the path scrolls. After that fix all 6 frame tests passed, so 72 of 72 (64 before + 5 + 3 new). Frame rates (cloud): Review tab blips and sweep 60.0 fps; notice glide-up 60.0 fps (both notices).
- Windows build (GitHub):
  - Run 41951092953 (first code push): **failed**, 71 of 72: the same frame test as in the cloud (fixed in the next push). Its test-picture upload also failed: "Artifact storage quota has been hit". That step runs only after a failure, so it can't fail a good build, but failed builds won't keep their pictures until GitHub recounts the storage (every 6-12 hours).
  - Run 41952417347 (final code): **passed**. 196 unit tests, 72 of 72 click tests (10.4 min), and the installer. Windows frame rates: Review tab blips and sweep **57.2 fps**; notice glide-ups 64.0 fps (both notices); the older moments fine (lesson complete 61.9, coming on air 63.3, unit done 64.0, top bar 64.0, question glide 64.0, sheet 64.0).

## What I looked at (by eye)
- Before: `13-review` from R12 (a "8 questions due" card with a blue button and a "How it works" text card; most of the screen empty). The change card and the restored notice had no gallery pictures before (never shown in tests: the changes list is empty).
- After (620 × 960 checks, then the gallery at 620 × 960 and 1280 × 800):
  - `13-review`: the scope with 8 blips on three rings, the sweep's wedge, "8" and "DUE" in the middle; "8 questions are waiting", "About 4 minutes. Oldest first.", the blue button, "Coming up" (0 and +2), and "How it works" with three coloured icons. Everything fits above the tab bar at 960 px.
  - `30-review-blips`: caught 0.26 s in, two blips full size and the rest still growing in: they really pop one after another.
  - `31-review-clear`: a green check and "ALL CLEAR", no blips or sweep, when the next one comes back, and the quiet "Play a new lesson".
  - `32-change-card`: the card at the top, "1 of 2", the date in the code font, the purple pill, "Got it"; the path under it, not scrolled away.
  - `33-restored-notice`: warm and calm, "from yesterday", the close button.
  - Wide pictures keep the 440 px column. Nothing overlaps.
- Frame by frame: closing a "This changed" card. The first try slid the page up through the fading card while it faded, so their words overlapped. Fixed: the card fades first, then the page glides (3 pictures 100 ms apart: the card fading; the page halfway up; settled).
- **Still looks weak:**
  - The path's "Daily review" card is still the plain row, so it doesn't look like the scope it opens (idea I49).
  - The blips don't react when the sweep passes them, as a real radar's would (I50).
  - The change card says what changed only in words (I51).
  - "Coming up" shows a dim "0" when nothing comes due in the next 24 hours; fine, but a little empty.

## What's next
- Next task: T59, session R14 (heatmap). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- The Review tab as a radar scope with blips, a sweep and three looks; the notices' look and the fade-then-glide order; the path doesn't scroll a notice away; the `CELL_TEST_CHANGES` test door.

## Questions for the owner
- None. Optional: open the Review tab on your PC and tell any chat whether the sweep and the dots look right.

## New words (also added to GLOSSARY.md)
- Radar scope (Review tab), layout move.

## Approvals and blocks
- Nothing asked for approval; nothing was blocked. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.

## Notes for the next Claude
- **A closing element and the layout move:** a sibling only animates its layout move if it re-renders in the same render where the gap opens. `AnimatePresence mode="popLayout"` does that (the closing child is taken out of flow at once). The default "sync" mode keeps it in flow until its exit ends, and then the page jumps. `main.tsx` re-renders the page wrapper on every state change, so the measurement happens.
- `[data-notice]` marks a notice; `PathMap` doesn't scroll while one is on the page.
- The scope's blips use `data-orbit` (0, 1, 2), not `data-ring`: the signal burst already uses `data-ring`.
- R14 (heatmap): the heatmap is still the old card grid; idea I09 belongs to it.
