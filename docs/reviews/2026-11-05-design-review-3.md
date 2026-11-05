# Design review 3 (final): the whole app against DESIGN.md (task T59, session R24)

**Status:** DONE · **Reviewed:** the whole gallery, taken fresh at the start of this review: 99 Night pictures (49 screens at 620 × 960 and 1280 × 800, the 4 phone-narrow ones at 360 × 640, the icon sheet) and the 99 Day ones, against `docs/redesign/DESIGN.md`, the look A picture (`docs/redesign/looks/look-a-night-signal.webp`) and design reviews 1 and 2; plus the handoff notes of R18 to R23 · **By:** Large (Opus), High effort, robot run · **Date:** 2026-11-05

## In simple words (for the owner)
This is the last check of the 24-step makeover. Last time every room of the house was done, and I checked that it felt like one house. Since then the robot added Beacon's reactions, real sounds, the Day look, a start screen and welcome, phone-narrow windows and the keyboard, and made it all lighter for the computer. So this time I walked through every room again, in the dark (Night) and in daylight (Day), and looked for anything that didn't match.

- **It matches.** Every screen uses the same colours, letters, icons, cards, buttons and movements, in both looks. The overall score went from 4.4 to **4.7 out of 5**.
- **I found three small places that didn't match, and fixed them:**
  1. **A long panel's words sat a little to the left.** When a panel from the bottom is long enough to scroll (like a band's list of lessons on the Heatmap), its scrollbar pushed everything 8 px to the left of the page above it. Now its words start exactly where the page's do, at every window size.
  2. **"What happened" had the browser's own little triangle.** On the "No signal" screens, the fold-out used a plain grey triangle in front of the words. Every other fold-out in the app ("Clue by clue", "Show them on the ruler") has our own arrow after the words. Now this one does too, pointing down when closed and up when open.
  3. **"Type the number" was said three times.** On a type-the-number question, the small label said "TYPE THE NUMBER", and the help line under the question said "Type the number" again. The help line now says something useful instead: "Commas are fine, and so is GHz."
- **The 24 planned sessions are done.** From now on, the robot keeps improving the app one idea at a time from the ideas board, which this review put in a new order. Your own wishes always go first.

## Scores (1 = poor, 5 = great)
"One app" = does it belong with the screens around it? In brackets: the score in design review 2, where there was one. Each screen was checked in Night and Day.

| Screen (gallery pictures) | Look | Movement | Clear | One app | Notes |
|---|---|---|---|---|---|
| Path map (`01`, `14`, `15`, `39`, `47`) | 5 (5) | 5 (4) | 5 (5) | 5 (5) | Beacon stands beside your lesson and is happy when one comes on air (R18); the path scrolls with a fifth less work (R23). The checkpoint still looks like any other lesson (I21). |
| Top bar (`01`, `14`) | 4 (4) | 4 (4) | 4 (4) | 5 (5) | Unchanged. The new numbers still show before the top bar's moment plays (I30). |
| App frame and tabs | 5 (5) | 4 (4) | 5 (5) | 5 (5) | All four tab heads still line up (review 2's test). The scrollbar still runs beside the top bar and the tabs (I33). |
| Learn card (`02`, `18`) | 4 (4) | 4 (4) | 5 (5) | 5 (5) | Unchanged. |
| Pick one (`03`) | 5 (5) | 5 (4) | 5 (5) | 5 (5) | Beacon now speaks only when it matters (R18), and costs almost nothing while you read (R23). |
| Right / Not quite (`04`, `05`) | 5 (5) | 4 (4) | 5 (5) | 5 (5) | Still the closest to look A. |
| Other question types (`19`–`27`, `53`, `54`) | 4 (4) | 4 (4) | 5 (4) | 5 (4) | Every type now works from the keyboard (R22) and has a tick or a cross (never colour alone). The number hint repeated the label (fix 3). The demo drawing's serif caption is a sample-only picture. |
| Comeback (`28`) | 4 (4) | 4 (4) | 5 (5) | 5 (5) | Beacon thinks it over and says "This one again" (R18). |
| Lesson complete (`06`, `29`, `50`) | 5 (4) | 5 (5) | 5 (4) | 5 (4) | The lesson's name replaced the top row, and the block sits in the middle (R18). On a phone-narrow window Beacon's line is squeezed to about 100 px (I61). |
| Review tab (`13`, `30`, `31`) | 5 (5) | 4 (4) | 5 (5) | 5 (5) | Unchanged; still the most "radio" screen. |
| Notices (`32`, `33`) | 4 (4) | 4 (4) | 5 (5) | 4 (4) | Unchanged. "This changed" only says what changed in words (I51, needs a content task first). |
| Heatmap (`07`, `34`, `35`, `44`) | 5 (4) | 4 (4) | 5 (5) | 5 (4) | Clean warm "okay" tiles (R20). Its sheet's words sat 8 px left of the page (fix 1). The fill-in's first frames are the slowest moment on a slow PC (I76); Tab stops 33 times in the grid (I73). |
| Settings (`08`, `36`–`38`, `48`, `52`) | 5 (4) | 4 (4) | 5 (4) | 5 (5) | Shorter, with the keys in a sheet (R22). |
| Day look (`day/`) | 4 (3) | 4 (–) | 5 (4) | 5 (3) | Every screen in Day, with a test that reads every word's colour (R20). The dim layer behind a sheet washes the page almost white (I66). |
| Beacon (`16`, `17`) | 5 (5) | 5 (4) | – | 5 (5) | Six faces; its rings breathe on their own layer (R23). |
| Start screen and welcome (`40`–`43`) | 5 (–) | 4 (–) | 5 (–) | 5 (–) | Beacon and the name from the very first moment. On the welcome's goal page the keys are 1-4 but the choices are 1, 2, 3 and 5 lessons, so "4" sits beside "5 lessons" (I78). |
| "No signal" screens (`45`, `46`) | 4 (–) | – | 5 (–) | 5 (–) | Kind words, the warm notice colour, never red. Its fold-out had the browser's triangle (fix 2). |
| Phone-narrow window (`47`–`50`) | 4 (–) | – | 5 (–) | 5 (–) | Everything fits at 360 px with nothing scrolling sideways; only the lesson-complete line is cramped (I61). |
| Building blocks page (`10`–`12`) | 4 (4) | 4 (4) | – | 5 (5) | A page for testing; unchanged. |

**Overall: 4.7 out of 5 (review 2: 4.4; review 1: 3.4).** The average of every score above. The Night Signal redesign is done: what's left is polish, which is what the ideas board is for.

Movement scores come from the click tests' frame-rate measurements (R23's speed check: every animation 41–59 fps with the computer slowed to a quarter speed, 57+ fps at full speed) and the earlier sessions' flip books: this review takes still pictures.

## What matches look A, and what doesn't yet
- **Matches:** everything look A shows: the path, the top bar, the tabs, Beacon (both faces), the question layout with "PICK ONE" and numbered tiles, the right and wrong tile looks, the "Not quite" sheet with its red Continue, the colours and the letters.
- **Different on purpose (kept):** the same as in review 2 (a plain cross in "Not quite"; a Review tab as well as the Daily review card).
- **Not in look A, and consistent with each other:** the Day look, the start screen, the welcome, the error screens, the Keys sheet, every fold-out (now all with our chevron), every sheet's column (now always on the page's column).

## Fixed in this review
| # | What was wrong | Fix | Proof |
|---|---|---|---|
| 1 | A bottom sheet tall enough to scroll (a band's 15 lessons on the Heatmap) has its own scrollbar, which takes its width from the right. Centring the column in what was left moved the words 7-8 px left of the page's column (gallery `35-heatmap-sheet`: the sheet's title at 95 px, the page's at 103 px). A short sheet (the Keys sheet) was fine. | `app/src/ui/BottomSheet.tsx`: the sheet measures its whole width (scrollbar included) and starts its column at half of what's left over, like the page does. | New click test (`tests/review3.spec.ts`): at 620 × 960, 1280 × 800, 480 × 760 and 360 × 640, the tall B71 sheet (it does scroll) and the short Keys sheet both start within 1 px of the page's label. On the old build: 8 px off at 620 × 960. |
| 2 | "What happened" on the "No signal" screens was a plain `<details>` with the browser's own grey triangle in front of the words; every other fold-out in the app has our chevron icon after its words ("Clue by clue", "Show them on the ruler"). | `app/src/Trouble.tsx`: no browser triangle; our `chevron` after the words, pointing down when closed and up when open, the same turn as the lesson's folds. | New click test (`tests/review3.spec.ts`): the summary isn't a list item (that's what draws the triangle), shows a chevron after the words at 90°, then −90° once open. On the old build it failed. |
| 3 | On a type-the-number question the label says "TYPE THE NUMBER" and the help line under the question said "Type the number. Commas are fine." | `app/src/questionScreen.ts`: the help line is "Commas are fine, and so is GHz." (the box takes "1,710" and "2.5 GHz"). | The unit test for hints (short, no digits) still passes; `tests/typeslook.spec.ts` checks the new words. |

## Plan changes (in `docs/redesign/PLAN.md`)
- **R24 ✅.** The 24 planned sessions are done; the Night Signal redesign is done.
- **From now on:** each redesign chat takes the top idea in `IDEAS.md`; the 8th of those chats is design review 4.

## Ideas board (`docs/redesign/IDEAS.md`)
New order for the chats after R24 (the owner's own wishes still go first):
1. **Things that keep screens consistent, small and cheap:** I59 (a restart icon for "Again", so the repeat icon only means review), I58 (one shared tab head block), I78 (new: the welcome's goal keys match the lesson counts).
2. **A silent loss:** I69 (a "Couldn't save" notice). A save that fails today says nothing, so a finished lesson could be lost without you knowing. Moved up: it matters more than any polish.
3. **Polish of the moments you see most:** I30 (the top bar's numbers wait for its moment), I44 (one "signal locked" moment), I64 (Beacon's happy ring with the unlock sound), I61 (the narrow lesson-complete line), I47 (the stars ring as they land).
4. **The path:** I21 (checkpoints get their own shape; noted in all three reviews), I20 (tap the lesson's name), I22 (one line through every unit), I02 (signal bars under finished lessons).
5. **Speed on slow PCs:** I75, I76, then I77 once the Windows build runs again (T62).
6. **The keyboard:** I73 (the heatmap grid with arrow keys), I74 (letters for "put them in order").
7. **For the next review:** I10 (a "flip book" strip of each animation in the gallery), so design review 4 can see movement and not only still pictures.
8. Everything else, in the order it was.

New ideas from this review: **I78** (above), **I79** (the "Not quite" sheet on the building blocks page has a Continue 12 px wider than in a real lesson: the blocks page should show the real thing), **I80** (the welcome and the "No signal" screens could share the lesson-complete screen's "middle of the window" layout code, so the three centred screens can't drift apart, like I58 does for the tabs).

## For a normal task (not the redesign: it's lesson words)
- Some type-the-number questions in the lesson files end with "(type the number)" (for example `content/lessons/unit-01/lesson-5-check.yaml`). With the label above, that's said twice. Taking it out of the prompts is a content change, so it's a row in `TASKS.md`, not changed here.
- Still open from review 2: "UL" and "DL" aren't explained in the "Right!" sheet for "Is B71 normal or upside-down?" (already in `TASKS.md`).

## DESIGN.md changes
- The top: the 24 sessions are done (2026-11-05); the guide stays the rulebook for every idea chat. **Why:** this review.
- Section 6: a sheet's words always start on the page's column, whether the sheet scrolls or not. **Why:** fix 1.
- Section 6: every fold-out has our chevron after its words, pointing down when closed and up when open; never the browser's triangle. **Why:** fix 2.
- Section 6: a question's help line never repeats its label; it says something the label doesn't. **Why:** fix 3.

## What I didn't check
- Movement only through the click tests' measurements and the earlier sessions' flip books.
- Sound: a cloud chat can't listen (R19 picked the sounds by measuring them).
- Your PC: the Windows build on GitHub hasn't run since 2026-11-05 09:17 UTC (T62), so nothing here was seen on Windows. Anything only your graphics chip shows (the start-up picture, T57) still needs your eyes.
