# 🧭 Units 1–3 design: which facts, in which order, which question types

**Status:** DRAFT v1, ready for T32 and T33 to build from. The owner may still ask for changes (see "Questions for you" at the end).
**Written:** 2026-11-01 by a robot run (Opus, High effort), task T31.
**Built from:** `docs/PRD.md` (sections 4a–4c and 5), `docs/research/notes/learning_design.md` (sections 2, 3 and 6), `content/bands.json` (as of 2026-10-31), `docs/research/notes/band_verification.md`, `content/tools/check_content.py`, `app/src/path.ts` and `app/src/lesson.ts`.

---

## In simple words (read this part first)

This is the lesson plan for the first three units, like a teacher's plan for the first three weeks of school.

- **Unit 1, "The spectrum ruler":** what a band is, low/mid/high, the two ways a band shares its space (two lanes, or taking turns), and the "upside-down" bands.
- **Unit 2, "Low band":** the 600, 700 and 850 MHz bands (B71/n71, B12/B17/B85, B13, B14, B5/n5, plus B26 as history).
- **Unit 3, "Mid band":** the 1900, 1700/2100 and 2300 MHz bands (B2/B25/n25, B4/B66/n66, B30, plus B70/n70 as history).
- Each unit has **5 lessons**: 4 normal lessons and a final "checkpoint" with no hints. Each lesson is about 12 to 15 steps, which takes 3 to 5 minutes.
- **What I found that changes things:** most of the "which carrier uses this band" facts for low and mid band are still marked **UNVERIFIED** in the bands file. Two examples are "Verizon runs B13" and "AT&T's FirstNet runs B14". The app is never allowed to quiz you on an unchecked fact. So for now these units mostly teach **the bands themselves** (where they sit, how they work, which ones fit inside others). Carrier facts appear only where they are checked. I added a task (T47) to check the rest. Until then, the lessons show those facts with a "not checked yet" badge, and they don't quiz them.
- Nothing here is app code. T32 builds the new question types, and T33 writes the lesson files from this plan.

---

## 1. What I found (and what it changes)

| # | Finding | What it changes |
|---|---|---|
| F1 | In `content/bands.json`, every band row for units 1–3 is CURRENT (frequencies copied from Wikipedia's transcription of the 3GPP tables; the T42 review found them all right; the official 3GPP check is T07). | Frequency, duplex and nesting questions are allowed now. If T07 changes a number, the lessons update by themselves, because questions point at the data and never type a number. |
| F2 | Of the low- and mid-band carrier rows, only these are not UNVERIFIED: **n71 T-Mobile** (CURRENT), **B71/n71 AT&T** (PLANNED), **B71/n71/n66/n70/B70 Boost** (HISTORICAL), **B26 T-Mobile** (HISTORICAL) and **n5 Cellcom** (CURRENT). Every other row is UNVERIFIED, including B13 Verizon, B14 AT&T, B12/B17 AT&T, B12 T-Mobile, B5/n5 AT&T and Verizon, B2/B25/n25 for all carriers, B4/B66/n66 for all carriers, and B30 AT&T. | Units 2–3 quiz carriers only through the checked rows and the spectrum-change list (sales with dates). The rest appear as "not checked yet" info lines that are never quizzed. New task **T47** checks them. When a row turns CURRENT, T33 (or a later chat) adds the planned carrier questions marked "after T47" below. |
| F3 | "FirstNet runs on B14" isn't in the bands file at all (B14's notes say "—"). | T47 adds it with a source. Until then, FirstNet appears only on a "not checked yet" line. |
| F4 | The FR1/FR2 edges (410–7125 MHz, 24.25–71 GHz) are verified in `band_verification.md` (table "Frequency ranges", against Wikipedia citing 3GPP TS 38.101-1/-2). They aren't rows in `bands.json`, so the checker can't point a question at them. | T33 adds a small `frequency_ranges` list (FR1, FR2) to the bands build, each row with status, as-of date and source, plus the checker reference `range:FR1` / `range:FR2`. Until then, unit 1 teaches FR1/FR2 only through each band's `kind` field (`NR-FR1` or `NR-FR2`). |
| F5 | "Low / mid / high" has no official definition in our sources. | The app uses its own stated rule (decision D1 below). Which tier a band belongs to is worked out from its numbers in `bands.json`, never typed by hand. |
| F6 | The test build's sample lessons use the IDs `u1-l1` … `u2-l2`, and the owner's save file already has stars on them (the owner played them in T40). | Real lessons must use **new IDs** (`unit01-l1` and so on), or the sample stars would unlock real lessons the owner hasn't done (decision D4). |
| F7 | The lesson player only knows one item type today: text multiple choice (`{prompt, choices, answer}`). | T32 must add: learn cards, match pairs, type the number, ordering, plus answers filled in from the data (section 3). |

---

## 2. Rules every lesson in units 1–3 follows

### 2a. The shape of a lesson
From the PRD (section 4a) and the research's unit template (`learning_design.md` section 3), cut down to what v0.5 can show (no photos, no tap-the-clue, no scenario puzzles yet):

| Step | What | Item type | How many |
|---|---|---|---|
| 1 | **Learn card:** a labelled example (a worked example). One idea per card, with a small drawing (a spectrum bar, two lanes, a set of nesting boxes). Not scored. | `learn` | 1–3 |
| 2 | **Easy two-choice:** the new idea against its closest look-alike. | `choice` (2 options) | 2–3 |
| 3 | **Spot the clue (text):** stands in for tap-the-clue until v0.8. A short description (numbers taken from the data); the learner picks the band or the property that fits. | `choice` (3–4 options) | 2–3 |
| 4 | **Recall:** type the number, or match pairs. | `number` / `match` | 2–4 |
| 5 | **Mixed review:** 2–3 items from earlier lessons and units (interleaving). | any | 2–3 |
| 6 | **Wrap-up:** order the bands on the ruler. | `order` | 0–1 |

About 12 to 15 items, so 3–5 minutes. The **checkpoint lesson** (lesson 5 of each unit) has no learn cards, mixes everything from the unit plus a few items from earlier units, has about 15 items, and gives no hints.

**Why this order:** the research says to teach a family of bands together first (blocking works better for word-like facts), then mix families (interleaving helps tell look-alikes apart). So each normal lesson stays inside one family (600, 700, 850, PCS, AWS…), and the checkpoints and mixed-review steps do the mixing.

### 2b. Question types used in units 1–3
| Type (`kind` in the lesson file) | In the PRD as | First used | Notes |
|---|---|---|---|
| `learn` | labelled example | U1 L1 | Not scored and not reviewed. Must list its facts, like a question. |
| `choice` | text multiple choice | U1 L1 | 2 options early on, 3–4 later. |
| `match` | match pairs | U1 L1 (B ↔ n twins) | 3–4 pairs, always inside one family. |
| `number` | type the number | U1 L2 | The answer comes from the data. Band numbers must be exact; MHz values allow a small error (`tolerance_mhz`, default 5). |
| `order` | order the bands / spectrum slider (simple) | U1 L2 | 3–5 bands, sorted by a data field (normally `dl_low_mhz`). The result is shown on a spectrum bar. |

### 2c. Wrong choices (distractors)
- Use **near-misses**, never random ones: B12 vs B17 vs B85 vs B13; B2 vs B25; B4 vs B66; "up above down" vs "down above up".
- **Every wrong choice must be proven wrong by a checked fact.** For bands that's easy (the numbers prove it). For carriers it means a wrong choice is a twisted version of a checked fact (buyer and seller swapped, the wrong year, "runs it today" when the data says PLANNED), never "Verizon" just because the bands file has no Verizon row. No row isn't proof, and a wrong choice still plants an idea: if it later turned out true, we'd have taught "that's wrong".
- No true/false items: the research rates them weak and risky.

### 2d. Feedback (every item)
1. Right or wrong, shown at once (under 0.1 s; PRD success check S2).
2. The correct answer.
3. One "why" line in plain words. Numbers in it come from the data (templates, section 3).
4. For carrier, history and "coming" items: the status badge and the as-of date, for example "HISTORICAL · as of Oct 2026".
5. When wrong: the chosen answer and the right one side by side (for bands, both drawn on one small spectrum bar).
6. A missed item comes back once later in the same lesson, then goes to the review scheduler (FSRS).

### 2e. What may be quizzed (from the PRD, enforced by the checker)
| Status of the fact | In units 1–3 |
|---|---|
| CURRENT | Normal questions |
| HISTORICAL | Only in items with `label: history`, worded in the past tense ("used to…", "sold in…") |
| PENDING / PLANNED | Only in items with `label: coming` ("is expected to…", "plans to…") |
| UNVERIFIED | Never asked. May appear on a learn card as a grey "not checked yet" line. |

Concept items that rest on no band or carrier fact (what "uplink" means, that 1 GHz = 1000 MHz, the reach-vs-speed idea) use `no_facts_needed: true`. They are marked **[concept]** below so the T37 review can check their wording.

### 2f. IDs (locked once used)
- **Units:** `unit01`, `unit02`, `unit03`. **Lessons:** `unit01-l1` … `unit01-l4`, and `unit01-check` for the checkpoint. These replace the sample path; the old sample IDs (`u1-l1` …) are never reused.
- **Questions:** `u<unit>-<topic>-<nn>`, for example `u2-b71-updown-01`. The topic stays the same if the question moves to another lesson, so reordering lessons never wipes review history. Once the checker locks an ID (`--update-ids`), it is never renamed.

---

## 3. The lesson file format (sketch for T32/T33)

`content/lessons/unit-01/lesson-1.yaml` (the folder pattern the checker already reads: `content/lessons/unit-*/*.yaml`):

```yaml
unit: unit01
unit_title: The spectrum ruler
lesson: unit01-l1
title: What is a band?
questions:            # the checker reads this list; learn cards sit in it too, in order
  - id: u1-band-learn-01
    kind: learn
    facts: [band:B71, band:n71]
    text: >
      A band is a stretch of radio frequencies with a number for a name.
      B71 runs from {band:B71.dl_low_mhz} to {band:B71.ul_high_mhz} MHz.
      "B" means 4G (LTE). "n" means 5G. n71 uses exactly the same space.
    drawing: spectrum-bar
    show: [B71]

  - id: u1-b-vs-n-01
    kind: choice
    facts: [band:n71]
    prompt: Your phone shows "n71". Is that 4G or 5G?
    choices: [5G (NR), 4G (LTE)]
    answer: 0
    why: >
      "n" bands are 5G NR. n71 is listed as {band:n71.kind}.

  - id: u1-b71-number-01
    kind: number
    facts: [band:B71]
    prompt: B71's downlink starts at how many MHz?
    answer_from: band:B71.dl_low_mhz
    tolerance_mhz: 5
    why: B71's downlink is {band:B71.dl_low_mhz}–{band:B71.dl_high_mhz} MHz.
```

Rules for the format:
- `{band:ID.field}` is filled in from `bands.json` when the app is built. The same goes for `{carrier_use:BAND/carrier.field}` and `{change:N.field}`. A lesson file **never types a frequency** (PRD section 5). The build fails if a template points at a missing field.
- `answer_from` gives the right answer for `number` items. `order` items give `bands: [...]` plus `sort_by: dl_low_mhz`; the right order is worked out from the data.
- `match` items list `pairs:` of fact templates, for example `[{band:B2.id}, "PCS (1900)"]`. Names come from `{band:ID.name}`.
- Every item lists `facts:` (or `no_facts_needed: true`), so `check_content.py` works unchanged on these files.

---

## 4. Unit 1: The spectrum ruler

**Goal:** by the end you can place any common US band on a ruler from low to high, tell 4G from 5G by its name, and say whether it uses two lanes (FDD) or takes turns (TDD).
**Bands used only as examples here** (their own units come later): B71, n71, B12, B2, B66, n41, n77, n258, n260, n261, B13, B14.

### Lesson 1 · What is a band? (`unit01-l1`)
| Item | Type | Facts | What it teaches or asks |
|---|---|---|---|
| Learn: a band is a numbered stretch of frequencies; MHz and GHz on a ruler | learn | band:B71, band:n258 | B71 sits around {B71 name}; n258 is up at {n258.dl_low_mhz} MHz (shown as GHz) |
| Learn: "B" = 4G LTE, "n" = 5G NR; twins share the same space | learn | band:B71, band:n71 | B71 and n71 have the same numbers |
| 1 GHz = 1000 MHz **[concept]** | choice (3) | none | Which is higher: 2000 MHz, 2 GHz, or are they the same? (The same) |
| 4G or 5G? (×2: n71, B66) | choice (2) | band:n71, band:B66 | Read the letter |
| Twins | match (3 pairs) | band:B71, band:n71, band:B2, band:n2, band:B66, band:n66 | B71↔n71, B2↔n2, B66↔n66 |
| Which number is bigger in MHz? | choice (2) | band:B71, band:B66 | B71 or B66 sits higher (compares `dl_low_mhz`) |
| Mixed: name the twin of n25 | choice (3) | band:n25, band:B25, band:B2 | B25 (near-miss: B2) |

### Lesson 2 · Low, mid and high (`unit01-l2`)
| Item | Type | Facts | What it teaches or asks |
|---|---|---|---|
| Learn: the three tiers (rule D1), drawn as three coloured parts of the ruler | learn | band:B71, band:B2, band:n260 | One example per tier |
| Learn: reach vs speed: lower travels farther and through walls; higher carries more but reaches less **[concept]** | learn | none | Plain physics, no band facts |
| Which tier? (×4: B12, B66, n41, n261) | choice (3) | band:B12, band:B66, band:n41, band:n261 | Tier worked out from `dl_low_mhz` and `kind` |
| FR1 or FR2? (×2: n77, n260) | choice (2) | band:n77, band:n260 | From `kind` |
| Order 4 bands, low to high | order | band:B71, band:B2, band:n77, band:n260 | `sort_by: dl_low_mhz` |
| Reach vs speed: you're in a basement far from the tower. Which tier helps most? **[concept]** | choice (3) | none | Low |
| Type the tier boundary used in the app (1000 MHz) **[concept]** | number | none | Teaches rule D1; tolerance 0 |

### Lesson 3 · Two lanes or taking turns (`unit01-l3`)
| Item | Type | Facts | What it teaches or asks |
|---|---|---|---|
| Learn: uplink = phone → tower, downlink = tower → phone **[concept]** | learn | none | Arrow drawing |
| Learn: FDD = two separate lanes (B2 drawn with its two ranges); TDD = one lane, taking turns (n41 drawn as one range) | learn | band:B2, band:n41 | Numbers from the data |
| FDD or TDD? (×4: B12, n41, B66, n77) | choice (2) | each band | From `duplex` |
| All mmWave bands are TDD: which mode does n261 use? | choice (2) | band:n261 | From `duplex` |
| Spot the clue: "This band has one range used both ways." | choice (3) | band:n41, band:B2, band:B12 | n41 |
| Spot the clue: "Uplink {B2.ul_low_mhz}–{B2.ul_high_mhz}, downlink {B2.dl_low_mhz}–{B2.dl_high_mhz}." FDD or TDD? | choice (2) | band:B2 | FDD |
| How far apart are B2's two lanes? (the duplex gap) | number | band:B2 | `answer_from: band:B2.duplex_spacing_mhz`, tolerance 5 |
| Mixed: which tier is n41? | choice (3) | band:n41 | Mid |

### Lesson 4 · The upside-down bands (`unit01-l4`)
| Item | Type | Facts | What it teaches or asks |
|---|---|---|---|
| Learn: in most FDD bands the uplink sits **below** the downlink. In B13, B14 and B71 it sits **above** ("upside-down"). Drawn on the ruler. | learn | band:B13, band:B14, band:B71, band:B12 | B12 as the normal comparison |
| Upside-down or normal? (×4: B71, B12, B14, B2) | choice (2) | each band | From `duplex` ("UL above DL") |
| Spot the clue: "Uplink {B13.ul_low_mhz}–{B13.ul_high_mhz}, downlink {B13.dl_low_mhz}–{B13.dl_high_mhz}." Which band? | choice (3) | band:B13, band:B14, band:B12 | B13 (near-miss: B14) |
| Which of these is NOT upside-down? | choice (4) | band:B13, band:B14, band:B71, band:B5 | B5 |
| Is n71 upside-down too? | choice (2) | band:n71 | Yes: twins share everything |
| Match: band ↔ "normal" or "upside-down" | match (4 pairs) | band:B13, band:B71, band:B66, band:B25 | |
| Mixed: FDD or TDD for B71? | choice (2) | band:B71 | FDD |

Note for T33: the bands file also marks B24, B103, the satellite bands and n105 as upside-down. They aren't US phone bands we teach, so leave them out of units 1–3 and don't claim the list is complete. Say "the three you'll meet most" instead of "the only three".

### Checkpoint · Spectrum ruler certification (`unit01-check`)
About 15 items, no learn cards, no hints: 3 tier, 3 FDD/TDD, 3 upside-down, 2 twins (match), 2 orders (5 bands each), 2 type-the-number (B71 downlink start; B2 duplex gap).

---

## 5. Unit 2: Low band (600, 700, 850 MHz)

**Goal:** you know each low band's nickname, roughly where it sits, which ones fit inside others, which ones are upside-down, and the checked carrier facts and sales for these bands.
**Families, one lesson each:** 600 → 700 (lower) → 700 (upper) → 850.

### Lesson 1 · 600 MHz: B71 and n71 (`unit02-l1`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: B71/n71, "600 MHz", the lowest US band we teach, upside-down | learn | band:B71, band:n71 | | |
| Learn: who: T-Mobile runs n71 ("Extended Range"); AT&T bought 600 MHz in 2026 and plans to build it; Boost used to | learn | carrier_use:n71/tmobile, carrier_use:n71/att, carrier_use:n71/boost, change:6 | | Badges: CURRENT / PLANNED / HISTORICAL. C Spire's row stays a grey "not checked yet" line. |
| Type: the 600 MHz band is band number __ | number | band:B71 | | 71, exact |
| B71's downlink starts at __ MHz | number | band:B71 | | `dl_low_mhz`, tolerance 5 |
| Which carrier runs n71 ("Extended Range") today: T-Mobile or AT&T? | choice (2) | carrier_use:n71/tmobile, carrier_use:n71/att | | T-Mobile. AT&T is the checked wrong choice: it owns 600 MHz since 2026 but its build is PLANNED. No other carriers as choices (no checked row proves them wrong). |
| AT&T and 600 MHz: what's the situation? | choice (3) | carrier_use:n71/att, change:6 | coming | "Bought it from EchoStar (closed {change:6.date}); building it over several years" |
| Boost and n71 | choice (3) | carrier_use:n71/boost | history | "Used to run its own 5G on it; traffic moved to AT&T by Nov 2025" |
| Upside-down check: B71's uplink is above or below its downlink? | choice (2) | band:B71 | | Above |
| Mixed: tier of n71 | choice (3) | band:n71 | | Low |

### Lesson 2 · 700 MHz, lower part: B12, B17, B85 and B29 (`unit02-l2`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: nesting boxes: B17 fits inside B12, and B12 fits inside B85 (drawn as three boxes) | learn | band:B17, band:B12, band:B85 | | From `relations` and the number fields |
| Learn: B29 is downlink-only (a one-way booster lane) | learn | band:B29 | | `duplex: SDL` |
| Smallest box? | choice (3) | band:B12, band:B17, band:B85 | | B17 |
| Biggest box? | choice (3) | same | | B85 |
| Spot the clue: "Downlink {B12.dl_low_mhz}–{B12.dl_high_mhz} MHz, uplink {B12.ul_low_mhz}–{B12.ul_high_mhz}." | choice (3) | band:B12, band:B17, band:B85 | | B12 |
| B29 has no uplink. What is it used for? | choice (3) | band:B29 | | Extra downlink only |
| Type: B12's downlink starts at __ MHz | number | band:B12 | | tolerance 5 |
| Normal or upside-down: B12? | choice (2) | band:B12 | | Normal |
| Sales: who bought Array's (ex-UScellular) 700 MHz in 2026? | choice (3) | change:2, change:3 | | AT&T (Jan) and T-Mobile (May): "both" |
| Mixed: B71 or B12, which sits lower? | choice (2) | band:B71, band:B12 | | B71 |

After T47: "Which carriers use B12/B17?" (AT&T's B/C blocks, T-Mobile's A block) once those rows are checked.

### Lesson 3 · 700 MHz, upper part: B13 and B14 (`unit02-l3`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: B13 and B14 sit side by side above B12, and both are upside-down | learn | band:B13, band:B14, band:B12 | | |
| Learn: grey "not checked yet" line: "B13 is usually linked to Verizon, and B14 to FirstNet (AT&T). We're still checking these." | learn | band:B13, band:B14 | | Shown, never asked, until T47 |
| B13 or B14: which sits higher? | choice (2) | band:B13, band:B14 | | B14 |
| Spot the clue: upside-down, uplink {B14.ul_low_mhz}–{B14.ul_high_mhz} | choice (3) | band:B13, band:B14, band:B71 | | B14 |
| Type: B13's downlink starts at __ MHz | number | band:B13 | | tolerance 5 |
| Upper or lower 700? (×3: B12, B13, B17) | choice (2) | each band | | From the numbers (B13/B14 above B12/B17/B29) |
| Order: B71, B12, B13, B14 | order | those bands | | `sort_by: dl_low_mhz` |
| Match: B12/B13/B14/B29 ↔ normal / upside-down / upside-down / downlink-only | match (4) | those bands | | |
| Mixed: FDD or TDD, B14? | choice (2) | band:B14 | | FDD |

After T47: "Which carrier is known for B13?" and "Which network is B14 built for?" (FirstNet).

### Lesson 4 · 850 MHz: B5, n5 and B26 (`unit02-l4`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: B5/n5, called "Cellular (850)" in the data; B26 is the bigger box around B5 | learn | band:B5, band:n5, band:B26 | | `relations`: B5 ⊂ B26 |
| Learn (history): T-Mobile used B26 (its ex-Sprint 800 MHz) until it sold those licences to Grain Management (closed {change:7.date}) | learn | carrier_use:B26/tmobile, change:7 | history | The SpaceX follow-on (change:8) is UNVERIFIED: not shown |
| B5 or B26: which is bigger? | choice (2) | band:B5, band:B26 | | B26 |
| n5's twin? | choice (3) | band:n5, band:B5, band:B26 | | B5 |
| Type: the 850 band is band number __ | number | band:B5 | | 5, exact |
| History: what happened to T-Mobile's B26? | choice (3) | carrier_use:B26/tmobile, change:7 | history | Sold to Grain in Aug 2026 |
| Normal or upside-down: B5? | choice (2) | band:B5 | | Normal |
| Order the low bands: B71, B12, B13, B5 | order | those bands | | |
| Mixed: tier of B26 | choice (3) | band:B26 | | Low |

After T47: AT&T and Verizon on B5/n5. (n5 Cellcom is CURRENT, but Cellcom is a small Wisconsin carrier; keep it for unit 5, "who uses what".)

### Checkpoint · Low-band certification (`unit02-check`)
About 15 items, no hints: match the band to its nickname (600/700/850) ×2 sets; 3 nesting questions; 3 upside-down or downlink-only; 2 type the band number; 2 carrier items (n71 T-Mobile; AT&T 600 MHz "coming"); 1 history (B26); 2 mixed from unit 1 (FDD/TDD, tier).

---

## 6. Unit 3: Mid band (1900, 1700/2100, 2300 MHz)

**Goal:** you know PCS, AWS and WCS, which LTE band fits inside which, the 5G twins, and the checked history (Boost's AWS bands, the 2025–26 sales).
**Note:** n41 and n77 are mid band too (rule D1), but they're "capacity bands" and get unit 4. Unit 3 says so on its first learn card, so the learner isn't surprised later.

### Lesson 1 · PCS 1900: B2, B25, n2 and n25 (`unit03-l1`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: PCS (1900 MHz); B25 is the bigger box around B2; n2/n25 are the 5G twins | learn | band:B2, band:B25, band:n2, band:n25 | | |
| Bigger box: B2 or B25? | choice (2) | band:B2, band:B25 | | B25 |
| Twin of n25? | choice (3) | band:n25, band:B25, band:B2 | | B25 |
| Spot the clue: "Uplink {B25.ul_low_mhz}–{B25.ul_high_mhz}" | choice (3) | band:B2, band:B25, band:B66 | | B25 |
| Type: PCS is called "1900"; the band numbers are 2 and __ | number | band:B25 | | 25 |
| B2's duplex gap (__ MHz) | number | band:B2 | | `duplex_spacing_mhz`, tolerance 5 |
| Mixed: tier of B25 | choice (3) | band:B25 | | Mid |
| Mixed: B5 or B2, which reaches farther? **[concept]** plus band:B5, band:B2 | choice (2) | band:B5, band:B2 | | B5 (low band) |
| Sale (Aug 2025): part of UScellular's spectrum, including PCS (B2/B25) and AWS (B66), went to which company? | choice (3) | change:0, change:2, change:5 | | T-Mobile. Wrong choices: AT&T and Verizon, which bought from Array later (2026). This uses only the buyers from change:2 and change:5, not change:5's disputed band list. |

After T47: "Who uses B2/B25?" (all three big carriers, per the research, once checked).

### Lesson 2 · AWS 1700/2100: B4, B66 and n66 (`unit03-l2`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: AWS has a very wide gap: uplink near 1700, downlink near 2100. B4 fits inside B66. n66 is the 5G twin. | learn | band:B4, band:B66, band:n66 | | |
| Learn: B66's top slice is downlink-only (the data's note on B66's downlink) | learn | band:B66 | | Quote the data's note, simplified |
| Bigger box: B4 or B66? | choice (2) | band:B4, band:B66 | | B66 |
| Where's the uplink: near 1700 or near 2100? | choice (2) | band:B66 | | 1700 |
| Spot the clue: "Uplink {B4.ul_low_mhz}–{B4.ul_high_mhz}, downlink {B4.dl_low_mhz}–{B4.dl_high_mhz}" | choice (3) | band:B4, band:B66, band:B2 | | B4 |
| Type: B66's downlink starts at __ MHz | number | band:B66 | | tolerance 5 |
| PCS or AWS? (×3: B25, B66, B4) | choice (2) | each band | | From `name` |
| Boost and n66 | choice (3) | carrier_use:n66/boost | history | "Used to run 5G on it; traffic moved to AT&T by Nov 2025" |
| Mixed: order B71, B12, B2, B66 | order | those bands | | |

After T47: AT&T, Verizon and T-Mobile on B66/n66.

### Lesson 3 · WCS 2300 and the AWS leftovers: B30, B70 and n70 (`unit03-l3`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: B30 (WCS, 2300): a small FDD band near the top of the classic mid band | learn | band:B30 | | |
| Learn (history): Boost (Dish) used B70/n70; Boost's traffic moved to AT&T's network by Nov 2025 | learn | band:B70, band:n70, carrier_use:B70/boost, carrier_use:n70/boost | history | |
| Learn (coming): parts of these airwaves are being sold to SpaceX for satellites | learn | change:1, change:9 | coming | Both PENDING: use "expected" wording and their dates |
| Type: WCS is band number __ | number | band:B30 | | 30 |
| History: B70 was used by Boost (Dish). What happened to Boost's traffic? | choice (3) | carrier_use:B70/boost | history | "It moved to AT&T's network by Nov 2025." Wrong choices are twisted versions of the same fact: "moved to T-Mobile", "moved in 2023". |
| Coming: who is expected to get the B70 uplink slice? | choice (3) | change:1 | coming | SpaceX |
| Spot the clue: "FDD, downlink {B30.dl_low_mhz}–{B30.dl_high_mhz}" | choice (3) | band:B30, band:B66, band:B25 | | B30 |
| Which sits highest: B2, B66, B30? | choice (3) | those bands | | B30 |
| Mixed: upside-down or normal, B30? | choice (2) | band:B30 | | Normal |

After T47: AT&T on B30.

### Lesson 4 · Twins and nesting boxes, all mixed (`unit03-l4`)
The interleaving lesson: low and mid families together, no new facts.
| Item | Type | Facts | What it asks |
|---|---|---|---|
| Learn: the four nesting pairs on one ruler: B17⊂B12⊂B85, B5⊂B26, B2⊂B25, B4⊂B66 | learn | those bands | One summary picture |
| Which is the bigger box? (×4: B12/B85, B5/B26, B2/B25, B4/B66) | choice (2) | each pair | |
| Match twins (×4: B71/n71, B5/n5, B25/n25, B66/n66) | match | those bands | |
| Spot the clue: "upside-down, low band, 600" / "downlink-only, 700" / "the bigger PCS box" | choice (4) | B71, B29, B25 plus near-misses | |
| Order 5 bands across low and mid | order | B71, B13, B5, B25, B66 | |
| Type: band number for the 1700/2100 "big box" | number | band:B66 | 66 |

### Checkpoint · Mid-band certification and ruler review (`unit03-check`)
About 15 items, no hints: 3 nesting, 2 twins, 3 "which band" spot-the-clue items, 2 type-the-number (one band number, one MHz edge), 2 history/coming (B70 Boost, SpaceX), 3 review from units 1–2 (tier, upside-down, n71 T-Mobile).

---

## 7. Every fact units 1–3 use, and how

| Fact reference | Status today | Used as |
|---|---|---|
| band:B71, n71, B12, B17, B85, B29, B13, B14, B5, n5, B26, B2, n2, B25, n25, B4, B66, n66, B30, B70, n70, n41, n77, n258, n260, n261 | CURRENT (DRAFT until T07) | Normal questions |
| carrier_use:n71/tmobile | CURRENT | Normal question (U2 L1) |
| carrier_use:n71/att, carrier_use:B71/att | PLANNED | `label: coming` (U2 L1) |
| carrier_use:n71/boost, B71/boost, n66/boost, n70/boost, B70/boost | HISTORICAL | `label: history` (U2 L1, U3 L2, U3 L3) |
| carrier_use:B26/tmobile | HISTORICAL | `label: history` (U2 L4) |
| change:0, 2, 3, 6, 7 | CURRENT | Sales questions (with dates) |
| change:5 (Array → Verizon) | CURRENT, but its note says sources disagree on the exact bands | Only its buyer and date are used (U3 L1, to prove a wrong choice wrong), never its band list |
| change:1, change:9 | PENDING | `label: coming` (U3 L3) |
| change:8 (Grain → SpaceX, B26) | UNVERIFIED | Not shown |
| carrier_use B13/verizon, B14/att, B12/att, B17/att, B12/tmobile, B5/*, n5/att, n5/verizon, B2/*, n2/*, B25/*, n25/tmobile, B4/*, B66/*, n66/verizon, n66/tmobile, B30/att, B71/cspire, n71/cspire, B12/cspire | UNVERIFIED | Grey "not checked yet" lines on learn cards only. **T47** checks them. |
| carrier_use:n5/cellcom | CURRENT | Saved for unit 5 |
| FR1 / FR2 edges | verified in `band_verification.md`, not yet in `bands.json` | T33 adds `frequency_ranges` rows; until then, teach FR1/FR2 through `kind` only |

---

## 8. Decisions made here (also in `docs/DECISIONS.md`)

- **D1, the tier rule:** in this app, **low band** = a band whose lowest frequency is below 1000 MHz; **high band** = FR2 (mmWave); **mid band** = everything else in FR1. The app works out each band's tier from `bands.json`, and a learn card says it's the app's own rule (people draw the lines a little differently). Why: our sources give no official definition, and this rule matches how the units are split (600–850 low; 1700–2300 plus n41/n77 mid; n258/n260/n261 high).
- **D2:** units 2–3 quiz only checked carrier facts. Unchecked ones are shown greyed out and never asked, not even as wrong choices. New task T47 checks them.
- **D3:** every unit has 4 lessons plus a no-hints checkpoint, about 12–15 items each. Normal lessons stay inside one band family; mixing happens in the mixed-review steps, the U3 L4 interleaving lesson and the checkpoints.
- **D4:** real IDs are `unit01`…, `unit01-l1`…, `unit01-check`, and questions are `u<unit>-<topic>-<nn>`. The sample IDs `u1-l1`… are never reused, so the stars from the test build don't unlock real lessons.
- **D5:** lesson files never type a frequency. They use templates like `{band:B71.dl_low_mhz}` and `answer_from:`, which are filled in from `bands.json` at build time.
- **D6:** `number` items: band numbers exact; MHz values ±5 MHz unless a question says otherwise.
- **D7:** no true/false items in units 1–3.

## 9. What T32 and T33 need to build (hand-off list)

**T32 (question types and reviews):**
- Item types `learn`, `match`, `number` (with `answer_from` and `tolerance_mhz`) and `order` (with `sort_by`), next to today's `choice`.
- Template filling from `bands.json` (`{band:ID.field}`, `{carrier_use:…}`, `{change:N.field}`), failing loudly on a missing field.
- A missed item comes back once later in the same lesson.
- Feedback shows the status badge and as-of date for items that list carrier or change facts.
- FSRS schedules by question ID (learn cards aren't scheduled).
- A small spectrum-bar drawing (used by learn cards, the `order` result, and wrong-answer feedback).

**T33 (writing the units):**
- Write the 15 lesson files exactly from sections 4–6, with a "why" line on every item.
- Add `frequency_ranges` (FR1, FR2) to `build_bands.py` from `band_verification.md`, and teach the checker `range:FR1` / `range:FR2`.
- Replace `SAMPLE_PATH` with the real path, using the new IDs (D4).
- Run `check_content.py`, lock the IDs with `--update-ids`, then time one lesson of each unit (PRD success check S3: 3–5 minutes).
- Leave every "After T47" item out until T47 marks its row CURRENT.

## 10. Questions for you (none of these block the work)

1. **Exact numbers or nicknames?** This plan asks you to type a few exact edges (like "B71's downlink starts at __ MHz") and mostly nicknames (600, 700, 850, 1900…). **My suggestion: keep it like this.** Say "fewer exact numbers" or "more exact numbers" if you'd like it different.
2. **Is the tier rule OK?** Low = below 1 GHz, high = mmWave, mid = everything between. **My suggestion: yes.**
