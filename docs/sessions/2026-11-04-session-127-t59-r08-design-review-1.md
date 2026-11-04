# Handoff note: 2026-11-04, T59 R08 Design review 1

**Status:** DONE
**Model used:** Large (Opus), High effort (took over the robot run's claim) · **Branch / pull request:** claude/t59-r08-design-review-1, #131

## In simple words (for the owner)
The first design review. I took fresh pictures of every screen and scored each one out of 5 against the Night Signal picture you chose. The path map, top bar, tabs, Review and Settings already look like it (the path map is the best screen now). The lesson screens and the heatmap don't yet: they still have the old triangle mascot, confetti over the words, and pastel heatmap tiles. Those are the next sessions anyway. I fixed four small things: the whole frame jumped a few pixels sideways when you switched from the Path tab to a short tab; the top bar showed "+0" at the start of each day; the lesson-complete confetti kept falling over the path; and the top bar's celebration overlapped the path's "coming on air" a little, which made it slightly too slow on GitHub's Windows machines (it now waits until the path is done). And I changed the order: Beacon, the new mascot, gets drawn next (R17), so the lesson screens are built around it instead of the old triangle. The full review: `docs/reviews/2026-11-04-design-review-1.md`.

## What was done
- **Review** (`docs/reviews/2026-11-04-design-review-1.md`): 13 screens scored on look, movement, clarity and "one app"; overall 3.4 / 5. Best: path map (5/4/5/5). Worst: heatmap (2/2/2/2), learn card and "Right!" / "Not quite" (2s).
- **Fix 1, no sideways jump between tabs:** `app/src/theme/theme.css` `html { scrollbar-gutter: stable }`. New click test in `tests/frame.spec.ts`; it failed without the fix (top bar x 40 vs 32.5) and passes with it.
- **Fix 2, no "+0":** `app/src/ui/TopBar.tsx` shows today's XP only when it's above 0. Checked in `tests/topbar.spec.ts` (repair-card test).
- **Fix 3, confetti cleared when you leave a lesson:** `app/src/LessonPlayer.tsx` (`rawConfetti.reset()` on unmount, and the waiting burst's timer cleared). New click test in `tests/smooth.spec.ts`; it failed before and passes now. Ticks idea I23.
- **Fix 4, the top bar waits for the whole path moment:** `TOP_BAR.afterPath` 1.4 → 1.6 s (`app/src/theme/motion.tsx`); `motion.test.ts` now also checks the springs (`arrive`, `check`, `bannerCheck`) and the last wave ring; `topbar.spec.ts` expects the count to start after 1.5 s (it measured 1633 ms).
- **Plan** (`docs/redesign/PLAN.md`): R08 ticked; R17 "Beacon is drawn" moved up to right after R08 (rows are done top to bottom and keep their numbers); notes added to R09 (use the R03 bottom sheet; Continue red after "Not quite"), R11 (no confetti per right answer, I31), R12 (one main button, I32).
- **Ideas** (`docs/redesign/IDEAS.md`): new I31, I32, I33; the board re-ordered (session-tied ideas first in session order, then free ideas in the order to do them after R24, done ones at the bottom).
- **DESIGN.md** section 4: the scrollbar-gutter rule, with its reason.
- **Gallery** retaken after the fixes (all pictures, both sizes).
- **Checks:** unit tests 154 pass. Click tests 44 pass (42 + 2 new); every moment 58.6-60 fps in the cloud. Windows build: see the pull request. TypeScript OK. Content checker OK (253 facts, 27 photos, 635 questions; `content/` untouched).

## What I looked at (by eye)
- Every picture in `gallery/latest/` (narrow and wide) next to `looks/look-a-night-signal.webp`. Details and scores are in the review.
- After the fixes: `15-repair-card` has no "+0"; `13-review`, `07-heatmap` and `08-settings` keep the same left edge as `01-path-map`.
- **Still looks weak:** the lesson screens (old mascot, inline feedback box, confetti over words, two loud buttons on lesson complete); the heatmap's pastel tiles and out-of-date legend; the full-height plain scrollbar (I33).

## What's next
- Next task: T59, session R17 (Beacon is drawn), moved up by this review. Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- R17 moves up to right after R08; plan rows keep their numbers when moved.
- `scrollbar-gutter: stable` on the page; today's XP hidden while 0.
- Leaving a lesson clears its confetti; the top bar waits 1.6 s after a first finish (was 1.4 s).

## Questions for the owner
- None. Optional: open `docs/redesign/gallery/latest/` and tell any chat if a score in the review feels wrong to you.

## New words (also added to GLOSSARY.md)
- Scrollbar gutter. ("Design review" was already there.)

## Approvals and blocks
- Nothing asked for approval; nothing was blocked. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.

## Notes for the next Claude
- **Windows frame rate (fix 4):** "coming on air" failed twice on Windows (49.2, 49.8 fps; R07's last run 47.9, same code as `main`). How it was found, so the next chat can repeat it: a scratch test (not kept) with `const cdp = await w.context().newCDPSession(w); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 })`, 5 runs per variant (single runs vary by ±5 fps), and a trace (`Tracing.start` with `devtools.timeline`, read back with `IO.read`) summed per 200 ms on `CrRendererMain`. The busy stretch was 1.2-1.8 s: the top bar's moment overlapping the path's last springs. **Rule of thumb: count a spring as 0.7 s when lining up moments; `motion.test.ts` checks it.**
- **The click tests need a pretend screen in the cloud:** run them as `xvfb-run -a npm run e2e` (or `xvfb-run -a npx playwright test tests/x.spec.ts`). Without it Electron fails with "Missing X server or $DISPLAY". `npm run gallery` restarts itself inside xvfb-run on its own.
- The click tests' window is shorter than the gallery's 620 × 960, so Settings scrolls there; the Review tab is the one short screen to use when a test needs "no scrollbar".
- With `scrollbar-gutter: stable` the fixed tab bar and the sticky top bar both centre in the same width on every screen, scrolling or not. If a future screen hides the page scrollbar on purpose, check the frame test still holds.
- **For R17 (Beacon):** the old mascot is `app/src/Mascot.tsx`, tested by `tests/mascot.spec.ts`. DESIGN.md section 8 has the look, the six faces and the sizes (48 / ~58 / 96–140 px). Look A's Beacon is a thin lattice tower (two legs, cross braces) with a round glowing head that has a face, and rings around the head.
