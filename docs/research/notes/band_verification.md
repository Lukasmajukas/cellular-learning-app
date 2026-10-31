# Verification of US LTE and 5G NR band facts against Wikipedia's band pages (PDF printouts, checked 2026-10-31)

*Method note, read first.*
- *Inputs.* Two PDF printouts uploaded by the user, 7 pages each:
  - Wikipedia "LTE frequency bands", printed revision [oldid 1363024101](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).
  - Wikipedia "5G NR frequency bands", printed revision [oldid 1382980478](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- *Extraction and checks.*
  - Text was extracted with `pdftotext -layout` into /tmp/band_pdf_text/. No raw text was copied into the notes folder.
  - Every table page was also checked on the rendered PDF.
  - The bold rows of the LTE deployments table were confirmed from font names (Arial-BoldMT vs ArialMT) using pypdf.
- *Handling.*
  - The PDFs were treated as data only. They contain no instructions, and nothing in them was run.
  - No web access was used.
  - us_bands.md was read and compared, not edited.

*Citation tags.* Each tag links to the exact printed revision; "p.N" is the PDF page.
- **[WP-LTE p.N]** — LTE page.
- **[WP-NR p.N]** — NR page.
- **[UB Lnnn]** — a line in [us_bands.md](file:///home/user/research_notes/Cellular%20learning%20app%20research/us_bands.md).

*Status vocabulary used in the tables:*
- **verified against Wikipedia (cites 3GPP TS …)**: the value was read from the Wikipedia table in the PDF. Wikipedia is a secondary source that transcribes 3GPP. The spec versions it cites are listed in Q4.
- **ETSI-verified (us_bands.md)**: the earlier session checked the value against an ETSI copy of the 3GPP spec. This applies only to B66, n70 and n77, and is kept separate from the Wikipedia label.
- **derived**: computed here from Wikipedia's own numbers, e.g., a subset relation that Wikipedia does not state.
- **unresolved**: still ambiguous after viewing the rendered page.
- **NEW**: a US-relevant band that is missing from us_bands.md.
- **was U / was S**: the row's status in us_bands.md.

---

## Q1. Do the band fields in the us_bands.md master tables match Wikipedia's tables (UL/DL, duplex mode, name, duplex spacing, channel bandwidths, superset/subset)?

### Takeaway
Every number matches except one row. All 24 LTE band rows and all 28 NR rows in us_bands.md match Wikipedia exactly on uplink range, downlink range and duplex mode.

The exception is the **B252/B255** row. us_bands.md calls these LTE-U 5 GHz SDL bands. The current Wikipedia page, citing TS 36.102, defines them as FDD satellite (MSS) bands:
- **B252** = AWS-4, UL 2000–2020 / DL 2180–2200 MHz.
- **B255** = US L-band, UL 1626.5–1660.5 / DL 1525–1559 MHz.

The other mismatches are smaller:
- Missing subset relations: n48 ⊂ n77/n78, and B49 ⊂ B48.
- A 25 MHz B70 LTE channel that LTE does not define.
- An internal error in Wikipedia's own B85 "Subset of band" cell.
- B23 flagged "not applicable" by Wikipedia.
- Many name/label differences. Wikipedia uses names such as "Lower/Upper SMH", "Digital Dividend" and "C-Band". In FR2 it calls n257 "LMDS" and n261 "Ka-band".

### Cited Findings

**How Wikipedia's tables are built**
- **LTE table source.** The terrestrial LTE table is taken "From Tables 5.5-1 'E-UTRA Operating Bands' and 5.6.1-1 'E-UTRA Channel Bandwidth' of the latest published version of the 3GPP TS 36.101, TS 36.104 and TS 36.106". Its columns are: band, duplex mode, ƒ (MHz), common name, subset of band, uplink ("User Equipment transmit; Base Station receive"), downlink, duplex spacing, channel bandwidths and notes — [WP-LTE p.1–2](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).
- **NR table source.** The NR tables are "From the latest published version (Rel. 19) of the respective 3GPP technical standard (TS 38 series)". The page also says:
  - "When the NR band is overlapping with the 4G LTE band, they share the same band number".
  - FR1 and NTN channel bandwidths "depend on the Subcarrier Spacing (SCS) in use".
  - FR2 rows carry the footnote "Time-division duplexing (TDD) mode".

  Source: [WP-NR p.1–2, p.5](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- **NR names are not from 3GPP.** The NR "Common name" column header cites a 2014 Wiley book, *The Telecommunications Handbook*, Table 13.1 — [WP-NR p.2, p.6](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478). Treat names as less authoritative than numbers.

#### Corrected master table A — LTE terrestrial bands relevant to the US
Source for every value: [WP-LTE pp.2–3](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101); footnotes are on p.3. "UL above DL" means Wikipedia lists a negative duplex spacing. For TDD rows the single range serves both directions.

| Band | Wikipedia common name (ƒ MHz) | UL (MHz) | DL (MHz) | Duplex | Duplex spacing (MHz) | Channel BWs (MHz) | Subset / superset | Wikipedia notes / footnotes | Status |
|---|---|---|---|---|---|---|---|---|---|
| B2 | PCS (1900) | 1850–1910 | 1930–1990 | FDD | 80 | 1.4, 3, 5, 10, 15, 20 | ⊂ B25 | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B4 | AWS‑1 (1700) | 1710–1755 | 2110–2155 | FDD | 400 | 1.4, 3, 5, 10, 15, 20 | ⊂ B10, ⊂ B66 | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B5 | Cellular (850) | 824–849 | 869–894 | FDD | 45 | 1.4, 3, 5, 10 | ⊂ B26 | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B10 | Extended AWS (1700) | 1710–1770 | 2110–2170 | FDD | 400 | 5, 10, 15, 20 | ⊂ B66; ⊃ B4 | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B12 | Lower SMH (700) | 699–716 | 729–746 | FDD | 30 | 1.4, 3, 5, 10 | ⊂ B85; ⊃ B17 | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B13 | Upper SMH (700) | 777–787 | 746–756 | FDD, UL above DL | −31 | 5, 10 | — | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B14 | Upper SMH (700) | 788–798 | 758–768 | FDD, UL above DL | −30 | 5, 10 | — | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B17 | Lower SMH (700) | 704–716 | 734–746 | FDD | 30 | 5, 10 | ⊂ B12, ⊂ B85 | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B23 | AWS-4 (2000) | 2000–2020 | 2180–2200 | FDD | 180 | 1.4, 3, 5, 10, 15, 20 | same frequencies as satellite B252 (derived) | footnote: "Bands b6 and b23 are not applicable" | values verified against Wikipedia (cites 3GPP TS 36.101); band marked "not applicable"; was U |
| **B24 (NEW)** | Upper L‑Band (1600) | 1626.5–1660.5 ("Uplink restricted to 1627.5–1637.5 MHz and 1646.5–1656.5 MHz") | 1525–1559 ("Downlink restricted to 1526–1536 MHz") | FDD, UL above DL | −101.5 or −120.5 | 5, 10 | same frequencies as satellite B255 (derived) | US | verified against Wikipedia (cites 3GPP TS 36.101) |
| B25 | Extended PCS (1900) | 1850–1915 | 1930–1995 | FDD | 80 | 1.4, 3, 5, 10, 15, 20 | ⊃ B2 | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B26 | Extended Cellular (850) | 814–849 | 859–894 | FDD | 45 | 1.4, 3, 5, 10, 15 | ⊃ B5 (also ⊃ B18/B19, Japan) | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| **B27 (NEW)** | SMR (800) | 807–824 | 852–869 | FDD | 45 | 1.4, 3, 5, 10 | overlaps B26 at 814–824 / 859–869 (derived) | US | verified against Wikipedia (cites 3GPP TS 36.101) |
| B29 | Lower SMH (700) | — | 717–728 | SDL | — | 3, 5, 10 | ⊂ B44 (APT TDD 703–803; not a US band) | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B30 | WCS (2300) | 2305–2315 | 2350–2360 | FDD | 45 | 5, 10 | — | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| **B35 / B36 / B37 (NEW)** | PCS (1900) | TDD 1850–1910 / 1930–1990 / 1910–1930 | (TDD) | TDD | — | 1.4, 3, 5, 10, 15, 20 / same / 5, 10, 15, 20 | — | "PCS Uplink" / "PCS Downlink" / "PCS Duplex Spacing" | verified against Wikipedia (cites 3GPP TS 36.101); definition only, not in the deployments table |
| B41 | BRS (2500) | 2496–2690 | (TDD) | TDD | — | 5, 10, 15, 20 | ⊃ B38 (non-US) | US | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B46 | U-NII-1–4 (5200) | 5150–5925 | (TDD) | TDD | — | 10, 20 | ⊃ B47 | LAA | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| **B47 (NEW)** | U-NII-4 (5900) | 5855–5925 | (TDD) | TDD | — | 10, 20 | ⊂ B46 | V2X | verified against Wikipedia (cites 3GPP TS 36.101) |
| B48 | CBRS (3500) | 3550–3700 | (TDD) | TDD | — | 5, 10, 15, 20 | ⊃ B49 | US | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B49 | C-Band (3500) | 3550–3700 | (TDD) | TDD | — | 10, 20 | ⊂ B48 | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B53 | S-Band (2400) | 2483.5–2495 | (TDD) | TDD | — | 1.4, 3, 5, 10 | — | — | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B66 | Extended AWS (1700) | 1710–1780 | 2110–2200 ("Downlink between 2180–2200 MHz restricted to intra-band Supplemental Downlink") | FDD (asymmetric) | 400 | 1.4, 3, 5, 10, 15, 20 | ⊃ B4, ⊃ B10 | "AWS‑1–3" | verified against Wikipedia (cites 3GPP TS 36.101) **and** ETSI-verified (us_bands.md: ETSI TS 136 101 V15.9.0) |
| B70 | Supplementary AWS (1700) | 1695–1710 | 1995–2020 | FDD (asymmetric) | 300 or 295 ("depends on whether the Uplink is paired with the lower or the upper part of the Downlink, with the remainder of the Downlink available for use as intra-band Supplemental Downlink") | 5, 10, 15, 20, with footnote "Carrier aggregation only" printed after "20"; scope **unresolved** | — | "AWS‑2–4"; "Downlink is made up of the PCS-H downlink block and the AWS-4 uplink blocks. The uplink is made up of the AWS-3 unpaired blocks" | ranges and spacing verified against Wikipedia (cites 3GPP TS 36.101); BW footnote scope unresolved; was U |
| B71 | Digital Dividend (600) | 663–698 | 617–652 | FDD, UL above DL | −46 | 5, 10, 15, 20 | inside NR n105's ranges (derived) | US | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| **B74 (NEW)** | Lower L‑Band (1500) | 1427–1470 | 1475–1518 | FDD | 48 | 1.4, 3, 5, 10, 15, 20 | — | US | verified against Wikipedia (cites 3GPP TS 36.101) |
| B85 | Extended Lower SMH (700) | 698–716 | 728–746 | FDD | 30 | 5, 10 | ⊃ B12, ⊃ B17, per the B12 and B17 rows and the numbers. B85's own "Subset of band" cell reads "12", a Wikipedia error | — | ranges verified against Wikipedia (cites 3GPP TS 36.101); relation per numbers; was U |
| B103 | Upper SMH (700) | 787–788 | 757–758 | FDD, UL above DL | −30 (printed "-30") | none listed | — | "Restricted to NB-IoT only" | verified against Wikipedia (cites 3GPP TS 36.101); was U |
| B106 | LMR (900) | 896–901 | 935–940 | FDD | 39 | 1.4, 3 | — | US | verified against Wikipedia (cites 3GPP TS 36.101); was U |

#### Corrected master table B — LTE satellite-access bands relevant to the US
Source: [WP-LTE p.4](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101). Wikipedia's footnotes for this table:
- "Satellite bands are numbered in descending order from 256".
- Uplink = "UE transmit; SAN receive".
- The channel-bandwidth column is empty: "Supported channel bandwidths depend on the UE category".

| Band | Wikipedia common name (ƒ MHz) | UL (MHz) | DL (MHz) | Duplex | Duplex spacing (MHz) | Notes | Status |
|---|---|---|---|---|---|---|---|
| B252 | AWS-4 (2100) | 2000–2020 | 2180–2200 | FDD | 180 | MSS | verified against Wikipedia (cites 3GPP TS 36.102 / TS 36.108); **replaces** the LTE-U meaning in us_bands.md |
| **B253 (NEW)** | L-band (US) (1600) | 1668–1675 | 1518–1525 | FDD, UL above DL | −150 | MSS | verified against Wikipedia (cites 3GPP TS 36.102 / TS 36.108) |
| B255 | L-band (US) (1600) | 1626.5–1660.5 | 1525–1559 | FDD, UL above DL | −101.5 | MSS | verified against Wikipedia (cites 3GPP TS 36.102 / TS 36.108); **replaces** the LTE-U meaning in us_bands.md |
| **B249 (NEW)** | L-band (US) (1600) | 1616–1626.5 (TDD) | (TDD) | TDD | — | "Band 249 is defined only for NB-IoT operation" | verified against Wikipedia (cites 3GPP TS 36.102 / TS 36.108) |
| **B254 (NEW; no US label)** | S-band (2400) | 1610–1626.5 | 2483.5–2500 | FDD | 873.5 | MSS | verified against Wikipedia (cites 3GPP TS 36.102 / TS 36.108); US relevance unresolved |
| **B256 (NEW; no US label)** | S-band (2100) | 1980–2010 | 2170–2200 | FDD | 190 | MSS | verified against Wikipedia (cites 3GPP TS 36.102 / TS 36.108); US relevance unresolved (see Inferences) |

#### Corrected master table C — NR FR1 terrestrial bands relevant to the US
Source for every value: [WP-NR pp.2–4](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478); footnotes are on p.4. Bandwidth footnote shorthand:
- "DL only" = Wikipedia's "Downlink only".
- "CA+DL only" = "Carrier aggregation and downlink only".
- "CA/DC only" = "Carrier aggregation or dual connectivity only".

| Band | Wikipedia common name (ƒ MHz) | UL (MHz) | DL (MHz) | Duplex | Duplex spacing (MHz) | Channel BWs (MHz) | Subset / superset | Wikipedia notes / footnotes | Status |
|---|---|---|---|---|---|---|---|---|---|
| n2 | PCS (1900) | 1850–1910 | 1930–1990 | FDD | 80 | 5, 10, 15, 20, 25, 30, 35, 40 | ⊂ n25 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was S (from a Wikipedia search snippet) |
| n5 | CLR (850) | 824–849 | 869–894 | FDD | 45 | 3, 5, 7, 10, 15, 20, 25 (25 DL only) | ⊂ n26 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n12 | Lower SMH (700) | 699–716 | 729–746 | FDD | 30 | 3, 5, 10, 15 | ⊂ n85 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n13 | Upper SMH (700) | 777–787 | 746–756 | FDD, UL above DL | −31 | 5, 10 | — | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n14 | Upper SMH (700) | 788–798 | 758–768 | FDD, UL above DL | −30 | 5, 10 | — | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| **n24 (NEW)** | Upper L-band (1600) | 1626.5–1660.5 (restricted to 1627.5–1637.5 and 1646.5–1656.5) | 1525–1559 (restricted to 1526–1536) | FDD, UL above DL | −101.5 | 5, 10 | same frequencies as NTN n255 (derived) | US | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| n25 | Extended PCS (1900) | 1850–1915 | 1930–1995 | FDD | 80 | 5, 10, 15, 20, 25, 30, 35, 40, 45 (45 DL only) | ⊃ n2 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n26 | Extended CLR (850) | 814–849 | 859–894 | FDD | 45 | 3, 5, 7, 10, 15, 20, 25, 30 (25 and 30 CA+DL only) | ⊃ n5 (also ⊃ n18, Japan) | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n29 | Lower SMH (700) | — | 717–728 | SDL | — | 5, 10 | — | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n30 | WCS (2300) | 2305–2315 | 2350–2360 | FDD | 45 | 5, 10 | — | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n41 | BRS (2500) | 2496–2690 | (TDD) | TDD | — | 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100 | ⊃ n38 (non-US); same range as n90 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n46 | U-NII-1–4 (5200) | 5150–5925 | (TDD) | TDD | — | 10 (CA+DL only), 20, 40, 60, 80, 100 | — | "5G NR Unlicensed" | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| **n47 (NEW)** | U-NII-4 (5900) | 5855–5925 | (TDD) | TDD | — | 10, 20, 30, 40 | inside n46 (derived; not stated) | V2X | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| n48 | CBRS (3500) | 3550–3700 | (TDD) | TDD | — | 5 (CA/DC only), 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100 (each of 50–100 CA+DL only) | **⊂ n77, ⊂ n78** | US | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| **n53 (NEW)** | S band (2400) | 2483.5–2495 | (TDD) | TDD | — | 5, 10 | — | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| n66 | Extended AWS (1700 / 2100) | 1710–1780 | 2110–2200 ("Downlink between 2180–2200 MHz restricted to intra-band Supplemental Downlink") | FDD (asymmetric) | 400 | 5, 10, 15, 20, 25, 30, 35, 40, 45 | — | "Supports asymmetrical bandwidth combinations" | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n70 | Supplementary AWS (2000) | 1695–1710 | 1995–2020 | FDD (asymmetric) | 300 | 5, 10, 15, 20 (DL only), 25 (DL only) | — | "Supports asymmetrical bandwidth combinations" | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) **and** ETSI-verified (us_bands.md: ETSI TS 138 101-1 V15.14.0) |
| n71 | Digital Dividend (600) | 663–698 | 617–652 | FDD, UL above DL | −46 | 5, 10, 15, 20, 25, 30, 35 (25/30/35 DL only) | ⊂ n105 (derived; Wikipedia does not state it) | US; "Supports asymmetrical bandwidth combinations" | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| **n74 (NEW)** | Lower L-Band (1500) | 1427–1470 | 1475–1518 | FDD | 48 | 5, 10, 15, 20 | — | US | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| n77 | C-Band (3700) | 3300–4200 | (TDD) | TDD | — | 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100 | ⊃ n78, ⊃ n48 | notes cite press refs [10][11][12] | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) **and** ETSI-verified (us_bands.md: ETSI TS 138 101-1 V15.14.0, V16.5.0, V15.24.0) |
| n78 | C-Band (3500) | 3300–3800 | (TDD) | TDD | — | same set as n77 | ⊂ n77; ⊃ n48 | notes cite press refs [10][11][12] | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n79 | C-Band (4500) | 4400–5000 | (TDD) | TDD | — | 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 | — | notes cite press refs [10][11][12] | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n85 | Extended Lower SMH (700) | 698–716 | 728–746 | FDD | 30 | 3, 5, 10, 15 | ⊃ n12 | — | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| **n90 (NEW)** | BRS (2500) | 2496–2690 | (TDD) | TDD | — | same set as n41 | ⊃ n38 | "Technologically identical to n41 but requires UL rasterization to allow for DSS" | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); US relevance inferred from "BRS" |
| n96 | U-NII-5–8 (6000) | 5925–7125 | (TDD) | TDD | — | 20, 40, 60, 80, 100 | ⊃ n102 (stated); ⊃ n104 (derived) | "5G NR Unlicensed" | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| **n99 (NEW)** | Upper L-band (1600) | 1626.5–1660.5 (restricted as for n24) | — | SUL | — | 5, 10 | same as n24's UL (derived) | US | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| **n102 (NEW)** | U-NII-5 (6200) | 5925–6425 | (TDD) | TDD | — | 20, 40, 60, 80, 100 | ⊂ n96 | "5G NR Unlicensed" | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| **n104 (NEW)** | U-NII-6–8 (6700) | 6425–7125 | (TDD) | TDD | — | 20, 30, 40, 50, 60, 70, 80, 90, 100 | ⊂ n96 (derived; not stated) | (no NR-U footnote in this row) | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19) |
| n105 | Digital Dividend (600) | 663–703 | 612–652 | FDD, UL above DL | −51 | 5, 10, 15, 20, 25, 30, 35 (25/30/35 DL only) | ⊃ n71 (derived) | APT | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |
| n106 | LMRS (900) | 896–901 | 935–940 | FDD | 39 | 3 | — | US | verified against Wikipedia (cites 3GPP TS 38.101-1 / 38.104, Rel-19); was U |

#### Corrected master table D — NR FR2 (mmWave)
Source: [WP-NR p.5](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478). All FR2 bands are TDD, per the footnote "Time-division duplexing (TDD) mode".

| Band | Wikipedia common name (ƒ GHz) | UL / DL (GHz) | Channel BWs (MHz) | Subset / superset | Notes | Status |
|---|---|---|---|---|---|---|
| n257 | LMDS (28) | 26.50–29.50 | 50, 100, 200, 400 | ⊃ n261 | — | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); was S (secondary tables) |
| n258 | K-band (26) | 24.25–27.50 | 50, 100, 200, 400 | — | — | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); was S |
| n259 | V-band (41) | 39.50–43.50 | 50, 100, 200, 400 | — | — | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); was S |
| n260 | Ka-band (39) | 37.00–40.00 | 50, 100, 200, 400 | — | — | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); was S |
| n261 | Ka-band (28) | 27.50–28.35 | 50, 100, 200, 400 | ⊂ n257 | — (no US label) | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); was S |
| n262 | V-band (47) | 47.20–48.20 | 50, 100, 200, 400 | — | — | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); was S |
| **n263 (NEW; no US label)** | V-band (60) | 57.00–71.00 | 100, 400, 800, 1600, 2000 | — | "5G NR Unlicensed" | verified against Wikipedia (cites 3GPP TS 38.101-2 / 38.104, Rel-19); US relevance unresolved |

#### Corrected master table E — NR non-terrestrial (satellite) bands relevant to the US
Source: [WP-NR pp.5–6](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478). Wikipedia notes that "NTN satellite bands are numbered in descending order from n256". All rows are NEW; us_bands.md has no NTN bands.

| Band | Wikipedia common name (ƒ) | UL | DL | Duplex | Duplex spacing (MHz) | Channel BWs (MHz) | Notes | Status |
|---|---|---|---|---|---|---|---|---|
| n252 | AWS-4 (2100 MHz) | 2000–2020 MHz | 2180–2200 MHz | FDD | 180 | 5, 10, 15, 20 | MSS | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19) |
| n255 | L-band (1600 MHz) | 1626.5–1660.5 MHz | 1525–1559 MHz | FDD, UL above DL | −101.5 | 3, 5, 10, 15, 20 | MSS (its LTE twin B255 is labeled "L-band (US)") | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19) |
| n253 | L-band (1600 MHz) | 1668–1675 MHz | 1518–1525 MHz | FDD, UL above DL | −150 | 5 | MSS (its LTE twin B253 is labeled "L-band (US)") | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19) |
| n251 | L-band (1600 MHz) | 1626.5–1660.5 MHz | 1518–1559 MHz | FDD, UL above DL | −108.5 | 5, 10, 15, 20 | MSS | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19); no US label |
| n250 | L-band (1600 MHz) | 1668–1675 MHz | 1518–1559 MHz | FDD, UL above DL | −150 | 5, 10, 15, 20 ("Larger bandwidths only applicable to downlink") | — | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19); no US label |
| n254 | S-band (downlink) / L-band (uplink) (2400 MHz) | 1610–1626.5 MHz | 2483.5–2500 MHz | FDD | 873.5 | 3, 5, 10, 15 | MSS | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19); no US label |
| n256 | S-band (2100 MHz) | 1980–2010 MHz | 2170–2200 MHz | FDD | 190 | 3, 5, 10, 15, 20 | MSS | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19); no US label (see Inferences) |
| n510 | Ka-band (28 GHz) | 27.50–28.35 GHz | 17.30–20.20 GHz | FDD | — | 50, 100, 200, 400 | US | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19) |
| n511 | Ka-band (28 GHz) | 28.35–30.00 GHz | 17.30–20.20 GHz | FDD | — | 50, 100, 200, 400 | US | verified against Wikipedia (cites 3GPP TS 38.101-5 / 38.108, Rel-19) |

#### Discrepancy list

**A. Substantive discrepancies.** These cover numbers, duplex mode, band definitions, subset relations, bandwidths and status, and would change app content. Wikipedia sources: [WP-LTE](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101), [WP-NR](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478). us_bands.md: [UB](file:///home/user/research_notes/Cellular%20learning%20app%20research/us_bands.md).

| # | Band | Field | us_bands.md value | Wikipedia value | Type / action |
|---|---|---|---|---|---|
| 1 | B252 | whole definition (name, UL, DL, duplex) | "LTE-U SDL (U-NII-1)", UL —, DL 5150–5250, SDL, "HISTORICAL (LTE-U, about 2017)" [UB L73] | Satellite-access band: FDD, ƒ 2100, "AWS-4", UL 2000–2020, DL 2180–2200, spacing 180, MSS [WP-LTE p.4] | **CONFLICT.** Replace with the satellite definition. Wikipedia lists no LTE-U bands at all |
| 2 | B255 | whole definition | "LTE-U SDL (U-NII-3)", DL 5725–5850, SDL [UB L73] | FDD, ƒ 1600, "L-band (US)", UL 1626.5–1660.5, DL 1525–1559, spacing −101.5, MSS [WP-LTE p.4] | **CONFLICT.** Replace |
| 3 | B252/B255 | channel BW | 20 MHz [UB L73] | none listed: "Supported channel bandwidths depend on the UE category" [WP-LTE p.4] | **CONFLICT** |
| 4 | B46 | superset/subset | "spans B252/B255 frequencies" [UB L63] | B47 lists "Subset of band: 46"; B252/B255 are not 5 GHz bands [WP-LTE p.2, p.4] | **CONFLICT.** Change to "⊃ B47" |
| 5 | B70 | channel BW | "≤15 MHz UL / ≤25 MHz DL" (typical-BW column, [U]) [UB L68] | LTE BWs 5, 10, 15, 20, with "Carrier aggregation only" after 20; there is no 25 MHz LTE channel [WP-LTE p.3]. NR n70 does allow 25 MHz, DL only [WP-NR p.3] | **CONFLICT for LTE** (fine for NR). Teach as 15 MHz UL block / 25 MHz DL block, not as LTE channel sizes |
| 6 | n48 | superset/subset | "—" [UB L90] | "Subset of band: n77, n78" [WP-NR p.2] | **MISSING RELATION.** Add |
| 7 | B49 | superset/subset | "—" [UB L65] | "Subset of band: 48" [WP-LTE p.2] | **MISSING RELATION.** Add |
| 8 | B49 | common name | "CBRS (LAA-style)" [UB L65] | "C-Band", ƒ 3500; no LAA note in the row [WP-LTE p.2] | **LABEL CONFLICT.** "LAA-style" is not supported by the PDF |
| 9 | B85 | superset/subset | "⊃ B12 ⊃ B17" [UB L70] | B85's own row reads "Subset of band: 12". But B12's row reads "85" and B17's reads "12, 85", and the numbers (698–716/728–746 vs 699–716/729–746) make B85 the superset [WP-LTE p.2–3] | **Wikipedia internal error.** Keep the us_bands.md value |
| 10 | B23 | status | Treated as a defined band: "Dish's original AWS-4 band; effectively replaced by B70 + B66 SDL" [UB L57] | Footnote on B23 (and B6): "Bands b6 and b23 are not applicable" [WP-LTE p.2–3] | **STATUS ADDITION.** Mark "not applicable (per Wikipedia)" |
| 11 | B26 | what B26 adds over B5 | "This ESMR slice [817–824/862–869] is what B26 adds on top of B5" [UB L29] | B26 is 814–849/859–894 and B5 is 824–849/869–894, so B26 adds 814–824/859–869, i.e., 10 MHz each way [WP-LTE p.2] | **IMPRECISE.** T-Mobile's 7 MHz slice sits inside B26's 10 MHz extension (derived) |
| 12 | n261 | name / region | "28 GHz (US)"; Q1 text "'US LMDS 28 GHz', a US-specific subset of n257" [UB L105, L24] | "Ka-band", ƒ 28; Notes blank (no US label); ⊂ n257 confirmed. "LMDS" is n257's name [WP-NR p.5] | **LABEL CONFLICT.** The "US-specific" claim is not supported here (but not contradicted) |
| 13 | n257 | name | "28 GHz (global)" [UB L101] | "LMDS", ƒ 28 [WP-NR p.5] | LABEL |
| 14 | n260 | name | "39 GHz"; "US 39 GHz" [UB L104, L23] | "Ka-band", ƒ 39; no US note [WP-NR p.5] | LABEL |
| 15 | (Q5 rule) | reverse-duplex list | "B13, B14, B71/n71 … Every other common US FDD band has uplink below downlink" [UB L390] | Negative duplex spacing also appears on B103 (−30), B24 (−101.5 or −120.5), n24 (−101.5) and n105 (−51), plus the satellite bands B253/n253 (−150), B255/n255 (−101.5), n251 (−108.5) and n250 (−150) [WP-LTE p.2–4; WP-NR p.2–5] | **INCOMPLETE.** Add these as the "uncommon" reverse-duplex bands |
| 16 | FR2 definition | frequency ranges | "FR2-1 = 24.25–52.6 GHz; FR2-2 = 52.6–71 GHz (Rel-17)" [U] [UB L108] | "Frequency Range 2 (FR2) includes frequency bands from 24.25 GHz to 71.0 GHz"; no FR2-1/FR2-2 split stated [WP-NR p.1] | **NOT VERIFIED.** No conflict; only the overall range is confirmed |
| 17 | n66 | DL restriction | DL "2110–2200" with no restriction note [UB L91] (the B66 row has it [UB L67]) | n66 DL 2110–2200, with footnote "Downlink between 2180–2200 MHz restricted to intra-band Supplemental Downlink" [WP-NR p.3] | **MISSING DETAIL.** Add |
| 18 | n71 / n105 | relation | n71 "⊂ n105"; n105 "⊃ n71" [UB L93, L99] | Neither row lists a subset relation [WP-NR p.3–4]. The numbers confirm it: 663–698 ⊂ 663–703 and 617–652 ⊂ 612–652 | NOT STATED BY WIKIPEDIA. Keep, labeled "derived" |
| 19 | n96 / n104 | relation | n96 "⊃ n104" [UB L98] | Wikipedia lists n102 (not n104) as a subset of n96 [WP-NR p.4]. The numbers confirm n104 ⊂ n96 too | NOT STATED. Keep; add n102 |
| 20 | B29 | relation | "—" [UB L60] | "Subset of band: 44" (B44 = APT TDD 703–803, non-US) [WP-LTE p.2] | MINOR (not US-relevant) |
| 21 | B70 / n70 | duplex spacing | Variable spacing noted, no number given [UB L15, L68] | B70 "300 or 295" [WP-LTE p.3]; n70 "300" [WP-NR p.3] | MISSING VALUE. Add |
| 22 | B103 | BW / status | "NB-IoT (sub-1 MHz)"; "U (introduction is S)" [UB L71] | No BW listed; "Restricted to NB-IoT only"; band number 103 and frequencies confirmed [WP-LTE p.3] | Consistent. Upgrade to verified; "sub-1 MHz" is not stated |

Duplex spacing and the allowed channel-bandwidth sets were missing from every us_bands.md row. Tables A–E now supply them from Wikipedia. These gaps are additions, not conflicts.

**B. Name / label differences (no numeric conflict).** us_bands.md uses US FCC block names; Wikipedia uses 3GPP-style names. Sources: [WP-LTE pp.2–3](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101); [WP-NR pp.2–5](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478); [UB L49–106](file:///home/user/research_notes/Cellular%20learning%20app%20research/us_bands.md).

| Band(s) | us_bands.md label | Wikipedia common name (ƒ) | Comment |
|---|---|---|---|
| B12 / n12 | Lower 700 A/B/C | Lower SMH (700) | Block letters are not in Wikipedia; "SMH" is never expanded on either page |
| B13 / n13 | Upper 700 C | Upper SMH (700) | — |
| B14 / n14 | Upper 700 D + Public Safety Broadband ("FirstNet") | Upper SMH (700) | Deployments table shows "USA (FirstNet/AT&T)" [WP-LTE p.5] |
| B17 | Lower 700 B/C | Lower SMH (700) | — |
| B29 / n29 | Lower 700 D/E | Lower SMH (700) | — |
| B85 / n85 | Extended Lower 700 (A/B/C) | Extended Lower SMH (700) | — |
| B103 | Upper 700 A block | Upper SMH (700) | — |
| B26 / n26 | Extended 850 (ESMR + Cellular) | Extended Cellular (850) for LTE; Extended CLR (850) for NR | Wikipedia's own LTE and NR names differ |
| n5 | Cellular 850 | CLR (850) | B5 is "Cellular" in the LTE table |
| B41 / n41 | BRS/EBS 2.5 GHz | BRS (2500) | EBS is not mentioned |
| B53 | Globalstar 2.4 GHz | S-Band (2400) | Globalstar is not named |
| B66 | AWS-1 + AWS-3 (+ AWS-4 DL), "Extended AWS" | Extended AWS (1700); notes "AWS‑1–3" | Wikipedia does not mention AWS-4 for B66 |
| n66 | AWS-1/AWS-3 | Extended AWS (ƒ printed as 1700 / 2100) | — |
| B70 / n70 | AWS-4 / H-block / AWS-3 unpaired ("Dish band") | Supplementary AWS; notes "AWS‑2–4"; ƒ 1700 for B70 but 2000 for n70 | The components match Wikipedia's B70 footnote |
| B71 / n71 | 600 MHz | Digital Dividend (600); "USDD" in the deployments table | — |
| n105 | Extended 600 (APT) | Digital Dividend (600); notes "APT" | — |
| B106 / n106 | 900 MHz broadband (Anterix) | LMR (900) for B106; LMRS (900) for n106 | Anterix is not named |
| n25 | PCS A–G | Extended PCS (1900) | B25's label already includes "Extended PCS" |
| n77 | C-band + 3.45 GHz (3.3–4.2 GHz) | C-Band (3700) | — |
| n78 | 3.5 GHz (global) | C-Band (3500) | — |
| n79 | 4.5 GHz | C-Band (4500) | — |
| n96 | 6 GHz unlicensed | U-NII-5–8 (6000), "5G NR Unlicensed" | — |
| n258 | 24/26 GHz | K-band (26 GHz) | — |
| n259 | 41 GHz | V-band (41 GHz) | — |
| n262 | 47 GHz | V-band (47 GHz) | — |

These labels agree in substance: B2 "PCS", B4 "AWS‑1", B5 "Cellular", B10 "Extended AWS", B23 "AWS-4", B25 "Extended PCS", B30/n30 "WCS", B46 "U-NII-1–4" + "LAA", n46 "U-NII-1–4" + NR-U, B48/n48 "CBRS", n2 "PCS".

**C. The "Other block/frequency facts" in us_bands.md [UB L108–115], checked against Wikipedia**

| us_bands.md fact ([U]) | What the PDFs show | Result |
|---|---|---|
| FR1 = 410–7125 MHz | FR1 "has been extended to cover … from 410 MHz to 7125 MHz" [WP-NR p.1] | verified against Wikipedia (cites 3GPP TS 38.101-1) |
| FR2-1 / FR2-2 split | Only "24.25 GHz to 71.0 GHz" [WP-NR p.1] | Overall range verified; split not verified |
| AWS-4 = 2000–2020 / 2180–2200 | B23 "AWS-4" 2000–2020 / 2180–2200; B252 and n252 "AWS-4" use the same ranges [WP-LTE p.2, p.4; WP-NR p.5] | verified against Wikipedia (cites 3GPP TS 36.101) |
| Unpaired AWS-3 = 1695–1710 | B70 UL 1695–1710 "is made up of the AWS-3 unpaired blocks" [WP-LTE p.3] | verified against Wikipedia footnote |
| Paired AWS-3 = 1755–1780 / 2155–2180 | B66 minus B4 leaves 1755–1780 / 2155–2200, whose top 20 MHz (2180–2200) is the SDL-restricted part; B66 notes say "AWS‑1–3" [WP-LTE p.2–3] | Numbers consistent (derived); the block name is not stated |
| H-block = 1915–1920 / 1995–2000 | B70 DL 1995–2020 = "PCS-H downlink block and the AWS-4 uplink blocks", and AWS-4 UL = 2000–2020, so H DL = 1995–2000 (derived). 1915–1920 appears in no table [WP-LTE p.2–3] | DL derived; UL not verifiable |
| PCS G block = 1910–1915 / 1990–1995 | B25 minus B2 = 1910–1915 / 1990–1995 [WP-LTE p.2] | Numbers derived; "G block" is not named |
| Lower 700 D = 716–722, E = 722–728 | B29/n29 DL starts at **717**: 717–728 [WP-LTE p.2; WP-NR p.2] | Not verifiable. B29's lower edge is 1 MHz above the [U] D-block edge; do not equate them without checking |
| C-band Auction 107 blocks; 3.45 GHz = 3.45–3.55 GHz | Not in either PDF | Not verifiable here |

### Inferences
- **The us_bands.md numbers were sound.** The [U] frequency and duplex values were accurate background knowledge: 24 LTE and 28 NR rows match. They can be relabeled "verified against Wikipedia". Only the B252/B255 row needs replacing, and only relations and labels need editing elsewhere.
- **Wikipedia's spacing column is internally consistent.** For every FDD/SDL-paired row checked, the duplex spacing equals the DL lower edge minus the UL lower edge. Examples: B66 2110−1710 = 400; B71 617−663 = −46; B13 746−777 = −31; n105 612−663 = −51; B24 1525−1626.5 = −101.5. B24's alternative −120.5 equals the restricted edges 1526−1646.5. B70's "295" cannot be reproduced from band edges alone; it depends on the pairing described in the footnote.
- **Band numbers 252–256 now mean satellite bands.** In 3GPP numbering as Wikipedia presents it, they are satellite bands counted down from 256. The app should not teach B252/B255 as LTE-U unless it has a separately sourced, dated historical caveat.
- **New CBRS quiz fact: n48 ⊂ n77 and n48 ⊂ n78.** CBRS (3550–3700) sits inside both the wide C-band NR band and the global 3.5 GHz band. In LTE, B48 has no LTE superset; only B49 sits inside it.
- **Wikipedia itself disagrees between B70 and n70.** The ƒ label differs (1700 vs 2000) and so does the duplex spacing ("300 or 295" vs "300"). The app should show B70 = 300/295 and n70 = 300, with Wikipedia as the source.
- **n256 is probably not a US band.** Its UL (1980–2010) overlaps the B25/n25 DL (1930–1995) and the B70/n70 DL (1995–2020). Its DL (2170–2200) overlaps the top of the B66/n66 DL. This is derived from the numbers. The US 2 GHz satellite band in Wikipedia's tables is n252/B252 (AWS-4), the same frequencies as terrestrial B23.
- **Terrestrial and satellite bands share frequencies.** B23 ↔ B252/n252 (AWS-4); B24/n24/n99 ↔ B255/n255 (L-band); the UL of NTN n510 (27.50–28.35 GHz) is exactly n261's range. All three are derived.
- **LTE B42 and B43 overlap US mid-band but are not deployed here.** B42 (3400–3600) and B43 (3600–3800) overlap the US 3.45 GHz segment and the lower C-band. Wikipedia's deployments table lists only Canadian operators for them in North America [WP-LTE p.6](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101). That is consistent with us_bands.md treating US 3.45 GHz/C-band as NR-only (n77).
- **Rows previously cited to Wikipedia are confirmed.** us_bands.md cited Wikipedia via search snippets for the B66 footnote, the B70 variable spacing and n2 [UB L14–16]. All three match the printed revision.

### Gaps
- **B70 bandwidth footnote unresolved.** The LTE row prints "5, 10, 15, 20[B 6]", where footnote 6 reads "Carrier aggregation only". It is unclear whether the footnote covers 20 MHz only or the whole list.
- **No direct 3GPP check.** Wikipedia is secondary. TS 36.101 V19.3.0 and TS 38.101-1 V19.3.1 themselves were not accessible (sites blocked, no search budget), so a final production check against the specs is still advisable.
- **Columns Wikipedia does not cover.** The Tier, "typical US channel BW" and "Role in US networks" columns of us_bands.md cannot be checked against these pages. They keep their earlier [U]/[W]/[S] tags.
- **"SMH" never expanded.** Neither page spells out "SMH".
- **n89 bandwidth list.** n89 (SUL 824–849) prints "5, 10, 15, 20," with a trailing comma. The list may be truncated in Wikipedia (unresolved; low priority).
- **No LTE satellite bandwidths.** The LTE satellite table lists none; the NR NTN table does.

---

## Q2. Which US-relevant bands appear in the Wikipedia tables but are missing from us_bands.md, or vice versa?

### Takeaway
Only one thing in us_bands.md is absent from Wikipedia: the LTE-U meaning of B252/B255. In the other direction, Wikipedia lists about 30 US-relevant bands that us_bands.md lacks:
- **US-labeled terrestrial bands:** B24/n24, n99 (Upper L-band); B27 (SMR); B74/n74 (Lower L-band).
- **US PCS TDD bands:** B35–B37.
- **V2X:** B47/n47.
- **6 GHz:** n102 and n104.
- **NR twins:** n53 and n90.
- **Satellite bands:**
  - LTE: B249, B253 and B255, labeled "L-band (US)"; B252 (AWS-4).
  - NR NTN: n250–n256.
  - FR2 NTN: n510 and n511, labeled "US".

n85 is **not** missing (us_bands.md L97 has it).

### Cited Findings
**In us_bands.md but not in Wikipedia**
- The LTE-U SDL meaning of B252/B255 [UB L73](file:///home/user/research_notes/Cellular%20learning%20app%20research/us_bands.md). The LTE page lists no LTE-U bands; 252 and 255 appear only in the satellite-access table — [WP-LTE pp.2–4](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101). Every other band in the us_bands.md tables appears in Wikipedia with identical numbers (Q1).

**In Wikipedia, US-relevant, and missing from us_bands.md.** A grep of us_bands.md found none of these band numbers. The two partial exceptions: n104 appears only inside n96's superset cell [UB L98], and n110 appears only as an example of a 3GPP draft CR [UB L440].

(a) Bands Wikipedia explicitly marks as US:
- B24 "Upper L‑Band", US — [WP-LTE p.2](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101). n24 "Upper L-band", US, and n99 (SUL, same UL), US — [WP-NR p.2, p.4](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- B27 "SMR", 807–824 / 852–869, US — [WP-LTE p.2](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).
- B74 and n74 "Lower L‑Band", 1427–1470 / 1475–1518, US — [WP-LTE p.3](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101); [WP-NR p.3](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- Satellite B249, B253 and B255, each "L-band (US)" — [WP-LTE p.4](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).
- NTN FR2 n510 (27.50–28.35 / 17.30–20.20 GHz) and n511 (28.35–30.00 / 17.30–20.20 GHz), both "US"; n512 is "EU" — [WP-NR p.6](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).

(b) Bands on US frequencies or with US (FCC) names, but no explicit US label:
- B35/B36/B37, TDD on PCS uplink / downlink / duplex gap — [WP-LTE p.2](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).
- B47 and n47 "U-NII-4", 5855–5925, V2X — [WP-LTE p.2](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101); [WP-NR p.2](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- n102 "U-NII-5", 5925–6425 (⊂ n96), and n104 "U-NII-6–8", 6425–7125 — [WP-NR p.4](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- n53 "S band", 2483.5–2495: the NR twin of B53, which us_bands.md has — [WP-NR p.3](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- n90 "BRS", 2496–2690, "Technologically identical to n41 but requires UL rasterization to allow for DSS" — [WP-NR p.3](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- Satellite B252 and n252 "AWS-4" — [WP-LTE p.4](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101); [WP-NR p.5](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- NTN n250, n251, n253 and n255 (L-band MSS; n253 and n255 have LTE twins labeled "(US)"), and n254 / B254 (L-band UL / S-band DL) — [WP-NR p.5](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478); [WP-LTE p.4](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).
- SUL bands on US uplink frequencies: n86 "Extended AWS", 1710–1780 (⊂ n80), and n89 "CLR", 824–849 — [WP-NR p.3](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).

(c) Region not given; US relevance unresolved:
- B54 and n54, TDD 1670–1675 — [WP-LTE p.3](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101); [WP-NR p.3](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- n110 "L-Band", FDD 1390–1395 / 1432–1435, spacing 42, BW 3 — [WP-NR p.4](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- n256 and B256 "S-band", 1980–2010 / 2170–2200 — [WP-NR p.5](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478); [WP-LTE p.4](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).
- n263, 57–71 GHz, NR-U — [WP-NR p.5](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- Ku-band NTN: n247 and n248 (FR1-NTN table, ƒ 14000 MHz) and n508/n509 (FR2-NTN) — [WP-NR pp.5–6](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).

**Answers to the examples in the brief**
- **n85:** not missing. us_bands.md L97 lists 698–716 / 728–746, which matches Wikipedia — [WP-NR p.3](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- **6 GHz unlicensed:** n96 is present and matches. n102 and n104 are missing. LTE B46 is present and matches, but its superset cell needs fixing. B47 is missing — [WP-NR p.4](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478); [WP-LTE p.2](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).
- **Satellite:** n255 and n256 are missing. LTE B252/B255 are present but carry the conflicting LTE-U definitions (Q1 items 1–3).
- **US L-band n24:** missing; so are its LTE twin B24 and SUL companion n99.

### Inferences
- **Most teachable additions for a US-only app:**
  1. Satellite direct-to-device bands: n252/B252 (AWS-4), which ties into us_bands.md's dated SpaceX/EchoStar AWS-4 transfer [UB L162], and the L-band pair n255/B255.
  2. The 6 GHz split: n96 = n102 + n104 exactly (5925–6425 + 6425–7125 = 5925–7125; derived).
  3. V2X B47/n47 as a "not a phone band" item.
  4. Twin trivia: n53 = B53, and n90 = n41's DSS-friendly twin.
- **Wikipedia offers no evidence that any NEW band is deployed in the US.** None of them appears in the LTE deployments table, and the NR page has no deployments section [WP-LTE pp.5–7](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101). Teach them as "defined by 3GPP" unless another source shows deployment.
- **B27 overlaps B26** at 814–824 / 859–869 MHz (derived). Content about the ex-Sprint/Grain 800 MHz licenses may need to mention both band numbers. Which band any future user (e.g., a satellite operator) would deploy is not in these PDFs.

### Gaps
- **No operators named.** The PDFs do not say which operator uses any satellite band, nor which US licensee holds the L-band, S-band or 1670–1675 MHz spectrum.
- **US relevance of group (c) unresolved:** B54/n54, n110, n256/B256, n263 and the Ku-band NTN bands carry no region label.
- **LTE-U history unverifiable.** The historical LTE-U use of the numbers 252/255 is not covered by either PDF and would need another dated source.

---

## Q3. What does Wikipedia's deployment information say about which US carriers use each band, and how does it compare with the us_bands.md carrier × band matrix?

### Takeaway
Wikipedia's coverage is thin:
- Its LTE "Deployments by region" table names US carriers for only 10 bands: B12, B13, B14, B17, B25, B26, B29, B30, B41 and B71.
- It gives a bare "Yes" (North America) for B2, B4, B5 and B66, and a bare "USA" for B46 and B48.
- The NR page has **no** deployments section.

Where Wikipedia names carriers, it agrees with us_bands.md on AT&T (B12, B14, B17, B29, B30), Verizon (B13) and T-Mobile (B12, B25, B41, B71). It adds C Spire on B25, B41 and B71.

It is stale in two places:
- **B26:** it still lists T-Mobile, but the 800 MHz licenses were sold on Aug 10, 2026.
- **B12:** it still lists US Cellular, after T-Mobile took over UScellular's wireless operations in Aug 2025.

It never mentions Dish/Boost/EchoStar or AT&T 600 MHz. That is consistent with us_bands.md's HISTORICAL and PLANNED labels, though absence is not proof.

### Cited Findings
**What the table is.** "The following table shows the standardized LTE bands and their regional use. The main LTE bands are in bold print." Partial deployments are deferred to "List of LTE networks", which is not in the PDFs — [WP-LTE p.4](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).
- **Bold rows.** The rendered and font-checked bold rows are B1, B3, B7, B20, B28 and B38. These are global roaming bands; no US core band is bold — [WP-LTE pp.5–6](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).
- **Roaming notes relevant to the US:**
  - "Networks on LTE bands 2 and 4 (LTE-FDD) are suitable for roaming in ITU Region 2 (Americas) only."
  - "Networks on LTE band 5 (LTE-FDD) are suitable for roaming in ITU Regions 2 and 3."

  Source: [WP-LTE p.4](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).
- **NR page.** Its sections are: FR1, FR2, Non-terrestrial FR1, Non-terrestrial FR2, See also ("List of 5G NR networks"), References. There is no deployment table — [WP-NR pp.1–7](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478). The only carrier-related items are press references attached to the n77/n78/n79 notes:
  - Android Authority, "C-Band 5G: What is it and where is it available?" (2022).
  - Light Reading, "AT&T Runs More Low-Band Tests in the US" (2019).
  - GSA, "C-Band National Spectrum Positions: October 2020".

  Source: [WP-NR pp.3, 7](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
- **"AT&T" outside the US.** The North America cells for B7 and B38 name "Mexico (AT&T, Telcel)" and "Mexico (AT&T)". That is AT&T Mexico, not AT&T US — [WP-LTE pp.5–6](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).

**Band-by-band comparison.** Wikipedia source: [WP-LTE pp.5–7](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101). us_bands.md source: [UB L196–210](file:///home/user/research_notes/Cellular%20learning%20app%20research/us_bands.md). Canadian and Mexican entries are omitted.

| LTE band | Wikipedia "North America" cell (US part, verbatim) | us_bands.md LTE matrix | Verdict |
|---|---|---|---|
| B2 | "Yes" (no carriers named) | AT&T CURRENT [U]; Verizon CURRENT [U]; T-Mobile CURRENT (as B2/B25) [W]; C Spire [W] | Cannot test at carrier level; consistent that B2 is used |
| B4 | "Yes" | B4/B66 row: AT&T, Verizon, T-Mobile CURRENT; Boost HISTORICAL; C Spire B4 [W] | Cannot test |
| B5 | "Yes" | AT&T, Verizon CURRENT [U]; T-Mobile ex-UScellular [U]; Cellcom [S] | Cannot test |
| B12 | "USA (AT&T, T-Mobile, US Cellular)" | AT&T CURRENT B/C [U]; T-Mobile CURRENT A block [W]; Verizon —; C Spire B12 [W] | **Agrees** on AT&T and T-Mobile. **"US Cellular" is stale** (see event table). Wikipedia does not list C Spire on B12 |
| B13 | "USA (Verizon)" | Verizon CURRENT [U]; LRA partners | **Agrees** |
| B14 | "USA (FirstNet/AT&T)" | AT&T CURRENT [U] | **Agrees** |
| B17 | "USA (AT&T)" | AT&T CURRENT [U] | **Agrees** |
| B25 | "USA (C Spire, T-Mobile)" | T-Mobile CURRENT [U]; no C Spire | **Agrees** on T-Mobile; Wikipedia **adds C Spire** |
| B26 | "USA (T-Mobile)" | T-Mobile HISTORICAL: licenses sold Aug 10, 2026 [S] | **Conflict:** Wikipedia is stale |
| B29 | "USA (AT&T)" | AT&T CURRENT [U]; Boost HISTORICAL (E block) [U] | **Agrees** on AT&T; silent on Dish/Boost |
| B30 | "USA (AT&T)" | AT&T CURRENT [U] | **Agrees** |
| B41 | "USA (C Spire, T-Mobile)" | T-Mobile: residual LTE, mostly refarmed to n41 [W/U] | **Agrees** that T-Mobile uses B41, with no refarm nuance. Wikipedia **adds C Spire** on LTE B41; us_bands.md has C Spire only on n41 [W] [UB L220] |
| B46 | "USA" | AT&T, Verizon, T-Mobile "limited urban" [U] | **Partly:** US use is listed, no carriers named |
| B48 | "USA" | Verizon CURRENT [U]; private/cable [U] | **Partly:** US use is listed, no carriers named |
| B66 | "Yes" (Central/South America: "Argentina (Personal)") | See B4 | Cannot test |
| B70 | Band not in the deployments table | Boost HISTORICAL; traffic migrated Nov 15, 2025 [S] | No conflict (absence is not proof) |
| B71 | "USA (C Spire, T-Mobile)" | T-Mobile CURRENT [W]; AT&T PLANNED [S]; Boost HISTORICAL [S]; C Spire (n71) [W] | **Agrees** on T-Mobile and C Spire. No AT&T, consistent with PLANNED. No Dish/Boost |
| B10, B23, B49, B53, B85, B103, B106 | Not in the deployments table | Various [U] | No Wikipedia deployment information |

**Dated 2025–2026 events in us_bands.md vs Wikipedia**

| Dated event in us_bands.md | What Wikipedia shows | Assessment |
|---|---|---|
| T-Mobile → Grain 800 MHz sale closed **Aug 10, 2026** [UB L151, L295] | B26: "USA (T-Mobile)" [WP-LTE p.6](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101) | **Stale.** Keep B26 HISTORICAL for T-Mobile |
| T-Mobile closed the UScellular acquisition **Aug 2025**; Array sold 700 MHz to AT&T **Jan 13, 2026** and to T-Mobile **May 5, 2026** [UB L149–150, L286, L290] | B12: "… US Cellular" [WP-LTE p.5](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101) | **Stale.** Drop US Cellular as a B12 operator |
| EchoStar ended its 5G build **Aug 2025**; all Boost traffic on AT&T by **Nov 15, 2025** [UB L156, L283] | No Dish/Boost/EchoStar entry on any band; B70 not in the table [WP-LTE pp.5–7](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101) | Consistent; absence is not confirmation |
| AT&T closed the EchoStar 600 MHz + 3.45 GHz purchase **Jul 28, 2026** [UB L126, L294] | B71 lists no AT&T [WP-LTE p.7](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101); no NR deployments section exists for n71/n77 [WP-NR](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478) | Consistent with AT&T 600 MHz being unbuilt; n77 cannot be checked |

### Inferences
- **Treat the table as background only.** Wikipedia's deployment entries are undated, and the LTE revision dates from on or after 2026-01-04 (Q4). Do not use them to set CURRENT/HISTORICAL status; us_bands.md's dated SEC/FCC sources take precedence.
- **Rows that can be relabeled "consistent with Wikipedia's (undated) deployments table" but not upgraded to fully verified:**
  - B13 = Verizon.
  - B14, B17, B29, B30 = AT&T.
  - B12 = AT&T + T-Mobile.
  - B25, B41, B71 = T-Mobile.
- **C Spire additions.** Wikipedia lists C Spire on B25, B41 and B71 (LTE). us_bands.md had C Spire on B2/B4/B12 (LTE) and n41/n71 (NR) from a single weak source. The two only partly overlap; treat C Spire's band list as unsettled.
- **The bold "main LTE bands" (B1/B3/B7/B20/B28/B38) mark global importance, not US importance.** The app should not present them as US bands.

### Gaps
- **No NR deployment data.** Nothing in either PDF says which US carrier runs n2, n5, n25, n41, n48, n66, n71, n77, n258, n260 or n261, so the us_bands.md NR matrix [UB L214–229] cannot be cross-checked from these PDFs.
- **No carrier detail for some bands:** B2, B4, B5, B66, B46 and B48.
- **Undated entries.** It is unknown when each entry was written; the "List of LTE networks" page was not supplied.

---

## Q4. What edit date does each PDF show, and which 3GPP specs and versions does Wikipedia cite?

### Takeaway
**Neither printout shows a "This page was last edited on …" line.** Both end with a permanent "Retrieved from" revision link:
- LTE: oldid **1363024101**.
- NR: oldid **1382980478**.

The PDFs were generated on **2026-10-31 at about 10:48 UTC**. From the dates inside the content:
- The LTE revision is from **on or after 2026-01-04**.
- The NR revision is from **on or about 2026-10-31**, because one citation is "Retrieved 2026-10-31".

Both pages cite **3GPP Release 19** specs:
- LTE: TS 36.101 **V19.3.0** (2025-10-05).
- NR FR1: TS 38.101-1 **V19.3.1** (2025-10-07).
- NR FR2: TS 38.101-2 **V19.2.0** (2025-10-01).
- NR NTN: TS 38.101-5 **V19.3.0** (2026-01-18).

### Cited Findings
- **LTE PDF.**
  - The last line is "Retrieved from 'https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101'". No "last edited" footer appears in the extracted text or on rendered page 7 — [WP-LTE p.7](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101).
  - PDF metadata: CreationDate "Sat Oct 31 10:48:14 2026 UTC"; creator Microsoft Edge 156 (Skia/PDF m156) — [pdfinfo of the LTE PDF](file:///root/.claude/uploads/4775fb7f-46d8-5c7f-b503-61e2237ddc6a/1976b562-LTE_frequency_bands_-_Wikipedia.pdf).
- **NR PDF.**
  - The last line is "Retrieved from 'https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478'". There is no "last edited" footer — [WP-NR p.7](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478).
  - PDF metadata: CreationDate "Sat Oct 31 10:47:55 2026 UTC" — [pdfinfo of the NR PDF](file:///root/.claude/uploads/4775fb7f-46d8-5c7f-b503-61e2237ddc6a/296687ee-5G_NR_frequency_bands_-_Wikipedia.pdf).

**Specs and other sources cited by the LTE page** — [WP-LTE p.1, p.3, p.7](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101)

| Ref | Document | Version ("ed.") | Spec date | Retrieved | Used for |
|---|---|---|---|---|---|
| [1] | TS 36.101, E-UTRA UE radio transmission and reception | 19.3.0 | 2025-10-05 | 2025-12-28 | Terrestrial table ("Tables 5.5-1 … and 5.6.1-1") |
| [2] | TS 36.104, E-UTRA BS radio transmission and reception | 19.1.0 | 2025-06-23 | 2026-01-04 | Terrestrial table |
| [3] | TS 36.106, E-UTRA FDD repeater | 19.0.0 | 2025-10-03 | 2026-01-04 | Terrestrial table |
| [4] | TS 36.102, E-UTRA UE … for satellite access | 19.1.0 | 2025-10-01 | 2026-01-04 | Satellite table |
| [5] | TS 36.108, E-UTRA Satellite Access Node | 19.1.0 | 2025-10-01 | 2026-01-04 | Satellite table |
| [6] | "ITU News" (generic hub link) | — | — | — | "MSS" notes on B254–B256 |

**Specs and other sources cited by the NR page** — [WP-NR p.1, pp.6–7](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478)

| Ref | Document | Version ("ed.") | Date | Retrieved | Used for |
|---|---|---|---|---|---|
| [1] | TS 38.101-1, NR UE Part 1: Range 1 Standalone | 19.3.1 | 2025-10-07 | 2025-12-28 | FR1 definition (lead) |
| [2] | TS 38.101-2, NR UE Part 2: Range 2 Standalone | 19.2.0 | 2025-10-01 | 2025-12-28 | FR2 definition (lead) |
| [3] | Rohde & Schwarz press release | — | 2024-02-15 | 2024-09-25 | FR3 proposal |
| [4] | TS 38.101-5, NR UE Part 5: Satellite access RF | 19.3.0 | 2026-01-18 | **2026-10-31** | NTN (lead) |
| [5] | "3GPP specification series: 38series" page | — | — | 2019-02-22 | Band tables ("latest published version (Rel. 19)") |
| [6] | TS 38.104, NR BS radio transmission and reception | 19.2.0 | 2025-10-05 | 2026-01-04 | Band tables |
| [7] | TS 38.106, NR repeater | 19.2.0 | 2025-09-30 | 2026-01-04 | Band tables |
| [8] | TS 38.108, NR Satellite Access Node | 19.2.0 | 2025-10-01 | 2026-01-04 | Band tables |
| [9] | *The Telecommunications Handbook* (Wiley), Table 13.1, p.437 | — | 2014-12-11 | 2022-07-10 | "Common name" column |
| [10] | Android Authority, "C-Band 5G: What is it and where is it available?" | — | 2022-01-25 | 2022-07-10 | n77/n78/n79 notes |
| [11] | Light Reading, "AT&T Runs More Low-Band Tests in the US" | — | 2019-07-30 | 2022-07-10 | n77/n78/n79 notes |
| [12] | "C-Band National Spectrum Positions: October 2020" (credited to "GSMA"; the URL is gsacom.com) | — | 2020-10-01 | 2022-07-10 | n77/n78/n79 notes |
| [13] | "ITU News" (generic hub link) | — | — | — | "MSS" notes |

- **Earlier ETSI versions, for comparison.** us_bands.md's ETSI checks used older releases:
  - [ETSI TS 136 101 V15.9.0](https://www.etsi.org/deliver/etsi_ts/136100_136199/136101/15.09.00_60/ts_136101v150900p.pdf) for B66.
  - [ETSI TS 138 101-1 V15.14.0](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/15.14.00_60/ts_13810101v151400p.pdf), V16.5.0, V15.24.0 and V16.20.0 for n70/n77.

  Source: [UB L13–18, L438](file:///home/user/research_notes/Cellular%20learning%20app%20research/us_bands.md).

### Inferences
- **Dating the LTE revision.** Its latest dated content is the 2026-01-04 retrieval date. So revision 1363024101 was saved between 2026-01-04 and the 2026-10-31 printout, assuming the print shows the then-current revision. Its deployment table may therefore be up to about 10 months old, which fits the stale B26/B12 entries.
- **Dating the NR revision.** A reference retrieved 2026-10-31 puts revision 1382980478 on or about the print date, allowing for time-zone differences. MediaWiki revision IDs rise over time, so 1382980478 > 1363024101 also fits the NR page being newer.
- **Release 19 values match the older ETSI checks.** Wikipedia's values for B66, n70 and n77 are identical to the Rel-15/16 ETSI values checked earlier. This supports the us_bands.md note that band edges are stable across releases.
- **Recent revision, older prose.** The NR page still contains older text, e.g., FR3 "as of September 2024 … has not been added to the official standard" [WP-NR p.1](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478). A recent revision ID does not mean every sentence is current.
- **Suggested citation format for the app's dataset.** For example: "Wikipedia LTE frequency bands, oldid 1363024101, transcribing 3GPP TS 36.101 V19.3.0 Tables 5.5-1/5.6.1-1". Keep this separate from "ETSI TS 136 101 V15.9.0 (direct)".

### Gaps
- **Exact last-edit timestamps.** These are not shown in either PDF. They could be read from the two oldid links if en.wikipedia.org becomes reachable.
- **Per-row spec version unknown.** The PDFs do not say whether every row was re-checked against the cited Rel-19 versions or carried over from earlier edits. Wikipedia's "latest published version" wording is a claim about the whole table.
