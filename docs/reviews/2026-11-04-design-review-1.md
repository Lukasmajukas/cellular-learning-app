# Design review 1: redesign sessions R01 to R07 (task T59, session R08)

**Status:** DONE · **Reviewed:** every picture in `docs/redesign/gallery/latest/` (taken fresh at the start of this review, both window sizes), against `docs/redesign/DESIGN.md` and the look A picture (`docs/redesign/looks/look-a-night-signal.webp`), plus the handoff notes of R01 to R07 · **By:** Large (Opus), High effort, robot run · **Date:** 2026-11-04

## In simple words (for the owner)
I looked at every screen the way you'd look at a house halfway through a renovation.

- **The rooms that are done look like the picture you picked.** The path map, the top bar, the tabs at the bottom, the Review tab and Settings are dark, calm and glowing, like look A. The path map is the best screen in the app now (5 out of 5 for looks).
- **The rooms where you spend most of your time aren't done yet.** The lesson screens (learn cards, questions, "Right!" / "Not quite", lesson complete) still look like the old app with dark paint on top: the old triangle mascot, confetti after every right answer that falls over the words, and a green "Continue" even after a wrong answer. That's expected: they're the next four sessions (R09 to R12).
- **The heatmap is the weakest screen** (2 out of 5): its pastel green-yellow-orange tiles and its words ("Red = fading", "Grey = not quizzed") don't match the new look. Session R14 redoes it.
- **I fixed four small things myself**, each with a test:
  1. When you switched from the Path tab to a short tab (like Review), the whole frame (top bar, tabs and page) **jumped sideways a few pixels**, because the scrollbar disappeared. Now the scrollbar's strip is always kept, so nothing jumps.
  2. At the start of a day the top bar showed **"+0"** next to your XP. It now shows nothing until you've earned some XP that day.
  3. The lesson-complete confetti **kept falling over the path** after you pressed "Back to the path". It's now cleared when you leave the lesson.
  4. The top bar's celebration started while the path's "coming on air" was still finishing, and on GitHub's Windows machines that dropped below the smoothness bar. The top bar now waits until the path is completely done (1.6 s instead of 1.4 s).
- **One change of order:** Beacon, the new glowing-tower mascot (session R17), now comes **next**, before the question screen. Otherwise the four lesson sessions would build around the old triangle and then have to be redone when Beacon arrives.

## Scores (1 = poor, 5 = great)
"One app" means: does it look like it belongs with the path map and the top bar?

| Screen (gallery picture) | Look | Movement | Clear | One app | Notes |
|---|---|---|---|---|---|
| Path map (`01`) | 5 | 4 | 5 | 5 | Very close to look A: banners, zig-zag circles, dotted line, glowing "Up next". Movement measured at 55–60 fps (R06, R07). The checkpoint looks like any other lesson (idea I21). |
| Top bar (`01`, `14`) | 4 | 4 | 4 | 5 | Matches look A's bar. "+0" fixed here. While the path plays "coming on air", the streak and today's XP already show their new numbers (I30). |
| App frame and tabs (`01`, `07`, `08`, `13`) | 4 | 4 | 5 | 4 | Tabs are clear and big enough. Sideways jump between tabs fixed here. The plain scrollbar runs beside the top bar and the tabs (I33). |
| Repair card (`15`) | 4 | 4 | 5 | 4 | Clear and kind. Amber matches the flame. |
| Review tab (`13`) | 4 | 3 | 5 | 4 | Tidy, but most of the screen is empty; only the glide moves. R13 restyles it. |
| Settings (`08`) | 4 | 4 | 4 | 4 | Neat cards, glowing switches, round goal buttons. Only "Sounds" has an icon (I11, with R15). |
| Heatmap (`07`) | 2 | 2 | 2 | 2 | Old pastel tiles with dark words, a colour scale that isn't in `DESIGN.md`, and a legend that no longer matches the tiles (I09). Nothing moves. R14. |
| Learn card (`02`) | 2 | 2 | 4 | 2 | Old triangle mascot; the "Got it" button is on-air green although nothing was answered; empty progress bar. R09/R10. |
| Question (`03`) | 3 | 3 | 4 | 3 | The numbered answer tiles are new and good. Missing: "PICK ONE", Beacon with a speech bubble. R09. |
| Right / Not quite (`04`, `05`) | 2 | 2 | 4 | 2 | An inline box instead of the bottom sheet from R03; confetti after every right answer falls over the words and the Continue button; Continue is green even after "Not quite". R09, R11. |
| Lesson complete (`06`) | 3 | 2 | 4 | 3 | Drawn stars and signal bars are good. Old mascot; two equally loud buttons ("Again" blue, "Back to the path" green); confetti specks. R12. |
| Day look (`09`) | 3 | – | 4 | 3 | An early test, as planned. Reads fine. R20. |
| Building blocks page (`10`–`12`) | 4 | 4 | – | 5 | The parts R09–R15 will use are ready, including the bottom sheet and "PICK ONE". |

**Overall: 3.4 out of 5.** The frame is a finished Night Signal app; the lessons aren't yet. The plan already does them next, so no big re-think is needed.

## What matches look A, and what doesn't yet
- **Matches:** colours (all from the token file; the Duolingo-colour test passes), letters (Space Grotesk, JetBrains Mono for numbers), our own icons, the path map, the top bar (flame 4, bolt 120, goal bar "1 of 2"), the bottom tabs, the dark radial glow.
- **Not yet:** Beacon (look A's thin lattice tower with a round glowing head; the app still shows the old triangle), the question layout (Beacon + bubble at the top left, "PICK ONE", numbered tiles), the "Not quite" bottom sheet with its red Continue, the heatmap.
- **Different on purpose:** look A puts a "Daily review · 6 due" card at the top of the path. The app keeps that card *and* a Review tab with a badge (decided in R05). Because the path opens scrolled to your lesson, the card is usually off screen, so the tab badge is what you see. Fine as it is.

## Fixed in this review
| # | What was wrong | Fix | Proof |
|---|---|---|---|
| 1 | Switching from a tab that scrolls (Path) to one that doesn't (Review, sometimes Heatmap or Settings) moved the top bar, the tabs and the page sideways by the scrollbar's width (7.5 px in the test window, about 8 px in the gallery). `DESIGN.md` 7.4 says "nothing jumps". | `app/src/theme/theme.css`: `scrollbar-gutter: stable` on the page, so the scrollbar's strip is always kept. | New click test in `tests/frame.spec.ts` ("switching tabs doesn't shift the frame sideways"): it failed before the fix (top bar at x 40 instead of 32.5) and passes with it. |
| 2 | The top bar showed "+0" beside the XP at the start of every day (noted as weak in R07). | `app/src/ui/TopBar.tsx`: today's XP shows only when it's above 0. | `tests/topbar.spec.ts`, repair-card test: no "XP today" element when none was earned. The other top bar tests still check "+30 XP today". |
| 3 | The lesson-complete confetti (200 pieces, about 3 s) kept falling over the path while "coming on air" played: two celebrations at once (idea I23). | `app/src/LessonPlayer.tsx`: leaving the lesson clears its confetti, and a burst still waiting to start never starts. | New click test in `tests/smooth.spec.ts` ("leaving the lesson clears its confetti"): failed before, passes now. |
| 4 | **"Coming on air" fell under the 50 fps bar on GitHub's Windows machines**: 49.2 and 49.8 fps on this pull request's first two runs, and 47.9 (plus "unit done" 47.9) on R07's last run, which is the same app code as `main`. A trace with the CPU slowed 6x showed the busiest stretch at 1.2-1.8 s, where the top bar's moment (starting at 1.4 s) overlapped the end of the path's moment (the new current circle's bounce, a spring that ends at about 1.6 s). R07's timing test checked every part of "coming on air" except the springs. | `app/src/theme/motion.tsx`: `TOP_BAR.afterPath` 1.4 → 1.6 s, so one celebration really ends before the next starts (idea I29). | 6x slower CPU, 5 runs each: 52.0-55.1 fps at 1.6 s, against 45.3-56.1 at 1.4 s. Unit test (`motion.test.ts`) now also checks the springs (`arrive`, `check`, `bannerCheck`) and the unit's last wave ring. All 44 click tests pass (60 fps in the cloud); the Windows build on this pull request. |

## Plan changes (in `docs/redesign/PLAN.md`)
- **R17 "Beacon is drawn" moves up, to right after this review.** R09 (question screen), R10, R11 and R12 all place Beacon (58 px above questions, 96–140 px on lesson complete, DESIGN.md section 8). Building them around the old triangle and swapping it later means placing and checking every screen twice. R17 only draws Beacon and its faces and replaces the old tower, so it doesn't need anything from R09–R16. R18 "Beacon reacts" stays after R12, because it hooks Beacon into those screens.
- **Notes added to rows** (no new sessions): R09 uses the R03 bottom sheet and makes Continue match the answer (red after "Not quite"); R11 drops the confetti after each right answer (DESIGN.md moment 2 has a tile glow and Beacon's ring pulse, no confetti) (I31); R12 gives lesson complete one main button (I32).
- Nothing else moves. The heatmap (worst score) stays at R14: the lessons matter more, because that's where your time goes.

## Ideas board (`docs/redesign/IDEAS.md`)
- **New:** I31 (no confetti after each right answer, with R11), I32 (one main button on lesson complete, with R12), I33 (a slimmer scrollbar that only runs beside the page, not beside the top bar and tabs).
- **Re-ordered:** ideas tied to a planned session are listed first, in session order, so each session sees them; then the free ideas in the order they should be done after R24 (the ones that make the path and top bar clearer first: I30, I18, I20, I22, I21, I02...); done ideas at the bottom.

## DESIGN.md change
- Section 4 gets one line: the page always keeps the scrollbar's strip (`scrollbar-gutter: stable`), so nothing jumps sideways between screens. **Why:** fix 1 above.

## How the Windows frame-rate failure was found (fix 4)
- First run: 49.2 fps. Keeping the scrollbar strip (fix 1) wasn't the cause: at 6x slower CPU it measured 51.4 / 55.3 / 51.5 fps with fix 1 and 53.6 / 52.6 / 49.5 without.
- Second run: 49.8 fps, so it was real. R07's last run (same app code as `main`) had failed it too.
- Clearing the confetti (fix 3) is right, but it didn't change the number (the confetti draws on its own thread).
- A trace pointed at the overlap of the two moments; the later top bar start fixed it (fix 4).

## What I didn't check
- Movement only through the click tests' measurements and the earlier sessions' flip books: this review takes still pictures. The frame rates in this run are in the handoff note.
- Your PC: the Windows build on GitHub runs the same tests; anything only your graphics chip shows (like the start-up picture, T57) still needs your eyes.
