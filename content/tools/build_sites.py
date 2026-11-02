"""Builds content/sites.json (tower and site facts). Run from the repo root:
   python3 content/tools/build_sites.py
Do not edit sites.json by hand: change the rows below and run this again.
Rows come from docs/research/notes/sites_and_carriers.md (grades A/B/C from that note) and the
plan in docs/curriculum/units-6-7.md section 3 (T35 part 2, 2026-11-02).
Rules (decisions F1 to F4):
  - every row has status, as_of and source, like the bands file;
  - only grade A rows may carry numbers (grade B/C rows are for looks and ideas; the checker enforces it);
  - "inference" rows are taught as "very likely", never "always";
  - phone numbers on signs are never stored."""
import json

AS_OF = "2026-11-02"
NOTE = "docs/research/notes/sites_and_carriers.md"
# The research note was built from web-search summaries; the pages below were not opened by us.
S_ASR = f"{NOTE} section 1b: FCC ASR help (https://www.fcc.gov/node/23343), Wikipedia ASR page; pages not opened here"
S_SIGN = f"{NOTE} section 1b: 47 CFR 17.4(g), Kelley Drye advisory, Federal Register 2024-02871; the note says the exact current eCFR wording was not confirmed"
S_FAA = f"{NOTE} section 1b: FAA FAQ (https://www.faa.gov/faq/what-are-requirements-aircraft-warning-lights-tall-structures); page not opened here"
S_TYPES = f"{NOTE} section 1a (macro structures): PTTG, Connecticut Siting Council; looks only"
S_ROOF = f"{NOTE} section 1c (building-mounted sites): ALB law firm, Raycap concealment guide; looks only"
S_STEALTH = f"{NOTE} section 1d: PTTG, BroadbandSearch, local planning codes; looks only"
S_SMALL = f"{NOTE} section 1e: municipal small-cell design standards; looks only"
S_DAS = f"{NOTE} section 1f: telecoms.com, RCR Wireless (2015); pages not opened here"
S_TEMP = f"{NOTE} section 1g: FirstNet Deployables PDF (https://www.firstnet.gov/sites/default/files/FirstNet_Deployables.pdf); not opened here"
S_OWN = f"{NOTE} section 1h (tower owner companies and signage): Inside Towers, Array 8-K, Wilson Amplifiers, ModemGuides"

# (id, kind, grade, text, look, source)
ROWS = [
 ("type:lattice", "type", "C", "A lattice tower is an open steel framework with a wide base and no guy wires.",
  "open criss-cross steel frame, wide at the bottom, narrowing up", S_TYPES),
 ("type:guyed", "type", "C", "A guyed mast is a slim mast held up by cables that run to anchors in the ground, so it needs a big patch of land.",
  "thin mast with long cables slanting to the ground", S_TYPES),
 ("type:monopole", "type", "C", "A monopole is one tapered steel column with the antennas near the top.",
  "a single smooth pole, thicker at the bottom", S_TYPES),
 ("type:rooftop", "type", "C", "A rooftop site puts the antennas on the roof or edge of a building.",
  "antennas on a building edge or roof", S_ROOF),
 ("type:water-tank", "type", "C", "Some sites put the antennas around a water tank, or on a tower beside it.",
  "antennas ringed on a water tank", f"{NOTE} Gaps section: no source found for water-tank designs (only a San Diego water-tower look-alike, section 1c); so UNVERIFIED until one is found"),
 ("type:stealth", "type", "C", "A stealth site hides its antennas inside a disguise, such as a fake tree (monopine), palm (monopalm), flagpole or steeple.",
  "a tree, palm, flagpole or steeple shape that is too tidy to be real", S_STEALTH),
 ("type:small-cell", "type", "B", "A small cell is a small radio on a pole or building, with a canister or shroud up high and a radio box or cabinet lower down. It reaches a small area.",
  "canister or shroud on a street or utility pole, box or cabinet below", S_SMALL),
 ("type:das", "type", "B", "A DAS is many small antennas inside or on a big venue such as a stadium. One system is often shared by several carriers.",
  "small antennas spread around a venue, sometimes behind fake vents", S_DAS),
 ("type:temporary", "type", "A", "A COW is a cell site on a trailer; a COLT is built onto a vehicle. They run on generators and link back by satellite or microwave. FirstNet is AT&T's public-safety network and runs SatCOLTs and SatCOWs.",
  "trailer or truck with a telescoping mast, a generator and a dish", S_TEMP),
 ("rule:asr-200ft", "rule", "A", "A tower taller than 200 ft (60.96 m) above the ground must be registered with the FCC (ASR). A tower near an airport flight path may need it at any height.",
  "", S_ASR),
 ("rule:asr-sign", "rule", "A", "The registration (ASR) number must be posted where the public can see it, near the base of the tower.",
  "", S_SIGN),
 ("rule:faa-marking", "rule", "A", "A structure taller than 200 ft should normally be marked with orange-and-white paint and/or lights, under FAA rules. The FAA can also ask for marking on shorter structures because of where they stand.",
  "", S_FAA),
 ("infer:paint-lights", "inference", "inference", "A tower with orange-and-white paint or warning lights is very likely taller than 200 ft, or near an airport. Plain galvanized steel with no lights is more likely shorter. This is a good guess, not a law.",
  "", f"{NOTE} Inferences section (lesson anchor, marked there as probable, not certain), built on rules rule:asr-200ft and rule:faa-marking"),
 ("sign:rf-warning", "sign", "C", "Signs at the foot of a tower typically include the registration (ASR) sign, a radio-wave (RF) warning sign and a no-trespassing sign.",
  "", f"{NOTE} section 1h: Trident Solutions (vendor); typical, not required everywhere"),
 ("owner:tower-companies", "owner", "B", "Tower companies such as American Tower, Crown Castle, SBA, Vertical Bridge and Array own many towers and rent space on them to the carriers. The owner and the carrier are often not the same company.",
  "", S_OWN),
 ("owner:noc", "owner", "C", "A sign at a tower base can give a phone number for problems. That number belongs to the owner of the structure, not always to the carrier on it.",
  "", S_OWN),
 ("evidence:order", "rule", "C", "When working out who runs a site, the carrier's own sticker counts most and the equipment brand counts least.",
  "", "docs/PRD.md section 4 (chain of evidence); app design rule, not a public fact"),
]

# no source yet: the checker stops questions from resting on these
UNVERIFIED = {"type:water-tank"}


def main():
    rows = []
    for rid, kind, grade, text, look, source in ROWS:
        status = "UNVERIFIED" if rid in UNVERIFIED else "CURRENT"
        row = {"id": rid, "kind": kind, "grade": grade, "text": text, "status": status,
               "as_of": AS_OF, "source": source}
        if look:
            row["look"] = look
        rows.append(row)
    out = {"as_of": AS_OF, "sites": rows}
    with open("content/sites.json", "w", encoding="utf-8") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"Wrote content/sites.json with {len(rows)} rows.")


if __name__ == "__main__":
    main()
