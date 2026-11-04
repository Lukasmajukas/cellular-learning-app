# Handoff note: 2026-11-04, T59 R08 Design review 1

**Status:** DONE
**Model used:** Large (Opus), High effort (took over the robot run's claim) · **Branch / pull request:** claude/t59-r08-design-review-1, #131

## In simple words (for the owner)
The first design review. I took fresh pictures of every screen and scored each one out of 5 against the Night Signal picture you chose. The path map, top bar, tabs, Review and Settings already look like it (the path map is the best screen now). The lesson screens and the heatmap don't yet: they still have the old triangle mascot, confetti over the words, and pastel heatmap tiles. Those are the next sessions anyway. I fixed two small things: the whole frame jumped a few pixels sideways when you switched from the Path tab to a short tab, and the top bar showed "+0" at the start of each day. And I changed the order: Beacon, the new mascot, gets drawn next (R17), so the lesson screens are built around it instead of the old triangle. The full review: `docs/reviews/2026-11-04-design-review-1.md`.

## What was done
- **Review** (`docs/reviews/2026-11-04-design-review-1.md`): 13 screens scored on look, movement, clarity and "one app"; overall 3.4 / 5. Best: path map (5/4/5/5). Worst: heatmap (2/2/2/2), learn card and "Right!" / "Not quite" (2s).
- **Fix 1, no sideways jump between tabs:** `app/src/theme/theme.css` `html { scrollbar-gutter: stable }`. New click test in `tests/frame.spec.ts`; it failed without the fix (top bar x 40 vs 32.5) and passes with it.
- **Fix 2, no "+0":** `app/src/ui/TopBar.tsx` shows today's XP only when it's above 0. Checked in `tests/topbar.spec.ts` (repair-card test).
- **Plan** (`docs/redesign/PLAN.md`): R08 ticked; R17 "Beacon is drawn" moved up to right after R08 (rows are done top to bottom and keep their numbers); notes added to R09 (use the R03 bottom sheet; Continue red after "Not quite"), R11 (no confetti per right answer, I31), R12 (one main button, I32).
- **Ideas** (`docs/redesign/IDEAS.md`): new I31, I32, I33; the board re-ordered (session-tied ideas first in session order, then free ideas in the order to do them after R24, done ones at the bottom).
- **DESIGN.md** section 4: the scrollbar-gutter rule, with its reason.
- **Gallery** retaken after the fixes (all pictures, both sizes).
- **Checks:** unit tests 154 pass. Click tests: see "Notes" for the full run. TypeScript OK. Content checker OK (253 facts, 27 photos, 635 questions; `content/` untouched).

## What I looked at (by eye)
- Every picture in `gallery/latest/` (narrow and wide) next to `looks/look-a-night-signal.webp`. Details and scores are in the review.
- After the fixes: `15-repair-card` has no "+0"; `13-review`, `07-heatmap` and `08-settings` keep the same left edge as `01-path-map`.
- **Still looks weak:** the lesson screens (old mascot, inline feedback box, confetti over words, two loud buttons on lesson complete); the heatmap's pastel tiles and out-of-date legend; the full-height plain scrollbar (I33).

## What's next
- Next task: T59, session R17 (Beacon is drawn), moved up by this review. Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- R17 moves up to right after R08; plan rows keep their numbers when moved.
- `scrollbar-gutter: stable` on the page; today's XP hidden while 0.

## Questions for the owner
- None. Optional: open `docs/redesign/gallery/latest/` and tell any chat if a score in the review feels wrong to you.

## New words (also added to GLOSSARY.md)
- Scrollbar gutter. ("Design review" was already there.)

## Approvals and blocks
- Nothing asked for approval; nothing was blocked. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.

## Notes for the next Claude
- **The click tests need a pretend screen in the cloud:** run them as `xvfb-run -a npm run e2e` (or `xvfb-run -a npx playwright test tests/x.spec.ts`). Without it Electron fails with "Missing X server or $DISPLAY". `npm run gallery` restarts itself inside xvfb-run on its own.
- The click tests' window is shorter than the gallery's 620 × 960, so Settings scrolls there; the Review tab is the one short screen to use when a test needs "no scrollbar".
- With `scrollbar-gutter: stable` the fixed tab bar and the sticky top bar both centre in the same width on every screen, scrolling or not. If a future screen hides the page scrollbar on purpose, check the frame test still holds.
- **For R17 (Beacon):** the old mascot is `app/src/Mascot.tsx`, tested by `tests/mascot.spec.ts`. DESIGN.md section 8 has the look, the six faces and the sizes (48 / ~58 / 96–140 px). Look A's Beacon is a thin lattice tower (two legs, cross braces) with a round glowing head that has a face, and rings around the head.
