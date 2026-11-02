# 🧭 Units 4–5 design: capacity bands, and who uses what

**Status:** DRAFT v1 (plan only, no lessons written yet). Same pattern as `units-1-3.md`.
**Written:** 2026-11-02 by a robot run (Sonnet, Medium effort), first part of task T34.
**Built from:** `docs/PRD.md` (section 4a), `docs/curriculum/units-1-3.md` (rules in its section 2 apply here unchanged), `content/bands.json` (as of 2026-10-31), `content/carrier-codes.md` (DRAFT v2).

---

## In simple words

Units 1–3 taught the "ruler" and the low and mid bands. These two units finish the bands.

- **Unit 4, "Capacity bands":** the wide, fast bands that carry most 5G traffic: n41 (2500 MHz), n77/n78 (the "C-band" family), CBRS (B48/n48, 3500 MHz), and the very high mmWave bands (n258, n260, n261).
- **Unit 5, "Who uses what":** which carrier is known for which band, what the 5G icons on your phone mean, the 2025–26 spectrum sales, and what the number tags (MCC/MNC) mean.
- Same shape as before: 4 lessons plus a no-hints checkpoint each, 12–15 steps per lesson, 3–5 minutes.
- **The big catch is the same as before:** a lot of carrier facts are still UNVERIFIED (task T47), so the lessons only quiz what is checked. Unit 5 is the unit that suffers most, so it is smaller than the PRD table suggests. Details are in section 1.

---

## 1. What I found (and what it changes)

| # | Finding | What it changes |
|---|---|---|
| G1 | All band rows needed here (n41, B41, n77, n78, n79, B48, n48, B49, n46, n258, n260, n261, n257) are CURRENT for frequency, duplex and nesting (as of 2026-10-31, DRAFT until T07). | Frequency, duplex and nesting questions are allowed. |
| G2 | **Checked carrier rows for these units:** n41 T-Mobile (CURRENT), n77 AT&T (CURRENT), n77 Verizon (CURRENT), n260 Verizon (CURRENT), n261 Verizon (CURRENT), n261 Cellcom (CURRENT). **Unchecked (never quizzed):** B41 and n41 for C Spire, n77 T-Mobile and C Spire, n260 AT&T, n258 T-Mobile, B46 for all three, B48 Verizon. | Unit 4 carrier questions use only the six checked rows. |
| G3 | The PRD says unit 4 covers "n77 and its slices (3.45 GHz, C-band, upper C-band coming)". The bands file only has a note on the AT&T row ("C-band plus 3.45 GHz incl. EchoStar 30 MHz on ~23k sites") and the Array to AT&T and EchoStar to AT&T sales (`change:2`, `change:6`). There is **no row** for "upper C-band" and none for how n77 is cut into slices. | Unit 4 teaches n77 as one big band that holds n78, and uses the note and sales only as learn-card context. "Upper C-band coming" is **left out** until someone adds a sourced row. (Not a new task yet: it fits inside T47.) |
| G4 | The 5G icon names are only in the `note` field of CURRENT rows: "Ultra Capacity" (n41 T-Mobile), "5G+" (AT&T n77), "5G UW" (Verizon n77). AT&T's and T-Mobile's other icons aren't in the data. | Unit 5 can quiz exactly three icon facts. They are shown with the as-of date, because carriers rename icons. |
| G5 | **Satellite-to-phone** has no CURRENT carrier row. The bands file has the satellite band entries (`LTE-satellite` kinds) and two SpaceX spectrum changes (`change:1` and `change:9` PENDING, `change:8` UNVERIFIED). | Unit 5 has **no satellite lesson** now. It only shows the two PENDING sales with a "coming" label. A full lesson waits for a sourced carrier row (add to T47). |
| G6 | `content/carrier-codes.md` is DRAFT v2: 12 rows are trusted (registry-checked), 4 are not, and the ITU list was never opened. The lesson files format has no `{code:...}` template, and `check_content.py` has no `code:` fact kind. | Unit 5's carrier-code lesson needs T33-style plumbing: a `carrier_codes` list in the build, a `code:` fact kind in the checker, and the same status rules. Planned in section 8. Until then the lesson is not written. |
| G7 | Scenario puzzles (several clues, explain every one) are a **later question type** (v0.8). | Units 4–5 use only the types from v0.5 (`learn`, `choice`, `match`, `number`, `order`). The scenario items listed in the PRD are replaced by "spot the clue" `choice` items now and noted as upgrades for v0.8. |
| G8 | The spectrum heatmap (a picture of the whole ruler with carriers coloured in) is part of v0.6 in the PRD. It can only colour **checked** rows, so it will look half empty. | Not part of this plan. Listed as a hand-off so the app builder knows it will be sparse until T47. |

---

## 2. Rules (all inherited from `units-1-3.md` section 2 and the decisions D1 to D7)

- Same lesson shape, same question types, same "never type a frequency" rule (templates like `{band:n41.dl_low_mhz}`).
- Same tier rule (D1): high band = FR2. So n258, n260, n261 are "high".
- Unchecked carrier facts appear only as grey "not checked yet" lines, never as questions, never as wrong choices.
- New IDs: `unit04`, `unit04-l1` … `unit04-check`, `unit05`, … Question IDs `u4-<topic>-<nn>`, `u5-<topic>-<nn>`.
- Mixed-review steps pull from units 1–3 (interleaving).

---

## 3. Unit 4: Capacity bands

**Goal:** you know that these bands are wide and TDD, where each sits, which ones fit inside others, and the checked carrier facts for them (T-Mobile n41, AT&T and Verizon n77, Verizon mmWave).
**Families, one lesson each:** 2500 (n41) → C-band (n77, n78, n79) → CBRS (B48, n48, B49) → mmWave (n257, n258, n260, n261).

### Lesson 1 · 2500 MHz: B41 and n41 (`unit04-l1`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: "capacity band" = a wide band, mostly TDD, that carries lots of data over shorter distances. n41 is the 5G band at 2500 MHz; B41 is its 4G twin. | learn | band:n41, band:B41 | | Link back to unit 1 (TDD = taking turns). |
| Learn: n41 is T-Mobile's "Ultra Capacity" core band | learn | carrier_use:n41/tmobile | | CURRENT badge with as-of date. C Spire rows stay grey. |
| FDD or TDD, n41? | choice (2) | band:n41 | | TDD |
| n41 is how many MHz wide? | number | band:n41 | | width worked out from `dl_low_mhz`/`dl_high_mhz`, tolerance 5 (no typed number) |
| n41's twin? | choice (3) | band:n41, band:B41, band:B25 | | B41 |
| Spot the clue: "TDD, {n41.dl_low_mhz}–{n41.dl_high_mhz} MHz, no separate uplink range" | choice (3) | band:n41, band:n77, band:n71 | | n41 |
| Which carrier's "Ultra Capacity" icon comes from n41? | choice (2) | carrier_use:n41/tmobile, carrier_use:n77/att | | T-Mobile. AT&T is the checked wrong choice (its checked band is n77). |
| Tier of n41: low, mid or high? | choice (3) | band:n41 | | Mid |
| Mixed: n71 or n41, which reaches farther? [concept] | choice (2) | band:n71, band:n41 | | n71 |
| Mixed: order n71, n25, n41 | order | those bands | | |

### Lesson 2 · C-band family: n77, n78 and n79 (`unit04-l2`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: n77 is a huge TDD band (3300–4200 MHz). n78 sits inside it, and n48 (CBRS) sits inside n78. Drawn as nesting boxes. | learn | band:n77, band:n78, band:n48 | | From `relations` |
| Learn: n79 (4500 MHz) is a separate band, mostly used outside the US | learn | band:n79 | | Say nothing about US use (no row). |
| Biggest box: n77, n78 or n48? | choice (3) | those bands | | n77 |
| n78 fits inside which band? | choice (3) | band:n78, band:n77, band:n79 | | n77 |
| Spot the clue: "TDD, {n77.dl_low_mhz}–{n77.dl_high_mhz} MHz" | choice (3) | band:n77, band:n78, band:n41 | | n77 |
| Type: n77's lowest frequency is __ MHz | number | band:n77 | | `dl_low_mhz`, tolerance 5 |
| Learn: AT&T "5G+" and Verizon "5G UW" both ride on n77 | learn | carrier_use:n77/att, carrier_use:n77/verizon | | CURRENT, with dates. T-Mobile and C Spire n77 rows stay grey. |
| Which band carries AT&T's "5G+": n41 or n77? | choice (2) | carrier_use:n77/att, carrier_use:n41/tmobile | | n77. The wrong choice is n41, proven wrong because the checked n41 row belongs to T-Mobile. (Open design point 1, section 7: this is how one-answer carrier questions avoid unchecked wrong choices.) |
| Sale: in January 2026 AT&T bought 3.45 GHz (n77) and 700 MHz from which company? | choice (3) | change:2 | | Array (the former UScellular). Wrong choices: only names found elsewhere in `spectrum_changes`. |
| Mixed: tier of n77 | choice (3) | band:n77 | | Mid |

### Lesson 3 · CBRS: B48, B49 and n48 (`unit04-l3`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: CBRS (3550–3700 MHz) is a shared band: the owner of the band is the US government's radar, and others borrow it. B48 is 4G, n48 is 5G, B49 is a sub-slice of B48. | learn | band:B48, band:n48, band:B49 | | Keep "shared with radar" simple. If the data's notes don't say it, the line is marked "from the research notes" only if the research file backs it; otherwise cut it. |
| Learn (grey): "Verizon is often said to use B48. We're still checking." | learn | carrier_use:B48/verizon | not checked | Shown, never asked. |
| B48 or B49, which is bigger? | choice (2) | band:B48, band:B49 | | B48 |
| n48 fits inside which bands? | choice (3) | band:n48, band:n77, band:n78 | | both n77 and n78 (use "pick both" or choose n78 as answer, wrong choices n41 and n79) |
| Type: CBRS starts at __ MHz | number | band:B48 | | `dl_low_mhz`, tolerance 5 |
| FDD or TDD, CBRS? | choice (2) | band:B48 | | TDD |
| Spot the clue: "TDD, {B48.dl_low_mhz}–{B48.dl_high_mhz}, sits in the middle of C-band" | choice (3) | band:B48, band:n41, band:B30 | | B48 |
| Order: n41, n48, n77 by starting frequency | order | those bands | | Sorted by `dl_low_mhz`; the data gives the order. |
| Mixed: B2 or B48, which has the uplink on a different frequency? | choice (2) | band:B2, band:B48 | | B2 (B48 is TDD) |

### Lesson 4 · mmWave: n257, n258, n260 and n261 (`unit04-l4`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: "high band" = FR2 = mmWave. Very fast, very short reach, usually TDD. Four names: n257 (28 GHz), n258 (26 GHz), n260 (39 GHz), n261 (28 GHz). | learn | band:n257, band:n258, band:n260, band:n261 | | Uses the app's FR2 rule (D1). |
| Learn: Verizon uses n260 and n261 (CURRENT); Cellcom uses n261 (CURRENT) | learn | carrier_use:n260/verizon, carrier_use:n261/verizon, carrier_use:n261/cellcom | | AT&T n260 and T-Mobile n258 stay grey. |
| FR1 or FR2: n260? | choice (2) | band:n260 | | FR2 |
| n261 fits inside which band? | choice (3) | band:n261, band:n257, band:n258 | | n257 |
| Type: n260 is around __ GHz (the band number's first digits are the clue) | number | band:n260 | | `dl_low_mhz`/1000, tolerance 1 GHz. D6 is MHz-based, so use MHz here (about 37000, tolerance 1000), or add a GHz field. See hand-off. |
| Which band is Verizon's mmWave: n260 or n77? | choice (2) | carrier_use:n260/verizon, carrier_use:n77/verizon | | n260 (mmWave). Both are checked Verizon rows, so "which one is high band" is decided by the numbers (FR2). |
| Spot the clue: "FR2, TDD, {n260.dl_low_mhz}–{n260.dl_high_mhz} MHz" | choice (3) | band:n260, band:n258, band:n77 | | n260 |
| Order: n77, n258, n260 | order | those bands | | |
| Mixed: tier of n258 | choice (3) | band:n258 | | High |
| Mixed: low, mid or high? ×3 (n71, n41, n261) | choice (3) | each band | | From the numbers |

### Checkpoint · Capacity certification (`unit04-check`)
About 15 items, no hints: 3 nesting (n77 ⊃ n78 ⊃ n48, B48 ⊃ B49, n257 ⊃ n261); 3 TDD/FDD and tier; 2 type the lowest frequency; 2 order; 2 carrier items (n41 T-Mobile; n260 Verizon); 1 sale (change:2); 2 mixed from units 1–3.
After T47: adds T-Mobile n77, AT&T n260 and the other grey rows.

---

## 4. Unit 5: Who uses what

**Goal:** you can say, for the checked facts, which carrier is tied to which band and icon, you know the 2025–26 changes in plain words, and you can read the main carrier codes.
**Honest size:** with only checked facts, unit 5 is about **3 lessons plus a checkpoint** now. Two more lessons (the other icons, satellite-to-phone) wait for T47.

### Lesson 1 · Fingerprint bands (`unit05-l1`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: a "fingerprint band" is a band that points to one carrier. Right now we can check only a few: n71 T-Mobile, n41 T-Mobile, n77 AT&T/Verizon, n260/n261 Verizon. | learn | carrier_use:n71/tmobile, carrier_use:n41/tmobile, carrier_use:n77/att, carrier_use:n77/verizon, carrier_use:n260/verizon | | Rule 1 of the unit: shortcuts go out of date; check the date badge. |
| n71 and n41 together point to which carrier? | choice (2) | carrier_use:n71/tmobile, carrier_use:n41/tmobile | | T-Mobile |
| n260 points to which carrier? | choice (2) | carrier_use:n260/verizon | | Verizon |
| Match: n71 ↔ T-Mobile ("Extended Range"), n41 ↔ T-Mobile ("Ultra Capacity"), n77 ↔ AT&T and Verizon | match (3) | those rows | | Only rows marked CURRENT. |
| Does one band always mean one carrier? | choice (2) | carrier_use:n77/att, carrier_use:n77/verizon | | No: n77 is used by two carriers (the unit's key point). |
| Mixed: tier of n71, n41, n260 | choice (3) | those bands | | Low, mid, high |

### Lesson 2 · 5G icons (`unit05-l2`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: the icon on your phone is a marketing name, not a band. Three checked ones: "5G UW" (Verizon, n77), "5G+" (AT&T, n77), "Ultra Capacity" (T-Mobile, n41). | learn | carrier_use:n77/verizon, carrier_use:n77/att, carrier_use:n41/tmobile | | Shown with as-of date; says carriers rename icons. |
| Match: icon ↔ carrier (3 pairs) | match (3) | same | | |
| "5G UW" belongs to? | choice (3) | carrier_use:n77/verizon | | Verizon |
| "Ultra Capacity" is built on which band? | choice (3) | carrier_use:n41/tmobile | | n41 |
| Do two different icons share the same band? | choice (2) | carrier_use:n77/att, carrier_use:n77/verizon | | Yes (AT&T and Verizon both use n77). |

### Lesson 3 · The 2025–26 changes (`unit05-l3`)
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: a timeline of the CURRENT sales: UScellular to T-Mobile (Aug 2025), Array to AT&T (Jan 2026), Array to T-Mobile (May 2026, two deals), EchoStar to AT&T (Jul 2026), T-Mobile to Grain (Aug 2026); Array to Verizon (Jun 2026, bands disputed, so only buyer and date). | learn | change:0, 2, 3, 4, 5, 6, 7 | | Drawn as a dated line. Change:5's band list is never shown or asked. |
| Learn: coming: EchoStar to SpaceX, final transfer expected about 2027-11-30 | learn | change:1, change:9 | coming | Marked PENDING. change:8 (Grain to SpaceX) stays hidden. |
| Order the sales by date | order | change:0, 2, 6 | | By date from the data. |
| Who bought EchoStar's 600 MHz and 3.45 GHz in July 2026? | choice (3) | change:6 | | AT&T |
| Who bought part of Array's 700 MHz in May 2026? | choice (3) | change:3 | | T-Mobile |
| Who sold 800 MHz spectrum in August 2026 and to whom? | choice (3) | change:7 | | T-Mobile to Grain |
| Who took over most of UScellular's network in August 2025? | choice (3) | change:0 | | T-Mobile |

### Lesson 4 · Number tags: MCC and MNC (`unit05-l4`) — **waits for the plumbing in section 8**
| Item | Type | Facts | Label | What it teaches or asks |
|---|---|---|---|---|
| Learn: the country part (MCC: 310 to 316 in the US) and the carrier part (MNC). Example: 310-260 is T-Mobile. | learn | code:310-260 | | Needs a `code:` fact kind. |
| Match: 310-260 ↔ T-Mobile, 310-410 ↔ AT&T, 311-480 ↔ Verizon, 313-100 ↔ FirstNet | match (4) | those codes | | From the 12 trusted rows. |
| 312-530 is which carrier? | choice (3) | code:312-530 | | T-Mobile (fixes bandmon's old mistake). |
| 311-580 "UScellular" is now run by? | choice (3) | code:311-580 | | T-Mobile |
| FirstNet is run by? | choice (2) | code:313-100 | | AT&T |

### Checkpoint · Who-uses-what certification (`unit05-check`)
About 15 items, no hints: 3 fingerprint bands; 3 icons; 3 sales; 3 codes (if lesson 4 is built); 3 mixed from units 1–4.

---

## 5. Every fact units 4–5 use, and how

| Fact reference | Status today | Used as |
|---|---|---|
| band:n41, B41, n77, n78, n79, B48, n48, B49, n46, n257, n258, n260, n261 | CURRENT (DRAFT until T07) | Normal questions |
| carrier_use:n41/tmobile, n77/att, n77/verizon, n260/verizon, n261/verizon, n261/cellcom | CURRENT | Normal questions |
| carrier_use:n41/cspire, B41/tmobile and cspire, n77/tmobile, n77/cspire, n260/att, n258/tmobile, B46/*, B48/verizon | UNVERIFIED | Grey lines only |
| change:0, 2, 3, 4, 5, 6, 7 | CURRENT | Sales questions (change:5 buyer and date only) |
| change:1, 9 | PENDING | `label: coming` |
| change:8 | UNVERIFIED | Not shown |
| carrier codes: 12 registry-checked rows | CURRENT | Unit 5 lesson 4, after plumbing |
| Icon names ("5G UW", "5G+", "Ultra Capacity") | in `note` fields of CURRENT rows | Unit 5 lessons 1–2; a note is not a field, so the build needs an `icon` field (section 8) |
| n77 slices, "upper C-band", satellite-to-phone carriers | no row | Not used |

---

## 6. Decisions made here (to add to `docs/DECISIONS.md` when the owner reads this)

- **E1:** Unit 4 teaches n77 as one big band that holds n78 and n48; slices and "upper C-band" wait for a sourced row.
- **E2:** Unit 5 is 3 lessons plus a checkpoint for now (lesson 4, codes, waits for plumbing; the satellite and extra-icon lessons wait for T47).
- **E3:** Scenario puzzles stay for v0.8; units 4–5 use "spot the clue" choices.
- **E4:** Icon names get their own data field, so a question can point at them instead of copying a note.

## 7. Open design points (none block planning)

- **Wrong choices:** some carrier questions have one checked answer and no checked wrong carrier. Fix used above: ask "which band" with a band whose checked row belongs to another carrier as the wrong choice. Alternatives: a new "pick all" item type, or drop the question.
- **GHz tolerance** for mmWave number items (D6 is MHz based).
- **Disputed material:** CBRS "shared with radar" must be backed by a source before it goes on a card.

## 8. What the next chats need to build (hand-off list)

**Data and checker (small, Medium):**
- `icon` field on the three CURRENT rows (n41/tmobile, n77/att, n77/verizon), built by `build_bands.py` (not hand-edited), with status, as-of date and source copied from the row.
- `carrier_codes` list in `bands.json` (from `content/carrier-codes.md`, 12 CURRENT rows only) plus a `code:` fact kind in `check_content.py`, with the same status rules and tests.
- GHz tolerance for `number` items, or a rule that mmWave number items use MHz.

**Lessons (Medium):** write unit 4 (4 lessons plus checkpoint) from section 3, then unit 5 lessons 1–3 plus a checkpoint from section 4, then lesson 4 once the code plumbing exists. Time each lesson with `content/tools/lesson_timing.py`; run `check_content.py` and lock the IDs.

**App (later):** the spectrum heatmap and scenario puzzles (v0.8). The heatmap will show only checked rows.

**T47 (blocked on the owner):** also add sourced rows for AT&T n260, T-Mobile n77, C Spire, the other carriers' icons, upper C-band and satellite-to-phone, so unit 5 can grow.

## 9. Questions for you (none of these block the work)

1. **Is a smaller unit 5 OK for now?** My suggestion: yes. It grows when T47 is done.
2. **Wrong choices:** OK to ask one-answer carrier questions as "which band" (with another carrier's checked band as the wrong choice) instead of inventing a "pick all" item type? My suggestion: yes.
