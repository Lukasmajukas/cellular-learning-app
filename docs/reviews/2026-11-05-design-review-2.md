# Design review 2: every screen together (task T59, session R16)

**Status:** DONE · **Reviewed:** all 77 pictures of the gallery, taken fresh at the start of this review (38 screens, each at 620 × 960 and 1280 × 800, plus the icon sheet), against `docs/redesign/DESIGN.md`, the look A picture (`docs/redesign/looks/look-a-night-signal.webp`) and design review 1; plus the handoff notes of R17 and R09 to R15 · **By:** Large (Opus), High effort, robot run · **Date:** 2026-11-05

## In simple words (for the owner)
Last time I looked at a house halfway through a renovation. This time every room is done, so I walked through all of them one after another and asked: **does this feel like one house?**

- **Mostly yes.** Every screen is now dark, calm and glowing, with the same colours, letters, icons, cards and buttons. The lesson screens, which scored 2 out of 5 last time, now look just like the picture you picked (the "Not quite" panel with its red Continue is almost a copy of it). The heatmap went from 2 to 4.
- **I found three places where one screen did something its neighbours don't, and fixed them:**
  1. **The "Check" button before you can press it** looked like a muddy blue-green smudge (the bright blue, half see-through). It's now dark with a thin outline and grey words, and turns bright blue the moment you can press it. You see this on three kinds of question (matching, putting in order, clue cards).
  2. **"Got it" had two colours.** On a learn card it was green; on the "This changed" card it was blue. Green means "you got it right" everywhere else in the app, and nothing was answered yet, so the learn card's "Got it" is blue now.
  3. **The Path tab started differently from the other three tabs.** Review, Heatmap and Settings each have a small coloured label above a big title ("DRIVE TEST / Daily review"). The Path tab had only its title, a little lower down. It now has its own label, "SIGNAL PATH", and all four tabs start at exactly the same height. You see this when you scroll to the top of the path, or when a notice is showing.
- **No change of order.** The rest of the plan (Beacon reacts, sound, Day look, first start, window sizes, speed check, final review) is still the right order. I pinned three small ideas to the sessions that will touch those screens anyway.

## Scores (1 = poor, 5 = great)
"One app" = does it belong with the screens around it? In brackets: the score in design review 1, where there was one.

| Screen (gallery pictures) | Look | Movement | Clear | One app | Notes |
|---|---|---|---|---|---|
| Path map (`01`, `14`, `15`) | 5 (5) | 4 (4) | 5 (5) | 5 (5) | Still the closest to look A. Its head now matches the other tabs (fix 3). The checkpoint still looks like any other lesson (I21). |
| Top bar (`01`, `14`) | 4 (4) | 4 (4) | 4 (4) | 5 (5) | Unchanged since review 1. The new numbers still show before the top bar's moment plays (I30). |
| App frame and tabs | 5 (4) | 4 (4) | 5 (5) | 5 (4) | No sideways jump; every tab now opens with the same head (fix 3). The scrollbar still runs beside the top bar and the tabs (I33). |
| Learn card (`02`, `18`) | 4 (2) | 4 (2) | 5 (4) | 5 (2) | Beacon with a bubble, "SOMETHING NEW", the radio ruler in a raised card. "Got it" was on-air green; now signal blue (fix 2). |
| Pick one (`03`) | 5 (3) | 4 (3) | 5 (4) | 5 (3) | Look A's layout: Beacon and bubble top left, "PICK ONE", numbered tiles. |
| Right / Not quite (`04`, `05`) | 5 (2) | 4 (2) | 5 (4) | 5 (2) | The bottom sheet from R03; Continue matches the verdict (red after "Not quite"), as in look A. The right tile pops and glows (R11). |
| Other question types (`19`–`27`) | 4 (–) | 4 (–) | 4 (–) | 4 (–) | All on one left edge, one full-width Check. The Check you can't press yet was a muddy teal (fix 1). Match's right column has no keys yet (I41, with R22). The demo drawing's caption uses a serif letter (it's a sample-only picture, not in real lessons). |
| Comeback (`28`) | 4 (–) | 4 (–) | 5 (–) | 5 (–) | A quiet "Comeback" pill beside "PICK ONE". |
| Lesson complete (`06`, `29`) | 4 (3) | 5 (2) | 4 (4) | 4 (3) | The signal burst, stars, XP meter and signal bars are the best moment in the app. But the lesson's top row (close button, full bar, "3 / 3") stays, so it still reads a little like a question (I46), and on a tall window the block sits high with ~370 px empty under it (I48). Both pinned to R18. |
| Review tab (`13`, `30`, `31`) | 5 (4) | 4 (3) | 5 (5) | 5 (4) | The radar "drive test" is the most "radio" screen in the app. |
| Notices (`32`, `33`) | 4 (–) | 4 (–) | 5 (–) | 4 (–) | Clear and kind; they glide in. "This changed" only says what changed in words (I51, needs a content task first). |
| Heatmap (`07`, `34`, `35`) | 4 (2) | 4 (2) | 5 (2) | 4 (2) | Big jump. The "okay" tiles still read olive-brown next to the clean green and red (I52, pinned to R20, which works on the colour tokens). |
| Settings (`08`, `36`–`38`) | 4 (4) | 4 (4) | 4 (4) | 5 (4) | Every row has its icon. About two screens tall at 620 × 960 (I57, pinned to R22, window sizes). |
| Day look (`09`, `38`) | 3 (3) | – | 4 (4) | 3 (3) | Still the early test, as planned. R20. |
| Beacon (`16`, `17`) | 5 (–) | 4 (–) | – | 5 (–) | Six faces, matches look A's mascot. |
| Building blocks page (`10`–`12`) | 4 (4) | 4 (4) | – | 5 (5) | Shows the new "not ready" button look ("Not yet"). |

**Overall: 4.4 out of 5 (review 1: 3.4).** The whole app is now one Night Signal app. What's left is polish (Beacon joining in, sound, the Day look, first start, window sizes, speed), which is what the rest of the plan does.

Movement scores come from the click tests' frame-rate measurements (every moment 58.5–60 fps in the cloud, 50–64 on the Windows build; see the R11–R15 handoff notes) and the earlier sessions' flip books: this review takes still pictures.

## What matches look A, and what doesn't yet
- **Matches:** everything look A shows: the path, the top bar, the tabs, Beacon (both faces), the question layout with "PICK ONE" and numbered tiles, the right and wrong tile looks, the "Not quite" sheet with its red Continue, the colours and the letters.
- **Different on purpose (kept):** look A's "Not quite" title has a circled cross; the app uses a plain cross, like every other cross in our icon set. Look A shows the "Daily review · 6 due" card at the top of the path; the app keeps that card and a Review tab with a badge (review 1).
- **Not in look A, and now consistent with each other:** the four tab heads (label + 28 px title, 16 px from the top bar), every "Got it" (signal blue), every button you can't press yet (dark with an outline).

## Fixed in this review
| # | What was wrong | Fix | Proof |
|---|---|---|---|
| 1 | A button you can't press yet (Check before you've answered every part; "Back up now" before the save folder is known) was its bright colour at half see-through. On the night background the signal blue became a muddy teal (gallery `21-match`, `22-order`, `24-scenario`): idea I42. | `app/src/ui/tones.ts`: a new look, `BUTTON_OFF` (`surface2`, quiet `textMuted` words, a `borderStrong` outline). `app/src/ui/Button.tsx`: a disabled button wears it, whatever its kind, at full strength (no half see-through), and gets `data-off`. | Unit test (`src/ui.test.ts`): the look, its words pass the contrast test in Night (and Day), and the button uses it. Click test (`tests/typeslook.spec.ts`): the disabled Check is `rgb(19, 42, 70)` with `rgb(142, 163, 191)` words and solid, then signal blue with dark words once a number is typed. |
| 2 | The learn card's "Got it" was on-air green, while the "This changed" card's "Got it" is signal blue. DESIGN.md section 2 keeps on-air for right answers and finished lessons; review 1 already marked it down. No earlier decision chose green. | `app/src/LessonPlayer.tsx`: the learn card's "Got it" is the default signal button. | Click test (`tests/typeslook.spec.ts`): `learn-ok` has `data-kind="signal"`. It failed on the old build ("onAir") and passes now. |
| 3 | The Path tab's head was only its title, 20 px below the top bar; the other three tabs have a small coloured label over a 28 px title, 16 px below it. Switching tabs moved the head down and back. | `app/src/PathMap.tsx`: a "SIGNAL PATH" label (signal blue) over "Your path", 16 px from the top, like the others. Every tab's label has the test ID `tab-label`. | New click test (`tests/frame.spec.ts`, "every tab starts the same way"): on all four tabs the label and the title sit at the same height and edge, and the title is 28 px. It failed on the old build and passes now. |

## Plan changes (in `docs/redesign/PLAN.md`)
- **No rows move.** R18 (Beacon reacts) next is still right: it finishes the lesson screens, where your time goes. Sound (R19) and the Day look (R20) are each self-contained. R22 (window sizes) and R23 (speed) are best after everything is built.
- **Notes added to rows** (no new sessions):
  - R18 also does I46 (the lesson-complete screen drops the lesson's top row, so it reads as "finished") and I48 (centres the block on a tall window). R18 places Beacon on that screen anyway.
  - R20 also does I52 (a warm dark `streakBg` fill for the heatmap's "okay" tiles). R20 works on the colour tokens anyway.
  - R22 also does I57 (Settings shorter at 620 × 960). R22 checks every window size anyway.

## Ideas board (`docs/redesign/IDEAS.md`)
- **Done here:** I42 (the "not ready" button look).
- **Pinned to sessions:** I46 and I48 → R18; I52 → R20; I57 → R22 (listed in session order with the other pinned ideas).
- **New:** I58: one shared "tab head" building block (label, title, help line) used by all four tabs, so they can't drift apart again (each tab draws its own today; this review lined them up by hand). I59: the "repeat" icon means two things: "review" (the Review tab, "Start the review", the path's Daily review card, the "Comeback" pill) and "Again" on lesson complete. Give "Again" its own icon (a restart arrow), so the review icon only ever means review.

## For a normal task (not the redesign: it's lesson words)
- The "Right!" sheet for "Is B71 normal or upside-down?" says "The bands file says B71 is FDD, UL above DL." "UL" and "DL" aren't explained for a beginner there. The words come from the bands data (`duplex`), through the question template. Changing them is a content task, so it's written here and in `TASKS.md`, not changed.

## DESIGN.md changes
- Section 6: a button you can't press yet has its own look (dark `surface2`, an outline, quiet words), never a half see-through bright one. **Why:** fix 1.
- Section 6: every tab starts with the same head: a small label in the tab's colour, then the 28 px title, 16 px below the top bar. **Why:** fix 3.
- Section 2: "Got it" and other "go on" buttons that don't follow an answer are signal blue; on-air green is only for after a right answer and for finished things. **Why:** fix 2.

## What I didn't check
- Movement only through the click tests' measurements and the earlier sessions' flip books.
- Your PC: the Windows build on GitHub runs the same tests; anything only your graphics chip shows (the start-up picture, T57) still needs your eyes.
