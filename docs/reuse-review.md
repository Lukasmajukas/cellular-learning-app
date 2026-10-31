# ♻️ Reuse review (T03): what can we borrow from your other projects?

**Checked:** 2026-10-31 · **How:** a quick look. For each project I read the README and the file list. I opened only 2 data files: bandmon's band tables and SpectrumScope's `carriers.json`.

## The short answer
**We can't reuse much code, but some data and ideas are worth keeping.** All six projects are Apple-only: Swift apps for iPhone and Mac, plus some Python scripts. The learning app will be a web-style desktop app (Electron or Tauri) so it runs on both your Windows PC and your Mac. Swift code doesn't run there. It's like a recipe written in a language the new kitchen can't read: we can copy the *ideas*, not the pages.

## Project by project
| Project | What it is | Reuse? | What to take |
|---|---|---|---|
| **SpectrumScope** | iPhone map of T-Mobile/Verizon/AT&T towers and spectrum in Western Mass (South Hadley focus) | ⭐ **Best match** | (1) **125 real sites, each with a source** (FCC tower records, town permits). They include rooftops, water tanks, a chimney, a steeple and small cells. That's perfect practice material for the "site types" and "reading a site" units. (2) **The "all content is one data file" design**, the same plan we have for `content/`. (3) Its **honesty rules**: no made-up counts, a source on every site, and a list of claims that research proved wrong. |
| **bandmon** | Mac tool that reads which bands your iPhone is using (through the USB cable) | Ideas + a cross-check | (1) Its **channel-number → band tables** (EARFCN / NR-ARFCN). Use them only to double-check ours, not as the source: they're missing n258, n70, n85 and n105. (2) Its README explains real things a phone shows (carrier aggregation, NSA vs SA, PCI). Good for the "Cell IDs" unit. (3) **Later idea:** a lesson like "here's what *your* phone saw today", built from bandmon's logs. Not for version 1. |
| **CellAtlas** | Very early start (setup only) of an iPhone + Mac research app | Rules only | No data yet. Its **"don't fabricate" rules** match our facts rules. Its notes also show your Mac setup: a free Apple developer account, which can't "notarize" apps (see below). |
| **TowerScope** | Mac app that finds a location from nearby cell/Wi-Fi signals (uses the beaconDB service) | No | Different job (geolocation). Nothing for lessons. |
| **NetScopeiOS** | iPhone speed test, device finder, Wi-Fi "Learn" tab | Ideas only | Its **Learn tab** (short explainer cards) and **animated gauge** are good style ideas. The content is about Wi-Fi, not cell bands. |
| **NetScopeMac** | Mac Wi-Fi/LAN scanner shown in a web window | No | Wi-Fi only. |

## Warnings
- **Old carrier facts.** SpectrumScope's carrier facts are dated **June 2026**. Our research (October 2026) is newer, and carrier facts change fast. Per the rules in `CLAUDE.md`, band and carrier facts come **only** from `band_verification.md` → the bands data file. SpectrumScope is a cross-check, never the source.
- **Site photos aren't included.** SpectrumScope has locations and sources, not pictures. We still need copyright-free photos (task T08).
- **Local to one area.** The 125 sites are all in Western Massachusetts. That's great if you live there; otherwise they're just examples.

## What this means for the plan (T04)
1. **Electron looks even better now.** You use Windows **and** a Mac. Electron runs the same Chromium engine on both. Tauri would use a different engine on each (Chromium on Windows, Safari's WebKit on Mac), so the app could look or act differently on each computer.
2. **Mac install warning.** Without a paid Apple developer account, the Mac version can't be notarized. The first time you open it, macOS will warn you, and you'll need to right-click → Open once. The PRD should explain that step.
3. **Seed the tower-spotting units** with SpectrumScope's sourced site list (after you say yes; see the question below).

## Not checked (to keep this quick)
Code wasn't read in depth. SpectrumScope's `gen_seed.py`, `docs/SOUTH_HADLEY.md` (read only the start) and bandmon's Python files could hold more detail if we need it later.
