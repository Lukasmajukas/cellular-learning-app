# Handoff note: 2026-11-04, T59 R09 Question screen

**Status:** DONE
**Model used:** Large (Opus), High effort (a robot run claimed it and handed it to this Opus chat) · **Branch / pull request:** claude/robot-r09, #133

## In simple words (for the owner)
The question screen now looks like the Night Signal picture you picked. At the top: the close button, a progress bar that starts blue and turns green as you go, and a counter like "5 / 12". Beacon stands at the left with a speech bubble ("Take your time.", "Spot on!", "Almost. The answer is below."). A small blue "PICK ONE" sits above the question, and the question and its numbered answers line up on the left. After you answer, a panel slides up from the bottom of the window: green "Right!" or soft red "Not quite", the explanation, and a big Continue button in the same colour. On a tall picture question the page scrolls a little, so you still see which answer was right. Typing a number, matching and ordering get their new look next (R10).

## What was done
- **Question screen** (`app/src/LessonPlayer.tsx`), look A layout:
  - Top row: the leave button (now the R03 round icon button), the R03 progress bar (12 px), and a counter in the code font (`data-testid=lesson-count`, "1 / 12").
  - Beacon's spot (`beacon-spot`): Beacon at 58 px on the left, its speech bubble (`beacon-says`) beside it. The bubble pops in again whenever the words change.
  - A small label above the question (`kind-label`): "PICK ONE", and for the other types "TYPE THE NUMBER", "MATCH THE PAIRS", "PUT THEM IN ORDER", "READ THE CLUES", "TAP THE PICTURE".
  - The question at 23 px, left-aligned, on the same left edge as the label and the tiles.
  - After an answer: the R03 bottom sheet (`feedback`) with the verdict (`verdict`: "Right!" / "Not quite", no full stop, as in look A), "**Right answer:** ...", what you picked, why, the as-of badge, and a full-width Continue (`next`) in the sheet's colour (on-air after Right, miss after Not quite: design review 1). The sheet keeps its words while it slides away.
  - Lesson complete: unchanged (R12), with Beacon centred and big as before.
  - The other question types keep their old bodies (centred) until R10.
- **Words file** `app/src/questionScreen.ts`: the labels, the counter, and Beacon's lines (8 words or fewer, kind, no numbers). The same question always gets the same line. R18 adds its lines here.
- **Bottom sheet** (`app/src/ui/BottomSheet.tsx`): drawn straight into the page (a portal), so it sits on the window's bottom edge even inside the gliding lesson; at most 70% of the window tall (scrolls inside); reports its height (`onHeight`), so the lesson leaves room under the question and scrolls just enough to show the right tile above the sheet. Its title can now hold a test ID. With Reduce motion it starts in place and only fades (before, it sat one frame below the window, then jumped).
- **Keys:** Enter also finds Continue in the sheet (it lives outside the lesson's box now).
- **Progress bar** (`app/src/ui/ProgressBar.tsx`): the blue-to-green fade stays still and a cover in the track's colour slides off it, so a short fill starts blue as in look A (before, a short fill showed only the green end). Still only a `transform` moving. This also changes the top bar's goal bar (same look as look A's top bar).
- **Tests:**
  - New `src/questionScreen.test.ts` (4): labels for every type, the counter, line length and kindness, the same line for the same question.
  - New `tests/question.spec.ts` (5 click tests):
    1. The look A line-up (top row, Beacon left of its bubble, PICK ONE, the question and tiles on one left edge, 23 px).
    2. After right and wrong answers: the sheet sits on the window's bottom edge, Continue matches it, Beacon's face and words change, the right tile is above the sheet, and the counter and bar move on.
    3. The sheet slides up smoothly (60 fps in the cloud) and the bubble pops in.
    4. With Reduce motion nothing slides or pops.
    5. On a picture question in a short window, the page scrolls so the right tile shows above the sheet.
  - `types.spec.ts` and `pictures.spec.ts`: "Not quite." became "Not quite".
- **Checks:** unit tests 165 pass (161 + 4). Click tests: 53 pass in a full run (48 + 5 new). TypeScript OK. Content checker OK (253 facts, 27 photos, 635 questions; `content/` untouched). Windows build: see the pull request.

## Test results
- Unit tests: 165 pass. Click tests: 53 pass (full run, 9.3 min). The sheet slides up at 60 fps in the cloud (23 steps, no overshoot). The older frame-rate tests (top bar, path moments, Beacon) still pass with the new progress bar.

## What I looked at (by eye)
- `03-question`, `04-feedback-wrong`, `05-feedback-right` (both sizes) next to look A's question screen: same order and spacing (top row, Beacon left with its bubble, PICK ONE in blue capitals, the question on the left, numbered tiles, the red or green sheet with Continue in its colour). A 620 × 700 picture question (test screenshot): the page scrolled so the right tile sits just above the sheet.
- `14-top-bar-moment`: the full goal bar shows the whole blue-to-green fade. At 2 / 13 the lesson bar is now a short blue fill (before: green).
- `12-blocks-sheet`: the blocks page's sheet still sits on the bottom edge.
- **Still looks weak:** the right-answer confetti falls over the sheet and the tiles (I31, R11). The wide window's sheet runs the full width while the content is a 440 px column (as R03 built it; it reads fine). Beacon's bubble before every question becomes background noise after a few (I39). A long question wraps oddly at 23 px ("787 / MHz") in the 440 px column; R22 (window sizes) can look at it.

## What's next
- Next task: T59, session R10 (the other question types). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- The question screen's look A layout (above), with Continue in the sheet's colour.
- Beacon's lines and the labels live in `app/src/questionScreen.ts`; no numbers in lines.
- The counter counts comebacks too ("6 / 13" after a miss); idea I37 may change that.
- The bottom sheet is a portal, at most 70% tall, and the page scrolls to keep the right tile in view.
- The progress bar's colour fade stays still and a cover slides off it.

## Questions for the owner
- None. Optional: look at `docs/redesign/gallery/latest/03-question.webp`, `04-feedback-wrong.webp` and `05-feedback-right.webp`, and tell any chat if anything feels off (for example Beacon's lines).

## New words (also added to GLOSSARY.md)
- Portal.

## Approvals and blocks
- Nothing asked for approval; nothing was blocked. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.

## Notes for the next Claude
- **R10:** the other types sit in a centred wrapper in `LessonPlayer.tsx` ("keep their old layout (centred) until R10"). Their Check buttons and tiles still use the old inline `btn()` / `tile()` helpers; move them to the R03 blocks (`Button`, `AnswerTile`) and drop the wrapper. Learn cards have no label yet (their title defaults to "Learn this"; `KIND_LABEL.learn` is "Something new", unused so far).
- **The sheet is outside the lesson's box.** Find it with `[data-testid=feedback]`, not inside the lesson root. `useKeys` in `LessonPlayer` presses Continue there.
- **The sheet keeps its words while it leaves** (the `shown` state), but `res` is null at once, so Continue does nothing during the slide-out (guarded).
- **The old per-answer confetti** still falls over the sheet (I31, R11).
- Click tests need the pretend screen: `xvfb-run -a npm run e2e`.
