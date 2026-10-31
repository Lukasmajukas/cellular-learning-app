# US carrier codes (MCC / MNC): DRAFT v1
**As of:** 2026-10-31 · **Built by:** the robot, task T09 · **Status of the whole file:** DRAFT, second-hand source

**What this is (simple words):** Every phone carrier has a two-part number tag: a country number (MCC) and a carrier number (MNC). The USA uses 310, 311, 312, 313, 314 and 316 for the country part. A phone's screen can show this tag, so it tells you who runs a tower. Example: `310-260` means T-Mobile.

**Source for every row below:** Wikipedia, "Mobile network codes in ITU region 3xx (North America)", fetched 2026-10-31. This is a **second-hand** source. The official sources (the ITU list and the US registry) were not reachable in this run, so rows are marked CURRENT only when Wikipedia and the owner's old `bandmon` list agree and it is well known. Everything else is UNVERIFIED until checked against the official list (follow-up task in `TASKS.md`).

**Status words:** CURRENT = in use now. HISTORICAL = used to be, not any more. UNVERIFIED = not checked against an official source.

## The big carriers (what a learner needs first)
| MCC-MNC | Shows as | Who really runs it | Status | Notes |
|---|---|---|---|---|
| 310-260 | T-Mobile | T-Mobile US | CURRENT | The main T-Mobile code. Also used by some resellers (e.g. Mint Mobile). |
| 310-410 | AT&T | AT&T Mobility | CURRENT | The main AT&T code (it used to be Cingular). |
| 311-480 | Verizon | Verizon Wireless | CURRENT | Listed with LTE 700 ("C Block"). Verizon has many other codes (see below). |
| 313-100 | FirstNet | AT&T (for police, fire, ambulance) | UNVERIFIED | AT&T runs FirstNet. Same towers, special priority for first responders. |
| 313-340 | Dish / Boost | Dish Wireless | UNVERIFIED | Wikipedia says operational, 5G 600/1700. Boost Network also appears as 314-800. |
| 311-580 | UScellular | T-Mobile US (bought UScellular's network) | UNVERIFIED | Old UScellular towers now belong to T-Mobile. |
| 310-120 | T-Mobile | T-Mobile US | HISTORICAL | Was Sprint. Sprint is gone: merged into T-Mobile. Wikipedia: not operational. |
| 312-530 | T-Mobile | T-Mobile US | UNVERIFIED | Was Sprint (Sprint's company name was "Sprint Spectrum"). |

## Other codes seen (so nothing surprises you)
| MCC-MNC | Shows as | Who really runs it | Status | Notes |
|---|---|---|---|---|
| 310-004, 310-005, 310-006, 310-010, 310-012, 310-013 | Verizon | Verizon Wireless | UNVERIFIED | Verizon owns many codes (old companies it bought, like Alltel). 310-005 CDMA shut off Dec 2022. |
| 311-270, 311-271 | Verizon | Verizon Wireless | UNVERIFIED | Former Alltel. |
| 310-070, 310-080, 310-090, 310-150, 310-170 | AT&T | AT&T Mobility | UNVERIFIED | Old GSM-era codes (Cingular and others). |
| 310-280 | AT&T | AT&T Mobility | HISTORICAL | Was Centennial Puerto Rico. Wikipedia: not operational. |
| 310-160, 310-200 to 310-310 (several) | T-Mobile | T-Mobile US | HISTORICAL | Old 2G (GSM) codes. T-Mobile's GSM shut down Aug 2026 per Wikipedia. |
| 311-490, 311-870, 311-882, 312-190, 312-250 | T-Mobile | T-Mobile US | UNVERIFIED | Former Sprint or Clearwire codes. 312-250 LTE shut down June 2022. |
| 311-660 | Metro | Metro by T-Mobile | UNVERIFIED | Reseller brand owned by T-Mobile. |
| 310-053 | Virgin Mobile | T-Mobile US | UNVERIFIED | Former Sprint reseller. |
| 311-230 | C Spire | C Spire (Mississippi) | UNVERIFIED | A regional carrier. |
| 311-840, 311-850 | Cellcom | Nsight (Wisconsin) | UNVERIFIED | A regional carrier. |
| 312-670 | FirstNet | AT&T | UNVERIFIED | Another FirstNet code. |

## Corrections to the old `bandmon` list (from `docs/reuse-review.md` §2c)
- **310/120 "Sprint":** right that it is HISTORICAL. Wikipedia shows it as T-Mobile now (not operational).
- **312/530 "Spectrum":** the old list was **wrong**. It is not Charter's Spectrum Mobile. It was Sprint's code and now belongs to T-Mobile. (The old guess in `reuse-review.md` that it was a mix-up with "Sprint Spectrum" was right.)
- **310/280 "AT&T":** HISTORICAL (old Puerto Rico code), not a main AT&T code. 310-410 is the main one.
- **Charter Spectrum Mobile and Comcast Xfinity Mobile:** they are resellers (MVNOs) that ride on Verizon's network, so a phone usually shows a Verizon code. Not found in the Wikipedia table, so no row yet.

## Gotchas worth teaching
- The tag shows who the **phone's plan** is with, not always who owns the tower. A reseller phone shows its host's code.
- Several carriers share towers or buy each other. Use the tag together with the band and cell ID.

## Still to do (follow-up)
1. Check each row against the official ITU list and the US registry (imsiadmin.com): needs those sites allowed or files uploaded.
2. Find Charter, Comcast, Cricket, Visible, US Mobile and Google Fi codes.
3. Re-check every 3 months ("Keep it fresh" level).
