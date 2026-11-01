# Review of the draft bands file (task T42)

**Status:** DONE (review only: nothing in `content/` was changed) · **Reviewed:** `content/bands.md` and `content/bands.json` (DRAFT v1, from T06), plus `content/tools/` · **Checked against:** `docs/research/notes/band_verification.md` (tables A–E, discrepancy list, Q2, Q3) and `docs/research/notes/us_bands.md` (Q2 carrier × band matrix, Q4 timeline) · **By:** Large (Opus), High effort, robot run · **Date:** 2026-11-01

## In simple words (for the owner)
I checked the bands file the way a teacher marks homework.

- **The frequency table is right.** Every number matches the research notes, and the numbers agree with each other. I found no wrong frequency.
- **The "which carrier uses which band" part has some mistakes.** Four rows are marked "trusted" when the source doesn't really say that. For example, a page saying Cellcom can *use* Verizon's spectrum got turned into "Cellcom runs band 13". A few other rows are the other way round: well-sourced but marked "not checked".
- **Nothing wrong reached you.** The app isn't quizzing on this file yet. The fixes are now task T43.

## How I checked
1. **Re-ran the build script** (`python3 content/tools/build_bands.py`). It rebuilt both files with **no changes**, so the files really come from the script and nobody edited them by hand.
2. **Band table vs. research tables A–E:** row by row. The script copies the tables directly, and the output matches.
3. **Number checks** (a small script, not kept in the repo):
   - duplex spacing = downlink start − uplink start, for every paired band;
   - uplink width = downlink width, for every FDD band not marked asymmetric;
   - every "⊂ / ⊃" (inside / contains) relation really nests;
   - every row has a status, an as-of date and a source;
   - every carrier row points to a band that exists in the band table.

   All passed except the four satellite bands in B5 below.
4. **Carrier rows vs. the us_bands.md matrix:** checked each of the 64 rows' claim, tag ([S]/[W]/[U]) and note against the matrix and the cited findings above it. Also checked them against Wikipedia's deployment table (band_verification.md Q3).

## Part A: band table (frequencies)

**Verdict: no numeric errors.** Spacing, widths and subset relations are all consistent. All 81 rows carry status, date and source.

| # | Band(s) | What looks wrong | Why it matters | Suggested fix | Severity |
|---|---|---|---|---|---|
| A1 | B23 | Status is **CURRENT** ("exists in the standard"), but Wikipedia's footnote says "Bands b6 and b23 are not applicable" (discrepancy list #10). | The app could teach B23 as a live band. | Give it status HISTORICAL with the note "marked not applicable", or add a `not_applicable` flag that the fact checker (T28) refuses to quiz. | Medium |
| A2 | B35/B36/B37 | Three bands squeezed into one row (`id` "B35/B36/B37", uplink "TDD 1850–1910 / 1930–1990 / 1910–1930"). | The app and the fact checker expect one band per row. | Split into three rows in `extract_band_definitions.py`. | Medium |
| A3 | All | Frequency cells are free text: "(TDD)" in the downlink, quotes inside cells, units mixed ("MHz"/"GHz" inside the satellite cells, none elsewhere, GHz without a label in FR2). | The quiz engine can't read numbers out of text reliably (T06 already noted this). | Add numeric fields (`ul_low`, `ul_high`, `dl_low`, `dl_high`, all in MHz) next to the original text. The text stays as the "copied from source" record. | Medium (blocks T29/T32) |
| A4 | n250, n251, n510, n511 | Uplink and downlink have different widths (e.g. n250: 7 MHz up, 41 MHz down), but the duplex says plain "FDD". | It's probably correct (that's how Wikipedia prints these satellite bands), but it's unusual. | Leave as is. Check during T07 against the 3GPP document. Optionally mark the duplex "FDD (asymmetric)". | Low |
| A5 | `core` column | "core = yes" counts any carrier claim, even HISTORICAL, PENDING or UNVERIFIED ones. So B26, B29, B70 and n70 show "core" though no carrier is known to use them today. Twins also disagree: B13/B14/B26 say yes, n13/n14/n26 say no. | "Core" sounds like "important in the US today", which isn't what it measures. | Rename it to `has_carrier_rows`, or count only CURRENT/PLANNED claims. | Low |

## Part B: carrier rows (who uses which band)

### B-1. Rows marked trusted that the source doesn't support (fix first)
These four rows have a status other than UNVERIFIED, so the app would be allowed to quiz them.

| # | Row | Problem | Evidence | Suggested fix | Severity |
|---|---|---|---|---|---|
| B1 | **B5 · Cellcom · CURRENT** | The source names **n5**, not B5. | us_bands.md Q2: "Wikipedia lists 850 MHz cellular as **n5** and 28 GHz mmWave as n261". LTE B5 is an inference. | UNVERIFIED, with the note "source lists 850 MHz as n5 only". | High |
| B2 | **B13 · Cellcom · CURRENT** | The source says Cellcom *has access to* Verizon's spectrum. It doesn't say Cellcom broadcasts B13. | us_bands.md Q2: Cellcom "has access to Verizon Wireless's extensive 700 MHz and AWS 1 spectrum holdings". The "LRA partner on B13" link is itself tagged [U] in the Gaps. | UNVERIFIED, with the note "has access to Verizon 700 MHz (LRA partner); B13 use not confirmed". | High |
| B3 | **B26 · SpaceX (from Grain) · PENDING** | The only source is a **news headline** ("SpaceX reportedly agreed…"), and the research itself calls it a report. | us_bands.md Q4 timeline (~Oct 2026 row, a Google News link); Q4 Gaps: "FCC status is unknown". | UNVERIFIED. Also see B5: a spectrum sale isn't "uses B26". | High |
| B4 | **B70 · SpaceX (from EchoStar) · PENDING** | The sale itself is well sourced (EchoStar 10-Q). But it's a **change of who owns the spectrum**, for satellite use (us_bands.md Q2 inference: "unlikely to return terrestrially"). SpaceX won't run LTE band 70. | A quiz "Which carrier uses B70? → SpaceX" would teach something false. | Move it out of "carrier uses band" into a new "spectrum changes" table (see B5). | Medium-high |

### B-2. Inconsistent treatment of the same evidence

| # | Rows | Problem | Suggested fix | Severity |
|---|---|---|---|---|
| B5 | B26 SpaceX, B70 SpaceX, plus the AST direct-to-cell items (AT&T/Verizon 700 and 850, [S] in the matrix, dropped by T06) | Ownership changes and satellite use are mixed in with "this carrier's towers broadcast this band", or dropped. | Add a second list to `bands.json`: **spectrum changes** (date, band, from, to, status, source), filled from the us_bands.md Q4 timeline. Keep `carrier_use` for "a phone sees this band on this carrier's sites". | Medium |
| B6 | Boost/EchoStar: **n70, n71, n66** (UNVERIFIED) vs **B70, B71** (HISTORICAL, cited) | One source (EchoStar 10-Q: all traffic moved off "our 5G Network" by Nov 15, 2025) covers Boost's whole network. us_bands.md's Q4 timeline lists "B70/n70, n71, n66, n29 (Boost) · HISTORICAL" with that source. The NR rows are actually the *best* supported, because it was a 5G network. | n70, n71 and n66 Boost → HISTORICAL, cited (EchoStar 10-Q). For the LTE Boost rows (B4/B66, B29): the source doesn't show Boost ever ran LTE on them, so note "LTE use not shown by source" (status stays UNVERIFIED). | Medium |
| B7 | **Verizon n77** (UNVERIFIED) vs **Verizon n260/n261** (CURRENT) | Both rest on the same articles (SlashGear, MakeUseOf). n77 also has DCD (Verizon got full C-band access; mid-band reaches 175M+ people). Only the "161 MHz average" detail is weak [W]. | Verizon n77 → CURRENT (cited: SlashGear, MakeUseOf, DCD). Move "~161 MHz average" into a separate weak note, or drop it. | Medium |
| B8 | **T-Mobile n77** | The Claim column says **CURRENT**, but the research says "UNCONFIRMED live use; ~40 MHz C-band [W]" (holds licences; no 2026 proof it's switched on). Status is already UNVERIFIED, so it's safe, but the claim misreports the research. | Claim → "UNCONFIRMED (holds licences)". | Low-medium |
| B9 | **AT&T n260** | Matrix tag is "[S, conflicting]"; T06 treated it as weak, so UNVERIFIED. | **Agree with T06:** sources conflict, so keep UNVERIFIED. Just add "(matrix: [S], sources conflict)" to the note so the reason is visible. | Low |

### B-3. Useful evidence the file leaves out

| # | Rows | What's missing | Suggested fix | Severity |
|---|---|---|---|---|
| B10 | B13 Verizon; B14, B17, B29, B30 AT&T; B12 AT&T + T-Mobile; B25, B41, B71 T-Mobile | band_verification.md Q3 found these are "consistent with Wikipedia's (undated) deployments table". The file still calls them "unverified background knowledge". | Keep them UNVERIFIED (the research says not to upgrade on an undated table). Change the evidence to "consistent with Wikipedia deployments table (undated)". These become the first rows to check in "Keep it fresh". | Low-medium |
| B11 | C Spire | Wikipedia lists C Spire on **LTE B25, B41 and B71** (Q3). The file has no C Spire B25 or B41 row, and its B71 note says "listed as n71 in research", which misses that Wikipedia lists B71. | Add C Spire B25 and B41 (UNVERIFIED, "Wikipedia deployments table"). Fix the B71 note. | Low |
| B12 | Dropped matrix entries | B48 private/cable [U], B13 Appalachian [U], the legacy UScellular NR rows [W]. | Fine to leave out (all unverified; UScellular's network is now T-Mobile's). Mention them in "Known problems" so the gap is visible. | Low |

### B-4. Shape and naming

| # | What | Problem | Suggested fix | Severity |
|---|---|---|---|---|
| B13 | Grouped band ids "B4/B66", "B12/B17/B85" | The app will ask "your phone shows band 17: whose site?". It needs one row per band number. The AT&T note already says it "shows as B17 or B12". | Split into per-band rows, and keep a `group` field so they can still be shown together. | Low-medium |
| B14 | Carrier names | They don't match `content/carrier-codes.md`: "Boost/EchoStar" vs "Dish / Boost"; "Cellcom" vs "Cellcom (Nsight)". "Private networks / cable" isn't a carrier, and "SpaceX (from Grain)" mixes a name with history. | One shared carrier list with short IDs (e.g. `att`, `verizon`, `tmobile`, `boost`, `cspire`, `cellcom`), used by both files. | Low |
| B15 | B2 Verizon note "plus Array PCS licences (Jun 2026)" | The research flags a conflict on which bands Verizon bought from Array: "AWS-3, AWS-1 and PCS" (Broadband Breakfast) vs "AWS, cellular and PCS" (Array's filing). | Add "(band mix disputed)" to the note. | Low |
| B16 | B26 / B27 | The research (band_verification Q2) notes that the ex-Sprint 800 MHz slice touches both B26 and B27. | Mention B27 in the B26 notes once the spectrum-changes table exists. | Low |

## What I did NOT find
- No wrong frequency, duplex mode or band number (compared with the research notes; the 3GPP documents themselves are still task T07).
- No carrier row that contradicts its source outright. The problems are about **how sure** we are and **what kind of fact** it is.
- No row missing a status, date or source.

## What happens next
- **T43** (new, Medium (Sonnet), Medium effort): apply the fixes above in `content/tools/build_bands.py` and `extract_band_definitions.py`, then rebuild. Order: B1–B4, then B6–B8, then A1–A3, then the rest. Every change goes through the scripts, never by hand.
- **T07** (3GPP check) still applies to the band table, including A4.
- **No question for the owner.** All the fixes follow the existing rule: only cited claims keep a status.
