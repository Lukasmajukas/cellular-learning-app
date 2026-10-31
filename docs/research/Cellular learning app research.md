# Build It Solo, but Version the Truth

Yes. One hobbyist who is comfortable with TypeScript can build this app for personal use. The realistic bill is about **115–220 engineering hours plus 30–80 hours of content authoring**, roughly three to six months at 10–15 hours a week. The stack is Tauri 2 + React, with Motion springs, a Rive mascot, FSRS scheduling and SQLite, nearly all of it free and permissively licensed. Writing the code is the easier part. Keeping the facts true is harder. The band definitions are now solid: 24 of 25 LTE rows and all 28 NR rows in the draft dataset matched Wikipedia's Release 19 band tables exactly, and the one bad row (B252/B255) has been corrected. Which carrier uses which band, however, changed repeatedly in 2025–26. Boost moved all its traffic onto AT&T in November 2025, AT&T bought EchoStar's 3.45 GHz and 600 MHz spectrum in July 2026, and T-Mobile sold its 800 MHz licenses in August 2026. Meanwhile, AT&T's and Verizon's PCS, AWS and 850 MHz assignments still rest on forum logs or unchecked background knowledge, and no 5G assignment could be checked against Wikipedia at all. Tower-spotting content goes out of date just as fast. Hardware "tells" fade as AT&T finishes removing Nokia equipment and as abandoned Dish radios pass to tower owners. The skill that lasts is weighing evidence: first the carrier sticker, then the permit filing, then a radio's band label, and only then the hardware brand. The learning design should run two engines. FSRS-scheduled recall practice handles band facts, and perceptual drills on varied photos handle sites and equipment. Scenario puzzles join the two, for example by asking the learner to name a carrier from a radio's band. The app should keep Duolingo's path, streak and XP and drop its Hearts/Energy limits, leagues and look-and-feel. The main risks are stale content, rendering problems in the Linux webview, photo rights and a design that looks like Duolingo. Each has a cheap fix: dated, source-labelled data; a two-day test build on all three operating systems; a source record for every image; and an original radio-themed identity.

## 52 of 53 band rows verified, but who uses which band keeps changing

The frequency layer of the curriculum is in good shape. The draft band dataset was checked row by row against printouts of two Wikipedia pages: "LTE frequency bands" ([revision 1363024101](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101)) and "5G NR frequency bands" ([revision 1382980478](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478)). Their tables copy the 3GPP Release 19 standards: TS 36.101 V19.3.0 for LTE, TS 38.101-1 V19.3.1 for NR below 7.125 GHz and TS 38.101-2 V19.2.0 for millimeter wave. **Uplink range, downlink range and duplex mode matched in 24 of 25 LTE rows and all 28 NR rows.** Before this check, only B66, n2, n70, n77 and the millimeter-wave (FR2) bands had been confirmed. B66, n70 and n77 had also been checked directly against copies of the standards published by ETSI, the European standards body ([TS 136 101 V15.9.0](https://www.etsi.org/deliver/etsi_ts/136100_136199/136101/15.09.00_60/ts_136101v150900p.pdf); [TS 138 101-1 V15.14.0](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/15.14.00_60/ts_13810101v151400p.pdf)). The Release 19 values are identical to those older releases. That supports teaching band edges as stable facts, even though 3GPP keeps adding new bands. Wikipedia is still a secondary source, so one pass against the Release 19 standards themselves belongs on the checklist before release.

The corrections matter more than the confirmations, because each would otherwise have become a wrong quiz answer:

- **B252 and B255 are satellite bands, not LTE-U.** The draft listed them as 5 GHz LTE-U downlink bands. In current 3GPP numbering they are satellite (MSS) bands: B252 is AWS-4 at 2000–2020/2180–2200 MHz, and B255 is US L-band at 1626.5–1660.5/1525–1559 MHz. Wikipedia lists no LTE-U bands at all ([WP-LTE](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101)).
- **Several bands sit inside others.** CBRS **n48 sits inside both n77 and n78**. B49 sits inside B48, and B46 contains the vehicle-to-vehicle (V2X) band B47. n66 has the same restriction as B66: its top 20 MHz (2180–2200) is downlink-only ([WP-NR](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478)).
- **B70 has no 25 MHz LTE channel.** LTE channel sizes for B70 stop at 20 MHz, while NR n70 allows 25 MHz on the downlink only. So the former "Dish band" should be taught as a 15 MHz uplink block paired with a 25 MHz downlink block. Duplex spacing is 300 or 295 MHz for B70 and 300 MHz for n70.
- **B26 adds 10 MHz each way to B5** (814–824/859–869 MHz). T-Mobile's former 817–824/862–869 MHz holding sits inside that extension ([Spectrum Tracker](https://www.spectrum-tracker.com/news/t-mobile-800-mhz-spectrum-sale-to-grain-2-9b-u-s-deal)).
- **More bands are "reversed" than the draft said.** Bands whose uplink sits above the downlink include B103, B24, n24 and n105, as well as the familiar B13, B14 and B71.

Two cautions apply to Wikipedia itself. Its B85 "subset" entry is wrong: the numbers make B85 the superset of B12 and B17. And its NR common names (such as "LMDS" for n257 and "Ka-band" for n261) cite a 2014 handbook rather than 3GPP. The app should tie every fact to band numbers and treat names only as labels.

The check also found about 30 US-relevant bands the draft lacked. They range from the Upper L-band bands B24/n24/n99 and the SMR band B27 to the US-labelled Ka-band satellite pair n510/n511. None of them shows up in any deployment data, so they belong in a "defined by 3GPP, not deployed" tier. Unit one can anchor everything on 3GPP's formal split into FR1 (410–7125 MHz) and FR2 (24.25–71 GHz) ([WP-NR](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478)).

Carrier assignments are what keep changing:

- **Boost/EchoStar migrated all customer traffic to AT&T by November 15, 2025.** It had ended its own 5G build, and its B70/n70 network was retired ([EchoStar 10-Q](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm)).
- **T-Mobile:**
  - closed its UScellular purchase on August 1, 2025 ([T-Mobile](https://www.t-mobile.com/news/business/t-mobile-closes-uscellular-acquisition));
  - retired its 2G GSM network on August 3, 2026 ([T-Mobile](https://www.t-mobile.com/support/coverage/t-mobile-network-evolution));
  - completed the sale of its 800 MHz (B26) licenses to Grain on **August 10, 2026** ([T-Mobile 10-Q](https://www.sec.gov/Archives/edgar/data/0001283699/000128369926000129/tmus-20260930.htm)).
- **AT&T closed its roughly $23B purchase of EchoStar spectrum on July 28, 2026.** The deal covers **~30 MHz of 3.45 GHz and ~20 MHz of 600 MHz** ([AT&T 8-K](https://www.sec.gov/Archives/edgar/data/0000732717/000119312526321053/d142142dex991.htm)).
- **The June 2026 re-auction of AWS-3 licenses** gave Verizon 82 licenses for $3.2B, T-Mobile 102 for $277.8M and AT&T 10 for $120.8M ([Mobile World Live](https://www.mobileworldlive.com/verizon/fcc-reveals-verizon-t-mobile-among-aws-3-auction-big-winners/)).

More changes are already scheduled or pending:

- The upper C-band (3.98–4.14 GHz, inside n77) goes to auction on April 27, 2027 ([Federal Register](https://www.federalregister.gov/documents/2026/08/03/2026-15725/auction-of-flexible-use-licenses-in-the-upper-c-band-for-next-generation-wireless-services-scheduled)). Service is allowed from December 2030 in the largest markets ([DWT](https://www.dwt.com/blogs/broadband-advisor/2026/07/fcc-adopts-upper-c-band-transition-order)).
- EchoStar's AWS-4 and H-block spectrum moves to SpaceX around November 30, 2027 ([EchoStar 10-Q](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm)).
- SpaceX has reportedly agreed to buy the former T-Mobile 800 MHz licenses from Grain, pending FCC approval ([Yahoo Finance via Google News](https://news.google.com/read/CBMimgFBVV95cUxQOWtXSUJSUzBicDZ2RUg5NEszeXRvWWVyLU5CTkhmTl9kNWZHV05qU1M5VVNrRS1Ba2lLalVtX3lsVVFaZXFkdG1qWk5fQm1wLXpDdHRCV0NxQmxmNV8yWGFKOFlPRnRacnQ5ZGpxNTZBVWtQREJaTVZkakdJS1RlaG1FQVNJTFBDWEJDMG9ZYWtEc0Vibzh6ZmtR?hl=en-US&gl=US&ceid=US%3Aen)).
- The FCC has not yet ruled on CBRS power limits ([Wiley](https://www.wiley.law/alert-The-FCC-Seeks-Comment-on-Proposed-Changes-to-the-35-GHz-Band-Framework)).

Satellites now complicate the question of who uses a band. In April 2026 the FCC let AST SpaceMobile reach ordinary phones over AT&T's 700 and 800 MHz spectrum and Verizon's 800 MHz spectrum ([Broadband Breakfast](https://broadbandbreakfast.com/fcc-grants-ast-spacemobiles-direct-to-cell-request/)). That wording almost certainly refers to the 850 MHz Cellular band (B5/n5). These transaction facts came from search excerpts of filings and trade press, not full reads, so dates and dollar figures should be spot-checked before they become quiz answers.

Two gaps in the evidence remain. First, the NR Wikipedia page has no deployments section, so **no 5G carrier assignment could be cross-checked there**. Second, the LTE deployments table is undated and already out of date: it still lists T-Mobile on B26 and US Cellular on B12 ([WP-LTE](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101)). Where it does name carriers, it agrees with the draft:

- B13: Verizon.
- B14, B17, B29 and B30: AT&T.
- B12: AT&T and T-Mobile.
- B25, B41 and B71: T-Mobile, plus C Spire.

That gives the app a usable set of "fingerprint bands", bands that point to one carrier.

The carriers' marketing icons map onto wide TDD channels:

- Verizon's "5G Ultra Wideband" is n77 C-band plus mmWave.
- AT&T's "5G+" is n77 (C-band plus 3.45 GHz) plus mmWave.
- T-Mobile's "Ultra Capacity" is n41, and its "Extended Range" is n71 ([5Gstore](https://5gstore.com/blog/2026/07/12/5g-bands-guide/); [SlashGear](https://www.slashgear.com/1868963/5g-ultra-capacity-vs-wideband-network-differences/)).

n41 and n77 allow NR channels up to 100 MHz wide, against LTE's 20 MHz ceiling ([WP-NR](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478)).

Dynamic spectrum sharing (DSS), where LTE and 5G share one channel, belongs in the history unit. AT&T switched on the first US DSS in June 2020 ([SDxCentral](https://www.sdxcentral.com/articles/news/att-trumpets-first-us-activation-of-dynamic-spectrum-sharing/2020/06/)). Verizon ran it on 850 MHz in 2,700 cities ([Fierce Network](https://www.fierce-network.com/operators/verizon-relies-dynamic-spectrum-sharing-more-widely-than-at-t-report)). T-Mobile never used it, and all three carriers now hold enough dedicated 5G spectrum not to need it ([Light Reading](https://www.lightreading.com/5g/the-quiet-sunset-of-5g-dynamic-spectrum-sharing)).

AT&T's rollout also gives a memorable rule. Its existing n77 radios took on EchoStar's 3.45 GHz spectrum at nearly 23,000 sites "in a matter of a few weeks" through remote updates ([AT&T](https://about.att.com/story/2025/att-boosts-5g-capacity-nationwide.html)). The 600 MHz spectrum, by contrast, needs new radios and years of work ([Broadband Breakfast](https://broadbandbreakfast.com/at-t-touts-echostar-spectrum-deployment/)). Hence: "same band, software update; new band, truck roll." The 5G channel number (NR-ARFCN) is fixed by frequency ([3GLTEInfo](https://www.3glteinfo.com/5g/protocols/phy/nr-arfcn/)), so a channel number also tells AT&T's 3.45 GHz slice of n77 apart from C-band.

### Reference tables: what is verified, and against what

How to read the tables:

- **Check column:** shows how the frequency, duplex and subset values were verified.
- **Bracketed tags:** show the evidence behind each carrier claim. The tags are defined in the key below.
- **Status words** (CURRENT, HISTORICAL, PLANNED, PENDING, UNCONFIRMED) describe the position on October 31, 2026. A dash means no known use.
- **Corrections applied:** all values come from the corrected verification pass, so B252/B255 carry their satellite definitions and B70 its 20 MHz LTE channel limit.
- **Limits of the evidence:** permit filings are dated snapshots from 2020–2025, and Wikipedia's deployment entries are undated. Neither proves current status on its own.

| Tag | Meaning | Sources |
|---|---|---|
| WP | Frequency, duplex spacing and subset values match Wikipedia's band tables as printed 2026-10-31, which copy 3GPP Release 19 | [LTE, oldid 1363024101](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101) (TS 36.101 V19.3.0); [NR, oldid 1382980478](https://en.wikipedia.org/w/index.php?title=5G_NR_frequency_bands&oldid=1382980478) (TS 38.101-1 V19.3.1; TS 38.101-2 V19.2.0) |
| ETSI | Also matched an ETSI copy of the 3GPP standard (older release, identical values) | [TS 136 101 V15.9.0](https://www.etsi.org/deliver/etsi_ts/136100_136199/136101/15.09.00_60/ts_136101v150900p.pdf) (B66); [TS 138 101-1 V15.14.0](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/15.14.00_60/ts_13810101v151400p.pdf), [V16.5.0](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/16.05.00_60/ts_13810101v160500p.pdf), [V15.24.0](https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/15.24.00_60/ts_13810101v152400p.pdf) (n70, n77) |
| WPd | Carrier named in Wikipedia's undated LTE deployments table: consistent, but not proof of current status | [WP-LTE](https://en.wikipedia.org/w/index.php?title=LTE_frequency_bands&oldid=1363024101) |
| WPc | Wikipedia's article on Cellcom (Wisconsin) | [Cellcom (United States)](https://en.wikipedia.org/wiki/Cellcom_(United_States)) |
| primary | Dated SEC filing or company release | [AT&T 8-K](https://www.sec.gov/Archives/edgar/data/0000732717/000119312526321053/d142142dex991.htm); [AT&T newsroom](https://about.att.com/story/2025/att-boosts-5g-capacity-nationwide.html); [EchoStar 10-Q](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm); [T-Mobile 10-Q](https://www.sec.gov/Archives/edgar/data/0001283699/000128369926000129/tmus-20260930.htm); [Verizon 10-Q Q2](https://www.sec.gov/Archives/edgar/data/0000732712/000073271226000046/vz-20260630.htm); [Verizon 10-Q Q3](https://www.sec.gov/Archives/edgar/data/0000732712/000073271226000052/vz-20260930.htm); [Array 8-K](https://www.sec.gov/Archives/edgar/data/0000821130/000082113026000045/arrayq220268kex991.htm); [Array–AT&T release](https://www.prnewswire.com/news-releases/array-completes-sale-of-select-spectrum-assets-to-att-for-1-018-billion-302660307.html) |
| FCC | FCC action or Federal Register notice | [AST satellite grant](https://broadbandbreakfast.com/fcc-grants-ast-spacemobiles-direct-to-cell-request/); [Auction 115 notice](https://www.federalregister.gov/documents/2026/08/03/2026-15725/auction-of-flexible-use-licenses-in-the-upper-c-band-for-next-generation-wireless-services-scheduled) |
| permit | Local or state siting filing that names the carrier's radio for that band | AT&T: [MC2024092327](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2024092327+Application.pdf), [New Orleans](https://onestopapp.nola.gov/GetDocument.aspx?DocID=6551224), [CT New Haven](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/newhaven/wheelerst/att_cing/em-att-093-220414_filing_wheelerst_.pdf); Verizon: [CT Griswold](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/griswold/normanrd/verizon/em-ver-058-211018_filing_normanrd.pdf), [MC2022051756](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2022051756+Application.pdf); T-Mobile: [MC2021011358](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2021011358+Application.pdf), [CT Sterling](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/sterling/exeterdr/t-mobile/ts-t-mobile-136-210916_filing_exeterrd.pdf) |
| press | Trade press, vendor note or secondary guide | [Mobile World Live](https://www.mobileworldlive.com/verizon/fcc-reveals-verizon-t-mobile-among-aws-3-auction-big-winners/); [5Gstore](https://5gstore.com/blog/2026/07/12/5g-bands-guide/); [SlashGear](https://www.slashgear.com/1868963/5g-ultra-capacity-vs-wideband-network-differences/); [MakeUseOf](https://www.makeuseof.com/verizon-att-t-mobile-different-names-fast-5g/); [Fierce (Verizon DSS)](https://www.fierce-network.com/operators/verizon-relies-dynamic-spectrum-sharing-more-widely-than-at-t-report); [Fierce (Verizon C-band)](https://www.fierce-network.com/operators/verizon-deploys-c-band-gear-from-ericsson-samsung-for-its-5g-network); [Fierce (Comcast CBRS)](https://www.fierce-network.com/wireless/comcast-will-deploy-samsung-5g-gear-boost-xfinity-mobile-capacity); [SDxCentral](https://www.sdxcentral.com/articles/news/att-trumpets-first-us-activation-of-dynamic-spectrum-sharing/2020/06/); [Light Reading (DSS)](https://www.lightreading.com/5g/the-quiet-sunset-of-5g-dynamic-spectrum-sharing); [Light Reading (T-Mobile C-band plan)](https://www.lightreading.com/5g/t-mobile-gets-ready-for-its-next-big-5g-buildout); [Broadband Breakfast](https://broadbandbreakfast.com/at-t-touts-echostar-spectrum-deployment/); [Anritsu](https://dl.cdn-anritsu.com/en-us/test-measurement/files/Application-Notes/Application-Note/11410-02865A.pdf); [PhoneArena](https://phonearena.com/news/t-mobile-ceo-sievert-update-uscellular-acquisition_id164129); [Via Satellite](https://www.satellitetoday.com/finance/2025/11/06/echostar-to-sell-more-spectrum-to-spacex-form-new-investment-entity/) |
| comm | Convention documented by hobbyist forums (sector-ID schemes, field logs) | [S4GRU (Verizon)](https://s4gru.com/profile/41193-trip/content/page/30/?type=forums_topic_post); [S4GRU (T-Mobile)](https://s4gru.com/forums/topic/6889-how-to-identify-t-mobile-network-equipment-nokia-networks/); [HowardForums (AT&T, 2014–16 era)](https://www.howardforums.com/threads/lte-sectors.1870828/); [HowardForums (Verizon)](https://www.howardforums.com/showthread.php/1850023-Verizon-s-Band-2-PCS-LTE-Deployment/page5) |
| weak | Single weak secondary source | [aiotrf band atlas](https://www.aiotrf.com/en/ai/band-atlas/us/t-mobile/); [CoverageMap](https://coveragemap.com/coverage/us/carrier/c-spire); [SignalBoosters](https://www.signalboosters.com/blog/ultimate-guide-to-c-band-5g/); [Efros](https://efros.com/blog/how-t-mobile-took-the-5g-lead-supermobile/); [Droid Life](https://www.droid-life.com/2024/10/30/us-wireless-carrier-bands-gsm-cdma-wcdma-lte-verizon-att-sprint-tmobile/) |
| unverified | Background knowledge only; check before teaching | — |

**Table A. LTE bands in US carrier use (status as of October 31, 2026)**

| Band | Name | UL (MHz) | DL (MHz) | Duplex (spacing, MHz) | Check | AT&T | Verizon | T-Mobile | Others and notes |
|---|---|---|---|---|---|---|---|---|---|
| B2 | PCS | 1850–1910 | 1930–1990 | FDD (80); ⊂ B25 | WP | In use 2014–16 [comm]; current status unverified | CURRENT [comm]; adds Array PCS, Jun 2026 [primary] | CURRENT [permit; comm] | US use listed, carriers unnamed [WPd]; C Spire [weak] |
| B4 | AWS-1 | 1710–1755 | 2110–2155 | FDD (400); ⊂ B10, ⊂ B66 | WP | see B66 | see B66 | see B66 | Subset of B66 |
| B5 | Cellular | 824–849 | 869–894 | FDD (45); ⊂ B26 | WP | In use 2014–16 [comm]; AST satellite service on AT&T low-band [FCC] | CURRENT [permit]; AST satellite service [FCC] | Former UScellular markets [unverified] | — |
| B12 | Lower SMH (700) | 699–716 | 729–746 | FDD (30); ⊂ B85, ⊃ B17 | WP | CURRENT [WPd]; adds Array 700 MHz, Jan 13, 2026 [primary] | — | CURRENT [WPd]; adds Array 700 MHz, May 5, 2026 [primary] | Wikipedia's "US Cellular" entry is out of date |
| B13 | Upper SMH (700) | 777–787 | 746–756 | FDD, UL above DL (−31) | WP | — | CURRENT [WPd; permit] | — | Cellcom has access to Verizon's 700 MHz [WPc] |
| B14 | Upper SMH (700), FirstNet | 788–798 | 758–768 | FDD, UL above DL (−30) | WP | CURRENT, FirstNet [WPd]; usually on separate antennas from B17 [press] | — | — | — |
| B17 | Lower SMH (700) | 704–716 | 734–746 | FDD (30); ⊂ B12, ⊂ B85 | WP | CURRENT [WPd; comm] | — | — | — |
| B25 | Extended PCS | 1850–1915 | 1930–1995 | FDD (80); ⊃ B2 | WP | — | — | CURRENT [WPd] | C Spire [WPd] |
| B26 | Extended Cellular (850) | 814–849 | 859–894 | FDD (45); ⊃ B5 | WP | — | — | HISTORICAL: licenses sold, closed Aug 10, 2026 [primary] | Wikipedia still lists T-Mobile; SpaceX purchase from Grain PENDING [press] |
| B29 | Lower SMH (700) | — | 717–728 | SDL (downlink only) | WP | CURRENT [WPd] | — | — | Former Dish use [unverified] |
| B30 | WCS | 2305–2315 | 2350–2360 | FDD (45) | WP | CURRENT [WPd; permit] | — | — | — |
| B41 | BRS (2500) | 2496–2690 | (TDD) | TDD | WP | — | — | Listed [WPd]; mostly converted to 5G n41 [unverified] | C Spire [WPd] |
| B46 | U-NII-1–4 (LAA) | 5150–5925 | (TDD) | TDD; ⊃ B47 | WP | unverified | unverified | unverified | US use listed, carriers unnamed [WPd] |
| B48 | CBRS | 3550–3700 | (TDD) | TDD; ⊃ B49 | WP | — | CURRENT [permit] | — | US use listed [WPd]; Comcast CBRS small cells on cable lines [press] |
| B66 | Extended AWS | 1710–1780 | 2110–2200; 2180–2200 downlink-only | FDD, asymmetric (400); ⊃ B4, ⊃ B10 | WP + ETSI | CURRENT [unverified]; adds 10 AWS-3 licenses [press] | CURRENT [comm]; adds 82 AWS-3 licenses, granted Aug 2026 [press; primary]; adds Array AWS, Jun 2026 [primary] | CURRENT [permit; comm]; adds 102 AWS-3 licenses [press] | Former Dish use [unverified] |
| B70 | Supplementary AWS | 1695–1710 | 1995–2020 | FDD, asymmetric (300 or 295); LTE channels ≤20 MHz | WP | — | — | — | HISTORICAL: Dish/Boost network, traffic on AT&T since Nov 15, 2025 [primary]; spectrum moving to SpaceX, PENDING [primary; press] |
| B71 | Digital Dividend (600) | 663–698 | 617–652 | FDD, UL above DL (−46); inside n105 (derived) | WP | PLANNED: ~20 MHz held since Jul 28, 2026; multiyear build with new radios [primary; press] | — | CURRENT [WPd; permit; comm]; adds Array and Grain 600 MHz, May and Aug 2026 [primary] | C Spire [WPd]; former Boost licenses now AT&T's [primary] |

**Table B. 5G NR bands in US carrier use (status as of October 31, 2026)**

| Band | Name | UL (MHz) | DL (MHz) | Duplex (spacing, MHz) | Check | AT&T | Verizon | T-Mobile | Others and notes |
|---|---|---|---|---|---|---|---|---|---|
| n2 | PCS | 1850–1910 | 1930–1990 | FDD (80); ⊂ n25 | WP | unverified | DSS-era "5G Nationwide" layer [unverified] | Some deployments [press] | C Spire [weak]; no national carrier needs DSS any more [press] |
| n5 | CLR (850) | 824–849 | 869–894 | FDD (45); ⊂ n26 | WP | DSS 5G launched Jun 2020 [press]; band and current status unverified | DSS on 850 MHz in 2,700 cities [press] | unverified | Cellcom [WPc] |
| n25 | Extended PCS | 1850–1915 | 1930–1995 | FDD (80); ⊃ n2 | WP | — | — | CURRENT [press; weak] | — |
| n41 | BRS (2500) | 2496–2690 | (TDD) | TDD; n90 is its DSS twin | WP | — | — | CURRENT, "Ultra Capacity" core [press; permit] | C Spire [weak] |
| n48 | CBRS | 3550–3700 | (TDD) | TDD; ⊂ n77, ⊂ n78 | WP | — | unverified | — | Private 5G and cable offload [unverified] |
| n66 | Extended AWS | 1710–1780 | 2110–2200; 2180–2200 downlink-only | FDD, asymmetric (400) | WP | unverified | DSS-era use [unverified] | unverified | Former Boost network [unverified] |
| n70 | Supplementary AWS | 1695–1710 | 1995–2020 | FDD, asymmetric (300) | WP + ETSI | — | — | — | HISTORICAL: Boost network, traffic on AT&T since Nov 15, 2025 [primary] |
| n71 | Digital Dividend (600) | 663–698 | 617–652 | FDD, UL above DL (−46); ⊂ n105 (derived) | WP | PLANNED, multiyear [primary; press] | — | CURRENT, "Extended Range" [press] | Former Boost network: HISTORICAL [primary]; C Spire [weak] |
| n77 | C-Band (3700) | 3300–4200 | (TDD) | TDD; ⊃ n78, ⊃ n48 | WP + ETSI | CURRENT, "5G+": C-band and 3.45 GHz radios [permit]; EchoStar 3.45 GHz on ~23,000 sites, ~30 MHz bought Jul 28, 2026, plus Array 3.45 GHz, Jan 2026 [primary] | CURRENT, "5G UW" C-band [press; permit]; ~161 MHz average holding [weak] | Live use UNCONFIRMED; ~40 MHz C-band held [weak]; 2023 build plan [press] | Upper C-band 3.98–4.14 GHz: auction Apr 27, 2027; service from Dec 2030 [FCC; press] |
| n258 | K-band (26 GHz) | 24,250–27,500 | (TDD) | TDD | WP | unverified | — | Listed [weak]; acquired UScellular 24 GHz [press] | — |
| n260 | Ka-band (39 GHz) | 37,000–40,000 | (TDD) | TDD | WP | mmWave in "5G+" [press; sources conflict] | CURRENT mmWave in "5G UW" [press] | unverified | Legacy UScellular [weak] |
| n261 | Ka-band (28 GHz) | 27,500–28,350 | (TDD) | TDD; ⊂ n257 | WP | — | CURRENT mmWave in "5G UW" [press] | unverified | Cellcom [WPc] |

**Table C. Bands defined by 3GPP with no confirmed US carrier deployment**

| Band(s) | UL / DL (MHz) | Why it belongs in the curriculum | Check |
|---|---|---|---|
| B10 | 1710–1770 / 2110–2170 | ⊃ B4 and ⊂ B66: a quiz item on bands nested inside each other | WP |
| B23 | 2000–2020 / 2180–2200 | Wikipedia marks it "not applicable"; same frequencies as satellite band B252 (derived) | WP |
| B24, n24, n99 | 1626.5–1660.5 / 1525–1559, restricted sub-ranges; n99 is uplink-only | US-labelled Upper L-band; uplink above downlink | WP |
| B27 | 807–824 / 852–869 | US SMR band; overlaps B26 at 814–824 / 859–869 (derived) | WP |
| B47, n47 | 5855–5925 (TDD) | Vehicle-to-vehicle (V2X) band, not a phone band; ⊂ B46 | WP |
| B49 | 3550–3700 (TDD) | ⊂ B48; Wikipedia calls it "C-Band", not an LAA variant | WP |
| B74, n74 | 1427–1470 / 1475–1518 | US-labelled Lower L-band | WP |
| B85, n85 | 698–716 / 728–746 | ⊃ B12 ⊃ B17 by the numbers (Wikipedia's B85 entry is wrong); radios labelled "B71+B85" appear in T-Mobile filings ([CT Siting Council](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/sterling/exeterdr/t-mobile/ts-t-mobile-136-210916_filing_exeterrd.pdf)) | WP; relation per numbers |
| B103 | 787–788 / 757–758 | Upper 700 A block; NB-IoT only; uplink above downlink (−30) | WP |
| B106, n106 | 896–901 / 935–940 | US 900 MHz land-mobile broadband | WP |
| B252, n252 | 2000–2020 / 2180–2200 | AWS-4 satellite (MSS) band, not LTE-U; the spectrum is headed to SpaceX | WP |
| B255, n255 | 1626.5–1660.5 / 1525–1559 | US L-band satellite (MSS) band, not LTE-U | WP |
| n12, n13, n14 | as B12, B13, B14 | NR twins of the LTE bands; FirstNet MegaRange devices use n14 ([FirstNet](https://www.firstnet.com/coverage/firstnet-megarange.html)), but network deployment is unverified | WP |
| n26 | 814–849 / 859–894 | ⊃ n5 | WP |
| n78 | 3300–3800 (TDD) | ⊂ n77, ⊃ n48; the global 3.5 GHz roaming band | WP |
| n90 | 2496–2690 (TDD) | "Technologically identical to n41", but with a channel grid adjusted for DSS | WP |
| n96 = n102 + n104 | 5925–7125 = 5925–6425 + 6425–7125 (TDD) | 6 GHz unlicensed NR-U | WP; n104 relation derived |
| n105 | 663–703 / 612–652 | ⊃ n71 (derived); Asia-Pacific 600 MHz | WP |
| n257 | 26,500–29,500 (TDD) | ⊃ n261; Wikipedia calls it "LMDS" | WP |
| n510, n511 | UL 27,500–28,350 and 28,350–30,000; DL 17,300–20,200 | US-labelled Ka-band satellite bands; n510's uplink equals n261 (derived) | WP |

## Stickers, permits and band labels outrank hardware brands

US cell sites fall into six visual families, each with a recognizable shape ([PTTG](https://pttg.com/blogs/types-of-communication-towers.php); [PTTG stealth](https://pttg.com/blogs/stealth-towers-8-ways-to-camouflage-your-cell-towers.php)):

- macro towers: self-supporting lattice, guyed mast, monopole;
- structure-mounted sites on rooftops, building faces and water tanks;
- stealth sites disguised as pines, palms, flagpoles or steeples;
- small cells;
- distributed antenna systems (DAS);
- temporary sites.

The one authoritative height anchor is **200 ft**. Taller structures must be registered with the FCC ([FCC](https://www.fcc.gov/node/23343)) and should normally be painted or lit ([FAA](https://www.faa.gov/faq/what-are-requirements-aircraft-warning-lights-tall-structures)). A 2024 order also requires the registration number to be visible at the nearest point of public access ([Kelley Drye](https://www.kelleydrye.com/viewpoints/client-advisories/fcc-updates-rules-governing-the-construction-marking-and-lighting-of-antenna-structures.md)). So orange-and-white paint or warning lights signal a registered structure whose owner is one database lookup away. The FAA can also require marking near airports, so the rule is a strong hint rather than a certainty.

Disguised sites go back decades: Larson Camouflage built the first "monopine" in Monument, Colorado, in 1992 ([Inside Towers](https://insidetowers.com/?p=7351)). Small cells look different from city to city because local codes dictate their shape. Some examples:

- Bothell, Washington caps the canister on top of a wooden pole at 16 inches across ([Bothell](https://bothell.municipal.codes/BMC/12.11.260)).
- Comcast hangs Samsung CBRS small cells on its own cable lines between poles ([Fierce Network](https://www.fierce-network.com/wireless/comcast-will-deploy-samsung-5g-gear-boost-xfinity-mobile-capacity)).
- New York's Link5G smart poles stand about 32 ft tall ([NYC Design Commission](https://www.nyc.gov/assets/designcommission/downloads/pdf/10-18-2021-pres-DoITT-p-Link-5G.pdf)).
- At one Super Bowl stadium, DAS antennas hid behind fake vents ([RCR Wireless](https://rcrwireless.com/20150129/network-infrastructure/digging-das-superbowl-tag4)).
- FirstNet fields more than 100 mobile units, from satellite-linked trucks to drone-borne "Flying COWs" ([FirstNet](https://firstnet.gov/sites/default/files/Deployables_factsheet_2022_March.pdf)).

Lessons should teach the general anatomy of a small cell (a canister or side shroud, a radio cabinet, hidden cabling) before any carrier-specific look.

No authoritative rulebook says "carrier X always uses equipment Y", so the app should teach a ranked chain of evidence. The strongest link is the carrier's own RF sticker. It names the carrier and the site number, and safety guidance tells workers to use it when requesting a shutdown ([Georgia Tech EHS](https://ehs.gatech.edu/radiofrequency-rf-safety)). Alongside it are FCC-format RF warning signs, color-coded NOTICE (blue), CAUTION (yellow), WARNING (orange) and DANGER (red), each with a point of contact ([Federal Register](https://www.federalregister.gov/documents/2020/04/01/2020-02745/human-exposure-to-radiofrequency-electromagnetic-fields-and-reassessment-of-fcc-radiofrequency)).

Next in the chain come permit filings, which name each carrier's antennas, radios and mounting height:

- **AT&T** filings show Ericsson AIR 6419 units labelled B77G (3.45 GHz) and B77D (C-band), typically one per sector. One Connecticut filing places three of each at the 153 ft level beside RRUS 32 B30 radios ([Montgomery County](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2024092327+Application.pdf); [New Orleans](https://onestopapp.nola.gov/GetDocument.aspx?DocID=6551224); [CT Siting Council](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/newhaven/wheelerst/att_cing/em-att-093-220414_filing_wheelerst_.pdf)).
- **Verizon:** one filing swaps nine Nokia radios for three Samsung B5/B13 units, mounted beside Samsung MT6407-77A C-band massive MIMO units ([CT Siting Council](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/griswold/normanrd/verizon/em-ver-058-211018_filing_normanrd.pdf)).
- **T-Mobile** filings show Ericsson AIR 6449 B41 boxes measuring 33.1 × 20.6 × 8.6 in ([Montgomery County](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2021011358+Application.pdf)), plus RRUS 8843 B2 B66A and Radio 4480 B71+B85 radios ([CT Siting Council](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/sterling/exeterdr/t-mobile/ts-t-mobile-136-210916_filing_exeterrd.pdf)).

Radios are labelled by band, so **the band on the label says more than the vendor's logo**:

- a B77G label points to AT&T's 3.45 GHz spectrum;
- a B41 massive MIMO box points to T-Mobile;
- a separate set of Band 14 antennas points to AT&T's FirstNet, since most FirstNet installations keep B14 and B17 on separate antennas ([Anritsu](https://dl.cdn-anritsu.com/en-us/test-measurement/files/Application-Notes/Application-Note/11410-02865A.pdf)).

The vendor brand on its own is a weak clue, and it is getting weaker:

- **AT&T:** by Ookla's count, Ericsson held 84.21% of AT&T's macro sites in the second half of 2025 ([Light Reading](https://www.lightreading.com/5g/att-phaseout-of-old-nokia-ran-boosted-performance-says-ookla)). AT&T says it has replaced more than half of its Nokia radios ([AT&T](https://about.att.com/blogs/2026/att-advances-open-ran-readiness.html)). The program is on track to reach about 80% by end-2026 and finish in early 2027, with Nokia lasting longest in the Northeast and Southern California ([Fierce Network](https://www.fierce-network.com/wireless/atts-vendor-swap-moves-full-speed-ahead)).
- **Verizon** deploys C-band on both Samsung and Ericsson gear ([Fierce Network](https://www.fierce-network.com/operators/verizon-deploys-c-band-gear-from-ericsson-samsung-for-its-5g-network)).
- **T-Mobile** splits between Ericsson and Nokia after extending Nokia's contract in April 2025 ([DCD](https://www.datacenterdynamics.com/en/news/nokia-secures-5g-ran-deal-with-t-mobile-in-us/)).
- **Dish's** Fujitsu-era radios are now abandoned property. American Tower's CEO said on October 27, 2026 that tower companies own the radios left on their towers ([Light Reading](https://www.lightreading.com/5g/tower-companies-now-own-dish-s-abandoned-5g-radios-and-spacex-might-become-a-buyer)), and one analyst counts about 24,000 of them ([Broadband Breakfast](https://broadbandbreakfast.com/tower-companies-own-thousands-of-abandoned-dish-radios/)).
- **Antennas were rebranded:** CommScope's base-station antenna business became "Andrew, an Amphenol Company" in early 2025 ([Business Wire](https://www.businesswire.com/news/home/20250203084459/en/Amphenol-Corporation-Completes-Acquisition-of-OWN-and-DAS-Businesses-From-CommScope)).

Model codes can be decoded, which makes good lesson material:

- **Ericsson** AIR 64xx units are 64-transmit, 64-receive (64T64R) massive MIMO antennas with 3GPP band suffixes.
- **Nokia's** AEHC is described as an "AirScale MAA 64T64R 192AE B41 320W" ([FCC ID VBNAEHC-01](https://fccid.io/VBNAEHC-01)).
- **CommScope** panel codes encode band groups (N = 698–896 MHz, H = 1710–2180 MHz) and length (A/B/C = 1.3/2.0/2.6 m) ([CommScope chart](https://www.scribd.com/document/318360006/Argus-Model-Number-Guide-TP-102449)).

Physically, the equipment sorts into three kinds:

- **Passive panels** are tall and plain, with a row of connectors along the bottom ([The Antenna Farm](https://theantennafarm.com/products/15788-commscope-nnhh-65c-r4)).
- **Remote radios** are finned boxes linked to the panels by short cables called jumpers.
- **Massive MIMO units** are deep boxes that combine radio and antenna, often on their own pipe mounts ([Montgomery County](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2021061469+Application.pdf)). Because the radio is built in, no jumper cables run to a separate antenna.

Counting connector ports shows whether a radio sends and receives on two paths or four (2T2R versus 4T4R). No sourced guide to vendor colors, fin patterns or logo placement was found. The best reference images are therefore the photo exhibits in FCC equipment filings and Ericsson's [product photo library](https://www.ericsson.com/en/newsroom/photo-library/network-products).

Shared towers and look-alike equipment need their own lessons. Tenants lease a band about 5 ft above and below the center height of their antennas ([Law Insider](https://www.lawinsider.com/dictionary/rad-center)). So each mounting level usually belongs to one tenant, with matching hardware. Height order says little about who arrived first, though: Dish once landed at the very top of a Las Vegas tower ([Urgent Communications](https://urgentcomm.com/2022/02/27/the-time-i-visited-a-dish-5g-cell-site/)). Common look-alikes:

- Round dishes with drum-like covers are microwave links back to the network, not cellular antennas ([US Patent 10,770,784](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10770784)).
- Thin fiberglass sticks are land-mobile radio antennas ([TE Connectivity via Mouser](https://www.mouser.com.gt/laird-omnidirectional-fiberglass-antennas)).
- Very tall guyed masts are mostly broadcast towers.

The confirmation tools each have limits:

- The FCC's tower registration gives the structure owner, but never the tenants.
- The FCC's license database rarely pins down cell sites, because cellular licenses cover geographic areas. Carriers' microwave licenses, however, do list coordinates and licensee names, such as Verizon's "Cellco Partnership" ([CPWR](https://www.cpwr.com/wp-content/uploads/publications/Appendix_B_How_to_use_the_FCC__FAA_Databases.pdf); [FCC ULS](https://wireless2.fcc.gov/UlsApp/UlsSearch/licenseLocSum.jsp?licKey=3402927)).
- CellMapper locates towers "based purely on calculations" from data its users upload ([CellMapper FAQ](https://www.cellmapper.net/FAQ)).

Tower ownership is concentrated. At year-end 2025, American Tower reported 41,795 towers in the US and Canada, Crown Castle 39,804 and SBA 17,398 ([Inside Towers](https://insidetowers.com/ranking-u-s-tower-companies/)).

The logical-network layer is the most precisely teachable part of tower spotting, because it rests on 3GPP definitions rather than field lore:

- **Base-station classes** are defined by output power. Wide Area (macro) has no cap. Medium Range (micro) is limited to 38 dBm, Local Area (pico) to 24 dBm and Home (femto) to 20 dBm. NR drops the Home class ([Techplayon](https://www.techplayon.com/base-station-classifications/); [Techplayon NR](https://www.techplayon.com/5g-nr-base-station-classes/)).
- **LTE cell identity:** the 28-bit cell identity (ECI) is a 20-bit base-station (eNB) ID plus an 8-bit sector number, so **ECI = eNB × 256 + sector** ([US Patent 8,346,280](https://patents.google.com/patent/US8346280); [HowardForums](https://www.howardforums.com/threads/lte-sectors.1870828/)). The physical cell ID (PCI) runs only from 0 to 503 and is reused so widely that it identifies neither the band nor the site ([MIT](https://people.csail.mit.edu/bkph/cellular_repeater_numerology)).
- **NR cell identity:** the 36-bit cell identity splits into a base-station (gNB) ID and a cell number, and each operator chooses a gNB ID length between 22 and 32 bits ([Techplayon](https://www.techplayon.com/5g-nr-cell-global-identity-planning/)). UK operators demonstrably choose different splits ([cellinfo.co.uk](https://cellinfo.co.uk/5g-lab-5g-nr-cell-id-format-tool/)). The same identity, 417,816,578, decodes to gNB 102006 under a 24-bit split but gNB 25501 under a 22-bit split. That makes a ready-made exercise in why the setting matters.
- **Channel numbers** map directly to frequencies: LTE channel number (EARFCN) 66786 in B66 is 2145.0 MHz. Identifying the band from a channel number is therefore reliable ([Halberd Bastion](https://halberdbastion.com/technology/cellular/4g-lte/4g-lte-frequency-bands); [3GLTEInfo](https://www.3glteinfo.com/5g/protocols/phy/nr-arfcn/)).

US carriers' numbering conventions are documented only by hobbyist forums, but they are consistent:

- **Verizon** uses decimal sector IDs. The tens digit is the physical sector and the ones digit is the band layer: 1/2/3 for 700 MHz, 12/22/32 for AWS, 14/24/34 for PCS. Sometimes mid-band moves to a separate eNB numbered 300,000 higher ([S4GRU](https://s4gru.com/profile/41193-trip/content/page/30/?type=forums_topic_post)). Independent readings of the same IDs in hexadecimal confirm the scheme ([HowardForums](https://www.howardforums.com/showthread.php/1850023-Verizon-s-Band-2-PCS-LTE-Deployment/page5)).
- **T-Mobile** generally puts B66 in sector IDs 1–10, B2 in 11–20 and B71 in 61–70 ([S4GRU](https://s4gru.com/forums/topic/6889-how-to-identify-t-mobile-network-equipment-nokia-networks/)).

Guessing the vendor from ID patterns is only guessing ([HowardForums](https://www.howardforums.com/threads/who-is-the-vendor-of-this-cell-equipment.1859189/)). The gNB ID lengths that US carriers use were not found, so the app should show the bit length as a visible setting. Mock "field test" screens should be built from real screenshots. The iPhone's `*3001#12345#*` dashboard labels 5G serving cells "NrServingCellInfo", and its layout varies by iOS version, model and carrier ([UberSignal](https://www.ubersignal.com/blogs/articles/field-test-mode)). Android's `*#*#4636#*#*` screen shows the LTE channel number beside the serving cell ([HiCellTek](https://hicelltek.com/en/what-is-earfcn/)).

How much to trust each part of this content:

- **High:** site types, signage rules and identifier arithmetic.
- **Medium:** carrier hardware clues and forum numbering schemes.
- **Low:** guessing the vendor from IDs.

Every finding in this area came from search-engine summaries rather than full-page reads. Dimensions and counts therefore need a spot-check before they become quiz answers.

## Two engines: spaced recall for band facts, perceptual drills for photos

Duolingo in 2026 has three layers:

- a linear path of short lessons grouped into units, which replaced the old skill tree in 2022 ([Appleosophy](https://appleosophy.com/2022/08/30/new-duolingo-design-begins-rolling-out-to-ios-users/));
- a habit layer of XP, streaks, streak freezes and weekly leagues;
- limits on mistakes, which moved from Hearts to Energy starting in mid-2025 ([Duolingo blog](https://blog.duolingo.com/duolingo-energy/)).

Most of the evidence Duolingo has published is about engagement rather than learning:

- Leagues increased total learning time by 17% ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)).
- Spaced review scheduled by its half-life regression model increased daily engagement by 12% ([ACL Anthology](https://preview.aclanthology.org/landing_page/P16-1174)).
- Separating the streak from the daily goal raised the number of learners on streaks of seven days or more by over 40% ([Duolingo blog](https://blog.duolingo.com/improving-the-streak)).

Duolingo also dropped Hearts on learning grounds. It said Hearts were "not the most effective way to support learning" after finding that beginners were twice as likely to run out mid-lesson. (Duolingo's blog could be read only through search excerpts.) For a solo learner, the part worth copying is the learning engine: adaptive difficulty, spaced review and review of past mistakes, plus a gentle habit layer. Leagues, gems and limits on mistakes exist to serve scale and revenue, and should be dropped.

The two subjects are different kinds of learning, and each needs its own engine. **Band facts are paired associations**: a band paired with its frequencies, its duplex mode or its carrier. The best-supported techniques for this kind of material are recall practice (quizzing yourself) and spacing reviews out over time:

- Quizzing beats rereading with an effect size of g = 0.50, rising to 0.73 when the quiz gives feedback ([Rowland, via WSU](https://education.wsu.edu/documents/2018/01/rethinking-use-tests.pdf/)).
- A major review by Dunlosky and colleagues rates practice testing and spaced practice as the only highly useful study techniques ([APS](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html)).

The review scheduler should be FSRS, an open-source scheduling algorithm, rather than Duolingo's own model. Across about 350 million Anki reviews, FSRS-6 predicted recall better than half-life regression on both standard error measures: log loss 0.346 vs 0.469 (lower is better) and AUC 0.703 vs 0.637 (higher is better) ([srs-benchmark](https://github.com/open-spaced-repetition/srs-benchmark)). Implementations under MIT and BSD licenses exist for TypeScript, Rust, Python and Dart ([open-spaced-repetition](https://github.com/open-spaced-repetition)).

Introduce bands in groups by spectrum family before mixing them. Mixing helps learners tell similar categories apart (g = 0.42 overall), but grouping worked better for word-like material (g = −0.39) ([Brunmair & Richter](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf)). Memory aids such as "low band, long reach" are hooks, not a memory strategy. In the available studies, gains from number memory tricks faded within a week ([Wikipedia: mnemonic peg system](https://en.wikipedia.org/wiki/Mnemonic_peg_system)).

**Tower spotting is learning to recognize visual categories.** The closest evidence comes from medical training:

- **Image modules:** short training modules that show many varied real images, give immediate feedback and adapt the order to the learner produced large, lasting gains. They worked in tissue-slide reading, with a 261-image module, and in skin-condition identification ([Krasne et al.](https://kellmanlab.psych.ucla.edu/files/krasne_kellman_hillman_drake_2013.pdf); [Rimoin et al.](https://kellmanlab.psych.ucla.edu/files/rimoin_altieri_craft_krasne_kellman_2015.pdf)). One caveat: the lead researcher's company holds related patents.
- **Mastery means fast and accurate:** ordering images by both accuracy and response time beat random order, and the gains carried over to images the learners had never seen ([Mettler et al. 2011](https://kellmanlab.psych.ucla.edu/files/mettler_massey_kellman_2011.pdf); [Mettler & Kellman 2014](https://kellmanlab.psych.ucla.edu/files/mettler_kellman_2014.pdf)).
- **Feedback should explain, not just grade:**
  - feedback that explains the answer had an effect of 0.49, against 0.05 for right/wrong alone ([Van der Kleij et al.](https://acuresearchbank.acu.edu.au/item/86y84/effects-of-feedback-in-a-computer-based-learning-environment-on-students-learning-outcomes-a-meta-analysis));
  - feedback delayed by 2.5 seconds or more hurts this kind of intuitive visual learning ([Frontiers in Psychology](https://www.frontiersin.org/articles/10.3389/fpsyg.2014.00643/text));
  - highlighting the part of the image that explains the answer improved learners' accuracy in machine-teaching experiments ([Mac Aodha et al.](https://openaccess.thecvf.com/content_cvpr_2018/html/Aodha_Teaching_Categories_to_CVPR_2018_paper.html)).

No study has trained people to identify telecom equipment, so all of this is extrapolated from medical images, birds and plants. Multiple-choice questions also need explanatory feedback, because learners can otherwise remember a wrong option as a fact ([Butler & Roediger](https://mrbartonmaths.com/resourcesnew/8.%20Research/Formative%20Assessment/Feedback%20enhances%20the%20positive%20effects%20and%20reduces.pdf)).

| Format | Teaches | Evidence | Design rule |
|---|---|---|---|
| Image multiple choice | Site type, vendor, equipment class | Strong: quizzing effect plus visual-learning studies | Start with two contrasting options, grow to four close distractors, always explain |
| Tap-the-feature | The deciding clue, such as a separate B14 antenna | Moderate to strong: visual-explanation studies | Accept taps near the target; outline the right region after a miss |
| Type-the-number | Band edges, duplex spacing, channel math | Strong: recall practice | Allow a numeric tolerance; schedule with FSRS |
| Match pairs | First exposure to a band family | Weak to moderate | One family per set; never the only test |
| Order or slider on a spectrum bar | A mental "spectrum ruler" | Weak: no direct studies | Use to wrap up a unit |
| Scenario puzzle | Combining band, photo and ID evidence | Moderate: explanatory feedback matters most here | Use only after the parts are mastered; walk through every clue |

Each unit should move through the same steps:

1. an annotated example;
2. a choice between two contrasting options;
3. a tap-the-feature question on the deciding clue;
4. mixed review that includes earlier units;
5. a test on photos the learner has not seen;
6. a scenario;
7. a "certification" with no hints.

FSRS then takes over the reviews. A rule that unlocks the next unit at 90% accuracy plus a response-time threshold is a design guess, not a value from the research.

Scenario puzzles are where the two subjects come together. For example: a mock field-test screen shows a 5G channel number in the 3.45 GHz slice of n77; the photo shows two massive MIMO boxes per sector; and the sticker is unreadable. The learner reasons from band to license holder to carrier (AT&T) and says how confident the evidence allows them to be. Two existing tools show the feedback pattern. Learnable Meta, a GeoGuessr training tool, explains after each guess the clues the player missed ([Learnable Meta](https://learnablemeta.com/about)). HamStudy's "Explain" button does the same for amateur-radio exam questions ([App Store](https://apps.apple.com/app/id1371288324)).

Game features help, but only modestly on average:

- A meta-analysis found effects of g = .49 on learning, .36 on motivation and .25 on behavior ([Sailer & Homner](https://link.springer.com/article/10.1007/s10648-019-09498-w)).
- They can backfire. In one semester-long course, badges and leaderboards went with lower motivation and lower exam scores ([Hanus & Fox, via review](https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-017-0042-5/tables/13)).
- A broken streak makes people give up the habit unless the streak can be repaired ([CU Boulder](https://www.colorado.edu/business/news/2023/04/20/research-streaks-marketing-tech-barasch)).

The solo app should therefore include:

- a streak that one lesson or one review keeps alive, with automatic freezes and a 48-hour repair window;
- a daily goal the learner sets, kept separate from the streak;
- XP weighted toward getting something right the first time and toward correct answers on new photos, rather than repetition;
- a progress map, plus a spectrum heatmap colored by how well each band is remembered, using FSRS's recall estimate;
- achievements based on mastery;
- personal bests.

It should leave out:

- hearts or energy limits;
- guilt-laden notifications;
- leaderboards filled with bots;
- random loot rewards;
- countdown timers for beginners.

A 2025 analysis of Duolingo's interface classed guilt-laden notifications and streak pressure among its deceptive design patterns ([Castro & Valença](https://sol.sbc.org.br/index.php/ihc/article/view/37677)).

Copying Duolingo's mechanics is legal; copying its look is risky. The US Copyright Office does not protect a game's idea or "the method or methods for playing it" ([Copyright Office FL-108](https://webharvest.gov/peth04/20041015011900/http://copyright.gov/fls/fl108.pdf)). But in *Tetris Holding v. Xio*, a court found a near-identical clone liable for infringing both copyright and "trade dress", meaning its overall look and feel ([Loeb & Loeb](https://www.loeb.com/en/insights/publications/2012/06/tetris-holding-llc-v-xio-interactive-inc)). A personal app that is never shared carries negligible practical risk, and designing it to be shareable from the start costs nothing. In practice that means:

- **Avoid:** an owl or other bird mascot, any "Duo" or "-lingo" name, and Duolingo's green, its path styling or its assets.
- **Use instead,** a radio-network identity:
  - towers lighting up on a coverage map;
  - mastery levels shown as signal bars;
  - an "uptime" streak;
  - "drive test" reviews;
  - "site certification" challenges.

## Tauri, Motion and Rive deliver the feel at near-zero cost

Tauri 2 suits a solo builder who knows web development best. Its core reached v2.10.0 in February 2026, with 2.11.x releases through July ([Tauri](https://v2.tauri.app/release/tauri/)). Its strengths:

- A minimal app installs from roughly 3–10 MB and uses around 42–50 MB of memory at idle. Electron needs roughly 85–250 MB and 120–170 MB ([tech-insider](https://tech-insider.org/tauri-vs-electron-2026/); [Hopp](https://www.gethopp.app/blog/tauri-vs-electron); [buildmvpfast](https://www.buildmvpfast.com/blog/tauri-v2-vs-electron-desktop-apps-2026)).
- It can use the entire web animation ecosystem.
- It has official plugins for SQLite and updates.

Its costs are concrete:

- **On Linux,** it draws the interface with WebKitGTK. WebKitGTK's faster GPU path (the DMABUF renderer) produces blank windows, flicker and crashes on NVIDIA drivers unless it is turned off, which means giving up the faster path ([Tauri docs](https://v2.tauri.app/develop/debug/linux-graphics/)). Open WebKit bugs also glitch CSS 3D transforms and slow down gradient-mask animations ([WebKit 255328](https://bugs.webkit.org/show_bug.cgi?id=255328); [WebKit 265048](https://bugs.webkit.org/show_bug.cgi?id=265048)).
- **On macOS,** the system webview caps animation at about 60 frames per second by default. The known workaround uses a private Apple API, and whether macOS 26 lifted the cap is disputed ([WebKit 294338](https://bugs.webkit.org/show_bug.cgi?id=294338); [tauri-plugin-macos-fps](https://docs.rs/crate/tauri-plugin-macos-fps/0.1.0)).

A 60 frames-per-second ceiling is fine for a learning app, whose feel comes from easing and timing. Linux is the real test.

| Option (late 2026) | Installer | Rendering | Role for this app |
|---|---|---|---|
| Tauri 2.x + React or Svelte + TypeScript | ~3–10 MB | Each OS's built-in webview: WebView2, WKWebView, WebKitGTK | **First choice**: smallest, with the richest animation tools; test Linux in week one |
| Electron 44/45 | ~85–250 MB | Its own copy of Chromium on every OS | Fallback that runs the same front-end code unchanged; new major version every 8 weeks |
| Flutter 3.47 | ~25 MB (one benchmark) | Own engine; Impeller is the default desktop renderer | **Second choice** if identical, self-drawn animation on every OS matters more than the web ecosystem |
| Godot 4.6/4.7 | ~93 MB default, ~5 MB with a custom build | Own engine | Only for a game-first design; app-style screens are clumsy |
| Avalonia 12 | not measured | Skia | Workable for C# developers; few animation tools |
| Wails v3 | <10 MB | Each OS's built-in webview | Still in beta, with the same webview caveats as Tauri |
| Compose Multiplatform 1.12 | ~40–100+ MB | Skia on the Java runtime | Bundles a Java runtime; desktop is a niche target |
| .NET MAUI | — | Native controls | Ruled out: no official Linux support |

The table draws on these sources:

- Electron: [endoflife.date](https://endoflife.date/electron).
- Flutter: [startdebugging.net](https://startdebugging.net/2026/08/flutter-3-47-impeller-default-renderer-on-desktop/) and [Fyrosoft](https://fyrosofttech.com/blog/cross-platform-desktop-apps-2026/). Both the Flutter benchmark and the 3.47 renderer change rest on secondary blogs.
- Godot: [popcar](https://popcar.bearblog.dev/how-to-minify-godots-build-size/).
- Avalonia: [wikidocs](https://wikidocs.net/blog/@lukewire/9758/).
- Wails: [GitHub](https://github.com/wailsapp/wails/releases/tag/v3.0.0-beta.26).
- Compose Multiplatform: a [Kotlin Slack thread](https://slack-chats.kotlinlang.org/t/10320208/i-d-like-to-share-a-lesson-learned-with-you-which-you-may-fi).
- .NET MAUI: [byteiota](https://byteiota.com/net-maui-linux-support-two-paths-forward-in-2026/).

Duolingo animates its characters with Rive state machines, which switch and blend animations as the app runs. Its video-call character blends eight head and eight body animations into more than 64 idle variations ([Rive](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life); [Duolingo blog](https://blog.duolingo.com/world-character-visemes)). Rive's playback libraries are MIT-licensed, with no royalties ([Rive](https://rive.app/runtimes)). Its editor is proprietary, though, and reports on export terms conflict. Rive's own blog says exporting moved to paid plans, starting at $9 a month ([Rive blog](https://rive.app/blog/rive-s-new-9-mo-plan)). A 2026 third-party FAQ says free exports work but show a splash screen ([ExodeUI](https://www.exodeui.com/questions/is-rive-free-for-commercial-use/)). Check before committing.

The recommended split of animation work:

- **Rive** for the mascot and celebrations, with states for idle, thinking, correct, wrong and celebrate.
- **Motion** (MIT) springs for small interface movements: buttons squashing when pressed, answer cards being selected, the progress bar overshooting slightly, and path nodes appearing one after another ([npm](https://npmjs.com/package/motion)).
- **A canvas confetti layer,** with short sounds timed to the peak of each spring.
- **Lottie** only for one-off animations that don't respond to the user. LottieFiles itself calls its interactive feature "not production ready" ([LottieFiles](https://docs.lottiefiles.com/en/format/dotlottie/interactivity)).
- **GSAP** is optional. It became free in April 2025, but under a proprietary license that Webflow can revoke ([Webflow](https://webflow.com/blog/gsap-becomes-free); [ScanCode LicenseDB](https://scancode-licensedb.aboutcode.org/gsap-standard-no-charge-2025.html)).

Inside Tauri:

- Use Rive's Canvas2D package. Its WebGL2 package depends on a draft graphics extension that the WebKit-based webviews may not support ([Rive docs](https://rive.app/docs/runtimes/web/canvas-vs-webgl)).
- Animate only position, scale and transparency (transform and opacity), the properties the WebKitGTK bugs leave alone.
- Keep instant feedback within about 50–100 ms and screen transitions within 100–200 ms, following community animation guidance ([skills.cat](https://skills.cat/skills/dylantarre/animation-principles/micro-interactions)).
- Ship a "reduce motion" switch that also serves as the fallback for weak Linux graphics.

For storage and scheduling:

- **Storage:** a SQLite file through the official tauri-plugin-sql, which applies versioned database upgrades at startup ([Tauri](https://v2.tauri.app/jp/plugin/sql)).
- **Scheduler:** ts-fsrs v5.4.1, a TypeScript implementation of FSRS-6 ([jsDelivr](https://cdn.jsdelivr.net/npm/ts-fsrs@5.4.1/README.md)).
- **Rating each answer for FSRS:** a wrong answer rates as Again, a slow or hinted correct answer as Hard, a correct answer as Good, and a fast correct answer as Easy.
- **Logging:** record the response time on every question.
- **Settings:** keep FSRS's default parameters until a few hundred reviews have built up.

Lessons should live as plain-text YAML files in git, checked against a schema and built into a versioned content pack. The most important design choice is a single bands data file that is the only place frequencies are stored:

- **What each row holds:** the band values, a CURRENT/HISTORICAL/PENDING/PLANNED label, an as-of date, a reference to the 3GPP standard and a source URL.
- **How quizzes use it:** quiz items are generated from the file when the app is built. A spectrum change then becomes a one-row edit and a rebuild.

A few other content choices:

- **Image format:** use WebP, which Safari has supported since version 14 ([Appwrite](https://appwrite.io/blog/post/webp-support-for-safari.md)). Avoid AVIF, which a macOS webview bug can fail to display ([WebKit 277794](https://bugs.webkit.org/show_bug.cgi?id=277794)).
- **Tap-the-feature regions:** draw them with Annotorious (BSD-3 license) and store them as outlines scaled to the image size ([GitHub](https://github.com/rssaini01/annotorious)).
- **Stable IDs:** exercise IDs must not change, so that review history survives content edits.
- **Updates:** content can ship inside signed app updates, because Tauri's updater has its own signing key ([dev.to](https://dev.to/tomtomdu73/ship-your-tauri-v2-app-like-a-pro-code-signing-for-macos-and-windows-part-12-3o9n)).

AI belongs in the content-writing step, not inside the running app. Current Claude prices per million input/output tokens are Haiku 5.5 at $0.10/$0.50, Sonnet 5.5 at $2/$10 and Opus 5.5 at $4/$20 ([Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)), and the Batches API halves them ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/batch-processing)). At those prices, drafting 1,000 explanations of about 1,500 input and 300 output tokens costs roughly $0.30 on Haiku 5.5 or $6 on Sonnet 5.5 before the batch discount. Structured outputs can force the drafts into the lesson format ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)). The firm rule is that the model writes the wording but never the frequencies, which come only from the bands file. AI inside the running app would break offline use. It would also need either a key the user supplies or a proxy server, because a key built into a desktop app can be extracted. Local models need 8–16 GB of RAM ([SitePoint](https://www.sitepoint.com/ollama-setup-guide-2026/)).

## A 3–6 month MVP whose biggest risk is stale facts

The first step is a one-to-two-day test build: one animated lesson screen with the Rive mascot, spring buttons and confetti. Run it on Windows, macOS and a Linux machine, ideally one with an NVIDIA graphics card. The result decides the stack:

- If it runs smoothly everywhere, commit to Tauri.
- If Linux stutters but you want to stay with web technology, move the same front end to Electron.
- If leaving web technology is acceptable, switch to Flutter.

Start the project from create-tauri-app's React or Svelte TypeScript template ([Tauri](https://v2.tauri.app/guides/create/)). Treat open-source Duolingo clones built with Next.js as design references only. react-duolingo is the leanest; others bundle user accounts, a Postgres database and Stripe payments, which an offline desktop app does not need ([react-duolingo](https://www.github.com/bryanjenningz/react-duolingo); [duolingo-clone](https://github.com/NickCoder123/duolingo-clone)).

The minimum viable product (MVP) includes:

- a path map;
- four exercise types: text multiple choice, image multiple choice, tap-the-feature and match pairs;
- FSRS reviews;
- XP and a forgiving streak;
- a Rive mascot;
- signed builds for all three operating systems, with automatic updates.

It carries about ten units of five lessons each:

| Unit | Theme | Core content | Main exercise types |
|---|---|---|---|
| 1 | The spectrum ruler | FR1 vs FR2; low, mid and high band; FDD vs TDD; reversed and lopsided bands | Ordering, spectrum slider, multiple choice |
| 2 | Low band | B71/n71, B12/B17/B85, B13, B14/FirstNet, B5/n5; B26 as history | Match pairs, type-the-number |
| 3 | Mid-band FDD | B2/B25/n25, B4/B66/n66, B30; B70/n70 as history | Match pairs, type-the-number |
| 4 | Capacity layers | n41; n77 with its 3.45 GHz, C-band and upcoming upper C-band slices; B48/n48; n260/n261 | Multiple choice, scenario |
| 5 | Who uses what | Fingerprint bands, marketing icons, the 2025–26 changes, satellite-to-phone service | Scenario, multiple choice |
| 6 | Site families | Macro towers, rooftops, disguised sites, small cells, DAS, temporary sites | Image multiple choice |
| 7 | Reading a site | The 200 ft rule, registration and RF signs, carrier stickers, mounting heights, shared towers | Tap-the-feature, image multiple choice |
| 8 | Hardware | Passive panels vs remote radios vs massive MIMO, counting ports, vendor model codes | Tap-the-feature, image multiple choice |
| 9 | Logical cells | Base-station classes, sectors, eNB/gNB IDs, PCI, EARFCN and NR-ARFCN, field-test screens | Decoding drills, type-the-number |
| 10 | Capstone | Combine band, photo and ID evidence to name the carrier and site type | Scenario puzzles, no-hint certification |

| Work item | Hours (low–high) |
|---|---|
| Project setup and automated builds for Windows, macOS and Linux | 8–15 |
| Learning-path map and navigation | 15–25 |
| Exercise engine with four types | 25–45 |
| SQLite database, FSRS integration and review queue | 10–20 |
| Animation polish: springs, transitions, confetti, sound, Rive integration | 20–40 |
| Content pipeline: schema, validation, image processing, a page for drawing tap regions | 15–25 |
| Packaging, signing, updater and release process | 8–20 |
| Testing and fixes on all three systems, including Linux WebKitGTK | 15–30 |
| **Engineering subtotal** | **~115–220** |
| Content authoring: ~10 units × 5 lessons, images, tap regions | 30–80 |
| Rive mascot, if self-made | +10–40, or commission one |

These hours are an estimate built up from the parts above, not a published benchmark. They assume fluency in TypeScript and React plus an AI coding assistant, and they shrink for someone who already knows Rust or Rive. The cash budget is close to zero:

- the software is free;
- a Rive plan may cost about $9 a month;
- code signing is optional for personal use. Apple charges $99 a year ([dev.to](https://dev.to/tomtomdu73/ship-your-tauri-v2-app-like-a-pro-code-signing-for-macos-and-windows-part-12-3o9n)), and Electron's documentation calls Azure Trusted Signing the cheapest Windows option where eligible ([Electron](https://electronjs.org/docs/tutorial/code-signing)).

Photos are the slowest content to gather. Wikimedia Commons' "Mobile phone towers in the United States" category holds 183 files ([Commons](https://commons.wikimedia.org/wiki/Category:Mobile_phone_towers_in_the_United_States)). Its 5G category has only about 15, mostly antennas on poles and rooftops ([Commons](https://commons.wikimedia.org/wiki/Category:5G_towers_in_the_United_States)). Small cells and carrier equipment will therefore need two other sources:

- Flickr images filtered for "Commercial use & mods allowed" ([Trevecca library guide](https://library.trevecca.edu/images/creativecommons));
- the learner's own photos, taken from public property outside fenced, signposted equipment compounds ([Trident](https://www.tridentproducts.com/cell-tower-safety-identification/)).

US copyright law has no exception for private copying, so even an app that is never shared relies on "fair use". Fair use leans favorable for private, non-commercial study, but it is not automatic ([Salisbury University](https://libraryguides.salisbury.edu/copyright/personaluse); [ALRC](https://www.alrc.gov.au/publication/copyright-and-the-digital-economy-dp-79/9-private-and-domestic-use/an-alternative-a-new-confined-exception)). Photos posted on Reddit or CellMapper remain the photographers' property, and Reddit's license runs to Reddit, not to its users ([ConductAtlas](https://conductatlas.com/platform/reddit/reddit-user-agreement/perpetual-royalty-free-content-license/)). From day one, record the source, author, license and any changes for every image.

### The risks are mostly about facts, not code

| Risk | Why it matters | Mitigation |
|---|---|---|
| Out-of-date carrier content | The carrier map changed repeatedly in 2025–26. Several changes are still pending: the upper C-band auction ([Federal Register](https://www.federalregister.gov/documents/2026/08/03/2026-15725/auction-of-flexible-use-licenses-in-the-upper-c-band-for-next-generation-wireless-services-scheduled)), the move of AWS-4 spectrum to SpaceX ([EchoStar 10-Q](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm)) and the CBRS power rules ([Wiley](https://www.wiley.law/alert-The-FCC-Seeks-Comment-on-Proposed-Changes-to-the-35-GHz-Band-Framework)) | Status labels with as-of dates and a source on every row; a quarterly check of SEC and FCC filings; "changed since you learned it" review cards |
| Unverified table entries | AT&T and Verizon PCS/AWS/850 assignments, T-Mobile's n77 use, DSS status and US gNB ID lengths are unverified; Wikipedia has no 5G deployment data | Show visible "unverified" badges; upgrade an entry only after a filing, a CellMapper observation or your own field-test log confirms it |
| Hardware clues going stale | AT&T's Nokia removal ends in early 2027 ([Fierce Network](https://www.fierce-network.com/wireless/atts-vendor-swap-moves-full-speed-ahead)); Dish equipment is being removed or resold ([Light Reading](https://www.lightreading.com/5g/tower-companies-now-own-dish-s-abandoned-5g-radios-and-spacex-might-become-a-buyer)) | Teach stickers, permits and band labels first; date-stamp every hardware card |
| Webview rendering | Driver and CSS bugs in Linux's WebKitGTK ([Tauri docs](https://v2.tauri.app/develop/debug/linux-graphics/)); a ~60 frames-per-second cap on macOS ([WebKit 294338](https://bugs.webkit.org/show_bug.cgi?id=294338)) | Week-one test build; animate transform and opacity only; Rive Canvas2D; a reduce-motion switch; Electron as fallback |
| Photo supply and rights | Commons has few small-cell photos; US law has no private-copying exception | Record each image's source and license; use Commons, Creative Commons Flickr images and your own photos; replace other people's images before sharing |
| Looking like Duolingo | *Tetris v. Xio*: copying the look and feel infringes even when the mechanics are free to use ([Loeb & Loeb](https://www.loeb.com/en/insights/publications/2012/06/tetris-holding-llc-v-xio-interactive-inc)) | Original name, theme, mascot and colors from day one |
| Rive license terms | Exports may need a paid plan or show a splash screen ([Rive blog](https://rive.app/blog/rive-s-new-9-mo-plan); [ExodeUI](https://www.exodeui.com/questions/is-rive-free-for-commercial-use/)) | Check rive.app/pricing; fall back to an SVG mascot animated with Motion |

## Conclusion

The research changes what the project is. It is less an app that happens to contain some content than a small, versioned dataset, with a game on top, in which every fact carries a grade for how well it is supported. The most important piece of engineering is therefore the structure of the bands file, with a status, an as-of date, a source and an evidence grade on every row. The choice of framework matters less. This matters because spaced repetition does not discriminate. It makes whatever it drills stick, so an unverified card such as "AT&T uses B66" would be learned as firmly as a verified one. Showing the learner how strong the evidence is turns that weakness into part of the curriculum. The 2025–26 changes, the hardware clues going stale and the Wikipedia entries that fell out of date are themselves lessons in how quickly cellular knowledge ages.

The same logic says what to teach. Shortcuts such as "B71 means T-Mobile" or "Nokia gear on an AT&T mount" will not last. The chain of reasoning will survive every auction and vendor swap: frequency to band, band to license holder, license holder to evidence on the ground, with the sticker weighed first and the brand last. An app that trains that chain stays useful long after its specific answers change. The cheapest uncertainty to settle is the technical one, since a two-day test build confirms whether the stack runs smoothly on all three operating systems. The expensive work is checking facts and gathering photos, and that grows with the learner's ambition, not with the code.
