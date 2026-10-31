# US Cell Site Types and Carrier Identification ("Tower Spotting"): Visual-ID Reference for Image-Based Lessons (as of 2026-10-31)

> **Evidence legend used on findings:** **[A]** authoritative or primary (FCC/FAA rules, SEC filings, carrier or vendor primary releases, municipal or state permit filings that name the carrier and equipment). **[B]** trade press, or vendor/industry secondary material. **[C]** community, consultant, forum, or consumer-blog heuristic. **Conf: High/Med/Low** is my confidence that a *visual tell* is usable for identification.
>
> **Method caveat (important for the report writer):** WebFetch failed with DNS errors for every host tried (wirelessestimator.com, montgomerycountymd.gov, docs.cellmapper.net, scribd.com). Direct curl was blocked by proxy policy (403). So **every finding below comes from search-engine result summaries, not full-page reads.** The shared WebSearch budget (200 per turn) was then used up. Treat specific numbers as "reported by the cited page, per search summary", and spot-check them before publishing lessons. For a deeper pass, those hosts must be allowed in the session's network settings.

---

## 1. What is the taxonomy of US cell site types, and what visual features distinguish each (heights, settings, tower owners, signage)?

### Takeaway
US sites fall into six visual families:
- **Macro towers:** self-supporting lattice, guyed mast, monopole.
- **Structure-mounted sites:** rooftop, façade, water tank or water-tower look-alike.
- **Stealth/concealed sites:** trees, flagpoles, steeples and crosses, bell or clock towers, silos.
- **Small cells:** shrouded pole-top or side-mount on street and utility poles, strand-mount, and multi-tenant "smart poles" such as NYC's ~32 ft Link5G.
- **DAS:** outdoor, in-building and stadium systems, usually neutral-host.
- **Temporary sites:** COW, COLT, and SatCOLT/SatCOW.

The most useful *authoritative* height anchor is **200 ft above ground**. Above it, a structure must be registered with the FCC (ASR) and is normally FAA-marked (paint and/or lights). The ASR number must also be posted where the public can see it near the base.

### Cited Findings

#### 1a. Macro structures
- **Monopole:** a single steel column. It has a smaller footprint than guyed or lattice towers and supports fewer antennas. [B/C] — [PTTG](https://pttg.com/blogs/types-of-communication-towers.php). State siting guidance covers monopole, lattice and guyed siting [A] — [Connecticut Siting Council](https://portal.ct.gov/-/media/csc/cscbookr5apdf.pdf)
- **Self-supporting lattice:** a freestanding steel framework, described as the most stable and flexible type. It can exceed 500 ft and carry many antennas [B/C] — [PTTG](https://pttg.com/blogs/types-of-communication-towers.php). One consumer guide puts it at ~60–120 m [C] — [TowerDex pillar guide](https://towerdex.com/pillar/complete-guide-cell-tower-infrastructure)
- **Guyed mast:** held up by tensioned cables anchored to the ground. Reported heights range from ~300 ft to 2,100 ft in the Connecticut document. The tallest US guyed masts (>600 m) are mostly broadcast, not cellular. [A/B] — [CT Siting Council](https://portal.ct.gov/-/media/csc/cscbookr5apdf.pdf); [PTTG](https://pttg.com/blogs/types-of-communication-towers.php). *Caution: the search summary noted that height figures mix broadcast and cellular towers.*
- An assessor's analysis of US cell tower types exists but was not extracted [A] — [Alabama Dept. of Revenue cell tower analysis](https://revenue.alabama.gov/wp-content/uploads/2022/05/2017_05_AAAOSummer2019_Cell_Tower_Analysisv2.pdf). Montgomery County, MD also publishes a "tower type description" PDF, but it could not be fetched (host blocked) — [Montgomery County MD](https://montgomerycountymd.gov/cable/Resources/Files/Towers/documents/tower%20type%20description.pdf)

#### 1b. Height thresholds and aviation marking (authoritative anchors)
- **ASR threshold:** registration is required for antenna structures taller than 60.96 m (200 ft) above ground level, or that may interfere with the flight path of a nearby airport. It is filed on FCC Form 854. [A] — [Wikipedia: ASR in the US](https://en.wikipedia.org/wiki/Antenna_structure_registration_in_the_United_States); [FCC ASR help](https://www.fcc.gov/node/23343)
- **FAA marking:** a structure above 200 ft AGL, or one exceeding a Part 77 obstruction standard, should normally be marked and/or lighted. The FAA can also recommend marking shorter structures because of their location. [A] — [FAA FAQ](https://www.faa.gov/faq/what-are-requirements-aircraft-warning-lights-tall-structures)
- **Marking methods:** red lights, white strobes, and orange-and-white paint. Dual medium-intensity systems are common on towers between 200 and 500 ft [C] — [TowerDex FAA lighting](https://towerdex.com/about-faa-lighting). A lighting vendor says structures over 200 ft must be marked with lights or paint [B] — [Flash Technology](https://www.flashtechnology.com/wp-content/uploads/2017/09/Flash-Tower-Guidelines-1K-20170921.pdf). Towers under 200 ft are not automatically exempt if near an airport [C] — [PTTG lighting](https://pttg.com/blogs/what-to-know-about-tower-lighting-and-marking-requirements.php)
- The FAA's final policy *requests* voluntary marking for meteorological towers under 200 ft [B] — [AVweb](https://avweb.com/news/faa-keeps-tower-markings-voluntary/)
- **ASR posting rule:** 47 CFR 17.4(g) requires the ASR number to be displayed conspicuously near the base, on weather-resistant material. A February 2024 order changed this so the number must be visible to the public at the closest point of public access near the base, and at each access point. Where one fence encloses several structures, the number goes at the access point(s) and at the base of each structure. There is an exemption for historic landmarks. [A] — [Kelley Drye advisory](https://www.kelleydrye.com/viewpoints/client-advisories/fcc-updates-rules-governing-the-construction-marking-and-lighting-of-antenna-structures.md); [Federal Register, Feb 13 2024](https://govinfo.gov/content/pkg/FR-2024-02-13/pdf/2024-02871.pdf); [eCFR Part 17](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-17). *The search summary could not confirm the exact current eCFR wording.*

#### 1c. Building- and structure-mounted sites
- **Rooftop:** building owners lease about 200–300 sq ft of rooftop space [C] — [ALB law firm](https://alblawfirm.com/?p=1530). A concealment vendor's macro catalog includes rooftop solutions [B, vendor] — [Raycap Macro Concealment Inspiration Guide](https://www.raycap.com/wp-content/uploads/Macro-Concealment-Inspiration-Guide.pdf)
- **Water-tower look-alike:** a "water tower-like" cell tower in San Diego's North Park was built under a city plan calling for concealment through "camouflage and screening techniques" [B] — [Voice of San Diego](https://voiceofsandiego.org/?p=657541)
- Most wireless carriers need 200–400 sq ft of space for equipment [B] — [Radio World](https://www.radioworld.com/industry/maximizing-tower-assets)

#### 1d. Stealth / concealed sites
- **Definition (ordinance language):** "stealth design" means a camouflage technique, including a simulated tree ("monopine"), silo, or fire tower [A, local code] — [Law Insider: stealth design](https://www.lawinsider.com/dictionary/stealth-design)
- **Monopine:** Larson Camouflage built the first "monopine" in Monument, Colorado, in 1992 [B] — [Inside Towers: Larson Camouflage profile](https://insidetowers.com/?p=7351). The disguise is matched to the setting: a monopine works in a forest but not in a desert [C] — [PTTG: stealth towers](https://pttg.com/blogs/stealth-towers-8-ways-to-camouflage-your-cell-towers.php). Winston-Salem allows tree-form towers only within existing stands of trees [A] — [Winston-Salem UDO](https://www.cityofws.org/DocumentCenter/View/4771/UDO-250-PDF)
- **Monopalm:** artificial fronds that resemble a natural palm [C] — [PTTG](https://pttg.com/blogs/stealth-towers-8-ways-to-camouflage-your-cell-towers.php). Example photo: Tucson, AZ, 2007 — [Commons: PalmCellTower.jpg](https://commons.wikimedia.org/wiki/File:PalmCellTower.jpg)
- **Flagpole:** a hollow pole of RF-transparent material such as fiberglass, with the antennas inside [C] — [PTTG](https://pttg.com/blogs/stealth-towers-8-ways-to-camouflage-your-cell-towers.php); [BroadbandSearch](https://www.broadbandsearch.net/blog/5g-tower-disguises-stealth-cell-sites). Example photo: Randolph, NJ — [Commons: Flagpole Monopole Concealed Cell Tower.jpg](https://commons.wikimedia.org/wiki/File:Flagpole_Monopole_Concealed_Cell_Tower.jpg)
- **Steeples, crosses, bell and clock towers:** antennas sit inside steeple spires, behind RF-transparent louvers in bell towers, or inside large cross structures [C] — [BroadbandSearch](https://www.broadbandsearch.net/blog/5g-tower-disguises-stealth-cell-sites). Example: a custom steeple in Unionville, CT, built to echo the church's architectural motifs [B] — [Sweets: First Church of Christ, Unionville CT](https://sweets.construction.com/swts_content_files/479/P815170.htm)
- **Silo, steeple, cross, big flagpole:** all cited as places a site might hide [B] — [Voice of San Diego](https://voiceofsandiego.org/?p=657541)
- **Range of disguises:** a 2004 Florida report found "hundreds" of stealth towers and antennas disguised as pine trees, flagpoles, light poles, traffic lights, stadium lights and clock towers [B] — [Tampa Bay Times (2004)](https://www.tampabay.com/archive/2004/04/26/these-cell-towers-have-something-to-hide/)
- **Trade-offs:** "the more intricate the stealthing, the less the capacity or coverage can be expected from the site" [A, planning doc] — [Eugene, OR planning document](https://pddfiles.eugene-or.gov/PDDDocumentViewer/0/doc/1253200/Page61.aspx). Clock towers and steeples with heavy façade components add substantially more dead load [B] — [STRUCTURE magazine](https://www.structuremag.org/article/engineering-concealment-telecommunication-towers/)
- **Commons photo categories:** [Camouflaged antenna towers and masts](https://commons.wikimedia.org/wiki/Category:Camouflaged_antenna_towers_and_masts); [Antenna towers and masts camouflaged as trees](https://commons.wikimedia.org/wiki/Category:Antenna_towers_and_masts_camouflaged_as_trees). New Hampshire evergreen-style example: [Commons: Cell phone tower disguised 2008.jpg](https://commons.wikimedia.org/wiki/File:Cell_phone_tower_disguised_2008.jpg)

#### 1e. Small cells (pole-top, side-mount, strand-mount, smart poles)
Municipal design standards are authoritative locally [A]. They dictate what small cells *look like*:
- **Salt Lake City:** all carrier equipment except the antenna goes in a base cabinet or behind a shroud. Antennas go inside a shroud where technically feasible — [SLC Small Cell Infrastructure Design Standards (June 2024)](https://www.slc.gov/engineering/wp-content/uploads/sites/27/2026/03/Small-Cell-Standards-2024-June-Final.pdf)
- **Denver:** all carrier equipment must be shrouded, and the shroud colored to match the pole — [Denver Small Cell Infrastructure Design Guidelines (via Bend, OR record)](https://bend.granicus.com/MetaViewer.php?view_id=9&clip_id=497&meta_id=30083)
- **Town of Burlington:** the antenna enclosure may be no wider than twice the top diameter of the pole, and no more than 6 cu ft — [Burlington design rules](https://www.burlington.org/DocumentCenter/View/1659/Small-Cell-Design-Standards-PDF). *The search summary said Burlington, VT, but "Town of Burlington" and the burlington.org domain suggest Burlington, MA. Verify.*
- **Bothell, WA:** a canister antenna on top of a wooden pole may be at most 16 in in diameter, painted to match — [Bothell Municipal Code 12.11.260](https://bothell.municipal.codes/BMC/12.11.260)
- **Andover, KS:** one carrier per streetlight pole, and one primary shroud of at most 6 cu ft — [Andover standards](https://andoverks.civicweb.net/document/23240/)
- **Lee's Summit, MO:** cables protruding from a canister must be concealed — [Lee's Summit Sec. 7000](https://cityofls.net/Portals/0/Files/Development/Regulations%20and%20Policies/Design%20and%20Construction%20Manual/LS%20Sec%207000%202018-12%20(SWF).pdf?ver=2019-01-04-183213-913)
- Ann Arbor has similar shroud and canister rules — [Ann Arbor guidelines](https://www.a2gov.org/media/33wbrr5h/a2-small-cell-infrastructure-april-2020v1-city_final-update_8-28-20.pdf)

Strand-mount:
- Strand mounts hang equipment on the cables or wires between utility poles. Small-cell weight can make the strand droop toward the cables below. The telecom operator owns the strand, so equipment within allowed dimensions "often will not implicate any zoning review". Cable operators also hang Wi-Fi access points on their own strands. [A, patents] — [US Pat. 11,133,575](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11133575); [US Pat. 11,581,630](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11581630)
- **Comcast** chose Samsung's 5G CBRS **Strand Small Cell**, which mounts on existing aerial cable lines and uses a DOCSIS 3.1 modem for backhaul [B] — [Fierce Network](https://www.fierce-network.com/wireless/comcast-will-deploy-samsung-5g-gear-boost-xfinity-mobile-capacity)
- **Charter** was considering strand-mounted CBRS small cells in 2019 [B] — [Fierce Network](https://www.fierce-network.com/tech/charter-comcast-could-deploy-strand-mounted-wireless-small-cells)
- One analyst estimate: ~$2,500 per strand-mounted CBRS cell versus ~$25,000 for a traditional small cell [B, per search summary] — [Fierce Network](https://www.fierce-network.com/tech/charter-comcast-could-deploy-strand-mounted-wireless-small-cells)

Smart poles (NYC Link5G):
- About 32 ft tall: a 19.5 ft minimum transmitter height, plus five antenna bays of at least 29 in each, plus a 5 in ventilation gap [A] — [NYC Design Commission presentation (2021)](https://www.nyc.gov/assets/designcommission/downloads/pdf/10-18-2021-pres-DoITT-p-Link-5G.pdf)
- The original design held up to five carriers [B] — [Inside Towers](https://insidetowers.com/nyc-extends-5g-to-unserved-areas-starting-with-the-bronx). A redesign cut this to two tenants, with base cabinets under 5 ft and the 5G radios higher up [B] — [Inside Towers](https://insidetowers.com/new-link5g-design-looks-to-fit-in-with-nyc-neighborhoods). *These two accounts conflict on tenant count.*
- The first kiosk (Bronx) went live without any carrier's 5G gear [B] — [Light Reading](https://www.lightreading.com/digital-divide/linknyc-begins-deploying-5g-kiosks---but-not-yet-with-5g-inside/d/d-id/779518)
- Commons has a "Link5G towers" subcategory [A for existence] — [Commons: 5G towers in the United States](https://commons.wikimedia.org/wiki/Category:5G_towers_in_the_United_States)

Carrier pole applications with mock-ups (useful drawings for lessons) [A]: Verizon on a utility pole in Andover, MA — [Andover, MA](https://andoverma.gov/DocumentCenter/View/11663/10172022-Small-Cell-Wireless-Installation); Verizon project description in Palo Alto — [Palo Alto](https://www.paloalto.gov/files/assets/public/v/1/planning-amp-development-services/new-development-projects/wireless-projects/17pln-00228/project-description.pdf)

#### 1f. DAS (outdoor, in-building, stadium)
- DAS is the most common way to provide coverage and capacity in stadiums. One DAS is often shared by several carriers, and ownership can shift to the venue, an integrator or a third-party neutral host [B] — [telecoms.com](https://www.telecoms.com/broadband/the-future-of-wireless-connectivity-in-sports-stadiums)
- Crown Castle's neutral-host DAS at University of Phoenix Stadium (Super Bowl XLIX) carried Verizon, AT&T, Sprint and T-Mobile. Some antennas were hidden behind **fake vents** on the stadium shell [B] — [RCR Wireless (2015)](https://rcrwireless.com/20150129/network-infrastructure/digging-das-superbowl-tag4)
- AT&T led a neutral-host DAS at Mississippi State's Davis Wade Stadium (Aug 2026) using Airspan's MobileAccess 6000 digital DAS [A/B] — [Business Wire](https://secure.businesswire.com/news/home/20260810282533/en/ATT-Led-Neutral-Host-Network-Powers-New-Connectivity-Experience-at-Davis-Wade-Stadium); [DCD](https://www.datacenterdynamics.com/en/news/att-taps-airspan-for-neutral-host-network-at-davis-wade-stadium-mississippi/)
- Other neutral-host examples: Boldyn at the Chicago Fire's McDonald's Park [B] — [DCD](https://www.datacenterdynamics.com/en/news/boldyn-networks-to-deploy-neutral-host-5g-das-for-chicago-fires-new-stadium-mcdonalds-park/); Boingo at San Diego State's stadium [A] — [Business Wire (2020)](https://www.businesswire.com/news/home/20201102005125/en/Boingo-to-Launch-Cellular-Services-for-San-Diego-State-Universitys-New-Multi-Use-Stadium)
- Scale: the Sprint integration removed roughly 31,000 small cell/DAS sites, in addition to ~30,000 macro sites [B] — [SDxCentral](https://www.sdxcentral.com/news/t-mobile-abandons-10s-of-thousands-of-sprint-cell-sites/)

#### 1g. Temporary sites (COW, COLT, SatCOLT, etc.)
- A **COW** is a cell site on a trailer that a truck must haul. A **COLT** is built onto a vehicle. Both run on generators and backhaul by satellite or microwave. FirstNet's **SatCOLT** links over satellite and does not rely on commercial power. [A] — [FirstNet Deployables (PDF)](https://www.firstnet.gov/sites/default/files/FirstNet_Deployables.pdf); [FirstNet deployables page](https://firstnet.gov/deployables)
- The FirstNet fleet has **100+ assets**: SatCOLTs, SatCOWs, "Flying COWs" (drones), Compact Rapid Deployables, communications vehicles, and an aerostat. They are free to subscriber agencies. [A] — [FirstNet factsheet (Mar 2022)](https://firstnet.gov/sites/default/files/Deployables_factsheet_2022_March.pdf); [FirstNet blog](https://firstnet.gov/newsroom/blog/investing-future-firstnet-expanding-our-deployable-fleet-public-safety)
- **Siting requirements (visual clues):** a minimum 100 ft safety perimeter; at least 500 ft from a command post; a clear satellite view of the **southern sky**; generators refueled by AT&T [A] — [FirstNet Deployables (PDF)](https://www.firstnet.gov/sites/default/files/FirstNet_Deployables.pdf)
- One industry source puts a COLT's cost in seven figures [C, per search summary] — [NWS / Sun West Engineering](https://nwsnext.com/manufacturers/sun-west-engineering/). Verizon and T-Mobile also run deployable fleets [C, Reddit anecdote via mirror] — [r/antennasporn thread](https://reddit.birdcat.cafe/r/antennasporn/comments/1jndpql/check_this_out)
- Photo: [Commons: Cellular on wheels.jpg](https://commons.wikimedia.org/wiki/File:Cellular_on_wheels.jpg)

#### 1h. Tower owner companies and their signage
- **Tower counts (year-end 2025):** American Tower 41,795 (US & Canada region); Crown Castle 39,804 (all US); SBA 17,398 (US). Vertical Bridge is reported as "over 18,000" by Inside Towers but as 10,425 securitized tower sites by Wireless Estimator. Array Digital Infrastructure has ~4,338 and Diamond Communications 4,000+. [B] — [Inside Towers ranking](https://insidetowers.com/ranking-u-s-tower-companies/); [Wireless Estimator (2026)](https://wirelessestimator.com/articles/2026/vertical-bridge-the-4th-largest-towerco-secures-1-94b-in-tower-financing-approaching-sbas-2-07b-record/); [Steel In The Air](https://www.steelintheair.com/cell-tower-companies/)
- **Array Digital Infrastructure** (the renamed former UScellular company, which kept the towers when its wireless operations were sold to T-Mobile) keeps ~4,400 owned towers and calls itself the fifth-largest US tower business [A] — [Array 8-K](https://www.sec.gov/Archives/edgar/data/821130/000110465925073368/tm2518822d2_ex99-2.htm)
- **Owner NOC lines:** American Tower 877-ATC-SITE (877-282-7483) [A] — [ATC NOC page](https://www.americantower.com/us/customer-support/network-operations-center.html); Crown Castle 1-800-788-7011 and NOC@crowncastle.com [A; page possibly ~6 years old] — [Crown Castle NOC](https://www.crowncastle.com/network-operations-center)
- **Typical posted signs** at a tower: an FCC ASR number sign, an RF hazard sign, and no-trespassing and do-not-climb signs. A perimeter fence typically encloses the tower and ground equipment. [C, vendor] — [Trident Solutions](https://www.tridentproducts.com/cell-tower-safety-identification/). Consumer guides say the FCC placard and emergency-contact sign at the base name the owner [C] — [Wilson Amplifiers](https://www.wilsonamplifiers.com/blog/finding-cell-tower-locations-the-complete-guide/); [ModemGuides](https://www.modemguides.com/blogs/modemguides-blog/cell-tower-infrastructure-map-guide)
- A CellMapper wiki page drew its tower-owner details from antennasearch.com and from American Tower, Crown Castle and SBA records [C] — [CellMapper wiki site page](https://docs.cellmapper.net/mw/310_410_15755_222469)

### Inferences
- **Lesson anchor, "paint or lights":** a tower painted orange and white, or carrying obstruction lights, is very likely over 200 ft (or near an airport). It should therefore have an ASR record and a posted ASR number naming the *structure owner*. An unpainted, unlit galvanized tower is more likely under 200 ft. The FAA's discretion near airports makes this probabilistic, not absolute. (From 1b.)
- Because ASR and FAA thresholds sit at 200 ft, many macro builds probably cluster just under 200 ft. I found **no source quantifying this**, so present it as a hypothesis.
- **Small cells look different city by city** because municipal codes set shroud size, color matching, cabinet placement and one-carrier-per-pole rules. Lessons should teach generic small-cell *anatomy* (top canister or side shroud, radio shroud or base cabinet, cable concealment, RF sticker) before any carrier-specific look.
- **Stealth sites hide antenna counts and arrangement** (flagpoles, steeples, louvers). Carrier ID there relies on signage and permit records, not hardware.
- **Temporary sites:** a trailer or vehicle with a telescoping mast, a generator, and a satellite dish aimed at the southern sky near an event or disaster is a SatCOW or SatCOLT. FirstNet-branded units are AT&T-operated: AT&T refuels them, and FirstNet is AT&T's public-safety network.
- **Vertical Bridge counts conflict.** The "18,000+" figure may include non-tower sites (rooftops, etc.) while 10,425 is securitized towers only. This is unverified.

| Site type | Key visual identifiers (for flashcards) | Typical setting (inferred unless cited) | Height notes |
|---|---|---|---|
| Self-supporting lattice | Open steel framework, wide base, no guy wires | Rural/suburban, broadcast plus cellular hubs | Can exceed 500 ft (cited, 1a) |
| Guyed mast | Slender mast plus diagonal guy cables to ground anchors; large footprint | Rural; the tallest are broadcast | ~300 ft to 2,100 ft range cited (1a) |
| Monopole | Single tapered column; antenna arrays at top | Suburban, roadside | Smaller footprint, fewer antennas (cited) |
| Rooftop / façade | Antennas on parapets or building faces, often painted to match | Urban (inferred) | Building height |
| Water tank | Antennas ringed on the tank or catwalk | Suburban/rural (inferred) | Tank height |
| Monopine / monopalm | Fake branches or fronds, often with antennas visible inside the foliage | Monopine: wooded areas (cited); monopalm: warm climates (inferred) | Varies |
| Flagpole | Thick, seamless fiberglass top section, sometimes no flag | Suburban commercial or civic (inferred) | Varies |
| Steeple / bell / clock tower / cross | Louvers or RF-transparent panels; new-looking architectural element | Churches, civic buildings | Building-integrated |
| Silo | Silo with no farm function, or a seamless top | Rural/exurban (inferred) | Varies |
| Pole-top small cell | Canister on top of a street or utility pole (wood: ≤16 in in Bothell); radio shroud or base cabinet | Urban/suburban rights-of-way | Pole height |
| Strand-mount | Box hanging on the cable strand between poles | Cable-served neighborhoods | Strand height |
| Smart pole (Link5G) | ~32 ft multi-bay pole plus kiosk base | NYC | ~32 ft (cited) |
| DAS | Small antennas indoors or on venue shells, sometimes behind fake vents | Stadiums, venues, large buildings | n/a |
| COW / COLT / SatCOLT | Trailer or truck with telescoping mast, generator, satellite dish | Events, disasters | Mast height |

### Gaps
- **No authoritative height distribution per type** was found (e.g., typical monopole or lattice heights for cellular). The FCC "small wireless facility" definition (47 CFR 1.6002(l): ≤50 ft structures, ≤3 cu ft per antenna, ≤28 cu ft of other equipment) is from my background knowledge and was **not verified** this session.
- No sources were found for **water-tank**, **façade-mounted**, **chimney**, or **faux rooftop screen-wall** designs specifically. The Raycap concealment guide likely covers screen walls and chimneys, but its content was not extracted.
- **Tower-owner sign appearance** (colors, logos, site-number formats for American Tower, Crown Castle, SBA, Vertical Bridge) was not documented. **SBA and Vertical Bridge NOC numbers were not found.** The user's own photos or Commons images could fill this.
- **Total US tower count:** I saw an estimate of ~185,000 and another of ~154,800 in result summaries, but could not tie either to a specific source. The cited counts for the top three (~41.8k + 39.8k + 17.4k ≈ 99k) are consistent with the claim that the "top three own ~100,000".
- **Crown Castle's small-cell/fiber divestiture** came up in a summary as a "May 2026" divestiture, which may conflict with earlier reporting. The date, and whether Crown Castle-branded small cells now carry another owner's signage, were not verified. Check before teaching owner signage on small cells.

---

## 2. What identifying "tells" does each carrier have on macro sites and small cells (AT&T/FirstNet, Verizon, T-Mobile incl. Sprint & UScellular legacy, Boost/EchoStar ex-Dish)?

### Takeaway
I found no authoritative "carrier X always uses Y" rulebook. The most reliable tells are (1) the **carrier's own RF or site sticker**, which names the carrier and site number, and (2) **public permit filings** that list each carrier's antenna and radio models and rad center.

Hardware tells exist but depend on **band and era**:
- **T-Mobile:** n41 massive MIMO, the Ericsson AIR 6449 B41 (about 33×21×9 in, 104 lb, one per sector), which replaced the AIR 6488.
- **AT&T:** Ericsson AIR 6419 units for C-band (B77D) *and* 3.45 GHz (B77G), sometimes both on one level. FirstNet Band 14 often uses separate antennas.
- **Verizon:** C-band massive MIMO from Samsung (64T64R) or Ericsson (AIR).
- **Dish/Boost:** Fujitsu radios and JMA antennas. This gear is **now abandoned**, and the tower companies own it.

These tells decay because of vendor swaps (AT&T's Nokia-to-Ericsson swap is on track for ~80% by end-2026) and shutdowns (Sprint in 2022, Dish in 2025–26).

### Cited Findings

#### AT&T (including FirstNet)
- **[A] Conf: Med-High.** AT&T filings show **Ericsson AIR 6419 B77G** (3.45 GHz "DoD" band) and **AIR 6419 B77D** (C-band, ~3.7 GHz) antenna-integrated radios, often **three per site, one per sector**.
  - A Montgomery County filing lists the B77G at 3450 MHz and the B77D at 3860–3920 MHz — [MC2024092327](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2024092327+Application.pdf)
  - A New Orleans permit set calls for "(3) 3.45 AIR6419 B77G AIR ANTENNAS" with six upconverters — [NOLA permit](https://onestopapp.nola.gov/GetDocument.aspx?DocID=6551224)
  - One Connecticut Siting Council AT&T filing lists "three (3) AIR6419 B77D & (3) AIR6419 B77G antennas at the 153' level" plus RRUS 32 B30 units — [CT 2022 New Haven](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/newhaven/wheelerst/att_cing/em-att-093-220414_filing_wheelerst_.pdf); [CT 2022 Vernon](https://portal.ct.gov/-/media/CSC/2_EMS-medialibrary/Vernon/IndustrialParkRd/ATT-CING/em-cing-146-220401_filing_Industrial-Park-Road.pdf); [CT 2025 Southington](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/southington/shuttlemeadowrd/att_cing/em-att-131-250501_filing_shuttlemeadowrd_southington_a.pdf?rev=e43a88f53303489d8cee74ea32f7a3e5&hash=C7F635D008BC75FF4C94DA8B08E80880). *The summary did not say which of the three this was.*
  - RRU counts per sector vary by site (per search summary).
- **[B] Conf: Med.** "The majority of FirstNet installations use **separate antennas** for band 17 [commercial LTE] and band 14 [FirstNet]" — [Anritsu application note](https://dl.cdn-anritsu.com/en-us/test-measurement/files/Application-Notes/Application-Note/11410-02865A.pdf)
- **[A]** Band 14 is FirstNet's 700 MHz public-safety band. FirstNet MegaRange devices transmit at 1.25 W on Band 14/n14 (device side, not site side) — [FirstNet MegaRange](https://www.firstnet.com/coverage/firstnet-megarange.html)
- **[A/B] Vendor swap (makes Nokia a fading AT&T tell):**
  - AT&T says it has completed more than 50% of its radio replacement program — [AT&T blog (2026)](https://about.att.com/blogs/2026/att-advances-open-ran-readiness.html)
  - The swap is on track for ~80% by end-2026 and full completion in early 2027. Remaining Nokia gear is concentrated in the Northeast and western US, especially Southern California — [Fierce Network (Jun 2026)](https://www.fierce-network.com/wireless/atts-vendor-swap-moves-full-speed-ahead)
  - The swap was at 40% in Oct 2025 — [Light Reading](https://www.lightreading.com/5g/at-t-removes-40-of-nokia-radios-in-vendor-swap-update)
  - Nokia is not on AT&T's approved open-RAN radio list. The plan is ~$14B over five years, with 70% of traffic on the open platform by end-2026 — [SDxCentral](https://www.sdxcentral.com/news/att-unleashes-multivendor-open-ran-test-on-increasingly-nokia-less-commercial-network/)
- **[B]** AT&T made a commercial open-RAN call with Ericsson basebands and **1Finity** radios in 2025, and expected to begin deploying 1Finity radios in 2026 — [Fierce Network](https://www.fierce-network.com/wireless/att-marks-latest-open-ran-achievement-ericsson-1finity); [Light Reading](https://www.lightreading.com/5g/at-t-expands-open-ran-and-cloud-is-on-the-horizon)
- **[B]** AT&T is buying EchoStar spectrum. Closing slipped past July 1, 2026 — [Light Reading](https://www.lightreading.com/5g/echostar-s-future-as-a-facilities-based-wireless-carrier-is-toast-amid-spectrum-sale-to-at-t); [Mobile World Live](https://www.mobileworldlive.com/operators/dish-files-for-chapter-11-to-speed-debt-repayment/)
- **[C]** A CellMapper wiki page for an Alabama AT&T site records an AT&T install in Dec 2023, with T-Mobile antennas lower on the same tower — [CellMapper wiki](https://docs.cellmapper.net/mw/310_410_15755_222469)

#### Verizon
- **[A/B] Conf: Med.** Verizon's C-band gear comes from **Ericsson** (its AIR antenna-integrated massive MIMO radio) and **Samsung** (a 64T64R massive MIMO radio). C-band is n77 at ~3.7 GHz. — [Fierce Network](https://www.fierce-network.com/operators/verizon-deploys-c-band-gear-from-ericsson-samsung-for-its-5g-network); [Samsung press release](https://www.samsung.com/global/business/networks/insights/press-release/0419-verizon-starts-c-band-equipment-deployment); [CellTowerLocator (consumer)](https://celltowerlocatorapp.com/carriers/verizon)
- **[A]** Municipal filings for Verizon sites list the **Samsung MT6407-77A**, but give conflicting dimensions (11.39"×5.45"×16.2" in one Montgomery County filing vs 35.06"×16.06"×5.51" in "a different county filing") — candidates: [MC2022041731](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2022041731+Application.pdf); [MC2022081921](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2022081921+Application.pdf). *The summary did not say which filing had which figure, or whether the second filing was from another jurisdiction.*
- **[A]** Verizon modifications are filed as Section 6409 "Eligible Facilities Requests" that list the equipment — [Warrenton, OR EFR](https://files.municipalone.com/warrenton-or/doccenter-2250120520251751511.pdf). A Verizon equipment spec attachment appears in a CT docket — [CT Siting Council](https://portal.ct.gov/-/media/csc/1_dockets-medialibrary/1_media_do500_600/do552/applicant-submissions/filing/attachment-8.pdf?rev=c3eef4a54a4e420ba62d4aed0f789dfd)
- **[A]** Verizon microwave backhaul is licensed in ULS under **"Cellco Partnership"**, with transmit-site coordinates, tower height and structure type — [ULS license WQPU594](https://wireless2.fcc.gov/UlsApp/UlsSearch/licenseLocSum.jsp?licKey=3402927)
- **[B] Conf: Low (secondhand).** Small cells:
  - A Samsung 28 GHz outdoor unit "the size of a toolbox" bolts to streetlight poles. Verizon reportedly signed up to buy it (2019 trade-show claim) — [Tellus Venture](https://www.tellusventure.com/samsungs-5g-small-cell-in-a-box-solves-aesthetics-problems-for-some-people-and-some-applications/)
  - Verizon was first to use Samsung's indoor 28 GHz small cell — [Fierce Network](https://www.fierce-network.com/tech/samsung-debuts-indoor-5g-mmwave-small-cell)
- **[C]** A consultant blog shows a Massachusetts Verizon pole installation with a large antenna and a remote radio head (C-RAN design) — [Steel In The Air](https://www.steelintheair.com/blog/verizon-small-cell-for-comparison/)
- **[C] Conf: Low (historic).** A forum recollection says 1X/3G antennas looked like "fins" on Verizon sites. Another poster notes layouts vary by carrier even within one city — [HowardForums](https://www.howardforums.com/threads/how-to-tell-the-difference-between-cell-towers.1899716/)

#### T-Mobile (including legacy Sprint and UScellular)
- **[A] Conf: Med-High (Ericsson markets).** A T-Mobile application lists **three Ericsson AIR 6449 B41** units (33.1"×20.6"×8.6", 104.0 lb) and references an "Ericsson New T-Mobile Anchor Network Playbook". The AIR 6449 B41 has wider bandwidth and a smaller, lighter housing than the earlier **AIR 6488** — [Montgomery County MC2020061185](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2020061185+Application.pdf)
- **[B]** Ericsson's first 64-path unit was the AIR 6468. The AIR 6449 weighed ~37 kg (variant unstated; the B41 above is ~47 kg) — [The Mobile Network (2021)](https://the-mobile-network.com/2021/02/fitter-stronger-lighter/)
- **[A] Sprint (legacy, mark as historical):**
  - T-Mobile targeted ~35,000 site decommissions — [10-Q Q2 2022](https://www.sec.gov/Archives/edgar/data/1283699/000128369922000117/tmus-20220630.htm)
  - Nearly two-thirds were done by June 30, 2022, and "substantially all" targeted Sprint macro sites by Sept 30, 2022. Sprint CDMA was retired in Q2 2022 and Sprint LTE in Q3 2022 — [10-Q Q3 2022](https://www.sec.gov/Archives/edgar/data/1283699/000128369922000141/tmus-20220930.htm)
  - Integration was substantially completed in 2023 — [10-K FY2023](https://www.sec.gov/Archives/edgar/data/1283699/000128369924000008/tmus-20231231.htm)
  - [B] ~30,000 macro sites and ~31,000 small cell/DAS sites were removed — [SDxCentral](https://www.sdxcentral.com/news/t-mobile-abandons-10s-of-thousands-of-sprint-cell-sites/)
- **[A] UScellular (legacy branding, transition under way):**
  - The deal closed Aug 1, 2025, for $4.3B after adjustments — [T-Mobile Newsroom](https://www.t-mobile.com/news/business/t-mobile-closes-uscellular-acquisition); [Fierce Network](https://www.fierce-network.com/wireless/t-mobile-closes-43b-acquisition-uscellular)
  - The towers stayed with **Array Digital Infrastructure** (~4,400). T-Mobile signed a 15-year master license to be a tenant on **at least 2,015 additional Array towers**, and extended its leases on ~600 Array towers where it was already a tenant — [Array 8-K](https://www.sec.gov/Archives/edgar/data/821130/000110465925073368/tm2518822d2_ex99-2.htm); [RCR Wireless](https://rcrwireless.com/20250804/business/t-mobile-uscellular-deal)
- **[C]** A CellMapper wiki tower has several racks: T-Mobile on top, Verizon (with C-band) below, and a **decommissioned Sprint rack** lower down — [CellMapper wiki](https://docs.cellmapper.net/mw/311_480_127278); see also the T-Mobile pages [310_260_69688](https://docs.cellmapper.net/mw/310_260_69688) and [310_260_103115](https://docs.cellmapper.net/mw/310_260_103115). *The summary did not say which page.*

#### Boost Mobile / EchoStar (former Dish Wireless 5G): **all on-tower gear is legacy as of late 2026**
- **[A] Conf: Med for historic photos.** Dish chose **Fujitsu** O-RAN radio units: a low-band tri-band RU and a mid-band dual-band RU. Fujitsu was to integrate radios with antennas — [Dish press release (Jun 30, 2020)](https://about.dish.com/2020-06-30-DISH-advances-O-RAN-network-Selects-Fujitsu-for-5G-radio-units-and-Altiostar-for-virtualized-RAN-software-solution); [Light Reading](https://www.lightreading.com/5g/dishs-5g-radios-to-come-from-japans-fujitsu/d/d-id/762069)
- **[B]** At one Las Vegas site, Dish's Fujitsu radios and **JMA antennas** sat "at the very top" of an American Tower-owned tower — [Urgent Communications (2022)](https://urgentcomm.com/2022/02/27/the-time-i-visited-a-dish-5g-cell-site/). Other Dish antenna and radio vendors were MTI, CommScope, CellMax and KMW — [Light Reading](https://www.lightreading.com/mobile-core/dish-s-dave-mayo-pulls-back-the-curtain-on-5g-buildout)
- **[B]** Dish aimed for smaller rad-center occupancy and less equipment at the tower base (a "hub and spoke" O-RAN design) — [Inside Towers](https://insidetowers.com/cell-tower-news-dishing-on-5g/); [Inside Towers](https://insidetowers.com/dish-progressing-with-5g-network-build/)
- **[A] Shutdown:**
  - All customer traffic moved off Dish's own 5G network by **Nov 15, 2025**, and decommissioning began — [EchoStar 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1415404/000110465926021817/tmb-20251231x10k.htm); [EchoStar 8-K (Aug 2025)](https://www.sec.gov/Archives/edgar/data/1415404/000141540425000035/tmb-20250825xex99.htm)
  - Boost subscribers moved onto AT&T's network — [The Mobile Network](https://the-mobile-network.com/2025/08/boost-mobile-to-turn-off-mobile-network-as-its-hand-is-forced-over-spectrum-sale/); [US Mobile blog [C]](https://www.usmobile.com/blog/what-network-does-boost-mobile-use/)
- **[A/B] Bankruptcy:**
  - Dish DBS and its subsidiaries, **including Dish Wireless**, filed Chapter 11 on **June 30, 2026** (S.D. Tex., No. 26-90627). The plan for Dish Wireless is to wind down the network and sell assets. Boost Mobile was not part of the filing — [Satellite Today](https://www.satellitetoday.com/finance/2026/07/01/dish-satellite-tv-and-wireless-businesses-file-for-chapter-11-bankruptcy/); [Light Reading](https://www.lightreading.com/finance/dish-turns-to-chapter-11)
  - Dish DBS exited on **Oct 1, 2026**, but Dish Wireless remains in Chapter 11. Mediation with tower companies runs to Nov 4 — [Light Reading](https://www.lightreading.com/regulatory-politics/dish-dbs-exits-chapter-11-but-dish-wireless-is-still-stuck)
- **[B] Abandoned equipment:**
  - Under a July 2026 bankruptcy abandonment order, **tower companies now own the Dish radios and antennas left on their towers**. American Tower's CEO said so on its Q3 2026 call (Oct 27, 2026) — [Light Reading](https://www.lightreading.com/5g/tower-companies-now-own-dish-s-abandoned-5g-radios-and-spacex-might-become-a-buyer); [DCD](https://www.datacenterdynamics.com/en/news/american-tower-ceo-we-own-abandoned-dish-equipment-on-our-towers/); [Motley Fool transcript](https://fool.com/earnings/call-transcripts/2026/10/27/american-tower-amt-q3-2026-earnings-call-transcript)
  - An analyst estimates ~24,000 Dish radios nationwide (Raymond James) — [Broadband Breakfast](https://broadbandbreakfast.com/tower-companies-own-thousands-of-abandoned-dish-radios/)
  - SpaceX is a possible buyer — [Inside Towers](https://insidetowers.com/for-sale-5g-ran-equipment-already-installed-barely-used/)
- **[B] Removal and disputes:**
  - The FCC required a **$2.4B escrow** for tower companies' removal costs (reported as a "July 30 order").
  - Small property owners are paying for removals themselves. Dish's decommissioning has included removing software, turning down circuits, and field removal of some equipment.
  - More than 170 lawsuits have been filed, and tower companies claim $7.6B. Plan confirmation may slip to as late as Dec 2.
  - Sources: [Inside Towers](https://insidetowers.com/dish-wireless-sticks-small-property-owners-with-5g-equipment-removal-costs/); [Wireless Estimator](https://wirelessestimator.com/articles/2026/dish-wirelesss-bankruptcy-exit-slides-to-december-as-tower-companies-press-their-7-6-billion-claim/); [Fierce Network](https://www.fierce-network.com/wireless/dishs-bankruptcy-exposes-messy-aftermath-its-5g-gamble)
  - A judge's order dated July 14, 2026 ended EchoStar's obligation to build its own network (per search summary) — [Wireless Estimator](https://wirelessestimator.com/articles/2026/judge-ends-echostars-obligation-to-build-its-own-mobile-network-but-the-real-fight-with-tower-companies-continues-elsewhere/)
  - American Tower sued over Dish's attempt to exit its contract — [Light Reading](https://www.lightreading.com/5g/2025-in-review-echostar-navigates-a-series-of-storms)
  - SBA put annualized EchoStar revenue at ~$55M — [Wireless Estimator (2025)](https://wirelessestimator.com/articles/2025/tower-crews-lose-work-as-boosts-open-ran-ambitions-as-the-nations-fourth-carrier-collapse/)

#### Cross-carrier signage and site-ID tells
- **[A] Conf: High.** FCC RF signage (Docket 19-226, effective May 3, 2021):
  - Signal words and colors: **NOTICE (blue)**, **CAUTION (yellow)**, **WARNING (orange)**, **DANGER (red)**.
  - Signs must include a **point of contact**, the RF energy advisory symbol, an explanation of the RF source, and how to comply.
  - Sources: [Federal Register (2020)](https://www.federalregister.gov/documents/2020/04/01/2020-02745/human-exposure-to-radiofrequency-electromagnetic-fields-and-reassessment-of-fcc-radiofrequency); [Kansas Assn. of Broadcasters](https://kab.net/understand-these-new-rfr-rules/)
  - A PCIA-style sign set shows WARNING with a *red* header, which conflicts with the Federal Register's orange [B] — [RSI Corp](https://www.rsicorp.com/signs-sites)
- **[B] Conf: High.** Safety guidance tells workers to "use the information sticker to contact the carrier and shut down by **site number**". Carrier stickers carry the carrier name and site number — [Georgia Tech EHS](https://ehs.gatech.edu/radiofrequency-rf-safety)
- **[C] Conf: Low-Med.** A beginner guide says carriers can be told apart by antenna type and shape, the presence of **"ray caps"** (surge-suppressor enclosures), and carrier-specific equipment — [Scribd: "How To IDENTIFY What Carrier Is On That Cell Tower (BEGINNER)"](https://www.scribd.com/document/887863534/How-to-IDENTIFY-What-Carrier-is-on-That-Cell-Tower-BEGINNER-3)
- **[C]** Raycap makes macro concealment products (relevant to the "ray cap" term) — [Raycap](https://www.raycap.com/wp-content/uploads/Macro-Concealment-Inspiration-Guide.pdf)

### Inferences
- **A "big box per sector" (massive MIMO) means mid-band 5G, not a specific carrier.** To narrow it down:
  - **T-Mobile n41:** AIR 6449 B41, ~33×21 in, one per sector (Med).
  - **AT&T:** AIR 6419, possibly **two per sector** at one level (B77D C-band plus B77G 3.45 GHz) (Med).
  - **Verizon:** Samsung 64T64R or Ericsson AIR for C-band (Med-Low).
  - Confirm with the vendor badge, the carrier sticker, or a permit filing.
- **A separate Band 14 antenna/radio set on a sector points to AT&T/FirstNet** (Med), since most FirstNet sites use separate B14 and B17 antennas.
- **Nokia-branded radios are a weakening AT&T tell in late 2026** (AT&T's swap is ~80% done by year-end). Ericsson radios are not carrier-specific on their own.
- **Fujitsu-lineage radios may no longer imply Dish.** AT&T planned 1Finity radio deployments in 2026. *Whether 1Finity is Fujitsu's spun-off network business, which would make it look like Dish's old Fujitsu gear, is unverified (see Gaps).*
- **Dish gear should be taught as "legacy/abandoned".** Expect dark or unpowered racks that may be removed (with escrow-funded removals) or repurposed (SpaceX interest is speculative). Do not teach "Dish = always lowest rad center": the Las Vegas example had Dish at the very top.
- **Any Sprint-branded rack is legacy** (decommissioned 2022–2023), likely abandoned in place where not yet removed.
- **In former UScellular markets**, an Array-owned tower increasingly means T-Mobile is (or will be) a tenant. Legacy UScellular gear may persist during integration (unquantified).
- **Spectrum logic beats vendor logic.** Radios are labeled by band (B41/n41, B77D/B77G, B14). Band-to-carrier mapping, e.g. n41 for T-Mobile and B14 for AT&T/FirstNet, holds up better than vendor branding. Caveat: AT&T is buying EchoStar spectrum, reportedly including 600 MHz and 3.45 GHz (the band list is my recollection and was not verified this session). If so, 600 MHz radios may stop being a T-Mobile-only tell once the deal closes. This is inference; the closing status is unknown.
- **Filing paths hint at legal entities.** AT&T's CT filings sit under "att_cing" or "ATT-CING" paths, consistent with AT&T Mobility filing as "Cingular" entities. Verizon files ULS microwave licenses as "Cellco Partnership". Teach these licensee names for database lookups. (The AT&T entity name is unverified.)

**Carrier tell summary for lesson authoring (status as of 2026-10-31):**

| Carrier | Tell | Evidence | Conf | Status |
|---|---|---|---|---|
| AT&T | Ericsson AIR 6419 B77D/B77G (C-band + 3.45 GHz), often 3 per site or 3+3 at one level | [A] filings | Med-High | Current |
| AT&T/FirstNet | Separate Band 14 antennas | [B] Anritsu | Med | Current |
| AT&T | Nokia radios being replaced by Ericsson (Northeast/West last) | [A/B] | Med (decaying) | Transitional |
| Verizon | Samsung 64T64R or Ericsson AIR C-band mMIMO | [A/B] | Med-Low | Current |
| Verizon | Samsung 28 GHz "toolbox" mmWave units on streetlights | [B] secondhand | Low | Current/unclear |
| T-Mobile | Ericsson AIR 6449 B41 (33×21×9 in), earlier AIR 6488 | [A] filing | Med-High | Current |
| Sprint | Any Sprint rack or sign | [A] SEC | High that it is legacy | Historical (2022) |
| UScellular | Array-owned towers, T-Mobile tenancy rising | [A] | Med | Transitional |
| Dish/Boost | Fujitsu RUs plus JMA (or MTI/CommScope/CellMax/KMW) antennas | [A/B] | Med | Historical/abandoned |
| All | Carrier RF sticker with site number plus FCC-format RF sign | [A/B] | High | Current |

### Gaps
- **No carrier-specific authoritative or community source** was retrievable for per-sector antenna counts, mount styles (platform vs sector frame vs T-arm vs ring mount), RRU placement, hybrid trunk or fiber cabling, cabinet or shelter designs, or small-cell designs for AT&T and T-Mobile. Community sources (CellMapper wiki, r/cellmapper, r/towerporn, r/NoSodiumWireless, YouTube) were blocked or not surfaced.
- **UNVERIFIED candidate heuristics** (my background recollection; no source retrieved this session; **do not teach without confirmation**):
  - AT&T stickers often show "USID" and "FA location" codes.
  - Band 30 (WCS 2.3 GHz) radios, such as the RRUS 32 B30 seen in an AT&T CT filing, are AT&T-specific.
  - T-Mobile sites commonly show Ericsson integrated antenna-radios (AIR 21/AIR 32) and 600 MHz n71 radios. T-Mobile's Nokia markets use Nokia AirScale massive MIMO for n41.
  - Sprint "Network Vision" sectors carried three RRHs (800/1900/2500 MHz).
  - Raycap "squid" surge domes mark hybrid fiber/DC trunk cabling and appear across carriers.
  - Dish used distinctive Dish-branded RF signage.
  - Typical carrier NOC numbers appear on stickers.
- **1Finity's corporate lineage** (Fujitsu spin-off?) was not verified.
- **Current status unknown:** whether AT&T's EchoStar spectrum purchase has closed, and whether AT&T is deploying 600 MHz or 3.45 GHz on former Dish spectrum. **UScellular site decommissioning** counts or timeline were not found.
- **Verizon C-band unit dimensions** conflict across filings (MT6407-77A), and the MT6402 is undocumented. Samsung vs Ericsson market boundaries for Verizon were not found.

---

## 3. When multiple carriers share one structure, how do you tell which equipment belongs to which tenant?

### Takeaway
Tenants lease discrete **RAD centers**, typically a band about ±5 ft around the antenna center. Each horizontal "rack" or mount level on a tower therefore usually equals one tenant (or one tenant's additional position), and the equipment within a rack is a matched set. Height order is only a **weak** clue to who arrived first: the top commands a premium and "everybody wants" it, but a newcomer (Dish in Las Vegas) can still land on top. Abandoned racks (Sprint, Dish) complicate the count. Confirmation comes from **permit filings** that list carrier, equipment and rad center, from **carrier stickers** on mounts and cabinets, and from walk-around logging.

### Cited Findings
- **[A] RAD center** means "the center of radiation", reflecting the center height of the antennas. A tenant typically gets a license for the area from ~5 ft below to ~5 ft above the RAD center — [Law Insider: RAD Center](https://www.lawinsider.com/dictionary/rad-center)
- **[B]** "Everybody wants the top of the tower", including the owner. The top gives more omnidirectional coverage and protection from falling ice, but its premium rent is often not worth paying in hilly terrain — [Urgent Communications](https://urgentcomm.com/?p=4762)
- **[A]** Leases can require an incumbent to move to another RAD center it already occupies when a new tenant leases a vacated one. A municipal bid lets incumbents keep their existing RAD center. Vacant RAD centers (115–125 ft and 95–105 ft) came with a duty to **remove abandoned antennas** — [Ringwood, NJ bid specification (2025)](https://ringwoodnj.net/filestorage/3886/14023/Amended_Bid_Specification_3.19.2025.pdf)
- **[A]** Permit filings place each carrier's gear at a specific level, e.g. AT&T AIR 6419s "at the 153' level" in a CT filing — [CT Siting Council AT&T filing (one of)](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/newhaven/wheelerst/att_cing/em-att-093-220414_filing_wheelerst_.pdf)
- **[A]** Montgomery County application titles show applicant names that are not carriers (e.g., "Applicant Name NB+C", "Smartlink, LLC", "Application Type Colocated"). These appear to be site-development firms filing for carriers; *the firms' roles were not verified this session* — [MC2022061813](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2022061813+Application.pdf); [MC2024072303](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2024072303.pdf)
- **[B]** A counterexample to "newest tenant lowest": Dish's radios and antennas at the very top of an American Tower tower in Las Vegas — [Urgent Communications](https://urgentcomm.com/2022/02/27/the-time-i-visited-a-dish-5g-cell-site/)
- **[C]** CellMapper wiki examples show carrier racks stacked in order (T-Mobile top, Verizon below, a decommissioned Sprint rack lower), and an AT&T install with T-Mobile antennas lower — [CellMapper wiki](https://docs.cellmapper.net/mw/311_480_127278); [CellMapper wiki](https://docs.cellmapper.net/mw/310_410_15755_222469)
- **[C] Walk-around method:** log CellMapper data every 1–2 seconds while walking or driving around a tower to see which carriers' cells appear — [HowardForums](https://www.howardforums.com/threads/identifying-cell-sites-with-cellmapper.1853568/)
- **[A/B]** "A tower may have multiple transmitting antennas on it, each of which may have different licenses and different owners." Look up ULS microwave records that cite the tower's coordinates or ASR number — [CPWR: How to use the FCC & FAA databases](https://www.cpwr.com/wp-content/uploads/publications/Appendix_B_How_to_use_the_FCC__FAA_Databases.pdf)
- **[B]** Abandoned Dish equipment now belongs to the tower companies and may remain in place for some time — [Light Reading](https://www.lightreading.com/5g/tower-companies-now-own-dish-s-abandoned-5g-radios-and-spacex-might-become-a-buyer)

### Inferences
- **Counting rule:** distinct mount levels roughly equal tenants, minus abandoned racks (Sprint, Dish, others), and accounting for a carrier that holds two RAD centers (leases contemplate tenants occupying multiple RAD centers).
- **Matching-set rule:** within one level, antennas, radios and surge boxes usually share a model, vendor and color. A mismatch within one level may mean a mid-life upgrade by the same carrier (e.g., a massive MIMO unit added beside older panels), not a second tenant.
- **Age is not tenure.** The newest-looking hardware can belong to the oldest tenant after an upgrade (e.g., AT&T's Ericsson swap).
- **Best confirmation order:** (1) a carrier sticker on the mount, antenna or ground cabinet; (2) the local permit or EFR filing, which names the carrier and rad center (read past the agent's name to the carrier); (3) ULS microwave licensee at the same coordinates; (4) CellMapper walk-around.
- **Ground compound mirrors the tower.** Each tenant's cabinets or shelter, power and fiber demarcation should be separate and labeled. Tracing cable bundles from a rack down to a cabinet links rack to tenant. *This is logical inference; no source was retrieved.*

### Gaps
- No source (authoritative or community) was retrieved on **mount-generation chronology** (handrailed platforms, low-profile sector frames, T-arms, ring mounts), on carriers' preferred mount types, or on ground-compound labeling conventions.
- No data on how often rad-center order actually tracks tenancy order.

---

## 4. What do learners commonly confuse, and how do you tell them apart?

### Takeaway
The highest-value distinctions:
- **Round dish vs flat panel:** a round dish with a feed, often behind a drum-like radome or shroud, is a point-to-point **microwave backhaul** antenna. Tall flat rectangles arranged in sectors are **cellular panels**.
- **Fiberglass "sticks":** thin fiberglass omni collinears are usually **land-mobile or public-safety radio**.
- **Strand boxes:** boxes on the cable strand may be **cable-company Wi-Fi or CBRS small cells** (e.g., Comcast's Samsung strand units), not mobile-carrier small cells.
- **Thin guyed towers** in wind country may be **meteorological towers**.
- **Very tall guyed masts** are mostly **broadcast**.

Several requested pairs (utility SCADA Yagis, AMI collectors, cameras, Wi-Fi APs on light poles) found **no sources** this session.

### Cited Findings
- **[A, patents] Microwave dish anatomy:** a parabolic reflector with a feed at the focus. Dishes are typically fitted with a **shield** (a cylindrical skirt at the rim) and a **radome** (front cover) for outdoor use — [US Pat. 10,770,784](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10770784); [US 10,651,551 B2](https://patents.google.com/patent/US10651551)
- **[A, patent]** Flat-panel array antennas "may not be extensively used in the licensed commercial microwave point-to-point" market, so dishes remain the norm for backhaul — [US 10,651,551 B2](https://patents.google.com/patent/US10651551). A molded ABS or fiberglass radome reduces wind load [B, catalog] — [Wireless Estimator product info](https://wirelessestimator.com/content/industryinfo/260)
- **[A]** ULS microwave licenses for carriers list both ends of each path (e.g., Verizon/Cellco), so a dish's licensee and link partner are searchable — [ULS WQPU594](https://wireless2.fcc.gov/UlsApp/UlsSearch/licenseLocSum.jsp?licKey=3402927); [ULS microwave help](https://wireless2.fcc.gov/helpfiles/licenseSearch/helpMicrowave.html). There is a separate ULS help path for 70/80/90 GHz millimeter-wave links — [ULS mmW help](https://wireless2.fcc.gov/helpfiles/licenseSearch/helpMilimeter.html)
- **[B, manufacturer] LMR / public safety:** collinear omnidirectional base-station antennas enclosed in UV-coated fiberglass, used for land and marine radio and data links by public-safety agencies — [TE Connectivity (Laird) via Mouser](https://www.mouser.com.gt/laird-omnidirectional-fiberglass-antennas)
- **[A, patent] Omni vs panel:** omni antennas cover larger areas but handle high user density less well. Panels suit urban or heavy-traffic corridors; omnis suit rural areas. With 90° panels, four are needed around a tower — [US 6,028,566 A](https://patents.google.com/patent/US6028566)
- **[A, patent / B] Strand-mounted boxes:** cable operators mount **Wi-Fi access points** on strands they own — [US Pat. 11,133,575](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11133575). Comcast deploys Samsung **CBRS strand small cells** with DOCSIS backhaul — [Fierce Network](https://www.fierce-network.com/wireless/comcast-will-deploy-samsung-5g-gear-boost-xfinity-mobile-capacity)
- **[B] Met towers:** many towers just under 200 ft are meteorological, with voluntary FAA marking requested — [AVweb](https://avweb.com/news/faa-keeps-tower-markings-voluntary/)
- **[B/C] Broadcast vs cellular:** the tallest US guyed structures (>600 m) are mostly broadcast — [PTTG](https://pttg.com/blogs/types-of-communication-towers.php); [CT Siting Council](https://portal.ct.gov/-/media/csc/cscbookr5apdf.pdf)
- **Photo of a concealed microwave/cell combination** for a "trick" card — [Commons: Camouflaged Microwave Cell Telephone Tower.JPG](https://commons.wikimedia.org/wiki/File:Camouflaged_Microwave_Cell_Telephone_Tower.JPG)

### Inferences
| Often confused | Tell them apart by | Basis |
|---|---|---|
| Microwave dish vs cellular panel | Dish: round, a feed or drum radome, a skirt or shroud; points at the horizon toward another site; not arranged as a matched 3-sector set (count unsourced). Panel: tall narrow rectangle, mounted in groups facing several directions | Patents (dish anatomy); omni/panel patent (sector use); "not a 3-sector set" is an unsourced heuristic |
| Massive MIMO box vs microwave "flat panel" | mMIMO: thick rectangular box (~33×21×9 in for AIR 6449 B41), one per sector, same height as the carrier's panels. Licensed microwave panels are uncommon | AIR 6449 filing; patent on flat-panel microwave rarity |
| LMR/public-safety omni vs cellular | LMR: thin white or tan fiberglass "stick" (collinear), often on side arms or at the top. Cellular: sectorized panels | TE/Laird; omni vs panel patent |
| Cable-strand box vs carrier small cell | On the cable strand between poles: likely cable operator (Wi-Fi AP or CBRS small cell). Carrier small cells are usually pole-top or side-mounted in shrouds | Patents; Comcast/Samsung; municipal small-cell codes |
| Met tower vs cell tower | Thin guyed lattice with booms and instruments, no panels; near wind farms | AVweb |
| Broadcast mast vs cell tower | Very tall (hundreds of meters), guyed, broadcast arrays at the top; cellular racks (if any) far down | PTTG / CT doc |

### Gaps
- No sources this session for: **utility SCADA** (typically Yagi or small panel antennas on substations or poles), **AMI/smart-meter collectors** on utility poles, **traffic or security cameras** vs small cells, **Wi-Fi APs** on light poles, **GPS antennas**, **tower-mounted amplifiers**, lightning rods and aviation beacons, or **two-way radio Yagis**. These should be researched or photographed before building "confusion pair" lessons.
- No comparative guidance on **E-band (70/80 GHz) small dishes or flat panels** versus small cells.

---

## 5. What tools and data do hobbyists use to confirm an identification, and how reliable is each?

### Takeaway
No single source confirms a carrier.
- **FCC ASR** is authoritative for *structure owner, height and type*, but only for registered structures (>200 ft or airport-adjacent), and it does **not** list tenants.
- **ULS** rarely shows cellular sites, because cellular licenses are geographic. Carriers' **microwave** licenses do pin down tower coordinates and licensee names.
- **CellMapper** places towers by *calculation* from crowdsourced data. Accuracy depends on sampling and the data is incomplete, but its per-carrier band data and wiki photos are the best hobbyist confirmation.
- **AntennaSearch** repackages FCC data, with anecdotal accuracy problems.
- **Coverage maps** show *claimed coverage*, not sites.
- **Municipal permit and EFR filings** are the best per-site authoritative source for *which carrier has which equipment at which height*.

### Cited Findings
- **ASR [A]:**
  - Registration is required for structures >200 ft AGL or near airports, on Form 854 — [Wikipedia](https://en.wikipedia.org/wiki/Antenna_structure_registration_in_the_United_States); [FCC ASR help](https://www.fcc.gov/node/23343)
  - The ASR number must be posted visibly to the public near the base or access point — [Kelley Drye](https://www.kelleydrye.com/viewpoints/client-advisories/fcc-updates-rules-governing-the-construction-marking-and-lighting-of-antenna-structures.md)
  - The ASR database lets you search by location or owner and see height, type and status, but not every structure is registered [C, consumer guides] — [Wilson Amplifiers](https://www.wilsonamplifiers.com/blog/finding-cell-tower-locations-the-complete-guide/); [ModemGuides](https://www.modemguides.com/blogs/modemguides-blog/cell-tower-infrastructure-map-guide)
- **ULS [A]:**
  - ULS "does not capture the exact locations of many cellular towers because the licensees… get their licenses for geographic areas" — [CPWR Appendix B](https://www.cpwr.com/wp-content/uploads/publications/Appendix_B_How_to_use_the_FCC__FAA_Databases.pdf)
  - The Cellular service uses location type "Fixed", so some site records exist — [ULS Cellular help](https://wireless2.fcc.gov/helpfiles/licenseSearch/helpCellular.html)
  - Microwave licenses list transmit sites with coordinates, elevation, tower height, structure type, and receive sites — [ULS microwave help](https://wireless2.fcc.gov/helpfiles/licenseSearch/helpMicrowave.html); [ULS WQPU594 (Cellco)](https://wireless2.fcc.gov/UlsApp/UlsSearch/licenseLocSum.jsp?licKey=3402927)
  - Site-based search — [ULS Site License Search](https://wireless2.fcc.gov/UlsApp/UlsSearch/searchSite.jsp)
- **CellMapper [A for its own method / C for data]:**
  - Tower positions are "based purely on calculations". The algorithm can't tell a phone beside the tower from one 5 km away with line of sight.
  - A proper fix needs travel through 1/2 to 3/4 of a circle around the tower. Poorly sampled towers fall back to the best-signal location ("low accuracy"). Omnidirectional towers with one or two cells are always low accuracy.
  - All data is user-uploaded.
  - Source: [CellMapper FAQ](https://www.cellmapper.net/FAQ)
  - T-Mobile confirmed a 5G NR signal from a tower that CellMapper did not show, so the data is incomplete [C] — [T-Mobile Community](https://www.t-mobile.com/community/discussions/troubleshooting/finding-tmobile-cell-tower-locations/125747)
  - CellMapper's band data ties a tower to a specific carrier's spectrum [C] — one of [Wilson Amplifiers](https://www.wilsonamplifiers.com/blog/finding-cell-tower-locations-the-complete-guide/) / [ModemGuides](https://www.modemguides.com/blogs/modemguides-blog/cell-tower-infrastructure-map-guide) (the search summary did not say which)
  - The CellMapper wiki has per-site pages with photos and notes on rack order [C] — [CellMapper wiki](https://docs.cellmapper.net/mw/311_480_127278)
  - Locations are "near the real site rather than survey-grade" [C] — [Waveform](https://www.waveform.com/guides/cell-tower-mapping); [Android Police](https://www.androidpolice.com/cellmapper-coverage-tutorial/)
- **AntennaSearch [C]:**
  - A searchable database of US towers and antennas, likely drawing on FCC data, with user reports of inaccuracy — [TechSpot](https://www.techspot.com/community/topics/is-there-a-reliable-cell-phone-tower-search-site.145184/)
  - FCC-derived (HIFLD) datasets contain licensing errors, including lat/long — [Jackson County, OR GIS](https://jcportal.jacksoncountyor.gov/server/rest/services/Infrastruture/TowersAntennas/FeatureServer/2)
  - Verizon community users list AntennaSearch with CellMapper but recommend FCC tower registrations as primary — [Verizon Community](https://community.verizon.com/t5/Mobile-Network-Archive/Where-is-my-tower/m-p/880154)
- **Coverage maps [C]:** the FCC National Broadband Map shows *claimed* coverage, not what a specific tower carries. Cross-check several sources — [ModemGuides](https://www.modemguides.com/blogs/modemguides-blog/cell-tower-infrastructure-map-guide); [Wilson Amplifiers](https://www.wilsonamplifiers.com/blog/finding-cell-tower-locations-the-complete-guide/). T-Mobile's own guide to finding towers — [T-Mobile Dialed In](https://www.t-mobile.com/dialed-in/tips-tricks/5g-tower-locations)
- **Tower-locator sites [C]:** these group FCC records by physical site and color markers by spectrum, but "frequency assignments… do not confirm active 5G service" — [CellTowerLocator](https://celltowerlocatorapp.com/carriers/verizon)
- **Permit filings [A]:** list carrier, equipment models, counts and rad centers. Examples: the Montgomery County, MD Tower Coordinating Group application archive ([AT&T](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2024092327+Application.pdf), [T-Mobile](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2020061185+Application.pdf), [Verizon](https://montgomerycountytfcg.s3.amazonaws.com/Applications/MC2022041731+Application.pdf)); CT Siting Council exempt-modification filings ([example](https://portal.ct.gov/-/media/csc/2_ems-medialibrary/newhaven/wheelerst/att_cing/em-att-093-220414_filing_wheelerst_.pdf)); California CEQA notices for new sites ([new AT&T site](https://ceqanet.lci.ca.gov/2025010674); [Verizon replacement](https://ceqanet.lci.ca.gov/2021070533))

### Inferences
| Tool | Answers | Reliability for carrier ID | Main failure modes |
|---|---|---|---|
| On-site signage (ASR sign, owner sign, carrier RF sticker) | Owner, ASR number, carrier, site number | **High** (when legible) | Missing or faded stickers; leftover stickers from departed tenants (Sprint/Dish) |
| Permit / EFR / CEQA filings | Carrier, equipment models, counts, rad center | **High** for the filed configuration | Dated; agent named instead of carrier; not every jurisdiction publishes online |
| FCC ASR | Structure owner, height, type, coordinates | High for owner/structure; **none** for tenants | Only >200 ft or airport-adjacent structures |
| FCC ULS (microwave) | Which carriers have licensed backhaul at those coordinates | Medium | Fiber-fed sites have no microwave; geographic cellular licenses hide sites |
| CellMapper (map plus wiki photos) | Which carriers' cells are near; rack photos | Medium (map) / Medium-High (wiki photos, if recent) | Calculated locations; sparse sampling; crowd misidentification |
| AntennaSearch / locator sites | Aggregated FCC records near an address | Low-Medium | Stale or erroneous FCC-derived data; licensing ≠ active service |
| Carrier coverage maps / FCC NBM | Claimed coverage | **Low** for site ID | No site-level info |

- **Suggested confirmation workflow for lessons:** read the signs → ASR lookup (owner, height) → permit filing (carrier plus rad center) → ULS microwave at the coordinates → CellMapper walk-around and wiki photos → historical imagery to date changes.

### Gaps
- **Google Street View / Google Earth** reliability (imagery dates, historical imagery, resolution for rack-level ID) was **not researched** because the search budget ran out. Teach learners to check the capture date before drawing conclusions. *This is a general best practice, not sourced here.*
- **AntennaSearch's actual data provenance and update cadence** was not confirmed from its own site.
- **CellMapper's photo-upload terms and moderation** were not found.
- No source found on how many jurisdictions publish permit filings online.

---

## 6. Where can photos for flashcards come from, under what licenses, and how do personal vs shared-app implications differ?

### Takeaway
**Wikimedia Commons** has usable, verified US categories:
- "Mobile phone towers in the United States" (183 files, 5 subcategories)
- "5G towers in the United States" (~15 files, including Link5G)
- Camouflaged towers, including tree disguises
- COW and flagpole examples

**Flickr's license filter** ("Commercial use & mods allowed", "No known copyright restrictions", "U.S. Government works") yields reusable images, but each image's license must be checked.

**Reddit and CellMapper uploads** remain the poster's copyright. Reddit's broad license runs to Reddit, not to you, so reuse needs the photographer's permission. CellMapper's terms were not found.

**US law has no general private-copying exception.** A personal, never-distributed app relies on fair use: private noncommercial use leans favorable but is not automatic. Once the app is shared, use only licensed, public-domain or own photos, with attribution metadata.

### Cited Findings
- **[A for existence/structure] Wikimedia Commons categories (verified via search):**
  - [Category: Mobile phone towers in the United States](https://commons.wikimedia.org/wiki/Category:Mobile_phone_towers_in_the_United_States): 5 subcategories, 183 files, many from Utah, Florida and Wisconsin. Subcategories include Cell towers in Wisconsin, 5G towers in the United States, Link5G towers, and Ocean Breeze cell phone tower.
  - [Category: 5G towers in the United States](https://commons.wikimedia.org/wiki/Category:5G_towers_in_the_United_States): ~15 files, mostly antennas on utility poles, lamp posts and rooftops.
  - Parents and siblings: [Communications towers in the US](https://commons.wikimedia.org/wiki/Category:Communications_towers_in_the_United_States), [Radio masts and towers in the US](https://commons.wikimedia.org/wiki/Category:Radio_masts_and_towers_in_the_United_States), [Antennas in the US](https://commons.wikimedia.org/wiki/Category:Antennas_in_the_United_States), [Mobile phone base stations](https://commons.wikimedia.org/wiki/Category:Mobile_phone_base_stations), [Mobile phone base stations by country](https://commons.wikimedia.org/wiki/Category:Mobile_phone_base_stations_by_country), [Cell towers in Wisconsin](https://commons.wikimedia.org/wiki/Category:Cell_towers_in_Wisconsin), [Air safety markings on towers in the US](https://commons.wikimedia.org/wiki/Category:Air_safety_markings_on_towers_in_the_United_States), [Antenna towers](https://commons.wikimedia.org/wiki/Category:Antenna_towers)
  - Stealth: [Camouflaged antenna towers and masts](https://commons.wikimedia.org/wiki/Category:Camouflaged_antenna_towers_and_masts); [Antenna towers and masts camouflaged as trees](https://commons.wikimedia.org/wiki/Category:Antenna_towers_and_masts_camouflaged_as_trees)
  - Individual files: [Flagpole Monopole Concealed Cell Tower.jpg (Randolph, NJ)](https://commons.wikimedia.org/wiki/File:Flagpole_Monopole_Concealed_Cell_Tower.jpg); [PalmCellTower.jpg (Tucson, 2007)](https://commons.wikimedia.org/wiki/File:PalmCellTower.jpg); [Cell phone tower disguised 2008.jpg (NH evergreen)](https://commons.wikimedia.org/wiki/File:Cell_phone_tower_disguised_2008.jpg); [Cellular on wheels.jpg](https://commons.wikimedia.org/wiki/File:Cellular_on_wheels.jpg); [Camouflaged Microwave Cell Telephone Tower.JPG](https://commons.wikimedia.org/wiki/File:Camouflaged_Microwave_Cell_Telephone_Tower.JPG); [5G cell tower.JPG (Denver)](https://commons.wikimedia.org/wiki/File:5G_cell_tower.JPG)
  - No "Category: Monopines" or dedicated small-cell category surfaced.
- **[B] Flickr:**
  - The license dropdown offers "All creative commons", "Commercial use allowed", "Modifications allowed", "Commercial use & mods allowed", "No known copyright restrictions" and "U.S. Government works".
  - "All creative commons" does **not** guarantee commercial use or modification rights. License details appear under "Additional Info" on each photo page.
  - Sources: [Trevecca library guide](https://library.trevecca.edu/images/creativecommons); [Sacramento State guide](https://csus.libguides.com/images/search-engines); [CUNY open-images guide](https://pressbooks.cuny.edu/studentguideopenimages/?p=42); [VentureBeat](https://venturebeat.com/technology/flickr-becomes-a-free-use-haven-again-with-creative-commons-search-filters)
  - General open-licensing guidance — [NPR Training (2025)](https://www.npr.org/sections/npr-training/2025/05/31/g-s1-66283/open-copyright-how-to-find-images-music-and-audio)
- **[B/C] Reddit:**
  - Users retain ownership and grant Reddit a "worldwide, royalty-free, perpetual, irrevocable, non-exclusive, transferable and sublicensable" license, which reportedly includes AI training.
  - Posters are responsible for having the rights to what they post.
  - Sources: [ConductAtlas summary of the Reddit User Agreement](https://conductatlas.com/platform/reddit/reddit-user-agreement/perpetual-royalty-free-content-license/); [Univ. of Iowa journal (2023 agreement)](https://jgrj.law.uiowa.edu/node/1566). *Secondary sources; verify against the current agreement.*
- **[B] US copyright and private use:**
  - US law does not specify how much may be copied for private or noncommercial purposes — [Salisbury Univ. guide](https://libraryguides.salisbury.edu/copyright/personaluse)
  - Noncommercial personal copies can often fall under fair use — [Family Tree Magazine](https://familytreemagazine.com/photos/now-what-copyright-concerns); [Family Tree Magazine](https://familytreemagazine.com/premium/photos/problems-solved-copy-rights/)
  - Private use is "more likely to be fair" but **not automatically fair**. The US has no dedicated private-use exception, unlike Canada — [ALRC DP 79](https://www.alrc.gov.au/publication/copyright-and-the-digital-economy-dp-79/9-private-and-domestic-use/an-alternative-a-new-confined-exception); [ALRC](https://alrc.gov.au/?p=10384)
  - A 2018 district court held that using an online photo was fair use (a single ruling; check appellate history) — [Engadget](https://www.engadget.com/2018/07/03/us-court-rules-online-photos-fair-use/); [NSU Newsroom](https://nsunews.nova.edu/court-rules-photographs-are-factual-depictions-copying-them-is-fair-use/)
- **[C] CellMapper:** "As all data is user-uploaded…" — [CellMapper FAQ](https://www.cellmapper.net/FAQ). No terms covering photo licensing were found.
- **[A/B] Municipal filings and vendor/carrier material:** cities publish small-cell standards and carrier applications with drawings and mock-ups, e.g. [SLC standards](https://www.slc.gov/engineering/wp-content/uploads/sites/27/2026/03/Small-Cell-Standards-2024-June-Final.pdf), [Andover MA Verizon application](https://andoverma.gov/DocumentCenter/View/11663/10172022-Small-Cell-Wireless-Installation), [NYC Link5G presentation](https://www.nyc.gov/assets/designcommission/downloads/pdf/10-18-2021-pres-DoITT-p-Link-5G.pdf). Federal FirstNet materials are another option — [FirstNet Deployables](https://www.firstnet.gov/sites/default/files/FirstNet_Deployables.pdf)
- **[C, vendor] Own photos:** tower compounds typically post no-trespassing and do-not-climb signs behind perimeter fencing — [Trident Solutions](https://www.tridentproducts.com/cell-tower-safety-identification/)

### Inferences
- **Personal, never-distributed app:**
  - Copying images (including Reddit, CellMapper or press photos) for private study is low-risk in practice and leans toward fair use (noncommercial, private, educational).
  - It is still not *automatically* lawful, since there is no private-copying exception.
  - Cheapest future-proofing: record source URL, author, license and any modifications for every image from day one, even for personal use.
- **Shared later (free or paid):**
  - Every image needs a license that permits redistribution.
  - Use Commons or Flickr images whose license allows it. Prefer "Commercial use & mods allowed" or public-domain filters, because flashcards usually **crop, annotate or label** images (modifications), and a paid app may count as commercial.
  - Attribution must ship with the app (an in-app credits screen per card).
  - Replace Reddit, CellMapper and vendor or carrier press images unless the photographer grants permission. Reddit's license is to Reddit, not to third parties.
- **US federal government works** (Flickr's "U.S. Government works" filter; possibly FirstNet Authority materials) are a likely public-domain source. This needs per-item verification.
- **Municipal filings** are excellent for *drawings* and photo-simulations of carrier designs. Their copyright status varies (often prepared by carriers' consultants), so treat them as reference only, not redistributable, unless verified.
- **The user's own photos** are the most flexible source and can target gaps (owner signs, carrier stickers, confusion pairs). Shoot from public rights-of-way; never enter fenced compounds.
- **Commons coverage is thin** for small cells (~15 files in the 5G category) and carrier-specific racks. Expect to supplement with Flickr CC and the user's own photos.

### Gaps
- **Wikimedia Commons licensing policy** (that only free licenses and public domain are accepted) and per-file licenses for the files listed above were **not verified** (fetch blocked). Check each file page.
- **Creative Commons license-element semantics** (BY, SA, NC, ND; whether crops and annotations count as adaptations; share-alike obligations for annotated cards) were not sourced this session. Verify on creativecommons.org.
- **CellMapper Terms of Service** on photo rights, **vendor/carrier press-image terms**, **YouTube screenshot use**, and **Google Street View / Earth imagery terms** were not found.
- **Copyright status of state and local government documents** (municipal filings) was not researched.
- How many Commons and Flickr images actually show identifiable **carrier-specific** hardware is unknown; manual curation will be needed.
