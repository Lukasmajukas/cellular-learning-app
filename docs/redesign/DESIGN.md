# 🎨 Style guide: the "Night Signal" look

**Status:** SIGNED OFF by the owner on 2026-11-04 (with `docs/redesign/PLAN.md`). Written 2026-11-04 in T58 (session 119).
**Picked by the owner on 2026-11-04:** look A "Night Signal", mascot "Beacon". The picture everyone copies from: `looks/look-a-night-signal.webp` (its source: `looks/looks.html`). Looks B and C were not picked; they stay in `looks/` for the record.

## In simple words (for the owner)
This is the app's rulebook for how things look, sound and move, like a team's kit rules: same colours, same letters, same way of moving on every screen. Every redesign chat follows it, so the app feels like one finished thing instead of a patchwork. The feeling we're after: **dark, calm and glowing, like a radio engineer's screen at night.** Lessons light up like towers "coming on air".

---

## 1. Feel (what every screen should say)
- **Calm, not loud.** Dark background, a few glowing colours. Glow means "alive" or "on air".
- **Radio, not cartoon.** Rings, waves, signal lines, meters. Original to us: nothing from Duolingo (decision of 2026-10-31).
- **Kind.** Mistakes get a gentle "Not quite", never red flashing or guilt.
- **Movement explains.** Every animation shows what happened (you got it right, a lesson unlocked, XP was added). No movement just for show.

## 2. Colours ("design tokens")
One file holds every colour, size and speed (`app/src/theme/` from session R01). Screens never type a colour code themselves.

**Night (the default, dark):**
| Token | Colour | Used for |
|---|---|---|
| `bg` | `#08101D` | The far background. Behind the content column: a soft radial glow `#16304F` → `#0E1C31` → `#0A1424` |
| `surface` | `#0F1D33` | Cards, answer tiles |
| `surface-2` | `#132A46` | Raised cards, hover |
| `border` / `border-strong` | `#1F3A5C` / `#2A4C75` | Lines around cards and tiles |
| `text` / `text-muted` | `#E6EEF9` / `#8EA3BF` | Words / quieter words (6.6:1 on `surface`) |
| `signal` | `#3FD8F2` | The main colour: buttons, the current lesson, links, progress |
| `on-air` | `#4BE3A1` (background `#0F2E2A`) | Right answers, finished lessons |
| `miss` | `#FF6B6B` (background `#2A1520`, words `#FFC9C9`) | Wrong answers (always with an icon and words, never colour alone) |
| `streak` | `#FFBF47` | Streak flame, stars |
| `review` | `#9B8CFF` | Daily review, "due" counts |
| `locked` | `#2A4466` (icon `#4D6688`) | Locked lessons (dashed outline) |
| Text on `signal`, `on-air`, `miss` buttons | `#08101D` | Dark text on bright buttons |

**Day (light, built in session R20):** the same tokens, lighter. Starting values to test: `bg #F3F7FC`, `surface #FFFFFF`, `border #D5E1EF`, `text #0E1C31`, `text-muted #4F6582`, `signal #087A97`, `on-air #13A36B`, `miss #D9434A`, `streak #B87A00`, `review #6A5AE0`. *(R01, 2026-11-04: five of these failed the contrast test, so the token file uses slightly darker ones: `signal #066E89`, `on-air #0A7A4E`, `miss #C0343B`, `streak #8C5C00`, `review #5646CF`. The token file `app/src/theme/tokens.ts` is the source of truth.)* The ⚙️ "Dark look" switch becomes "Look: Night / Day".

**Rules:**
- Every text colour passes a contrast test: 4.5:1 for normal text, 3:1 for big text and icons (an automatic test from R01).
- The old Duolingo colours (`#58CC02`, `#1CB0F6`, `#FF9600`, `#CE82FF`, `#D7FFB8`, `#FFDFE0`) are banned. An automatic test fails if one comes back.

## 3. Letters (type)
- **Space Grotesk** for all words (weights 400, 500, 700). **JetBrains Mono** for numbers people read like data: MHz, XP, PCI, ARFCN, eNB IDs, counts like "5 / 12". Use tabular (same-width) digits.
- Both are free under the SIL Open Font License (OFL). They're **bundled inside the app** (npm `@fontsource/...` or the font files with their licence), never loaded from the internet. So the app looks the same offline, on Windows, and on a Mac or iPhone later.
- Sizes: 12 (small capital labels like "PICK ONE", letter spacing 0.12em) · 14 (small) · 16 (body) · 18 (answer tiles) · 23 (questions) · 28 (screen titles) · 40 (big numbers on the lesson-complete screen). Line height 1.25 for headings, 1.4 for text.

## 4. Spacing and shapes
- Spacing steps: 4, 8, 12, 16, 20, 24, 32, 40 px. Screen side margin 20 px.
- One content column, at most 440 px wide, centred. Wider windows show more background, not wider tiles (so a phone version later is the same layout).
- Corners: 14 px (tiles, buttons), 16–18 px (cards), round (pills, lesson circles).
- Smallest thing you can click: 44 × 44 px.
- The page always keeps the scrollbar's strip (`scrollbar-gutter: stable`), even on a screen too short to scroll. *(Design review 1, 2026-11-04: without it, the whole frame jumped sideways by the scrollbar's width when you switched from the Path tab to a short tab.)*

## 5. Icons
- Our own icon set, drawn in code (SVG): 24 × 24 grid, 2 px lines, round ends, one colour (`currentColor`). One file (from R02).
- **No emoji in the app's own buttons and labels** (🔥 ⚡ 🔒 ⚙️ 🌡️ 🚗 📡 and the rest). Emoji look different on Windows, Mac and iPhone, so the app would change looks from one computer to the next. An automatic test checks the `.tsx` screen files. Lesson text keeps whatever the lesson files say.
- The basic set: flame, bolt, tower, lock, check, cross, waves, map pin, repeat, grid, gear, star, freeze, repair, back, close, sound on, sound off, info, chevron.

## 6. Building blocks (components)
Built once (R03, R04) and used everywhere. *(R09: the bottom sheet is drawn straight into the page, outside the moving screens, so it always sits on the window's bottom edge; the progress bar's colour fade stays still and a cover slides off it, so a short fill starts blue as in look A. R10: a **chip** joins the set, a small rounded answer as wide as its words (scenario clues, items to put in order), with the answer tiles' looks; the tiles gain a **paired** look (matched up or placed, not checked yet) and an empty dashed number box; every question type ends with one full-width Check that hides once the sheet's Continue takes over.)* app shell (top bar + content + bottom tab bar: Path, Review, Heatmap, Settings), button (signal / on-air / miss / quiet), card, answer tile (with its number key), chip, bottom sheet (the "Right!" / "Not quite" panel), progress bar, pill (like "6 due"), stat chip (streak, XP), switch, unit banner, lesson node (done / current / locked), speech bubble, Beacon, signal burst (R12: the lesson-complete celebration).

## 7. Movement (motion rules)
**What may move:** only position, size, turning and see-through-ness (transform and opacity), because those stay smooth on any computer (PRD 4e). Measured exceptions: drawing the path's line (`pathLength` or `stroke-dashoffset`) and counting numbers up. **Glows never animate a blur or shadow:** a glow is its own layer, and only its see-through-ness changes.

**Speeds (one file, from R04: `app/src/theme/motion.tsx`; a test fails if another file types its own):**
| Kind | Time | Example |
|---|---|---|
| Tap / hover | 120–180 ms, spring "snappy" (stiffness 500, damping 30) | A button squishes when pressed |
| Small feedback | 200–300 ms | A tile glows green; a wrong tile shakes 3 times |
| Screen change | 320–420 ms | A lesson slides up; going back slides it down |
| Pop-in | spring "bouncy" (stiffness 300, damping 14), 40–80 ms between items, at most 400 ms in total | Lesson circles appear one by one |
| Celebration | up to 1.6 s, never blocks a tap | Stars drop in, XP counts up, signal bars fill |
| Background ("ambient") | 2–4 s loops, very soft, at most 2 on screen, paused when the window is hidden | The current lesson's rings breathe; Beacon blinks |

**Moments that must feel great** (each gets checked with screenshots and the frame-rate test):
1. **Coming on air:** you finish a lesson, go back to the path, and its circle turns green with a ring burst; the next circle's lock pops off; the line between them draws itself.
2. **Right / not quite:** right = the tile glows green, Beacon's head rings pulse once; wrong = the tile shakes gently, Beacon looks worried; the bottom sheet slides up. *(Built in R11, 2026-11-04: the right tile, chip or number box pops 3.5% bigger and back while its glow layer flashes on and settles at 75%; a wrong one shakes 3 times, 6 → 4 → 2 px, in 0.3 s; the tap dot lands with a pop or a shake. No confetti after an answer (idea I31): the burst is for lesson complete only. The next question glides in from 40 px to the right as the old one leaves to the left (0.12 s out, 0.3 s in); the progress bar springs a touch past its new place (spring `step`, about 7% of one step) with a soft spark at its tip. In "put them in order" a chip glides into its slot and back, and the others glide to close the gap; a match tile's number box pops in when it gets its partner's number. All in `FEEDBACK` and `questionGlide` in the speed file, and `app/src/ui/feedback.tsx`. With Reduce motion: nothing moves, the looks change and the glow fades in; a new question fades in.)*
3. **Lesson complete:** Beacon cheers; stars drop in one at a time; XP counts up like a meter; signal bars fill one by one; a short "signal burst" (rings and wave pieces instead of plain confetti). *(Built in R12, 2026-11-04: the end screen has its own 112 px Beacon, which grows from its question size with a spring (one transform; idea I34) and cheers. Behind its head the signal burst: 3 rings (60 px, growing to 2.2 times and fading, 0.15 s apart) and 12 small wave arcs in the four bright colours, flying from 28 to 84 px out and fading, so they stay clear of the lesson's top row. The earned stars drop 28 px into dim outlined places, 0.2 s apart; XP counts up from 0 in a card ("XP EARNED", 40 px code font); the earned signal bars fill from the bottom, 0.1 s apart, in a second card ("SIGNAL"). All over by 1.4 s. One green full-width "Back to the path" (Enter), a quiet "Again" under it (I32), and "1 fixed" beside "2 of 3 right the first time" when a comeback was right (I43). The burst is drawn in the page, not on a canvas, so it shows on any computer; the confetti library is gone. Speeds: `COMPLETE` in the speed file; code: `app/src/LessonComplete.tsx`, `app/src/ui/SignalBurst.tsx`. With Reduce motion: no burst, nothing moves, the result is simply there.)*
4. **Screens:** the path opens scrolled to your current lesson; screens glide; nothing jumps.
5. **The top bar:** XP ticks up, the flame flickers once when the streak grows, the goal bar fills with a spring.

**The Review tab and the notices (built in R13, 2026-11-05):** the Review tab is the "drive test": a radar scope (224 px, three rings and a faint cross) with one review-purple blip for each question waiting today (at most 20), on the inner ring if it came due today, the middle one if this week, the outer one if longer ago; the count sits in the middle in the code font (40 px) with "DUE", or a green check and "ALL CLEAR". Blips pop in one after another (bouncy spring, popInDelay) only the first time you see them after the app starts, or when new ones came due. While questions wait, a soft wedge sweeps round once every 4 s: the screen's one background loop (a whole `rotate`, paused while the window is hidden). Under the scope: how many and about how long, one main button, a "Coming up" card (next 24 hours, next 7 days) and "How it works" with three icon rows. All clear says when the next question comes back and offers a quiet "Play a new lesson"; before your first lesson it sends you to it. Notices sit at the top of the frame, in the 440 px column: "This changed" (a signal-blue card with a waves badge, "1 of 2", the as-of date and source, a purple "N questions come back for review" pill, Got it) and "Your progress is safe" (the warm notice colours, a spanner icon, which day's backup was loaded, a close button). A notice slides 12 px down and fades in; closing it fades it out first, then the page glides up into its space (a layout move, a transform), so nothing jumps. While a notice shows, the path opens at the top instead of scrolling it out of sight. Speeds: `SCOPE` and `NOTICE` in the speed file; code: `app/src/ReviewScreen.tsx`, `app/src/Notices.tsx`.

**Reduce motion:** the app's own ⚙️ switch (not Windows' setting; decision from T46) turns off bursts, background loops, pop-ins, slides and count-ups. Things then appear with a quick fade (150 ms at most) or at once. Nothing you need to know is shown only by movement.

## 8. Beacon (the mascot)
- **Look:** a thin lattice tower (two legs, cross braces) with a round glowing head that has a face, and soft radio rings around the head. Drawn by Claude in code (SVG), animated with Motion (decision 2026-10-31: no Rive). Use `originX` / `originY` for turning parts (the T45 lesson).
- **Faces:** idle (rings breathe, blinks every 4–7 s), happy (^ ^ eyes, smile, green rings pulse), oops (round eyes, wobbly mouth, a little drop, rings dim), thinking (eyes up, dots), cheering (head bounces, extra rings), sleepy (eyes closed, "z", for late at night). Sizes: 48 px beside the current lesson on the path, about 58 px above questions, 96–140 px on the lesson-complete screen.
- **Built (R17, 2026-11-04):** `app/src/ui/Beacon.tsx`, a 100 × 136 drawing (head at 50, 40, so the rings are never cut off; look A's picture cut the top ring). The tower has its own two colour tokens (`beacon`, `beaconBrace`); the head sits on a short mast, so it stays joined to the tower when it hops. Loops: the rings breathe (the same `BREATHE` as the current lesson) and the eyes blink (idle, thinking, oops), so a screen with Beacon has room for no other loop. Happy sends one ring out; cheering hops three times, each smaller, and bursts two rings. `still` switches the loops off. Speeds: `BEACON` in the speed file.
- **Rules:** reacts within 0.1 s of an answer; never covers words or buttons; never moves farther than its own width; speech bubbles of 8 words or fewer, plain and kind, never guilt (PRD 4d). Its lines live in one data file, so they're easy to change (`app/src/questionScreen.ts`, from R09).

## 9. Sound
- **Owner's choice (2026-11-04):** real sound effects from a free library, CC0 only ("no rights reserved"), credited anyway in a sounds credits file. If none can be reached from the cloud, code-made sounds stay until the owner downloads a pack (kenney.nl answered "403 blocked" from the cloud on 2026-11-04; opengameart.org answered).
- About 7 sounds: tap (very soft), right, not quite (gentle, not a buzzer), lesson complete (2 s at most), streak up, unlock, review start. Each file under 50 KB. Quiet by default (about 60%), and no sound before your first click (Windows rule for apps).
- The ⚙️ Sounds switch stays, with a "play a sample" button.

## 10. Never
- Copy anything from Duolingo (name, owl, colours, art, sounds) or any other app.
- Use AI-generated photos for identification questions (CLAUDE.md). The redesign changes how things look, never the facts or the lessons.
- Put emoji in the app's own buttons and labels, or load fonts and pictures from the internet.
- Animate blur, shadows, width or height in a loop; run more than 2 background loops on one screen.
- Undo an earlier redesign chat's choice without a reason written down (a design review, or the owner's words).
