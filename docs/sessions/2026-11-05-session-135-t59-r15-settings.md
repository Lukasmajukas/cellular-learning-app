# Handoff note: 2026-11-05, T59 redesign R15 (settings)

**Status:** IN PROGRESS
**Model used:** Large (Opus), High effort (a Sonnet robot run claimed it and handed it to this Opus chat) · **Branch / pull request:** claude/robot-t59-r15, #139

## In simple words (for the owner)
The Settings tab now matches the rest of the app. Every row starts with its own small picture (a speaker, a play button, a gauge, a moon or sun, a folder), so you can find things at a glance. There's a new "Play a sample" button: it plays the "right" sound and then the "not quite" sound, even when Sounds are off, and a soft blue ring goes out from its picture with each sound. The old "Day look" on/off switch is now a choice between Night (moon) and Day (sun). A new "Keys" card lists the keyboard keys.

## What was done
- **Settings tab, `app/src/SettingsScreen.tsx`** (rewritten):
  - "YOUR APP" label, "Settings" title (28 px), one line: "Changes are saved on this computer straight away."
  - Six cards: **Sound** (Sounds switch; Play a sample), **Movement** (Reduce motion, Show frame rate), **Daily goal** (1, 2, 3, 5), **Look** ("Colours": a Night / Day pill choice with a moon and a sun; the row's icon and words follow the choice), **Your progress** (Back up now; Show the progress file; plain words: the app also makes a backup each day and keeps 7, which is what `electron/store.cjs` does), **Keys** (1-9, Enter, Esc as small key caps).
  - Every row starts with a 36 px icon tile (signal-blue icon on `surface2`): idea I11.
  - Rows with a switch are still labels (click the words to flip it). Rows with a button are not, because a label passes a click on its words to the button (a click on "Back up" would have made a backup).
- **Play a sample:** `playSample()` in `app/src/sound.ts` plays the right tone, then the not-quite tone 0.4 s later, even with Sounds off (it never changes the setting). It returns how long it lasts. `beep()` is unchanged for lessons. While it plays, the play icon's glow layer fades on, and one ring goes out with each tone (scale 1 to 1.9, see-through 0.8 to 0, 0.6 s; the second 0.4 s later). With Reduce motion: only the glow. Speeds: `SAMPLE` in the speed file.
- **Look: Night / Day.** The switch `set-day` is gone; the choice is `set-look` (`set-look-night`, `set-look-day`). Arrow keys move between them. Day is still the early test; R20 finishes it.
- **Icons (`app/src/theme/icons.ts`):** 8 new: play, motion, gauge, target, moon, sun, backup, folder (gallery `00-icons`).
- **Pill choice (`app/src/ui/Pill.tsx`):** an option may have an icon; the code font is used only for number choices (so "Night" and "Day" are in the normal letters).
- **Gallery (`app/tools/gallery.mjs`):** new `36-settings-sample` (the glow and first ring mid-sample), `37-settings-bottom` (look, progress, keys), `38-settings-day`. `09-path-map-day` now picks Day with the new choice.
- **Tests:**
  - Unit (+4, 212 in all): the 8 new icons; `SAMPLE` moves only size and see-through-ness, fades to nothing, doesn't loop, its second ring matches the second tone, all within 1.6 s; every settings row has an icon, the look is a Night / Day choice, Reduce motion is read live.
  - New `app/tests/settings.spec.ts` (3 click tests): icons on every row in order, all six cards, the keys, Sounds' icon changing, Night / Day changing the whole app and the row, arrow keys, a click on a button row's words not pressing the button; the sample with a pretend sound card (660 Hz, then 200 Hz 0.4 s later, with Sounds off, and Sounds stay off), both rings growing and fading, the second one later, frame rate; Reduce motion (glow on, no rings, glow off again).
  - Updated: `blocks.spec.ts` (3 switches now, the look pills and sample button are 44 px or bigger), `save.spec.ts` (Day via the new choice is saved and comes back).

## Test results
- Unit tests: 212 pass (208 + 4). TypeScript OK.
- Click tests (cloud): RESULTS_E2E
- Windows build (GitHub): RESULTS_WIN

## What I looked at (by eye)
- Before: `08-settings` from R14: plain cards, only Sounds had an icon, "Day look" was an on/off switch, two buttons with no words about what they do.
- After (620 x 960, then the gallery at 620 x 960 and 1280 x 800):
  - `08-settings`: label, title and help line; every row has its icon tile, lined up; the goal pills sit under their row's words.
  - `36-settings-sample`: the play tile glowing with a ring around it, caught 0.2 s in.
  - `37-settings-bottom`: Colours with Night picked (moon), Day (sun); Back up now and Show; the key caps.
  - `38-settings-day`: the same screen in the early Day look: readable, the icon tiles light blue-grey with dark teal icons.
  - `00-icons`: the 8 new icons sit with the others (same line width, same size).
- Frame by frame (film tool, every frame): ring 1 grows 1.02 → 1.13 → 1.23 → 1.33 → 1.41 ... 1.9 while fading 0.78 → 0; ring 2 stays put until ring 1 is past 1.45, then does the same. 60 fps.
- Fixed from the first look: the Look row's name repeated the choice ("Night" over "Night / Day"); it's "Colours" now. The backup hint wrapped to 4 lines; it's 2 now.
- **Still looks weak:**
  - The sample plays two code-made tones; real sounds come in R19 (idea I55).
  - Night to Day snaps every colour at once (I56).
  - The tab is about two screens tall at 620 x 960 (I57).

## What's next
- Next task: T59, session R16 (design review 2). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- The settings layout, the sample (plays with Sounds off, never changes the setting), Night / Day as a pill choice, the Keys card in Settings, rows with buttons not being labels, number-only code font in pill choices.

## Questions for the owner
- None. Optional: open Settings on your PC, press Play, and tell any chat whether the sounds and the rings feel right.

## New words (also added to GLOSSARY.md)
- None.

## Approvals and blocks
- APPROVALS_LINE

## Notes for the next Claude
- The look's test IDs are `set-look-night` / `set-look-day` (pill radios, `aria-checked`), not a checkbox. `set-day` is gone.
- `playSample()` ignores `prefs.sounds` on purpose; `beep()` still checks it. R19: keep both calls, swap what they play, and keep `SAMPLE_GAP` equal to `SAMPLE.gap` (a unit test checks).
- `settings.spec.ts` swaps `window.AudioContext` for a pretend one before the first sound, so it can check which tones play and when. The app makes its sound context only on the first sound, so that works as long as nothing beeps first.
- The click itself takes up to about a second in Playwright, so a film around a click needs a long window (the sample test uses 2.6 s).
