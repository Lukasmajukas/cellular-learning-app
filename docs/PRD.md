# 📐 The Plan (PRD): what we're building, and how

**Status:** SIGNED OFF by the owner on 2026-10-31 · **Written:** 2026-10-31 by a robot run (Opus, High effort), task T04
**Built from:** the research report (`docs/research/Cellular learning app research.md`), the research notes, `docs/reuse-review.md`, `docs/research/photo-sources.md`, `content/carrier-codes.md` and every decision in `docs/DECISIONS.md` up to today.

<!-- When the owner types "I sign off the plan", a chat adds the line below and merges it. That line unlocks app building. -->
Signed off by owner: 2026-10-31 ("I sign off the plan"). All suggested answers in section 9 stand.
**Section 12 (the redesign) was added on 2026-11-04 and is a DRAFT until the owner signs it off.**

---

## In simple words (read this part first)

A PRD is a blueprint. Before builders pour concrete, they agree on a drawing of the house. This is that drawing for your app.

- **What we're building:** a learning game for your Windows PC. You follow a path of short lessons (3 to 5 minutes each). First you learn the phone bands (n71, n41, n77 and friends). Then you learn to "read" a cell site: what kind it is, what the equipment is, and which company runs it.
- **What makes it fun:** bouncy buttons, a path that lights up like a coverage map, a streak, XP, and a review queue that brings back each fact just before you'd forget it.
- **What makes it trustworthy:** every band and carrier fact comes from one checked data file. Each fact carries a label (CURRENT, HISTORICAL, PENDING, PLANNED or UNVERIFIED), a date and a source. **The app never quizzes you on an UNVERIFIED fact.**
- **The app engine:** I recommend **Electron**. It carries its own copy of the Chrome engine, so the app looks and behaves the same on your PC, on your Mac later, and in the cloud computer where I test it. Section 6 explains why.
- **How it gets built:** in small steps, one per chat. First a test build: one animated lesson screen you install and try. Then the band units, then the tower-spotting units.
- **What I need from you:** read this, ask for any changes, answer the questions in section 9, then type `I sign off the plan`.

---

## 1. The problem

You want to learn two things that are hard to learn from websites:
1. **US LTE and 5G bands:** what frequencies each band uses, FDD or TDD, and which carrier uses which band.
2. **Cell identification:** looking at a site and saying what kind it is, what equipment is on it, which carrier runs it, and what the numbers on your phone's hidden screen mean (eNB/gNB ID, sector, PCI, channel number).

What gets in the way today:
- **Facts are scattered, and many are wrong or out of date.** Wikipedia's carrier table still lists T-Mobile on Band 26, which T-Mobile sold in August 2026. Your own older projects had a few wrong numbers too (see `docs/reuse-review.md`).
- **Facts change.** Carriers bought and sold spectrum several times in 2025 and 2026. A learning tool has to show how old each fact is.
- **Reading isn't learning.** Research says quizzing yourself and spacing reviews out work far better than rereading. Spotting towers is a "learn to see it" skill that needs many varied photos with instant, explained feedback.
- **Nothing like this exists.** There are ham-radio quiz apps and GeoGuessr trainers, but nothing for US bands and cell sites.

## 2. Who it's for
- **Just you.** Personal use, not for sale, no accounts, no other users.
- **Your level:** you know the names n25, n41, n66, n71, n77, n258, n260, n261 and the low/mid/high idea. Lessons start at beginner level.
- **Your computer:** a Windows PC now. A Mac and an iPhone 15 Pro later.
- **You don't code.** Claude writes and tests everything. You install it, try it and say what you think.

## 3. What "success" looks like (success criteria)

How we'll know the first full version (v1.0) is done. Each has a way to check it.

| # | Success means | How we check |
|---|---|---|
| S1 | It installs and opens on your Windows PC with a double-click | You try it. Also, GitHub's own Windows computer installs and opens it on every build (automatic test). |
| S2 | It feels smooth: buttons react at once, screens slide, nothing stutters | You say "it feels smooth". Automatic check: an answer gets feedback in under 0.1 s. |
| S3 | A lesson takes 3 to 5 minutes | Timed on the first 3 units |
| S4 | Daily reviews take 10 minutes or less on a normal day | The review queue is capped; it shows the time left |
| S5 | It works with no internet | Automatic test with the network switched off |
| S6 | Your progress is never lost: not on closing, not on a crash, not on installing a new version | Automatic tests, plus a backup copy of your progress every day |
| S7 | Every band or carrier fact in a question traces back to one row of the bands data file, with a status, a date and a source | An automatic checker refuses to build the app if any fact is missing them |
| S8 | No question uses an UNVERIFIED fact as its answer | Same checker |
| S9 | Every photo has a credit and an allowed licence (public domain, CC0, CC BY, CC BY-SA); no AI-made photo is used for an identification question | Same checker, reading the credits file |
| S10 | It doesn't look like Duolingo: no owl or bird, no green-on-white look, no "-lingo" name | You and Claude look at it side by side |
| S11 | You actually learn: after finishing a unit, you get at least 8 in 10 of its review questions right a week later | The app's own review stats (it keeps this number) |
| S12 | All 10 units are playable | You reach the final challenge |

## 4. What's in it (scope)

### 4a. The lesson path (the 10 units)
Unchanged from `ROADMAP.md` and the research, with the order kept: **band units first, tower-spotting after**.

| Unit | Theme | What you learn | Question types |
|---|---|---|---|
| 1 | The spectrum ruler | What a band is; FR1 vs FR2; low, mid, high; FDD vs TDD; "upside-down" bands (B13, B14, B71) | Multiple choice, order the bands, spectrum slider |
| 2 | Low band | B71/n71, B12/B17/B85, B13, B14 (FirstNet), B5/n5; B26 as history | Match pairs, type the number |
| 3 | Mid band | B2/B25/n25, B4/B66/n66, B30; B70/n70 as history | Match pairs, type the number |
| 4 | Capacity bands | n41; n77 and its slices (3.45 GHz, C-band, upper C-band coming); B48/n48 (CBRS); mmWave n258/n260/n261 | Multiple choice, scenario |
| 5 | Who uses what | "Fingerprint" bands that point to one carrier, the 5G icons (5G UW, 5G+, Ultra Capacity), the 2025–26 changes, satellite-to-phone, carrier codes (MCC/MNC) | Scenario, multiple choice |
| 6 | Site types | Lattice, guyed, monopole, rooftop, water tank, fake trees and other disguises, small cells, DAS, temporary sites | Photo multiple choice |
| 7 | Reading a site | The 200 ft rule, registration signs, RF warning signs, carrier stickers, who rents which height on a shared tower | Tap the clue, photo multiple choice |
| 8 | Hardware | Passive panels vs radios vs massive MIMO boxes, counting ports, decoding model names. May start as Claude's drawings (few free photos exist) | Tap the clue, multiple choice |
| 9 | Cell IDs | Macro/micro/pico/femto; sectors; eNB and gNB IDs; PCI; channel numbers (EARFCN, NR-ARFCN); your phone's hidden Field Test screen | Decoding drills, type the number |
| 10 | Final challenge | Put band, photo and ID clues together to name the carrier and site type | Scenario puzzles, no hints |
| Bonus | Local field trip | Real South Hadley / Western MA sites (from SpectrumScope), every one marked UNVERIFIED with its proof | Maps, permit evidence, drawings |

Each unit follows the same steps: a labelled example, an easy two-choice question, a "tap the clue" question, mixed review with earlier units, unseen photos, a scenario, then a "site certification" with no hints.

**One teaching rule runs through every unit:** shortcuts like "B71 means T-Mobile" go out of date. The lasting skill is the chain of evidence: frequency → band → who holds the licence → proof on the ground. The carrier's sticker counts most and the equipment brand counts least.

### 4b. Question types
| Type | First used in | In the first playable version? |
|---|---|---|
| Text multiple choice | Unit 1 | ✅ |
| Match pairs | Unit 2 | ✅ |
| Type the number (with a small allowed error) | Unit 2 | ✅ |
| Order the bands / spectrum slider | Unit 1 (wrap-up) | ✅ simple version |
| Photo multiple choice | Unit 6 | Later step (v0.8) |
| Tap the clue on a photo or drawing | Unit 7 | Later step (v0.8) |
| Scenario puzzle (several clues, explain every one) | Unit 4 | Later step (v0.8) |

**Feedback rules (from the research):** every answer gets an explanation, not just right/wrong. Feedback appears at once (a delay of 2.5 s or more hurts visual learning). On a photo, the deciding part gets outlined.

### 4c. Remembering things (reviews)
- **FSRS** (a free, open-source review scheduler, the `ts-fsrs` library, MIT licence) decides when each fact comes back.
- How an answer is scored: wrong = "Again"; right but slow or with a hint = "Hard"; right = "Good"; right and fast = "Easy". The time of every answer is saved.
- Default settings until a few hundred reviews have built up.
- **"This changed" cards:** when a carrier fact changes in the data file (for example, a sale closes), the app shows you a card saying what changed and resets that fact's review.

### 4d. The fun layer (kept small and kind)
**In:**
- A path map that lights up like towers coming on air.
- XP, mostly for getting things right the first time and for new photos, not for repeating.
- A **streak** ("uptime") that one lesson or one review keeps alive. It freezes by itself if you miss a day, and you get 48 hours to repair a break.
- A daily goal you choose, separate from the streak.
- Mastery shown as **signal bars** (0 to 5) on each lesson.
- A **spectrum heatmap**: the band chart coloured by how well you remember each band.
- Mastery badges and personal bests.
- Short sounds, made by code (no sound files to licence), with an off switch.
- A mascot drawn by Claude (see section 9, question 3). Celebration confetti.

**Out (on purpose):** hearts or energy limits, leagues and leaderboards, gems and loot boxes, countdown timers for beginners, guilt-trip reminders. The research found these serve a big company's growth, not one learner's memory.

### 4e. The look
- An original radio-network theme: towers, signal bars, coverage rings, "drive test" reviews, "site certification" tests.
- Our own colours (not Duolingo green), our own name (section 9, question 1), our own mascot.
- Smooth but light: animations move only position, size and see-through-ness, which stays smooth on any computer. A **reduce motion** switch in settings.
- Can be used with the keyboard: number keys 1–4 to pick an answer, Enter to continue.

### 4f. Settings
Sounds on/off, reduce motion, daily goal, light or dark look, "back up my progress now", and "show me where my progress file is".

### 4g. Not in the first version (out of scope)
| Not now | Why | Maybe later? |
|---|---|---|
| Mac version | Your Mac is in use elsewhere | Yes. We keep it possible: nothing Windows-only in the code. GitHub can build a Mac copy when you want it. |
| iPhone version | A different kind of app | Maybe, much later |
| Linux version | Nobody uses Linux here | No |
| Accounts, logins, cloud sync | Just you, on one PC | No |
| AI chat inside the app | Would need the internet and a paid key | No. Claude uses AI to write lessons, not inside the app. |
| Reading live data from your phone | You dropped this idea (see `docs/DECISIONS.md`) | No |
| Leaderboards, friends, sharing | Just you | No |
| Automatic updates | Hard with a private repository and no paid signing (section 7) | Yes, if you ever want it |
| Phone reminders | Not needed for a PC app | Optional desktop reminder: section 9, question 4 |

## 5. Where the facts and content live

The research's main lesson: **this is a small, carefully checked fact book with a game on top.** So the content design matters more than the code.

| File (in `content/`) | What's in it | Built by |
|---|---|---|
| `bands.yaml` | **The only place frequencies are stored.** One row per band: number, LTE or 5G, name, uplink and downlink MHz, FDD/TDD/downlink-only, which bands sit inside it, the 3GPP document it comes from, and per carrier: status, as-of date, source, evidence type. | T06, from `docs/research/notes/band_verification.md` |
| `carrier-codes.md` → `carrier-codes.yaml` | Carrier codes (MCC/MNC) with status, date, source | T09 (done, DRAFT), T27 (check) |
| `sites/*.yaml` | Real sites (like South Hadley) with status UNVERIFIED, proof, `confidence` and `coordPrecision` (borrowed from CellAtlas) | T10 |
| `photos/credits.yaml` + `photos/*.webp` | Every photo with its source page, author, licence and any changes we made | T26 |
| `lessons/unit-NN/*.yaml` | The lessons: questions, explanations, which facts they test. Questions about bands **point to rows in `bands.yaml`**; they never type a frequency themselves. | Per unit |

Rules:
- **Status labels:** CURRENT, HISTORICAL, PENDING, PLANNED, UNVERIFIED, each with an as-of date and a source (as `CLAUDE.md` requires).
- **What may be quizzed:** CURRENT facts, and HISTORICAL ones in clearly labelled "history" questions. PENDING and PLANNED can appear in "what's coming" lessons, labelled as such. **UNVERIFIED facts may be shown with a badge, but never as a quiz answer.**
- **A checker** (a small program, like CellAtlas's `packctl`) runs before every build. It refuses any fact without a status, date and source; any photo without an allowed licence; any question whose answer is UNVERIFIED; and any question ID that changed (changing an ID would wipe its review history).
- **Lessons are text files, not code.** Fixing a fact is a one-line edit plus a rebuild.
- **Photos:** WebP format. Licences allowed: public domain, CC0, CC BY, CC BY-SA. Never AI-made photos for identification. Gaps (equipment brands, signs) are filled with Claude's labelled drawings until you have your own photos.
- **Keep it fresh:** every 3 months a chat re-checks carrier facts against SEC and FCC filings (Level 6 in `ROADMAP.md`).

## 6. The app engine: Electron (recommended), not Tauri

An app engine is the "body" the app lives in. Both choices let us build the app as a web page that runs in its own window. The difference is the browser engine inside.

| | **Electron** | **Tauri** |
|---|---|---|
| Browser engine inside | Its own copy of Chrome's engine, the same on every computer | Borrows the one the computer already has: Edge's on Windows, Safari's on a Mac |
| What I test in the cloud vs what you run | **The same engine.** I can open the real app in my cloud computer, click through it and take screenshots. | Different engines. My cloud computer would use a third one (Linux's), so a screenshot there doesn't prove it works on your PC. |
| Your Mac later | Same engine, same look | Safari's engine: a second set of quirks, and animation capped at 60 frames a second |
| Languages Claude must get right | One (TypeScript) | Two (TypeScript and Rust), plus Rust build tools |
| Download size | About 100–250 MB | About 3–10 MB |
| Memory used | About 120–170 MB | About 40–50 MB |
| Updates to the engine | A new version every 8 weeks; we update a few times a year | Less often |

**Why Electron wins for you:**
1. **I can't see your screen.** The thing that matters most is that what I test is what you get. With Electron, it is.
2. **Fewer moving parts.** One language and no Rust tools means fewer build problems for me to fix without seeing them.
3. **The research picked Tauri for reasons that don't apply here.** It assumed a developer who codes, and Linux support. You don't code, and we don't need Linux. On Windows, Tauri's main advantage is the smaller download, which doesn't matter on a PC.
4. **The cost is fine:** a bigger download and more memory. A modern PC won't notice.

**The way out if I'm wrong:** the app itself is a plain web page (React), so moving it to Tauri later means changing the "body", not rewriting the lessons or screens.

**The building blocks** (all free; licences checked in T05):
| Job | Tool | Licence |
|---|---|---|
| App body | Electron, packaged with Electron Forge (Electron's official tool) | MIT |
| Screens | React + TypeScript, built with Vite | MIT |
| Bouncy animations | Motion (springs) | MIT |
| Confetti | canvas-confetti | ISC |
| Review scheduler | ts-fsrs | MIT |
| Content checking | A schema checker (Zod) plus our own checker script | MIT |
| Automatic tests | Vitest (logic) and Playwright (clicks through the real app) | MIT / Apache 2.0 |
| Mascot | Claude-drawn SVG, animated with Motion. **Not Rive** (see below). | ours |

**Why not Rive for the mascot (a change from the research):** Rive's animations are made in Rive's own drawing program, by a person, with the mouse. I can't use that program, and exporting may need a paid plan. A mascot I draw in code (SVG) is free, and I can change it whenever you ask. If you ever want a professional mascot, someone could make one in Rive later.

**Where your progress is saved:** one save file (JSON) in Windows' normal app-data folder, written safely so a crash can't half-write it, plus a daily backup copy (the last 7 kept). The research suggested a database (SQLite); for one learner a single file is simpler, easy to back up by copying, and avoids a part that often breaks when Electron updates. The save code sits behind one small module, so switching to SQLite later is easy if it's ever needed.

## 7. Limits we work within (constraints)
- **You don't code, and I can't see your screen.** So every step needs automatic tests and screenshots I can check myself. You only judge how it feels.
- **Windows first;** nothing Windows-only, so a Mac copy stays possible.
- **Cost about $0.** No paid code signing for now. The catch: the first time you open a new version, Windows shows a blue box, "Windows protected your PC". You click **More info**, then **Run anyway**. That's normal for unsigned hobby apps. (Signing would cost about $10 a month or more.)
- **Getting new versions:** GitHub builds the installer. I give you a link; you download and run it. Your progress stays (it lives outside the app). GitHub's free build minutes are plenty for this.
- **Works offline.** No internet needed after install.
- **Your usage limit.** Building happens one small task per chat, mostly on Sonnet. The robot keeps going 24/7 once you sign off.
- **Facts discipline** from `CLAUDE.md`: frequencies only from the bands file, never from memory; every carrier fact has a status, date and source.
- **Photos:** only the licences above, with credits. Several topics have few free photos (`docs/research/photo-sources.md`), so drawings fill gaps.
- **Original look:** nothing copied from Duolingo's name, owl, colours, art or sounds.

## 8. The building plan
Each step is one or more tasks in `TASKS.md`. Sizes follow the model table in `CLAUDE.md`. Chat counts are guesses.

| Step | What you get | Tasks | Size | Rough chats |
|---|---|---|---|---|
| **v0.1 Test build** (Level 3) | One animated lesson screen: 3 sample questions, bouncy buttons, confetti, sound, the mascot waving. GitHub builds a Windows installer; you install it and say whether it feels smooth. Also proves my cloud testing and GitHub's Windows test both work. | T05 | Medium | 1–3 |
| **Facts foundation** (can run alongside) | The bands file with a status, date and source on every row, plus the checker | T06, T07, T28 | Medium, then a Large review | 2–4 |
| **v0.3 The skeleton** | The path map, the lesson player, the save file, settings | T29, T30 | Medium | 3–5 |
| **v0.5 First playable** (Level 4 starts) | Units 1–3 (the band basics) with text multiple choice, match pairs, type the number, ordering; FSRS reviews; streak, XP, signal bars | T31, T32, T33 | Medium; unit design reviewed on Large | 5–8 |
| **v0.6** | Units 4–5 (capacity bands, who uses what), scenario puzzles, the spectrum heatmap, carrier codes | T34 | Medium | 3–5 |
| **v0.8** | Photo questions and tap-the-clue, the photo credits file, units 6–7 | T26, T35 | Medium | 4–6 |
| **v0.9** | Units 8–9 (hardware, cell IDs, the Field Test screen) | T36 | Medium | 3–5 |
| **v1.0** | Unit 10 (final challenge), the bonus local field trip, polish | T10, T37 | Medium, final review on Large | 3–5 |
| **Keep it fresh** (Level 6) | A fact check every 3 months, with "this changed" cards | recurring | Medium | 1 every 3 months |

**Each step ends the same way:** automatic tests pass in the cloud and on GitHub's Windows computer, I check screenshots, then you install it and tell me in chat whether it works and feels right. Nothing moves on until you've said so.

**The test build (T05) also decides things.** If Electron feels slow or a building block misbehaves on your PC, we fix the plan before building more. That's what the test build is for.

## 9. Questions for you (open questions)
You can answer these in any chat, in any order. My suggested answer is in **bold**. **Answered 2026-10-31:** the owner signed off without changes, so every bold answer stands. You can still change any of them later in any chat.

1. **App name** (this is task T02). Some original ideas: *Bandwise*, *Signal Path*, *SiteSeer*, *Spectrum Scout*. Or your own. **Keep the working name until you pick one.**
2. **App engine:** OK with Electron (section 6)? **Yes.**
3. **Mascot:** want one? Ideas: a little tower with signal-wave "hair", or a friendly radio box. **Yes, a little tower, drawn by Claude.** (No owl, no bird.)
4. **Daily reminder:** a gentle Windows pop-up once a day if you haven't practised? **Off by default; you can switch it on.**
5. **Lesson length:** 3 to 5 minutes, about 10 to 15 questions? **Yes.**
6. **Unsigned installer:** OK clicking "More info → Run anyway" once per new version, to keep it free? **Yes.**
7. **Order:** band units first, tower spotting after (as in the roadmap)? Or would you rather mix them, for example a tower unit after every two band units? **Band units first.**

## 10. Risks and what we do about them
| Risk | What we do |
|---|---|
| Carrier facts go out of date | Status, date and source on every fact; a check every 3 months; "this changed" cards |
| An unchecked fact gets learned as true | UNVERIFIED facts are never quiz answers; the checker enforces it |
| Equipment clues go stale (AT&T is removing Nokia gear; Dish radios abandoned) | Teach stickers, permits and band labels first; date-stamp every hardware card |
| Too few free photos for some topics | Claude's labelled drawings; your own photos later (from public places only, never inside fences) |
| It doesn't feel smooth on your PC | The test build checks this first; animations limited to the smooth kinds; reduce-motion switch |
| I break something I can't see | Automatic tests in the cloud and on GitHub's Windows computer before every merge; you try each step |
| Looks too much like Duolingo | Original name, colours, mascot and theme from day one |
| The plan gets too big | Small steps; each one is usable on its own; you can stop at any step |

## 11. What changed compared with the research report (so nothing is silently overwritten)
| Research said | This plan says | Why |
|---|---|---|
| Tauri first, Electron as fallback | **Electron** | No coder, no Linux, and I must test the same engine you run (section 6) |
| Build for Windows, macOS and Linux | **Windows first**, Mac kept possible, no Linux | Your answer in T02 |
| Rive mascot | **Claude-drawn SVG mascot** | Claude can't use Rive's editor; Rive may cost money |
| SQLite database | **One JSON save file** with daily backups | Simpler for one learner; fewer breakable parts |
| Signed builds with automatic updates | **Unsigned, manual updates** for now | Costs $0; the repository is private |
| 115–220 hours for a TypeScript developer | **Counted in chats** | Claude writes the code; your time goes into testing |

## 12. The redesign (Level 5), added 2026-11-04 (T58)
**Status:** DRAFT, waiting for the owner's sign-off. <!-- When the owner types "I sign off the redesign plan", a chat writes the date here and in docs/redesign/PLAN.md. -->

**In simple words:** the owner asked (Nov 4) for "a full made app": movement on every screen, a real look, built carefully over many sessions. The owner picked the **Night Signal** look and the **Beacon** mascot, and chose to let the robot build it on its own, nonstop, and then keep improving it. The details are in `docs/redesign/PLAN.md` (the 24 sessions and the checklist) and `docs/redesign/DESIGN.md` (the style guide). The Level 5 "Polish" row of the roadmap becomes this program.

**What this changes in the plan above** (nothing is silently overwritten; the older text stays where it is, and this table wins where they differ):
| Section | The plan said | The redesign says | Why |
|---|---|---|---|
| 4d Sounds | Short sounds made by code, no sound files | Real sound effects from a free CC0 library, credited in a sounds credits file; code-made sounds only as a fallback | Owner's choice, 2026-11-04 |
| 4d Mascot | A little tower drawn by Claude | **Beacon**: a glowing lattice tower with six faces that reacts to answers (`DESIGN.md` section 8). Still drawn by Claude in SVG with Motion | Owner's choice, 2026-11-04 |
| 4e The look | Original radio theme, our own colours | **Night Signal** (`DESIGN.md`): dark default plus a Day look, bundled fonts (Space Grotesk, JetBrains Mono), our own icons instead of emoji. The Duolingo colours still in the app today are removed first (session R01) | Owner's choice; the app had been using Duolingo's exact colours, which broke the 2026-10-31 decision |
| 4e Keyboard | Keys 1–4 and Enter | Same, finally built (session R04), plus Esc | It was promised but never built |
| 4f Settings | Light or dark look | "Look: Night / Day", and a "play a sample" button for sounds | Follows the new look |
| 7 Limits | Building happens mostly on Sonnet | The redesign sessions run on Opus, High effort (owner's wish: "20+ Opus sessions") | Owner's words, 2026-11-04 |
| 8 Each step | "Nothing moves on until you've said so" | For the redesign only: the robot doesn't wait for the owner. Each session must pass the automatic tests, the Windows build and Claude's own picture check; design reviews come at R08, R16, R24 and then every 8th chat. The owner tries builds whenever they like, and their words go to the top of the ideas board | Owner's choice ("never wait for me", "robot decides alone"), 2026-11-04 |
| 8 Building plan | v1.0 "polish" | A new step after v1.0: **v2.0 Night Signal** (24 sessions), then "keep improving" from `docs/redesign/IDEAS.md` until the owner types `Pause the redesign` | Owner: "I want it to just keep improving and make more designs" |
| 10 Risks | "It doesn't feel smooth", "Looks too much like Duolingo" | Plus: usage limit used up early in the week, changes going faster than the owner can look, design drift, graphics-chip problems only the owner's PC shows (`PLAN.md`, "Risks") | Nonstop robot work |

**Still true:** facts only from the data files; no AI photos for identification; reduce motion is the app's own switch; animations move only position, size, turning and see-through-ness (glows fade as their own layer); Windows first, nothing Windows-only; everything free (OFL fonts, CC0 sounds).
