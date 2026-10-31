# Copyright-free photo sources, by lesson topic (T08)

**Checked:** 2026-10-31 by a robot run. **Status of every row: UNVERIFIED at file level.** I checked that each place exists and what it holds. I did **not** check the licence of any single photo. Do that when a photo is picked (see "Rules for picking a photo").

## In simple words
Photos you may copy have a "licence", like a sticker saying what you're allowed to do. Wikimedia Commons is the best free library for this. It has lots of cell-tower photos, but almost none that show which **brand** of radio is on the tower. For brands, we will need to draw diagrams or take our own photos later.

## Rules for picking a photo
1. Open the photo's own page. Read its licence line. Allowed: **Public domain, CC0, CC BY, CC BY-SA**. Not allowed: anything **NC** (non-commercial) or **ND** (no changes) or "all rights reserved". We crop and add arrows, and we may share the app one day.
2. Write down in the lesson data: file name, link, photographer, licence, date checked. CC BY and CC BY-SA need the photographer's credit shown in the app. CC BY-SA also means a changed copy must keep the same licence.
3. Never use AI-generated photos for "identify this" questions (CLAUDE.md).
4. Check what's in the picture: a visible logo or a person's face can be a problem later. Prefer shots with neither.
5. Only the photo's own page is the truth. The category pages below only tell us where to look.

## The sources
| Source | What it is | Licences | Credit needed? | Use |
|---|---|---|---|---|
| **Wikimedia Commons** (commons.wikimedia.org) | Free photo library behind Wikipedia | Each photo has its own: mostly CC BY, CC BY-SA, CC0, public domain | Yes, except CC0 / public domain | Main source |
| **Flickr, Creative Commons only** (flickr.com/creativecommons) | Photographers' albums. Offers CC BY, BY-SA, BY-NC, BY-ND, CC0 and Public Domain Mark | Filter to **CC0, Public Domain Mark, CC BY, CC BY-SA** only | Yes, except CC0 / PDM | Second choice. Individual photos can be mislabelled; ask the owner to confirm |
| **Pixabay** (pixabay.com) | Free stock photos | Pixabay licence: free, may be edited, no credit needed. No selling unchanged copies, and no recognisable brands for commercial use. Source: [licence summary](https://pixabay.com/service/license-summary/) | No | Generic shots only. Fine for a personal app, weaker if we ever share it |
| **Openverse** (openverse.org) | Search engine over many free-image sites | Mixed. I could not open its About page (403), so the details are unchecked | Depends | Use only to find candidates, then check at the original page |
| **US government works** (FCC, NTIA, NASA, state agencies) | Photos and drawings made by federal staff are public domain in the US | Public domain, but a photo credited to a contractor may not be | No | Possible for the "who regulates this" parts. Nothing found yet |
| **Photos taken by the owner** | Future local field trips (T10, South Hadley) | Owner owns them | No | Best for the "Local field trip" unit. Faces and licence plates out of frame |
| **Claude-drawn diagrams** | SVG drawings made in this project | Ours | No | For anything with no free photo (hardware brands, sector layouts, spectrum rulers) |

**Not used:** Google Images, Reddit, CellMapper and carrier or vendor press photos. They are not licensed for reuse. (`learning_design.md` notes that CellMapper's photo terms were never confirmed.)

## Where to look, by lesson unit
Counts are the numbers shown on the Commons category pages on 2026-10-31. They change.

| Unit | What the photos should show | Where to look | Coverage |
|---|---|---|---|
| 1. Spectrum ruler | A ruler of frequencies | Claude-drawn diagram. Commons has `Category:Radio spectrum` (31 files, 7 subcategories) for reference only | Draw it |
| 2–5. Bands and who uses them | These are numbers, not objects | Claude-drawn charts and carrier-colour tables. No photos needed | Draw it |
| 6. Site types, general | Towers, rooftop sites, fake trees, small cells | `Category:Mobile phone base stations` (323 files, 8 subcategories). `Category:Antenna towers` (17 subcategories) | Good |
| 6. In the US | US cell sites | `Category:Mobile phone base stations in the United States` (10 files, 1 subcategory) → `Mobile phone towers in the United States` (208 files; subcategories: Cell towers in Wisconsin 174, 5G towers in the United States 17, Link5G towers 11, Mariani Water Tower 4, Ocean Breeze cell phone tower 5, Yakima Summitview Avenue SBA Cellphone Tower 2) | Good |
| 6. Monopole / lattice / guyed | Tower shapes | `Category:Guyed masts` (113 files, 47 subcategories). `Category:Lattice towers` (32 files). I did not find a "Monopoles" category: search inside the US category instead | Guyed, lattice good. Monopole: search needed |
| 6. Fake trees ("monopines") | Disguised sites | `Category:Camouflaged antenna towers and masts` (19 files). `Category:Antenna towers and masts camouflaged as trees` (82 files). `Category:Cell base station camouflaged as palm tree` (31 files) | Good (many are not US) |
| 6. Rooftops | Antennas on buildings | `Category:Rooftop antenna towers` (20 files; subcategories for big-city buildings, which are broadcast masts, not typical cell sites) | Fair |
| 6. Water tanks | Antennas on water towers (South Hadley has two) | In US category: `Mariani Water Tower`; files like "Hillsdale Dr Mckinney Texas Water tower AT&T mobile Station.jpg" | Few, but some |
| 6. Small cells | Street-pole and lamp-post radios | No dedicated category. Files named in the 5G and US categories: "Utility pole with Verizon 5G mmwave antennas - Arlington, MA.jpg", "Small Lamp Post Cellular Antennas in Downtown Minneapolis (39901018892).jpg", "Small Cell Lake Forest Dr McKinney, Texas.jpg", "5G Small Cell Antennas on Pittsburgh Rooftop (48172678597).jpg" | Few. Check each licence |
| 6. Portable sites | Cell on wheels (COW) | `Category:Vehicle-mounted mobile phone base stations` (159 files, mostly outside the US). "Verizon Cell on Wheels (COW).jpg" is in the US category | Good |
| 7. Reading a site | Signs, stickers, height lights, fences | I found no Commons category for warning signs or site labels (my guessed names did not exist). Plan: owner's own photos later, or Claude-drawn mock-ups | **Gap** |
| 8. Hardware | Antenna panels, remote radio units, vendor brands (Ericsson, Nokia, Samsung, Huawei) | `Category:Ericsson` has only a few unrelated photos. A Commons search for Nokia AirScale, Huawei AAU and Ericsson Radio returned **only scanned documents, no equipment photos**. Vendor press photos are not free | **Big gap** |
| 9. Cell IDs | Numbers on a phone screen | Claude-drawn mock-up screens. The reuse review says bandmon has a real iPhone recording to learn from (`docs/reuse-review.md`) | Draw it |
| 10. Final challenge | A mix of all above | Reuse the photos picked for units 6–8 | Depends on 6–8 |

## Gaps and what to do about them
1. **Vendor-brand photos (unit 8)** are the main problem, and the project's goal needs them. Ways around it, best first:
   - The owner takes photos on field trips (South Hadley, T10) and checks the brand from the equipment labels.
   - Claude draws look-alike diagrams of each radio shape, labelled "drawing, not a photo".
   - Search Flickr's CC0/CC BY filter for "Ericsson AIR", "Nokia AirScale", and so on. I did not do this: it needs the Flickr search page, which is a later chunk of work.
2. **Sign and label photos (unit 7):** same two fixes (owner's photos or drawings).
3. **Monopole shapes:** need a search inside the US category, picking by eye.

## Suggested next steps
- The plan (T04) should decide how big the photo bank must be, and whether unit 8 starts with drawings.
- A later Medium task: pick and license-check 2–4 candidate photos per topic from the places above, into a `content/` credits file. That belongs after the plan is signed off.
