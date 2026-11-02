"""Builds content/cell-ids.json (cell types and ID facts for unit 9). Run from the repo root:
   python3 content/tools/build_cell_ids.py
Do not edit cell-ids.json by hand: change the rows below and run this again.
Rows come from docs/research/notes/vendors_and_cells.md (questions 4, 5 and 6) and the plan in
docs/curriculum/units-8-9.md section 3 (T36 part 2, 2026-11-02). The research note was built from
web-search summaries; the pages named below were not opened by us.
Rules (decisions G3 to G6):
  - every row has status, as_of and source, like the bands file;
  - grade: P = standard or filing, T = trade press, W = web page, C = community forum post,
    inference = our own reading, gap = a stated 'not found';
  - quiz: False means the row may be taught but never asked as a question; the checker forces this
    for every grade C row (decision G3: forum patterns are never quizzed);
  - 'values' hold plain numbers that a test recomputes or compares with bands.json;
  - only B12, B13, B66, B71 channel ranges are CURRENT until T07 checks the rest (decision G5)."""
import json

AS_OF = "2026-11-02"
NOTE = "docs/research/notes/vendors_and_cells.md"
S_CLASS = f"{NOTE} question 4: Techplayon LTE and NR base-station classes, ScienceDirect overview; pages not opened here"
S_SECT = f"{NOTE} question 4: Montgomery County filing MC2021061469 (sectors numbered), MIT cellular numerology page; pages not opened here"
S_ECI = f"{NOTE} question 5: US Patent 8346280 (20-bit eNB ID, 8-bit cell), HowardForums 'LTE sectors' (ECI = eNB x 256 + sector); pages not opened here"
S_PCI = f"{NOTE} question 5: MIT cellular numerology page, Cellfire app on GitHub (PCI 0 to 503); pages not opened here"
S_EARFCN = f"{NOTE} question 5: 3GPP TS 36.101 Table 5.7.3-1 as copied by Halberd Bastion, Electronics Notes, CableFree, Wikipedia LTE frequency bands, celltowers.ca; the ranges also match content/bands.json (a test checks); not yet compared with 3GPP itself (T07)"
S_NCI = f"{NOTE} question 5: Techplayon NR cell global identity planning, 5G-Tools NCI calculator, arXiv 2506.12461; pages not opened here"
S_GAP = f"{NOTE} question 5 gaps: no source found for any US carrier's gNB ID length (UK examples exist only as community posts)"
S_NRARFCN = f"{NOTE} question 5: 3GLTEInfo, nrarfcn on PyPI (3GPP TS 38.104 section 5.4.2.1); concept only; pages not opened here"
S_VZ = f"{NOTE} question 5: S4GRU posts (Trip) and HowardForums Verizon B2 PCS thread; forum posts only, two agree; may have changed"
S_TMO = f"{NOTE} question 5: S4GRU 'How to Identify T-Mobile network equipment (Nokia Networks)'; one forum post with stated exceptions; may have changed"
S_VENDOR = f"{NOTE} question 5: HowardForums 'who is the vendor of this cell equipment' (CellMapper and LTE Discovery 'just make a best guess'); forum post"
S_IPHONE = f"{NOTE} question 6: iTechGuides, FindCellID, UberSignal, Wilson (iPhone Field Test); web guides, not tried on a real phone by us"
S_ANDROID = f"{NOTE} question 6: HiCellTek EARFCN guide, XDA ServiceMode threads; web and forum posts, not tried by us"
S_NOT3GPP = f"{NOTE} question 5 (PCI range for 5G not covered); the value 0 to 1007 is a 3GPP standard figure we recalled and did not source, so it stays UNVERIFIED until T07"
S_OTHER = f"{NOTE} question 5 gaps: EARFCN ranges for B2, B4, B5, B14, B17, B25, B30, B41 and B48 were not sourced; verify against 3GPP (T07)"

# (id, kind, grade, text, source, extras)
# extras: quiz=False, status="UNVERIFIED", values={...}
ROWS = [
 ("cls:classes", "cls", "P", "Cells come in size classes, from widest to smallest: macro (wide area, on towers above the rooftops), micro (medium range, below the rooftops), pico (local area, such as inside a mall) and femto (home). Home cells exist only in LTE, not in 5G.", S_CLASS, {}),
 ("cls:sectors", "cls", "inference", "A site usually has 3 sectors, each facing about a third of a circle. Each band on each sector is its own cell, so the number of cells is roughly the number of sectors times the number of bands. This is a good rule of thumb, not a law.", S_SECT, {}),
 ("lte:eci", "lte", "P", "An LTE cell number (the ECI) is 28 bits: 20 bits are the tower (eNB) number and 8 bits are the cell number. So ECI = eNB x 256 + cell, and eNB = ECI divided by 256 (rounded down).", S_ECI, {"values": {"eci_bits": 28, "enb_bits": 20, "cell_bits": 8, "multiplier": 256}}),
 ("lte:pci", "lte", "P", "An LTE PCI (physical cell ID) is a number from 0 to 503. Cells reuse PCIs, so a PCI tells you neither the site nor the band.", S_PCI, {"values": {"pci_low": 0, "pci_high": 503}}),
 ("lte:earfcn-formula", "lte", "P", "A channel number (EARFCN) gives the exact frequency: the downlink frequency in MHz = the band's lowest downlink frequency + 0.1 x (channel number - the band's first channel number).", S_EARFCN, {}),
 ("lte:earfcn-b12", "lte", "P", "Band 12 downlink channel numbers run from 5010 to 5179 (729 to 746 MHz).", S_EARFCN, {"values": {"band": "B12", "n_low": 5010, "n_high": 5179}}),
 ("lte:earfcn-b13", "lte", "P", "Band 13 downlink channel numbers run from 5180 to 5279 (746 to 756 MHz).", S_EARFCN, {"values": {"band": "B13", "n_low": 5180, "n_high": 5279}}),
 ("lte:earfcn-b66", "lte", "P", "Band 66 downlink channel numbers run from 66436 to 67335 (2110 to 2200 MHz).", S_EARFCN, {"values": {"band": "B66", "n_low": 66436, "n_high": 67335}}),
 ("lte:earfcn-b71", "lte", "P", "Band 71 downlink channel numbers run from 68586 to 68935 (617 to 652 MHz).", S_EARFCN, {"values": {"band": "B71", "n_low": 68586, "n_high": 68935}}),
 ("lte:earfcn-other", "lte", "gap", "Channel number ranges for the other US LTE bands (B2, B4, B5, B14, B17, B25, B30, B41, B48).", S_OTHER, {"status": "UNVERIFIED"}),
 ("nr:nci", "nr", "P", "A 5G cell number (the NCI) is 36 bits. The first 22 to 32 bits are the tower (gNB) number and the rest are the cell number. The screen does not say where the split is, so a drill always states the bit length.", S_NCI, {"values": {"nci_bits": 36, "gnb_bits_low": 22, "gnb_bits_high": 32}}),
 ("nr:gnb-length-unknown", "nr", "gap", "We did not find how many bits any US carrier uses for the tower number in 5G. The same 5G cell number decodes to two different sites if you assume two different lengths.", S_GAP, {}),
 ("nr:pci", "nr", "gap", "A 5G PCI is a number from 0 to 1007.", S_NOT3GPP, {"status": "UNVERIFIED"}),
 ("nr:arfcn", "nr", "P", "A 5G channel number (NR-ARFCN) also maps to an exact frequency, by one global formula with a fixed step size. Learners only need the idea, not the formula.", S_NRARFCN, {}),
 ("us:verizon-pattern", "us", "C", "Community pattern, may have changed: on Verizon, the tens digit of the LTE cell number often shows the sector and the ones digit shows the layer (for example 1, 2 and 3 are often 700 MHz).", S_VZ, {"quiz": False}),
 ("us:tmobile-pattern", "us", "C", "Community pattern, may have changed: T-Mobile cell numbers often group by band, such as band 66 in 1 to 10, band 2 in 11 to 20 and band 71 in 61 to 70, with exceptions.", S_TMO, {"quiz": False}),
 ("us:vendor-from-id", "us", "C", "A vendor name that a map app shows next to a cell number is a guess from the number's pattern, so do not trust it.", S_VENDOR, {"quiz": False}),
 ("tool:field-test-iphone", "tool", "W", "On many iPhones, dialling a Field Test code opens a hidden test screen that shows the cell number and PCI. The menus differ by iOS version and phone, so yours may look different.", S_IPHONE, {}),
 ("tool:android-4636", "tool", "W", "On many Android phones, a hidden test code shows the channel number (EARFCN) next to the serving cell. Some phones block it or show other screens.", S_ANDROID, {}),
]


def main():
    rows = []
    for rid, kind, grade, text, source, extra in ROWS:
        row = {"id": rid, "kind": kind, "grade": grade, "text": text,
               "status": extra.get("status", "CURRENT"), "as_of": AS_OF, "source": source}
        if extra.get("quiz") is False:
            row["quiz"] = False
        if extra.get("values"):
            row["values"] = extra["values"]
        rows.append(row)
    with open("content/cell-ids.json", "w", encoding="utf-8") as f:
        json.dump({"as_of": AS_OF, "cell_ids": rows}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"Wrote content/cell-ids.json with {len(rows)} rows.")


if __name__ == "__main__":
    main()
