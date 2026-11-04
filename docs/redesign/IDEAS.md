# 💡 Ideas board (the redesign's "could be better" list)

**What this is:** the robot's to-do list for making the app look and feel better, after the 24 planned sessions in `docs/redesign/PLAN.md` (and for ideas found along the way). The top unticked idea goes next. Design reviews re-order the list. **The owner's wishes always go to the top**, in their own words, with the date.

**Rules:** one idea per chat; it changes how things look, move or sound, never the facts or lessons (new teaching features need a normal task in `TASKS.md`); it follows `docs/redesign/DESIGN.md`; when done, tick it with the date and pull request. An idea that turned out bad gets crossed out with the reason, not deleted.

## From the owner (always first)
- (none yet: tell any chat, and it lands here)

## Ideas
| # | Idea | From | Status |
|---|---|---|---|
| I01 | Each unit's path background gets its own radio "weather": wide slow rings for low band, tight fast ones for mmWave, so the map changes as you travel. | T58 plan | ⬜ |
| I02 | Signal bars (0–5) shown small under each finished lesson circle, so mastery shows on the map. | T58 plan | ⬜ |
| I03 | A slow radar sweep across the daily review button when reviews are due. | T58 plan | ⬜ |
| I04 | Beacon dozes ("sleepy" face) on the path map late at night and wakes up when you open a lesson. | T58 plan | ⬜ |
| I05 | Unit banners with a small line drawing of that unit's idea (a spectrum ruler, a fake tree, a radio box). | T58 plan | ⬜ |
| I06 | The heatmap tiles "flicker on" like a lit-up panel the first time each day you open it. | T58 plan | ⬜ |
| I07 | Personal-best moments (a perfect lesson, a 7-day streak) get their own short Beacon animation. | T58 plan | ⬜ |
| I08 | The settings checkboxes are the plain grey Windows boxes: swap them for the glowing switch from R03 (on = signal colour, a little spring). | R01 | ✅ 2026-11-04, #126 (done in R03) |
| I09 | The heatmap text still says "Grey = not quizzed yet", but new tiles are now dim outlines; reword it and add a small colour legend (fading → shaky → strong) in R14. | R01 | ⬜ |
| I11 | Each settings row gets its own small icon (motion, frame rate, goal, look, backup), like Sounds already has, so the list is quicker to scan. Do it with R15. | R02 | ⬜ |
| I12 | Icons for "on air" things (the current lesson's tower, the streak flame when it grows) get a soft still glow layer behind them (its see-through-ness may pulse, never a blur animation). | R02 | ⬜ |
| I13 | The gallery's icon sheet (`00-icons`) could also show each icon in the Day look and at 16 px, to catch thin lines that break up when small. | R02 | ⬜ |
| I14 | The answer tiles' number keys (1-5) are only drawn so far: R04 makes keys 1-4 pick them. Then the number box could light up for a moment when its key is pressed, so you see the keyboard worked. | R03 | ⬜ |
| I15 | A switch flipping on could send one soft signal ring out from the knob (a see-through ring that grows and fades), like a tower coming on air. | R03 | ⬜ |
| I16 | The "Your progress" card could show when the last backup was made ("Last backup: today, 09:12"), so you don't have to press the button to know. Needs the save code to report the newest backup file. | R03 | ⬜ |
| I17 | The lesson circles pop in again, with a slow bounce (about a second), every time you come back to the Path tab. Pop them in only on the first visit after the app starts, or only the ones that changed, and keep the bounce short. Do it with R06. | R04 | ✅ 2026-11-04, #129 (done in R06: circles pop in once, as they scroll into view; the bounce is the DESIGN.md "bouncy" spring, about 0.7 s) |
| I18 | Show the keys once: a small, quiet "Keys: 1-4 pick · Enter go on · Esc leave" line in the first lesson (or a row in Settings), so the keyboard is easy to discover. | R04 | ⬜ |
| I19 | Each tab remembers where you scrolled: coming back to the Path from Settings now starts at the top. Keep each tab's place (and open the path at your current lesson the first time, as R05 plans). *(R05: the path now opens at your current lesson every time it appears; the other tabs still start at the top. Remembering your exact place is still open.)* | R04 | ⬜ |
| I20 | Tap a lesson's name as well as its circle: the name is a bigger, easier target (keep one button per lesson for the keyboard and screen readers). | R05 | ⬜ |
| I21 | Checkpoint lessons get their own shape (a wider tower with a small flag, or a hexagon), so the end of each unit stands out on the map. | R05 | ⬜ |
| I22 | Let the dotted line carry on between units (through the gap, past the next unit's banner), so the whole path feels like one journey instead of ten separate pieces. | R05 | ⬜ |
| I23 | The lesson-complete confetti keeps falling over the path while "coming on air" plays, so the two celebrations overlap. Let the burst end before you leave the lesson-complete screen (or fade it out as the path glides in). Do it with R12. | R06 | ⬜ |
| I24 | The reached dotted line could have a slow "signal" dot travelling along it to the current lesson (one ambient loop instead of the breathing rings when the current lesson is off screen). | R06 | ⬜ |
| I25 | When a whole unit is done, the path could also show a short "Unit 1 complete" line under the last lesson for a moment (for long units whose banner is too far up to see the "done" pop on). | R06 | ⬜ |
| I10 | The gallery could also take a short burst of pictures of each animation (a "flip book" strip), so reviews can see movement without installing the app. | R01 | ⬜ |
