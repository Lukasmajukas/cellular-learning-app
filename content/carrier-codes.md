# US carrier codes (MCC / MNC): DRAFT v2
**As of:** 2026-11-01 (checked against the US registry) · **Built by:** the robot, tasks T09 (v1) and T27 (check) · **Status of the whole file:** DRAFT until the ITU list is also checked

**What this is (simple words):** Every phone carrier has a two-part number tag: a country number (MCC) and a carrier number (MNC). The USA uses 310, 311, 312, 313, 314 and 316 for the country part. A phone's screen can show this tag, so it tells you who runs a tower. Example: `310-260` means T-Mobile.

**Sources:**
- **US registry (official):** the ATIS "HNI Assignments" table on imsiadmin.com (https://imsiadmin.com/assignments/hni/), fetched 2026-11-01. ATIS is the group that hands out US codes. 558 codes were listed. It says **which company holds each code**. It does **not** say whether the code is in use today, and it lists the company's legal name, not the brand on your phone.
- **Wikipedia** "Mobile network codes in ITU region 3xx (North America)", fetched 2026-10-31: second-hand. Used for "in use or not" and for brand names.
- **Not checked:** the ITU list (its page said "publication not available" on 2026-11-01). Needs a downloaded copy.

**How the T27 check changed the rows:** a row is CURRENT when the US registry shows the code held by the company named in "Who really runs it" and nothing says it is dead. A row stays UNVERIFIED when the registry can't confirm it (code missing from the registry, or the registry names a different company). HISTORICAL rows stay HISTORICAL (the registry shows who holds the code, not that it's switched on).

**Status words:** CURRENT = in use now (and held by that company per the US registry). HISTORICAL = used to be, not any more. UNVERIFIED = not checked against an official source.

## The big carriers (what a learner needs first)
| MCC-MNC | Shows as | Who really runs it | Status | Notes |
|---|---|---|---|---|
| 310-260 | T-Mobile | T-Mobile US | CURRENT | Registry: T-Mobile USA ✔. The main T-Mobile code. Also used by some resellers (e.g. Mint Mobile). |
| 310-410 | AT&T | AT&T Mobility | CURRENT | Registry: AT&T Mobility ✔. The main AT&T code (it used to be Cingular). |
| 311-480 | Verizon | Verizon Wireless | CURRENT | Registry: Verizon Wireless ✔. Listed with LTE 700 ("C Block"). Verizon has many other codes (see below). |
| 313-100 | FirstNet | AT&T (for police, fire, ambulance) | CURRENT | Registry: AT&T FirstNet ✔ (313-100 to 313-140 are all FirstNet). AT&T runs FirstNet. Same towers, special priority for first responders. |
| 313-340 | Dish / Boost | Dish Wireless | CURRENT | Registry: Dish Network ✔ (also 313-350, 313-360, 311-200 "Dish Wireless"). Wikipedia says operational, 5G 600/1700. Boost Network also appears as 314-800 (registry: Boost Network ✔). |
| 311-580 | UScellular | T-Mobile US (bought UScellular's network) | CURRENT | Registry: T-Mobile USA ✔ (not UScellular: the code changed hands). Old UScellular towers now belong to T-Mobile. |
| 310-120 | T-Mobile | T-Mobile US | HISTORICAL | Registry: T-Mobile USA ✔ (still assigned). Was Sprint. Sprint is gone: merged into T-Mobile. Wikipedia: not operational. |
| 312-530 | T-Mobile | T-Mobile US | CURRENT | Registry: T-Mobile USA ✔ (so it is **not** Charter's Spectrum). Was Sprint (Sprint's company name was "Sprint Spectrum"). |

## Other codes seen (so nothing surprises you)
| MCC-MNC | Shows as | Who really runs it | Status | Notes |
|---|---|---|---|---|
| 310-010, 310-012, 310-013 | Verizon | Verizon Wireless | CURRENT | Registry: Verizon Wireless ✔ (Verizon holds dozens of codes, e.g. 311-480 to 311-489, 310-590 to 310-599, 310-890 to 310-899). |
| 310-004, 310-005, 310-006 | Verizon | Verizon Wireless | UNVERIFIED | **Not in the US registry**, so the registry can't confirm them. Wikipedia says Verizon. 310-005 CDMA shut off Dec 2022. |
| 311-270, 311-271 | Verizon | Verizon Wireless | CURRENT | Registry: Verizon Wireless ✔. Former Alltel. |
| 310-070, 310-080, 310-090, 310-150, 310-170 | AT&T | AT&T Mobility | CURRENT | Registry: AT&T Mobility ✔. Old GSM-era codes (Cingular and others). |
| 310-280 | AT&T | AT&T Mobility | HISTORICAL | Registry: AT&T Mobility (still assigned). Was Centennial Puerto Rico. Wikipedia: not operational. |
| 310-160, 310-200 to 310-310 (several) | T-Mobile | T-Mobile US | HISTORICAL | Registry: T-Mobile USA for 160, 200, 210, 220, 230, 240, 250, 270, 310 ✔; **310-300 was returned in 2017** (no longer assigned). Old 2G (GSM) codes. T-Mobile's GSM shut down Aug 2026 per Wikipedia. |
| 311-490, 311-870, 311-882, 312-190 | T-Mobile | T-Mobile US | CURRENT | Registry: T-Mobile USA ✔. Former Sprint or Clearwire codes. |
| 312-250 | T-Mobile | T-Mobile US | UNVERIFIED | Registry: T-Mobile USA ✔ (holder only). Wikipedia says its LTE shut down June 2022, so "in use" is doubtful. |
| 310-660, 310-800 | T-Mobile | T-Mobile US | UNVERIFIED | New in T27: registry lists both as T-Mobile USA. Not yet checked for use. |
| 311-660 | Metro | Metro by T-Mobile | CURRENT | Registry: "MetroPCS Wireless, Inc" ✔ (Metro's old company name). Reseller brand owned by T-Mobile. |
| 310-053 | Virgin Mobile | T-Mobile US | UNVERIFIED | **Not in the US registry**, so the registry can't confirm it. Former Sprint reseller (Wikipedia). |
| 311-230 | C Spire | C Spire (Mississippi) | CURRENT | Registry: Cellular South, Inc. dba C Spire ✔ (also 311-630, 314-400). A regional carrier. |
| 311-840, 311-850 | Cellcom | Nsight (Wisconsin) | CURRENT | Registry: Nsight ✔ (also 310-510; 310-600 is "NewCell dba Cellcom"). A regional carrier. |
| 312-670 | FirstNet | AT&T | UNVERIFIED | Registry lists **AT&T Mobility**, not FirstNet, so the FirstNet label rests on Wikipedia only. The AT&T part is confirmed ✔. |

## New in T27: codes the registry showed for the follow-up list
All UNVERIFIED for "what is it used for". The registry only names the holder.
| MCC-MNC | Registry holder (legal name) | Brand link | Status | Notes |
|---|---|---|---|---|
| 314-680 | Comcast OTR1, LLC | Comcast (Xfinity Mobile is a reseller on Verizon, so phones usually show Verizon) | UNVERIFIED | Comcast holds its own code, but what it is used for isn't stated. |
| 313-450, 314-020 | Spectrum Wireless Holdings, LLC | Probably Charter's Spectrum Mobile | UNVERIFIED | The registry doesn't say "Charter". 312-850 is "Onvoy Spectrum", a different company. |
| 312-580 | Google, LLC | Google (Fi) | UNVERIFIED | Google holds its own code. Not stated what for. |
| 314-800 | Boost Network | Boost | UNVERIFIED | Matches the Boost note under 313-340. Not checked for use. |

**Cricket, Visible, Mint and US Mobile have no code of their own in the registry.** That fits the rule below: resellers show their host's code.

## Corrections to the old `bandmon` list (from `docs/reuse-review.md` §2c)
- **310/120 "Sprint":** right that it is HISTORICAL. The registry shows it held by T-Mobile USA (not operational per Wikipedia).
- **312/530 "Spectrum":** the old list was **wrong** (now confirmed by the registry: T-Mobile USA). It is not Charter's Spectrum Mobile. It was Sprint's code and now belongs to T-Mobile. (The old guess in `reuse-review.md` that it was a mix-up with "Sprint Spectrum" was right.)
- **310/280 "AT&T":** HISTORICAL (old Puerto Rico code), not a main AT&T code. 310-410 is the main one.
- **Charter Spectrum Mobile and Comcast Xfinity Mobile:** they are resellers (MVNOs) that ride on Verizon's network, so a phone usually shows a Verizon code. Not found in the Wikipedia table, so no row yet.

## Gotchas worth teaching
- The tag shows who the **phone's plan** is with, not always who owns the tower. A reseller phone shows its host's code.
- Several carriers share towers or buy each other. Use the tag together with the band and cell ID.

## Still to do (follow-up)
1. ~~Check against the US registry (imsiadmin.com).~~ Done 2026-11-01 (T27). Still open: the ITU list (needs a downloaded copy from the owner or itu.int allowed).
2. Find out what Spectrum Wireless Holdings, Comcast OTR1 and Google LLC codes are used for (the registry only gives the holder). Reseller hosts for Cricket, Visible, Mint, US Mobile need a source.
3. Check use-today for 310-660, 310-800, 312-250 and the 4 codes missing from the registry (310-004, 005, 006, 053).
4. Re-check every 3 months ("Keep it fresh" level).
