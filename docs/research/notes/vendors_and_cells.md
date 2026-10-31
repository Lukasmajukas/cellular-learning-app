# US Cellular RAN Vendors, Equipment Recognition, and Logical Cells/Identifiers (as of 2026-10-31)

Confidence tags used throughout: **[P]** primary (operator/vendor release, SEC/FCC/municipal or state siting filing, 3GPP-derived reference or calculator); **[T]** trade press; **[C]** community/hobbyist heuristic (S4GRU, HowardForums, CellMapper users); **[W]** weak (reseller listings, blogs, garbled PDF extractions, AI-generated wikis). Method caveat: WebFetch was blocked by this session's network policy for about.att.com, fierce-network.com, lightreading.com and sdxcentral.com, and the shared web-search budget ran out before the last two queries. Most findings below come from search-engine summaries of the cited pages, not full-page reads, so check exact figures against the source before they go into lesson content.

---

## 1. Which RAN and antenna vendors supply each major US carrier as of 2026, and how has that changed recently?

### Takeaway
AT&T is now an Ericsson-dominant network. The Nokia-to-Ericsson swap passed 50% in 2026, Ericsson held about 84% of AT&T macro sites by H2 2025, and full completion is expected in early 2027. Verizon runs Samsung (mostly vRAN, including C-band massive MIMO) plus Ericsson, and Nokia has been largely pushed out since about 2020. T-Mobile is still split between Ericsson and Nokia; Nokia's deal was extended in April 2025. EchoStar/Boost stopped building in August 2025, moved all its traffic onto AT&T by November 15, 2025, sold its 3.45 GHz and 600 MHz licenses to AT&T (closed July 28, 2026), and is taking down its Samsung/Fujitsu/Mavenir-era RAN. On the antenna side, CommScope's base-station antenna business is now "Andrew, an Amphenol Company" (closed January 31 / February 3, 2025).

### Cited Findings

**AT&T: moving to Ericsson as single main supplier; Nokia being removed**
- [T] AT&T picked Ericsson for its Open RAN program (announced December 2023), and Nokia lowered its guidance as a result — [Telecoms.com](https://www.telecoms.com/operator-ecosystem/nokia-lowers-guidance-after-at-t-picks-ericsson-for-open-ran)
- [P] AT&T's VP of RAN technology wrote in a 2026 AT&T blog post: "We've completed more than 50% of our radio replacement ('swap') program." — [AT&T blog, "AT&T Advances Open RAN Readiness" (2026)](https://about.att.com/blogs/2026/att-advances-open-ran-readiness.html)
- [T] A June 2026 report puts the swap at about 80% complete by end-2026, with full completion expected in early 2027 — [Fierce Network](https://www.fierce-network.com/wireless/atts-vendor-swap-moves-full-speed-ahead)
- [T] "AT&T claims 50% of Nokia gear has been 'ripped' from its network" — [SDxCentral](https://www.sdxcentral.com/news/att-claims-50-of-nokia-gear-has-been-ripped-from-its-network/)
- [T] The replacement is run as a "warm swap": both vendors' gear runs side by side for a period to limit outage risk — [Light Reading, "Inside AT&T's Nokia rip-and-replace with Ericsson"](https://www.lightreading.com/open-ran/inside-at-t-s-nokia-rip-and-replace-with-ericsson)
- [T] Ookla (reported May 2026) found Ericsson's share of AT&T macro RAN sites rose to **84.21% in H2 2025**. Ericsson held about two-thirds of AT&T RAN sites when the switch began. Ookla used RootMetrics drive and walk tests. The coverage does not explain how Ookla attributed sites to vendors. The summary also reports a failure-rate figure falling from 12% to 5% for Nokia-served areas, but the metric is not clearly defined — [Light Reading](https://www.lightreading.com/5g/att-phaseout-of-old-nokia-ran-boosted-performance-says-ookla)
- [T] An earlier Ookla analysis looked at vendor-based speed gaps among US carriers and "finds AT&T wanting" — [Rethink Research](https://rethinkresearch.biz/articles/ookla-examines-vendor-based-american-speed-gaps-finds-att-wanting/)
- [P/T] AT&T Cloud RAN is live in two cities, with integration and scaling planned to start by end of Q1 2026. Third-party **1Finity** small cells (1Finity is the Fujitsu-derived vendor the brief calls "Fujitsu/1Finity") are being installed in New York City and Phoenix — [AT&T blog](https://about.att.com/blogs/2026/att-advances-open-ran-readiness.html); [DCD](https://www.datacenterdynamics.com/en/news/att-lauds-open-ran-progress-eyes-further-small-cell-opportunities/)
- [T] AT&T's original goal was to carry 70% of its traffic on open-capable platforms by late 2026 — [Light Reading, "AT&T expands open RAN and cloud is on the horizon"](https://www.lightreading.com/5g/at-t-expands-open-ran-and-cloud-is-on-the-horizon). [W] A training-company blog says about half of traffic was on open-capable hardware in early 2026. This is unverified — [5gworldpro](https://5gworldpro.com/blog/2026/03/10/the-real-5g-open-ran-numbers-in-2026/)
- [P] AT&T bought all of EchoStar's 3.45 GHz and 600 MHz licenses. FCC and DOJ approved on May 12, 2026, and the deal **closed July 28, 2026** — [EchoStar 10-Q, Q2 2026](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm). The spectrum is about 30 MHz of nationwide 3.45 GHz plus about 20 MHz of 600 MHz — [Dallas Innovates](https://dallasinnovates.com/att-closes-deal-to-acquire-wireless-spectrum-licenses-from-echostar/); see also [Telecoms Tech News](https://www.telecomstechnews.com/news/att-closes-23b-echostar-spectrum-deal-boost-5g-capacity/) and [Broadband Breakfast](https://broadbandbreakfast.com/echostar-at-t-close-23-billion-spectrum-sale/). Price is about $23B: a $22.65B base price per the [EchoStar Annual Report FY2025](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926108968/sats-20251231xars.pdf); per the 10-Q, $20.25B in cash plus $2.4B paid into a mandated Wireless Creditor Trust. Open issues remain — [Light Reading](https://www.lightreading.com/5g/echostar-closes-at-t-spectrum-deal-but-wrinkles-remain)

**Verizon: Samsung + Ericsson; Nokia legacy**
- [T] Samsung's roughly $6.64B Verizon 5G RAN supply contract ran **June 30, 2020 – December 31, 2025** — [Telecoms.com](https://www.telecoms.com/5g-6g/samsung-joins-the-5g-ran-big-leagues-with-6-6bn-verizon-deal); [Fierce](https://www.fierce-network.com/financial/samsung-scores-6b-network-deal-verizon)
- [T] Verizon signed a five-year, **$8.3B Ericsson** contract covering massive MIMO radios and Cloud RAN, making Ericsson its top RAN supplier "for the foreseeable future". My searches did not confirm the signing date — [SDxCentral](https://www.sdxcentral.com/news/ericsson-lands-83b-for-verizon-5g-ran-expansion/)
- [T] Verizon largely cut Nokia from 5G RAN, going from three vendors to two, though it said "Nokia does continue to be an important partner" — [SDxCentral, "Verizon Boots Nokia, Samsung Gets the Spoils"](https://www.sdxcentral.com/news/verizon-boots-nokia-samsung-gets-the-spoils/)
- [P] A 2021 Connecticut Siting Council filing (Griswold, Norman Rd) shows Verizon adding three Samsung MT6407-77A units and "REPLACE (9) EXISTING NOKIA RRHS ON TOWER WITH (3) NEW SAMSUNG B5/B13 RRH-RF4440D-13A". This is direct evidence that Samsung replaced Nokia on Verizon sites — [CT Siting Council filing](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/griswold/normanrd/verizon/em-ver-058-211018_filing_normanrd.pdf)
- [T/P] Verizon reported more than 10,000 vRAN sites, with Samsung as lead vendor, and later added Ericsson — [Fierce](https://www.fierce-network.com/tech/verizon-ratchets-10k-vran-sites-samsung-adds-ericsson); [Samsung newsroom](https://news.samsung.com/us/samsung-verizon-charge-ahead-with-vran/)
- [T] Verizon's CTO said Samsung vRAN supplies almost half of Verizon's open-RAN-compliant capacity and that Ericsson is not yet ready to match it — [Light Reading](https://www.lightreading.com/5g/verizon-ups-pressure-on-ericsson-to-be-open-like-samsung)
- [T] Verizon deployed C-band at sites using both Ericsson and Samsung equipment. A Verizon C-band lab trial used Ericsson's AIR 6449 with Baseband 6648 — [Mobile World Live](https://www.mobileworldlive.com/top-three/verizon-aggregates-c-band-mmwave-spectrum/)
- [P] Samsung (in a release later than the 2021 trial) says Verizon has deployed its 64T64R C-band massive MIMO radio throughout its commercial vRAN network nationwide — [Samsung Networks press release](https://www.samsung.com/global/business/networks/insights/press-release/0213-samsung-verizon-and-keysight-advance-commercial-open-ran-with-extensive-conformance-and-interopera-ility-testing); 2021 trial context at the [Samsung newsroom](https://news.samsung.com/us/verizon-and-samsung-complete-fully-virtualized-5g-data-session-c-band-spectrum/). Samsung/Verizon/Keysight O-RAN testing covered "CAT-B 64T64R Massive MIMO C-Band radios, and the 16T16R C-band and CBRS dual-band radio" — [Samsung Networks press release](https://www.samsung.com/global/business/networks/insights/press-release/0213-samsung-verizon-and-keysight-advance-commercial-open-ran-with-extensive-conformance-and-interopera-ility-testing)
- [T] Verizon has deployed thousands of Samsung O-RAN-compliant radios and is working with Ericsson on O-RAN — [Fierce](https://www.fierce-network.com/5g/verizon-has-deployed-thousands-samsung-o-ran-compliant-radios-and-working-ericsson-o-ran)

**T-Mobile: Ericsson + Nokia**
- [T] Nokia announced a multi-year extension on **April 24, 2025**. It covers next-gen baseband and radios, including the AirScale portfolio and **Habrok** massive MIMO, plus hardware, software and services — [DCD](https://www.datacenterdynamics.com/en/news/nokia-secures-5g-ran-deal-with-t-mobile-in-us/); [Telecompaper](https://www.telecompaper.com/news/t-mobile-us-inks-new-contracts-with-nokia-ericsson-for-5g-expansion--1368598)
- [T] Ericsson has a five-year, "multi-billion-dollar" T-Mobile contract covering its Radio System portfolio: low-band coverage plus massive MIMO on mid-band and high-band. The exact signing date is unconfirmed. The earlier 2018 deals were $3.5B each — [Mobile Europe](https://www.mobileeurope.co.uk/ericsson-to-expand-t-mobile-s-5g-network-across-the-us/); [Light Reading](https://www.lightreading.com/5g/ericsson-lands-3-5b-5g-deal-with-t-mobile-weeks-after-nokia-did-same); [Telecoms.com](https://www.telecoms.com/5g-6g/t-mobile-s-5g-mega-spend-continues-with-nokia-ericsson-deals)
- [T, contested] An analyst claimed that most of Nokia's Osprey 64T and Habrok 64T massive MIMO units at T-Mobile are fan-cooled. T-Mobile responded that it "works with both Nokia and Ericsson on our RAN" — [Yahoo Finance](https://finance.yahoo.com/news/nokia-slumps-analyst-predicts-t-190917429.html)
- [T] As of May 2026, Ericsson and T-Mobile were targeting commercial launch of an AI-native scheduler with link adaptation in Q3 2026 — [Fierce](https://www.fierce-network.com/wireless/t-mobile-feats-ai-ran-innovation-ericsson)
- [T] Ericsson was T-Mobile's RAN vendor in Las Vegas, used as the comparison point in a Signals Research study — [Signals Research](https://signalsresearch.com/news/dishs-5g-network-in-las-vegas-shows-big-improvement/)
- [P] Filings show T-Mobile installing Ericsson AIR 6449 B41, RRUS 8843 B2 B66A and Radio 4480 B71+B85 (details in Q2) — [Montgomery County MD filing](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2021011358+Application.pdf); [CT filing (Sterling)](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/sterling/exeterdr/t-mobile/ts-t-mobile-136-210916_filing_exeterrd.pdf)

**Boost / EchoStar (Dish): RAN abandoned in favor of AT&T**
- [T] Build-out vendors: Dish's first 5G radios came from Fujitsu (alongside MTI), with vRAN CU/DU software from Altiostar (now Rakuten Symphony) and Mavenir — [Light Reading (Fujitsu)](https://lightreading.com/5g/dishs-5g-radios-to-come-from-japans-fujitsu/d/d-id/762069). In 2022 Samsung won a multi-year deal worth more than $1B for radios and baseband — [Light Reading](https://www.lightreading.com/open-ran/dish-inks-1b-deal-with-samsung-for-5g-radios); [MarketScreener/Reuters](https://www.marketscreener.com/news/latest/Samsung-signs-deal-with-Dish-for-5G-radios-phones-40257083/). 2022 coverage also lists JMA Wireless, CommScope, CellMax and KMW as Dish partners — [Euronews/Reuters](https://www.euronews.com/2022/05/03/dish-network-5g-samsung)
- [P] EchoStar ended its 5G deployment in August 2025 and began abandoning and decommissioning the parts of the network its Hybrid MNO model won't use. It "migrated all customer traffic from our 5G Network ... to AT&T's network" by **November 15, 2025**. The Boost core stays, and RAN elements will be decommissioned over time — [EchoStar 10-Q Q2 2026](https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm)
- [P] Boost has about 7 million customers. Their usage triggered a requirement that AT&T keep serving Boost customers through at least 2031 — [EchoStar 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1415404/000110465926021817/tmb-20251231x10k.htm)
- [T] The FCC's May 2026 approval required a $2.4B escrow tied to decommissioning the Dish 5G network (the 10-Q describes the $2.4B as paid into a Wireless Creditor Trust) — [Fierce](https://www.fierce-network.com/wireless/boost-mobile-soldiers-dish-seeks-chapter-11-protection). Reports link the closing delay to bankruptcy filings by two EchoStar subsidiaries in June 2026 — [Broadband Breakfast](https://broadbandbreakfast.com/echostar-at-t-close-23-billion-spectrum-sale/)
- [T] In August 2025 Boost said it would decommission mobile sites as it became a "hybrid operator" — [The Mobile Network](https://the-mobile-network.com/2025/08/boost-mobile-to-turn-off-mobile-network-as-its-hand-is-forced-over-spectrum-sale/); [Light Reading](https://www.lightreading.com/5g/echostar-s-future-as-a-facilities-based-wireless-carrier-is-toast-amid-spectrum-sale-to-at-t); [SDxCentral](https://www.sdxcentral.com/news/echostar-kills-boost-5g-network-gear-but-eyes-more-spectrum/); [Light Reading 2025 review](https://www.lightreading.com/5g/2025-in-review-echostar-navigates-a-series-of-storms)
- [T] The shutdown "left Mavenir in the lurch" — [IEEE ComSoc Techblog](https://techblog.comsoc.org/2025/09/02/mulit-vendor-open-ran-stalls-as-echostar-dish-shuts-down-its-5g-network-leaving-mavenir-in-the-lurch/)

**Smaller RAN vendors**
- [T] **Mavenir** stopped making and distributing Open RAN radios in **June 2025** as part of a recapitalization. It eliminated debt (figures vary: ">$1.3B" in one source, "a billion" in a headline) and raised $300M in new financing. It will license its radio IP to ODMs, and in December 2025 it refocused on core software and AI — [The Mobile Network](https://the-mobile-network.com/2025/06/mavenir-drops-a-billion-in-debt-and-radio-unit-hardware-business/); [Wikipedia](https://en.wikipedia.org/wiki/Mavenir_Systems,_Inc.); [Fierce](https://www.fierce-network.com/wireless/mavenir-sails-new-financing-ai-focus)
- [T] **Airspan** filed Chapter 11 in spring 2024 (sources conflict: March 31 vs April) and went private. It then bought Jabil's Open RAN radio portfolio (March 2025) and won a $42M NTIA grant (January 2025) to develop an RU for Rakuten in Japan — [Fierce](https://www.fierce-network.com/wireless/airspan-heads-back-private-status-after-chapter-11-filing); [SDxCentral](https://www.sdxcentral.com/analysis/chapter-11-bankruptcy-underscores-open-ran-tailspin/); [RCR Wireless](https://www.rcrwireless.com/20250310/5g/airspan-jabil-open-ran); [Airspan](https://airspan.com/news/airspan-expands-open-ran-leadership-with-acquisition-of-jabils-radio-portfolio-ipr-and-rd-team/); [Light Reading](https://www.lightreading.com/open-ran/airspan-deal-with-rakuten-is-a-small-boost-for-us-open-ran)
- [P/T] **Parallel Wireless** announced general availability of its Trusted RIC (T-RIC) and xApp interop lab services on November 4, 2025. It had major layoffs in 2022 — [Parallel Wireless](https://www.parallelwireless.com/press_release/parallel-wireless-re-energizes-open-ran-with-trusted-ric/); [Light Reading](https://www.lightreading.com/open-ran/open-ran-vendor-parallel-wireless-makes-significant-staff-cuts)
- [T/P] **JMA Wireless** got about $44M in federal funding to build its ARMOR radio platform in Syracuse, NY. Its software-based XRAN platform is used in DoD/Marine Corps, Army expeditionary and private CBRS networks such as American Dream in New Jersey. I found no 2025–26 big-three macro rollouts — [Light Reading](https://www.lightreading.com/open-ran/jma-gets-44m-to-make-5g-radios-in-new-york); [PR Newswire](https://www.prnewswire.com/news-releases/jmas-5g-xran-shines-in-department-of-defense-debut-301316777.html); [JMA](https://jmawireless.com/jma-wireless-and-sherpa-6-to-deliver-5g-expeditionary-systems-to-the-u-s-army/); [Acrofan](http://us.acrofan.com/detail.php?number=166065&UA=PC); [Wikipedia](https://en.wikipedia.org/wiki/JMA_Wireless)

**Antenna makers**
- [P] Amphenol completed its acquisition of CommScope's **Outdoor Wireless Networks (OWN)** and **DAS** businesses. Both companies' press releases are dated February 3, 2025, while Amphenol's 10-K gives January 31, 2025. The units joined Amphenol's Communications Solutions segment as **"Andrew, an Amphenol Company"**, with about 4,000 employees and about $1.3B in expected 2025 sales. Proceeds were about $2.1B — [BusinessWire (Amphenol)](https://www.businesswire.com/news/home/20250203084459/en/Amphenol-Corporation-Completes-Acquisition-of-OWN-and-DAS-Businesses-From-CommScope); [BusinessWire (CommScope)](https://www.businesswire.com/news/home/20250203737791/en/CommScope-Completes-Divestiture-of-Outdoor-Wireless-Networks-and-Distributed-Antenna-Systems-Businesses-to-Amphenol-Corporation/); [Cabling Installation](https://www.cablinginstall.com/wireless-5g/press-release/55265300/amphenol-completes-acquisition-of-commscopes-das-outdoor-wireless-businesses); [Amphenol 10-K FY2025](https://www.sec.gov/Archives/edgar/data/820313/000110465926013549/aph-20251231x10k.htm)
- [P] The selling CommScope entity has since been renamed **Vistance Networks** — [Amphenol 10-K FY2025](https://www.sec.gov/Archives/edgar/data/820313/000110465926013549/aph-20251231x10k.htm). Andrew's focus is base station antennas, related interconnect products and DAS — [Amphenol 10-Q Q2 2025](https://www.sec.gov/Archives/edgar/data/820313/000155837025009610/aph-20250630x10q.htm)
- [T] Amphenol also bought CommScope's connectivity and cable solutions (CCS) unit, which gives it rights to the CommScope name (October 2025) — [SDxCentral](https://www.sdxcentral.com/news/amphenol-to-assume-commscope-name-in-css-deal/). The Andrew brand had been less prominent inside CommScope for years and was re-presented at MWC 2025 — [RCR Wireless](https://rcrwireless.com/20250321/mwc-25/andrew-mwc25)
- [P] Andrew-branded antenna datasheets are now hosted on andrew.com — e.g., [andrew.com datasheet 1003027](https://www.andrew.com/globalassets/digizuite/1003027-rr-apex4-e.pdf)

### Inferences
- For late-2026 lessons, "AT&T = Ericsson" is a strong default (84%+ of macro sites by H2 2025, about 80% swap target by end-2026). Nokia AirScale/Flexi radios on an AT&T mount should be taught as **legacy, scheduled for removal by early 2027**.
- "Verizon = Samsung or Ericsson, depending on market". Nokia RRHs on Verizon sites are legacy; Samsung replaced at least some of them in Northeast markets in 2021.
- T-Mobile is split by market between Ericsson and Nokia. Both have current multi-year deals, so both brands count as "current" on T-Mobile sites.
- Dish/Boost-built sites (Samsung/Fujitsu radios) should be labeled **legacy (2021–2025), being decommissioned 2025–2026+**. Boost subscribers now ride AT&T's (mostly Ericsson) RAN.
- AT&T will probably light its newly bought 600 MHz (B71/n71) and 3.45 GHz (n77) spectrum. Given its single-vendor strategy, that would most likely be on Ericsson gear, but this is unconfirmed. If it happens, B71/n71 would start appearing on AT&T PLMNs in field-test apps, which would weaken the old "B71 = T-Mobile" rule.
- CommScope-labeled antennas will stay on towers for years, while new shipments carry Andrew/Amphenol branding. This could be a "brand transition" lesson: CommScope label → Andrew label, same product lineage.

### Gaps
- Exact date of the Verizon–Ericsson $8.3B deal, and whether Samsung's Verizon contract (which ran to December 31, 2025) was renewed or replaced: not found.
- Verizon's current vendor split by market or site count (Samsung vs Ericsson): not found.
- NEC's US RAN role (e.g., in the Dish build): not found.
- Who owns **RFS (Radio Frequency Systems)** in 2026, and whether "Amphenol/RFS" is accurate: not found. Searches also turned up nothing on the US roles of Ericsson (Kathrein) antennas, Nokia antennas or Galtronics.
- SpaceX's reported 2025 purchase of EchoStar AWS-4/H-block spectrum was not verified this session (and is largely irrelevant to RAN vendors).
- 2026 figures attributed to AT&T, Fierce and Light Reading come from search summaries because full-text fetches were blocked.

---

## 2. What visual cues identify each vendor's radios and antennas, which model families are common in the US, and which bands/carriers do they serve?

### Takeaway
The most reliable cues are: (a) the unit's form class (large flat massive-MIMO box vs. small finned remote radio vs. long passive panel); (b) model codes that appear in zoning drawings, on equipment labels and in FCC filings; and (c) band and carrier context. Confirmed US families:
- **Ericsson:** AIR 6449 B41 (T-Mobile n41) and AIR 6449 B77D (C-band, AT&T and Verizon); Radio 4449 (B5/B13, B5/B12, B71/B85 variants); Radio 4480 B71+B85; RRUS 8843 B2 B66A; Radio 4478 B71.
- **Nokia:** AEHC 64T64R B41, plus Osprey and Habrok massive MIMO at T-Mobile.
- **Samsung:** MT6407-77A 64T64R C-band, RT4401 CBRS and RF4440d-13A B5/B13 RRH at Verizon.
- **CommScope/Andrew:** SBNHH/NNHH multiband passive panels.

I found no sourced descriptions of colors, fin patterns or logo placement, so FCC ID photo exhibits are the best route to authoritative images.

### Cited Findings

**Ericsson (massive MIMO "AIR" = Antenna Integrated Radio; separate "Radio"/"RRUS" units)**
- [P] **AIR 6449 B77D**: 3700–3980 MHz, 64T64R, 320 W, 192 elements, 200 MHz bandwidth, passive cooling. Net weight is given as about 35.1 kg (77.4 lb) or 38.3 kg (84.4 lb) without mounting kit. AT&T is named as the requesting carrier in a Montgomery County, MD filing — [MC2020061185](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2020061185+Application.pdf); [MC2024082317](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2024082317.pdf); [MC2021071498 "Radio Specs: AIR6488 vs. AIR6449"](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2021071498+Application.pdf). [W] A reseller lists 46.1 kg for the B41 variant plus a 4.4–5.9 kg mount kit, which conflicts with the filing figures — [Accio](https://www.accio.com/business/ericsson-air-6449-spec-sheet)
- [P/W] The AIR 6449 B77D product number is **KRD 901 206/11** — [Sonic Components (reseller)](https://www.soniccomponents.com/product/ericsson-krd-901-206-11-air-6449-b77d-radio-antenna-unit/). FCC IDs **TA8AKRD901206** and **TA8BKRD901206** cover the AIR 6449 B77D NR under Part 27, 3700–3980 MHz — [fccid.io EMF report](https://fccid.io/TA8AKRD901206/RF-Exposure-Info/Exhibit-11-EMF-Test-Report-AIR-6449-B77D-NR-FCC-rev-B-5125769); [fcc.report Part 27 RF report](https://fcc.report/FCC-ID/TA8BKRD901206/5420380.pdf)
- [P] **AIR 6449 B41** for T-Mobile, from Montgomery County, MD filings:
  - Size: "(3) Ericsson AIR 6449 B41 (33.1"x20.6"x8.6")"; band "Frequency 2496 – 2690".
  - Mounting: "INSTALL (2) NEW AIR6449 B41 ANTENNAS ON NEW SUPPORT PIPES" for sectors 2 and 3.
  - Network requirement: "Sites must be on an Anchor POR to use the AIR6449".
  - Site naming: "Site configurations that are designed with AIR6449 B41 will have a '5A' (5 for 2.5GHz + A for AIR6449) after the low-band indicator in the site naming."
  - Sources: [MC2021011358](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2021011358+Application.pdf); [MC2021061469](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2021061469+Application.pdf); [MC2021111611](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2021111611+Application.pdf); [MC2020101317](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2020101317+Application.pdf); [NCPC T-Mobile narrative](https://www.ncpc.gov/files/projects/2021/8309_T-Mobile_Antenna_Installation_Modification_Project_Narrative_Oct2021.pdf)
- [P] FCC ID **TA8AKRD901141** filings include an AIR 6449 B41 LTE EMF report and an AIR 6488 B48 LTE EMF report. device.report lists product and test-setup photos — [fcc.report](https://fcc.report/FCC-ID/TA8AKRD901141/4735120); [fcc.report AIR 6488 B48](https://fcc.report/FCC-ID/TA8AKRD901141/4735121.pdf); [device.report](https://device.report/ericsson-ab/akrd901141)
- [T] The AIR 6468, Ericsson's first 64TR radio, weighed "up to 60kg depending on spec"; the AIR 6449 family is lighter — [The Mobile Network](https://the-mobile-network.com/2021/02/fitter-stronger-lighter/)
- [T/W] **AIR 6419**: 64T64R array, up to 200 MHz bandwidth, passive cooling, 320 W. B41 and B78 variant datasheets exist. A US carrier is not confirmed — [SDxCentral](https://www.sdxcentral.com/articles/news/ericsson-teases-massive-mimo-5g-radios-for-late-2021/2021/02/); [Scribd AIR 6419 B41 datasheet](https://www.scribd.com/document/715805078/34552-AIR-6419-B41-Datasheet-PA4); [Ericsson massive MIMO page](https://www.ericsson.com/en/ran/massive-mimo/solutions)
- [T] **AIR 3268**: about 12 kg (~26 lb), 23 L, 200 W, 32 radio branches and 128 radiating elements. Developed with BT and billed as the "smallest massive MIMO radio in the industry". US deployment is not confirmed — [Telecoms.com](https://www.telecoms.com/5g-6g/the-ericsson-massive-mimo-diet-yields-12kg-radio); [Fierce](https://www.fierce-network.com/tech/ericsson-beefs-up-massive-mimo-line-up-smaller-radio); [Microwave Journal](https://www.microwavejournal.com/keywords/AIR%203268)
- [P/W] **Radio 4449** variants are B5/B13, B5/B12A and B71/B85A. It is dual-band LTE FDD with both bands available on each antenna port — [Ericsson Radio 4449 product overview (CourseHero copy)](https://www.coursehero.com/file/202889635/4449-Radiopdf/). The B5/B12 variant transmits B5 at 869–894 MHz and B12 at 729–746 MHz, both through the same RF connectors — [RRUS 4449 B5/B12 "turf" spec sheet (Scribd)](https://www.scribd.com/document/494070965/RRUS-4449-B5-B12-turf-spec-sheet-102518-rev-C); [StudyLib copy](https://studylib.net/doc/25918645/radio-4449)
- [P/W] A **Radio 4478 B71** capabilities datasheet carries product number KRC 161 699/1 — [Tempest](https://www.tempestns.com/wp-content/uploads/2022/09/Ericsson-KRC1616991-RADIO-4478-B71-Radio-Capabilities-Datasheet.pdf). The same capabilities table also lists Radio 4478 at band 13, but the extraction is garbled.
- [P] **RRUS 8843 B2 B66A** and **Radio 4480 B71+B85** appear on a T-Mobile tower-share notice in Sterling, CT — [CT filing](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/sterling/exeterdr/t-mobile/ts-t-mobile-136-210916_filing_exeterrd.pdf). Both also appear in an AT&T exempt-modification notice in Clinton, CT. That attribution is ambiguous, since B71/B85 are not AT&T bands, and the list may include other tenants' equipment — [CT filing](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/clinton/meadowrd/att_cing/em-att-027-240116_filing_meadow-road-clinton_a.pdf)
- [P] A T-Mobile filing references an "EXISTING T-MOBILE AIR3246 ANTENNA" — [MC2021011358](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2021011358+Application.pdf)
- [W] Third-party listings only: Radio 8863 as "L, NR – 8×40"; Radio 4460 as n78; "Upper 25 MHz of band 66A is for LTE" — [Dorfa Trade](https://dorfatrade.com/product/ericsson-radio/); [Dorfa capabilities](https://dorfatrade.com/product/ericssonradiocapabilities/); [antdata blog](https://antdata.b-cdn.net/posts/ericsson-radio-4460-datasheet/)
- [P] Ericsson publishes downloadable high-resolution product photos — [Ericsson photo library](https://www.ericsson.com/en/newsroom/photo-library/network-products)

**Nokia (AirScale; "MAA" massive MIMO adaptive antennas; Osprey → Habrok)**
- [P] **AEHC** = "AirScale MAA 64T64R 192AE B41 320W". FCC ID **VBNAEHC-01**, Part 27, Band 41 2496–2690 MHz. Nokia's product description lists "AirScale MAA 64T64R 192 AE B41/n41/B38 320 W (AEHC)" — [fccid.io](https://fccid.io/VBNAEHC-01); [fcc.report](https://fcc.report/FCC-ID/VBNAEHC-01/4752433.pdf); [Nokia Massive MIMO Adaptive Antenna Product Description (Dorfa copy)](https://dorfatrade.com/wp-content/uploads/Nokia-Massive-MIMO-Adaptive-Antenna-Product-Description-2024-Single-RAN-BTS-Site-Solutions-Dorfatrade.com_.pdf)
- [W] Nokia Solutions and Networks OY also files under FCC grantee code **2AD8U** (e.g., AWHHF01) — [electric.garden](https://electric.garden/nokia-solutions-and-networks-oy-2ad8u/cellular-network-base-station-awhhf01)
- [P/T] **Habrok** launched at MWC 2023 in 32 TRX and 64 TRX versions. Habrok 64 weighs **24 kg**, about 30% lighter than its predecessors, with about 30% lower power use. It supports 200 MHz occupied and 400 MHz instantaneous bandwidth, initially on n78, with availability from late 2023 — [Nokia](https://www.nokia.com/newsroom/nokia-redefines-massive-mimo-radio-performance-with-the-launch-of-habrok-its-latest-generation-of-airscale-5g-radios-powered-by-reefshark-mwc23/); [Converge Digest](https://convergedigest.com/nokia-launches-its-habrok-massive-mimo-radio/); [TelecomTalk](https://telecomtalk.info/nokia-habrok-massive-mimo-airscale-5g-radios/681031/)
- [T, contested] Osprey 64T and Habrok 64T units at T-Mobile are mostly fan-cooled, per an analyst — [Yahoo Finance](https://finance.yahoo.com/news/nokia-slumps-analyst-predicts-t-190917429.html)
- [C] Forum posters single out Nokia "Flexi" equipment, especially the Flexi 10 remote radio, as distinctive — [HowardForums](https://www.howardforums.com/threads/who-is-the-vendor-of-this-cell-equipment.1859189/); [HowardForums T-Mobile photo thread](https://www.howardforums.com/threads/identify-t-mobile-cell-site-photos.1827623/); [S4GRU "How to Identify T-Mobile network equipment (Nokia Networks)"](https://s4gru.com/forums/topic/6889-how-to-identify-t-mobile-network-equipment-nokia-networks/)

**Samsung (Verizon's main non-Ericsson vendor)**
- [P] **MT6407-77A**:
  - Described as "Massive MIMO Radio MT6407-77A Verizon Wireless for High Capacity and Wide Coverage" (64T64R), and as "(3) SAMSUNG MT6407-77A L-SUB6 ALL-IN-ONE ANTENNA/RRHS".
  - Installed alongside "(3) Samsung RT4401 CBRS" and the "RF4440d-13A 700/850 REMOTE RADIO HEAD UNIT".
  - Sources: [Montgomery County MC2022051756](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2022051756+Application.pdf); [MC2022041731](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2022041731+Application.pdf); [MC2022061813](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2022061813+Application.pdf); [CT Griswold filing](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/griswold/normanrd/verizon/em-ver-058-211018_filing_normanrd.pdf)
- [P] **RF4440d-13A**: a 700/850 MHz (B13/B5) 4T4R dual-band radio with "4Tx/4Rx to 2Tx/2Rx RF chains options", 320 W total output. FCC ID **A3LRF4440D-13A**, grant listed 06/26/2023 — [fccid.io](https://fccid.io/A3LRF4440D-13A); [fcc.report](https://fcc.report/FCC-ID/A3LRF4440D-13A); [device.report](https://device.report/fccid/A3LRF4440D13A)
- [T/P] Samsung's C-band 64T64R radios support digital and dynamic beamforming, SU-MIMO, MU-MIMO, dual connectivity and carrier aggregation — [RCR Wireless](https://www.rcrwireless.com/20210728/5g/verizon-and-samsung-complete-fully-virtualized-5g-data-session-on-c-band-spectrum); [Samsung newsroom](https://news.samsung.com/us/verizon-and-samsung-complete-fully-virtualized-5g-data-session-c-band-spectrum/)
- [P] Other Samsung units tested with Verizon: a 16T16R C-band + CBRS dual-band radio and CAT-B 64T64R C-band radios — [Samsung Networks press release](https://www.samsung.com/global/business/networks/insights/press-release/0213-samsung-verizon-and-keysight-advance-commercial-open-ran-with-extensive-conformance-and-interopera-ility-testing)
- [C] Thread claim: "Verizon C-Band Sites All Equipped with 64T64R Massive MIMO" — [HowardForums](https://www.howardforums.com/threads/verizon-c-band-sites-all-equipped-with-64t64r-massive-mimo.1923291/)
- Searches found no record of "MT6403" or "MT6402"; the deployed Verizon C-band model in filings is MT6407-77A — [Montgomery County MC2022051756](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2022051756+Application.pdf)

**CommScope / Andrew (Amphenol) passive multiband panels**
- [P/W] Model-number chart for multi-band models: band letters **N = 698–896 MHz** and **H = 1710–2180 MHz**. The trailing letter is antenna length: **A = 51.2 in (1.3 m), B = 78.7 in (2.0 m), C = 102.4 in (2.6 m)**. "SB" denotes SmartBeam in the SBNHH sequence — [Argus/CommScope model-number nomenclature chart (Scribd)](https://www.scribd.com/document/318360006/Argus-Model-Number-Guide-TP-102449)
- [W] **SBNHH-1D65C** is an "8 Foot Hexport" tri-band antenna: one 698–896 MHz band and two 1710–2360 MHz bands, internal RET, six 7/16 DIN female connectors — [The Antenna Farm](https://theantennafarm.com/products/18343-commscope-sbnhh-1d65c); [Scribd](https://www.scribd.com/document/463829588/CommScope-8-Foot-Hexport-Antenna-Part-Number-SBNHH-1D65C-021214)
- [W] **NNHH-65C-R4** is an eight-port sector antenna: four 698–896 MHz ports and four 1695–2360 MHz ports, 65° HPBW, four RETs. NNHH-65A-R4-V2 is the same idea in the 1.3 m length — [The Antenna Farm](https://theantennafarm.com/products/15788-commscope-nnhh-65c-r4); [RadioParts](https://www.radioparts.com/commscope-nnhh-65a-r4-v2)

**Community visual cues (general)**
- [C] Ericsson AIR (antenna-integrated radio) sites are recognizable, and "Ericsson's panels are rounded". CellMapper and LTE Discovery vendor labels are guesses (see Q5) — [HowardForums](https://www.howardforums.com/threads/who-is-the-vendor-of-this-cell-equipment.1859189/); [HowardForums T-Mobile photos](https://www.howardforums.com/threads/identify-t-mobile-cell-site-photos.1827623/)

### Inferences
- **Decoding model numbers** (medium confidence unless noted):
  - **Ericsson AIR**: the first two digits track the TX/RX branch count. 64xx = 64T64R (AIR 6449, 6419, 6468, 6488) and 32xx = 32T32R (AIR 3268's 32 branches). Band suffixes use 3GPP band labels: B41 = 2.5 GHz TDD, B77D = 3.7–3.98 GHz C-band, B48 = CBRS, B78 = 3.5 GHz (non-US). For lessons: "AIR 64xx B41 → T-Mobile n41"; "AIR 64xx B77D → Verizon/AT&T C-band".
  - **Ericsson product numbers**: KRD appears on AIR units (KRD 901 206/11; FCC IDs TA8AKRD901206/…901141) and KRC on radios (KRC 161 699/1 = Radio 4478 B71; KRC161962/1 = Radio 4466 per [Dorfa](https://dorfatrade.com/product/ericsson-radio-4466-krc161962/)). This rests on a handful of examples (low-medium confidence).
  - **Ericsson dual-band radios** carry both bands in the name: 4449 B5/B13, 4480 B71+B85, 8843 B2 B66A.
  - **Nokia**: four-letter module codes starting with "A" (AEHC), each with a descriptive string such as "MAA 64T64R 192AE B41 320W" (MAA = Massive MIMO Adaptive Antenna; 192AE = 192 antenna elements). FCC IDs are VBN + module code.
  - **Samsung** (hypothesis, low-medium confidence): the suffix carries the band (-77A → n77; -13A → B13, with B5 as well; RT4401 "CBRS" → B48). The prefix may encode the type (MT = massive MIMO all-in-one; RF = remote radio head; RT = radio unit). FCC IDs are A3L + model.
  - **CommScope**: each band letter is one band group (N = low, H = mid). The letter sequence roughly gives the band-group/port-pair structure, "65" is 65° HPBW, and the final A/B/C is the length.
- **Band-to-carrier ties for radio variants**, inferred from band names in the sources plus US band ownership, so verify against the band/carrier researcher's notes:
  - B5/B13 → Verizon (B13 is Verizon's 700 Upper C).
  - B5/B12 → AT&T.
  - B71/B85 → T-Mobile (600 MHz + lower 700 A).
  - B41/n41 → T-Mobile (confirmed by filings).
  - n77 C-band 3.7–3.98 GHz → Verizon and AT&T (confirmed by filings and trial).
  - B48 CBRS → Verizon (RT4401, confirmed by filings).
- **Size and cooling cues for picture lessons**:
  - 64T64R units weigh about 24–38 kg (Habrok 64: 24 kg; AIR 6449 B77D: ~35–38 kg). The AIR 6449 B41 is about 84 × 52 × 22 cm (33.1 × 20.6 × 8.6 in).
  - The 32T32R AIR 3268 weighs about 12 kg.
  - Ericsson AIR 6449/6419 are passively cooled (fins only). Fans on a T-Mobile massive MIMO box point toward Nokia Osprey/Habrok (contested analyst claim).
- **Image sourcing:** FCC grantee codes **TA8** (Ericsson), **A3L** (Samsung), **VBN / 2AD8U** (Nokia) let the app builder pull "External Photos" exhibits for each model above. Check licensing before reuse.

### Gaps
- I found no sourced, vendor-by-vendor description of colors, heat-sink fin patterns, logo placement, connector layouts or mounting brackets. Searches for spotting guides came back empty, and the last two targeted forum searches were blocked by the search budget. The FCC photo exhibits and the Ericsson photo library are the recommended primary visual sources.
- Not found: band/carrier details for Nokia codes AHFIG, AHLOA and AEQE; reliable band data for Ericsson Radio 4460 and 8863; Samsung mmWave and 3.45 GHz radio models; T-Mobile's n77 radios (e.g., whether AIR 3268 is deployed); AT&T's 3.45 GHz radios; and the AIR 3246 band.
- JMA, Galtronics, Ericsson/Kathrein and RFS antenna model families: not found.

---

## 3. How do passive panel antennas, RRUs/RRHs, and active antenna units (AAU / massive MIMO 32T32R/64T64R) differ visually and functionally? How do 2T2R, 4T4R and 8T8R show up physically?

### Takeaway
- **Passive panels**: tall, plain radomes with no electronics. You see a row of coax connectors at the bottom (6 on a hexport, 8 on an NNHH) and RET actuators. They come in standard lengths of 1.3, 2.0 and 2.6 m.
- **RRUs/RRHs**: separate finned boxes mounted behind or near the panels and jumpered to the antenna ports. The number of ports and jumpers per band reflects 2T2R or 4T4R.
- **Active antenna units (Ericsson "AIR", Nokia "MAA", Samsung "all-in-one antenna/RRH")**: the radio and an array of 128–192 elements in one box. They are wider and heavier than an RRH, have no RF jumpers to a separate antenna, and serve TDD mid-band (n41, n77, CBRS) with 32T32R or 64T64R.

### Cited Findings
- [W] Passive multiband panels expose all RF ports. SBNHH-1D65C is a hexport with six 7/16 DIN female connectors and internal RET. NNHH-65C-R4 has 8 ports (4 low-band, 4 mid-band) and four RETs. Lengths are 1.3, 2.0 or 2.6 m (A/B/C) — [The Antenna Farm SBNHH](https://theantennafarm.com/products/18343-commscope-sbnhh-1d65c); [The Antenna Farm NNHH](https://theantennafarm.com/products/15788-commscope-nnhh-65c-r4); [Argus/CommScope chart](https://www.scribd.com/document/318360006/Argus-Model-Number-Guide-TP-102449)
- [P] RRHs are separate radios cabled to antenna ports. Samsung RF4440d-13A is a 700/850 MHz 4T4R dual-band RRH that can run "4Tx/4Rx to 2Tx/2Rx" — [device.report](https://device.report/fccid/A3LRF4440D13A); [fccid.io](https://fccid.io/A3LRF4440D-13A). Ericsson Radio 4449 is dual-band with both bands on each antenna port — [Ericsson overview (CourseHero copy)](https://www.coursehero.com/file/202889635/4449-Radiopdf/), and both bands share the same RF connectors — [Scribd spec sheet](https://www.scribd.com/document/494070965/RRUS-4449-B5-B12-turf-spec-sheet-102518-rev-C)
- [P] Dual-band RRHs cut the box count: Verizon replaced nine Nokia RRHs with three Samsung B5/B13 RF4440d-13A units on one tower — [CT Griswold filing](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/griswold/normanrd/verizon/em-ver-058-211018_filing_normanrd.pdf)
- [P] Examples of active antennas that integrate the radio:
  - Ericsson **AIR 6449 B77D**: 64T64R with 192 elements and passive cooling — [Montgomery County filings](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2024082317.pdf).
  - Nokia **AEHC**: "MAA 64T64R 192AE" — [fccid.io](https://fccid.io/VBNAEHC-01).
  - Samsung **MT6407-77A**: "ALL-IN-ONE ANTENNA/RRH" — [CT filing](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/griswold/normanrd/verizon/em-ver-058-211018_filing_normanrd.pdf).
  - Ericsson **AIR 3268**: 32 branches and 128 elements — [Telecoms.com](https://www.telecoms.com/5g-6g/the-ericsson-massive-mimo-diet-yields-12kg-radio).
  - Community: Ericsson "AIR" stands for antenna-integrated radio — [HowardForums](https://www.howardforums.com/threads/who-is-the-vendor-of-this-cell-equipment.1859189/)
- [T] Massive MIMO weights have dropped by generation: AIR 6468 up to 60 kg → AIR 6449 lighter → Habrok 64 at 24 kg → AIR 3268 (32T) at 12 kg — [The Mobile Network](https://the-mobile-network.com/2021/02/fitter-stronger-lighter/); [Nokia](https://www.nokia.com/newsroom/nokia-redefines-massive-mimo-radio-performance-with-the-launch-of-habrok-its-latest-generation-of-airscale-5g-radios-powered-by-reefshark-mwc23/); [Telecoms.com](https://www.telecoms.com/5g-6g/the-ericsson-massive-mimo-diet-yields-12kg-radio)
- [P] Intermediate configurations exist: Samsung's 16T16R C-band + CBRS dual-band radio — [Samsung Networks](https://www.samsung.com/global/business/networks/insights/press-release/0213-samsung-verizon-and-keysight-advance-commercial-open-ran-with-extensive-conformance-and-interopera-ility-testing)
- [P] Filings number sectors. One T-Mobile job installs AIR 6449 B41 units "ON NEW SUPPORT PIPES" for sectors 2 and 3, so massive MIMO units often sit on their own pipe mounts beside the passive panels — [Montgomery County filings](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2021061469+Application.pdf)

### Inferences
- **Counting ports is the physical tell for nTnR**:
  - A radio's antenna-port count equals its branch count, so a 4T4R band needs four antenna ports and four jumpers.
  - An 8-port NNHH panel (4 low + 4 mid) suits **4T4R low-band + 4T4R mid-band** behind a single panel.
  - A hexport (SBNHH: 1 low band + 2 mid bands) typically means 2T2R low-band with 2T2R per mid-band, or a 4T4R mid-band using both mid arrays.
  - These follow from the cited port counts and the shared-connector design of dual-band radios.
- **No jumpers usually means an active antenna**: massive MIMO boxes contain their own array, so expect only power and fiber feeding them, with no coax jumpers to a separate panel.
- **Elements per branch**: 64T64R units list 192 elements (3 per branch), while the AIR 3268 has 128 elements over 32 branches (4 per branch). This suggests a quiz: "same width class, half the branches".
- **Lesson quick-sort**:
  - Tall and skinny with a row of connectors at the bottom → passive panel.
  - Small finned box with jumpers to the panel → RRU/RRH.
  - Large, deep, near-square box on its own pipe with no jumpers → AAU/massive MIMO.
  - Fans visible on a massive MIMO unit → possibly Nokia at T-Mobile.

### Gaps
- I didn't verify an 8T8R example, such as the legacy Sprint/T-Mobile B41 8T8R RRHs or the band of Ericsson Radio 8863. The physical look of 8T8R (an 8-port beamforming panel plus calibration port) is unsourced here.
- Fiber/power hardware (hybrid trunks, OVP "squid" boxes, CPRI vs eCPRI) was not researched; it may fall to the site-types researcher.

---

## 4. What logical/network cell types and concepts does a learner need (macro/micro/pico/femto; sectors; NSA vs SA; CA, EN-DC, NR-CA; DSS)?

### Takeaway
3GPP defines base-station classes by output power and deployment:
- **Wide Area** (macro): no power cap.
- **Medium Range** (micro): ≤38 dBm.
- **Local Area** (pico): ≤24 dBm.
- **Home** (femto): ≤20 dBm, and LTE only, since NR drops the Home class.

Sectors are numbered per carrier and band layer (see Q5 for numbering). In the US, T-Mobile launched nationwide 5G SA in 2020 and never used DSS. AT&T and Verizon used DSS in 2020 to reach "nationwide 5G" quickly, and DSS has since been quietly phased out as dedicated 5G spectrum arrived. Carrier aggregation and dual connectivity shape how one physical site shows up as several logical cells (and sometimes several eNBs).

### Cited Findings
- [P/T] 3GPP base-station classes:
  - The classes cover above-rooftop (Wide Area), below-rooftop (Medium Range), hotspot/pico (Local Area) and in-home (Home) deployments.
  - Power caps: 38 dBm for Medium Range, 24 dBm for Local Area, 20 dBm for Home; "no maximum base station power defined for Wide Area".
  - Minimum coupling loss: 70 dB (Wide Area), 53 dB (Medium Range), 45 dB (Local Area).
  - NR defines three classes, without Home, with the same 38 and 24 dBm limits.
  - Sources: [Techplayon LTE BS classes](https://www.techplayon.com/base-station-classifications/); [Techplayon NR BS classes](https://www.techplayon.com/5g-nr-base-station-classes/); [ScienceDirect overview](https://www.sciencedirect.com/topics/engineering/base-station-class)
- [P] Sources differ on whether the power cap applies per antenna or summed across antennas for Home BS — [Techplayon](https://www.techplayon.com/base-station-classifications/); [Telcoma](https://www.telcomaglobal.com/p/5g-nr-base-station-types)
- [P] Sectors in practice: carrier filings refer to sectors by number, e.g., AIR 6449 B41 installed for "sectors 2 and 3" — [Montgomery County filing](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2021061469+Application.pdf). [C] "In many cases there are two (or three) groups of three sector antennas for LTE" — [MIT cellular numerology page](https://people.csail.mit.edu/bkph/cellular_repeater_numerology)
- [P] T-Mobile's AIR 6449 B41 sites "must be on an Anchor POR", meaning the n41 massive MIMO depends on an LTE anchor configuration — [Montgomery County filing](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2021011358+Application.pdf)
- [T] T-Mobile launched nationwide 5G standalone (SA) in 2020, and AT&T and Verizon later launched their own nationwide SA networks. This statement came from a search summary drawing on these two articles; the exact attribution is unconfirmed — [Light Reading, "The quiet sunset of 5G dynamic spectrum sharing"](https://www.lightreading.com/5g/the-quiet-sunset-of-5g-dynamic-spectrum-sharing); [Fierce, "AT&T makes it official: 5G SA is nationwide"](https://www.fierce-network.com/wireless/att-makes-it-official-5g-sa-nationwide) (date not captured)
- [T] **DSS history**:
  - AT&T activated the first US DSS in parts of North Texas in early June 2020 and announced nationwide 5G covering 205 million people in late July 2020 — [SDxCentral](https://www.sdxcentral.com/articles/news/att-trumpets-first-us-activation-of-dynamic-spectrum-sharing/2020/06/); [Fierce](https://www.fierce-network.com/operators/at-t-turns-dynamic-spectrum-sharing-parts-north-texas).
  - Verizon deployed DSS in 2,700 cities for "5G Nationwide", using its 850 MHz spectrum on demand for 5G — [Fierce](https://www.fierce-network.com/operators/verizon-relies-dynamic-spectrum-sharing-more-widely-than-at-t-report).
  - "T-Mobile never used DSS", relying on 600 MHz instead. All three carriers now have enough dedicated 5G spectrum that they "no longer need to use DSS" — [Light Reading](https://www.lightreading.com/5g/the-quiet-sunset-of-5g-dynamic-spectrum-sharing).
  - US operators held conflicting views on DSS — [ABI Research](https://www.abiresearch.com/market-research/insight/7778363-us-operators-have-conflicting-views-on-dyn?hsLang=en).
- [T] A third-party report cited by Fierce found "very little performance difference" between Verizon 5G over DSS and a similar LTE channel — [Fierce](https://www.fierce-network.com/operators/verizon-relies-dynamic-spectrum-sharing-more-widely-than-at-t-report)
- [T] Carrier aggregation in practice: Verizon aggregated C-band with mmWave spectrum — [Mobile World Live](https://www.mobileworldlive.com/top-three/verizon-aggregates-c-band-mmwave-spectrum/). Samsung C-band radios support "dual connectivity and carrier aggregation" — [RCR Wireless](https://www.rcrwireless.com/20210728/5g/verizon-and-samsung-complete-fully-virtualized-5g-data-session-on-c-band-spectrum)
- [C] CA affects logical structure. On Verizon, "Sites with CA across all bands use a single eNB. Sites where midband is not allowed to aggregate with lowband have midband assigned to 300,000 (or sometimes 600,000) + the lowband eNB" — [S4GRU (Trip's posts)](https://s4gru.com/profile/41193-trip/content/page/30/?type=forums_topic_post); [S4GRU SignalCheck thread](https://s4gru.com/forums/topic/3060-signalcheck-android-app-to-monitor-your-wi-fi2g3g4g-lte5g-nr-signal-strengths/page/196/)

### Inferences
- In plain units, the power caps are about 6.3 W (38 dBm, micro), 0.25 W (24 dBm, pico) and 0.1 W (20 dBm, femto). A good lesson: macro has "no cap", and real macro radios run hundreds of watts (e.g., 320 W for the AIR 6449 or the RF4440d-13A).
- DSS should be taught as **historical (2020 to early 2020s)**, with T-Mobile as the counterexample.
- One physical site maps to many logical cells: (number of sectors) × (number of carriers/layers per sector). Some carriers also split one site across two eNB IDs, as in Verizon's +300,000 rule. Both points belong in the "site vs cell vs eNB" lesson.
- "Anchor" language in T-Mobile filings shows NSA's dependency on LTE: in NSA, 5G cells need an LTE anchor cell. This motivates a lesson on why a phone shows "LTE + 5G" in NSA.

### Gaps
- Searches did not return sources for these standard definitions; verify before teaching:
  - **EN-DC** (E-UTRA–NR Dual Connectivity): the LTE eNB is the master node, the NR gNB is the secondary node, and the core is EPC (NSA "Option 3/3x").
  - **SA "Option 2"**: NR gNB with 5GC.
  - **NR-CA**: aggregation of NR carriers, e.g., n41+n41 or n71+n41 on T-Mobile, or n77+n77.
  - **DSS mechanics**: NR rate-matches around LTE CRS on a shared carrier.
- Alpha/beta/gamma naming and azimuth conventions (alpha usually the first sector clockwise from north): not sourced.
- Verizon's SA rollout status in 2026, and the date of AT&T's nationwide-SA announcement: not captured.
- How small cells and DAS appear in identifiers (e.g., separate eNB ranges or single-sector cells): not found.

---

## 5. How do LTE and NR identifiers work (eNB ID, cell ID, ECI/ECGI, TAC, PCI, EARFCN, gNB ID, NCI/NCGI, NR-ARFCN, GSCN, SSB), what are their ranges, how do US carriers structure them, and what can a hobbyist infer?

### Takeaway
- **LTE**: ECI is 28 bits, made of a 20-bit eNB ID and an 8-bit cell (sector) ID, so ECI = eNB × 256 + sector. ECGI adds the PLMN (MCC+MNC). PCI is 0–503 (168 groups × 3).
- **NR**: NCI is 36 bits, split into a gNB ID of operator-chosen length (22–32 bits) and a 4–14-bit cell ID. NCGI = PLMN + NCI. This is why apps need a per-carrier "gNB ID length" setting.
- **Channel numbers**: EARFCN and NR-ARFCN map deterministically to frequency and band through 3GPP tables (TS 36.101 and TS 38.104). GSCN is a separate synchronization raster marking where SSBs can sit.

US conventions are community-documented. Verizon uses decimal sector IDs where the tens digit is the physical sector and the ones digit is the band layer, with mid-band sometimes on a separate eNB (+300,000). T-Mobile groups sector IDs by band range (B66 1–10, B2 11–20, B71 61–70). Vendor can only be guessed from ID patterns or Layer-3 fingerprints.

### Cited Findings

**LTE identifiers**
- [P] Macro eNB cell identity: "the first 20 bits of the cell ID are to correspond to the eNB ID and the lower 8 bits are to identify the cell" — [US Patent 8346280](https://patents.google.com/patent/US8346280). [C] "ECI = eNB × 256 + sector"; CellMapper's "short eNB ID" is the full cell ID divided by 256, with the sector as the remainder — [HowardForums "LTE sectors"](https://www.howardforums.com/threads/lte-sectors.1870828/)
- [P/C] "In LTE, PCI (Physical Cell Identity) is a 9-bit number between 0 and 168 * 3 = 504", and LTE unique IDs are "MCC:MNC TAC:CI" — [MIT cellular numerology](https://people.csail.mit.edu/bkph/cellular_repeater_numerology). The Cellfire app defines PCI as 0–503 and TAC as Tracking Area Code — [Cellfire (GitHub)](https://github.com/veteranop/Cellfire_app_public)
- [P] A CGI is MCC + MNC + LAC/TAC + CI — [Wikipedia "Cell Global Identity"](https://en.wikipedia.org/wiki/Cell_Global_Identity); [ShareTechnote CGI](https://www.sharetechnote.com/html/Handbook_LTE_CGI.html)
- [P] **EARFCN** downlink ranges (TS 36.101 Table 5.7.3-1):
  - **B12** 5010–5179 (DL start given as 728 or 729 MHz depending on source).
  - **B13** 5180–5279 (700 Upper C).
  - **B66** 66436–67335 (DL 2110–2200, UL 1710–1780).
  - **B71** 68586–68935 (DL 617–652, UL 663–698).
  - Sources disagree on B71's uplink EARFCN range (132972–133121 vs 133122–133471) and on the overall EARFCN maximum (0–65535 vs about 262143).
  - Sources: [Halberd Bastion](https://halberdbastion.com/technology/cellular/4g-lte/4g-lte-frequency-bands); [Electronics Notes](https://www.electronics-notes.com/articles/connectivity/4g-lte-long-term-evolution/lte-earfcn-radio-channel-numbers.php); [CableFree](https://www.cablefree.net/wirelesstechnology/4glte/lte-carrier-frequency-earfcn/); [Wikipedia LTE frequency bands](https://en.wikipedia.org/wiki/LTE_frequency_bands); [5G6G Academy converter](https://www.5g6gacademy.com/tools/lte-earfcn-converter); [celltowers.ca](https://celltowers.ca/3gpp.html)

**NR identifiers**
- [P] NCGI = PLMN + 36-bit NR Cell Identity. The gNB ID is configurable from 22 to 32 bits, leaving 14 down to 4 bits for the cell ID. The gNB ID is the leftmost bits of the NCI. 22 bits is treated as a common default. Sources say the NCI is broadcast in SIB1, and cite TS 38.413 for NCI coding and TS 38.300 for architecture — [Techplayon](https://www.techplayon.com/5g-nr-cell-global-identity-planning/); [5G-Tools NCI calculator](https://5g-tools.com/5g-nr-cell-identity-nci-calculator/); [HiCellTek](https://hicelltek.com/en/nr-cell-identity-calculator/); [arXiv 2506.12461](https://arxiv.org/html/2506.12461v1)
- [P] Vendors expose the gNB ID length as a parameter (e.g., Huawei `gNodeBFunction.gNBIdLength`, range 22–32 bits) — [telecomHall forum](https://www.telecomhall.net/t/what-is-the-formula-for-cell-id-nci-in-5g-nr-networks/12623)
- [C] Operators choose different splits. UK examples: O2 UK uses 22/14 bits, Vodafone UK and EE use 24/12. One tool allows 20–32 bits, which conflicts with the 22–32 spec range — [cellinfo.co.uk 5G Lab](https://cellinfo.co.uk/5g-lab-5g-nr-cell-id-format-tool/); [Mast Database NCI tool](https://mastdatabase.co.uk/tools/nr-nci-to-gnb-sector-id/); [gNB ID calculator](https://nrcalculator.firebaseapp.com/nrgnbidcalc.html)
- [P] **NR-ARFCN** uses the global frequency raster: F_REF = F_REF-Offs + ΔF_Global × (N_REF − N_REF-Offs) (TS 38.104 §5.4.2.1, Table 5.4.2.1-1). The raster step is 5, 15 or 60 kHz depending on frequency range — [3GLTEInfo](https://www.3glteinfo.com/5g/protocols/phy/nr-arfcn/); [nrarfcn (PyPI)](https://pypi.org/project/nrarfcn/2.0.0/); [GitHub nrarfcn](https://github.com/blevic/nrarfcn)
- [P] **GSCN** is a separate synchronization raster that identifies allowed **SSB** positions, with formulas in TS 38.104 §5.4.3 (Table 5.4.3.1-1) and band-specific SS raster lists in §5.4.3.3. Table numbering shifts between releases — [Sqimway GSCN calculator](https://www.sqimway.com/nr_raster.php); [5G-Tools GSCN](https://5g-tools.com/5g-nr-gscn-calculator/); [HiCellTek GSCN](https://hicelltek.com/en/gscn-calculator/); [ShareTechnote](https://www.sharetechnote.com/html/5G/5G_FR_Bandwidth.html); [LinkedIn explainer](https://www.linkedin.com/pulse/gscn-fromnr-arfcn-chanchal-juyal-r2zbe)

**US carrier conventions (community-documented)**
- [C] **Verizon** (S4GRU):
  - "Verizon, in my experience, is very consistent, but their sector IDs are decimal."
  - "1/2/3 is 700; 12/22/32 AWS; 13/23/33 AWS (second carrier); 14/24/34 PCS."
  - "Sites with CA across all bands use a single eNB. Sites where midband is not allowed to aggregate with lowband have midband assigned to 300,000 (or sometimes 600,000) + the lowband eNB."
  - Sources: [S4GRU (Trip's content)](https://s4gru.com/profile/41193-trip/content/page/30/?type=forums_topic_post); [S4GRU SignalCheck thread p.196](https://s4gru.com/forums/topic/3060-signalcheck-android-app-to-monitor-your-wi-fi2g3g4g-lte5g-nr-signal-strengths/page/196/)
- [C] **Verizon** (HowardForums, from LTE Discovery's GCI display): "B13 is (01,02,03), B4 is (16,20,0C), and B2 is (18,22,0E)" — [HowardForums Verizon B2 PCS thread](https://www.howardforums.com/showthread.php/1850023-Verizon-s-Band-2-PCS-LTE-Deployment/page5); [page 33](https://www.howardforums.com/showthread.php/1850023-Verizon-s-Band-2-PCS-LTE-Deployment/page33)
- [C] **T-Mobile**: "most sites follow the general TMO rules (b66: 1-10, b2: 11-20, b71: 61-70, etc.)". There are exceptions, such as a site where "all bands besides b71 are basically crammed into the first 12 sector IDs" — [S4GRU](https://s4gru.com/forums/topic/6889-how-to-identify-t-mobile-network-equipment-nokia-networks/)
- [C, low; dated ~2014–2016] **AT&T**: "Cell IDs for LTE on AT&T are six digits, with the first two digits being a region code and the last four being the cell site, with the sector identified separately". Example sector ranges: 1–3 = B5 (850), 15–17 = B17 (700), 8–10 = B2 (1900) — [HowardForums "LTE sectors"](https://www.howardforums.com/threads/lte-sectors.1870828/)
- [C] **Vendor inference from IDs is a guess.** CellMapper and LTE Discovery "just make a best guess based off of the GCI pattern". For example, one pattern could be "a 4th sector of a Nokia site (Nokia market) or L700 alpha sector (Ericsson)" — [HowardForums](https://www.howardforums.com/threads/who-is-the-vendor-of-this-cell-equipment.1859189/)
- [C] **Layer-3 vendor fingerprints**: the SIB3 antenna-port flag is "False ... on Huawei and Ericsson with True for Nokia, Samsung and ZTE". Neighbor-cell config and preamble target power also vary by vendor. Using these requires decoded signalling logs, not CellMapper data — [pedroc.co.uk](https://pedroc.co.uk/content/lte-vendor-recognition-layer-3-signalling). These are vendor default settings with no 3GPP basis, and two vendors can share a value, so no single value is conclusive — [telecomHall](https://www.telecomhall.net/t/identify-lte-radio-vendor-via-messages/9494)
- [T] Ookla's site-to-vendor attribution method for its AT&T analysis is not described in the coverage — [Light Reading](https://www.lightreading.com/5g/att-phaseout-of-old-nokia-ran-boosted-performance-says-ookla)
- [C] CellMapper's "Estimated Band" page infers bands per carrier but is about 9 years old (lists Verizon B2/B4/B13; T-Mobile B2/B4/B12) — [CellMapper Estimated Band](https://www.cellmapper.net/Estimated_Band)

### Inferences
- **The two Verizon forum readings agree once hex is converted.** 0x0C/0x16/0x20 = 12/22/32 (AWS) and 0x0E/0x18/0x22 = 14/24/34 (PCS), matching the S4GRU decimal scheme. Two independent community sources agreeing raises confidence to **medium**. The rule: **tens digit = physical sector (1–3); ones digit = layer (2 = AWS, 3 = AWS 2nd carrier, 4 = PCS); low-band 700 = 1/2/3.** Verizon's B5 (850) numbering is not covered.
- **The "0–65535 EARFCN" claim is outdated.** B66 and B71 EARFCNs (66436+, 68586+) exceed 65535, so the extended (≈0–262143) range applies.
- **Worked decoding examples for lessons** (my arithmetic, using the cited formulas):
  - LTE: eNB 102006, sector 2 → ECI = 102006 × 256 + 2 = **26,113,538** (hex 0x18E7602). Decoding: floor(26,113,538 / 256) = 102006; remainder 2.
  - Verizon AWS on physical sector 2 → cell ID 22 → ECI = eNB × 256 + 22. If that eNB is low-band eNB + 300,000, both eNBs are the same physical site.
  - NR: NCI = 417,816,578 (hex 0x018E76002). With a **24-bit** gNB ID: gNB = floor(NCI / 4096) = **102006**, cell = 2. With a **22-bit** gNB ID: gNB = floor(NCI / 16384) = **25501**, cell = **8194**. The same NCI decodes to two different sites depending on the assumed bit length. This makes a good "why the setting matters" exercise.
  - EARFCN → frequency: F_DL = F_DL_low + 0.1 × (N_DL − N_Offs-DL). B66 EARFCN 66786 → 2110 + 0.1 × 350 = **2145.0 MHz**.
- **What a hobbyist can infer**:
  - Band, from EARFCN or NR-ARFCN: deterministic and high confidence.
  - Band layer and physical sector, from carrier-specific sector-ID patterns: medium confidence.
  - Same physical site, from shared eNB IDs or Verizon's +300,000 rule: medium confidence.
  - Vendor: low confidence from IDs alone. Priors help: AT&T is about 84%+ Ericsson; the Verizon C-band vendor is Samsung or Ericsson by market; T-Mobile is market-split. Better evidence comes from L3 fingerprints or a photo of the site.
- PCI alone shows neither band nor site, because PCIs are reused (504 values in LTE).

### Gaps
- **US carriers' gNB ID bit lengths** (AT&T, Verizon, T-Mobile): not found, and the final targeted search was blocked by the budget. Recommendation: make the bit length a configurable lesson parameter and show multiple decodings. Whether T-Mobile or Verizon gNB IDs mirror LTE eNB IDs is also unverified.
- Modern AT&T sector conventions (B14 FirstNet, B30, B29, B66, n77) and T-Mobile NR sector conventions (n71, n41, n25): not found.
- Standard values I couldn't source this session (verify against 3GPP before use):
  - NR PCI 0–1007 (336 SSS groups × 3 PSS; TS 38.211).
  - LTE PCI = 3·N_ID(1) + N_ID(2) (TS 36.211).
  - TAC: 16-bit in LTE, 24-bit in NR/5GS.
  - Home eNB ID: 28 bits.
  - EARFCN DL ranges: B2 600–1199, B4 1950–2399, B5 2400–2649, B14 5280–5379, B17 5730–5849, B25 8040–8689, B30 9770–9869, B41 39650–41589, B48 55240–56739.
  - NR-ARFCN: 0–3279165, with raster offsets 0 MHz/N=0 (5 kHz), 3000 MHz/600000 (15 kHz), 24250.08 MHz/2016667 (60 kHz).
  - GSCN formulas.
  - SSB: 4 OFDM symbols × 240 subcarriers; L_max = 4/8/64 beams.

---

## 6. How do these identifiers appear in common tools (CellMapper, Network Cell Info, Android engineering modes, iPhone Field Test) so lessons can mimic real screens?

### Takeaway
- **iPhone Field Test** (dial \*3001#12345#\*): opens to a Dashboard. Menus vary by iOS version, model, modem and carrier. The 5G section is labeled "5G NR" or "NrServingCellInfo" and shows the NR cell identity as NCI or cell_id. SINR is often missing on 5G.
- **Android**: \*#\*#4636#\*#\* ("Phone information") shows the EARFCN next to the serving cell. Samsung's \*#0011# ServiceMode shows LTE band, CA info and PCI, but older versions show no LTE cell ID.
- **CellMapper**: stores LAC/TAC and the full cell ID. It offers an eNB/cell-ID calculator and a timing-advance multiplier setting.

Exact field labels for Network Cell Info Lite and current iOS were not verified; mock screens should be built from real device screenshots.

### Cited Findings
- [W/T] **iPhone Field Test**:
  - Dial \*3001#12345#\* in the Phone app, often with Wi-Fi off. On iOS 18 a Dashboard opens with carrier info and signal metrics.
  - "Menus vary by iOS release, iPhone model, modem, carrier, SIM or eSIM, and current connection."
  - The 5G section is labeled "5G NR" or "NrServingCellInfo", and the 5G cell identifier appears as NCI or cell_id.
  - On 5G, SINR "may not appear at all"; RSRP and RSRQ are recommended instead.
  - LTE-era guides list a Physical Cell ID under serving cell info.
  - Sources: [iTechGuides](https://www.itechguides.com/how-to-access-your-iphones-field-test-mode-and-see-your-real-signal-strength/); [FindCellID](https://findcellid.com/blog/iphone-field-test-mode); [UberSignal (2026 version)](https://www.ubersignal.com/blogs/articles/field-test-mode); [Wilson](https://www.wilsonconnectivity.com/blog/how-to-access-field-test-mode-on-your-iphone); [XDA](https://www.xda-developers.com/how-access-field-test-mode-ios/); [Grokipedia (weak)](https://grokipedia.com/page/field_test_mode)
- [W/C] **Android**:
  - "\*#0011# (Samsung Service Mode), \*#\*#4636#\*#\* (generic engineering mode)". Dialing 4636 "displays the current EARFCN next to the serving cell under 'Phone Information'" — [HiCellTek EARFCN guide](https://hicelltek.com/en/what-is-earfcn/).
  - \*#0011# opens the LTE and CA side of ServiceMode — [XDA ServiceMode guide](https://xdaforums.com/t/quick-guide-how-to-enable-and-use-servicemode.3109579/page-7); [XDA engineer-mode thread](https://xdaforums.com/t/engineer-mode-code-for-samsung-android.4614917/).
  - In older Samsung ServiceMode, "no CID is provided in LTE, and only PCI is shown"; use 4636 to get the LTE cell ID — [Samsung Service Mode blog (2013)](http://samsungservicemode.blogspot.com/2013/02/samsung-service-mode.html).
  - Codes are blocked or vary on some devices (e.g., S8+) — [XDA](https://xdaforums.com/t/s8-service-mode-access.3599322/).
  - Hobbyists used ServiceMode for band and PCI locking — [ISPreview band/cell locking guide](https://www.ispreview.co.uk/talk/threads/band-and-cell-locking-guide.42174/).
  - Per-phone engineering-screen catalog — [LPC Wiki](https://lpcwiki.miraheze.org/wiki/Viewing_cellular_information_on_phones)
- [P] **CellMapper**:
  - Crowd-sourced map of towers, sector coverage and bands — [Google Play](https://play.google.com/store/apps/details?id=cellmapper.net.cellmapper&hl=en_US).
  - Cell ID calculator (eNB ID, RNC-ID, BSIC, hex) — [CellMapper Cell ID Calculator](https://www.cellmapper.net/enbid).
  - CSV export defines "LAC: Location Area Code / Tracking Area Code (TAC)" and CID as the full cell ID (CI, not CGI, for LTE) — [CellMapper CSV](https://www.cellmapper.net/CellMapper_CSV).
  - Android setting "LTE Timing Advance" multiplier defaults to 78; ~150 "appears" correct on Android 10/11 (page is about 3.7 years old) — [CellMapper Android App Settings](https://www.cellmapper.net/Android_App_Settings).
  - Tested-phones list — [CellMapper Tested Phones](https://www.cellmapper.net/Tested_Phones)
- [C] CellMapper's user-reported PCI and EARFCN data can be out of date — [ISPreview](https://www.ispreview.co.uk/talk/threads/band-and-cell-locking-guide.42174/)
- [W] Other apps' field sets:
  - Cellfire lists PCI (0–503), TAC, EARFCN ("the exact frequency channel within a band") and BW. It claims CellMapper lacks timing advance, which conflicts with CellMapper's own TA setting — [Cellfire (GitHub)](https://github.com/veteranop/Cellfire_app_public).
  - CellTracker shows EARFCN and TimingAdvance for LTE — [MIT CellTracker](https://people.csail.mit.edu/bkph/CellTracker); [MIT TA notes](https://people.csail.mit.edu/bkph/cellular_repeater_TA)
- [P] CellMapper is listed among public cell-ID databases — [Wikipedia "GSM Cell ID"](https://en.wikipedia.org/wiki/GSM_Cell_ID)

### Inferences
- **Suggested mock-screen field sets** (labels approximate until checked on real devices):
  - CellMapper-style LTE card: Provider (MCC-MNC), eNB, Sector/Cell ID, full CID, PCI, TAC, EARFCN → Band, bandwidth, RSRP/RSRQ/SNR, TA.
  - CellMapper-style NR card: gNB (dependent on bit length), cell, NCI, PCI, TAC, NR-ARFCN → band, SS-RSRP.
  - iPhone NR screen: "NrServingCellInfo" with nci/cell_id, band and ARFCN when available, RSRP/RSRQ, often no SINR.
  - Android 4636: serving cell with EARFCN.
  - Samsung \*#0011#: band, CA combo, PCI, no LTE CID on older builds.
- CellMapper's default TA multiplier of 78 matches the roughly 78 m-per-step LTE timing-advance granularity. The alternative 150 suggests some Android builds report TA in different units. This could support a "distance from tower" mini-lesson with a caveat.
- Lessons can link tools to identifiers: "find the eNB" (CID ÷ 256), "find the band" (EARFCN lookup), and "find the site's other eNB" (Verizon +300,000).

### Gaps
- Network Cell Info Lite's screen labels: not verified by any search result.
- Exact current iOS Field Test labels for LTE and NR serving cells (iOS 18 and later): not verified; device screenshots needed.
- Pixel engineering screens, SignalCheck Pro fields and CellMapper's NR gNB-length handling: not researched or found, and the budget was exhausted.
