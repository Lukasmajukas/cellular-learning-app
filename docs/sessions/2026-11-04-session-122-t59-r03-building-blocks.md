# Handoff note: 2026-11-04, T59 redesign R03 building blocks

**Status:** DONE
**Model used:** Large (Opus), High effort (handed over by a Sonnet robot run) · **Branch / pull request:** claude/t59-r03-building-blocks, #126

## In simple words (for the owner)
Until now every screen styled its own buttons by hand, a bit like each room in a house having different door handles. Now the app has one box of ready-made parts: buttons, cards, answer tiles with number keys, small pills like "6 due", on/off switches, a progress bar, the "Right!" / "Not quite" panel that slides up from the bottom, and Beacon's speech bubble. They all squish a little when you press them. The Settings screen is the first one built only from these parts: the grey tick boxes became glowing switches, and the daily goal is a row of round buttons (1, 2, 3, 5).

## What was done
- **The building blocks** (`app/src/ui/`, DESIGN.md section 6):
  - `Button` (signal / on-air / miss / quiet, optional icon, `full`, `big`) and `IconButton` (round 44 × 44, label required).
  - `Card` (plain, `raised`, `accent` outline, optional `title`) and `SectionLabel` (the small spaced-out capitals like "PICK ONE").
  - `AnswerTile` (number key on the left; idle / selected / right / wrong / dim; right and wrong add a tick or cross with words for screen readers; the right one glows from its own layer, which only fades in).
  - `Pill`, `StatChip` (icon + number in the "code" font), `PillChoice` (one choice from a row of pills, arrow keys work).
  - `Switch`: a see-through real checkbox (`role="switch"`) on top of a drawn track, so clicking the row's words, Space and screen readers work. The knob springs; the blue fill is a layer that fades.
  - `ProgressBar`: the fill slides (moves) instead of changing width; signal-to-on-air colour fade from look A.
  - `BottomSheet`: slides up from the bottom of the window, text kept inside the 440 px column.
  - `SpeechBubble`: pointy corner bottom left, pops in with the "bouncy" spring.
  - `tones.ts`: every block's colours as named token pairs, plus the springs (snappy 500/30, bouncy 300/14, sheet, fill). `press.ts`: `usePress` (the shared hover/press spring), `useCalm`, `INSTANT`.
- **Settings rebuilt from the blocks**: a round back button beside the title; cards "Sound and movement", "Daily goal", "Look", "Your progress"; each row has a name, a quieter line saying what it does, and a switch; the daily goal is a pill row. The empty note line only appears after a backup.
- **A bug found and fixed on the way**: Motion reads the app's "Reduce motion" setting only when a piece first appears. So after you switched Reduce motion on in Settings, the switches on that same screen still slid. Every block that moves now checks the setting itself (`useCalm()`), and a unit test makes sure of it.
- **`#blocks` page** (`app/src/BlocksSheet.tsx`): every block on one page, with its own Reduce motion switch. Not reachable from the app's buttons; the gallery and tests open it by adding `#blocks` to the address.
- **Tests**: `src/ui.test.ts` (11 new: every block's words pass contrast in Night and Day; bright buttons carry dark words; springs match DESIGN.md; presses stay small; every clickable block uses `usePress`; no block animates width, height, blur or shadow; Settings has no plain checkboxes, drop-downs or hand-styled buttons; moving blocks check `useCalm()`). `tests/blocks.spec.ts` (3 new click tests: Settings has 4 switches and pills, all at least 44 × 44, clicking the words and Space flip a switch, arrow keys move the goal, the goal reaches the path; the knob slides through 6 in-between frames at 60 fps; a press shrinks the back button to about 0.90 and it springs back; with Reduce motion on, the knob jumps and nothing squishes; the blocks page shows every block, right/wrong tiles have icons with words, the sheet slides up, and appears without sliding under Reduce motion).
- **Gallery**: `npm run gallery` now also takes `10-blocks`, `11-blocks-tiles`, `12-blocks-sheet` (both sizes).
- **Checks**: unit tests 124 pass (113 + 11 new); click tests 19 pass (16 + 3 new; knob 60 fps, frame-rate badge 58–60); TypeScript OK; content checker OK (253 facts, 27 photos, 635 questions; `content/` untouched). The Windows build runs on the pull request.

## What I looked at (gallery, by eye)
Opened 08 settings (narrow and wide, before and after), 10 blocks, 11 tiles and bubble, 12 sheet (narrow and wide), and the click test's blocks picture. Compared with look A: tiles, number boxes, the glow on the right tile, the "Not quite" sheet and the bubble's shape match it closely. After the first look I removed an empty line that left a gap at the bottom of the "Your progress" card.
**Still looks weak (later sessions' jobs):** the off switches are quite dim (fine for "off", but a design review may want a touch more contrast on the knob); the other screens still use their own hand-made buttons and tiles until R05–R15 switch them over; the "Back up now" and "Show my progress file" buttons have no icons (there's no fitting icon in the set yet).

## What's next
- Next task: T59, session R04 (motion kit and app frame). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- Building blocks in `app/src/ui/` with colours as tested token pairs, one press spring hook, `useCalm()` in every moving block, a see-through real checkbox inside the switch, sliding progress fills, the `#blocks` page; the daily goal is a pill row.

## Questions for the owner
- None. Optional: open `docs/redesign/gallery/latest/08-settings.webp` and say if you like the switches.

## New words (also added to GLOSSARY.md)
- Building blocks (components), switch (toggle), spring (animation), bottom sheet.

## Approvals and blocks
- Nothing asked for approval; nothing was blocked. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.

## Notes for the next Claude
- Import blocks from `./ui` (screens) or `../ui`. Colours: add new tone pairs in `ui/tones.ts`, and the unit test checks them.
- **R04:** move `SPRING`, `PRESS`, `QUICK_FADE`, `INSTANT` and `useCalm` from `ui/tones.ts` / `ui/press.ts` into the one speed file, and keep `ui.test.ts` pointing at them. `AnswerTile` already draws the number key (`n`); R04 makes keys 1–4 press it.
- `MotionConfig reducedMotion` alone does **not** stop a piece that was already on screen when the setting changed. Use `useCalm()` and pass `INSTANT` as the transition (see `Switch.tsx`).
- Pressing and releasing on a button in a click test is a real click. To test the squish, slide the mouse off before `mouse.up()` (see `tests/blocks.spec.ts`).
- `BottomSheet` is `position: fixed` at the window bottom; a screen using it needs bottom padding so the sheet doesn't cover its last lines.
- `settings-note` exists only after a backup was pressed.
