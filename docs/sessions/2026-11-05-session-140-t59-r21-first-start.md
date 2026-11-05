# Handoff note: 2026-11-05, T59 R21 First start, empty screens, start-up
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE (the work); the Windows check is BLOCKED on GitHub (T62), see "Approvals and blocks"
**Model used:** Large (Opus), High effort (a Sonnet robot run claimed it and handed it to this Opus chat) · **Branch / pull request:** claude/robot-r21-claim, #145

## In simple words (for the owner)
When the app opens, the very first thing you see is now its own start screen: Beacon, the name "Cell Learning" and a small "TUNING IN". The window waits until that picture is ready, so you never see an empty or half-drawn window; after half a second it fades into your path. Someone starting from scratch gets a short two-page welcome (what the app teaches, then how many lessons a day); you won't see it, because you've already played. The Heatmap before your first lesson now says "Nothing lit up yet" with a button to lesson 1, and if the app ever can't open your progress file, or trips over something, it shows a calm "No signal" screen with "Try again" instead of a blank window.

## What was done
- **Start screen** (`app/index.html`, `app/src/startup.ts`): plain HTML, so it's in the window's first picture before any app code runs. Beacon standing still with its waiting face (112 px; a unit test renders the app's Beacon and checks the lines and circles match), "Cell Learning" (28 px), "TUNING IN" (12 px signal-blue label), on the page's own glow. Its colours come from the tokens: `lookCss()` in `src/theme/tokens.ts` writes both looks as CSS, and a small Vite plugin (`vite.config.ts`) puts it into `index.html` at build time; a tiny first script picks the saved look (`<html data-look>`). So the page also has its colours and fonts from the first picture (before, the CSS variables only existed once the app's code had run).
- **The window waits for it** (`electron/main.cjs`): `show: false`, then shown on `ready-to-show` (at most 3 s). Measured in the cloud with the old code: a cold start showed an empty window for about 4 s, a warm one about 0.15 s, then a half-drawn path. Now the first picture is always the start screen.
- **Fade-out:** once the save has loaded, it stays until 0.5 s after the page began, then fades in 0.3 s (see-through-ness only) while the path appears under it; 0.15 s with Reduce motion, which the main process now reads from the save before the window opens (`store.startup()`, `--cell-calm`). Speeds: `START`, `startFade` in the speed file.
- **Welcome** (`app/src/Welcome.tsx`): once, for a brand-new save. Page 1: Beacon (happy) "Hi, I'm Beacon. Let's read the airwaves.", "Learn the signals around you", a "What you'll learn" card (bands, carriers, cell sites; no facts), Next. Page 2: Beacon "Pick what feels easy. You can change it.", "How many lessons a day?" as four answer tiles with number keys (1, 2, 3, 5 lessons, "up to N minutes a day"), "Start the first lesson" (goes straight into lesson 1) and a quiet "Look around first". Keys: Enter, 1-4, Esc (back). Pages glide like questions, from the left when going back (`pageGlide`). The save file has a new `welcomed` field; a save from before R21 with any progress, reviews or XP counts as welcomed, so the owner never sees it. Settings now uses the same goal list (`GOALS`).
- **Empty Heatmap:** a raised card with a small Beacon (rings still), "Nothing lit up yet", one line, and "Go to your first lesson". The help line above says "Tap a band to see which lessons teach it."
- **Error screens** (`app/src/Trouble.tsx`): "No signal" label in the warm notice colour, a worried Beacon, a plain title and one line saying whether your progress is safe, "Try again" (Enter), and the exact error folded under "What happened". Two kinds: the progress file couldn't be opened (before, the window stayed empty forever; nothing is ever written until a load works; also "Show the progress file") and a crash anywhere (`<Safety>`, an error boundary around the app; before, a blank window). Test doors: `CELL_TEST_LOAD_FAIL`, `CELL_TEST_LOAD_DELAY`, `CELL_TEST_CRASH`.
- **Click tests skip the welcome** (`CELL_SKIP_WELCOME`, set in `playwright.config.ts`), because they start from an empty save.
- **Docs:** `DESIGN.md` (a "First start, empty and error screens" part), `PLAN.md` (R21 ✅), `IDEAS.md` (I69, I70, I71), the gallery's README, `DECISIONS.md`, `GLOSSARY.md`, T57 and T59 rows in `TASKS.md`.

## Test results
- Unit tests: 236 pass (+11 in `src/firststart.test.ts`: the `welcomed` field and old saves, the start-up read, both looks' CSS from the tokens, the start screen's Beacon equals the app's, the speeds, the goal list, Beacon's lines ≤ 8 words, kind error words). TypeScript OK. Content checker: `content/` untouched.
- Click tests (cloud): 108 of 108 (10 new in `tests/firststart.spec.ts`; the contrast test now also covers the start screen, both welcome pages, the empty heatmap and both error screens, in Night and Day). The first full run had 1 failure: `heatmap.spec.ts` "a fresh save" looked for the old help-line words, which moved into the new card on purpose; the test now checks the card, and the file passes (4 of 4). Frame rates: start-screen fade 59.6 fps (233 ms on screen; 117 ms with Reduce motion), welcome page glide 60 fps; lowest in the whole run 55.7 fps (bar 50).
- No blank frame: a click test watches every frame from the earliest moment to the path; each one has either the start screen or the app. With a made-up 2.5 s slow load, the start screen stays up the whole time, in Day for a Day save.
- **Windows build (GitHub): could not run.** Run 166 (this branch) stopped after 3 seconds with no computer, like every run since 09:17 UTC (T62).

## What I looked at (by eye)
- Before (old code, scratch folder): the first picture was a half-drawn path (lesson circles not yet in); a brand-new save landed on the path with no word of explanation; the empty Heatmap was a grid of dashed "new" tiles with one help line.
- After, in Night (`latest/40` to `46`, 620 × 960): the start screen (Beacon centred, name, "TUNING IN"), its fade halfway (Beacon and the name fading over the path), welcome page 1 (happy Beacon and bubble, the three rows), page 2 (the "2 lessons" tile picked, both buttons), the empty Heatmap card, both error screens ("What happened" open on the load one, showing the error words).
- After, in Day (`latest/day/40` to `45`): the same screens are light and clear; the start screen, the welcome and the error screen read well; and `42-welcome-wide` (1280 × 800) fits the whole first page in the window.
- The rest of the gallery was retaken in both looks (91 pictures each); nothing else changed on them.
- **Still looks weak:** the start screen's Beacon fades in the middle while the path's small Beacon is already at your lesson (I70 would let it glide there); the welcome's goal page is a bit long at 620 × 960 with both buttons near the bottom; the error screens are the same layout for both kinds, which is fine but plain.

## What's next
- Next task: T59, session R22 (window sizes, keyboard, easy to read). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- The start screen is plain HTML coloured from the tokens at build time; the window stays hidden until it's drawn.
- It stays at least 0.5 s, then fades in 0.3 s (0.15 s with Reduce motion).
- A two-page welcome, once, for a brand-new save; old saves with progress count as welcomed.
- Friendly error screens for a failed load and a crash; test doors for both; click tests skip the welcome.

## Questions for the owner
- T57: when a new build is out, say whether the green picture at start-up is still there. If it came from the window showing before the app had drawn anything, it should be gone.
- T62 is still open: the Windows build can't run until GitHub Actions has minutes again.

## New words (also added to GLOSSARY.md)
- Start screen (splash screen), Error boundary, Empty screen (empty state).

## Approvals and blocks
- Nothing asked for approval. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.
- **BLOCKED: the Windows build check** (PLAN.md checklist step 3), same as R20: GitHub gives the build no computer. Not a failed try: every check that could run passed. Merged per `docs/WORKFLOW.md` G7; T62 already asks the owner.

## Notes for the next Claude
- The start screen is `#boot` in `app/index.html`; `endStartScreen()` (src/startup.ts) removes it. A click test that reads the very first frames should wait for `start-screen` to have count 0 before auditing the page.
- `index.html` has `<!--look-tokens-->`; don't remove it (the build puts both looks' CSS there). Colours in `index.html` must be `var(--token)` (the theme guard test checks every `var(--...)` name).
- New test doors in `electron/main.cjs` and `preload.cjs`: `CELL_TEST_LOAD_FAIL=n` (the first n loads fail), `CELL_TEST_LOAD_DELAY=ms` (the first load waits), `CELL_TEST_CRASH=1` (trips once, in an effect: React silently re-renders after an error in a render, so a one-time throw there never reaches the boundary), `CELL_SKIP_WELCOME=1`.
- Electron's binary isn't in a fresh container after `npm ci`: run `node node_modules/electron/install.js` in `app/`.
- Gallery: `firstStartScreens()` makes 40-46.
