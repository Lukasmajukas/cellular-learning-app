# Design review 4: the whole app after the first 7 idea chats (task T59, the 8th idea chat after R24)

**Status:** DONE · **Reviewed:** the whole gallery, taken fresh at the start of this review: 101 Night pictures (54 screens, most at 620 × 960 and 1280 × 800, the 4 phone-narrow ones at 360 × 640, plus the icon sheet) and the 101 Day ones, against `docs/redesign/DESIGN.md`, the look A picture and design review 3; plus the handoff notes of the 7 idea chats since (I59, I58, I78, I69, I30, I44, I64) · **By:** Large (Opus), High effort, robot run · **Date:** 2026-11-05

## In simple words (for the owner)
Since the last check, the robot did 7 small improvements: "Again" got its own arrow, the four tab tops became one shared piece, the welcome's keys match their numbers, a "Couldn't save" warning, the top bar waits for its moment, one "signal locked" moment after a right answer, and the unlock sound lands with Beacon's happy ring. This review walked through every screen again, in Night and in Day, to check that those 7 changes fit in.

- **They fit.** Every screen still uses the same colours, letters, icons, cards, buttons and movements. The score stays at **4.7 out of 5** (a hair higher inside: the top bar, the right-answer moment and the notices each went up a point somewhere).
- **No screen was wrong this time.** The one thing that looked wrong was the camera, not the app: in one gallery picture a button looked 3% bigger than the same button in a lesson. It was only because the mouse was resting on it (buttons grow a little under the mouse). I fixed the picture-taker: it now moves the mouse out of the way before every picture, so pictures always show buttons at their real size. That also crossed one idea off the board (I79), because the difference it described was never real.
- **The ideas board has a new order** (below). Next up: the narrow lesson-complete line (I61), then a "flip book" of each animation in the gallery (I10), so the next review can see movement, not only still pictures.

## Scores (1 = poor, 5 = great)
"One app" = does it belong with the screens around it? In brackets: the score in design review 3. Each screen was checked in Night and Day.

| Screen (gallery pictures) | Look | Movement | Clear | One app | Notes |
|---|---|---|---|---|---|
| Path map (`01`, `14`, `15`, `39`, `47`) | 5 (5) | 5 (5) | 5 (5) | 5 (5) | The unlock sound and Beacon's happy ring now start in the same instant (I64). The checkpoint still looks like any other lesson (I21, noted in all four reviews). |
| Top bar (`01`, `14`) | 4 (4) | 5 (4) | 4 (4) | 5 (5) | Its numbers now wait for its own moment, 1.6 s in (I30). Still two "+10"s side by side during the moment (I85). |
| App frame and tabs | 5 (5) | 4 (4) | 5 (5) | 5 (5) | The four tab tops are now one shared piece (I58): label, title and the 16 px under them match on every tab. The whole head still glides when you switch tabs (I82); the scrollbar still runs beside the top bar (I33). |
| Learn card (`02`, `18`) | 4 (4) | 4 (4) | 5 (5) | 5 (5) | Unchanged. |
| Pick one (`03`) | 5 (5) | 5 (5) | 5 (5) | 5 (5) | Unchanged. |
| Right / Not quite (`04`, `05`) | 5 (5) | 5 (4) | 5 (5) | 5 (5) | The tile's pop, Beacon's ring and the progress bar's spark are now one "signal locked" moment, 0.08 s after the answer (I44). On the first question the spark sits on an empty bar (I89). |
| Other question types (`19`–`27`, `53`, `54`) | 4 (4) | 4 (4) | 5 (5) | 5 (5) | Unchanged. When a tall "Not quite" panel opens (the order question with its ruler shown, `23`), the page scrolls up 16 px so the marked tiles stay in sight, and the lesson's top row (✕ and progress bar) moves up with it (new idea I92). Some prompts still say "(type the number)" (task T63). |
| Comeback (`28`) | 4 (4) | 4 (4) | 5 (5) | 5 (5) | Unchanged. |
| Lesson complete (`06`, `29`, `50`) | 5 (5) | 5 (5) | 5 (5) | 5 (5) | "Again" has its own restart arrow (I59), so the two-arrow icon only ever means review. On a phone-narrow window Beacon's line is still squeezed (I61). |
| Review tab (`13`, `30`, `31`) | 5 (5) | 4 (4) | 5 (5) | 5 (5) | Unchanged; its head is now the shared one (I58). |
| Notices (`32`, `33`, `55`) | 4 (4) | 4 (4) | 5 (5) | 5 (4) | The new "Couldn't save your last change" notice (I69) matches "Your progress is safe" exactly (same card, icon size, words' colour and the same 25 px gap above the tab's head), checked side by side in both looks. |
| Heatmap (`07`, `34`, `35`, `44`) | 5 (5) | 4 (4) | 5 (5) | 5 (5) | Unchanged; its head is now the shared one (I58). |
| Settings (`08`, `36`–`38`, `48`, `52`) | 5 (5) | 4 (4) | 5 (5) | 5 (5) | Unchanged. |
| Day look (`day/`) | 4 (4) | 4 (4) | 5 (5) | 5 (5) | Every new piece since review 3 (the restart arrow, the "Couldn't save" notice, the welcome's keys) has its Day colours. The dim layer behind a sheet still washes the page almost white (I66). |
| Beacon (`16`, `17`) | 5 (5) | 5 (5) | – | 5 (5) | Unchanged. |
| Start screen and welcome (`40`–`43`) | 5 (5) | 4 (4) | 5 (5) | 5 (5) | The goal keys now match their counts: 1, 2, 3 and 5 (I78). |
| "No signal" screens (`45`, `46`) | 4 (4) | – | 5 (5) | 5 (5) | Unchanged. |
| Phone-narrow window (`47`–`50`) | 4 (4) | – | 5 (5) | 5 (5) | Unchanged; only the lesson-complete line is cramped (I61). |
| Building blocks page (`10`–`12`) | 4 (4) | 4 (4) | – | 5 (5) | Its "Not quite" Continue is the same 400 px as in a lesson (measured in the app); the picture showed it under the mouse (fixed, below). |

**Overall: 4.7 out of 5 (review 3: 4.7; review 2: 4.4; review 1: 3.4).** The average of every score above (4.71). The 7 idea chats polished moments without breaking anything: three scores went up, none went down.

Movement scores come from the click tests' frame-rate measurements (the whole set ran in this review, see "Checks") and the idea chats' own flip books (I30: 58-60 fps; I44: 60 fps; I64: 60 fps; I69: 60 fps). This review takes still pictures; I10 (a flip book in the gallery) moved up so the next one can see movement.

## What matches look A, and what doesn't yet
- **Matches:** everything look A shows, as in review 3.
- **Different on purpose (kept):** the same as in reviews 2 and 3 (a plain cross in "Not quite"; a Review tab as well as the Daily review card).
- **Not in look A, and consistent with each other:** the Day look, the start screen, the welcome, the error screens, the Keys sheet, the three warm notices (now including "Couldn't save"), every fold-out, every sheet's column.

## Fixed in this review
| # | What was wrong | Fix | Proof |
|---|---|---|---|
| 1 | Gallery pictures could catch a button under the mouse. Buttons grow 3% on hover (`app/src/ui/press.ts`), and the picture-taker left the mouse wherever it last clicked. In `12-blocks-sheet`, "Show 'Not quite'" sits at the bottom of the page, the sheet slides up under the resting mouse, and its Continue looked 410 px wide against 397 px in a real lesson (`04-feedback-wrong`). That's what idea I79 described: it was the picture, not the app. | `app/tools/gallery.mjs`: before every picture, the mouse moves to the window's top-left corner, where there's never a button. | Measured in the running app (a one-off probe at 620 × 960): the blocks page's Continue is 400 px wide at x 103, the same as a lesson's. In the new gallery, `12-blocks-sheet` and `04-feedback-wrong` show the same width (see "Checks"). |

## Plan changes (in `docs/redesign/PLAN.md`)
- Design review 4 noted under "After R24". The next design review is the 8th idea chat after this one (design review 5).

## Ideas board (`docs/redesign/IDEAS.md`)
New order (the owner's own wishes still go first):
1. **I61** (the lesson-complete line on a narrow window): the one cramped spot in the whole app.
2. **I10** (a flip book of each animation in the gallery): moved up from 7th. Review 3 asked for it before this review and it didn't get there; three of the seven idea chats since were about timing, which no still picture shows.
3. **The moments you see most, now that they're one beat:** I89 (a lit stub on an empty progress bar, so the first answer's spark has a tip), I85 (one "+10" during the top bar's moment, not two), I47 (the stars ring as they land).
4. **The path:** I21 (checkpoints get their own shape: noted in all four reviews), I20, I22, I02.
5. **The keyboard:** I73 (the heatmap grid with arrow keys), I74 (letters for "put them in order").
6. **Speed on slow PCs:** I75, I76; then I77, I87, I91 once the Windows build runs again (T62).
7. **The new ideas from the idea chats**, in the order they came: I81, I82, I83, I84, I86, I88, I90; then the new ones from this review (I92, I93) and I80.
8. Everything else, in the order it was.

**Crossed out:** I79 (the building blocks page's Continue was never wider than a lesson's; the picture caught it under the mouse: fix 1).

New ideas from this review: **I92** (the lesson's top row stays put when the page scrolls to keep the marked tiles above a tall "Not quite" panel), **I93** (the gallery shows the same answer order every time, so Night and Day pictures and the reviews compare like with like: today `05-feedback-right` has "Normal" first in Night and "Upside-down" first in Day).

## For a normal task (not the redesign: it's lesson words)
- Still open: T63 ("(type the number)" in prompts, `19`/`20`) and T61 ("UL" and "DL" in the "Right!" panel, `05`). Both are already rows in `TASKS.md`.

## DESIGN.md changes
- None. Nothing in this review broke or needed a new rule.

## Checks
- Unit tests: 269 of 269 pass.
- Click tests: see the handoff note (`docs/sessions/2026-11-05-session-152-t59-design-review-4.md`) for the full run.
- The gallery, taken again after fix 1 in Night and Day.

## What I didn't check
- Movement only through the click tests' measurements and the idea chats' flip books (I10 will fix this).
- Sound: a cloud chat can't listen.
- Your PC: the Windows build on GitHub still hasn't run since 2026-11-05 09:17 UTC (T62), so nothing here was seen on Windows.
