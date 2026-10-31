# Handoff note: 2026-10-31, T03 reuse review of the owner's other projects

**Model used:** Medium (Sonnet) · **Branch / pull request:** `claude/brave-sagan-q9j3sj` (draft pull request, link in the PR list on GitHub)

## In simple words (for the owner)
I opened your six other projects and checked what could help this app. None of the code can be copied, because it's all made for Apple devices or it's Python. But three *ideas* are great: keeping every fact in one data file, decoding channel numbers into bands, and a list of tower types, including ones hidden in water tanks and church steeples. Some carrier facts in your old projects are already out of date, so we treat them as clues and re-check them first.

## What was done
- Wrote `docs/reuse-review.md`: a scorecard, a section for each of the six projects, a list of what to reuse and what not to copy, and questions for the owner.
- Compared the band tables in bandmon, TowerScope and SpectrumScope against `docs/research/notes/band_verification.md` by script:
  - bandmon: all 16 US NR band ranges match; 9 non-US bands were not checkable; 21 US NR bands from our notes are missing from its decoder (including n258).
  - TowerScope: 27 of 28 band frequencies checked, all inside the real downlink range (B7 isn't in our table).
  - SpectrumScope: `n25` is labelled "1850–1990 MHz", which is n2's range (n25 is 1850–1915 up, 1930–1995 down). It also lacks n66 and n258 from the owner's 8 known bands.
- Checked bandmon's three worked ARFCN examples by arithmetic (391970 → 1959.85 MHz → n25, 125530 → 627.65 MHz → n71, 502110 → 2510.55 MHz → n41). All correct.
- Compared the `autosave` branch of every repo with `main`: no differences.
- Found stale carrier facts in SpectrumScope (dated 2026-06-23): the Grain deal is "pending" and the EchoStar deal is "in-progress" with "~50 MHz of 3.45 GHz". Our `us_bands.md` says both closed (Jul 28 and Aug 10, 2026) and the EchoStar size is ~30 MHz of 3.45 GHz plus ~20 MHz of 600 MHz. Neither side has been checked against the original filings.

## What's next
- Owner first: answer T02 (which computers?) and T09 (where is `cellatlas-data`?). T04's engine choice depends on T02.
- Next task: T04 (write the PRD), model: **Large (Opus)**, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Facts from the owner's other projects are used only as leads. Each one is re-checked and given a status, date and source before it goes in `content/`.
- The raw `bandmon/sample-capture.log` is never copied into this repo, because it holds GPS coordinates and SIM account numbers. Any "read a real log" lesson uses a scrubbed or made-up example.

## Questions for the owner
- **T02 (conflict, needs the owner):** `docs/DECISIONS.md` says the main computer is a Windows PC. The other projects' notes say "this Mac" and are built with Xcode. Which computers does the owner use, and which one will run the finished app? I did not edit the earlier decision.
- **T09:** Where is `cellatlas-data` (the research-pack repo CellAtlas depends on)? It isn't in the connected repo list, so it wasn't read.
- Should `claude-projects` and `LinkBond` also be reviewed? They weren't in the list of six, so they weren't opened.
- Keep the parked "From your own phone" log-import idea for the PRD, or drop it?

## New words (also added to GLOSSARY.md)
- Data file (JSON), Swift / SwiftUI, Xcode, Native app, Carrier aggregation, 5G SA / NSA, MCC / MNC, RSRP, Stealth site, Scrubbed data, Read-only

## Notes for the next Claude
- **Planning inputs for T04** are in the last two sections of `docs/reuse-review.md` ("What this means for the plan" and the reuse checklist). They're inputs only; the owner decides.
- **A native Apple app is a real option for the PRD** if the owner mainly uses a Mac. The owner already has Xcode-beta, XcodeGen and four SwiftUI apps. The cloud session runs Linux and can't build or test SwiftUI, so a native app could be built and tested only on the owner's machine.
- **Clone paths used this session** (gone when the cloud computer resets): private repos in `/home/user/{cellatlas,bandmon,spectrumscope}`, public ones in `/home/user/lukasmajukas/`. All shallow, read-only. The comparison script was at `/tmp/cmp_bands.py` and is not saved in the repo. It parses the verified tables in `band_verification.md` and tests other tables against them. Rewrite it if T06/T07 needs it.
- **The classifier blocked running `./bandmon`** (code from another repo). I did static searches instead. Don't run code from the other repos without the owner's say-so.
- **Not verified:** bandmon's 33-row LTE EARFCN table (our notes hold no channel-number ranges; belongs to T07) and the carrier claims in SpectrumScope beyond the Grain and EchoStar items.
