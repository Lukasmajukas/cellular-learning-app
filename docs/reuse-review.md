# ♻️ Reuse review: what we can borrow from your other projects (T03)

**Date:** 2026-10-31 · **Status:** DRAFT for the owner to read · **Feeds into:** T04 (the plan, `docs/PRD.md`)

Repos checked (newest commit on each): CellAtlas `d7b3b62`, bandmon `81ad6af`, SpectrumScope `2fca4ed`, TowerScope `4a315ab`, NetScopeiOS `4b49f6b`, NetScopeMac `634276f`.

---

## In simple words

Think of your six old projects as six toolboxes in the garage. We opened every one to see what fits the new app.

- **Almost no code can be reused.** Five of the six are written in Swift, Apple's language for iPhones and Macs. The new app is a Windows desktop app built with web tools, so Swift code is like a key for a different lock.
- **A lot of facts, examples and ideas can be reused.** The best finds:
  1. **SpectrumScope** has real cell sites around South Hadley and Western MA, including antennas hidden in water tanks, a school chimney and a library steeple. Each one comes with its proof, such as a town permit or an FCC record. That's ready-made material for "spot the site" lessons.
  2. **bandmon** recorded what a real iPhone saw: band, channel number, carrier code. That's a real "read your phone's secret screen" example. It also has a channel-number→band table that matches our research notes.
  3. **TowerScope** is the only one built with web tools, the same kind the new app uses. Its pulsing-tower animations and its "how far away is the tower?" maths can inspire lesson animations.
- **Watch out:** some facts in the old projects are wrong or out of date (details below). Nothing goes into the app until it has been checked and tagged with a status, a date and a source, as the rules in `CLAUDE.md` require.

---

## Quick verdict per repo

| Repo | What it is | Language | Reuse value | What to take |
|---|---|---|---|---|
| **SpectrumScope** | iPhone map of T-Mobile / Verizon / AT&T towers and spectrum, focused on South Hadley, MA | Swift + one JSON data file | ⭐⭐⭐ High | Real local sites and their evidence, site-type examples, plain-English band explainers, the "all content in one data file" design, the list of verified vs refuted claims |
| **bandmon** | Mac tool that reads an iPhone's hidden cell log over USB and decodes bands, channels and carriers | Python + Swift | ⭐⭐⭐ High | A real phone capture for lessons, the channel-number→band table and formula (as a cross-check), a starter carrier-code list (needs fixing), "gotcha" facts |
| **TowerScope** | Web page in a Mac/iPhone shell that estimates where a tower is from signal strength | HTML/CSS/JavaScript + Swift | ⭐⭐ Medium | Tower-pulse and ripple animations (style ideas), the signal-strength→distance model as an interactive demo idea |
| **NetScopeiOS** | iPhone speed test and Wi-Fi/cellular info app | Swift | ⭐ Low | Writing style of its "Learn" explainers, the animated speed-gauge idea |
| **CellAtlas** | iPhone + Mac viewer for cellular research packs | Swift | ⭐ Low (empty so far) | Its data-honesty fields (`confidence`, `verification`, `coordPrecision`) as a model for our data file. The research itself lives in a separate `cellatlas-data` repo we can't see (see questions) |
| **NetScopeMac** | Mac Wi-Fi and home-network scanner | Python + Swift | ✖ None | Nothing cellular (it's all Wi-Fi and home devices) |

---

## 1. SpectrumScope: the best source of lesson material

**Files:** `SpectrumScope/Resources/carriers.json` (the data, 81 KB, as of 2026-06-23, v1.6), `docs/SOUTH_HADLEY.md`, `docs/RESEARCH.md`, `tools/gen_seed.py`.

### What to reuse

**a) Real sites for "spot the site" and "local field trip" lessons.** 125 sites, by type:

| Type | Count | Lesson use |
|---|---|---|
| tower (tower-company structure) | 60 | "Who owns the tower vs who rents space on it" |
| macro (carrier's own FCC-registered tower) | 45 | Classic tower spotting |
| watertank | 7 | Stealth sites |
| rooftop | 6 | Stealth sites |
| smallcell | 3 | Representative only, not real locations |
| proposed | 2 | "How new towers get approved" (permits) |
| chimney | 1 | Stealth site: South Hadley High School smokestack (T-Mobile) |
| steeple | 1 | Stealth site: Williston Library steeple, Mount Holyoke (T-Mobile) |

Good teaching stories already researched in `SOUTH_HADLEY.md`:
- **The ASR misses most sites.** The FCC's tall-tower list (ASR) shows only **one** structure in South Hadley. Town permits and FCC licence records reveal many more, mostly hidden.
- **One water tank, three carriers.** The Mulligan Dr and Industrial Dr water tanks each host T-Mobile, Verizon and AT&T, according to permits and FCC licence records.
- **Checking a guess.** "Is Verizon on the high-school chimney?" No: every record shows T-Mobile (ex-metroPCS) and AT&T. That's a real example of evidence beating a hunch.
- **Why a tower got built.** The Hadley St monopole replaced antennas on the Mt. Tom smokestack after it was demolished in 2018.

**b) Real T-Mobile eNB IDs** near South Hadley, with bands (from CellMapper; no coordinates recorded): 344830 (b71), 48384 (b3/12/66/71), 186828 (b12/71), 306751 (b66/71), 881382. These are usable in "decode the ID" exercises.

**c) The way it handles evidence.** It matches our research's order of evidence (carrier sticker → permit → radio label → brand). It also keeps a **refuted-claims list** (for example, "~348 towers in Springfield" was refuted). We should copy that habit.

**d) The design: "all content is data, not code."** The app is a renderer, and editing one JSON file updates everything. That's exactly what we want for `content/`. Every field is optional, so a half-finished edit can't crash the app.

**e) Plain-English band explainers** in `bandReference`. For example, n71: "Low-band: travels far and into buildings. Great coverage, modest speed." Good tone to adapt.

### Caveats (do not copy blindly)
- **Band frequencies in `bandReference` are inconsistent and one is wrong.**
  - **n25 is listed as 1850–1990 MHz.** `band_verification.md` says 1850–1915 up / 1930–1995 down, so the top is **1995**; 1990 is where n2 ends.
  - n71, n5 and B14 show the whole span from the bottom of one direction to the top of the other. n77 shows only the US-used part (3.45–3.98 GHz), not the 3GPP band (3.3–4.2 GHz).
  - Only 9 bands; no n258, n2, n66, n70, n12, B13 and others.
  - **Rule: take the explainer sentences, never the numbers.** Numbers come only from our bands data file.
- **Per-site band lists (58 sites) are mostly assumptions,** not observations. Treat as UNVERIFIED.
- **Carrier spectrum info is as of June 2026,** before some of the 2025–26 deals our research tracked (for example, T-Mobile's 800 MHz sale). `band_verification.md` wins.
- **Small-cell pins are made up on purpose** ("representative"). Never use them as real locations.
- **The app says itself** that per-county MHz numbers and site counts are directional estimates.

---

## 2. bandmon: real phone data and channel maths

**Files:** `bandmon/bandmon` (Python, 1,606 lines; tables at lines 86–245), `native/BandCore.swift`, `sample-capture.log` (1,232 lines), `README.md`.

### What to reuse

**a) A real capture from your iPhone 15 Pro** (`sample-capture.log`, 18 June). Personal details (cell ID, location) are already blanked out as `<private>`. It shows:

| What the phone saw | Lesson |
|---|---|
| LTE **B13**, EARFCN **5230**, PCI 255, network **311/480** | "B13 + 311/480 → this is Verizon" |
| 5G **n25**, NR-ARFCN **391970**, PCI 381, network **310/260**, RedCap | "Turn the channel number into a frequency: 391970 × 0.005 = 1959.85 MHz → n25" |
| Bandwidth `50` on LTE | "LTE counts width in resource blocks: 50 blocks = 10 MHz" |

Real readouts like this beat made-up ones for "read the screen" drills.

**b) Channel-number → band table and formula** (cross-check only, not a source):
- The LTE EARFCN downlink ranges **match our research notes on every band both list**: B2, B4, B5, B12, B13, B14, B17, B25, B30, B41, B48, B66 and B71 (`vendors_and_cells.md` §5).
- The NR-ARFCN formula (5 kHz below 3 GHz, 15 kHz up to 24.25 GHz, 60 kHz above) matches the raster in our notes.
- Both are still second-hand. They become CURRENT only after **T07** checks them against the 3GPP documents.
- **Gaps in its tables:**
  - NR is missing **n258**, which you already know, plus n70, n29, n26, n85, n46 and n262.
  - LTE is missing B70 and B85.

**c) Starter carrier-code (MCC/MNC) list**, which needs checking:
- 310/260 T-Mobile, 311/480 Verizon, 310/410 and 310/280 AT&T.
- **310/120 "Sprint"**: Sprint no longer exists (merged into T-Mobile), so this is HISTORICAL.
- **312/530 "Spectrum"**: probably a mix-up. As far as I know, that code was registered to Sprint, whose legal name was "Sprint Spectrum", not to Charter's Spectrum Mobile. **Needs checking against an official list.**
- **Our research has no carrier-code list at all.** That's a gap for the "which carrier runs a site" topic. I've added task T09 for it.

**d) Gotchas worth teaching:**
- "Band 0" in a log is a placeholder, not a band.
- Values like 32767 mean "no data".
- Band records arrive in bursts, not steadily.
- The phone sometimes stores an LTE channel under the wrong label (`UARFCN`).

### Caveats
- It's a Mac + iPhone tool (libimobiledevice, Apple debug profile). It can't run on Windows and isn't needed by the app. Only its data and knowledge carry over.

---

## 3. TowerScope: the only web-tech code

**File:** `TowerScope/index.html` (861 lines: HTML + CSS + JavaScript in one file).

### What to reuse
- **Animations (style ideas):**
  - `towerPulse`: a tower icon sends out expanding rings, 2.4 s, with a second ring delayed 1.2 s.
  - `rippleA`: a tap ripple.
  - `dashMove`: a moving dashed line, which could show a signal path.
  - These are plain CSS, so they work in Electron or Tauri. They fit our "original radio/tower theme" and are written fresh, not copied from Duolingo.
- **Signal-strength → distance model** (`estDistanceKm`, line 371). It uses a standard path-loss formula: the signal fades with distance and fades faster at higher frequencies (a `20·log10(f/700)` shift).
  - Idea: an interactive "why low band reaches farther" slider. Drag the band from n71 to n77 and watch the coverage circle shrink.
  - The model is rough (the app says so), so use it only to show the idea, never as a fact.

### Caveats
- No band or carrier data inside.
- It talks to outside services (beaconDB, OpenCelliD). The learning app doesn't need them.

---

## 4. NetScopeiOS: writing style only
- Its "Learn" tab explains Wi-Fi in kid-simple words, for example "Channel width is how much of the airwaves your connection uses at once — like lanes on a road." The same comparison works for LTE/5G bandwidth (5 MHz lane vs 100 MHz highway).
- Its animated speed gauge is a nice idea for an XP or progress meter, but it's Swift. We'd rebuild the idea, not reuse the code.
- Wi-Fi bands (2.4/5/6 GHz) are **out of scope** for this app.

## 5. CellAtlas: a pattern, not content
- **The code is only a skeleton** ("Phase 0", 655 lines, no data).
- Its `CLAUDE.md` describes a data format where every site must have a real `source` plus `confidence`, `verification` and `coordPrecision`. A tool (`packctl`) refuses entries without a source.
  - **Suggestion for the PRD:** add `confidence` and `coordPrecision` to our site data, next to our status / as-of date / source.
- The actual research lives in **`cellatlas-data`**, which is **not in your GitHub list**. It may exist only on your Mac (see questions).

## 6. NetScopeMac: nothing to reuse
Wi-Fi networks, home-network devices and speed tests only. No cellular content.

---

## What this means for the plan (T04)

1. **Reuse is data, content and ideas, not code.** The PRD shouldn't count on saving build time from old code. It *can* count on a head start for lesson content: real local sites, a real phone capture, and checked explainers.
2. **The app engine choice is unaffected.** Nothing here favors Electron or Tauri. Both run TowerScope-style HTML/CSS/JS. (TowerScope and NetScopeMac already use the same "web page inside an app window" pattern.)
3. **Content design:** copy SpectrumScope's "one data file drives everything" idea for `content/`. Add CellAtlas's honesty fields and our status / as-of date / source tags.
4. **A "Local field trip" unit is possible:** South Hadley sites as photo-free "where's the antenna?" lessons, using maps, permit evidence and Claude-drawn diagrams. Real photos still need copyright-free sources (T08).
5. **⚠️ You seem to use a Mac and an iPhone 15 Pro too.** Every one of these projects is built for a Mac or an iPhone, and their notes mention "this Mac" and an iPhone 15 Pro. `CLAUDE.md` currently says only "Windows PC". This affects whether the app must also run on a Mac. **Please confirm (T02).**

## Questions for the owner
1. **Do you use a Mac (and an iPhone 15 Pro) as well as the Windows PC?** Your other projects suggest yes. Should the new app also run on the Mac?
2. **Where does `cellatlas-data` live?** It's not on GitHub under your account. If it's on your Mac and has cell-site research, it may be worth adding.
3. **OK to use South Hadley / Western MA sites in lessons?** They're public records, but they show the area you live in or care about. The app is private, so this is just a check.

### Owner's answers (2026-10-31)
1. **Mac and iPhone:** not now (in use elsewhere), but yes in future. → Windows first; keep a Mac version possible.
2. **`cellatlas-data`:** on the Mac. → Review it when the Mac is back (T12).
3. **South Hadley sites in lessons:** yes. → T10 can go ahead after the PRD.

## Facts discipline for anything taken from these repos
- Band numbers: **never** taken from these repos. They come only from `band_verification.md` → `content/` bands file (T06). The repos are used only as a second opinion.
- Site and carrier facts copied over get status **UNVERIFIED**, an as-of date from the source repo (SpectrumScope: 2026-06-23; bandmon capture: 2026-06-18), and the original source (permit number, FCC ASR/ULS ID). They're upgraded only after a re-check.

---

## Extra findings from the duplicate T03 reviews (added 2026-10-31)
Four chats did T03 at the same time (pull requests #2, #3, #4 and #5). Only #5 was merged. The other three found a few things #5 didn't, so they're saved here. Treat every item as a clue to re-check, not a fact.

**Privacy: treat bandmon's `sample-capture.log` as private.**
- The reviews disagree about what's in it. #5 says personal details are blanked out as `<private>`. #4 says the location is blanked, but the real Cell ID and area code are there. #3 says a text search found precise GPS coordinates and SIM account numbers.
- Rule until someone checks: copy nothing from that file, and lessons use made-up ID numbers. Check it before T09 or T10 use bandmon.

**SpectrumScope carrier facts that look out of date** (compared with `docs/research/notes/us_bands.md`):
- It says AT&T's EchoStar deal "adds ~50 MHz of 3.45 GHz". Our notes say about 30 MHz of 3.45 GHz plus about 20 MHz of 600 MHz, closed July 28, 2026. (#3)
- It doesn't list AT&T's 600 MHz. Our notes say AT&T has owned about 20 MHz since July 28, 2026, not switched on yet. (#4)
- A Hadley St tower lists Dish as a fourth operator, from a 2021 town permit. Our notes say Boost traffic moved onto AT&T's network by Nov 15, 2025, so that line is probably stale. (#3)
- It shows n77 as 3.45–3.98 GHz. Those are the pieces US carriers use (3.45–3.55 and 3.70–3.98 GHz), not the band itself (3300–4200 MHz). Lessons should teach both, clearly apart. (#4)

**A correction to one duplicate.** #3 said our notes have no LTE channel-number (EARFCN) ranges, so bandmon's table couldn't be checked. That's wrong: `docs/research/notes/vendors_and_cells.md` §5 has them, and #5's check against them stands.

**Ideas for later tasks**
- **T05 (test build):** copy two CellAtlas habits: a start-up health check (`tools/preflight.sh`), and a self-test mode that reports "OK" or "problem" and exits. Then Claude can prove the app works without seeing a screen. (#3, #4)
- **T06 (bands file):** build a small checker, like CellAtlas's `packctl`, that refuses any row without a status, date and source. SpectrumScope's `verify_new_towers.py` does the same "check before you add" for tower coordinates. (#3)
- **Signal lessons:** TowerScope's signal labels (−80 dBm or better is "Excellent", down to below −110 "Very weak") are that app's own rule of thumb. Mark them UNVERIFIED until we find a source. (#3)
- **Cell ID lessons:** TowerScope explains how to open the iPhone's hidden Field Test screen (dial `*3001#12345#*`) and where to find band, Cell ID and area code (TAC). Menus differ between iPhone models, so check on a real phone first. (#4)
- **Mac version (for the PRD):** without a paid Apple developer account, a Mac app can't be "notarized", so macOS blocks it the first time it opens. The steps to allow it have changed in recent macOS versions, so the PRD should check them. On a Mac, Tauri uses Apple's own browser engine (WebKit), which is a point for Electron. (#2)
- **Old backups:** the `autosave` branch in each of the six repos holds nothing that `main` doesn't. (#3)

**South Hadley sites with their proof** (#4). From SpectrumScope's `docs/SOUTH_HADLEY.md`, as of 2026-06-23. All UNVERIFIED; for T10.

| Site | Type | Who's on it (per the notes) | Proof named in the notes |
|---|---|---|---|
| South Hadley High School, 153 Newton St | Chimney | T-Mobile (was metroPCS), AT&T | Town Planning Board permit |
| 14 Mulligan Dr | Water tank | T-Mobile, Verizon, AT&T | FCC licence records, town permits |
| 8 Industrial Dr | Water tank | AT&T, Verizon, T-Mobile | FCC licence records, town permits |
| Hadley St (Route 47) | Monopole, 150 ft | T-Mobile, Sprint (now T-Mobile), Verizon, Dish (probably stale, see above) | FCC tower registration (ASR) 1309677, permits |
| Williston Library, Mount Holyoke | Steeple | T-Mobile | Town permit |
| Clapp Lab, Mount Holyoke | Rooftop | Verizon | 2015 special permit |

**`cellatlas-data` (for T12):** CellAtlas's notes say it lives at `~/Developer/cellatlas-data` on the Mac. To check: in Finder, press `Cmd + Shift + G`, type `~/Developer/cellatlas-data`, and press Enter. (#4)
