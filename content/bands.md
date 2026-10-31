# US bands data file: DRAFT v1

**As of:** 2026-10-31 · **Built by:** the robot, task T06 · **Made by:** `python3 content/tools/build_bands.py` (don't edit by hand; edit the script or the research notes)

**Status of the whole file:** DRAFT. Band numbers and frequencies are copied from Wikipedia's band pages, which copy the official 3GPP documents (Release 19). Nobody has yet compared them to the 3GPP documents themselves (task T07). Carrier facts come from search-result summaries and are mostly UNVERIFIED.

**What this is (simple words):** A table of every phone band the research found that matters in the US: its band number, the frequencies it uses, and which companies use it. Every row says how sure we are, when we checked, and where the fact came from. The app reads `bands.json`; this page is the same data for people.

**Status words:** CURRENT (in use now) · HISTORICAL (used before, not now) · PENDING (a sale or change is in progress) · PLANNED (not built yet) · UNVERIFIED (a claim nobody has checked; the app must never quiz on it).

## 1. Band definitions (frequencies)

Every row: status CURRENT (the band exists in the standard), as of 2026-10-31. `core` = a band some US carrier is claimed to use; the rest are 'defined by 3GPP' only. Source column is in `bands.json` (one source per table). Frequencies in MHz unless a row says GHz.

### LTE bands

| Band | Core | Name | Uplink | Downlink | Duplex | Spacing | Relations | Checked how |
|---|---|---|---|---|---|---|---|---|
| B2 | yes | PCS (1900) | 1850–1910 | 1930–1990 | FDD | 80 | ⊂ B25 | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B4 | yes | AWS‑1 (1700) | 1710–1755 | 2110–2155 | FDD | 400 | ⊂ B10, ⊂ B66 | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B5 | yes | Cellular (850) | 824–849 | 869–894 | FDD | 45 | ⊂ B26 | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B10 |  | Extended AWS (1700) | 1710–1770 | 2110–2170 | FDD | 400 | ⊂ B66; ⊃ B4 | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B12 | yes | Lower SMH (700) | 699–716 | 729–746 | FDD | 30 | ⊂ B85; ⊃ B17 | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B13 | yes | Upper SMH (700) | 777–787 | 746–756 | FDD, UL above DL | −31 | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B14 | yes | Upper SMH (700) | 788–798 | 758–768 | FDD, UL above DL | −30 | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B17 | yes | Lower SMH (700) | 704–716 | 734–746 | FDD | 30 | ⊂ B12, ⊂ B85 | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B23 |  | AWS-4 (2000) | 2000–2020 | 2180–2200 | FDD | 180 | same frequencies as satellite B252 (derived) | values verified against Wikipedia (cites 3GPP TS 36.101); band marked "not applicable"; was U |
| B24 |  | Upper L‑Band (1600) | 1626.5–1660.5 ("Uplink restricted to 1627.5–1637.5 MHz and 1646.5–1656.5 MHz") | 1525–1559 ("Downlink restricted to 1526–1536 MHz") | FDD, UL above DL | −101.5 or −120.5 | same frequencies as satellite B255 (derived) | verified against Wikipedia (cites 3GPP TS 36.101) |
| B25 | yes | Extended PCS (1900) | 1850–1915 | 1930–1995 | FDD | 80 | ⊃ B2 | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B26 | yes | Extended Cellular (850) | 814–849 | 859–894 | FDD | 45 | ⊃ B5 (also ⊃ B18/B19, Japan) | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B27 |  | SMR (800) | 807–824 | 852–869 | FDD | 45 | overlaps B26 at 814–824 / 859–869 (derived) | verified against Wikipedia (cites 3GPP TS 36.101) |
| B29 | yes | Lower SMH (700) | — | 717–728 | SDL | — | ⊂ B44 (APT TDD 703–803; not a US band) | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B30 | yes | WCS (2300) | 2305–2315 | 2350–2360 | FDD | 45 | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B35/B36/B37 |  | PCS (1900) | TDD 1850–1910 / 1930–1990 / 1910–1930 | (TDD) | TDD | — | — | verified against Wikipedia (cites 3GPP TS 36.101); definition only, not in the deployments table |
| B41 | yes | BRS (2500) | 2496–2690 | (TDD) | TDD | — | ⊃ B38 (non-US) | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B46 | yes | U-NII-1–4 (5200) | 5150–5925 | (TDD) | TDD | — | ⊃ B47 | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B47 |  | U-NII-4 (5900) | 5855–5925 | (TDD) | TDD | — | ⊂ B46 | verified against Wikipedia (cites 3GPP TS 36.101) |
| B48 | yes | CBRS (3500) | 3550–3700 | (TDD) | TDD | — | ⊃ B49 | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B49 |  | C-Band (3500) | 3550–3700 | (TDD) | TDD | — | ⊂ B48 | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B53 |  | S-Band (2400) | 2483.5–2495 | (TDD) | TDD | — | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B66 | yes | Extended AWS (1700) | 1710–1780 | 2110–2200 ("Downlink between 2180–2200 MHz restricted to intra-band Supplemental Downlink") | FDD (asymmetric) | 400 | ⊃ B4, ⊃ B10 | verified against Wikipedia (cites 3GPP TS 36.101) and ETSI-verified (us_bands.md: ETSI TS 136 101 V15.9.0) |
| B70 | yes | Supplementary AWS (1700) | 1695–1710 | 1995–2020 | FDD (asymmetric) | 300 or 295 ("depends on whether the Uplink is paired with the lower or the upper part of the Downlink, with the remainder of the Downlink available for use as intra-band Supplemental Downlink") | — | ranges and spacing verified against Wikipedia (cites 3GPP TS 36.101); BW footnote scope unresolved; was U |
| B71 | yes | Digital Dividend (600) | 663–698 | 617–652 | FDD, UL above DL | −46 | inside NR n105's ranges (derived) | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B74 |  | Lower L‑Band (1500) | 1427–1470 | 1475–1518 | FDD | 48 | — | verified against Wikipedia (cites 3GPP TS 36.101) |
| B85 | yes | Extended Lower SMH (700) | 698–716 | 728–746 | FDD | 30 | ⊃ B12, ⊃ B17, per the B12 and B17 rows and the numbers. B85's own "Subset of band" cell reads "12", a Wikipedia error | ranges verified against Wikipedia (cites 3GPP TS 36.101); relation per numbers; was U |
| B103 |  | Upper SMH (700) | 787–788 | 757–758 | FDD, UL above DL | −30 (printed "-30") | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B106 |  | LMR (900) | 896–901 | 935–940 | FDD | 39 | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |

### LTE satellite bands (B252 etc. are satellite bands, not LTE-U)

| Band | Core | Name | Uplink | Downlink | Duplex | Spacing | Relations | Checked how |
|---|---|---|---|---|---|---|---|---|
| B252 |  | AWS-4 (2100) | 2000–2020 | 2180–2200 | FDD | 180 |  | verified against Wikipedia (cites 3GPP TS 36.102 / TS 36.108); replaces the LTE-U meaning in us_bands.md |
| B253 |  | L-band (US) (1600) | 1668–1675 | 1518–1525 | FDD, UL above DL | −150 |  | verified against Wikipedia (cites 3GPP TS 36.102 / TS 36.108) |
| B255 |  | L-band (US) (1600) | 1626.5–1660.5 | 1525–1559 | FDD, UL above DL | −101.5 |  | verified against Wikipedia (cites 3GPP TS 36.102 / TS 36.108); replaces the LTE-U meaning in us_bands.md |
| B249 |  | L-band (US) (1600) | 1616–1626.5 (TDD) | (TDD) | TDD | — |  | verified against Wikipedia (cites 3GPP TS 36.102 / TS 36.108) |
| B254 |  | S-band (2400) | 1610–1626.5 | 2483.5–2500 | FDD | 873.5 |  | verified against Wikipedia (cites 3GPP TS 36.102 / TS 36.108); US relevance unresolved |
| B256 |  | S-band (2100) | 1980–2010 | 2170–2200 | FDD | 190 |  | verified against Wikipedia (cites 3GPP TS 36.102 / TS 36.108); US relevance unresolved (see Inferences) |

### 5G NR bands, FR1 (below 7.125 GHz)

| Band | Core | Name | Uplink | Downlink | Duplex | Spacing | Relations | Checked how |
|---|---|---|---|---|---|---|---|---|
| n2 | yes | PCS (1900) | 1850–1910 | 1930–1990 | FDD | 80 | ⊂ n25 | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was S (from a Wikipedia search snippet) |
| n5 | yes | CLR (850) | 824–849 | 869–894 | FDD | 45 | ⊂ n26 | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n12 | yes | Lower SMH (700) | 699–716 | 729–746 | FDD | 30 | ⊂ n85 | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n13 |  | Upper SMH (700) | 777–787 | 746–756 | FDD, UL above DL | −31 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n14 |  | Upper SMH (700) | 788–798 | 758–768 | FDD, UL above DL | −30 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n24 |  | Upper L-band (1600) | 1626.5–1660.5 (restricted to 1627.5–1637.5 and 1646.5–1656.5) | 1525–1559 (restricted to 1526–1536) | FDD, UL above DL | −101.5 | same frequencies as NTN n255 (derived) | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| n25 | yes | Extended PCS (1900) | 1850–1915 | 1930–1995 | FDD | 80 | ⊃ n2 | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n26 |  | Extended CLR (850) | 814–849 | 859–894 | FDD | 45 | ⊃ n5 (also ⊃ n18, Japan) | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n29 |  | Lower SMH (700) | — | 717–728 | SDL | — | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n30 |  | WCS (2300) | 2305–2315 | 2350–2360 | FDD | 45 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n41 | yes | BRS (2500) | 2496–2690 | (TDD) | TDD | — | ⊃ n38 (non-US); same range as n90 | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n46 |  | U-NII-1–4 (5200) | 5150–5925 | (TDD) | TDD | — | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n47 |  | U-NII-4 (5900) | 5855–5925 | (TDD) | TDD | — | inside n46 (derived; not stated) | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| n48 | yes | CBRS (3500) | 3550–3700 | (TDD) | TDD | — | ⊂ n77, ⊂ n78 | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n53 |  | S band (2400) | 2483.5–2495 | (TDD) | TDD | — | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| n66 | yes | Extended AWS (1700 / 2100) | 1710–1780 | 2110–2200 ("Downlink between 2180–2200 MHz restricted to intra-band Supplemental Downlink") | FDD (asymmetric) | 400 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n70 | yes | Supplementary AWS (2000) | 1695–1710 | 1995–2020 | FDD (asymmetric) | 300 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) and ETSI-verified (us_bands.md: ETSI TS 138 101-1 V15.14.0) |
| n71 | yes | Digital Dividend (600) | 663–698 | 617–652 | FDD, UL above DL | −46 | ⊂ n105 (derived; Wikipedia does not state it) | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n74 |  | Lower L-Band (1500) | 1427–1470 | 1475–1518 | FDD | 48 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| n77 | yes | C-Band (3700) | 3300–4200 | (TDD) | TDD | — | ⊃ n78, ⊃ n48 | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) and ETSI-verified (us_bands.md: ETSI TS 138 101-1 V15.14.0, V16.5.0, V15.24.0) |
| n78 |  | C-Band (3500) | 3300–3800 | (TDD) | TDD | — | ⊂ n77; ⊃ n48 | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n79 |  | C-Band (4500) | 4400–5000 | (TDD) | TDD | — | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n85 |  | Extended Lower SMH (700) | 698–716 | 728–746 | FDD | 30 | ⊃ n12 | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n90 |  | BRS (2500) | 2496–2690 | (TDD) | TDD | — | ⊃ n38 | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); US relevance inferred from "BRS" |
| n96 |  | U-NII-5–8 (6000) | 5925–7125 | (TDD) | TDD | — | ⊃ n102 (stated); ⊃ n104 (derived) | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n99 |  | Upper L-band (1600) | 1626.5–1660.5 (restricted as for n24) | — | SUL | — | same as n24's UL (derived) | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| n102 |  | U-NII-5 (6200) | 5925–6425 | (TDD) | TDD | — | ⊂ n96 | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| n104 |  | U-NII-6–8 (6700) | 6425–7125 | (TDD) | TDD | — | ⊂ n96 (derived; not stated) | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| n105 |  | Digital Dividend (600) | 663–703 | 612–652 | FDD, UL above DL | −51 | ⊃ n71 (derived) | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n106 |  | LMRS (900) | 896–901 | 935–940 | FDD | 39 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |

### 5G NR bands, FR2 (mmWave, GHz)

| Band | Core | Name | Uplink | Downlink | Duplex | Spacing | Relations | Checked how |
|---|---|---|---|---|---|---|---|---|
| n257 |  | LMDS (28) | 26.50–29.50 |  | TDD |  | ⊃ n261 | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); was S (secondary tables) |
| n258 | yes | K-band (26) | 24.25–27.50 |  | TDD |  | — | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); was S |
| n259 |  | V-band (41) | 39.50–43.50 |  | TDD |  | — | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); was S |
| n260 | yes | Ka-band (39) | 37.00–40.00 |  | TDD |  | — | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); was S |
| n261 | yes | Ka-band (28) | 27.50–28.35 |  | TDD |  | ⊂ n257 | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); was S |
| n262 |  | V-band (47) | 47.20–48.20 |  | TDD |  | — | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); was S |
| n263 |  | V-band (60) | 57.00–71.00 |  | TDD |  | — | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); US relevance unresolved |

### 5G NR satellite bands

| Band | Core | Name | Uplink | Downlink | Duplex | Spacing | Relations | Checked how |
|---|---|---|---|---|---|---|---|---|
| n252 |  | AWS-4 (2100 MHz) | 2000–2020 MHz | 2180–2200 MHz | FDD | 180 |  | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19) |
| n255 |  | L-band (1600 MHz) | 1626.5–1660.5 MHz | 1525–1559 MHz | FDD, UL above DL | −101.5 |  | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19) |
| n253 |  | L-band (1600 MHz) | 1668–1675 MHz | 1518–1525 MHz | FDD, UL above DL | −150 |  | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19) |
| n251 |  | L-band (1600 MHz) | 1626.5–1660.5 MHz | 1518–1559 MHz | FDD, UL above DL | −108.5 |  | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19); no US label |
| n250 |  | L-band (1600 MHz) | 1668–1675 MHz | 1518–1559 MHz | FDD, UL above DL | −150 |  | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19); no US label |
| n254 |  | S-band (downlink) / L-band (uplink) (2400 MHz) | 1610–1626.5 MHz | 2483.5–2500 MHz | FDD | 873.5 |  | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19); no US label |
| n256 |  | S-band (2100 MHz) | 1980–2010 MHz | 2170–2200 MHz | FDD | 190 |  | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19); no US label (see Inferences) |
| n510 |  | Ka-band (28 GHz) | 27.50–28.35 GHz | 17.30–20.20 GHz | FDD | — |  | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19) |
| n511 |  | Ka-band (28 GHz) | 28.35–30.00 GHz | 17.30–20.20 GHz | FDD | — |  | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19) |

## 2. Which carrier uses which band

Source for every row: docs/research/notes/us_bands.md, carrier x band matrix (built from web-search summaries; SEC/FCC/press pages were not reachable). As of 2026-10-31. 'Claim' is what the research said; 'Status' is what we trust. Only claims with a cited source keep their status; the rest are UNVERIFIED until checked (the re-check is part of the 'Keep it fresh' level).

### LTE

| Band | Carrier | Claim | Status | Evidence | Note |
|---|---|---|---|---|---|
| B2 | AT&T | CURRENT | UNVERIFIED | unverified background knowledge | capacity layer |
| B2 | Verizon | CURRENT | UNVERIFIED | unverified background knowledge | capacity layer; plus Array PCS licences (Jun 2026) |
| B2 | T-Mobile | CURRENT | UNVERIFIED | weak source | as B2/B25 |
| B2 | C Spire | CURRENT | UNVERIFIED | weak source |  |
| B4/B66 | AT&T | CURRENT | UNVERIFIED | unverified background knowledge | main capacity layer |
| B4/B66 | Verizon | CURRENT | UNVERIFIED | unverified background knowledge | main capacity layer |
| B4/B66 | T-Mobile | CURRENT | UNVERIFIED | weak source |  |
| B4/B66 | Boost/EchoStar | HISTORICAL | UNVERIFIED | unverified background knowledge | own network wound down |
| B4/B66 | C Spire | CURRENT | UNVERIFIED | weak source | B4 |
| B5 | AT&T | CURRENT | UNVERIFIED | unverified background knowledge | coverage layer |
| B5 | Verizon | CURRENT | UNVERIFIED | unverified background knowledge | coverage layer |
| B5 | T-Mobile | CURRENT | UNVERIFIED | unverified background knowledge | former UScellular markets only |
| B5 | Cellcom | CURRENT | CURRENT | cited source | 850 MHz |
| B12/B17/B85 | AT&T | CURRENT | UNVERIFIED | unverified background knowledge | B/C blocks, shown as B17 or B12; plus Array 700 (Jan 2026) |
| B12/B17/B85 | T-Mobile | CURRENT | UNVERIFIED | weak source | A block; plus Array 700 (May 2026) |
| B12/B17/B85 | C Spire | CURRENT | UNVERIFIED | weak source | B12 |
| B13 | Verizon | CURRENT | UNVERIFIED | unverified background knowledge | nationwide coverage anchor |
| B13 | Cellcom | CURRENT | CURRENT | cited source | access to Verizon 700 (LRA partner) |
| B14 | AT&T | CURRENT | UNVERIFIED | unverified background knowledge | FirstNet public safety plus commercial |
| B25 | T-Mobile | CURRENT | UNVERIFIED | unverified background knowledge |  |
| B26 | T-Mobile | HISTORICAL | HISTORICAL | cited source | 800 MHz licences sold, closed 2026-08-10 |
| B26 | SpaceX (from Grain) | PENDING | PENDING | cited source | Grain 800 MHz to SpaceX |
| B29 | AT&T | CURRENT | UNVERIFIED | unverified background knowledge | downlink-only booster |
| B29 | Boost/EchoStar | HISTORICAL | UNVERIFIED | unverified background knowledge | E block |
| B30 | AT&T | CURRENT | UNVERIFIED | unverified background knowledge | capacity layer |
| B41 | T-Mobile | CURRENT | UNVERIFIED | weak source | residual LTE; mostly moved to n41 |
| B46 | AT&T | CURRENT | UNVERIFIED | unverified background knowledge | limited, urban |
| B46 | Verizon | CURRENT | UNVERIFIED | unverified background knowledge | limited, urban |
| B46 | T-Mobile | CURRENT | UNVERIFIED | unverified background knowledge | limited, urban |
| B48 | Verizon | CURRENT | UNVERIFIED | unverified background knowledge | capacity layer (CBRS) |
| B70 | Boost/EchoStar | HISTORICAL | HISTORICAL | cited source | traffic moved to AT&T by 2025-11-15 |
| B70 | SpaceX (from EchoStar) | PENDING | PENDING | cited source | spectrum sale pending |
| B71 | AT&T | PLANNED | PLANNED | cited source | owns ~20 MHz since 2026-07-28; multiyear build |
| B71 | T-Mobile | CURRENT | UNVERIFIED | weak source | coverage layer; plus Grain 600 (Aug 2026), Array 600 (May 2026) |
| B71 | Boost/EchoStar | HISTORICAL | HISTORICAL | cited source | licences now AT&T's |
| B71 | C Spire | CURRENT | UNVERIFIED | weak source | listed as n71 in research |

### NR

| Band | Carrier | Claim | Status | Evidence | Note |
|---|---|---|---|---|---|
| n2 | Verizon | CURRENT | UNVERIFIED | unverified background knowledge | DSS, 'Nationwide 5G' |
| n2 | T-Mobile | CURRENT | UNVERIFIED | weak source | some deployments |
| n2 | C Spire | CURRENT | UNVERIFIED | weak source |  |
| n5 | AT&T | CURRENT | UNVERIFIED | unverified background knowledge | DSS low-band '5G' |
| n5 | Verizon | CURRENT | UNVERIFIED | weak source | DSS, main low-band |
| n5 | Cellcom | CURRENT | CURRENT | cited source |  |
| n12 | C Spire | CURRENT | UNVERIFIED | weak source |  |
| n25 | T-Mobile | CURRENT | UNVERIFIED | weak source |  |
| n41 | T-Mobile | CURRENT | CURRENT | cited source | 'Ultra Capacity' core |
| n41 | C Spire | CURRENT | UNVERIFIED | weak source |  |
| n48 | Private networks / cable | CURRENT | UNVERIFIED | unverified background knowledge | private 5G and cable offload |
| n66 | Verizon | CURRENT | UNVERIFIED | unverified background knowledge | DSS |
| n66 | T-Mobile | CURRENT | UNVERIFIED | unverified background knowledge | some |
| n66 | Boost/EchoStar | HISTORICAL | UNVERIFIED | unverified background knowledge |  |
| n70 | Boost/EchoStar | HISTORICAL | UNVERIFIED | unverified background knowledge | partly sourced |
| n71 | AT&T | PLANNED | PLANNED | cited source | multiyear |
| n71 | T-Mobile | CURRENT | CURRENT | cited source | 'Extended Range' |
| n71 | Boost/EchoStar | HISTORICAL | UNVERIFIED | unverified background knowledge |  |
| n71 | C Spire | CURRENT | UNVERIFIED | weak source |  |
| n77 | AT&T | CURRENT | CURRENT | cited source | '5G+': C-band plus 3.45 GHz incl. EchoStar 30 MHz on ~23k sites |
| n77 | Verizon | CURRENT | UNVERIFIED | weak source | '5G UW': C-band, ~161 MHz average; partly sourced |
| n77 | T-Mobile | CURRENT | UNVERIFIED | weak source | unconfirmed live use; ~40 MHz C-band licences |
| n77 | C Spire | CURRENT | UNVERIFIED | weak source |  |
| n258 | T-Mobile | CURRENT | UNVERIFIED | weak source | listed only |
| n260 | AT&T | CURRENT | UNVERIFIED | weak source | mmWave; sources conflict |
| n260 | Verizon | CURRENT | CURRENT | cited source | mmWave |
| n261 | Verizon | CURRENT | CURRENT | cited source | mmWave |
| n261 | Cellcom | CURRENT | CURRENT | cited source | mmWave |

## 3. Known problems (from the research)

- B252 and B255 are satellite bands in the current standard. The older notes called them LTE-U; that meaning is dropped.
- B23 is marked 'not applicable' by Wikipedia. B70's channel-size note is unclear (the 25 MHz size is an NR thing, not LTE).
- Wikipedia's carrier lists are older than the 2026 spectrum sales (T-Mobile 800 MHz, UScellular, EchoStar), so they are not used for status.
- C Spire's band list is unsettled (weak sources only). The NR carrier table has no cited source for most rows.
- Not yet checked against the 3GPP documents: task T07. Carrier-code list: `content/carrier-codes.md`.
