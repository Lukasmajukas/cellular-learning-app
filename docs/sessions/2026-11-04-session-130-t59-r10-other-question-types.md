# Handoff note: 2026-11-04, T59 R10 the other question types

**Status:** DONE
**Model used:** Large (Opus), High effort (a Sonnet robot run claimed it and handed it to this Opus chat) · **Branch / pull request:** claude/robot-r10, #134

## In simple words (for the owner)
Every other kind of question now has the Night Signal look, lined up on the left like "pick one". Typing a number is one big box with "MHz" inside it that turns green or red. Matching shows pairs with numbers (B2 is 1, and its partner gets a 1 too), ordering has numbered empty slots that fill as you tap, and clue questions have one card per clue. Learn cards say "SOMETHING NEW" and show the band on a tidy radio ruler. The red "Not quite" panel is shorter: tap "Show them on the ruler" or "Clue by clue" for the long part.

## What was done
- **New file `app/src/QuestionTypes.tsx`:** every question type's body, moved out of `LessonPlayer.tsx` and redrawn from the R03 blocks. All on the question's left edge (the centred wrapper is gone).
  - **Type the number:** one big box (64 px tall) in the code font, the unit (MHz) inside on the right; blue outline while typing; green with a tick or red with a cross after Check (`number-box`, `data-state`).
  - **Match the pairs:** a two-column grid (`match-grid`). Left tiles are numbered (keys 1-9 pick them too). The first left tile starts lit; after each pair the next unpaired one lights up by itself, so most of the time you only tap the right column. A paired right tile shows its partner's number; an unpaired one an empty dashed box. After Check each tile is right or wrong.
  - **Put them in order:** numbered slots (`order-slot-N`, dashed; the next one outlined blue, `data-next`), filled ones are tiles (`order-placed-N`, tap to take back), the items as chips in a pool (`order-pool`). After Check each place is right or wrong.
  - **Read the clues:** one card per clue (`clue-N`, "CLUE 1" label, the clue, chip answers). After Check the card's outline turns green or red (`data-ok`).
  - **Tap the picture:** the dot is green for a right tap and red for a miss (`data-ok`); the hint moved above the picture.
  - **Photos:** a thin outline round the picture; otherwise as before.
  - One full-width **Check** for every type; it hides (keeps its space) once the sheet's Continue takes over.
- **Learn card** (`LessonPlayer.tsx`): "SOMETHING NEW" label, the title at 23 px on the left, the text, the ruler in a raised card ("On the radio ruler", `learn-ruler`), the as-of badge, a full-width "Got it".
- **Hints** under the question (`kind-hint`): `KIND_HINT` in `app/src/questionScreen.ts`. No numbers in them (an example like "1,710" is a real band edge and could give an answer away).
- **Short sheet (idea I38):** the right answer, what you gave, one line why, the badge. Order: the ruler waits behind "Show them on the ruler"; scenario: "1 of 2 clues right" (`clue-score`), each clue's reason behind "Clue by clue" (`why-toggle`, `why-more`). `FOLD_LABEL` in `questionScreen.ts`. The sheet's content remounts per answer (`shown.n`), so the fold starts closed each time.
- **As-of badge** (`FactBadge`): a small outlined pill with an info icon; same words as before.
- **Spectrum bar** (`app/src/SpectrumBar.tsx`): band names on two rows above the track (never overlapping, `placeLabels`), a hairline to each band, the MHz ends under the track.
- **Blocks:** new `app/src/ui/Chip.tsx`; answer tiles got a `paired` look and an empty dashed number box (`keyEmpty`). DESIGN.md section 6 updated.
- **Gallery tool:** new pictures 18-27 (learn card, number, number right, match half done, order half done, order wrong with the ruler open, clues, clues wrong, photo, tap wrong) and a `--types-only` option.
- **Tests:**
  - New `src/spectrum.test.ts` (4): names never overlap, stay inside the drawing.
  - `src/questionScreen.test.ts` (+1): hints and fold labels are short and hold no numbers.
  - `src/ui.test.ts`: the block list has the chip; the tile looks include `paired`.
  - New `tests/typeslook.spec.ts` (2 click tests): every type lines up on one left edge with a full-width Check; number box right/wrong; match auto-advance and pair numbers; order slots and take-back; clue cards; per-tile/slot/clue right and wrong; the "Not quite" sheet under 40% of the window for order and clues; the folds open; the ruler's names don't overlap in the real app.
  - `tests/question.spec.ts` (R09's sheet test) no longer depends on luck: see the test results.
  - `tests/types.spec.ts` opens the folds before checking the ruler and the clue reasons; `tests/pictures.spec.ts` checks the dot's colour.

## Test results
- Unit tests: 170 pass (165 + 5). TypeScript OK. Content checker OK (253 facts, 27 photos, 635 questions; `content/` untouched).
- Click tests: full run 54 of 55 passed (53 before + 2 new; 9.5 min). The one failure was R09's sheet test, by chance: the answer tiles are shuffled at random, it picked tiles by place, and it got all three questions of the 3-question sample lesson right, so the lesson ended before a "Not quite" ("Expected: not 3 / 3"). Fixed, not skipped: it now reads the sample's answer key (`SAMPLE` in `src/lesson.ts`), misses on purpose first, then answers right. Passed 6 runs in a row (`--repeat-each 6`). The frame-rate tests still pass (sheet 60 fps, top bar 60 fps).
- Windows build: see the pull request.

## What I looked at (by eye)
- Before and after pictures of all ten new gallery shots (620 × 960), plus the wide ones, next to look A's question screen: same left edge, label, question, tiles, full-width button, the red sheet with Continue.
- Learn card: the ruler in its raised card, B71 named once, 617 / 652 MHz at the ends. Number: the unit sits inside the box; the green box after Right. Match: B4 lit, B2's partner shows "1", the others empty boxes. Order: two slots filled, the third outlined blue, the fourth dashed; after Check two green and two red with ticks and crosses; the ruler's four names (B71, B12, B5, B2) on two rows, no overlap. Clues: cards with "CLUE 1", the picked chip blue; after Check green and red outlines, the right chip with a tick. Tap: a red dot with a dark ring on the grass, the amber outline on the antennas.
- **Still looks weak:** the right-answer confetti still falls over the questions (I31, R11). A Check that can't be pressed yet is a muddy half-see-through teal (idea I42). The ruler's bands are thin slivers when they're far apart (B71 and B2): true to scale, but small. The question body slides in even with Reduce motion on in the click tests (it measured 60 px off at first): R11, which owns question movement, should check that.

## What's next
- Next task: T59, session R11 (lesson movement). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- The other question types' look A layout (above), with one full-width Check that hides after Check.
- The short sheet with two folds (I38).
- Hints hold no numbers.
- The chip block, the paired tile look, and the two-row spectrum bar labels.

## Questions for the owner
- None. Optional: look at `docs/redesign/gallery/latest/18-learn-card.webp` to `27-tap-wrong.webp` and tell any chat if anything feels off (for example the matching numbers).

## New words (also added to GLOSSARY.md)
- Chip.

## Approvals and blocks
- Nothing asked for approval; nothing was blocked. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.

## Notes for the next Claude
- **R11:** question bodies live in `app/src/QuestionTypes.tsx` now; `LessonPlayer.tsx` keeps the screen, the learn card and lesson complete. Ideas for R11: I31 (no per-answer confetti), I37 (counter), I40 (chips glide into slots). Check whether the question's slide-in (x 60 → 0) really stops with Reduce motion.
- **Only the lesson-complete screen** still uses the old `btn()` helper (R12 replaces it).
- **Test IDs kept:** `choice-N`, `number-input`, `check`, `match-left-N` / `match-right-N`, `order-item-X` / `order-placed-N`, `clue-N-choice-M`, `clue-why-N` (now inside the fold), `order-bar` (inside the fold), `tap-dot`, `learn-ok`, `learn-card`, `prompt`, `badge`.
- **Match keys:** keys 1-9 pick a left tile (`data-pick`); the right column has no keys yet (I41).
- `node tools/gallery.mjs --types-only --out <folder>` re-shoots just 18-27 (build first).
