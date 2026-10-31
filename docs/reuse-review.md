# ♻️ Reuse review: what we can borrow from your other projects (T03)

**Date:** 2026-10-31 · **Checked:** CellAtlas, bandmon, SpectrumScope, TowerScope, NetScopeiOS, NetScopeMac (newest commit of each, read-only)
**Skipped (your call):** claude-projects, LinkBond

---

## The short answer

Think of your old projects as a garage full of parts from other cars.

- **The engines don't fit.** Five of the six are Apple-only apps written in Swift. Swift apps don't run on a Windows PC, so we can't copy that code into the new app.
- **The maps, notes and tricks are very useful.** The best finds:
  1. **SpectrumScope's South Hadley file:** real local cell sites hidden in water tanks, a school chimney and a library steeple. Each one comes with the town permit that proves which company is on it. That's ready-made material for the "Site types" and "Who runs this site?" lessons.
  2. **bandmon's channel-number decoder:** the math that turns a channel number into a frequency and a band. That's a great hands-on "decode it yourself" lesson.
  3. **TowerScope's help screen:** step-by-step instructions for opening the iPhone's secret Field Test screen, plus simple "good / fair / weak" signal levels. That's good for the "Cell IDs" lesson.
- **Some old band numbers are wrong or out of date.** I checked them against your verified research file. Details are in section 4. We copy **no** facts from the old projects. They're only clues to double-check.

---

## 1. Your answers from this chat (recorded)

| Question | Your answer | What it changes |
|---|---|---|
| Which computers? | Windows **and** a Mac. You'll open the finished app mostly on the PC. | The app must work on both. On a Mac, Tauri uses Apple's browser engine (Safari's), not Chrome's, so Tauri would look and act a bit differently on each computer. That's a point for Electron in the plan (T04). |
| What is "cellatlas-data"? | You don't know. | See section 5. Not a blocker. |
| Also look at claude-projects and LinkBond? | No. | Skipped. |
| Keep the "From your own phone" log-import idea? | Drop it. | The app won't read your phone's logs. bandmon's code is used only to teach, not to connect to your phone. |

---

## 2. Each project in one line

| Project | What it is | Built with | Useful for us? |
|---|---|---|---|
| **SpectrumScope** | iPhone map of AT&T / Verizon / T-Mobile sites around South Hadley and Western Mass, with 125 sites and research notes | Swift (Apple only) + one data file | ⭐⭐⭐ **Yes:** local site examples, research habits, the "facts live in one file" idea |
| **bandmon** | Mac tool that reads which bands your iPhone is using, over a USB cable | Python + Swift | ⭐⭐ **Yes:** channel-number math, carrier codes, real-world quirks to teach |
| **TowerScope** | Map where you type in what your phone's Field Test screen shows, to guess where the tower is | A web page inside a small Apple app | ⭐⭐ **Some:** Field Test steps, signal levels, distance idea |
| **CellAtlas** | Early skeleton of a Mac + iPhone research app. Its real data lives somewhere else ("cellatlas-data"). | Swift (Apple only) | ⭐ **A little:** the "app checks itself" idea. No band data inside. |
| **NetScopeiOS** | iPhone speed test and Wi-Fi/cellular info | Swift (Apple only) | ⭐ **A little:** friendly explainer style, animation ideas. Its "Learn" tab is about Wi-Fi, not cell bands. |
| **NetScopeMac** | Mac Wi-Fi and home-network scanner | Python + Swift | ❌ **No:** Wi-Fi only, nothing about cell bands or towers |

---

## 3. What to reuse, best first

### 3a. ⭐ Local site examples (SpectrumScope → "Site types" and "Who runs this site?")

SpectrumScope's notes (`docs/SOUTH_HADLEY.md`) list real sites near you, each with proof:

| Site | Disguise / type | Who's on it | Proof in the notes |
|---|---|---|---|
| South Hadley High School, 153 Newton St | **Chimney** (antennas on the smokestack) | T-Mobile (was metroPCS) + AT&T | Town Planning Board permit |
| 14 Mulligan Dr | **Water tank** | T-Mobile, Verizon, AT&T | FCC licence records + town permits |
| 8 Industrial Dr | **Water tank** | AT&T, Verizon, T-Mobile | FCC licence records + town permits |
| Hadley St (Route 47) | **Monopole**, 150 ft | T-Mobile, Sprint (now T-Mobile), Verizon, Dish | FCC tower registration (ASR) 1309677 + permits |
| Williston Library, Mount Holyoke | **Steeple** (antennas hidden inside) | T-Mobile | Town permit |
| Clapp Lab, Mount Holyoke | **Rooftop** | Verizon | 2015 special permit |

Why this is great:
- It teaches the exact lesson from the research: **"the paperwork beats the guess."** SpectrumScope's research asked whether Verizon was on the High School chimney. The permits say T-Mobile and AT&T. The Verizon site was a mile away, at Mount Holyoke.
- It shows that most sites in a small town are **disguised** and don't appear in the FCC's tall-tower list.
- The notes also list 5 real T-Mobile tower ID numbers (eNB IDs) seen on CellMapper. They'd make good "decode this ID" examples, credited to CellMapper.

**Catch:** there are no photos. These would be quiz questions built from words and maps, unless you take a few photos yourself (see section 6).

### 3b. ⭐ The "facts live in one file" habit (SpectrumScope)

SpectrumScope keeps every fact in one data file and gives each one a source. It also keeps a list of claims it **proved wrong** (for example "348 towers in Springfield"), so they never sneak back in. That's the same rule our `CLAUDE.md` already has. It confirms the plan: one bands data file (T06), plus a "refuted, don't use" list.

### 3c. ⭐ Channel-number decoder (bandmon → "Cell IDs" unit)

bandmon has a small formula that turns a 5G channel number (NR-ARFCN) into a frequency, then into a band. Example from its notes: `391970 → 1959.85 MHz → n25`. It also has a lookup table for LTE channel numbers (EARFCN).

- **Lesson idea:** "Your phone says channel 125530. Which band is that?" The learner does the math step by step, and the app checks it.
- **Fun facts it found the hard way** (good quiz material):
  - LTE reports channel width as a count of tiny blocks (50 blocks = 10 MHz). 5G reports it in MHz.
  - Phones write a "no data" filler number (like 32767) when they have nothing to report.
- **Carrier codes** (the number pair that names the network, for example 310-260 = T-Mobile, 311-480 = Verizon, 310-410 = AT&T): useful for "Which company is this?" questions, after we add a source and status to each code.

We'd **rewrite** this in the new app's language and **re-check every number** against the official tables (T07). We wouldn't copy the code itself.

### 3d. Field Test steps and signal levels (TowerScope → "Cell IDs" unit)

TowerScope's help screen explains:
- dialing `*3001#12345#*` to open the iPhone's hidden Field Test screen;
- where to find band, Cell ID and area code (TAC) on that screen;
- a simple signal scale: −80 or better = excellent, down to below −110 = very weak.

These are good for a "read your phone's secret screen" lesson. The research already found that the Field Test menus change between iPhone models, so the lesson should say "it may look different on yours."

TowerScope also estimates how far away a tower is from signal strength. It could become an "about how far is the tower?" mini-game later. The research calls this kind of guess rough, so the lesson would teach it as an estimate, not a fact.

### 3e. Small helpful habits (CellAtlas, NetScopeiOS)

- **CellAtlas:** each build can run a quick self-check and report "OK" or "problem". We should do the same for the test build (T05), so Claude can check the app without seeing your screen.
- **NetScopeiOS:** a friendly explainer tone ("channel width is like lanes on a road"), and its smooth, springy gauge animation. Those are ideas only.
- **Colors:** your apps all use a dark theme with a bright blue accent. That fits the "original radio/tower look" decision, so the plan can borrow the feel (not the code).

---

## 4. Fact check: old numbers vs your verified research

Rule from `CLAUDE.md`: band facts come only from `docs/research/notes/band_verification.md` (checked against Wikipedia's 3GPP tables on 2026-10-31). I compared the old projects against it:

| Where | What the old project says | What the verified file says | Verdict |
|---|---|---|---|
| bandmon 5G band list | **No n258** (and no n70, n26 or n29) | n258 = 24.25–27.50 GHz | ❌ **Missing.** n258 is one of the 8 bands you know! bandmon can't name it. |
| bandmon LTE list | **No B70** | B70 exists (downlink 1995–2020 MHz) | ❌ Missing (B70 is HISTORICAL now, but phones may still show it) |
| bandmon LTE channel ranges | 34 number ranges | Not in our file (needs the official 3GPP document) | ⚠️ **UNVERIFIED.** Check in T07 |
| bandmon's other 5G ranges (n2, n5, n25, n41, n66, n71, n77, n260, n261, n12–14, n30, n48) | Downlink ranges | Same | ✅ Match |
| SpectrumScope: n25 | "1850–1990 MHz" | Up 1850–1915, down 1930–1995 MHz | ❌ **Wrong.** It stops at 1990, which is n2's edge. |
| SpectrumScope: n77 | "3.45–3.98 GHz" | The band is 3300–4200 MHz. US carriers use pieces of it: 3.45–3.55 GHz and 3.7–3.98 GHz (C-band). | ⚠️ **Mixed up.** It shows the pieces in use, not the band. The lesson should teach both, clearly separated. |
| SpectrumScope: n71, n5, B14, n41, n48, n260, n261 | Single low–high spans | Same edges | ✅ Match (but each span hides the separate up/down lanes) |
| SpectrumScope carrier notes (written June 2026) | T-Mobile's 800 MHz "Grain deal" is **pending** | Closed Aug 10, 2026. T-Mobile's B26 is HISTORICAL. | ❌ **Out of date** |
| SpectrumScope carrier notes | AT&T's 600 MHz not listed | AT&T owns ~20 MHz of 600 MHz since Jul 28, 2026 (not switched on yet) | ❌ Out of date |
| bandmon carrier codes | Sprint = 310-120, no dates | Sprint is gone (part of T-Mobile) | ⚠️ Would be HISTORICAL. All codes need a source (UNVERIFIED until then). |
| TowerScope band list | One number per band (for example B71 = 617) | 617 MHz is the bottom edge of B71's downlink, not its middle | ⚠️ These numbers are rough inputs for a distance guess. **Don't use them as facts.** |

**Bottom line:** the old projects are 4 months older than your research, and carrier facts changed in between. The research wins every time.

**Privacy note:** bandmon's sample recording (`sample-capture.log`) has your phone's real Cell ID and area code in it. Your location is blanked out, but those numbers could still hint at where you were. Lessons will use made-up ID numbers, never ones from your own phone.

---

## 5. The "cellatlas-data" mystery

CellAtlas's notes say its research lives in a **separate folder called `cellatlas-data`**, kept next to the app on your Mac (`~/Developer/cellatlas-data`). It's **not** in your GitHub account; I checked the full list of 13 repos. So it's either:
- a folder only on your Mac, or
- something that was planned but never made.

**Why it might matter:** CellAtlas's notes say every site in it has a real source, plus confidence and checking labels. If it exists, it may hold more checked local sites.

**How to check (optional, 1 minute):** on your Mac, open Finder → press `Cmd + Shift + G` → type `~/Developer/cellatlas-data` → press Enter. If a folder opens, tell Claude. If it says the folder can't be found, it doesn't exist and we move on. **Nothing is waiting on this.**

---

## 6. What this means for the plan (T04, Large/Opus)

1. **Reuse is content and ideas, not code.** None of the Swift code can run on Windows. This doesn't decide Electron vs Tauri. But now that we know you also use a Mac, Electron's "same engine on every computer" is a stronger point.
2. **Keep the one-data-file design** (already planned): bands file + a "refuted claims" list.
3. **Consider a "Your town" lesson pack** built from the South Hadley sites (section 3a). Open question: would you take a few photos of these sites yourself? Your own photos are fine to use. Only AI-made photos are banned.
4. **Add a "decode the channel number" lesson** in the Cell IDs unit, using bandmon's math once T07 has checked it.
5. **Build in a self-check** for the test build (T05), like CellAtlas.

---

## 7. For the next Claude (technical notes)

- Clones used: `cellatlas` d7b3b62, `bandmon` 81ad6af, `spectrumscope` 2fca4ed, `towerscope` 4a315ab, `netscopeios` 4b49f6b, `netscopemac` 634276f (all `--depth 1`).
- Key files:
  - **SpectrumScope:** `SpectrumScope/Resources/carriers.json` (schema in its README; `bandReference[]`, `carriers[].spectrum[]`, `sites[]` with `type`, `town`, `source`), `docs/RESEARCH.md`, `docs/SOUTH_HADLEY.md`, `tools/gen_seed.py`.
  - **bandmon:** `bandmon` lines 87–150 (`LTE_EARFCN_BANDS`, `NR_BANDS_DL`, `nrarfcn_to_freq_mhz`) and 244–247 (`CARRIER_NAMES`). The Swift twin is `native/BandCore.swift`.
  - **TowerScope:** `TowerScope/index.html`, lines ~295–310 (Field Test help) and ~342–380 (`BANDS`, `sigQuality`, `estDistanceKm`).
- The NR-ARFCN → frequency formula in bandmon (TS 38.104 §5.4.2.1: 5 kHz steps below 3 GHz, 15 kHz up to 24.25 GHz, 60 kHz above) should be verified in T07 along with the EARFCN offsets. Neither is in `band_verification.md`.
- No code from these repos was run during this review.
