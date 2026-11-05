# Handoff note: 2026-11-05, T59 redesign R16 (design review 2)

**Status:** DONE <!-- change to DONE when the chat finishes -->
**Model used:** Large (Opus), High effort (a Sonnet robot run claimed it and handed it to this Opus chat) · **Branch / pull request:** claude/robot-t59-r16, #140

## In simple words (for the owner)
I walked through every screen of the app one after another, like walking through a renovated house room by room, and asked: does it feel like one house? Mostly yes: 4.4 out of 5, up from 3.4 last time. I fixed three spots where one screen did something its neighbours don't: a Check button you can't press yet is now dark with an outline instead of a muddy blue-green smudge; "Got it" on a learn card is blue like every other "Got it"; and the Path tab now starts the same way as the other three tabs, with a small label over its title.

## What was done
- **The review:** `docs/reviews/2026-11-05-design-review-2.md`. All 77 gallery pictures taken fresh at the start (38 screens at 620 × 960 and 1280 × 800, plus the icon sheet), each compared with `DESIGN.md`, the look A picture and review 1. Scores per screen for look, movement, clarity and "one app".
- **Fix 1 (idea I42): a "not ready" look for buttons.** `app/src/ui/tones.ts` has `BUTTON_OFF` (`surface2`, `textMuted` words, `borderStrong` outline). `app/src/ui/Button.tsx` uses it for any disabled button, at full strength (the old half see-through is gone), and sets `data-off`. Seen on Check in match, order and clue questions, and on "Back up now" / "Show" before the save folder is known.
- **Fix 2: the learn card's "Got it" is signal blue** (`app/src/LessonPlayer.tsx`), like the "This changed" card's.
- **Fix 3: one head for every tab.** `app/src/PathMap.tsx`: a "SIGNAL PATH" label over "Your path" (28 px), 16 px from the top bar (was 20 px and no label). Every tab's label has the test ID `tab-label`.
- **Tests:**
  - Unit (+1, 213 in all): `BUTTON_OFF` is the dark look, passes the contrast test in Night and Day, and Button uses it with no half see-through.
  - Click tests: new "every tab starts the same way" (`tests/frame.spec.ts`: label and title at the same height and edge on all four tabs, title 28 px); `tests/typeslook.spec.ts` now checks the learn card's "Got it" is `signal` and the disabled Check's colours (dark, then signal blue once a number is typed). Both failed on the old build and pass now.
- **Plan (`docs/redesign/PLAN.md`):** R16 ticked. No rows move. Notes: R18 also does I46 and I48 (lesson complete reads as "finished", centred on tall windows); R20 also I52 (warm dark fill for "okay" heatmap tiles); R22 also I57 (shorter Settings).
- **Ideas board:** I42 done; pinned ideas listed in session order; new I58 (one shared "tab head" block) and I59 ("Again" gets its own icon, so the repeat icon only means review).
- **DESIGN.md:** sections 2 and 6 record the three rules, with the reason.
- **`TASKS.md`:** new T61 (plain words for "UL above DL" in a Right! panel: lesson words, so not the redesign's job).

## Test results
- Unit tests: 213 pass (212 + 1). TypeScript OK. Content checker OK (253 facts, 27 photos, 635 questions).
- Click tests (cloud): 79 of 79 on the first full run (10.0 min): the 78 before plus 1 new. Lowest frame rate measured: 56.0 fps (bar 50).
- Windows build (GitHub): run 41963090689 (the app code of this review) **passed**: unit tests, all click tests (10.7 min, each moving test checks 50+ fps) and the installer. The next push (only the gallery pictures and notes) starts another run, which may still be running at merge time.

## What I looked at (by eye)
- Every picture in the fresh gallery, both sizes (contact sheets of three narrow or four wide pictures at a time), and look A.
- After the fixes (new gallery, both sizes): `18-learn-card` ("Got it" signal blue, matching `32-change-card`); `21-match`, `22-order`, `24-scenario` (Check dark with an outline and grey words, no teal smudge); `14-top-bar-moment`, `15-repair-card`, `32-change-card`, `33-restored-notice` ("SIGNAL PATH" over "Your path", at the same height as "DRIVE TEST", "BAND MEMORY" and "YOUR APP"); `10-blocks` ("Not yet" in the new look).
- **Still looks weak** (all on the ideas board): lesson complete still shows the lesson's top row and sits high on a tall window (I46, I48, with R18); the heatmap's olive "okay" tiles (I52, with R20); Settings two screens tall (I57, with R22); the demo drawing's serif caption (sample lesson only).

## What's next
- Next task: T59, session R18 (Beacon reacts). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- The "not ready" button look; "go on" buttons that don't follow an answer are signal blue; every tab's head is the same. No plan rows move.

## Questions for the owner
- None. Optional: open a "match the pairs" question and tell any chat whether the dark "Check" (before you've matched everything) is clear enough.

## New words (also added to GLOSSARY.md)
- None.

## Approvals and blocks
- Nothing asked for approval; nothing was blocked. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.

## Notes for the next Claude
- A disabled `Button` now ignores its `kind` colours and wears `BUTTON_OFF`; check `data-off` in tests rather than opacity.
- Tab heads: `tab-label` test ID on all four tabs; the click test compares their y and x after the glide settles (use `expect.poll`: the glide takes a moment after the old screen is gone).
- The gallery tool needs the Electron binary downloaded first; the first `node tools/gallery.mjs` after `npm ci` downloads it. Don't pipe its output into `head` (that stops it halfway). Click tests in the cloud need `xvfb-run -a npx playwright test` (the gallery starts xvfb by itself).
