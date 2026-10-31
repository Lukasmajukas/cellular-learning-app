# US LTE and 5G NR Frequency Bands and Carrier Usage (state as of 2026-10-31)

*Method note, read first. In this session every direct page fetch failed. The egress policy blocked WebFetch and curl for en.wikipedia.org, 3gpp.org, etsi.org, fcc.gov, docs.fcc.gov, sec.gov, cellmapper.net, sqimway.com, fierce-network.com, lightreading.com, broadbandbreakfast.com and spectrum-tracker.com. The shared WebSearch budget (200 calls per turn across all agents) then ran out before the last round (3GPP row checks, T-Satellite spectrum, reuse terms, FirstNet, CBRS holders, DSS status). So every "Cited Findings" bullet comes from WebSearch result content: search-engine summaries and excerpts quoted from the linked pages, not full-page reads. Provenance tags used below: **[S]** = backed by a cited search result; **[W]** = backed only by a weak, secondary or community source; **[U]** = the researcher's background knowledge, NOT checked this session. [U] material appears only in the Gaps sections and in clearly labeled draft tables, and must be checked before it ships in the app. Status labels used: CURRENT, HISTORICAL, PENDING, PLANNED/UPCOMING, UNCONFIRMED.*

---

## Q1. What exact frequency ranges and duplex modes do 3GPP TS 36.101 (LTE) and TS 38.101-1/-2 (NR FR1/FR2) define for the bands used in the US?

### Takeaway
The authoritative tables are TS 36.101 Table 5.5-1 (LTE), TS 38.101-1 Table 5.2-1 (NR FR1) and TS 38.101-2 Table 5.2-1 (NR FR2). This session confirmed B66, n2, n70, n77 and the FR2 bands n257–n262 against ETSI copies or secondary tables. All other rows in the master table (in Gaps below) are standard 3GPP values from background knowledge and are marked [U]. The key superset relationships are B66⊃B4, B25⊃B2, B26⊃B5, B85⊃B12⊃B17, n77⊃n78 and n257⊃n261. The upper C-band now being auctioned (3.98–4.14 GHz) falls inside n77.

### Cited Findings
- **Where the tables are.** The LTE operating-band table is TS 36.101 Table 5.5-1. For each band it lists the uplink range (BS receive / UE transmit), the downlink range (BS transmit / UE receive) and the duplex mode — [itecspec mirror of TS 36.101 §5.5](https://itecspec.com/3gpp/36.101/s/5.5); [ETSI TS 136 101 V15.9.0](https://www.etsi.org/deliver/etsi_ts/136100_136199/136101/15.09.00_60/ts_136101v150900p.pdf). The NR FR1 table is TS 38.101-1 Table 5.2-1, "NR operating bands in FR1" — [ETSI TS 138 101-1 V16.20.0 (2024-08)](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/16.20.00_60/ts_13810101v162000p.pdf). The FR2 table is in TS 38.101-2 §5.2 — [itecspec mirror of TS 38.101-2 §5.2](https://itecspec.com/3gpp/38.101-2/s/5.2).
- **B66 (LTE), confirmed [S].** FDD, UL 1710–1780 MHz, DL 2110–2200 MHz. A note restricts the 2180–2200 MHz DL range — [ETSI TS 136 101 V15.9.0, Table 5.5-1](https://www.etsi.org/deliver/etsi_ts/136100_136199/136101/15.09.00_60/ts_136101v150900p.pdf). Wikipedia's footnote says the band 66 downlink between 2180–2200 MHz "is restricted to intra-band supplemental downlink" — [Wikipedia: LTE frequency bands](https://en.wikipedia.org/wiki/LTE_frequency_bands).
- **B70 (LTE), note [S].** Duplex spacing depends on whether the uplink is paired with the lower or the upper part of the downlink — [Wikipedia: LTE frequency bands](https://en.wikipedia.org/wiki/LTE_frequency_bands).
- **n2 (NR), confirmed [S].** UL 1850–1910 MHz, DL 1930–1990 MHz, FDD — [Wikipedia: 5G NR frequency bands](https://en.wikipedia.org/wiki/5G_NR_frequency_bands).
- **n70 (NR), confirmed [S].** UL 1695–1710 MHz, DL 1995–2020 MHz, FDD — [ETSI TS 138 101-1 V15.14.0](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/15.14.00_60/ts_13810101v151400p.pdf).
- **n77 (NR), confirmed [S].** 3300–4200 MHz for both UL and DL, TDD. The same row appears in V15.14.0, V16.5.0 and V15.24.0 (2024), so the values are stable across releases — [ETSI TS 138 101-1 V15.14.0](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/15.14.00_60/ts_13810101v151400p.pdf); [V16.5.0](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/16.05.00_60/ts_13810101v160500p.pdf); [V15.24.0](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/15.24.00_60/ts_13810101v152400p.pdf).
- **FR2 (mmWave) bands, confirmed from secondary tables and 3GPP drafts [S].** All are TDD. A Wikipedia-derived table lists their channel bandwidths as 50/100/200/400 MHz.
  - n257: 26.5–29.5 GHz, superset of n261.
  - n258: 24.25–27.5 GHz.
  - n259: 39.5–43.5 GHz.
  - n260: 37–40 GHz ("US 39 GHz").
  - n261: 27.5–28.35 GHz ("US LMDS 28 GHz", a US-specific subset of n257, max BW 400 MHz).
  - n262: 47.2–48.2 GHz.

  Sources: [RF Essentials FR2](https://rfessentials.com/rf-knowledge-base/what-is-the-fr2-band-in-5g-nr-and-what-are-the-defined-operating-bands/); [MIWV n261](https://www.miwv.com/?p=67459); [MIWV n259](https://www.miwv.com/39-5-to-43-5-ghz/); [CableFree](https://www.cablefree.net/wirelesstechnology/5g-nr/5g-nr-frequency-bands/); [3GPP draft CR introducing n262](https://3gpp.org/ftp/TSG_RAN/WG4_Radio/TSGR4_99-e/Inbox/Drafts/%5B99-e%5D%5B308%5D%20NR_47GHz_Band_BSRF_NWM/Round%202/Draft_R4-2108741%20%20CR%20to%20TS%2038.104%20-%20Introduction%20of%20band%20n262.docx); [Wikipedia mirror (2023-10) of 5G NR bands](https://kaweah.freedombox.rocks/kiwix/wikipedia_en_all_maxi_2023-10/Sub-6). The search summary also warned that "some secondary pages contain small inconsistencies" and that TS 38.101-2 Table 5.2-1 is authoritative.
- **Upper 700 MHz A block.** 3GPP RAN4 worked a draft CR (R4-2206490, RAN4 #102-e, 2022) titled "Introduction of upper 700MHz A block into TS 36.101" — [3GPP draft](https://3gpp.org/FTP/tsg_ran/WG4_Radio/TSGR4_102-e/Inbox/Drafts/%5B102-e%5D%5B123%5D%20LTE_Upper_700MHz/Round%202/draft%20R4-2206490%20Introduction%20of%20upper%20700MHz%20A%20block%20into%20TS%2036.101.docx). The band number (B103) is [U].
- **ESMR 800 MHz (the B26-only part).** T-Mobile's former Sprint 800 MHz licenses are described as "primarily 817–824 / 862–869 MHz Band 26 spectrum" — [Spectrum Tracker](https://www.spectrum-tracker.com/news/t-mobile-800-mhz-spectrum-sale-to-grain-2-9b-u-s-deal). This ESMR slice is what B26 adds on top of B5.
- **C-band naming.** Verizon's C-band is n77 at 3.7–3.98 GHz [W] — [SignalBoosters C-band guide](https://www.signalboosters.com/blog/ultimate-guide-to-c-band-5g/); [OneSDR Verizon bands](https://www.onesdr.com/verizon-frequency-bands/).
- **Upper C-band.** The FCC's July 2026 order makes 160 MHz of the 3.98–4.2 GHz band available for terrestrial use, auctioned as 3.98–4.14 GHz in eight 20 MHz blocks per PEA — [DWT](https://www.dwt.com/blogs/broadband-advisor/2026/07/fcc-adopts-upper-c-band-transition-order). Equipment rules cover "3.7–4.14 GHz" — [GMA Labs](https://www.gmalabs.com/post/fcc-upper-c-band-equipment-rules-3-7-4-14-ghz-guide).

### Inferences
- **Superset/subset logic that follows from confirmed numbers.**
  - n77 (3300–4200 MHz) covers the US 3.45 GHz band, the C-band (3.7–3.98 GHz) and the new upper C-band (3.98–4.14 GHz). Upper C-band licensees can very likely deploy under the existing n77 definition with no new band number, subject to FCC power and out-of-band limits and to device certification. This is an inference: no source states it.
  - n261 sits entirely inside n257 [S], so a device or network quoting n257 support covers US 28 GHz.
  - B66's DL (2110–2200, 90 MHz) is wider than its UL (1710–1780, 70 MHz). The extra top 20 MHz is downlink-only [S]. B66 is therefore an asymmetric FDD band, a good quiz item.
  - n70/B70 is asymmetric too: 15 MHz UL (1695–1710) against 25 MHz DL (1995–2020) [S, numbers]. B70's variable duplex spacing [S] follows from that asymmetry.
- **US tiers.** Low-band means below 1 GHz (600/700/800–850 MHz). Mid-band means 1–6 GHz (PCS, AWS, WCS, 2.5 GHz, CBRS, 3.45 GHz, C-band, 5 GHz LAA). High-band means FR2 mmWave (24–48 GHz). FR1 vs FR2 is 3GPP's formal split. "Low/mid/high" is industry and marketing usage.

### Gaps
- **Unverified rows.** I could not verify most LTE and NR rows this session: the pages were blocked, the search returned table fragments, and the search budget ran out. The values below are the widely published 3GPP values from background knowledge [U]. They are presented as a draft so the app team can verify each row against TS 36.101 Table 5.5-1 / TS 38.101-1 Table 5.2-1 (the ETSI PDF links above are free) before use.
- **Channel bandwidths and releases not verified.** The allowed channel-bandwidth sets per band and the 3GPP release that introduced each band were not verified. The "typical US channel BW" column is the researcher's estimate of common deployments [U].

#### DRAFT master band table, LTE (E-UTRA). "S" in the last column = the row was confirmed this session; "U" = unverified.

| Band | Common / marketing name | UL (MHz) | DL (MHz) | Duplex | Tier | Superset / subset | Typical US channel BW [U] | Role in US networks | Verified? |
|---|---|---|---|---|---|---|---|---|---|
| B2 | PCS 1900 (A–F blocks) | 1850–1910 | 1930–1990 | FDD | Mid | ⊂ B25 | 5–20 MHz | Mid-band capacity/coverage; often DSS with n2 | U |
| B4 | AWS-1 "AWS" (A–F) | 1710–1755 | 2110–2155 | FDD | Mid | ⊂ B66 (and ⊂ B10) | 5–20 MHz | Core LTE capacity; usually broadcast as B66 | U |
| B5 | Cellular 850 (A/B) | 824–849 | 869–894 | FDD | Low | ⊂ B26 | 5–10 MHz | Coverage; low-band 5G via DSS (n5); satellite D2C (AST) | U |
| B10 | Extended AWS | 1710–1770 | 2110–2170 | FDD | Mid | ⊂ B66 | — | Defined, not used in US | U |
| B12 | Lower 700 A/B/C | 699–716 | 729–746 | FDD | Low | ⊃ B17; ⊂ B85 | 5–10 MHz | Coverage (T-Mobile A block; AT&T B/C) | U |
| B13 | Upper 700 C | 777–787 | 746–756 | FDD (UL above DL) | Low | — | 10 MHz | Verizon's nationwide LTE coverage anchor | U |
| B14 | Upper 700 D + Public Safety Broadband ("FirstNet") | 788–798 | 758–768 | FDD (UL above DL) | Low | — | 10 MHz | FirstNet public-safety priority; AT&T commercial use when idle | U |
| B17 | Lower 700 B/C | 704–716 | 734–746 | FDD | Low | ⊂ B12 | 5–10 MHz | AT&T coverage | U |
| B23 | AWS-4 / 2 GHz MSS | 2000–2020 | 2180–2200 | FDD | Mid | — | — | Dish's original AWS-4 band; effectively replaced by B70 + B66 SDL | U |
| B25 | PCS A–G ("Extended PCS") | 1850–1915 | 1930–1995 | FDD | Mid | ⊃ B2 | 5–20 MHz | T-Mobile PCS including the ex-Sprint G block | U |
| B26 | Extended 850 (ESMR + Cellular) | 814–849 | 859–894 | FDD | Low | ⊃ B5 | 5 MHz (ex-Sprint) | HISTORICAL for T-Mobile (800 MHz sold Aug 2026) | U (ESMR slice 817–824/862–869 is S) |
| B29 | Lower 700 D/E | — (DL only) | 717–728 | SDL | Low | — | 5 MHz | Downlink-only carrier-aggregation booster (AT&T; formerly Dish) | U |
| B30 | WCS A/B | 2305–2315 | 2350–2360 | FDD | Mid | — | 5–10 MHz | AT&T capacity | U |
| B41 | BRS/EBS 2.5 GHz | 2496–2690 | 2496–2690 | TDD | Mid | same span as n41 | 20 MHz carriers | Ex-Sprint LTE capacity; T-Mobile has largely refarmed it to n41 | U |
| B46 | U-NII 5 GHz (LAA) | 5150–5925 | 5150–5925 | TDD (LAA DL) | Mid, unlicensed | spans B252/B255 frequencies | 20 MHz | Urban small-cell downlink boost (LAA) | U |
| B48 | CBRS 3.5 GHz | 3550–3700 | 3550–3700 | TDD | Mid | inside n77's span, but a distinct band | 10–20 MHz | Verizon LTE capacity; private LTE; cable MVNO offload | U |
| B49 | CBRS (LAA-style) | 3550–3700 | 3550–3700 | TDD | Mid | — | — | Rare | U |
| B53 | Globalstar 2.4 GHz | 2483.5–2495 | 2483.5–2495 | TDD | Mid | — | 5–10 MHz | Little or no US commercial use | U |
| B66 | AWS-1 + AWS-3 (+ AWS-4 DL) "Extended AWS" | 1710–1780 | 2110–2200 (2180–2200 DL-only) | FDD | Mid | ⊃ B4, ⊃ B10 | 5–20 MHz, often multiple carriers | Main LTE capacity band for AT&T, Verizon and T-Mobile | **S** |
| B70 | AWS-4 / H-block / AWS-3 unpaired ("Dish band") | 1695–1710 | 1995–2020 | FDD (asymmetric) | Mid | — | ≤15 MHz UL / ≤25 MHz DL | HISTORICAL: Dish/Boost's own network, decommissioned in 2025 | U (same frequencies as n70, which is S) |
| B71 | 600 MHz | 663–698 | 617–652 | FDD (UL above DL) | Low | n105 spans it | 5–20 MHz | T-Mobile low-band coverage; AT&T now owns about 20 MHz (not yet deployed) | U |
| B85 | Extended Lower 700 A/B/C | 698–716 | 728–746 | FDD | Low | ⊃ B12 ⊃ B17 | 5–10 MHz | Mostly a device-capability band; no confirmed US network broadcasts it | U |
| B103 | Upper 700 A block | 787–788 | 757–758 | FDD | Low | — | NB-IoT (sub-1 MHz) | IoT niche | U (introduction is S) |
| B106 | 900 MHz broadband (Anterix) | 896–901 | 935–940 | FDD | Low | — | 3 MHz | Utility private LTE | U |
| B252 / B255 | LTE-U SDL (U-NII-1 / U-NII-3) | — | 5150–5250 / 5725–5850 | SDL | Mid, unlicensed | ⊂ B46 frequencies | 20 MHz | HISTORICAL (LTE-U, about 2017) | U |

#### DRAFT master band table, NR FR1 and FR2. Same S/U convention.

| Band | Common / marketing name | UL (MHz) | DL (MHz) | Duplex | Tier | Superset / subset | Typical US channel BW [U] | Role in US networks | Verified? |
|---|---|---|---|---|---|---|---|---|---|
| n2 | PCS 1900 | 1850–1910 | 1930–1990 | FDD | Mid | ⊂ n25 | 5–20 MHz | DSS "nationwide" 5G layer | **S** |
| n5 | Cellular 850 | 824–849 | 869–894 | FDD | Low | ⊂ n26 | 5–10 MHz (DSS) | AT&T and Verizon low-band 5G | U |
| n12 | Lower 700 A/B/C | 699–716 | 729–746 | FDD | Low | ⊂ n85 | 5–10 MHz | Limited (C Spire listed [W]) | U |
| n13 | Upper 700 C | 777–787 | 746–756 | FDD | Low | — | — | No confirmed deployment | U |
| n14 | Upper 700 D / FirstNet | 788–798 | 758–768 | FDD | Low | — | — | Deployment status unknown | U |
| n25 | PCS A–G | 1850–1915 | 1930–1995 | FDD | Mid | ⊃ n2 | 5–20 MHz | T-Mobile FDD NR layer | U |
| n26 | Extended 850 | 814–849 | 859–894 | FDD | Low | ⊃ n5 | — | No confirmed deployment | U |
| n29 | Lower 700 D/E | — | 717–728 | SDL | Low | — | 5 MHz | Dish (HISTORICAL) | U |
| n30 | WCS | 2305–2315 | 2350–2360 | FDD | Mid | — | 10 MHz | Status unknown | U |
| n41 | 2.5 GHz BRS/EBS | 2496–2690 | 2496–2690 | TDD | Mid | — | 100 MHz + a second carrier | T-Mobile "Ultra Capacity" core layer | U (role is S) |
| n46 | 5 GHz NR-U | 5150–5925 | 5150–5925 | TDD | Mid, unlicensed | — | 20 MHz | Not used by MNOs | U |
| n48 | CBRS | 3550–3700 | 3550–3700 | TDD | Mid | — | 10–40 MHz | Private 5G; cable MVNO offload | U |
| n66 | AWS-1/AWS-3 | 1710–1780 | 2110–2200 | FDD | Mid | — | 5–20 MHz | DSS / FDD NR layer | U |
| n70 | AWS-4 / H-block / AWS-3 unpaired | 1695–1710 | 1995–2020 | FDD | Mid | — | 15 MHz UL / 25 MHz DL | Dish/Boost (HISTORICAL) | **S** |
| n71 | 600 MHz | 663–698 | 617–652 | FDD | Low | ⊂ n105 | 5–20 MHz | T-Mobile "Extended Range" coverage | U (role is S) |
| n77 | C-band + 3.45 GHz (3.3–4.2 GHz) | 3300–4200 | 3300–4200 | TDD | Mid (upper) | ⊃ n78 | 40–100 MHz per carrier | Verizon "UW" and AT&T "5G+" capacity layer | **S** |
| n78 | 3.5 GHz (global) | 3300–3800 | 3300–3800 | TDD | Mid | ⊂ n77 | 100 MHz | Device-only in the US (roaming) | U |
| n79 | 4.5 GHz | 4400–5000 | 4400–5000 | TDD | Mid | — | — | Not used in US | U |
| n85 | Extended Lower 700 | 698–716 | 728–746 | FDD | Low | ⊃ n12 | — | Device band | U |
| n96 | 6 GHz unlicensed | 5925–7125 | 5925–7125 | TDD | Mid, unlicensed | ⊃ n104 | — | Not used by MNOs | U |
| n105 | Extended 600 (APT) | 663–703 | 612–652 | FDD | Low | ⊃ n71 | — | Not used in US | U |
| n106 | 900 MHz broadband | 896–901 | 935–940 | FDD | Low | — | 3 MHz | Utilities | U |
| n257 | 28 GHz (global) | 26500–29500 | 26500–29500 | TDD | High (FR2) | ⊃ n261 | 50–400 MHz | Device band | **S** |
| n258 | 24/26 GHz | 24250–27500 | 24250–27500 | TDD | High | — | 50–400 MHz | T-Mobile 24 GHz [W] | **S** |
| n259 | 41 GHz | 39500–43500 | 39500–43500 | TDD | High | — | 50–400 MHz | Not used in US | **S** |
| n260 | 39 GHz | 37000–40000 | 37000–40000 | TDD | High | — | 100 MHz carriers, aggregated | Verizon and AT&T mmWave | **S** |
| n261 | 28 GHz (US) | 27500–28350 | 27500–28350 | TDD | High | ⊂ n257 | 100 MHz carriers; max 400 MHz | Verizon mmWave | **S** |
| n262 | 47 GHz | 47200–48200 | 47200–48200 | TDD | High | — | — | No US deployment | **S** |

- **Frequency-range definitions** [U]: FR1 = 410–7125 MHz; FR2-1 = 24.25–52.6 GHz; FR2-2 = 52.6–71 GHz (Rel-17).
- **Other block/frequency facts not verified** [U]:
  - Paired AWS-3 = 1755–1780 / 2155–2180 MHz; unpaired AWS-3 = 1695–1710 MHz.
  - H-block = 1915–1920 / 1995–2000 MHz; AWS-4 = 2000–2020 / 2180–2200 MHz.
  - PCS G block = 1910–1915 / 1990–1995 MHz.
  - Lower 700 D block = 716–722 MHz; E block = 722–728 MHz.
  - C-band Auction 107 blocks: A = 3.70–3.80 GHz, B = 3.80–3.82 GHz, C = 3.82–3.98 GHz.
  - 3.45 GHz band = 3.45–3.55 GHz.

---

## Q2. For each carrier, which bands carry LTE and which carry 5G NR today, and what role does each play?

### Takeaway
As of late 2026 the US has three facilities-based national carriers. AT&T is anchored on 850/700/PCS/AWS/WCS LTE, FirstNet B14, and n77 (C-band + 3.45 GHz, now including EchoStar's ~30 MHz) for "5G+". Verizon is anchored on B13/B2/B5/B66 LTE, DSS for "5G Nationwide", n77 C-band and n260/n261 mmWave. T-Mobile is anchored on n71/B71 600 MHz plus n41 2.5 GHz, with PCS/AWS/700 A and UScellular assets folded in. Boost/EchoStar no longer runs its own radio network: all traffic moved to AT&T by Nov 15, 2025, so B70/n70 and Boost's n71/n66/n29 are HISTORICAL. Fingerprints are shifting: AT&T now owns about 20 MHz of 600 MHz (not yet deployed), and T-Mobile's 800 MHz (B26) was sold in Aug 2026. The full provenance-tagged LTE and NR matrices are in this question's Gaps section.

### Cited Findings
**AT&T**
- AT&T closed its ~$23B purchase of EchoStar spectrum on **July 28, 2026**. The licenses are "approximately 30 MHz of nationwide 3.45 GHz mid-band spectrum and approximately 20 MHz of nationwide 600 MHz low-band spectrum" covering "virtually every market across the U.S." — [AT&T 8-K Ex. 99.1](https://www.sec.gov/Archives/edgar/data/0000732717/000119312526321053/d142142dex991.htm); [Fierce Network](https://www.fierce-network.com/wireless/att-closes-23b-spectrum-deal-echostar); [AT&T press release via Globe and Mail](https://www.theglobeandmail.com/investing/markets/stocks/T/pressreleases/3509832/att-closes-acquisition-of-spectrum-licenses-from-echostar/).
- The FCC approved the transfer on **May 12, 2026**. Conditions: a **$2.4B trust** tied to tower-company litigation over contracts EchoStar allegedly walked away from, and AT&T must deploy the spectrum "significantly faster than the company requested." EchoStar received $20.25B, with $2.4B deposited into the trust — [Broadband Breakfast](https://broadbandbreakfast.com/echostar-at-t-close-23-billion-spectrum-sale/); [Fierce (conditional OK)](https://www.fierce-network.com/wireless/fcc-gives-conditional-ok-echostars-spectrum-sales-att-spacex); [Total Telecom](https://totaltele.com/fcc-greenlights-echostars-40bn-spectrum-sale-to-spacex-att/); [Capacity](https://capacityglobal.com/news/fcc-approves-40bn-echostar-spectrum-sale/).
- **3.45 GHz was live before closing.** AT&T leased the band first and "deployed mid-band (3.45 GHz) spectrum from EchoStar to nearly 23,000 cell sites in a matter of a few weeks." AT&T already used this band, so deployment was "largely a matter of remote updates on existing radios." A 2025 target was nearly two-thirds of US population by mid-November (2025) — [AT&T newsroom (2025)](https://about.att.com/story/2025/att-boosts-5g-capacity-nationwide.html); [Fierce](https://www.fierce-network.com/wireless/att-lights-echostars-345-ghz-spectrum-record-time); [Broadband Breakfast](https://broadbandbreakfast.com/at-t-touts-echostar-spectrum-deployment/).
- **600 MHz is future work.** AT&T "has no existing 600 MHz infrastructure," and deployment "will be a multiyear process involving new radios." The CEO said it would take years — [Broadband Breakfast](https://broadbandbreakfast.com/at-t-touts-echostar-spectrum-deployment/); [Broadband Breakfast (CFO)](https://broadbandbreakfast.com/at-t-cfo-echostar-spectrum-a-boon-to-fixed-wireless/).
- **Array (ex-UScellular) spectrum.** Array closed the sale of **3.45 GHz and 700 MHz** licenses to AT&T on **Jan 13, 2026** for $1.018B — [PR Newswire](https://www.prnewswire.com/news-releases/array-completes-sale-of-select-spectrum-assets-to-att-for-1-018-billion-302660307.html); [Array 10-Q Q1 2026](https://www.sec.gov/Archives/edgar/data/0000821130/000082113026000035/ad-20260331.htm); [DCD](https://www.datacenterdynamics.com/en/news/att-closes/).
- **AWS-3 Auction 113.** AT&T won 10 licenses for $120.8M — [Mobile World Live](https://www.mobileworldlive.com/verizon/fcc-reveals-verizon-t-mobile-among-aws-3-auction-big-winners/).
- **"5G+" bands.** AT&T's 5G+ uses n77 (C-band and 3.45 GHz) plus mmWave. Sources disagree on the mmWave band; some say n260 — [MakeUseOf](https://www.makeuseof.com/verizon-att-t-mobile-different-names-fast-5g/); [SlashGear](https://www.slashgear.com/1868963/5g-ultra-capacity-vs-wideband-network-differences/); [5Gstore 2026 guide](https://5gstore.com/blog/2026/07/12/5g-bands-guide/).
- **Satellite.** In April 2026 the FCC let AST SpaceMobile provide direct-to-cell service using **AT&T's 700 MHz and 800 MHz** spectrum — [Broadband Breakfast](https://broadbandbreakfast.com/fcc-grants-ast-spacemobiles-direct-to-cell-request/).

**Verizon**
- **5G Ultra Wideband bands.** Verizon's UW network uses n77 C-band plus mmWave, which some sources list as n260 and n261 — [SlashGear](https://www.slashgear.com/1868963/5g-ultra-capacity-vs-wideband-network-differences/); [MakeUseOf](https://www.makeuseof.com/verizon-att-t-mobile-different-names-fast-5g/); [9to5Mac (2022)](https://9to5mac.com/2022/07/27/how-does-enhanced-5g-compare/).
- **C-band holdings [W].** Verizon acquired "161 MHz on average nationwide for $45.5B"; another guide says "140–200 MHz in every available market" — [SignalBoosters](https://www.signalboosters.com/blog/ultimate-guide-to-c-band-5g/); [OneSDR](https://www.onesdr.com/verizon-frequency-bands/).
- **C-band clearing.** Verizon and AT&T received full access to the C-band spectrum they bought in 2021 once satellite operators cleared it. Verizon said this came "four months ahead of schedule." Verizon's mid-band network then reached more than 175 million people — [DCD](https://www.datacenterdynamics.com/en/news/verizon-and-att-receive-full-access-to-entire-c-band-spectrum/). The article date was not visible; see Gaps.
- **Wide-area 5G [W].** Verizon's wide-area 5G is low-band/DSS, with **n5 (850 MHz)** as the main low-band layer — [SmartSMS guide](https://smartsmssolutions.com/resources/blog/business/best-5g-phones-verizon); [OneSDR](https://www.onesdr.com/verizon-frequency-bands/).
- **Array purchase.** The FCC approved Verizon's ~$1B purchase from Array on **May 14, 2026**, and Verizon closed it on **June 1, 2026** — [Broadband Breakfast](https://broadbandbreakfast.com/fcc-approves-verizons-1-billion-spectrum-purchase-from-array/); [Verizon 10-Q Q2 2026](https://www.sec.gov/Archives/edgar/data/0000732712/000073271226000046/vz-20260630.htm). **Conflict on band mix:** Broadband Breakfast describes the licenses as AWS-3, AWS-1 and PCS; Array's filing describes them as "AWS, cellular and PCS" — [Array Q1 2026 8-K](https://www.sec.gov/Archives/edgar/data/0000821130/000082113026000034/arrayq120268kex991.htm).
- **AWS-3 Auction 113 (largest spender).** Bidding as Cellco Partnership, Verizon won **82 licenses for $3.2B**. The FCC granted them in **August 2026** — [Mobile World Live](https://www.mobileworldlive.com/verizon/fcc-reveals-verizon-t-mobile-among-aws-3-auction-big-winners/); [Verizon 10-Q Q3 2026](https://www.sec.gov/Archives/edgar/data/0000732712/000073271226000052/vz-20260930.htm).
- **Satellite.** The FCC let AST SpaceMobile use **Verizon's 800 MHz band** for direct-to-cell — [Broadband Breakfast](https://broadbandbreakfast.com/fcc-grants-ast-spacemobiles-direct-to-cell-request/).

**T-Mobile**
- **Tier bands.** "Extended Range 5G" runs on **n71 (600 MHz)** and "Ultra Capacity 5G" on **n41 (2.5 GHz)**, with n2/n25 listed in some deployments. Some sources say UC can also use mmWave — [5Gstore 2026 guide](https://5gstore.com/blog/2026/07/12/5g-bands-guide/); [SlashGear](https://www.slashgear.com/1868963/5g-ultra-capacity-vs-wideband-network-differences/); [SpeedtestHQ](https://speedtesthq.com/guides/mobile/5g-uc-5g-plus-explained).
- **Band atlas [W, single source].** One band atlas lists T-Mobile LTE as B2/B4/B12/B66/B71/B41 and NR as n71/n41/n25/n258, plus n77 as a capacity layer — [aiotrf band atlas](https://www.aiotrf.com/en/ai/band-atlas/us/t-mobile/).
- **Holdings [W, marketing-style source].** About 185 MHz at 2.5 GHz (n41) plus roughly 40 MHz of C-band — [Efros blog](https://efros.com/blog/how-t-mobile-took-the-5g-lead-supermobile/).
- **C-band plan (older, about 2023).** "Our C-band spectrum clears in December of this year, and our plan has been to begin deploying it along with our 3.45 GHz spectrum shortly after in 2024" — [Light Reading](https://www.lightreading.com/5g/t-mobile-gets-ready-for-its-next-big-5g-buildout). No 2026 confirmation of live T-Mobile n77 was found.
- **UScellular deal.** T-Mobile completed the acquisition of UScellular's wireless operations in **August 2025**. T-Mobile took roughly 30% of UScellular's spectrum (600 MHz, 700 MHz A block, PCS, AWS and 2.5 GHz). UScellular (now Array) kept about 70% of its spectrum and ~4,400 towers — [Wikipedia: U.S. Cellular](https://en.wikipedia.org/wiki/U.S._Cellular). PhoneArena adds 24 GHz mmWave to the package and calls it a "$4.4 billion purchase" — [PhoneArena](https://phonearena.com/news/t-mobile-ceo-sievert-update-uscellular-acquisition_id164129).
- **More Array spectrum to T-Mobile.** 700 MHz closed **May 5, 2026** ($74.8M) and 600 MHz closed **May 12, 2026** ($86.4M) — [Array Q2 2026 8-K](https://www.sec.gov/Archives/edgar/data/0000821130/000082113026000045/arrayq220268kex991.htm).
- **800 MHz (B26) sold.** The sale to Grain Management closed **Aug 10, 2026**: $2.9B cash plus Grain's 600 MHz licenses (valued at $690M), $3.6B in total. T-Mobile keeps 50% of future proceeds from Grain's monetization of the 800 MHz licenses — [T-Mobile 10-Q Q3 2026](https://www.sec.gov/Archives/edgar/data/0001283699/000128369926000129/tmus-20260930.htm). Background: Dish did not pay the $3.59B option price, and T-Mobile's required auction drew no bids at the target price — [5Gstore (2025)](https://5gstore.com/blog/2025/03/21/t-mobile-sells-800mhz/); [Fierce](https://www.fierce-network.com/wireless/t-mobile-tees-800-mhz-sale-grain-upshots-utilities); [Broadband Breakfast](https://broadbandbreakfast.com/t-mobile-selling-valuable-spectrum-to-grain-management/); [SDxCentral](https://www.sdxcentral.com/news/t-mobile-us-finally-sheds-sprint-spectrum-baggage-in-potential-d2d-boon/).
- **AWS-3 Auction 113 (most licenses).** T-Mobile won **102 licenses for $277.8M** — [Mobile World Live](https://www.mobileworldlive.com/verizon/fcc-reveals-verizon-t-mobile-among-aws-3-auction-big-winners/).
- **2G retired.** T-Mobile's Network Evolution page lists 2G GSM as retired as of **Aug 3, 2026**. The phase-out had begun Feb 9, 2025 — [T-Mobile Network Evolution](https://www.t-mobile.com/support/coverage/t-mobile-network-evolution); [Fierce](https://www.fierce-network.com/wireless/t-mobile-shut-down-2g-gsm-network-summer); [Android Police](https://www.androidpolice.com/t-mobile-2g-shutdown-date-feb-2025/).

**Boost Mobile / EchoStar**
- **Traffic moved to AT&T.** EchoStar's 10-Q says: "We migrated all customer traffic from our 5G Network … to AT&T's network as we transitioned to a Hybrid MNO, which we completed as of November 15, 2025." Also: "In August 2025 … we terminated our deployment of our 5G Network … and we began the abandonment and decommission process" — [EchoStar 10-Q Q2 2026](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm); [EchoStar 10-Q Q1 2026](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926058150/sats-20260331x10q.htm).
- **Who runs what.** DISH runs "the network core and billing and provisioning software." AT&T provides "base stations, radios, radio access network (RAN) software and spectrum frequencies" — [EchoStar 10-Q](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm). The press calls this a "hybrid MVNO" — [Light Reading](https://www.lightreading.com/5g/echostar-s-future-as-a-facilities-based-wireless-carrier-is-toast-amid-spectrum-sale-to-at-t); [Light Reading 2025 review](https://www.lightreading.com/5g/2025-in-review-echostar-navigates-a-series-of-storms).
- **Bankruptcy filings.** Dish Wireless and Dish DBS filed for Chapter 11. Boost Mobile and Gen Mobile were not part of the filing. EchoStar reported 7.53M wireless subscribers at the end of Q1 2026 — [Fierce (July 1, 2026)](https://www.fierce-network.com/wireless/boost-mobile-soldiers-dish-seeks-chapter-11-protection). EchoStar said the delay in closing the AT&T deal partly caused two subsidiaries to file the month before closing — [Light Reading](https://www.lightreading.com/5g/echostar-closes-at-t-spectrum-deal-but-wrinkles-remain); [Broadband Breakfast](https://broadbandbreakfast.com/echostar-at-t-close-23-billion-spectrum-sale/).
- **Satellite.** One analysis reports that the transactions cancelled EchoStar's MDA "Aurora" direct-to-device plan, and that Boost users now connect to SpaceX's Direct-to-Cell service — [US Mobile blog](https://www.usmobile.com/blog/what-network-does-boost-mobile-use/) / [TelecomTV](https://www.telecomtv.com/content/5g/what-s-up-with-echostar-boost-mobile-at-t-open-ran-53686/). Which of these two pages carries the claim was not confirmed.
- **Network build ended.** Tower crews lost work as Boost's open-RAN buildout collapsed (2025) — [Wireless Estimator](https://wirelessestimator.com/articles/2025/tower-crews-lose-work-as-boosts-open-ran-ambitions-as-the-nations-fourth-carrier-collapse/).
- **Spectrum sales to SpaceX.**
  - **AWS-4 and H-block:** the licenses move to a trust first (already done), then to SpaceX "on or about November 30, 2027." EchoStar's FY2025 10-K had expected closing in H1 2026 — [EchoStar 10-Q Q2 2026](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm); [EchoStar 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1415404/000110465926021817/tmb-20251231x10k.htm).
  - **Unpaired AWS-3:** a separate November 2025 deal for ~$2.6B in SpaceX stock — [Via Satellite](https://www.satellitetoday.com/finance/2025/11/06/echostar-to-sell-more-spectrum-to-spacex-form-new-investment-entity/); [EchoStar 8-K (Nov 6, 2025)](https://www.sec.gov/Archives/edgar/data/1415404/000141540425000049/tmb-20251106xex99.htm).
  - **What EchoStar keeps:** it still holds paired AWS-3 spectrum. In Auction 113 it won only 2 licenses ($1.2M, bidding as Conundrum Wireless) — [Via Satellite](https://www.satellitetoday.com/finance/2025/11/06/echostar-to-sell-more-spectrum-to-spacex-form-new-investment-entity/); [Mobile World Live](https://www.mobileworldlive.com/verizon/fcc-reveals-verizon-t-mobile-among-aws-3-auction-big-winners/).

**Regional carriers**
- **C Spire [W].** A coverage-map site lists C Spire 5G on n2, n12, n41, n71 and n77, and LTE on B2, B4 and B12. It lists frequencies 600/700/850 MHz, 1.7/1.9/2.1/2.5/3.7 GHz and 28 GHz — [CoverageMap](https://coveragemap.com/coverage/us/carrier/c-spire). Light Reading (older) says C Spire's first 5G network ran on PCS, 700 MHz and 600 MHz, and that it spent $50M on C-band licenses in the auction that ended in 2021 — [Light Reading](https://www.lightreading.com/5g/c-spire-keeps-it-simple-with-5g). Another coverage page claimed C Spire offers no 5G. That conflicts with the above and looks unreliable.
- **Cellcom (Wisconsin).** Wikipedia lists 850 MHz cellular as n5 and 28 GHz mmWave as n261. It notes Cellcom "has access to Verizon Wireless's extensive 700 MHz and AWS 1 spectrum holdings" — [Wikipedia: Cellcom (United States)](https://en.wikipedia.org/wiki/Cellcom_(United_States)).
- **Appalachian Wireless.** Apple's carrier page lists 5G, LTE and VoLTE support but no band numbers — [Apple Support](https://support.apple.com/en-us/109526).
- **UScellular (legacy, older chart) [W].** One older chart lists UScellular 5G as n71, n77, n261 and n260 — [Droid Life cheat sheet](https://www.droid-life.com/2024/10/30/us-wireless-carrier-bands-gsm-cdma-wcdma-lte-verizon-att-sprint-tmobile/) / [PowerfulSignal chart](https://powerfulsignal.com/cellular-frequency-bands/). Which page carries the row was not confirmed.

**CBRS / private networks**
- Only regulatory status was found; see Q4. CBRS end-user devices are limited to 23 dBm today, and a proposal would raise that to 26 dBm — [Wiley](https://www.wiley.law/alert-The-FCC-Seeks-Comment-on-Proposed-Changes-to-the-35-GHz-Band-Framework).

### Inferences
- **n77 now has two AT&T segments.** With EchoStar's ~30 MHz and Array's 3.45 GHz licenses, AT&T's n77 holdings span both the 3.45 GHz segment (3.45–3.55 GHz) and the C-band segment (3.70–3.98 GHz). AT&T's "5G+" mid-band layer is the widest part of its network.
- **n71/B71 is no longer T-Mobile-only (on paper).** Once AT&T builds 600 MHz (multiyear, needs new radios), n71/B71 stops being a pure T-Mobile fingerprint. Until then, a live n71/B71 signal is almost certainly T-Mobile or a regional carrier.
- **Boost's bands are retired.** Boost subscribers' phones now attach to AT&T bands. Boost's own n70/n71/n66/n29 RAN no longer carries traffic, so B70/n70 should be taught as HISTORICAL. B70's downlink sits on H-block plus AWS-4 frequencies, which are heading to SpaceX for satellite use, so the "Dish band" is unlikely to return terrestrially.
- **B26 is gone from T-Mobile.** T-Mobile's B26/800 MHz is HISTORICAL as of Aug 10, 2026. The 800 MHz ESMR slice may become a satellite band if SpaceX's reported purchase from Grain is approved (see Q4).
- **Verizon gains AWS.** Verizon's 82 AWS-3 licenses ($3.2B) plus the Array AWS/PCS purchase will likely mean more B66/n66 (and B2/n2) capacity. No deployment confirmation was found.

### Gaps
- **Missing primary band lists.** Official carrier band lists, Wikipedia carrier pages and CellMapper were not reachable. AT&T's and Verizon's LTE band rosters below are mostly [U].
- **T-Mobile open questions.** Whether T-Mobile has turned on its own C-band (n77) is UNCONFIRMED: only a 2023 plan and a weak band atlas were found. T-Mobile's 3.45 GHz holdings, mmWave status, residual B41 LTE, and the date its B26 LTE carriers went dark were all not found.
- **DSS status.** Current use of DSS (n2/n5/n66) by Verizon and AT&T, and any 2025–26 DSS switch-offs, were not verified.
- **FirstNet B14/n14.** Not researched this session [U: B14 is FirstNet's 20 MHz (10x10) Upper 700 D block + public-safety broadband spectrum, built and run by AT&T under a 25-year contract that began in 2017].
- **CBRS holders and usage.** PAL holders and B48/n48 usage (Verizon LTE, cable MVNO offload, private networks) were not verified [U].
- **Regional coverage incomplete.** Only C Spire, Cellcom and Appalachian were sampled. GCI (Alaska), Union Wireless, Carolina West, Pioneer, Inland, Thumb Cellular, Puerto Rico and Pacific-territory carriers were not covered. The Appalachian Wireless "LTE B13" claim came from an unidentified device database in the search output, so it is unconfirmed [U: Appalachian and Cellcom are Verizon "LTE in Rural America" partners on Verizon's 700 MHz C block].
- **Still unknown:** Array's remaining spectrum (C-band and mmWave), EchoStar's leftover spectrum (paired AWS-3, 700 MHz E block, CBRS PALs, 12 GHz, mmWave), and how T-Mobile is integrating the legacy UScellular RAN.

#### DRAFT carrier × band matrix, LTE (late 2026)
Tags: [S] = cited above; [W] = weak source; [U] = unverified. "—" = not known to use.

| LTE band | AT&T | Verizon | T-Mobile | Boost/EchoStar own RAN | Regional / other |
|---|---|---|---|---|---|
| B2 (PCS) | CURRENT capacity [U] | CURRENT capacity [U] (+Array PCS, Jun 2026 [S]) | CURRENT (as B2/B25) [W] | — | C Spire [W] |
| B4/B66 (AWS) | CURRENT main capacity [U] (+10 AWS-3 licenses [S]) | CURRENT main capacity [U] (+82 AWS-3 licenses [S]) | CURRENT [W] (+102 AWS-3 licenses [S]) | HISTORICAL (B66/n66) [U] | C Spire B4 [W] |
| B5 (850) | CURRENT coverage [U]; AST D2C [S] | CURRENT coverage [U]; AST D2C [S] | ex-UScellular markets [U] | — | Cellcom 850 [S] |
| B12/B17/B85 (Lower 700) | CURRENT B/C blocks, broadcast as B17/B12 [U] (+Array 700, Jan 2026 [S]) | — [U] | CURRENT A block [W] (+Array 700, May 2026 [S]) | — | C Spire B12 [W] |
| B13 (Upper 700 C) | — | CURRENT nationwide coverage anchor [U] | — | — | LRA partners (Cellcom "access to Verizon 700" [S]; Appalachian [U]) |
| B14 (FirstNet) | CURRENT public-safety + commercial [U] | — | — | — | — |
| B25 (PCS A–G) | — | — | CURRENT [U] | — | — |
| B26 (800) | — | — | HISTORICAL: licenses sold Aug 10, 2026 [S] | — | Grain → SpaceX PENDING [S] |
| B29 (700 SDL) | CURRENT DL booster [U] | — | — | HISTORICAL (E block) [U] | — |
| B30 (WCS) | CURRENT capacity [U] | — | — | — | — |
| B41 (2.5 GHz) | — | — | Residual LTE; mostly refarmed to n41 [W/U] | — | — |
| B46 (LAA) | Limited urban [U] | Limited urban [U] | Limited urban [U] | — | — |
| B48 (CBRS) | — | CURRENT capacity [U] | — | — | Private / cable [U] |
| B70 (AWS-4/H/AWS-3u) | — | — | — | HISTORICAL; traffic migrated Nov 15, 2025 [S]; spectrum → SpaceX PENDING [S] | — |
| B71 (600) | PLANNED: owns ~20 MHz since Jul 28, 2026; multiyear build [S] | — | CURRENT coverage [W] (+Grain 600, Aug 2026; +Array 600, May 2026 [S]) | HISTORICAL; licenses now AT&T's [S] | C Spire (n71) [W] |

#### DRAFT carrier × band matrix, 5G NR (late 2026)

| NR band | AT&T | Verizon | T-Mobile | Boost/EchoStar own RAN | Regional / other |
|---|---|---|---|---|---|
| n2 (PCS) | ? [U] | CURRENT DSS "5G Nationwide" [U] | Some deployments [W] | — | C Spire [W] |
| n5 (850) | CURRENT DSS low-band "5G" [U] | CURRENT DSS, main low-band [W] | ex-UScellular? [U] | — | Cellcom n5 [S] |
| n12 (700) | — | — | — [U] | — | C Spire [W] |
| n25 (PCS A–G) | — | — | CURRENT [W] | — | — |
| n41 (2.5 GHz) | — | — | CURRENT "Ultra Capacity" core [S] | — | C Spire [W] |
| n48 (CBRS) | — | ? [U] | — | — | Private 5G / cable offload [U] |
| n66 (AWS) | ? [U] | CURRENT DSS [U] | Some [U] | HISTORICAL [U] | — |
| n70 | — | — | — | HISTORICAL [S/U] | — |
| n71 (600) | PLANNED, multiyear [S] | — | CURRENT "Extended Range" [S] | HISTORICAL [U] | C Spire [W]; legacy UScellular [W] |
| n77 (3.45 GHz + C-band) | CURRENT "5G+": C-band + 3.45 GHz incl. EchoStar 30 MHz on ~23k sites [S] | CURRENT "5G UW": C-band, ~161 MHz avg [S/W] | UNCONFIRMED live use; ~40 MHz C-band [W] | — (3.45 GHz licenses sold to AT&T) [S] | C Spire [W]; legacy UScellular [W] |
| n258 (24 GHz) | ? [U] | — | Listed [W] (+UScellular 24 GHz [S]) | — | — |
| n260 (39 GHz) | CURRENT mmWave [S, conflicting] | CURRENT mmWave [S] | ? [U] | — | Legacy UScellular [W] |
| n261 (28 GHz) | — | CURRENT mmWave [S] | ? [U] | — | Cellcom [S]; legacy UScellular [W] |
| n262 (47 GHz) | — | — | — | — | No US deployment found [U] |

---

## Q3. How do carriers' 5G marketing tiers map to bands?

### Takeaway
The "fast 5G" icons map to TDD mid-band and mmWave capacity layers:
- **Verizon "5G Ultra Wideband" (5G UW)** = n77 C-band + n260/n261 mmWave.
- **AT&T "5G+"** = n77 (C-band + 3.45 GHz) + mmWave.
- **T-Mobile "5G Ultra Capacity" (5G UC)** = mainly n41 2.5 GHz (plus mmWave, and n77 where lit).

The plain "5G" icons map to FDD low/mid-band NR, often DSS: Verizon "5G Nationwide" (n5 main, plus n2/n66) and T-Mobile "Extended Range" (n71, plus n25). AT&T's plain "5G" is n5 [U]. A simple phone-compatibility rule: n77 for Verizon/AT&T, n71 + n41 for T-Mobile.

### Cited Findings
- **Verizon 5G UW** combines mid-band C-band (n77) with mmWave high-band. Some sources list the mmWave bands as n260 and n261 — [SlashGear](https://www.slashgear.com/1868963/5g-ultra-capacity-vs-wideband-network-differences/); [MakeUseOf](https://www.makeuseof.com/verizon-att-t-mobile-different-names-fast-5g/); [9to5Mac (2022)](https://9to5mac.com/2022/07/27/how-does-enhanced-5g-compare/); [SpeedtestHQ](https://speedtesthq.com/guides/mobile/5g-uc-5g-plus-explained).
- **AT&T 5G+** "uses the n77 mid-band layer and millimeter wave (mmWave)." AT&T's mid-band "also covers 3.45 GHz deployments under n77" — [MakeUseOf](https://www.makeuseof.com/verizon-att-t-mobile-different-names-fast-5g/); [5Gstore 2026 guide](https://5gstore.com/blog/2026/07/12/5g-bands-guide/).
- **T-Mobile** "Extended Range 5G" = n71 (600 MHz); "Ultra Capacity 5G" = n41 (2.5 GHz). n2/n25 appear in some deployments, and some sources say UC can also use mmWave — [5Gstore 2026 guide](https://5gstore.com/blog/2026/07/12/5g-bands-guide/); [SlashGear](https://www.slashgear.com/1868963/5g-ultra-capacity-vs-wideband-network-differences/); [iTechGuides](https://www.itechguides.com/5g-bands-cheat-sheet-verizon-vs-att-vs-t-mobile-vs-world/).
- **Verizon wide-area 5G [W]** is "low-band / DSS, wide coverage," with n5 (850 MHz) as the main low-band layer. DSS lets LTE and NR share one block — [SmartSMS guide](https://smartsmssolutions.com/resources/blog/business/best-5g-phones-verizon); [OneSDR](https://www.onesdr.com/verizon-frequency-bands/).
- **Compatibility rule:** "n77 for Verizon and AT&T, and n71 plus n41 for T-Mobile" — [5Gstore 2026 guide](https://5gstore.com/blog/2026/07/12/5g-bands-guide/); [MakeUseOf](https://www.makeuseof.com/verizon-att-t-mobile-different-names-fast-5g/).
- **Source conflicts:** some pages say AT&T's mmWave uses n260, others assign it differently or call it limited. Verizon's low-band and mmWave bands are described inconsistently. Several pages are dated (one is from 2022) — [5Gstore 2026 guide](https://5gstore.com/blog/2026/07/12/5g-bands-guide/); [9to5Mac (2022)](https://9to5mac.com/2022/07/27/how-does-enhanced-5g-compare/).
- **Unverified throughput claim:** one reference says DSS cuts NR throughput 30–50% versus dedicated NR spectrum. The search could not confirm this against a primary source; do not use it as a fact — [OneSDR](https://www.onesdr.com/verizon-frequency-bands/) / [SmartSMS](https://smartsmssolutions.com/resources/blog/business/best-5g-phones-verizon).

### Inferences
- **Icon rule.** The premium icon (5G UW / 5G+ / 5G UC) generally means the phone is on a wide TDD channel (n77, n41) or on FR2. Plain "5G" means narrower FDD NR, often shared with LTE via DSS (n5, n2, n66, n71, n25). A simple app rule: TDD/wide = premium icon; FDD/narrow = plain icon.
- **New AT&T spectrum.** EchoStar's 3.45 GHz is under n77, so it surfaces as AT&T "5G+". The new 600 MHz (n71), once built, will almost certainly show as plain "5G", because low-band FDD is a coverage layer.
- **T-Mobile C-band.** If T-Mobile turns on n77, it would most likely be branded "Ultra Capacity", since some sources already list n77 under UC [W].

### Gaps
- Carrier-official definitions of each icon were not fetched. Three items rest on background knowledge only [U]: AT&T's plain "5G" = n5 DSS (and possibly n2/n66); the historical "5G E" (AT&T 2018–2021) was LTE-Advanced branding; T-Mobile's n25 shows as plain "5G".
- No source found on Boost's network/tier labeling after its move to AT&T, or on regional-carrier tier names.

---

## Q4. What spectrum changes in 2024–2026 affect the accuracy of this content and should be flagged as "recently changed" or "upcoming"?

### Takeaway
Changes in 2025–2026 that alter the band map:
- Boost's own network went dark (traffic on AT&T since Nov 15, 2025).
- AT&T bought EchoStar's 3.45 GHz and 600 MHz (closed Jul 28, 2026).
- T-Mobile absorbed UScellular (Aug 2025), sold its 800 MHz (Aug 10, 2026) and retired 2G (Aug 3, 2026).
- The AWS-3 re-auction (Auction 113, Jun 2026) put new AWS licenses in Verizon's, T-Mobile's and AT&T's hands.
- The FCC set the upper C-band auction (Auction 115) for Apr 27, 2027, with service from Dec 2030.
- Satellite direct-to-cell now rides on carrier low-band (AST on AT&T 700/850 and Verizon 850). SpaceX is acquiring EchoStar's 2 GHz spectrum (final transfer about Nov 30, 2027) and possibly the 800 MHz band.
- CBRS power rules are still PENDING.

### Cited Findings
**Timeline (flag these in the app)**

| Date | Change | Bands affected | Label | Source |
|---|---|---|---|---|
| Mar 2023 → Jul 2025 | FCC general auction authority lapsed in March 2023; the One Big Beautiful Bill Act (P.L. 119-21, Title IV §40002) restored it through **Sept 30, 2034** | Future pipeline | CHANGED 2025 | [Mondaq](https://www.mondaq.com/unitedstates/telecoms-mobile-cable-communications/1648764/one-big-beautiful-bill-act-passes-restoring-fcc-auction-authority-and-establishing-spectrum-pipeline); [Light Reading](https://www.lightreading.com/regulatory-politics/the-fcc-gets-back-its-big-beautiful-auction-authority); [CRS R48861](https://www.everycrsreport.com/reports/R48861.html) |
| Jul 2025 | OBBBA requires auctioning **800 MHz** from **1.3–10.5 GHz** within ~8 years. Reported milestones: 100 MHz by 2027, 300 MHz total by 2029, 600 MHz total by 2032. Authority excludes **3.1–3.45 GHz and 7.4–8.4 GHz**. Upper C-band is the only band expressly mandated | Upper C-band; future mid-band | CHANGED / UPCOMING | [American Compass](https://americancompass.org/policy-brief-u-s-needs-more-commercial-spectrum-to-lead-on-ai-and-reindustrialization/); [Mondaq](https://www.mondaq.com/unitedstates/telecoms-mobile-cable-communications/1648764/one-big-beautiful-bill-act-passes-restoring-fcc-auction-authority-and-establishing-spectrum-pipeline); [WIA](https://wia.org/unpacking-the-one-big-beautiful-bill-act-what-h-r-1-means-for-communications-businesses/) |
| Aug 2025 | T-Mobile closes the UScellular wireless acquisition (~30% of UScellular spectrum) | B71/n71, B12 (700 A), B2/B25, B66, n41, n258 | CHANGED | [Wikipedia: U.S. Cellular](https://en.wikipedia.org/wiki/U.S._Cellular); [PhoneArena](https://phonearena.com/news/t-mobile-ceo-sievert-update-uscellular-acquisition_id164129) |
| Aug 2025 → Nov 15, 2025 | EchoStar ends its 5G build, starts decommissioning, and moves all traffic to AT&T (completed Nov 15, 2025) | B70/n70, n71, n66, n29 (Boost) | HISTORICAL | [EchoStar 10-Q](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm) |
| Late 2025 | AT&T lights EchoStar 3.45 GHz on ~23,000 sites within weeks (under lease) | n77 | CHANGED | [AT&T newsroom](https://about.att.com/story/2025/att-boosts-5g-capacity-nationwide.html); [Fierce](https://www.fierce-network.com/wireless/att-lights-echostars-345-ghz-spectrum-record-time) |
| Nov 2025 | EchoStar agrees to sell unpaired AWS-3 to SpaceX (~$2.6B in stock) | 1695–1710 MHz (B70 UL) | PENDING | [Via Satellite](https://www.satellitetoday.com/finance/2025/11/06/echostar-to-sell-more-spectrum-to-spacex-form-new-investment-entity/) |
| Jan 13, 2026 | Array → AT&T: 3.45 GHz + 700 MHz closed ($1.018B) | n77, B12/B17 | CHANGED | [PR Newswire](https://www.prnewswire.com/news-releases/array-completes-sale-of-select-spectrum-assets-to-att-for-1-018-billion-302660307.html) |
| Feb 9, 2025 → Aug 3, 2026 | T-Mobile 2G GSM phased out; retired Aug 3, 2026 | GSM (PCS/AWS refarmed) | HISTORICAL | [T-Mobile Network Evolution](https://www.t-mobile.com/support/coverage/t-mobile-network-evolution); [TechTimes](https://www.techtimes.com/articles/319869/20260707/t-mobile-2g-gsm-ends-august-3-iot-operators-face-two-migration-waves-not-one.htm) |
| Apr 2026 | FCC lets AST SpaceMobile offer commercial direct-to-cell service on AT&T 700/800 MHz and Verizon 800 MHz, with up to 248 satellites (up from 25) | B5/n5, B12/B17 (low-band) | CHANGED | [Broadband Breakfast](https://broadbandbreakfast.com/fcc-grants-ast-spacemobiles-direct-to-cell-request/); [AST 8-K](https://www.sec.gov/Archives/edgar/data/0001780312/000119312526216946/asts-ex99_1.htm) |
| May 12, 2026 | FCC approves EchoStar → AT&T (and → SpaceX, per a secondhand S-1 citation) with conditions | n77, n71; AWS-4/H/AWS-3 | CHANGED | [Fierce](https://www.fierce-network.com/wireless/fcc-gives-conditional-ok-echostars-spectrum-sales-att-spacex); [X post citing S-1 (unverified)](https://x.com/muskonomy/status/2057380301635301713) |
| May 5 / May 12 / Jun 1, 2026 | Array → T-Mobile 700 MHz and 600 MHz; Array → Verizon AWS/PCS (+cellular or AWS-3; sources conflict) | B12, B71, B66, B2 (B5?) | CHANGED | [Array Q2 2026 8-K](https://www.sec.gov/Archives/edgar/data/0000821130/000082113026000045/arrayq220268kex991.htm); [Verizon 10-Q Q2 2026](https://www.sec.gov/Archives/edgar/data/0000732712/000073271226000046/vz-20260630.htm) |
| Jun 2–23, 2026 | **AWS-3 re-auction (Auction 113)**: 72 rounds, $3.57B, all 200 licenses sold. Winners: Verizon 82 ($3.2B), T-Mobile 102 ($277.8M), AT&T 10 ($120.8M), EchoStar 2 ($1.2M), SpaceX 2 ($8.5M). Top bid ~$974M (NYC–Long Island). A later notice granted 199 licenses to 6 applicants; Verizon's licenses were granted Aug 2026 | B66/n66 (and possibly B70 UL) | CHANGED | [Mobile World Live](https://www.mobileworldlive.com/verizon/fcc-reveals-verizon-t-mobile-among-aws-3-auction-big-winners/); [Light Reading](https://www.lightreading.com/5g/aws-3-auction-closes-with-more-than-3-5b-in-bids); [Inside Towers](https://insidetowers.com/?p=66888); [FCC results by license](https://auctiondata.fcc.gov/public/projects/auction113/reports/results_by_license); [Verizon 10-Q Q3 2026](https://www.sec.gov/Archives/edgar/data/0000732712/000073271226000052/vz-20260930.htm) |
| Jun 2026 | Dish Wireless and Dish DBS file Chapter 11 (Boost not included) | — | CHANGED | [Fierce](https://www.fierce-network.com/wireless/boost-mobile-soldiers-dish-seeks-chapter-11-protection) |
| Jul 22, 2026 (released Jul 24) | **Upper C-band order (FCC 26-46).** 160 MHz (3.98–4.14 GHz) in eight 20 MHz blocks per PEA, 3,248 licenses. Merged into a single "3.7 GHz Service." Mobile device power doubled to 2 W EIRP. Radio-altimeter out-of-band limits set. No tribal window. Commissioner Gomez dissented in part | n77 (3.98–4.14 GHz) | CHANGED / UPCOMING | [DWT](https://www.dwt.com/blogs/broadband-advisor/2026/07/fcc-adopts-upper-c-band-transition-order); [Federal Register order summary](https://www.federalregister.gov/documents/2026/07/31/2026-15598/upper-c-band-398-42-ghz-expanding-flexible-use-of-the-37-to-42-ghz-band); [FCC 26-46](https://docs.fcc.gov/public/attachments/FCC-26-46A1.pdf) |
| Jul 28, 2026 | AT&T closes the EchoStar 3.45 GHz + 600 MHz purchase | n77; B71/n71 | CHANGED | [AT&T 8-K](https://www.sec.gov/Archives/edgar/data/0000732717/000119312526321053/d142142dex991.htm) |
| Aug 10, 2026 | T-Mobile → Grain: 800 MHz sold; Grain's 600 MHz goes to T-Mobile | B26 (817–824/862–869); B71 | HISTORICAL (B26) | [T-Mobile 10-Q Q3 2026](https://www.sec.gov/Archives/edgar/data/0001283699/000128369926000129/tmus-20260930.htm) |
| Aug 2026 | FCC grants AST a 30-day test authorization in the 800 MHz band (up to 100 off-the-shelf devices, until Sept 12) | B5/n5 | HISTORICAL (expired) | [AST 8-K](https://www.sec.gov/Archives/edgar/data/0001780312/000119312526342540/asts-ex99_1.htm); [Light Reading](https://www.lightreading.com/satellite/ast-spacemobile-s-800mhz-tests-milestone-for-d2d-says-at-t) |
| Sept 29, 2026 | Upper C-band rules reportedly took effect (third-party guide; verify) | n77 | UNCONFIRMED | [GMA Labs](https://www.gmalabs.com/post/fcc-upper-c-band-equipment-rules-3-7-4-14-ghz-guide) |
| ~Oct 2026 | SpaceX reportedly agreed to buy the 800 MHz portfolio from Grain, pending FCC approval (report about 3 weeks old at search time) | B26 / 800 MHz ESMR | PENDING | [Google News / Yahoo Finance headline](https://news.google.com/read/CBMimgFBVV95cUxQOWtXSUJSUzBicDZ2RUg5NEszeXRvWWVyLU5CTkhmTl9kNWZHV05qU1M5VVNrRS1Ba2lLalVtX3lsVVFaZXFkdG1qWk5fQm1wLXpDdHRCV0NxQmxmNV8yWGFKOFlPRnRacnQ5ZGpxNTZBVWtQREJaTVZkakdJS1RlaG1FQVNJTFBDWEJDMG9ZYWtEc0Vibzh6ZmtR?hl=en-US&gl=US&ceid=US%3Aen) |
| Apr 27, 2027 | **Auction 115 (upper C-band)** scheduled | n77 | UPCOMING | [Federal Register](https://www.federalregister.gov/documents/2026/08/03/2026-15725/auction-of-flexible-use-licenses-in-the-upper-c-band-for-next-generation-wireless-services-scheduled); [FCC Auction 115](https://www.fcc.gov/auction/115) |
| ~Nov 30, 2027 | AWS-4 and H-block final transfer from trust to SpaceX | B70/n70 DL, B66 2180–2200, B23 | PENDING | [EchoStar 10-Q](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm) |
| Dec 2030 / Jul 2031 | Upper C-band winners may launch in the largest markets / everywhere else | n77 | PLANNED | [DWT](https://www.dwt.com/blogs/broadband-advisor/2026/07/fcc-adopts-upper-c-band-transition-order); [Broadband Breakfast](https://broadbandbreakfast.com/fcc-approves-upper-c-band-plan-opening-160-mhz-for-wireless-auction/) |

**Other details**
- **Upper C-band transition.** Estimated total transition costs are $4–5B. Satellite operators SES ($5.6B) and Eutelsat ($504M) are the main incumbents being relocated. The FCC's Auction 115 page lists later items, including a Sept 30, 2026 request for comment on a preliminary cost catalog and an October 2026 notice on docket comment processes — [SatNews](https://satnews.com/2026/07/27/fcc-approves-upper-c-band-order-allocating-5-6-billion-to-ses-and-504-million-to-eutelsat/); [Via Satellite](https://www.satellitetoday.com/government-military/2026/07/22/fcc-approves-a-new-c-band-auction/); [FCC Auction 115](https://www.fcc.gov/auction/115); [FCC fact sheet (Jul 1, 2026 draft)](https://docs.fcc.gov/public/attachments/DOC-422738A1.pdf).
- **CBRS (3.55–3.7 GHz): PENDING, no final order found.**
  - A 2024 FCC notice asked whether to add higher-power CBSD classes "akin to those in the 3.45 GHz and 3.7 GHz bands," and whether to raise UE power from 23 to 26 dBm.
  - In early 2026 a coalition of CBRS users warned FCC Chairman Carr against turning CBRS into "yet another high-power, macro cellular band."
  - In a Mar 6, 2026 letter, Senators Luján and Fischer urged the FCC to reject changes that would "upend" CBRS's mid-power model.
  - A May 2026 report said the comment period was still open. Carriers support higher power.

  Sources: [Wiley](https://www.wiley.law/alert-The-FCC-Seeks-Comment-on-Proposed-Changes-to-the-35-GHz-Band-Framework); [FCC 24-86](https://docs.fcc.gov/public/attachments/FCC-24-86A1.pdf); [Fierce](https://www.fierce-network.com/wireless/cbrs-advocates-accuse-mobile-carriers-trying-amp-it-11); [Broadband Breakfast](https://broadbandbreakfast.com/higher-power-levels-in-battle-between-commercial-wireless-and-shared-spectrum/); [Luján–Fischer letter](https://www.lujan.senate.gov/wp-content/uploads/2026/03/Lujan-Fischer-CBRS-Letter-to-FCC-03.06.26.pdf).
- **C-band clearing.** Verizon and AT&T got full access to their C-band spectrum "four months ahead of schedule" — [DCD](https://www.datacenterdynamics.com/en/news/verizon-and-att-receive-full-access-to-entire-c-band-spectrum/).
- **Legacy shutdowns.** AT&T 2G ended in 2017. AT&T 3G ended early 2022. T-Mobile 3G UMTS ended Jul 1, 2022. Verizon 3G CDMA ended at the end of 2022 — [Android Authority](https://www.androidauthority.com/t-mobile-2g-shutdown-date-3683679/); [Fierce](https://www.fierce-network.com/wireless/t-mobile-shut-down-2g-gsm-network-summer).
- **SpaceX D2C.** SpaceX bought spectrum in Auction 113 (2 licenses, $8.5M) and is the buyer of EchoStar's AWS-4/H-block and unpaired AWS-3 — [Mobile World Live](https://www.mobileworldlive.com/verizon/fcc-reveals-verizon-t-mobile-among-aws-3-auction-big-winners/); [EchoStar 10-Q](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm).
- **Global n77/n78 context.** A May 2026 GSA report counts 216 operators worldwide deploying, launched or testing 5G in n77/n78 — [GSA](https://gsacom.com/paper/midband-spectrum-may-2026/).

**Conflicts to flag**
- **Upper C-band statutory deadline:** "at least 100 MHz … by 2026" (one source) vs "no later than July 2027" ([Broadband Breakfast](https://broadbandbreakfast.com/jonathan-williams-super-sizing-benefits-of-the-big-beautiful-bill/); the FCC says its plan "exceeds a congressional mandate to auction at least 100 MHz … by July 2027," per [DWT](https://www.dwt.com/blogs/broadband-advisor/2026/07/fcc-adopts-upper-c-band-transition-order)). Check against the statute text.
- **OBBBA lower exclusion:** 3.1–3.45 GHz (statute summaries) vs "3.1–3.5 GHz" (one source; probably a typo) — [Mondaq](https://www.mondaq.com/unitedstates/telecoms-mobile-cable-communications/1648764/one-big-beautiful-bill-act-passes-restoring-fcc-auction-authority-and-establishing-spectrum-pipeline).
- **SpaceX AWS-4/H-block price:** $17B "Total Consideration Amount" (EchoStar 10-Q) vs "raised … to approximately $20 billion" ([SatNews, Mar 2026](https://satnews.com/2026/03/03/echostar-details-42-billion-strategic-shift-via-spacex-and-att-asset-divestitures/)). The combined AT&T + SpaceX package is reported as $40B or $42.6B — [Total Telecom](https://totaltele.com/fcc-greenlights-echostars-40bn-spectrum-sale-to-spacex-att/).
- **SpaceX closing date:** "first half of 2026" (FY2025 10-K) vs "on or about November 30, 2027" (Q2 2026 10-Q). Use the later filing.
- **Auction 113 counts:** 200 licenses / 7 bidders (initial results) vs 199 licenses granted to 6 long-form applicants (later notice). The reason was not found.
- **Verizon 2G date:** a secondary source says Verizon "shuttered its 2G network around 2020" — [Android Authority](https://www.androidauthority.com/t-mobile-2g-shutdown-date-3683679/). This conflicts with Verizon's CDMA network (1X and EV-DO) ending at the end of 2022. Treat "~2020" as doubtful.
- **Boost's model:** "Hybrid MNO" (EchoStar's own term) vs "hybrid MVNO" (press).

### Inferences
- **App content flags:**
  - B26 (T-Mobile): HISTORICAL since 2026-08-10.
  - B70/n70: HISTORICAL since 2025-11-15.
  - AT&T B71/n71: PLANNED (licensed, not built).
  - AT&T n77: EXPANDED (3.45 GHz +30 MHz).
  - B66/n66: new AWS-3 licensees (deployment status unknown).
  - n77 upper C-band: UPCOMING (auction 2027, service 2030–31).
  - CBRS power: PENDING.
  - 2G on all three nationals: HISTORICAL.
- **Satellite D2C is reshaping who uses which band.** AST rides AT&T and Verizon low-band (700/850). SpaceX is assembling its own 2 GHz (AWS-4/H-block, unpaired AWS-3) and possibly 800 MHz holdings. A band can therefore be "used in the US" by a satellite operator and not a terrestrial carrier — a teaching point.
- **"800 MHz" in FCC/AST language** for Verizon and AT&T almost certainly means the 824–849/869–894 MHz Cellular band (B5/n5), which the FCC often calls the "800 MHz cellular band." This is an inference; confirm wording in the FCC grant.

### Gaps
- **T-Mobile T-Satellite spectrum** was not verified (search budget exhausted) [U: T-Mobile's Starlink-based service uses T-Mobile's PCS G block, 1910–1915/1990–1995 MHz, i.e., B25/n25-only spectrum].
- **Spectrum and Secure Technology and Innovation Act (Dec 2024)** [U: authorized the AWS-3 re-auction to fund the rip-and-replace shortfall]. Exact AWS-3 block composition of the 200 licenses (paired vs unpaired) was not verified.
- **DSS and refarming.** No 2025–26 primary source found on LTE-to-NR refarming or DSS switch-offs (e.g., Verizon/AT&T DSS on n5/n2/n66, T-Mobile n25/n66 NR, residual T-Mobile B41 LTE).
- **Regional legacy networks.** Remaining 2G/3G on regional carriers was not researched (e.g., UScellular CDMA shutdown date, any GSM/CDMA islands).
- **C-band clearing date.** The DCD article's date was not visible [U: Phase II deadline was Dec 5, 2023; carriers reported full access in 2023].
- **Grain → SpaceX price.** The 800 MHz headline says "$2.9 billion," which may be what T-Mobile received rather than SpaceX's price. FCC status is unknown.
- **OBBBA milestones.** The 100/300/600/800 MHz milestones come from a policy-advocacy source (American Compass) and were not checked against the statute.

---

## Q5. What memorable facts help learners?

### Takeaway
Effective learning hooks:
1. Lower frequency = longer reach and better building penetration; higher = more spectrum and capacity.
2. TDD bands (n41, n77, mmWave) are capacity layers because they come in huge contiguous blocks (n77 spans 900 MHz).
3. A few "reverse" and "asymmetric" FDD bands make good trivia: B13/B14/B71 uplink above downlink; B66/B70 have more downlink than uplink.
4. Some bands fingerprint a carrier: B13 = Verizon, B14/B30/B29 = AT&T, n41 and n71 = T-Mobile (for now), B70/n70 = old Dish/Boost.

Most fingerprints changed in 2025–26, which is itself a lesson.

### Cited Findings
- **Software vs. hardware rollouts.** AT&T added EchoStar's 3.45 GHz to ~23,000 sites "in a matter of a few weeks" through remote software updates, because existing n77 radios already covered it. In contrast, AT&T's new 600 MHz needs new radios and "years" — [AT&T newsroom](https://about.att.com/story/2025/att-boosts-5g-capacity-nationwide.html); [Broadband Breakfast](https://broadbandbreakfast.com/at-t-touts-echostar-spectrum-deployment/). Hook: "same band = software update; new band = truck roll."
- **T-Mobile's tier names map to physics:** Extended Range = 600 MHz (n71); Ultra Capacity = 2.5 GHz (n41) — [5Gstore 2026 guide](https://5gstore.com/blog/2026/07/12/5g-bands-guide/).
- **n261 is the US-only slice of the global 28 GHz band n257** — [MIWV](https://www.miwv.com/?p=67459); [RF Essentials](https://rfessentials.com/rf-knowledge-base/what-is-the-fr2-band-in-5g-nr-and-what-are-the-defined-operating-bands/).
- **B66's top 20 MHz (2180–2200) is downlink-only** — [ETSI TS 136 101](https://www.etsi.org/deliver/etsi_ts/136100_136199/136101/15.09.00_60/ts_136101v150900p.pdf); [Wikipedia](https://en.wikipedia.org/wiki/LTE_frequency_bands).
- **n77 is one band covering 3300–4200 MHz** (900 MHz wide) — [ETSI TS 138 101-1](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/15.14.00_60/ts_13810101v151400p.pdf).
- **Phones transmit far less power than towers.** CBRS UEs are capped at 23 dBm (proposal: 26 dBm) — [Wiley](https://www.wiley.law/alert-The-FCC-Seeks-Comment-on-Proposed-Changes-to-the-35-GHz-Band-Framework). The FCC just doubled the mobile-device limit in the 3.7 GHz Service to 2 W EIRP — [Federal Register/FCC 26-46 summary](https://www.federalregister.gov/documents/2026/07/31/2026-15598/upper-c-band-398-42-ghz-expanding-flexible-use-of-the-37-to-42-ghz-band).
- **Satellites reuse cell bands.** AST uses AT&T 700/850 MHz and Verizon 850 MHz to reach ordinary phones — [Broadband Breakfast](https://broadbandbreakfast.com/fcc-grants-ast-spacemobiles-direct-to-cell-request/).

### Inferences
These are general RF principles and arithmetic, not sourced this session; the values are computed.
- **Wavelength (λ = c/f)** — "low-band waves are about the length of your arm; mmWave about your fingernail":

  | Frequency | Wavelength |
  |---|---|
  | 600 MHz | ≈ 50 cm |
  | 700 MHz | ≈ 43 cm |
  | 1.9 GHz | ≈ 16 cm |
  | 2.5 GHz | ≈ 12 cm |
  | 3.7 GHz | ≈ 8.1 cm |
  | 28 GHz | ≈ 1.07 cm |
  | 39 GHz | ≈ 7.7 mm |

- **Free-space path loss** grows 20·log10(f2/f1) dB between isotropic antennas over the same distance:
  - 600 MHz → 3.7 GHz ≈ +15.8 dB
  - 600 MHz → 28 GHz ≈ +33.4 dB

  Building/body penetration losses also rise with frequency. That is why n71/B13/B5 are coverage layers and n77/n41/mmWave need dense sites and beamforming. Nuance for advanced learners: a fixed-size antenna array holds more elements at high frequency, which recovers some gain.
- **Why TDD = capacity.** One contiguous block serves both directions, time-shared with a downlink-heavy split, so carriers can run 100 MHz NR channels. FDD needs two separated, equal-sized blocks, and US FDD holdings are mostly 5–20 MHz per direction.
- **Reverse-duplex bands** (derived from [U] values in the Q1 draft table): B13 (UL 777–787 above DL 746–756), B14 (UL 788–798 above DL 758–768) and B71/n71 (UL 663–698 above DL 617–652). Every other common US FDD band has uplink below downlink.
- **Number twins.** LTE and NR share a band number when the frequencies match: B2/n2, B5/n5, B25/n25, B41/n41, B48/n48, B66/n66, B70/n70, B71/n71. n77/n78 have no US LTE twin, and B4 and B17 have no NR twin [U for the "no twin" claims].
- **Fingerprint bands (late 2026),** derived from the Q2 matrix (mixed S/U):

  | Band | Fingerprints |
  |---|---|
  | B13 | Verizon (plus LTE-in-Rural-America partners) |
  | B14 | AT&T/FirstNet |
  | B30 | AT&T |
  | B29 | AT&T |
  | B17 | AT&T |
  | n41/B41 | T-Mobile |
  | n25 NR | T-Mobile |
  | n71/B71 | T-Mobile (AT&T licensed but not built) |
  | n261 | Verizon (also Cellcom) |
  | B48 | Verizon (among MNOs) |
  | B70/n70 | HISTORICAL: Dish/Boost |
  | B26 | HISTORICAL: Sprint/T-Mobile |
  | n77 | Shared by Verizon and AT&T (T-Mobile unconfirmed); the frequency inside n77 tells them apart, see next bullet |

- **Telling 3.45 GHz from C-band inside n77** [U formula]. NR-ARFCN N = 600000 + (F − 3000 MHz)/0.015 MHz across 3–24.25 GHz:

  | Segment | Frequency | NR-ARFCN |
  |---|---|---|
  | 3.45 GHz | 3450–3550 MHz | ≈ 630000–636666 |
  | C-band | 3700–3980 MHz | ≈ 646667–665333 |
  | Upper C-band | 3980–4140 MHz | ≈ 665333–676000 |

  A CellMapper-style "which carrier is this?" quiz can use these ranges.
- **Mnemonics.** "Low = long reach, high = high speed." "TDD = Tons of Downlink Data." "Superset bands add letters: B25 adds PCS G; B26 adds ESMR; B66 adds AWS-3; B85 adds 1 MHz below B12."

### Gaps
- No pedagogical source on band-learning mnemonics was searched; that belongs to the learning-design researcher.
- Path-loss and penetration figures are generic textbook physics, not US measurement data. Real coverage depends on power, antenna, site density and terrain.

---

## Q6. Which data sources are authoritative and freely reusable for building and later updating the app's band dataset, and what are their reuse terms?

### Takeaway
Recommended source layers:
- **Band definitions:** the 3GPP specs, free PDFs on etsi.org (TS 136 101, TS 138 101-1/-2), versioned by release. Band values are stable across releases (n70/n77 identical from V15.14.0 to V16.20.0), but 3GPP keeps adding bands and bandwidths.
- **Who holds what, and changes:** FCC primary data (auction results by license at auctiondata.fcc.gov, Auction pages, orders, Federal Register) and SEC filings (8-K/10-Q/10-K).
- **Who deploys what:** secondary and community sources (Wikipedia, CellMapper, Reddit), each labeled.

Reuse terms for 3GPP/ETSI, FCC, Wikipedia and CellMapper could not be verified this session (pages blocked, search budget exhausted). They are listed as [U] below and must be confirmed before any content is copied.

### Cited Findings
- **ETSI spec PDFs.** ETSI publishes the 3GPP LTE and NR RF specs as freely downloadable versioned PDFs, for example [TS 136 101 V15.9.0](https://www.etsi.org/deliver/etsi_ts/136100_136199/136101/15.09.00_60/ts_136101v150900p.pdf), [TS 138 101-1 V16.20.0 (2024-08)](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/16.20.00_60/ts_13810101v162000p.pdf) and [TS 138 101-1 V15.24.0 (2024-02)](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/15.24.00_60/ts_13810101v152400p.pdf). Results showed n70/n77 rows unchanged across V15.14.0, V15.24.0, V16.5.0 and V16.20.0 — [ETSI V15.14.0](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/15.14.00_60/ts_13810101v151400p.pdf).
- **Unofficial spec mirror.** itecspec.com mirrors 3GPP clause-by-clause (e.g., [36.101 §5.5](https://itecspec.com/3gpp/36.101/s/5.5), [38.101-2 §5.2](https://itecspec.com/3gpp/38.101-2/s/5.2)). Handy for linking, but not authoritative.
- **3GPP keeps changing the tables.** RAN4 draft CRs add bands such as n31/n72 and n110 — [3GPP n31/n72 draft](https://3gpp.org/ftp/TSG_RAN/WG4_Radio/TSGR4_108bis/Inbox/Drafts/%5B108bis%5D%5B147%5D%20NR_LTE_UAV/Revised%20R4-2315778%20-%20draft%20CR%20to%20TR%2038.101-1%20-%20Introduction%20of%20bands%20n31%20and%20n72.docx); [3GPP n110 draft](https://3gpp.org/ftp/meetings_3gpp_sync/RAN4/Inbox/drafts/%5B112bis%5D%5B110%5D%20NR_LTE_TN_Bands/draft%20R4-2417059%20CR%20to%2038101-1%20on%20Band%20n110.docx). 3GPP also publishes guidance on adding channel bandwidths to existing NR bands — [3GPP article](https://www.3gpp.org/technologies/adding-channel-bandwidth-to-existing-nr-bands). The dataset needs a "spec version" field and a refresh routine.
- **FCC primary sources:**
  - Per-license auction results — [Auction 113 results by license](https://auctiondata.fcc.gov/public/projects/auction113/reports/results_by_license).
  - Auction pages with procedures and dates — [Auction 115](https://www.fcc.gov/auction/115).
  - Orders and fact sheets — [FCC 26-46](https://docs.fcc.gov/public/attachments/FCC-26-46A1.pdf); [DOC-422738](https://docs.fcc.gov/public/attachments/DOC-422738A1.pdf).
  - Federal Register notices — [Auction 115 PN](https://www.federalregister.gov/documents/2026/08/03/2026-15725/auction-of-flexible-use-licenses-in-the-upper-c-band-for-next-generation-wireless-services-scheduled).
- **SEC EDGAR filings** give dated, authoritative transaction closings and spectrum descriptions:
  - [AT&T 8-K](https://www.sec.gov/Archives/edgar/data/0000732717/000119312526321053/d142142dex991.htm)
  - [EchoStar 10-Q](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm)
  - [T-Mobile 10-Q](https://www.sec.gov/Archives/edgar/data/0001283699/000128369926000129/tmus-20260930.htm)
  - [Verizon 10-Q](https://www.sec.gov/Archives/edgar/data/0000732712/000073271226000052/vz-20260930.htm)
  - [Array 8-K](https://www.sec.gov/Archives/edgar/data/0000821130/000082113026000045/arrayq220268kex991.htm)
- **Carrier pages.** These document network retirements, e.g., [T-Mobile Network Evolution](https://www.t-mobile.com/support/coverage/t-mobile-network-evolution).
- **Wikipedia.** Wikipedia keeps tabulated band lists ([LTE frequency bands](https://en.wikipedia.org/wiki/LTE_frequency_bands), [5G NR frequency bands](https://en.wikipedia.org/wiki/5G_NR_frequency_bands)), plus [List of 5G NR networks](https://en.wikipedia.org/wiki/List_of_5G_NR_networks) and [List of mobile network operators in the United States](https://en.wikipedia.org/wiki/List_of_mobile_network_operators_in_the_United_States). Search summaries recommended cross-checking Wikipedia against TS 36.101 Table 5.5-1.
- **Secondary-source quality.** Secondary band sites disagree with each other — "some secondary pages contain small inconsistencies" (FR2) and "sources disagree on the details" (carrier tiers) — [CableFree](https://www.cablefree.net/wirelesstechnology/5g-nr/5g-nr-frequency-bands/); [5Gstore 2026 guide](https://5gstore.com/blog/2026/07/12/5g-bands-guide/).

### Inferences
- **Source hierarchy by field:**
  - Frequency and duplex fields: 3GPP/ETSI (cite spec number, version and table).
  - Licensing, ownership and dates: FCC and SEC.
  - Deployment and role: carrier statements, then trade press, then community sources (labeled "community-sourced").
- **Suggested table-friendly fields per band record:**
  - `rat` (LTE/NR), `band` (e.g., 66 / n66), `name`
  - `ul_low_mhz`, `ul_high_mhz`, `dl_low_mhz`, `dl_high_mhz`, `duplex` (FDD/TDD/SDL/SUL)
  - `tier` (low/mid/high), `fr` (FR1/FR2), `superset_of[]`, `subset_of[]`
  - `us_carriers[]`, each as {carrier, rat, role, status, since, source_url}
  - `status_label` (CURRENT/HISTORICAL/PENDING/PLANNED)
  - `spec_ref` (e.g., "TS 36.101 V15.9.0 Table 5.5-1"), `last_verified`
- **Change watchlist.** FCC Auction 115 (upper C-band), the CBRS power proceeding, SpaceX/EchoStar and Grain/SpaceX closings, AT&T 600 MHz buildout, AWS-3 deployments, and T-Mobile C-band.

### Gaps
- **Reuse terms not verified this session [U]; confirm before copying any content:**
  - **3GPP / ETSI.** Specs are free to download. Copyright belongs to the 3GPP Organizational Partners/ETSI, and the cover pages carry a notice that no part may be reproduced without written permission. Under US law, bare facts such as band frequency limits are generally not copyrightable (Feist v. Rural, 1991). So storing band values with a citation is low-risk, while copying spec text or table layout verbatim is not. This is not legal advice.
  - **FCC.** Works of the US federal government are generally not subject to US copyright (17 U.S.C. §105). ULS license data and auction data are public, with bulk downloads available.
  - **Wikipedia.** Text is CC BY-SA 4.0 (older revisions also GFDL). Reuse needs attribution, and adapted material must be shared alike. Pulling bare facts does not trigger share-alike, but copying tables or prose does.
  - **CellMapper.** Crowdsourced and proprietary. The terms of service likely restrict scraping and automated access, and the wiki's license is unknown. Treat it as reference only and label anything taken from it as community-sourced.
  - **Reddit** (r/cellmapper, r/NoSodiumWireless). Covered by Reddit's user agreement and API terms. Use as pointers to verify, not as content.
  - **SEC EDGAR.** Public filings; facts reusable with citation.
  - **GSA.** Reports may need registration; use summaries only.
  - **Trade press.** Copyrighted; paraphrase facts and cite.
- **Not covered:** OpenCelliD and other cell-site databases belong to the cell-site researcher. No machine-readable official 3GPP band dataset (JSON/CSV) was found or searched for.
- **Allow-list needed.** To re-verify this file, a future session must allow en.wikipedia.org, 3gpp.org, etsi.org, fcc.gov, docs.fcc.gov, sec.gov and cellmapper.net, and needs fresh WebSearch budget. Check first: the [U] rows in the Q1 tables, AT&T/Verizon LTE rosters, T-Mobile n77 status, T-Satellite's PCS G block, FirstNet n14, and CBRS holder usage.
