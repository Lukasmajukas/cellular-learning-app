# Handoff note: 2026-11-05, T59 idea I10 (flip book of each animation in the gallery)
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE
**Model used:** Large, High effort (Opus robot worker, handed over from a Sonnet robot run) · **Branch / pull request:** claude/robot-i10, #160

## In simple words (for the owner)
The gallery is a folder of pictures of every screen of the app, so the robot can check how it looks. But a still picture can't show movement. Now, for each animation, the gallery also makes a "flip book": one sheet of small pictures taken a split second apart, with the time under each, like the corner of a notebook you flip with your thumb. The app itself didn't change.

## What was done
- **The gallery tool** (`app/tools/gallery.mjs`) has a new part, `flipBooks()`. It runs at the end of every full `npm run gallery`, or alone with `node tools/gallery.mjs --flip-only` (after a build; add `--look day` for Day).
- **14 flip books** in `docs/redesign/gallery/latest/flip/` and `latest/day/flip/` (about 620 KB each set), at the owner's window size (620 x 960):
  - `f01-start-fade`, `f02-lesson-opens`, `f03-answer-right`, `f04-next-question`, `f05-answer-wrong`, `f06-lesson-complete`, `f07-back-to-path`;
  - `f08-review-blips`, `f09-heatmap-fill`, `f10-heat-sheet`, `f11-settings-sample`, `f12-look-change`, `f13-beacon-cheers`;
  - `f06-lesson-complete-narrow` (360 x 640, for idea I94).
- Each is one sheet of 8 or 12 pictures (4 or 6 to a row), 50-250 ms apart depending on how long the move is, with a title, the picture's number and its time.
- **How the pictures are caught:** ordinary screenshots took 120-150 ms each here, so a 0.3 s move got two pictures at best. Instead the tool opens Chromium's own frame stream (`Page.startScreencast`, through a DevTools session on the Electron window), which sends a picture each time the screen changes (every 17-50 ms here) with its exact time. For each planned moment the sheet shows the last picture drawn by then: what was on screen at that moment.
- Clicks that start a flip book use the element's own `click()`, so the mouse stays in the corner and no button looks grown by hover.
- The sample lesson's answers are shuffled; the tool finds the right button from the question's words (like the click tests do).
- **A click test fixed:** `tests/beacon.spec.ts` "Beacon blinks within 7 s" failed once in the full run: it asked that the eyes be open in the very last frame, and a second blink can start just as the 7.4 s recording ends (eyes at 0.71). Now it asks that they open again after the first blink. Passed 3 more times.
- **Docs:** `gallery/README.md`, `IDEAS.md` (I10 ✅; a note on I94; new I97, I98), `TASKS.md`, `DECISIONS.md`, `PROGRESS-LOG.md`, the panel.

## Test results
- Unit tests: 269 of 269 pass. TypeScript and the build: OK.
- Content checker: OK (253 facts, 27 photos, 635 questions). Nothing in `content/` changed.
- Click tests (cloud, `xvfb-run -a npx playwright test`): **128 of 130 passed** (18.0 min). The 2 that failed are timing checks: the blink race above (fixed), and `notices.spec.ts` "This changed ... the page glides up", one step of 60.6 px against a 60 px limit while I was taking flip books at the same time (CPU shared). Both passed 3 times out of 3 when run alone; the Beacon file passed 10 of 10 after the fix. No app code changed in this chat.
- Windows build on GitHub: see the pull request; it has failed in seconds for every run since 09:17 UTC (T62), not caused by this change.
- No frame-rate test needed: nothing new moves in the app.
- Panel not republished (robot run).

## What I looked at (by eye)
I opened every Night flip book and the Day `f07` and `f12`:
- **They really move:** `f06` shows Beacon growing in, the rings, the stars dropping one by one (0.6-1.05 s), the XP counting 0 → 12 → 39 → 46 → 49 → 50, the bars filling, the line popping in at about 1.2 s. `f07` shows the circle turning green with its ring, the next lesson coming on air, Beacon arriving beside it (1.25 s), then the top bar's XP counting 120 → 170 from about 1.75 s (I30 works). `f12` shows the cover in the old look's colour fading out over 0.3 s.
- **Found: four hand-overs blink through an empty screen** for about 0.1 s: opening a lesson (`f02`, picture 3), Continue (`f04`, 3-4, only Beacon left), into lesson complete (`f06`, picture 2), and the Review tab (`f08`, picture 2). New idea I97.
- **I94 answered:** on the narrow lesson complete the 50 px gap under the title stays empty from 0.3 s to about 1.1 s while the stars wait under it: it reads as a hole. Noted on I94.
- **Still weak:** at 200 px wide, small moves (Beacon's cheer, the sample's rings, the "signal locked" spark) are hard to see. New idea I98 (a zoomed strip of the moving part).

## What's next
- Next task: T59, idea **I89** (a small lit stub at the start of an empty progress bar; idea chat 3 of 8 after review 4). Large (Opus), High effort. Type `Do the next task in TASKS.md`.

## Decisions made (also added to docs/DECISIONS.md)
- Flip books come from Chromium's frame stream, not repeated screenshots; each sheet shows the last picture drawn by each planned moment. They live in `latest/flip/` and `latest/day/flip/` and are retaken with every full gallery run.

## Questions for the owner
- None new. T62 (the Windows build on GitHub) and T57 (the green start-up picture) are still open.
- Approvals and blocks: nothing asked for approval and nothing was blocked during this chat.

## New words (also added to GLOSSARY.md)
- None ("flip book" was already there).

## Notes for the next Claude
- After `npm ci` in a fresh container, the Electron binary may be missing: run `node node_modules/electron/install.js` first, or every click test fails with "Downloading Electron binary..." and an `undici` assertion.
- Don't run the gallery while the click tests run: the speed and glide tests share the CPU and can fail (seen here with `notices.spec.ts`).
- `flip(w, name, size, title, go, { n, every, cols })` in `gallery.mjs`: `go` starts the move (a click, or a wait for something to start); the clock starts when `go` returns. Use `press(w, testId)` for a hover-free click and `choiceId(w, ok)` for a sample-lesson answer.
- `toLastAnswer` stops at the last question by the counter ("Question 3 of 3"), so it only works in a lesson with no misses (a miss adds a comeback on Continue).
