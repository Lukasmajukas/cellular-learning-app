# Handoff note: 2026-11-05, T64 (make the path-scroll speed test fair on any machine)

**Status:** DONE
**Model used:** Medium, Medium effort (Sonnet, robot run) · **Branch:** claude/robot-t64-speed-test

## In simple words (for the owner)
One of the app's speed tests scrolls the whole path with the computer slowed to a quarter speed, and it used to fail whenever the cloud computer was busy, even though the app hadn't changed. Its pass marks were fixed numbers, like "must finish a race in 10 seconds", which only make sense on one runner. Now the test races the app against itself: it scrolls the path as it is, and again with the old, slower night glow put back, on the same computer in the same minute. The app must do clearly less work than the old way. A busy day slows both runs the same, so the test stays fair, and if someone ever brings the old glow back, it fails.

## What was done
- `app/tests/speed.spec.ts`, test "scrolling the whole real path": rewritten.
  - Measures the main thread's work (ms) for the scroll, not hitches or busy percent (those follow how busy the machine is).
  - Runs the path as it is, and the path with the old glow (a fixed background, injected as CSS), 3 times each, taking the cheapest run of each. Bar: path work under 90% of the old glow's work. Measured: 82-84% (cloud, 5 runs); with the old glow really back in `theme.css`: 93-100%.
  - A "yardstick" (a fixed little job of making and measuring 2,000 boxes, timed in the same window before and after) turns the work into "yardsticks", so a slow machine gets a fair number. Second bar: under 330 yardsticks (normal 160-200), which catches any other step back (a path about twice as dear).
  - A floor of 30 fps replaces the 50 fps / 12 hitches / 85% busy bars. Frame pacing and hitches are still printed.
- Nothing in the app's own code changed.

## Test results
- It bites: with the old glow put back into `app/src/theme/theme.css` the new bar fails ("the path costs less than the old fixed-background glow would", 93%). The change was undone afterwards; `git status` shows only `speed.spec.ts` changed.
- `speed.spec.ts`: all 4 tests pass (2.2 min). Unit tests 267 pass, `tsc` OK. Full click-test run not repeated (only a test file changed).
- Windows build on GitHub: still stopped (T62), so left out.
- Not tested: a really slow machine; only the cloud computer was available.
- Panel not republished (robot run).

## What's next
- T59 carries on with the top unticked idea in `docs/redesign/IDEAS.md`: I44 (Large, Opus, High effort).

## Decisions made (also added to docs/DECISIONS.md)
- A speed test must compare against something measured on the same machine at the same time, never fixed numbers alone.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- Yardstick (in a test).

## Notes for the next Claude
- The yardstick alone could not tell the old glow from the new one (machine noise about 10%, glow difference 25-40%), so the head-to-head with the old glow is the real guard.
- A first run of Playwright once said "Electron failed to install correctly"; the next run was fine.
