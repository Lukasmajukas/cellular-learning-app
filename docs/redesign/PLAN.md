# 🛠️ The redesign plan: "Night Signal"

**Status:** SIGNED OFF by the owner on 2026-11-04. Written 2026-11-04 in T58 (session 119, Opus, High effort).
<!-- When the owner types "I sign off the redesign plan", a chat adds the line below and merges it. That line lets the robot start session R01. -->
Signed off by owner: 2026-11-04 ("I sign off the redesign plan", typed in the T58 chat).
**Redesign switch:** ON <!-- The owner's "Pause the redesign" sets this to PAUSED; "Resume the redesign" sets it back to ON. The robot does redesign sessions only while it says ON. -->

## In simple words (for the owner)
The app works, but it looks like a school worksheet. This plan turns it into a finished app with the **Night Signal** look you picked: dark, calm and glowing, with **Beacon**, the little glowing tower, reacting to how you do. It happens in **24 small redesign sessions**, each one a separate robot chat on Opus that changes one part of the app, tests it, and saves it. After session 24 the robot **keeps improving** the app from an ideas board, forever, until you pause it.

You chose to let the robot run this on its own (Nov 4): it doesn't wait for you, and it makes the design decisions itself, following the rulebook in `docs/redesign/DESIGN.md`. You can look whenever you like: every saved session makes a new "Latest build" on the Releases page, and new pictures of every screen in `docs/redesign/gallery/`. Anything you say in any chat ("I don't like the glow", "make the circles bigger") goes to the top of the robot's list.

**Two things to know:**
1. **Your usage limit is the real speed limit.** Each session is a long Opus chat (about $6–10 of usage). The robot works until your weekly limit is used up (your choice in T50), so it may use it up within a few days, then wait for the Wednesday reset. Your own chats share that limit. Type `Pause the redesign` (or `Stop the robot`) when you need room, and `Resume the redesign` after.
2. **This replaces a promise in the plan.** The PRD says every step waits for you to try it ("Nothing moves on until you've said so"). For the redesign you chose otherwise. Bugs are still caught by automatic tests, and the robot checks pictures of every screen it changes, but some problems only show on your PC (like the green start-up picture, T57). So please try a build now and then.

## Your choices (2026-11-04, in chat)
| Question | Your answer |
|---|---|
| Look | **A: Night Signal** (`looks/look-a-night-signal.webp`) |
| Mascot | **Beacon** (glowing lattice tower) |
| Sound | **Real effects from a free library** (CC0), credited |
| Mac and iPhone | **Built so it carries over; Windows only for now** |
| Who runs the sessions | **The robot, as well as you** |
| Pace | You first picked 3 a week, then said: "I want it to just keep improving and make more designs", and chose **"never wait for me"**. So: **nonstop**, limited only by your usage limit |
| New designs | **The robot decides alone**, following `DESIGN.md` |

## The 24 sessions
Each row is one chat: Large (Opus), High effort. R01 to R04 must go in order (everything stands on them). After that, a blocked session may be skipped and the next one done. Status: ⬜ to do · ✅ done (date, pull request) · ⛔ failed twice, needs the owner. Rows are done top to bottom, so a design review re-orders them by moving rows (R17 moved up in review 1); a row keeps its number.

### Part 1: the foundations
| # | Session | What changes on screen | Status |
|---|---|---|---|
| R01 | **Paint and letters** | Every colour comes from one token file; the old Duolingo colours are gone; the bundled fonts (Space Grotesk, JetBrains Mono); the night background glow. Also builds the **gallery tool** (`npm run gallery`: pictures of every screen) and two tests: "no Duolingo colours" and "text contrast". | ✅ 2026-11-04, #124 |
| R02 | **Our own icons** | About 20 icons drawn in code replace the emoji in buttons and labels (🔥 ⚡ 🔒 ⚙️ 🌡️ 🚗 📡). Test: no emoji in screen files. | ✅ 2026-11-04, #125 |
| R03 | **Building blocks** | Buttons, cards, answer tiles, pills, switches, progress bar, bottom sheet, speech bubble, each with its press-and-hover springs. The Settings screen is switched over first, as the proof. | ✅ 2026-11-04, #126 |
| R04 | **Motion kit and app frame** | One speed file (springs, timings, reduce motion in one place); the app frame with the top bar and the bottom tabs (Path, Review, Heatmap, Settings); screens glide into each other; keyboard keys 1–4, Enter and Esc (promised in PRD 4e, never built). | ✅ 2026-11-04, #127 |

### Part 2: the screens
| # | Session | What changes on screen | Status |
|---|---|---|---|
| R05 | **Path map: layout** | Unit banners, lesson circles zig-zagging with their names beside them, the dotted signal line, done/current/locked looks; opens scrolled to your current lesson. | ✅ 2026-11-04, #128 |
| R06 | **Path map: movement** | Circles pop in as you scroll; the current one's rings breathe; "coming on air" when you finish a lesson; the line draws itself; a moment when a whole unit is done. | ✅ 2026-11-04, #129 |
| R07 | **Top bar and daily goal** | Streak, XP and goal redrawn; XP counts up; the flame flickers when your streak grows; goal bar fills with a spring; streak freeze and repair restyled. | ✅ 2026-11-04, #130 |
| R08 | **Design review 1** | A full review of R01–R07 against `DESIGN.md` and the look A picture: score every screen, fix small things, re-order the rest of this plan if needed. | ✅ 2026-11-04, #131 (`docs/reviews/2026-11-04-design-review-1.md`) |
| R17 | **Beacon is drawn** | The new mascot with six faces (idle, happy, oops, thinking, cheering, sleepy), breathing rings and blinks. Replaces the old tower. *(Moved up by design review 1: R09–R12 all place Beacon, so it's drawn first and they're built around the real one, not the old triangle.)* | ✅ 2026-11-04, #132 |
| R09 | **Question screen** | Progress bar, Beacon's spot with a speech bubble, the "PICK ONE" label, numbered answer tiles, the bottom "Right!" / "Not quite" sheet. *(Review 1: use the R03 bottom sheet; Continue matches the answer, red after "Not quite", as in look A.)* | ✅ 2026-11-04, #133 |
| R10 | **The other question types** | Match pairs, type the number, put bands in order, scenario clues, photo questions, tap-the-clue, learn cards and the spectrum bar, all in the new look. *(Also idea I38: the "Not quite" sheet stays short; the long parts wait behind a quiet button.)* | ✅ 2026-11-04, #134 |
| R11 | **Lesson movement** | Questions glide in and out; right answers glow, wrong ones shake gently; the progress bar springs forward. *(Review 1: no confetti after each right answer; the tile glow does that job (I31).)* | ✅ 2026-11-04, #135 |
| R12 | **Lesson complete** | Stars drop in one by one, XP counts up like a meter, signal bars fill, a short "signal burst" instead of plain confetti. Checks that the burst shows on Windows (the confetti you never saw, T46/T57). *(Review 1: one main button, "Back to the path"; "Again" becomes quiet (I32).)* | ✅ 2026-11-04, #136 |
| R13 | **Daily review and notices** | The review screen ("drive test"), the "This changed" card, the save-restored notice. | ✅ 2026-11-05, #137 |
| R14 | **Heatmap** | Band tiles glow brighter the better you remember them; legend; tap a tile to see its lessons; tiles fill in one by one. | ✅ 2026-11-05, #138 |
| R15 | **Settings** | The whole settings screen in the new look, with a sound "play a sample" button and the look switch made ready for Day. | ✅ 2026-11-05, #139 |
| R16 | **Design review 2** | Every screen together: does it feel like one app? Fix small things; re-order what's left. | ✅ 2026-11-05, #140 (`docs/reviews/2026-11-05-design-review-2.md`) |

### Part 3: Beacon and sound
| # | Session | What changes on screen | Status |
|---|---|---|---|
| R18 | **Beacon reacts** | Beacon joins the questions, the lesson-complete screen and the path map ("you are here"), with short kind lines from a data file. *(R09 started that file, `app/src/questionScreen.ts`, with the question screen's lines; R18 adds the rest there.)* *(Review 2: also I46, lesson complete drops the lesson's top row so it reads as "finished", and I48, centre that screen's block on a tall window.)* | ✅ 2026-11-05, #141 |
| R19 | **Sound** | Free CC0 sound effects, credited, about 7 sounds; volume and sample button. If no free source can be reached, nicer code-made sounds, and a "You" row asking you to download a pack. *(Done with real sounds: kenney.nl is blocked from the cloud, but the same CC0 pack downloads from OpenGameArt, so no "You" row was needed.)* | ✅ 2026-11-05, #143 |

### Part 4: finishing
| # | Session | What changes on screen | Status |
|---|---|---|---|
| R20 | **Day look** | A light version of every screen; ⚙️ "Look: Night / Day"; contrast tests for both. *(Review 2: also I52, a warm dark `streakBg` fill for the heatmap's "okay" tiles.)* *(Also: the app opens in the saved look from the first moment, and the look changes with a 0.3 s fade (I56).)* | ✅ 2026-11-05, #144 |
| R21 | **First start, empty screens, start-up** | A short welcome the first time (what the app teaches, pick a daily goal); our own start screen from the very first moment (compare with T57's picture); friendly empty and error screens. *(Done: the window now waits until the start screen is drawn, so the first thing you see is always our own picture; that may also hide T57's picture, which is worth a look on your PC.)* | ✅ 2026-11-05, #145 |
| R22 | **Window sizes, keyboard, easy to read** | Works from a phone-narrow window to full screen; keyboard everywhere with visible focus; right/wrong never shown by colour alone. *(Review 2: also I57, a shorter Settings tab at 620 × 960.)* *(Done: the smallest window is 360 × 560 and every screen fits it; Tab reaches everything with a ring you can always see, the match has letter keys (I41) and the tap-the-picture question has arrow keys; the tap dot and clue cards got a tick or a cross; Settings is about 100 px shorter.)* | ✅ 2026-11-05, #146 |
| R23 | **Speed check** | Measures every animation's frame rate, scrolling the 49-lesson path, and start-up time; makes the slow ones cheaper. *(Done: Beacon's breathing rings were redrawn by code every frame, 48-61 ms of work a second whenever Beacon was on screen; they're now on their own layer, under 7 ms. The night glow was a "fixed background" that repainted the window at every scroll step; now its own layer, so scrolling the path takes about a fifth less work. Start-up was already quick (window 0.2 s, app ready 0.2 s, then the start screen's half second). New: `tests/speed.spec.ts`, every animation's frame rate with the computer slowed to a quarter speed.)* | ✅ 2026-11-05, #147 |
| R24 | **Design review 3 (final)** | The whole app against `DESIGN.md`; fixes; marks the Night Signal redesign done; fills the ideas board for the next part. *(Done: 4.7 out of 5 (review 2: 4.4). Three fixes: a tall sheet's words now start on the page's column (its scrollbar pushed them 8 px left); "What happened" on the error screens has our chevron, not the browser's triangle; the number question's help line no longer repeats its label. The ideas board has a new order and I78-I80. `docs/reviews/2026-11-05-design-review-3.md`.)* | ✅ 2026-11-05, #148 |

### After R24: keep improving (forever, until paused)
**The 24 sessions are done (2026-11-05, design review 3): the Night Signal redesign is done.** What follows is this part.

Each robot redesign chat takes the top idea from `docs/redesign/IDEAS.md` and builds it, one idea per chat. Every 8th chat is a design review that scores the app again and re-orders the ideas. The owner's own wishes always go first. The robot never adds facts or lessons this way: new teaching features need a normal task.

## Every redesign session does this (the checklist)
1. **Start:** the normal start-up check (`docs/WORKFLOW.md` A), then read `DESIGN.md`, this plan, `IDEAS.md` and the last redesign handoff note. Take "before" gallery pictures of the screens it will touch (from R01 on).
2. **Build** only what its row says, following `DESIGN.md`. If the session finds a better idea outside its row, it writes it in `IDEAS.md` instead of doing it.
3. **Automatic checks, all must pass:** unit tests (`npm test`); click tests in the real app (`npm run e2e`), including a frame-rate measurement for anything new that moves (at least 50 fps on average while it moves, in the cloud; T46 measured 60 there) and a reduce-motion test (nothing moves with the ⚙️ switch on); "no Duolingo colours", "no emoji in screens" and "text contrast" (from R01–R02); the content checker (facts untouched). Then the Windows build on GitHub (unit tests, click tests and the installer) must pass before merging. A test that fails now and then gets fixed, never skipped or switched off.
4. **Look at it:** take "after" gallery pictures at the owner's window size (620 × 960) and a wide one (1280 × 800), in Night (and Day from R20). Claude opens and looks at every picture it changed, compares it with the look A picture and `DESIGN.md`, and writes in the handoff note what it checked and what still looks weak. Any new animation also gets a short frame-by-frame check (several pictures in a row) to see that it really moves.
5. **Write it down:** tick the row here (✅ date, pull request); add up to 3 "could be better" ideas to `IDEAS.md`; replace `docs/redesign/gallery/latest/` with the new pictures (small WebP files); one plain-English diary line in `docs/PROGRESS-LOG.md` saying what you'll see that's new.
6. **Finish** the normal way (`docs/WORKFLOW.md` C) and merge.
7. **If it fails:** a session that fails its checks writes BLOCKED in its handoff note and is retried once (as a new Opus chat). After two failures: mark it ⛔, add a "You" row in `TASKS.md`, and move on (only after R04).

## Design reviews (R08, R16, R24, then every 8th chat)
An Opus chat that changes no new screens. It opens every gallery picture, scores each screen from 1 to 5 on look, movement, clarity and "feels like one app", writes `docs/reviews/YYYY-MM-DD-design-review-N.md`, fixes small problems itself (each with a test or a picture), and re-orders the rest of this plan or `IDEAS.md`. It may change `DESIGN.md`, but it has to write down why.

## Risks and what we do
| Risk | What we do |
|---|---|
| Your usage limit runs out early each week | The robot stops when it runs out and waits for the reset (it never uses paid extra). `Pause the redesign` frees the limit for you. |
| It goes too fast to judge | Every session is small and saved separately, so `Undo the last change` works on any one. The gallery shows each change as pictures. |
| The design drifts without you checking | `DESIGN.md` plus a design review every 8 chats; tests for colours, emoji, contrast, frame rate and reduce motion. |
| Problems only your PC shows (graphics chip) | Cheap effects only (no animated blur or shadows); T57 stays open; try a build now and then and say what looks odd. |
| Claude can't paint like an illustrator | Night Signal is made of shapes, lines and glows, which Claude draws well in code. No painted art is needed. |
| The robot keeps redoing the same thing | No session undoes an earlier choice without a written reason (a design review or your words). |
| The repository gets heavy from pictures | Gallery pictures are small WebP files, and `latest/` is replaced each time. |
| Facts get changed by accident | The redesign never edits `content/`; the content checker runs every time. |
| The robot stops doing other tasks | Content tasks below T59 in `TASKS.md` wait while the redesign runs. Do one in a chat you start, or move it above T59. |

## What's already decided elsewhere (still true)
Reduce motion is the app's own switch only (T46). Pictures are copyright-free with credits, or drawn by Claude; never AI photos for identification. Facts come only from the data files. Windows first, nothing Windows-only. Mascot drawn by Claude in SVG with Motion (not Rive). Free: fonts under OFL, sounds under CC0.
