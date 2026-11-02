# 🔧 Units 8–9 design: hardware, and cell IDs

**Status:** DRAFT v1 (plan only, no lessons written yet). Same pattern as `units-1-3.md`, `units-4-5.md` and `units-6-7.md`.
**Written:** 2026-11-02 by a robot run (Sonnet, Medium effort), first part of task T36.
**Built from:** `docs/PRD.md` (section 4a), `docs/research/notes/vendors_and_cells.md` (questions 2, 3, 4, 5, 6; evidence tags [P] primary, [T] trade press, [W] reseller/web, [C] community), `content/bands.json`, `content/sites.json`.

---

## In simple words

- **Unit 8, "Hardware":** you learn to tell the three kinds of boxes on a tower apart: the long flat **antenna panel** (just a plastic cover with cables), the small finned **radio box** (the part that makes the signal), and the big heavy **massive MIMO box** (radio and antennas in one). You also learn to count cable ports, and to read a model name like "AIR 6449 B41".
- **Unit 9, "Cell IDs":** you learn what the numbers on a phone's test screen mean: the big cell number, the tower number hidden inside it, the sector, the channel number (which tells you the band), and the "PCI". At the end you decode a made-up screen, like a real field test.
- **Big catch 1:** the research found very little about what each brand's boxes *look* like (colours, fins, logos). So unit 8 teaches **shape and ports**, which are sourced, and model-name **decoding**, which is sourced. It does **not** teach "Ericsson boxes are blue" or similar.
- **Big catch 2:** US carriers' ID habits (which sector number means which band) come from forum posts only. They are taught as "community pattern, may change", never as a rule, and not quizzed as hard facts. The maths (tower number = cell number ÷ 256) and the channel-number-to-band tables are the solid part.
- **Big catch 3:** there are no photos of equipment (T26 found one 5G equipment shot). Unit 8 starts with **Claude's drawings** (a diagram, not a photo of a real model), as in unit 6.

---

## 1. What I found (and what it changes)

| # | Finding | What it changes |
|---|---|---|
| H1 | **No hardware or ID data files exist.** `CLAUDE.md` says facts come only from a data file in `content/`. | Two new files (section 3): `content/hardware.json` and `content/cell-ids.json`, built by scripts, same status/date/source rules. |
| H2 | **Model-name decoding is sourced and teachable:** Ericsson AIR 64xx = 64 branches (64T64R), 32xx = 32 branches; suffix names a band (B41 = 2.5 GHz, B77D = C-band, B48 = CBRS); Radio 4449 B5/B13 shows two bands in one name. Sources are filings and FCC pages [P], but "the first two digits track the branch count" is the researcher's inference (medium). | Taught as "a pattern, not a law". Questions only use the model examples from the research, never a guess about a model not in it. |
| H3 | **Carrier-to-model ties are filings [P]:** AIR 6449 B41 at T-Mobile; AIR 6449 B77D at AT&T and Verizon; Samsung MT6407-77A and RF4440d-13A at Verizon; Radio 4480 B71+B85 on a T-Mobile notice. One CT filing is ambiguous (the AT&T/B71 one). | Each is its own row with a source. The ambiguous one is UNVERIFIED and not quizzed. |
| H4 | **Passive vs radio vs massive MIMO (the lesson quick-sort)** is sourced for the ports (hexport = 6 connectors, NNHH = 8) and for "massive MIMO boxes contain their own array" [P/W], but "no jumpers means active antenna" is an inference. | Taught with "usually". |
| H5 | **Weights:** AIR 6449 about 35–38 kg [P]; Habrok 64 = 24 kg [P/T]; AIR 3268 about 12 kg [T]. One reseller says 46 kg for the B41 version, which conflicts. | Weights are **not quizzed** (conflict). Used once in a learn card as "very roughly 25 to 40 kg for a big one, about 12 for a small one", labelled approximate. |
| H6 | **Cell types:** 3GPP classes with power caps are sourced [P/T]: macro has no cap; micro 38 dBm; pico 24 dBm; home/femto 20 dBm (LTE only). | Taught in plain units (about 6 W, 0.25 W, 0.1 W) rounded; only the *order* (macro > micro > pico > femto) and "femto is only in LTE" are quizzed as facts. |
| H7 | **LTE ID maths is solid:** ECI is 28 bits = 20-bit eNB ID + 8-bit cell ID, so ECI = eNB × 256 + sector [P]. PCI 0–503 for LTE [P/C]. | These become CURRENT rows. The worked example (eNB 102006, sector 2 → 26,113,538) is verified arithmetic in the research and is rechecked by a script test. |
| H8 | **NR ID maths is solid but has a catch:** the gNB ID is 22 to 32 bits, chosen by the carrier [P]; **US carriers' choices were not found.** The same NCI decodes to two different sites depending on the assumed length. | Taught as "the screen doesn't say; the app asks you which length". The decoding drill always **states the bit length**. No US carrier length is ever taught. |
| H9 | **Channel numbers (EARFCN):** only B12, B13, B66, B71 ranges have a source with a conflict on the B71 uplink range. The research lists other DL ranges (B2, B4, B5, B14, B17, B25, B30, B41, B48) as "not sourced this session, verify against 3GPP". | **A new dependency on T07 (3GPP check).** Until T07 is done, EARFCN questions use only B12, B13, B66, B71 downlink ranges, and the one worked formula F = F_low + 0.1 × (N − N_offset). The others wait. |
| H10 | **Carrier sector-ID conventions are forum-only [C]:** Verizon (tens digit = sector, ones digit = layer) has two agreeing sources (medium); T-Mobile (B66 1–10, B2 11–20, B71 61–70) one source; AT&T is dated 2014–16 (low). | Taught in **one** learn card as "a community pattern" with a "may have changed" note. Verizon and T-Mobile only. **No AT&T. No quiz on the numbers** (rule G3 below). |
| H11 | **The phone screens:** iPhone Field Test (`*3001#12345#*`) labels vary by iOS version and were **not verified on a real screen**; Android `*#*#4636#*#*` shows EARFCN; Samsung `*#0011#` varies. | The mock screen in unit 9 is labelled **"a practice screen, not a real one"**. It uses the field names the research lists (eNB, cell, PCI, TAC, EARFCN, band, RSRP). Real screenshots from the owner can replace it later (T-row). |
| H12 | **Vendor from IDs is low confidence** (CellMapper and LTE Discovery "just make a best guess"). | Taught as "don't trust a vendor label from a number"; fits the PRD rule that the equipment brand counts least. |
| H13 | **No equipment photos** (T26 found one 5G equipment shot; the research says FCC ID photo exhibits and the Ericsson photo library are the routes, licence unchecked). | Unit 8 uses drawings. A later task (T49, section 8) checks whether FCC exhibit photos can be used (they are probably not free to reuse, so assume no). |

---

## 2. Rules (inherited from the other plans; decisions D1 to D7, F1 to F5)

- Same lesson shape: 12–15 steps, 3–5 minutes, a no-hints checkpoint at the end of each unit. Time each with `content/tools/lesson_timing.py`.
- Chain of evidence (PRD): **the carrier's sticker counts most, the equipment brand counts least.** Unit 8 repeats this: a model name tells you what a box *is*, not always who runs it.
- New IDs: `unit08`, `unit08-l1` … `unit08-check`, `unit09`, … Question IDs `u8-<topic>-<nn>`, `u9-<topic>-<nn>`.
- Mixed-review steps pull from units 1–7 (bands, site types).
- Drawings are labelled "drawing" and never used as "unseen photo" questions (CLAUDE.md: no AI photos for identification).
- Numbers in drills are **made-up examples** marked as such, never presented as a real site's data (no real eNB or cell ID is shown). The research's worked example uses 102006 and PCI-free numbers; the app's examples change the numbers and keep the same maths.

---

## 3. The data files (plan)

### `content/hardware.json` (built by `content/tools/build_hardware.py`)
Same fields as `sites.json`: `id`, `kind`, `text`, `status`, `as_of`, `source`, `grade`.

| Row id | What | Grade | Status |
|---|---|---|---|
| `form:passive-panel` | Tall plain cover, no electronics inside, connectors in a row at the bottom | W | CURRENT |
| `form:radio-unit` | A small finned box (RRU/RRH) joined to the panel by short cables ("jumpers") | P/W | CURRENT |
| `form:massive-mimo` | Radio plus an array of 128–192 small antennas in one box (Ericsson AIR, Nokia MAA, Samsung all-in-one); no jumpers to a separate panel (usually) | P | CURRENT (the "usually" is labelled inference) |
| `ports:hexport` | An SBNHH hexport panel has 6 connectors | W | CURRENT |
| `ports:nnhh` | An NNHH panel has 8 connectors: 4 low-band, 4 mid-band | W | CURRENT |
| `ports:ntnr` | A 4T4R band needs 4 antenna ports (the count tells you the "T" and "R") | inference | CURRENT, labelled |
| `ports:panel-length` | Standard panel lengths A=1.3 m, B=2.0 m, C=2.6 m; band letters N = 698–896 MHz, H = 1710–2180 MHz | W | CURRENT |
| `model:air-64xx` | Ericsson AIR 64xx = 64T64R; 32xx = 32T32R | P/inference | CURRENT, labelled pattern |
| `model:air-suffix` | B41 = 2.5 GHz TDD; B77D = C-band 3.7–3.98 GHz; B48 = CBRS | P | CURRENT |
| `model:radio-dual` | Ericsson dual-band radios list both bands in the name (4449 B5/B13, 4480 B71+B85, 8843 B2 B66A) | P | CURRENT |
| `model:nokia-aehc` | Nokia AEHC = AirScale MAA 64T64R 192AE B41 | P | CURRENT |
| `model:samsung-suffix` | Samsung: -77A → n77, -13A → B13 (with B5); prefix MT/RF/RT | hypothesis | **UNVERIFIED** (not quizzed) |
| `use:air6449-b41-tmobile` | AIR 6449 B41 is a T-Mobile n41 radio | P | CURRENT (filings) |
| `use:air6449-b77d-attvz` | AIR 6449 B77D is used for C-band by AT&T and Verizon | P | CURRENT |
| `use:samsung-verizon` | Samsung MT6407-77A and RF4440d-13A at Verizon | P | CURRENT |
| `use:4480-b71-b85` | Radio 4480 B71+B85 on a T-Mobile notice | P | CURRENT only for T-Mobile (the ambiguous AT&T one is not used) |
| `weight:massive-mimo` | Very roughly 12–40 kg depending on size | T | CURRENT, **never quizzed** |

**Left out on purpose:** colours, fin patterns, logos (no source, H-gap); Nokia Flexi cues (forum only); fans as a Nokia sign (contested analyst claim); 8T8R looks (unsourced); AIR 3246, Radio 4460, 8863 bands (not found); the Nokia AHFIG/AHLOA/AEQE codes (not found); JMA, Galtronics, RFS, Kathrein families (not found).

### `content/cell-ids.json` (built by `content/tools/build_cell_ids.py`)

| Row id | What | Grade | Status |
|---|---|---|---|
| `cls:macro-micro-pico-femto` | Wide Area (no cap), Medium Range (≤38 dBm), Local Area (≤24 dBm), Home (≤20 dBm, LTE only) | P/T | CURRENT |
| `cls:sectors` | A site usually has 3 sectors; each carrier/band on each sector is its own cell. cells ≈ sectors × layers | inference + P | CURRENT, labelled |
| `lte:eci` | ECI = 28 bits = 20-bit eNB ID + 8-bit cell ID; ECI = eNB × 256 + cell | P | CURRENT |
| `lte:pci` | PCI is 0–503 (168 groups × 3); reused, so it tells neither site nor band | P/C | CURRENT |
| `lte:earfcn-formula` | F_DL = F_DL_low + 0.1 × (N_DL − N_offset) | P | CURRENT (rechecked by T07 later) |
| `lte:earfcn-b12/b13/b66/b71` | the four downlink ranges in the research | P | CURRENT (B71 uplink excluded: sources disagree) |
| `lte:earfcn-other` | B2, B4, B5, B14, B17, B25, B30, B41, B48 ranges | none | **UNVERIFIED until T07** |
| `nr:nci` | NCI is 36 bits; gNB ID is the leftmost 22–32 bits; the rest is the cell ID | P | CURRENT |
| `nr:gnb-length-unknown` | US carriers' gNB ID bit lengths were not found; the length must be given | gap | CURRENT (as a stated gap) |
| `nr:pci` | NR PCI 0–1007 | none (standard, not sourced here) | **UNVERIFIED until T07** |
| `nr:arfcn` | NR-ARFCN maps to frequency by a global raster formula | P | CURRENT, concept only (no formula drills) |
| `us:verizon-pattern` | Verizon: tens digit = sector, ones digit = layer (community) | C (medium, 2 sources) | CURRENT, grade C, **never quizzed on numbers** |
| `us:tmobile-pattern` | T-Mobile: B66 1–10, B2 11–20, B71 61–70 (community, with exceptions) | C | same |
| `us:vendor-from-id` | A vendor label from an ID pattern is a guess | C | CURRENT |
| `tool:field-test-iphone` | Dial `*3001#12345#*`; menus vary by iOS version; shows NCI and PCI | W | CURRENT, labelled "may differ on your phone" |
| `tool:android-4636` | `*#*#4636#*#*` shows the EARFCN next to the serving cell | W/C | CURRENT, "may be blocked on some phones" |

**Left out on purpose:** AT&T sector conventions (2014–16, low); anything about SSB beams and GSCN (too deep for a beginner, no US tie); timing advance as a distance rule (only a caveat, not a source we trust yet); real tower IDs near the owner (that's the Bonus unit).

---

## 4. Unit 8: Hardware

**Goal:** from a drawing (later a photo) you can say which of the three box types it is, count ports, and read a model name.
**Lessons:** three kinds of boxes → count the ports → decode a model name → who uses which model (carrier link), plus a checkpoint.

### Lesson 1 · Three kinds of boxes (`unit08-l1`)
| Item | Type | Facts | Picture | What it teaches or asks |
|---|---|---|---|---|
| Learn: the panel = a long plastic cover with only cables inside | learn | form:passive-panel | drawing | |
| Learn: the radio box = a small finned box that makes the signal; cables run to the panel | learn | form:radio-unit | drawing | |
| Learn: the massive MIMO box = radio and many tiny antennas in one big box | learn | form:massive-mimo | drawing | |
| Which one has no electronics inside? | choice (3) | form:passive-panel | drawing | |
| Which one has a row of connectors at the bottom? | choice (3) | form:passive-panel | drawing | |
| Which box has its own antennas inside, so no cables to a panel (usually)? | choice (3) | form:massive-mimo | drawing | The "usually" shows in the feedback |
| Match: 3 drawings ↔ 3 names | match | the 3 | drawings | |
| Which one is the **heaviest** class? | choice (3) | form:massive-mimo | | Concept only; no kg figures asked |
| Mixed: which site type holds these boxes best? | choice (3) | type:monopole etc. | | Link to unit 6 |
| Mixed: n41 is a capacity band; which box serves it? | choice | band:n41 + form:massive-mimo | | Link to unit 4: "capacity bands use massive MIMO" is labelled inference (use only if the research backs it: it says "serve TDD mid-band (n41, n77, CBRS)", so allowed) |

### Lesson 2 · Count the ports (`unit08-l2`)
| Item | Type | Facts | Picture | What it teaches or asks |
|---|---|---|---|---|
| Learn: "4T4R" = 4 sending and 4 receiving paths; a 4T4R band needs 4 ports | learn | ports:ntnr | drawing | |
| Learn: a hexport panel has 6 ports; an NNHH panel has 8 | learn | ports:hexport, ports:nnhh | drawing | |
| Tap the clue: tap the row of connectors | tap-the-clue | ports | drawing | Uses the existing tap type |
| Count: this panel shows 8 ports (4 low + 4 mid). How many low-band ports? | choice (3) | ports:nnhh | drawing | |
| Choice: 8 ports, 4 for low-band: 4T4R low-band, true or false? | choice (2) | ports:ntnr | | Labelled inference |
| Learn: standard lengths A = 1.3 m, B = 2.0 m, C = 2.6 m | learn | ports:panel-length | drawing | |
| Type the number: a "C" panel is how many metres long? | number | ports:panel-length | | 2.6 (small allowed error) |
| Learn: N means low band (698–896 MHz), H means mid band (1710–2180 MHz) | learn | ports:panel-length + bands | | Cross-check the band ranges against `bands.json` (a test) |
| Mixed: N and H, which letter is low band? | choice (2) | | | |
| Mixed: is 700 MHz low, mid or high band? | choice (3) | band tier | | Interleaving from unit 1 |

### Lesson 3 · Decode a model name (`unit08-l3`)
| Item | Type | Facts | Picture | What it teaches or asks |
|---|---|---|---|---|
| Learn: take "AIR 6449 B41": AIR = antenna-integrated radio, 64 = 64 paths, B41 = band 41 | learn | model:air-64xx, air-suffix | | "Pattern, not a law" |
| Learn: "Radio 4449 B5/B13": two bands in one name | learn | model:radio-dual | | |
| Choice: AIR 6449 B41, which band? | choice (3) | model:air-suffix | | |
| Choice: B77D is which spectrum? | choice (3) | model:air-suffix | | C-band 3.7–3.98 GHz; checked against `bands.json` |
| Choice: AIR 3268, how many paths? | choice (3) | model:air-64xx | | 32 |
| Match: B41, B77D, B48 ↔ 2.5 GHz, C-band, CBRS | match | model:air-suffix | | |
| Choice: Radio 4480 B71+B85, one band or two? | choice (2) | model:radio-dual | | Two |
| Learn: Nokia's "AEHC" is an AirScale MAA 64T64R B41 | learn | model:nokia-aehc | | |
| Order the boxes from fewest to most paths: AIR 3268, AIR 6449 (a 4T4R radio first) | order | | | Only if three examples all have sources |
| Mixed: B41 is which band's name (n41)? | choice | band:n41 | | Link back |

### Lesson 4 · Who uses which model (`unit08-l4`)
| Item | Type | Facts | Picture | What it teaches or asks |
|---|---|---|---|---|
| Learn: carriers' filings name the radios they install. A filing is a "paper clue". | learn | use:* | | Chain of evidence |
| Choice: AIR 6449 B41 appears in T-Mobile filings. Which band does T-Mobile run on it? | choice (3) | use:air6449-b41-tmobile | | n41 |
| Choice: AIR 6449 B77D is for which spectrum, and which two carriers? | choice (3) | use:air6449-b77d-attvz | | C-band, AT&T and Verizon |
| Choice: Samsung MT6407-77A: which carrier's filings list it? | choice (3) | use:samsung-verizon | | Verizon |
| Scenario: a filing lists AIR 6449 B41; a tower sticker says "Verizon". Which clue wins? | scenario | PRD rule | | The sticker; and a mismatch means "check shared towers" |
| Learn: a radio brand is the weakest clue (a carrier can use several brands) | learn | PRD rule | | |
| Choice: which is stronger evidence: the sticker or the radio brand? | choice (2) | PRD rule | | |
| Mixed: n41 is mostly which carrier's? | choice | carrier_use:n41 | | From `bands.json` |
| Mixed: n77 C-band is which carriers'? | choice | carrier_use:n77 | | From `bands.json`; only the CURRENT rows |

### Checkpoint · Hardware certification (`unit08-check`)
About 15 items, no hints: 4 on the three box types; 3 on ports; 3 on model names; 2 on carrier-model ties; 3 mixed from units 4–7.

---

## 5. Unit 9: Cell IDs

**Goal:** you can say what the big number on a phone's test screen means, find the band from the channel number, and tell a site from a cell from a sector.
**Lessons:** site, sector, cell (and cell sizes) → the big cell number → channel number to band → decode a practice screen, plus a checkpoint.

### Lesson 1 · Site, sector, cell (`unit09-l1`)
| Item | Type | Facts | What it teaches or asks |
|---|---|---|---|
| Learn: a site is the place; a sector is one direction (about a third of a circle); a cell is one band on one sector | learn | cls:sectors | Link back: "macro" from unit 6 lesson 1 |
| Choice: a site has 3 sectors with 2 bands each. How many cells? | choice (3) | cls:sectors | 6 (the "≈" kept in the learn card) |
| Type the number: 3 sectors × 4 bands = ? cells | number | cls:sectors | 12 |
| Learn: cell sizes: macro (big tower, widest), micro, pico (inside a mall), femto (in a home) | learn | cls:macro-micro-pico-femto | Plain words, no dBm |
| Order: macro, micro, pico, femto by size | order | cls:macro-micro-pico-femto | Wide to small |
| Choice: which is only in LTE, not in 5G? | choice (4) | cls:macro-micro-pico-femto | Femto (Home class) |
| Learn: one site can show as several eNBs (e.g. a second ID for mid-band) | learn | us:verizon-pattern | Labelled "community pattern" |
| Mixed: which site type usually holds a macro cell? | choice (3) | type:* | Link to unit 6 |
| Mixed: a small cell on a pole is micro or macro? | choice (2) | type:small-cell | |

### Lesson 2 · The big cell number: eNB × 256 + cell (`unit09-l2`)
| Item | Type | Facts | What it teaches or asks |
|---|---|---|---|
| Learn: the cell number (ECI) hides two numbers: the tower and the sector | learn | lte:eci | Everyday comparison: a phone number with an area code |
| Learn: ECI ÷ 256 = eNB; the leftover = the cell | learn | lte:eci | |
| Type the number: ECI 25,600 + 5 → eNB? | number | lte:eci | Made-up numbers |
| Type the number: eNB 1000, cell 3 → ECI? | number | lte:eci | |
| Type the number: decode 26,113,538 | number | lte:eci | The research's worked example (102006, 2) shown once as the example, then new numbers |
| Choice: PCI 0–503: does the same PCI mean the same site? | choice (2) | lte:pci | No: reused |
| Choice: which number tells you the band: ECI, PCI or EARFCN? | choice (3) | lte:earfcn-formula | EARFCN |
| Learn: 5G: the gNB ID can use 22 to 32 bits; the screen doesn't say | learn | nr:nci, nr:gnb-length-unknown | |
| Choice: the same 5G cell number can decode to two different sites. Why? | choice (3) | nr:gnb-length-unknown | Because the carrier picks how many bits belong to the tower |
| Type the number: NCI 417,816,578 with a 24-bit gNB ID → gNB? | number | nr:nci | 102006; made-up variant numbers in practice items |
| Learn: a vendor label from a number is a guess | learn | us:vendor-from-id | |
| Mixed: the equipment brand counts least; the sticker counts most | choice | PRD rule | |

### Lesson 3 · Channel number to band (`unit09-l3`)
| Item | Type | Facts | What it teaches or asks |
|---|---|---|---|
| Learn: the channel number (EARFCN) tells the exact frequency and band | learn | lte:earfcn-formula | |
| Learn card: the four bands we can check: B12 5010–5179, B13 5180–5279, B66 66436–67335, B71 68586–68935 | learn | lte:earfcn-b* | Range table shown once; the numbers match `bands.json` (a test) |
| Choice: EARFCN 5200 → which band? | choice (4) | lte:earfcn-b13 | B13 |
| Choice: EARFCN 68700 → which band? | choice (4) | lte:earfcn-b71 | B71 |
| Choice: EARFCN 66800 → which band? | choice (4) | lte:earfcn-b66 | B66 |
| Type the number: B66 EARFCN 66786 → frequency in MHz | number | lte:earfcn-formula | 2145 (the research's worked example) |
| Mixed: B71 is which carrier's band? | choice | carrier_use:b71 | From `bands.json` |
| Mixed: B13 is whose? | choice | carrier_use:b13 | **Only when T47 finishes** (that row is UNVERIFIED today); else cut |
| Match: EARFCN ranges to band names | match | lte:earfcn-b* | |
| Learn (labelled inference): a big channel number does not mean higher frequency across bands | learn | | Cut if it can't be sourced |

### Lesson 4 · The practice screen (`unit09-l4`)
| Item | Type | Facts | What it teaches or asks |
|---|---|---|---|
| Learn: your phone can show these numbers in a hidden test screen. Names and steps differ by phone. | learn | tool:* | Shows `*3001#12345#*` and `*#*#4636#*#*` as "may be blocked on yours"; the lesson never tells the owner to change settings |
| A mock screen card (new): fields eNB, cell, PCI, TAC, EARFCN, RSRP | learn | tool:* | Labelled "practice screen" (H11) |
| Tap the clue: tap the channel number on the screen | tap-the-clue | tool:* | Uses the tap type on a drawn screen |
| Tap the clue: tap the number that holds the tower number | tap-the-clue | lte:eci | |
| Scenario: screen shows ECI, EARFCN 66800, PCI 211. Which band? Which tower number? Does the PCI tell you the site? | scenario | lte:eci, earfcn, pci | The existing multi-clue scenario type |
| Type the number: the screen shows ECI 51,200 + 7. Cell ID? | number | lte:eci | |
| Learn: RSRP is "how loud" the signal is (more negative = weaker) | learn | | **Needs a source before it goes in**; if not, cut and add a glossary line only |
| Mixed: which unit 7 clue beats any ID on the screen? | choice | PRD rule | The sticker |

### Checkpoint · Cell ID certification (`unit09-check`)
About 15 items, no hints: 4 sector/cell/size; 4 decode ECI or NCI (stated bit length); 3 EARFCN to band; 2 the practice screen; 2 mixed from units 6–8.

---

## 6. Every fact units 8–9 use, and how

| Fact group | Status today | Used as |
|---|---|---|
| `form:*`, `ports:*` | to be added (CURRENT, grade W/P) | Learn cards, choice and tap questions; drawings |
| `model:*` (Ericsson, Nokia) | to be added (CURRENT, with the pattern labelled) | Decoding questions on the research's own examples only |
| `model:samsung-suffix` | to be added as UNVERIFIED | **Never quizzed** |
| `use:*` | to be added (CURRENT from filings) | Carrier-model questions; ambiguous one not used |
| `weight:*` | to be added (grade T) | Never quizzed |
| `cls:*`, `lte:eci`, `lte:pci`, `nr:nci` | to be added (CURRENT) | Normal questions and maths drills with made-up numbers |
| `lte:earfcn-b12/b13/b66/b71` | to be added (CURRENT) | Questions; **must match** `bands.json` frequency ranges (test) |
| `lte:earfcn-other`, `nr:pci` | to be added (**UNVERIFIED until T07**) | Not quizzed until T07 |
| `us:*-pattern` | to be added (CURRENT, grade C) | One learn card each; **never quizzed** (rule G3) |
| `tool:*` | to be added (CURRENT, "may differ") | Learn cards and the practice screen; labelled |
| band and carrier rows | `content/bands.json` | Mixed review only; B13/B14/B12/B17/B5 carrier rows are UNVERIFIED, so excluded until T47 |

---

## 7. What the next chats need to build (hand-off list)

**Data (small, Medium):** `build_hardware.py` + `content/hardware.json`, `build_cell_ids.py` + `content/cell-ids.json` (sections 3), plus `hardware:` and `cellid:` fact kinds in `check_content.py` with the same status/date/source rules, tests, and two cross-check tests: the EARFCN ranges and the band letters N and H against `bands.json`; and the worked arithmetic (eNB × 256 + cell; NCI split; B66 frequency) recomputed in a script test.

**Drawings (Claude draws SVGs, Medium):** passive panel, radio unit, massive MIMO box (three simple side-by-side drawings with connectors drawn); an 8-port panel; a hexport panel; the mock phone test screen (drawn text, not a real screenshot). Labelled "drawing", credited in `credits.yaml` as made by Claude, same as the lattice/guyed/DAS drawings.

**App (Medium):**
- A `screen` mock card (learn step): a picture of a phone screen with named boxes that `tap-the-clue` can use. May reuse the existing picture type with `alt`; probably **no new question type is needed**: all question types listed (learn, choice, number, match, order, tap-the-clue, scenario) exist. Check this first; only build something if a gap shows.
- **A decode-drill generator:** to give each practice a fresh made-up number (research: "make the bit length a configurable lesson parameter"). Optional for v1: fixed numbers pass first, generated numbers later (keeps question IDs stable).
- Unit tests for the new template fields; one click test through a unit 8 lesson and a unit 9 lesson.

**Lessons (Medium):** unit 8 (4 lessons + checkpoint) then unit 9 (4 lessons + checkpoint); time each; run `check_content.py`; lock IDs.

**Photos:** none needed. If FCC exhibit photos are found to be reusable (see T49 below), they replace drawings later.

---

## 8. Decisions made here (to add to `docs/DECISIONS.md` when the owner reads this)

- **G1:** Hardware and cell-ID facts get two data files (`content/hardware.json`, `content/cell-ids.json`), same status/date/source rules as bands and sites.
- **G2:** Hardware teaching is by **shape, ports and model-name decoding**, not by colour, fins or logo (no source). Brand is the weakest clue.
- **G3:** Carrier **sector-ID patterns** (Verizon, T-Mobile) are shown once as "community pattern, may change" and never quizzed. AT&T's is left out (dated, low confidence).
- **G4:** The 5G gNB ID bit length is always **stated** in a drill; no US carrier length is taught (not found).
- **G5:** Only B12, B13, B66, B71 EARFCN ranges are quizzed until T07 checks the rest against 3GPP.
- **G6:** The phone test screen is a **labelled practice screen** drawn by Claude, until real screenshots exist.
- **G7:** Weights and the Samsung model-name suffix rule are never quizzed (conflicting source; unverified hypothesis).

## 9. Open design points (none block planning)

- Does "capacity bands use massive MIMO" (unit 8 lesson 1) go beyond the research? It says massive MIMO boxes "serve TDD mid-band (n41, n77, CBRS)". I allow it as stated, not as "always".
- The RSRP learn card (unit 9 lesson 4) has no source in the research notes. Cut, or add a short source check first.
- "Order by path count" (unit 8 lesson 3) needs three sourced examples: AIR 3268 (32), AIR 6449 (64) and one 4T4R radio. The RF4440d-13A (4T4R, B13/B5) from Samsung works.
- Is the mock screen good enough as a practice, or should it wait for the owner's own phone screenshot (the iPhone later)?
- T47 (carrier facts) and T07 (3GPP check) both help units 9 lesson 3 and the carrier questions. Neither blocks writing most of the lessons.

## 10. Questions for you (none of these block the work)

1. **Is it OK that unit 8 uses drawings, not photos, and teaches shape and ports, not brand colours?** My suggestion: yes. The research found no sourced colour or logo cues, and I won't make some up.
2. **When your phone is free (the iPhone later), will you send one screenshot of its Field Test screen?** My suggestion: yes, so the practice screen can match a real one. This is a small "later" row (T49), not a blocker.
3. **Are you OK with the carrier ID patterns being only a "may have changed" note, not quizzed?** My suggestion: yes. They come from forum posts, so a quiz would teach shaky facts.
