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

**Day (light, built in session R20):** the same tokens, lighter. Starting values to test: `bg #F3F7FC`, `surface #FFFFFF`, `border #D5E1EF`, `text #0E1C31`, `text-muted #4F6582`, `signal #087A97`, `on-air #13A36B`, `miss #D9434A`, `streak #B87A00`, `review #6A5AE0`. The ⚙️ "Dark look" switch becomes "Look: Night / Day".

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

## 5. Icons
- Our own icon set, drawn in code (SVG): 24 × 24 grid, 2 px lines, round ends, one colour (`currentColor`). One file (from R02).
- **No emoji in the app's own buttons and labels** (🔥 ⚡ 🔒 ⚙️ 🌡️ 🚗 📡 and the rest). Emoji look different on Windows, Mac and iPhone, so the app would change looks from one computer to the next. An automatic test checks the `.tsx` screen files. Lesson text keeps whatever the lesson files say.
- The basic set: flame, bolt, tower, lock, check, cross, waves, map pin, repeat, grid, gear, star, freeze, repair, back, close, sound on, sound off, info, chevron.

## 6. Building blocks (components)
Built once (R03, R04) and used everywhere: app shell (top bar + content + bottom tab bar: Path, Review, Heatmap, Settings), button (signal / on-air / miss / quiet), card, answer tile (with its number key), bottom sheet (the "Right!" / "Not quite" panel), progress bar, pill (like "6 due"), stat chip (streak, XP), switch, unit banner, lesson node (done / current / locked), speech bubble, Beacon.

## 7. Movement (motion rules)
**What may move:** only position, size, turning and see-through-ness (transform and opacity), because those stay smooth on any computer (PRD 4e). Measured exceptions: drawing the path's line (`pathLength` or `stroke-dashoffset`) and counting numbers up. **Glows never animate a blur or shadow:** a glow is its own layer, and only its see-through-ness changes.

**Speeds (one file, from R04):**
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
2. **Right / not quite:** right = the tile glows green, Beacon's head rings pulse once; wrong = the tile shakes gently, Beacon looks worried; the bottom sheet slides up.
3. **Lesson complete:** Beacon cheers; stars drop in one at a time; XP counts up like a meter; signal bars fill one by one; a short "signal burst" (rings and wave pieces instead of plain confetti).
4. **Screens:** the path opens scrolled to your current lesson; screens glide; nothing jumps.
5. **The top bar:** XP ticks up, the flame flickers once when the streak grows, the goal bar fills with a spring.

**Reduce motion:** the app's own ⚙️ switch (not Windows' setting; decision from T46) turns off bursts, background loops, pop-ins, slides and count-ups. Things then appear with a quick fade (150 ms at most) or at once. Nothing you need to know is shown only by movement.

## 8. Beacon (the mascot)
- **Look:** a thin lattice tower (two legs, cross braces) with a round glowing head that has a face, and soft radio rings around the head. Drawn by Claude in code (SVG), animated with Motion (decision 2026-10-31: no Rive). Use `originX` / `originY` for turning parts (the T45 lesson).
- **Faces:** idle (rings breathe, blinks every 4–7 s), happy (^ ^ eyes, smile, green rings pulse), oops (round eyes, wobbly mouth, a little drop, rings dim), thinking (eyes up, dots), cheering (head bounces, extra rings), sleepy (eyes closed, "z", for late at night). Sizes: 48 px beside the current lesson on the path, about 58 px above questions, 96–140 px on the lesson-complete screen.
- **Rules:** reacts within 0.1 s of an answer; never covers words or buttons; never moves farther than its own width; speech bubbles of 8 words or fewer, plain and kind, never guilt (PRD 4d). Its lines live in one data file, so they're easy to change.

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
