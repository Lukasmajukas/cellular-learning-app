# Handoff note: 2026-11-05, T59 R22 Window sizes, keyboard, easy to read
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** IN PROGRESS <!-- change to DONE when the chat finishes -->
**Model used:** Large (Opus), High effort (a Sonnet robot run claimed it; the first Opus chat stopped on the usage limit before doing any work, so this was the same try) · **Branch / pull request:** claude/robot-t59-r22, #146

## In simple words (for the owner)
You can now make the window as small as a phone (360 × 560) or as big as your screen, and every screen fits: nothing runs off the edge any more. The whole app works with the keyboard: press Tab and a thin blue ring shows which button you're on (it never hides under the top bar or the tabs), "Match the pairs" has letter keys (press 1, then A), and on a picture you tap, the arrow keys move a little crosshair and Enter taps. Right and wrong always come with a tick or a cross, never just green or red. Settings is a bit shorter, and Settings, Keys, "Show" lists every key.

## What was done
- **Measured first** (the real app at 360 × 640, 620 × 960 and 1920 × 1080, every tab and every question type): at 360 px the top bar ran 23 px past the window's edge (a sideways scrollbar on every tab), Settings squeezed its words to one a line beside wide controls (the volume slider, "Back up now"), and on lesson complete Beacon's bubble was cut off and "+20 XP" broke over two lines. 1920 × 1080 was already fine (the 440 px column in the middle). Tab already showed a ring on every button, but on the path it parked the first lesson under the top bar, and the tap-the-picture question couldn't be reached by keyboard at all.
- **Smallest window:** 360 × 560 (the page inside it): `MIN_SIZE`, `useContentSize` in `app/electron/main.cjs`.
- **Narrow windows** (`TopBar.tsx`, `AppShell.tsx`, `theme.css`, `LessonComplete.tsx`, `SettingsScreen.tsx`): the top bar's gaps and goal bar shrink with `clamp()`; today's "+30" hides under 400 px (`hud-wide-only`); Beacon's bubble is at most `min(168px, 50vw - 60px)` wide; "+N XP" is 28 to 40 px on one line; a settings row moves its control under its words when they'd be under 100 px wide (`flex-wrap`, `WORDS_MIN`).
- **Keyboard:**
  - `scroll-padding: 64px 0 84px` while the app frame shows, so a focused control is scrolled clear of the bars.
  - Letter keys A-I (`keys.ts`: `{ letter }`, `pressFor` finds `[data-letter]`): the match's right tiles show their letter in the dashed box until paired (idea I41).
  - Tap the picture: Tab to it, arrows move a crosshair (`Aim`, 5% a press, 1% with Shift), Enter or Space taps (`PhotoView` in `QuestionTypes.tsx`).
  - Settings, Keys is one row with "Show": an info sheet with 1-9, A-I, Enter, Esc, Arrows, Tab; the keyboard returns to "Show" when it closes. A new `keyboard` icon.
- **Never colour alone:** the tap dot is 24 px with a tick or a cross inside; a clue card's magnifier turns into a tick or a cross after Check; a picked tile ("selected": the match's left tile being paired, the welcome's goal) has its number box filled in.
- **Settings shorter (idea I57):** Night / Day on its row's right (hints shortened to "Dark and calm, for night." / "Light and clear, for daylight." so they fit); Keys folded into one row. 1597 → 1496 px tall at 620 × 960. I also tried the goal circles on their row's right, but "Lessons a day" then broke over two lines, so they stay under it.
- **Tests:** `src/r22.test.ts` (letter keys, the ring's CSS and its 3:1 contrast on every background in both looks, the scroll padding, the smallest window, the Keys list); `tests/keyboard.spec.ts` (a whole lesson of every type with the keyboard only; the tap question by keyboard; Tab through every tab, the Keys sheet and Day, checking the ring at every stop; a self-check that the checker catches a missing ring and one under the tabs); `tests/sizes.spec.ts` (smallest window, every tab / Settings / heatmap sheet / welcome / every question type / lesson complete at 360 × 560, the column at 1920 × 1080). Helpers `focusRing`, `tabTo`, `sideways` in `tests/helpers.ts`.
- **Gallery:** new pictures 47-54 (`r22Screens()` in `tools/gallery.mjs`).
- **Docs:** `DESIGN.md` (window sizes, the keyboard, never colour alone, in section 4), `PLAN.md` (R22 ✅), `IDEAS.md` (I41, I57 done; I72, I73, I74 new), the gallery's README, `DECISIONS.md`, `GLOSSARY.md`, the T59 row in `TASKS.md`.

## Test results
- (filled in below when the runs finish)

## What I looked at (by eye)
- (filled in below)

## What's next
- Next task: T59, session R23 (speed check). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- The window can't be smaller than 360 × 560; every screen must fit from there to full screen, nothing scrolls sideways.
- On a narrow window things give way (gaps, the goal bar, "+30", the bubble, a settings control) instead of squeezing words.
- A focused control is always scrolled clear of the bars; a click test checks the ring at every Tab stop.
- Keys A-I for the match; arrows and Enter for tap-the-picture.
- Tick or cross on the tap dot and clue cards; a picked tile's number box is filled in.
- Settings: Night / Day on its row; Keys as one row with a sheet; the goal circles stay under their row.

## Questions for the owner
- None new. T62 is still open (the Windows build on GitHub), and T57 (the green start-up picture) when a new build is out.

## New words (also added to GLOSSARY.md)
- Focus ring, Keyboard shortcut, Minimum window size, Colour alone.

## Approvals and blocks
- (filled in below)

## Notes for the next Claude
- `tests/helpers.ts` now has `focusRing(w)` (is the focus visible: a ring, not cut off, on screen, not under a bar), `tabTo(w, testId)` (Tab until there, checking every stop) and `sideways(w)`. Use them for any new screen.
- A focus test needs a real Tab press: `el.focus()` from a test doesn't turn on `:focus-visible` (Chromium), so no ring is drawn.
- The match's right tiles carry `data-letter` (a-i, top to bottom); `keyIntent` returns `{ letter }` for a-i (any case). Order chips have no keys yet (idea I74).
- `scroll-padding` is set only while `[data-testid=app-frame]` is on the page (`html:has(...)`); lessons have no frame. The path's own scroll (`window.scrollTo`) isn't affected by it.
- The settings test's old "Keys card has 3 key caps" check moved to the sheet (keyboard.spec.ts).
