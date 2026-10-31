# 🔍 Reuse review: what's in your other projects (task T03)

**Date:** 2026-10-31 · **Model size:** Medium (Sonnet) · **Status:** draft for you to read and question

I read all six projects: CellAtlas, bandmon, SpectrumScope, TowerScope, NetScopeiOS and NetScopeMac. I only *read* them. I changed nothing in them.

---

## In simple words

Think of your old projects as six toolboxes. I opened every one and checked what could help the learning app.

- **The tools don't fit the new workshop.** Every project is built for Apple (Mac and iPhone) using the Swift language, or it's Python. None of it can run on a Windows PC. So we can't copy and paste the code.
- **The ideas and the facts are worth keeping.** Three things are very useful:
  1. **SpectrumScope's way of keeping all facts in one data file.** It is almost the same idea as our plan.
  2. **bandmon's "channel number → band" decoder.** It's perfect for the lessons about EARFCN and NR-ARFCN.
  3. **SpectrumScope's list of tower types**, including the sneaky ones hidden in water tanks, chimneys and church steeples.
- **Some facts are already out of date.** SpectrumScope was last updated in June 2026. It still says two big deals are "pending". Our newer notes say both finished (AT&T and EchoStar on July 28, T-Mobile and Grain on August 10). So we use your old projects as **clues**, never as **facts**. Every fact gets re-checked first.
- **One thing doesn't add up and I need your help.** The notes for this project say your main computer is a Windows PC. But your projects keep saying "this Mac", and they're built with Apple's Xcode. That changes which app engine is best. See [Questions for you](#questions-for-you).

---

## The scorecard

| Project | What it is | Built with | Can we reuse it? | What to take |
|---|---|---|---|---|
| **SpectrumScope** | iPhone map of T-Mobile, Verizon and AT&T towers and spectrum in Western Massachusetts | Swift + a Python data generator | ⭐⭐⭐ **Ideas and structure: yes. Facts: no.** | The "all facts live in one file" design, the tower-type list, and the "verified vs refuted" research habit |
| **bandmon** | Mac tool that reads your iPhone's hidden log to show the band and carrier aggregation | Python (+ some Swift) | ⭐⭐⭐ **The decoding logic: yes.** | Channel-number → band maths, the log gotchas, lesson ideas |
| **NetScopeiOS** | iPhone speed test and Wi-Fi explainer | Swift | ⭐ **A few writing examples.** | The "explain it with everyday comparisons" style; how an iPhone tells 5G SA from NSA |
| **TowerScope** | Phone map where you log signal readings and it guesses where the tower is | One HTML/JavaScript page + a little Swift and Python | ⭐ **Some ideas; the page itself could run anywhere.** | Signal-strength labels, "how far does a band reach" maths, the Field Test Mode how-to |
| **CellAtlas** | Brand-new skeleton (Phase 0) for an iPhone/Mac research viewer | Swift | ⭐ **Rules and habits only.** | The "every record needs a source" rule and a checker that enforces it |
| **NetScopeMac** | Mac Wi-Fi and home-network scanner | Python + Swift | ✗ **Nothing.** | Nothing for cell phones (I searched it; the "cellular" hits were a false alarm from the word "filter") |

---

## Three big findings

### 1. None of the code runs on Windows
All six projects need a Mac or iPhone to build (Xcode, XcodeGen, the iOS simulator), or they need Python tools that talk to an iPhone. The only piece that is plain web technology is TowerScope's `index.html`.

What this means: **we reuse knowledge, data and logic, not files.** The logic in bandmon is short and easy to rewrite in whatever language the app uses.

### 2. Your projects suggest you use a Mac, which collides with an earlier note
- `docs/DECISIONS.md` says your main computer is a Windows PC (seen in your Remote Control computer list).
- CellAtlas's notes say "**this Mac**" many times. They say Xcode-beta is in your Downloads folder and the iPhone simulator is driven from the Mac. bandmon and SpectrumScope say the same.

Both can be true, for example a Windows PC and a Mac. But it matters a lot for the plan. I did **not** change the earlier decision. I'm flagging it so you can settle it (task T02) before the plan is written.

### 3. The old carrier facts have already gone stale
SpectrumScope (data dated 2026-06-23) says:
- T-Mobile's Grain deal is **pending** ("Pending Grain deal would slightly cut total low-band"). Our notes say the sale **closed on Aug 10, 2026**.
- AT&T's EchoStar deal is shown as an **"in-progress"** roadmap item. Our notes say it **closed on July 28, 2026**.
- It also says the EchoStar deal "adds ~50 MHz of 3.45 GHz". Our sourced notes say **about 30 MHz of 3.45 GHz plus about 20 MHz of 600 MHz**. So even the size of the deal doesn't match.
- A Hadley Street tower is described as hosting **Dish** as a fourth operator (from a 2021 town permit). Our notes say Boost traffic moved onto AT&T's network by Nov 15, 2025. That line may be out of date, but I can't tell from here.

I compared against our own notes (`us_bands.md`), which are more recent, but they haven't been checked against the original filings either. Treat the disagreement as a flag to check, not as proof that either side is right.

This is exactly the "biggest risk" from session 1. It's also proof that the rule in `CLAUDE.md` is right: **carrier facts come only from our data file, each with a status, a date and a source.**

---

## Project by project

### SpectrumScope: the best match for our ideas

**What it is.** An iPhone app that maps T-Mobile, Verizon and AT&T towers and spectrum. It's focused on one town in Western Massachusetts, with 125 map sites and 27 market towns underneath. The README says plainly that the Swift code is "a generic renderer" and that all content lives in one file, `carriers.json`.

**Worth reusing**
1. **The "data, not code" design.** One JSON file holds carriers, spectrum, sites and a band reference. Lessons can read the same kind of file. This matches our plan for `content/`.
2. **The tower-type list.** Sites are typed `macro`, `tower`, `smallcell`, `proposed`, plus the sneaky "stealth" types: `watertank` (7), `rooftop` (6), `chimney` (1) and `steeple` (1). That's a ready-made starting list for lesson unit 6 (Site types). It also includes a real finding for unit 7 (Reading a site): a site can look like a school chimney or a church steeple.
3. **The honesty habit.** Every one of the 125 sites has a `source`. `docs/RESEARCH.md` lists claims that were checked and claims that were thrown out (for example "348 towers in Springfield", which was refuted). We should copy that habit.
4. **Low / mid / high tiers.** It groups bands by `tier`, which matches the lessons' "low, mid, high" idea.
5. **The `tools/` scripts.** `gen_seed.py` builds the data file, and `verify_new_towers.py` checks coordinates against an official FCC web service before they're added. The "check before you add" idea is worth copying for T06.

**Do NOT copy**
- **Carrier facts as they are.** See finding 3 above.
- **The "MHz owned / MHz deployed" numbers.** The repo itself says these are "directional estimates", meaning rough guesses, because no carrier publishes them. Our facts discipline would label them UNVERIFIED, so they stay out of the lessons.
- **Its schema, unchanged.** It has one `lastUpdated` for the whole file. We need a **status, as-of date and source on every row** (`CLAUDE.md`). Its status words (`deployed`, `partial`, `planned`) are also different from ours (CURRENT, HISTORICAL, PENDING, PLANNED, UNVERIFIED).
- **The tower coordinates.** They're about real places near you. They're useful for the owner's own interest, but they aren't needed for a band-and-cell-ID teaching app.

**A mistake I found in its band reference.** It labels `n25` as "1850–1990 MHz". That is band n2's range. Our checked table says n25 is 1850–1915 MHz (phone to tower) and 1930–1995 MHz (tower to phone). It also joins the up and down ranges of `n71`, `n5` and `B14` into one span, which hides the fact that they're two separate lanes. For a learning app that difference matters, because FDD means two lanes.

**A gap.** Its `bandReference` has 9 bands. Of your 8 known bands (n25, n41, n66, n71, n77, n258, n260, n261) it is missing **n66** and **n258**.

### bandmon: the best match for the Cell ID lessons

**What it is.** A Mac tool. It reads the hidden "CommCenter" log from your iPhone over a USB cable. It shows which band(s) the phone is on, whether carrier aggregation (several bands at once) is on, and signal numbers. It decodes the log itself, so it contains good, working knowledge about what these numbers look like.

**Worth reusing**
1. **Channel number → frequency → band.** The README gives three worked examples. I checked the arithmetic myself:
   - NR-ARFCN `391970` × 0.005 MHz = **1959.85 MHz** → **n25** ✓
   - `125530` × 0.005 = **627.65 MHz** → **n71** ✓
   - `502110` × 0.005 = **2510.55 MHz** → **n41** ✓

   These make good practice questions for "Level: channel numbers (ARFCN)". The formula in the code (three zones: 5 kHz, 15 kHz and 60 kHz steps) is short and easy to rewrite.
2. **Real-world gotchas** that would make great "tricky" quiz cards, because they're things a beginner gets wrong:
   - A band of `0` in the log is a placeholder, not a real band.
   - Some "no data" values are fake numbers like `32767`.
   - LTE reports bandwidth as **resource blocks** (50 RB = 10 MHz), not MHz.
   - The log calls the cell ID number "PID"; it's the PCI.
   - The same channel number can match several bands (n77/n78/n48 overlap), so the phone log must say which one.
3. **Carrier aggregation labels.** It shows combos like `n41 + B2 + B66`, with roles PCC (the main carrier) and SCC (the extra ones). Good material for a mid-level lesson.
4. **MCC/MNC → carrier.** The log's MCC/MNC pair (for example 310/260) identifies the network. This matches the "which carrier" skill. (TowerScope's help text also says US = MCC 310/311/312.)

**How well do its tables agree with our checked tables?** I compared them by script.

| Check | Result |
|---|---|
| bandmon's 25 NR band ranges vs our verified table | **All 16 US bands match exactly** (n2, n5, n12, n13, n14, n25, n30, n41, n48, n66, n71, n77, n78, n79, n260, n261). The other 9 are non-US bands we haven't checked (n1, n3, n7, n8, n20, n28, n38, n40, n75). |
| US NR bands in our notes but missing from bandmon's decoder | 21, including **n70, n26, n29, n46, n85, n258** (n258 is one of your 8 bands). That's fine for a "fallback" helper, but a lesson tool would need them. |
| bandmon's LTE EARFCN ranges (33 rows) | **Can't be checked yet.** Our notes only have frequencies, not channel-number ranges. That belongs to **T07** (check against the official 3GPP documents). They also don't include B70, B53 or the satellite bands. |

**Do NOT copy**
- **The sample capture file (`sample-capture.log`).** It's real data from your phone. A text search shows it contains **precise GPS coordinates** and **SIM account numbers**. I did not copy any of it, and I haven't repeated those values here. If we want a "read a real log" lesson, we make a **scrubbed or made-up** example in the same format.
- **The tool itself.** It needs a Mac, libimobiledevice and an iPhone on a cable. It's out of scope for a learning app.

**An idea to park for the plan (not a promise):** a later "From your own phone" bonus where you import a log and the app quizzes you on the bands *your* phone saw. It's only an idea. It adds work and privacy care, so the PRD can say no.

### NetScopeiOS: writing style, not content

**What it is.** An iPhone app with a speed test, a Bonjour device finder, a connection screen and a **Learn** tab.

**What the Learn tab teaches.** Wi-Fi bands (2.4 / 5 / 6 GHz), channel width, speed words (download, upload, ping, jitter), DNS, IPv6, VPNs, throttling. That is **Wi-Fi and internet, not cellular**, so none of the content belongs in our lessons.

**Worth reusing**
- **The way it explains things.** "Channel width is how much of the airwaves your connection uses at once, like lanes on a road." That is the style `CLAUDE.md` asks for. The "bandwidth vs latency" and "good numbers to aim for" cards are also decent models for short lesson cards.
- **A possible bonus lesson:** "Wi-Fi bands vs cell bands". Both use the word "band", and learners often mix them up.
- **How an iPhone tells 5G SA from NSA.** The app reads Apple's `CTRadioAccessTechnologyNRNSA` vs `NR` values. This confirms the logic behind a "5G SA vs NSA" lesson.
- **Colours.** It uses a dark navy palette (`#0a0e16` background, blue accent). We could borrow the *mood* for the radio/tower look. We shouldn't copy the exact app look.

**Do NOT copy:** the Pro tier, privacy policy, speed engine, Ookla export, coverage heatmap. None apply to a personal learning app.

**A small mismatch inside the repo:** `ARCHITECTURE.md` says "iOS 16+" but `CLAUDE.md` says it targets iOS 27, and CellAtlas's notes say iOS 16 can't compile this code. It looks like an old line in `ARCHITECTURE.md`. It doesn't affect us.

### TowerScope: a map page and some maths

**What it is.** A map page (Leaflet) where you type in what you see in iPhone Field Test Mode (band, Cell ID, TAC, signal). It then draws a heatmap and guesses where the tower is once it has 3+ readings of the same Cell ID. It also looks up public tower databases (beaconDB, OpenCelliD).

**Worth reusing**
1. **The signal-strength labels.** The page gives RSRP bands: ≥ −80 dBm "Excellent", ≥ −90 "Good", ≥ −100 "Fair", ≥ −110 "Weak", below that "Very weak". These are the app's own rules of thumb, not a 3GPP standard. I would label them **UNVERIFIED** until we find a source.
2. **A "how far does a band reach" demo.** It estimates distance from signal and frequency, shifting by `20·log10(f/700)`. Good seed for an interactive "why low band goes farther" animation in unit 1. It is a rough model, and the lesson should say so.
3. **The Field Test Mode how-to.** It explains where to find Band, Cell ID and TAC on an iPhone. This helps the "Cell IDs: the numbers your phone sees" unit (unit 9).
4. **A band-frequency list.** It has 17 LTE and 11 NR bands, each with one "typical" frequency. I checked them against our verified table. 27 of the 28 are in that table, and **all 27 fall inside their band's real downlink range**. Most sit close to the middle. `B71` and `n71` use the low edge (617 MHz instead of the middle, 634.5), which is a harmless shortcut. The one I couldn't check is `B7`, because it isn't in our US table. We'd generate such numbers from our own data file instead.

**Notes:** the page loads Leaflet from the internet (unpkg), and it needs a Python helper (`serve.py`) for lookups. An offline desktop app would need to bundle Leaflet and drop the helper. It is the only code here that could run inside Electron or Tauri without a rewrite. Nothing in the first version of the app needs a map.

### CellAtlas: rules and habits

**What it is.** A Phase 0 skeleton (11 files, two empty app shells, a self-test and a "preflight" script). It's meant to show "research packs" synced from a **separate** GitHub repo called `cellatlas-data`. That data repo is **not** in your connected list, so I could not read it. See [Questions](#questions-for-you).

**Worth reusing**
- **"Data honesty" is a binding rule there.** Every site must carry a real `source`, plus `confidence`, `verification` and `coordPrecision`. A tool called `packctl` in the data repo **refuses** a record whose source doesn't exist. That is the right idea for T06: build a small checker that **fails the build** when a band or carrier row is missing its status, date or source.
- **A start-of-session health check** (`tools/preflight.sh`) and a **headless self-test** (`--selftest`: the app states its own identity and exits with an error code on a problem). That is a good model for how Claude can prove the app works without a screen, which matters because the cloud computer has no screen. It would need rewriting for the new engine.
- **The lesson in its "Backups" note:** an `autosave` branch is not history. I checked: for all six repos, the `autosave` branch holds nothing that `main` doesn't. So nothing newer was hiding there.

**Do NOT copy:** the Apple signing settings and Xcode build steps. They only apply if we choose a native Apple app.

### NetScopeMac: nothing for us
A Wi-Fi and home-network scanner with a small local web dashboard in a window. It teaches nothing about cell sites. The one interesting pattern ("Python engine + web page in a native window") is just what Electron and Tauri already do for us.

---

## What this means for the plan (T04)

These are **inputs**, not decisions. The owner decides.

1. **The app-engine choice depends on your computers.** If your main machine is a Mac and you only ever test on it, a native SwiftUI app is a serious option. You already have a working Xcode setup and four SwiftUI apps. If you want Windows too, Electron or Tauri is better. The catch: Claude's cloud computer runs Linux and can't build or test SwiftUI, so a native Apple app would be built and tested on your machine only. Answer T02 first.
2. **Use a data-file-first design.** SpectrumScope proves the "one file feeds the whole app" idea works for you. Our version adds status, date and source on every row.
3. **The first lesson units that reuse the most:** unit 6 (site types, from SpectrumScope's list) and unit 9 (cell IDs, from bandmon's decoder). Both would still need copyright-free photos (T08).
4. **Plan a checker for T06** (like `packctl`) so a row can't be saved without a source.
5. **Plan a scrubbed example log** instead of the real capture.

---

## Reuse checklist: what is used where

| Idea / asset | From | Use in | Needs checking first |
|---|---|---|---|
| "Data, not code" file layout | SpectrumScope | T04 plan, T06 data file | Add status/date/source per row |
| Tower-type list (macro, tower, small cell, water tank, rooftop, chimney, steeple, proposed) | SpectrumScope | Unit 6, T08 photo list | Check each type against our `sites_and_carriers.md` notes |
| Channel number → frequency → band formula and 3 worked examples | bandmon | Unit 9 and ARFCN lessons | Examples verified by arithmetic ✓; the EARFCN table needs T07 |
| Log gotchas (band 0, sentinels, resource blocks, PCI/"PID") | bandmon | Quiz cards | Confirm against 3GPP in T07 |
| Source-checker idea (`packctl`) | CellAtlas | T06 | Not seen (data repo is hidden) |
| Self-test idea | CellAtlas | T05 test build | Rewrite for the chosen engine |
| Signal-strength labels | TowerScope | Signal lesson | UNVERIFIED: find a source |
| Distance-by-band demo | TowerScope | Unit 1 animation | Say "rough model" in the lesson |
| Everyday-comparison style | NetScopeiOS | All lessons | None |

---

## Questions for you

1. **Which computers do you use?** (This is T02.) Windows only, or also a Mac? Your projects strongly suggest a Mac. If you use both, which one will you open the finished app on most? This decides the app engine.
2. **Where is `cellatlas-data`?** CellAtlas says your research packs live in a separate repo of that name. It isn't in the list I can see. Is it on GitHub? If it's private, it could be connected next time. It might hold sites, carriers and spectrum notes we could reuse. I can't tell until I look.
3. **Should I also look at `claude-projects` and `LinkBond`?** They are in your account but weren't on the list of six. CellAtlas says `claude-projects` is the workspace the others sit in. I did not open them.
4. **Do you want the "From your own phone" import idea kept for the plan?** It can be quietly dropped.

---

## What I did, and what I could not check

**What I did**
- Attached the six repos as read-only and made shallow copies (latest snapshot only).
- Read every doc and the key code in all six.
- Compared the band numbers in bandmon, TowerScope and SpectrumScope against `docs/research/notes/band_verification.md` by script.
- Checked the `autosave` branch of each repo against `main`: no differences.

**What I did not do or could not check**
- I did **not run** any of the code in your other repos (it's outside this task, and the tools it needs aren't on this computer).
- The comparison only covers bands in our verified table. Wikipedia's tables are a second-hand copy of the 3GPP rules, so a full check still waits for T07.
- I did not verify carrier facts in SpectrumScope beyond the two deals and one Dish line I could compare with our newer notes.
- `cellatlas-data`, `claude-projects` and `LinkBond` were not read.
- Nothing from your other repos was copied into this one. This file is the only addition.
