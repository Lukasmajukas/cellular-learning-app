# Handoff note: 2026-11-05, T59 R23 Speed check

**Status:** DONE (the work); the Windows check is BLOCKED on GitHub (T62), see "Approvals and blocks"
**Model used:** Large (Opus), High effort (handed over by a Sonnet robot run) · **Branch / pull request:** claude/t59-r23-speed-check, #147

## In simple words (for the owner)
I timed how hard the app makes your computer work, with the computer slowed down to a quarter of its speed, like an old PC. Two things wasted effort, and both are fixed. Beacon's breathing rings were being redrawn by hand 60 times a second, the whole time Beacon was on screen, even when nothing else happened. Now the graphics chip runs them by itself, so a question screen costs about a tenth of the work. The night glow behind the app was repainted at every step of a scroll. Now it's painted once and stays put, so scrolling the path takes about a fifth less work. Nothing looks different. Start-up was already quick.

## What was done
- **Measured first** (the real app in the cloud, with Chromium's CPU brake at 4×, a quarter speed):
  - **Sitting still:** the app's main-thread work per second on every screen, with nothing happening. A question screen cost 48 ms a second and lesson complete 61 ms, with 60 style passes a second. Every other screen was under 8 ms.
  - **The cause:** `document.getAnimations()` plus a watcher on changed attributes showed Beacon's `rings` group had its style rewritten every frame. It was inside Beacon's SVG drawing, and Chromium can't hand a drawing's parts to the graphics chip, so Motion animated it in code. The path's own breathing rings (a `span`) were already on the graphics chip, with no changes per frame.
  - **Scrolling the real path** (49 lessons, 5867 px, 24 px a frame) held 57–60 fps at a quarter speed. But the main thread was busy 67–72% of the time, with 0–13 hitches a run. Turning off `background-attachment: fixed` on the night glow cut that to 54–58% (4 runs each way).
  - **Start-up:** window 0.20–0.26 s after launch. The page's code had run by 0.15–0.19 s and the save was read by 0.15–0.20 s (0.21 s with the brake on). The app is up at 0.59 s, which is R21's half-second hold. The start screen is gone 1.08–1.13 s after launch. Nothing slow: unchanged. The first start after a build was once 3.9 s to the first picture (the disk being read for the first time). It wasn't seen again.
  - **Every animation** at a quarter speed: 41–59 fps (table below). At full speed, no tab switch lost a frame except one 33 ms frame on the heatmap.
- **Fix 1, Beacon** (`app/src/ui/Beacon.tsx`): Beacon is now three layers stacked in one box, in the same paint order as before.
  - The back drawing: the tower and the head's glow.
  - The rings, on a page layer of their own (`span`s, `data-part="rings"` inside `data-part="ring-hop"`). This is a 68-unit square around the head, so they breathe about its centre.
  - The front drawing: the pulse, the burst rings, the disc and the face.
  - When Beacon cheers, all three hop together (the rings' layer by the same distance in pixels).
  - The root is now a `span` with `role="img"`. It keeps the old test id, `data-face`, `data-looping` and `data-breathing`.
- **Fix 2, the night glow** (`app/src/theme/theme.css`): the same radial glow now sits on `body::before` (`position: fixed; inset: 0; z-index: -1; pointer-events: none`) instead of a fixed page background.
- **Start-up marks** (`app/src/main.tsx`): `performance.mark('cell-save-loaded')` and `performance.mark('cell-app-up')`, for the test. They change nothing on screen.
- **Tests:**
  - `app/tests/speed.spec.ts` (4 click tests):
    - sitting still on 6 screens (path, review with the sweep, heatmap, settings, a question, lesson complete);
    - scrolling the whole real path with the brake on;
    - start-up (the faster of two starts);
    - every animation with the brake on (13 moves; the table is printed).
  - `app/src/r23.test.ts` (5 unit tests):
    - no fixed background anywhere, and the glow is its own fixed layer;
    - Beacon's rings are a `span` outside every drawing for all six faces, in a square centred on the head with room to breathe;
    - no endless loop (`BREATHE.on`, `LOOP`, `repeat: Infinity`) on a `motion.g`, circle or path in any screen file.
- **Docs:**
  - `DESIGN.md`: a "Speed" part in section 7, and a new line in "Never".
  - `PLAN.md`: R23 ✅.
  - `IDEAS.md`: I75, I76, I77.
  - `DECISIONS.md`, `GLOSSARY.md`, the T59 row in `TASKS.md`, the panel.

## Test results
- Unit tests: 250 pass (245 before + 5 in `src/r23.test.ts`). TypeScript OK. Content checker: `content/` untouched.
- **Proof the new checks bite:** with the old `Beacon.tsx` and `theme.css` put back, all 5 unit tests in `r23.test.ts` fail. On the old code, the click test "sitting still" fails: question 48.4 ms/s and 60 passes/s, lesson complete 60.9 ms/s and 60 passes/s.
- **Sitting still, after** (ms of work a second, style passes a second; bar 25 and 10):

  | Screen | Work (ms/s) | Style passes/s |
  |---|---|---|
  | Path | 7.0 | 4.0 |
  | Review (sweep) | 1.4 | 0 |
  | Heatmap | 0.1 | 0 |
  | Settings | 0.1 | 0 |
  | Question | 5.9 | 4.3 |
  | Lesson complete | 0.7 | 0 |

- **Every animation at a quarter speed, after** (floor 30 fps):

  | Animation | fps |
  |---|---|
  | Tab glide + heatmap fill | 41.4 |
  | Tab glide + review blips, sweep | 53.9 |
  | Tab glide to Settings | 57.0 |
  | Switch | 55.0 |
  | Look fade Night → Day | 56.9 |
  | Look fade Day → Night | 56.9 |
  | Tab glide back to the path | 48.0 |
  | Lesson rises in | 55.8 |
  | Wrong answer | 55.5 |
  | Right answer | 58.9 |
  | Next question | 58.9 |
  | Lesson complete | 57.2 |
  | Coming on air | 55.6 |

  Before: the same within run-to-run noise (45–58). The fixes don't target these one-off moves.
- Click tests (cloud): the full run was 120 of 121 (4 new in `speed.spec.ts`).
  - The one failure: `theme.spec.ts` read the night glow from the page's own background, where it no longer is. It now reads `body::before`.
  - After that fix, `theme`, `daylook` and `lookcontrast` (8 tests) passed 3 runs in a row.
  - Every Beacon test passed on the new three layers: its parts stay inside its box, the rings breathe about the head's centre, the cheer hop and burst, the faces.
  - Lowest frame rate at full speed: 57.2 fps (bar 50; R22's lowest was 55.7).
  - In the full run's speed check: sitting still under 5 ms a second on every screen (the question 0.7 ms, lesson complete 0.7 ms). Scrolling the path: 60 fps at a quarter speed, main thread busy 51%, no hitches. Start-up: window 0.22–0.24 s, save read 0.17–0.18 s, start screen gone 1.07–1.11 s.
  - The quarter-speed table ranged from 37.6 fps (the tab glide back to the path, which builds all 49 circles: idea I75) to 58.9 fps.
- **Windows build (GitHub): could not run.** Run 174 (this branch) stopped after 3 seconds, with no computer and no steps, like every run since 09:17 UTC (T62).

## What I looked at (by eye)
- I retook the whole Night gallery (99 pictures, `npm run gallery` into a scratch folder) and compared every picture with `gallery/latest/`, pixel by pixel.
  - 97 of 99 differ by under 1.5% of their pixels: things caught at a slightly different moment of their movement (rings mid-breath, blips, a fade).
  - `10-blocks`: the page is scrolled to a different spot.
  - `04-feedback-wrong`: the answers came out in a different order (the app shuffles them).
  - Neither of those comes from this change.
- Zoomed in 2–3 times on Beacon on lesson complete and the question screen, old against new: the tower, glow, rings, disc and face sit in the same places. The only difference is the rings' breath. The night glow behind the column looks the same.
- **So `gallery/latest/` was not replaced:** nothing you can see changed, and new copies of the same pictures would only make the repository heavier (PLAN.md's risk list). No frame-by-frame check either, because no animation was added: the breath moves exactly as before, as `beacon.spec.ts`'s breathing test measured.
- **Still weak:**
  - Opening the Path tab builds 49 circles at once. That's 37.6–48 fps at a quarter speed, and fine at full speed (I75).
  - The heatmap's fill-in starts every tile in one frame (I76).
  - Nobody has seen the speed table from a real Windows PC yet (I77, after T62).

## What's next
- Next task: T59, session R24 (design review 3, the last of the 24). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- An endless loop goes on a page element, never on a part of a drawing. Beacon is three stacked layers.
- The night glow is its own fixed layer, not a fixed background.
- The speed check is a click test with bars well away from the measured numbers. The two causes are guarded by unit tests.
- Start-up stays as it is.

## Questions for the owner
- None new. T62 (the Windows build on GitHub) is still open, and T57 (the green start-up picture) when a new build is out.

## New words (also added to GLOSSARY.md)
- Main thread, Graphics chip (GPU), Layer, Style pass, CPU brake (CPU throttling), Speed check.

## Approvals and blocks
- Nothing asked for approval. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.
- **BLOCKED: the Windows build check** (PLAN.md checklist step 3), same as R20 to R22: GitHub gives the build no computer. Not a failed try: every check that could run passed. Merged per `docs/WORKFLOW.md` G7; T62 already asks the owner.

## Notes for the next Claude
- **Main-thread cost:** Playwright's `w.context().newCDPSession(w)` works on Electron windows. `Performance.getMetrics` gives `TaskDuration` and `RecalcStyleCount` (main-thread cost). `Emulation.setCPUThrottlingRate` is the brake. Click tests need `xvfb-run -a` in the cloud.
- **Finding a costly loop:** `document.getAnimations()` lists what runs on the graphics chip. A `MutationObserver` on `style` attributes shows what code rewrites every frame. A Motion loop on an SVG part shows up in both.
- **Beacon's markup:** the root is a `span` now, not an `svg`, with two `svg`s and the rings' `span` inside. Tests find parts by `data-part`, so nothing else changed. The start screen's still Beacon in `index.html` stays one `svg`; the unit test compares lines and circles, which are the same.
- **Speed-check bars:** the scroll test's bars (50 fps, under 85% busy, at most 12 hitches) only catch a big step back, because hitch counts vary a lot from run to run. Watch the printed "busy" number instead: 54–58% now.
- **Stray files:** scratch probes (`tests/zz-*.spec.ts`) were deleted. None are committed.
