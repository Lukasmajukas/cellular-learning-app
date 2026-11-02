# 🗼 Units 6–7 design: site types, and reading a site

**Status:** DRAFT v1 (plan only, no lessons written yet). Same pattern as `units-1-3.md` and `units-4-5.md`.
**Written:** 2026-11-02 by a robot run (Sonnet, Medium effort), first part of task T35.
**Built from:** `docs/PRD.md` (section 4a), `docs/research/notes/sites_and_carriers.md` (evidence grades A/B/C), `docs/research/photo-sources.md`, `content/photos/credits.yaml` (18 photos, all licence-read and eye-checked as of 2026-11-02).

---

## In simple words

Units 1–5 were about numbers. Units 6–7 are about **looking**.

- **Unit 6, "Site types":** you learn what the different towers look like: tall steel lattice, cable-held guyed masts, single-pole monopoles, rooftops, water tanks, fake trees and flagpoles, small cells on poles, indoor/stadium systems (DAS) and trailer sites (COW).
- **Unit 7, "Reading a site":** you learn to read clues at the bottom of a tower and in the paint: the 200 ft rule, the registration sign, warning signs, and who owns the tower versus who rents it.
- Questions show a **photo** (unit 6) or ask you to **tap the clue** in a photo (unit 7). These are new question types, so the app needs building first (section 7).
- **The big catch:** there is no data file for site facts yet (bands have one; towers don't). Section 3 plans one, with the same status/date/source rules.

---

## 1. What I found (and what it changes)

| # | Finding | What it changes |
|---|---|---|
| S1 | **No site-facts data file exists.** `CLAUDE.md` says facts come only from a data file in `content/`. The tower facts today live in `sites_and_carriers.md` (grades A/B/C) and in notes in `credits.yaml`. | New `content/sites.json` (section 3), built by a script, checked by `check_content.py`. Lessons use only rows from it. |
| S2 | Facts graded **[A]** in the research (FCC/FAA rules) are the only hard anchors: ASR needed above 200 ft (60.96 m) or near airports; ASR number must be posted near the base (47 CFR 17.4(g)); FAA marks/lights tall structures. | These become CURRENT rows with a source. |
| S3 | Most "what does a lattice/monopole look like" facts are grade **[B/C]** (vendor and consumer blogs). Looks are not figures, so I allow them as `learn` and photo questions, but the row says `grade: C` and the source. | Looks questions are allowed. Numbers (heights, areas) from B/C sources are **not** asked. |
| S4 | The research says many macro sites cluster just under 200 ft. **No source.** | Not taught. Hypothesis stays out of the app. |
| S5 | "Paint or lights means over 200 ft" is an inference (probable, not certain: near airports the FAA can mark shorter towers). | Taught as "very likely", never "always". Quiz wording says "most likely". |
| S6 | The 18 photos cover: 3 fake trees, 1 hidden-on-building, 3 plain towers (2 need a plate crop), 1 COW, 1 rooftop, 1 flagpole, 1 monopole, 3 small-cell shots (one is really a rooftop), 1 equipment shot, 1 sign, 2 water towers. **Gaps: a clear guyed mast, a clear lattice tower, DAS, a strand-mount, a monopalm, a good sign close-up.** | Unit 6 has 2–3 photos per type where they exist; lattice and guyed lessons start with **drawings** (Claude draws SVG) until photos are found. Photo hunt continues in T26. |
| S7 | Two photos need a crop (site-tower-01, small-cell-pole-02) before the app uses them. | The build tool crops; listed in section 6. |
| S8 | Commons often answers "429" from the cloud, so photos are not downloaded yet. `file:` names in `credits.yaml` are plans. | The app build (section 7) needs a download-and-resize step run on a machine where Commons answers, or run when it does. |
| S9 | CLAUDE.md: no AI-generated photos for identification questions. Drawings by Claude are allowed (diagrams). | Drawn site types are labelled "drawing" and used for learn cards and the first "which is which" step only, not for the "unseen photos" step. |

---

## 2. Rules (inherited from `units-1-3.md` section 2 and the decisions D1 to D7)

- Same lesson shape: 12–15 steps, 3–5 minutes, a no-hints checkpoint at the end of each unit.
- Every photo question: the deciding part gets **outlined in the feedback** (PRD 4b). Feedback is shown at once.
- Photo credits appear under each photo (CC BY and CC BY-SA need them).
- Each unit's step order (PRD 4a): labelled example → easy two-choice → tap-the-clue → mixed review with earlier units → unseen photos → scenario → certification. Unit 6 has no tap-the-clue until the app type exists (see section 7); it uses choice items.
- Chain of evidence (PRD): **the carrier's sticker counts most, the equipment brand counts least.** Unit 7 repeats this.
- New IDs: `unit06`, `unit06-l1` … `unit06-check`, `unit07`, … Question IDs `u6-<topic>-<nn>`, `u7-<topic>-<nn>`.
- Mixed-review steps pull from units 1–5.

---

## 3. The data file: `content/sites.json` (plan)

Built by `content/tools/build_sites.py` (not hand-edited), same pattern as `build_bands.py`. Each row has: `id`, `kind`, `text` (one plain sentence), `status` (CURRENT, UNVERIFIED …), `as_of`, `source`, `grade` (A/B/C from the research), and for site types a `look` field (the visual clue, in words).

Starting rows (all from `sites_and_carriers.md`):

| Row id | What | Grade | Status |
|---|---|---|---|
| `type:lattice` | Open steel framework, wide base, no guy wires | B/C | CURRENT (looks) |
| `type:guyed` | Slender mast held by cables to ground anchors; big footprint | B/C | CURRENT (looks) |
| `type:monopole` | One tapered steel column, antennas at the top | B/C | CURRENT (looks) |
| `type:rooftop` | Antennas on a building edge or roof, often painted to match | B/C | CURRENT (looks) |
| `type:water-tank` | Antennas ringed on a water tank, or a tower beside it | B | CURRENT (looks) |
| `type:stealth` (tree, palm, flagpole, steeple, louvers) | Antennas hidden inside a disguise | B/C | CURRENT (looks) |
| `type:small-cell` | A canister or shroud on a pole, plus a radio box or base cabinet | A/B (a permit doc) | CURRENT (looks) |
| `type:das` | Many small antennas inside or on a venue, shared by carriers | B | CURRENT |
| `type:temporary` | COW on a trailer, COLT on a vehicle; generator + dish; FirstNet SatCOLT | A (FirstNet) | CURRENT |
| `rule:asr-200ft` | Antenna structures over 200 ft (60.96 m) need an FCC ASR record, or any height near an airport flight path | A | CURRENT |
| `rule:asr-sign` | The ASR number must be posted where the public can see it near the base (47 CFR 17.4(g); changed Feb 2024) | A | CURRENT |
| `rule:faa-marking` | A structure over 200 ft should normally be painted and/or lit | A | CURRENT |
| `infer:paint-lights` | Orange-and-white paint or lights: very likely over 200 ft | inference | CURRENT, label `inference` |
| `sign:rf-warning` | Typical base signs: ASR sign, RF hazard sign, no-trespassing | C | CURRENT, grade C |
| `owner:tower-companies` | American Tower, Crown Castle, SBA, Vertical Bridge, Array own many towers and rent space to carriers | A/B | CURRENT |
| `owner:noc` | The owner posts a phone number for problems (e.g. American Tower's NOC line) | A | CURRENT. Numbers themselves are **never quizzed** (change often). |

**Left out on purpose:** Vertical Bridge tower counts (conflict in sources); any "typical height" per type (no source); the "cluster under 200 ft" idea (S4); sizes of rooftop leases.

---

## 4. Unit 6: Site types

**Goal:** from a photo you can name the site type, and say the one clue that decides it.
**Lessons (one per family):** the tall towers → hidden in plain sight → small and short → temporary and indoor, plus a checkpoint.

### Lesson 1 · The tall towers: lattice, guyed, monopole (`unit06-l1`)
| Item | Type | Facts | Photo | What it teaches or asks |
|---|---|---|---|---|
| Learn: a "macro site" = a big tower covering a wide area. Three shapes. | learn | type:lattice, guyed, monopole | drawing | Link back: macro (unit 9 later). Say "macro" is explained fully in unit 9. |
| Learn card ×3: one clue each (open frame / cables / one pole) | learn | the 3 | 1 drawing each | |
| Which has guy cables? | choice (3) | type:guyed | drawing | |
| Which is one tapered pole? | choice (3) | type:monopole | site-monopole-01 | Photo, outline on the pole |
| Photo: what type is this? | photo-choice (3) | type:monopole | site-monopole-01 | |
| Photo: what type is this? | photo-choice (3) | type:lattice | site-tower-02 (if it is a lattice) | Check by eye when downloaded; else use a new photo |
| Photo: plain tower with several masts | photo-choice | type:monopole or lattice | site-tower-01 (cropped), site-tower-03 | Pick the answer from the photo's own note |
| Match: 3 drawings ↔ 3 names | match | the 3 | drawings | |
| Which type has the **biggest footprint**? | choice (3) | type:guyed | | From the research note (cited, B) |
| Mixed: tier of n71, n41 | choice | band items | | Interleaving |

### Lesson 2 · Hidden in plain sight: stealth sites (`unit06-l2`)
| Item | Type | Facts | Photo | What it teaches or asks |
|---|---|---|---|---|
| Learn: "stealth" sites hide antennas inside a disguise. Common: fake tree, palm, flagpole, steeple. | learn | type:stealth | site-fake-tree-01 | |
| Photo: fake tree or real tree? | photo-choice (2) | type:stealth | site-fake-tree-01, -02, -03 | One photo per item |
| Photo: what is this disguise? | photo-choice (3) | type:stealth | site-flagpole-01 | |
| Photo: where are the antennas hidden? | photo-choice (3) | type:stealth | site-camouflaged-01 | Building facade |
| Learn: stealth means the antennas are hidden, so you read the signs, not the hardware | learn | infer: stealth | | Research inference: "carrier ID relies on signage and permits" |
| Order by how hidden: plain monopole, fake tree, flagpole | order | | photos | **Cut if it feels subjective.** |
| Mixed: lattice or guyed? | choice | | drawing | |

### Lesson 3 · Small and short: rooftops, water tanks, small cells (`unit06-l3`)
| Item | Type | Facts | Photo | What it teaches or asks |
|---|---|---|---|---|
| Learn: some sites sit on things that are already there: a building, a water tank, a pole | learn | type:rooftop, water-tank, small-cell | | |
| Photo: rooftop or pole? | photo-choice (2) | type:rooftop | small-cell-rooftop-01, small-cell-pole-03 | Note: pole-03 is really a rooftop (credits note) |
| Photo: what is this site on? | photo-choice (3) | type:water-tank | site-water-tower-02 | water-tower-01 is a weak example, not used here |
| Photo: small cell anatomy: tap the canister (new type, if built) else choice | choice | type:small-cell | small-cell-pole-01, -02 (cropped) | Canister on top, radio shroud, base cabinet |
| Learn: small cells look different city by city (rules set size and colour) | learn | infer | | From the research inference |
| Which is bigger in reach: macro or small cell? | choice (2) | type:small-cell | | Concept only, no numbers |
| Mixed: FR2 / mmWave bands are why small cells exist? | choice (2) | band:n260 etc. | | Link to unit 4: short reach needs many small sites. Only if the link is in the research; otherwise cut. |

### Lesson 4 · Temporary and indoor: COW and DAS (`unit06-l4`)
| Item | Type | Facts | Photo | What it teaches or asks |
|---|---|---|---|---|
| Learn: a COW is a cell tower on a trailer. A COLT is on a vehicle. | learn | type:temporary | site-cow-01 | |
| Photo: what is this? | photo-choice (3) | type:temporary | site-cow-01 | |
| Learn: a satellite dish pointing at the southern sky on a trailer = SatCOW/SatCOLT. FirstNet runs these; FirstNet is AT&T's. | learn | type:temporary | | Mark the "southern sky" detail as inference |
| Learn: DAS = many small antennas inside a stadium or big building, often shared by carriers | learn | type:das | drawing (no photo yet) | Drawing only until a photo is found |
| Which site would a stadium use: DAS or lattice? | choice (2) | type:das | | |
| Who usually pays for a DAS: one carrier or a shared host? | choice (2) | type:das | | "Often a neutral host" |
| Mixed: icon for T-Mobile n41 | choice | carrier_use:n41/tmobile | | Interleaving |

### Checkpoint · Site-type certification (`unit06-check`)
About 15 items, no hints: 8 photo-choice (all 8 site types, **different photos** from the lessons where available); 3 match; 2 choice (concept); 2 mixed from units 1–5. After new photos arrive, swap in unseen ones.

---

## 5. Unit 7: Reading a site

**Goal:** you can say what a sign, a paint job or a sticker tells you, and who rents what.
**Lessons:** 200 ft rule → signs and stickers → owner versus carrier, plus a checkpoint.

### Lesson 1 · The 200 ft rule (`unit07-l1`)
| Item | Type | Facts | Photo | What it teaches or asks |
|---|---|---|---|---|
| Learn: above 200 ft (60.96 m) a tower must be registered with the FCC (ASR) and normally painted or lit by FAA rules | learn | rule:asr-200ft, rule:faa-marking | drawing: 200 ft line | CURRENT, A grade; as-of date shown |
| Learn: so orange-and-white paint or lights means very likely over 200 ft | learn | infer:paint-lights | | Labelled "likely", near airports it can be shorter |
| Choice: a tall tower with red lights. Over or under 200 ft? | choice (2) | infer | drawing | "Very likely over" |
| Choice: do all towers over 200 ft need a registration? | choice (2) | rule:asr-200ft | | Yes (or near an airport, at any height) |
| Photo tap: find the sign that gives the registration number | tap-the-clue | rule:asr-sign | site-sign-01 | **New type, v0.8** |
| Choice: where must the ASR number be posted? | choice (3) | rule:asr-sign | | Near the base, visible to the public |
| Mixed: tower type in a photo | photo-choice | | | Interleaving from unit 6 |

### Lesson 2 · Signs and stickers (`unit07-l2`)
| Item | Type | Facts | Photo | What it teaches or asks |
|---|---|---|---|---|
| Learn: base signs: ASR number, RF hazard, no trespassing | learn | sign:rf-warning | site-sign-01 | Grade C, wording "typical" |
| Photo tap: find the RF warning sign | tap-the-clue | sign:rf-warning | site-sign-01 | **New type** |
| Choice: what does an RF warning sign tell you? | choice (3) | sign:rf-warning | | Radio waves are strong near the antennas. It does not name a carrier. |
| Learn: the sign with a phone number names the **owner**, not always the carrier | learn | owner:noc | | Never show or quiz the number |
| Choice: sign says "American Tower". Who owns the structure? | choice (2) | owner:tower-companies | site-tower-02 | |
| Mixed: stealth or not? | photo-choice | | | |

### Lesson 3 · Owner versus carrier (`unit07-l3`)
| Item | Type | Facts | Photo | What it teaches or asks |
|---|---|---|---|---|
| Learn: a tower company owns the tower and rents space (heights) to several carriers | learn | owner:tower-companies | site-tower-02 | |
| Choice: tower owner and carrier: same thing? | choice (2) | owner | | No |
| Learn: the carrier's own sticker counts most; the equipment brand counts least | learn | PRD rule | | Chain of evidence |
| Order the evidence: sticker, permit record, radio brand | order | | | By strength (PRD rule) |
| Tap: find the carrier sticker on the cabinet (when a photo is found) | tap-the-clue | | none yet | **Waits for a photo.** Until then cut. |
| Mixed: carrier for n71 | choice | carrier_use:n71/tmobile | | |

### Checkpoint · Reading-a-site certification (`unit07-check`)
About 12 items, no hints: 3 on the 200 ft rule; 3 on signs; 3 on owner versus carrier; 3 mixed from units 4–6.

---

## 6. Every fact units 6–7 use, and how

| Fact | Status today | Used as |
|---|---|---|
| `rule:*` (A grade) | to be added (CURRENT, from FCC/FAA sources) | Normal questions |
| `type:*` looks (B/C) | to be added (CURRENT, grade shown) | Learn cards and photo questions; no numbers |
| `infer:paint-lights` | to be added, labelled `inference` | "very likely" questions only |
| `sign:*`, `owner:*` | to be added | Learn and tap questions; **never phone numbers** |
| 18 photos in `credits.yaml` | licence-read, eye-checked | Photo questions after download |
| site-tower-01, small-cell-pole-02 | need a crop (visible plates) | Cropped first |
| lattice, guyed, DAS, monopalm, strand-mount, carrier sticker photos | **missing** | Drawings now; photo hunt in T26 |

---

## 7. What the next chats need to build (hand-off list)

**Data (small, Medium):** `content/tools/build_sites.py` and `content/sites.json` (section 3), a `site:` fact kind in `check_content.py` with the same status/date/source rules and tests.

**Photos (T26, continues):** crop the two plates; find clear lattice, guyed, DAS photos; download-and-resize step (a machine where Commons answers).

**App (Medium):**
- `photo-choice` question type (photo above choices, credit line, outline in feedback).
- `tap-the-clue` question type (tap on a photo; correct area is a rectangle stored with the question; wrong taps show where it was).
- Photo asset loading and credits display. Unit tests plus a click test.
- Drawings: Claude draws SVGs for lattice, guyed, DAS, and the 200 ft line.

**Lessons (Medium):** unit 6 (4 lessons + checkpoint), then unit 7 (3 lessons + checkpoint). Time each with `content/tools/lesson_timing.py`; run `check_content.py`; lock IDs.

---

## 8. Decisions made here (to add to `docs/DECISIONS.md` when the owner reads this)

- **F1:** Site facts get their own data file (`content/sites.json`) with the same status/date/source rules as bands.
- **F2:** Only grade A facts carry numbers (200 ft, ASR rules). Grade B/C facts are used for looks and concepts only.
- **F3:** The "paint or lights means over 200 ft" idea is taught as "very likely", never "always".
- **F4:** Phone numbers on signs are never shown or quizzed.
- **F5:** Lattice and guyed lessons start with Claude's drawings until real photos are found.

## 9. Open design points (none block planning)

- Is site-tower-02 really lattice? Check by eye when it is downloaded (the note says "US tower with several carriers").
- "Order by how hidden" (unit 6 lesson 2) may be too subjective; cut if so.
- The unit 6 lesson 3 link from small cells to mmWave needs a source; cut if there isn't one.

## 10. Questions for you (none of these block the work)

1. **Is it OK that lattice and guyed start as drawings?** My suggestion: yes, and swap in photos when found.
2. **Is unit 7 at 3 lessons plus a checkpoint OK?** The "carrier sticker" lesson step waits for a photo. My suggestion: yes.
