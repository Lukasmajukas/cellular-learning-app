# Handoff note: 2026-11-05, T59 redesign R20 (Day look)
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE (the work); the Windows check is BLOCKED on GitHub, see "Approvals and blocks"
**Model used:** Large (Opus), High effort (a Sonnet robot run claimed it and handed it to this Opus chat) · **Branch / pull request:** claude/robot-t59-r20, #144

## In simple words (for the owner)
The light "Day" look is finished. In ⚙️ Settings, Look: Day turns every screen light and clear. I checked every screen in Day with my own eyes (pictures) and with a new test that reads the colour of every word on 20 screens, in both looks, and checks it's easy to read. Three things you'll notice: if you pick Day, the app now opens in Day straight away (before, it flashed dark first); switching between Night and Day fades gently, like dawn or dusk, instead of snapping; and the gold "okay" tiles on the Heatmap are a clean warm colour now, not a muddy olive.

## What was done
- **Day pictures of every screen** (`docs/redesign/gallery/latest/day/`, same names as the Night ones): the gallery tool has a `--look day` option (`app/tools/gallery.mjs`). The old one-off `09-path-map-day` and `38-settings-day` are gone; `38-look-change` now catches the look changing halfway. The icon sheet (`00-icons`) was cut off at the top since R02 (window too short); now it shows all five rows.
- **Contrast test on the real screens, both looks** (`app/tests/lookcontrast.spec.ts`): for every piece of text the app draws on 20 screens and states (path, review, heatmap and its sheet, settings, lesson start, learn card, a question, both answer sheets, every other question type, lesson complete, the "This changed" card, the "progress is safe" notice, the building blocks page), it reads the text colour and the colour behind it (see-through layers mixed in, faded parents counted, the page's glow checked at both ends) and needs 4.5:1, or 3:1 for big text. Buttons you can't press yet are left out (WCAG allows it). A third test makes the quiet words faint on purpose and checks the test complains (it found 81 of 98).
- **A bug found and fixed: the app always started in Night.** `main.tsx` painted Night first and switched once the save loaded, so a Day user saw a dark flash at every start, and the `#blocks` page ignored the look entirely. Now the main process reads the look from the save file before the window opens (`store.look()` in `app/electron/store.cjs`, no backup and no writing), opens the window in that look's colour (`WINDOW_BG`, a unit test keeps it equal to the `bg` tokens), and passes it to the page (`--cell-look=day`, `cellApi.look` in the preload), which paints it from the first frame. The window's own colour follows when you change the look (`save:save` in `app/electron/main.cjs`).
- **Idea I56, the dawn / dusk fade** (`app/src/ui/LookFade.tsx`, `LOOK_FADE` in the speed file): when the look changes, a cover painted like the old look's page background (with its glow) lies over the window and fades away in 0.3 s (see-through-ness only; 0.15 s with Reduce motion). It never catches clicks and isn't there at start-up. Measured: 300 ms on screen, 60 fps; 150 ms with Reduce motion.
- **Idea I52, `streakBg`** (Night `#2C2413`, Day `#FBF0D9`): the heatmap's tiles and legend now use the three soft "Bg" tokens (`onAirBg`, `streakBg`, `missBg`, `HEAT_FILL` in `app/src/heatmap.ts`) instead of 16% of the level's colour mixed into the card colour. New token pairs in the contrast unit test.
- **Words:** the Look row's Day hint is "Light and clear, like a radio screen in daylight." (it said "An early test"). "Early values" wording removed from the tests.
- **Docs:** `DESIGN.md` (a "Day, finished" part, `streakBg` in the token table, the heatmap fill), `PLAN.md` (R20 ✅), `IDEAS.md` (I56 and I52 ticked; I66, I67, I68 added), the gallery's README.

## Test results
- Unit tests: 225 pass (+4: the saved look read before the window opens, the window colours equal the `bg` tokens, the look fade's timing, the heatmap fills). TypeScript OK. Content checker OK (253 facts, 27 photos, 635 questions; `content/` untouched).
- Click tests (cloud): 98 of 98 on the first full run (11.8 min): the 91 before plus 7 new (`lookcontrast.spec.ts` 3, `daylook.spec.ts` 4). Lowest frame rate measured: 55.9 fps (bar 50); the look fade: 60 fps, 300 ms on screen (150 ms with Reduce motion).
- Contrast on the real screens: Night and Day both pass on all 20 screens (757 pieces of text in each look); the self-check made the quiet words faint and the test caught 81 of 98.
- **Windows build (GitHub): could not run.** Runs 161, 162 and 163 (all three pushes) stopped after 3 seconds with no computer given to them ("runner 0", no log). The same happened to run 159 (R19's last push) and run 160 (R19 on `main`), from 09:17 UTC, before this session changed anything. So it's GitHub, not the code. See "Approvals and blocks".

## What I looked at (by eye)
- "Before": the whole gallery in Day, taken with the old code into a scratch folder (Day was never photographed beyond two screens).
- After, in Day: `01-path-map` (both sizes), `04-feedback-wrong`, `06-lesson-complete`, `07-heatmap` (the okay tiles are a clean warm cream now), `13-review`, `15-repair-card`, `18-learn-card`, `23-order-wrong`, `26-photo`, `29-lesson-complete-burst`, `32-change-card`, `35-heatmap-sheet`, `38-look-change` (Day fading into Night, caught halfway), `00-icons`, `10-blocks` and `16-beacon` (now in Day; before, these showed Night).
- After, in Night: `07-heatmap` (the okay tiles are a warm dark amber, no more olive), `08-settings` (unchanged), `38-look-change` (Night fading into Day), `00-icons` (now all six rows; the first row was cut off since R02). The other Night pictures were retaken too; nothing else changed on them.
- **Still looks weak:** in Day the glows (the burst's rings, the current lesson's halo, the heatmap glows) are faint on white, so they read as soft tints more than light (fine, but less magic than Night); the scrim behind the heatmap sheet washes the page almost white (I66); halfway through the look change the colours mix into a flat grey for a moment (I68).

## What's next
- Next task: T59, session R21 (first start, empty screens, start-up). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- Day is finished with the R01 values; it has its own full gallery set.
- A second contrast test reads the real screens in both looks.
- The app opens in the saved look from the first moment (read before the window opens).
- The look changes with a 0.3 s fade of a cover in the old background (I56).
- New token `streakBg`; the heatmap's fills are the three "Bg" tokens (I52).

## Questions for the owner
- T62: please look at your GitHub Actions minutes (GitHub, Settings, Billing). The Windows build can't run until they're back.
- Otherwise none needed. Optional: try ⚙️ Settings, Look: Day, and say in any chat if anything is hard to read or looks off.

## New words (also added to GLOSSARY.md)
- WCAG, First paint, Main process.

## Approvals and blocks
- Nothing asked for approval. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.
- **BLOCKED: the Windows build check** (PLAN.md checklist step 3). GitHub Actions gives the build no computer since 09:17 UTC (most likely the account's free monthly Actions minutes are used up; only the owner can see or change billing). Not a failed try: the work passed every check that could run. Following `docs/WORKFLOW.md` G7, it's merged anyway, with a "You" row (T62). When the build works again, the next chat runs it on `main` by hand (`workflow_dispatch`) to check R19 and R20 together.

## Notes for the next Claude
- Gallery in Day: `npm run gallery -- --look day` (or `node tools/gallery.mjs --look day` after a build); it writes `docs/redesign/gallery/latest/day/`. The Night run (no option) only clears `.webp` files in `latest/` itself, not in `day/`.
- `tests/lookcontrast.spec.ts` prints, per screen, how many pieces of text it checked. A new screen or state should get a `check(w, '<name>')` there. To leave a decorative bit of text out on purpose, put `data-contrast-skip` on it (none needed so far).
- A Day save's start-up is tested in `tests/daylook.spec.ts` (every frame from the first one is Day, and the window colour). If you add a new kind of window, give it `WINDOW_BG[store.look()]` too.
- Run click tests with `xvfb-run -a npx playwright test` in `app/`.
