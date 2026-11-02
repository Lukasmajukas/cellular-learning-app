"""Builds content/hardware.json (tower hardware facts for unit 8). Run from the repo root:
   python3 content/tools/build_hardware.py
Do not edit hardware.json by hand: change the rows below and run this again.
Rows come from docs/research/notes/vendors_and_cells.md (questions 2 and 3) and the plan in
docs/curriculum/units-8-9.md section 3 (T36 part 2, 2026-11-02). The research note was built from
web-search summaries; the pages and filings named below were not opened by us.
Rules (decisions G1, G2, G7):
  - every row has status, as_of and source, like the bands file;
  - grade says how strong the source is: P = official filing or datasheet, T = trade press,
    W = reseller or web page, inference = our own reading (taught as "usually", never "always");
  - quiz: False means the row may be taught but never asked as a question (weights, unverified rules);
  - colours, fins and logos are left out on purpose (no source)."""
import json

AS_OF = "2026-11-02"
NOTE = "docs/research/notes/vendors_and_cells.md"
S_PANEL = f"{NOTE} question 3: The Antenna Farm (SBNHH-1D65C, NNHH-65C-R4 listings), Argus/CommScope model-number chart (Scribd); resellers, pages not opened here"
S_RRH = f"{NOTE} question 3: fccid.io / device.report (Samsung RF4440d-13A, FCC ID A3LRF4440D-13A), Ericsson Radio 4449 overview; pages not opened here"
S_AAU = f"{NOTE} question 3: Montgomery County MD filings (AIR 6449 B77D), fccid.io VBNAEHC-01 (Nokia AEHC), CT Griswold filing (Samsung MT6407-77A), Telecoms.com (AIR 3268); pages not opened here"
S_AIR = f"{NOTE} question 2: Montgomery County MD filings MC2020061185, MC2021011358, MC2021061469 (Ericsson AIR 6449 B41 / B77D); fccid.io TA8AKRD901206; pages not opened here"
S_RADIO = f"{NOTE} question 2: Ericsson Radio 4449 overview, RRUS 4449 B5/B12 spec sheet, CT Sterling filing (Radio 4480 B71+B85, RRUS 8843 B2 B66A); pages not opened here"
S_NOKIA = f"{NOTE} question 2: fccid.io VBNAEHC-01, Nokia Massive MIMO Adaptive Antenna Product Description; pages not opened here"
S_SAMSUNG = f"{NOTE} question 2: Montgomery County MC2022051756, CT Griswold filing em-ver-058-211018 (Samsung MT6407-77A, RF4440d-13A); pages not opened here"
S_TMO = f"{NOTE} question 2: Montgomery County MD filings MC2021011358, MC2021061469, MC2021111611, MC2020101317 (T-Mobile, AIR 6449 B41); pages not opened here"
S_CT4480 = f"{NOTE} question 2: CT Sterling T-Mobile tower-share notice (Radio 4480 B71+B85); the AT&T Clinton notice is ambiguous and is not used; page not opened here"
S_WEIGHT = f"{NOTE} question 3: The Mobile Network (AIR 6468), Nokia (Habrok 64, 24 kg), Telecoms.com (AIR 3268, 12 kg); one reseller says 46 kg for the B41 AIR 6449, which conflicts with the filings (35 to 38 kg)"
S_ORDER = "docs/PRD.md section 4 (chain of evidence); app design rule, not a public fact"
S_SAMS_HYP = f"{NOTE} question 2 inference only: the -77A and -13A endings are our reading of two Samsung names; no Samsung document explains them"

# (id, kind, grade, text, source, extras)
# extras: quiz=False (taught, never asked); status="UNVERIFIED"
ROWS = [
 ("form:passive-panel", "form", "W", "A passive panel antenna is a tall plastic cover with no electronics inside. Its cable connectors sit in a row at the bottom.", S_PANEL, {}),
 ("form:radio-unit", "form", "P", "A radio unit (RRU or RRH, a remote radio head) is a small box that makes the signal. Short cables, called jumpers, link it to the connectors of a passive panel.", S_RRH, {}),
 ("form:massive-mimo", "form", "P", "A massive MIMO box has the radio and a big array of small antennas (about 128 to 192) in one box. It usually has no jumpers to a separate panel. These boxes serve fast mid-band (TDD) spectrum such as n41, n77 and CBRS.", S_AAU, {}),
 ("form:massive-mimo-pole", "form", "P", "Massive MIMO boxes often sit on their own support pipe next to the passive panels of the same sector.", f"{NOTE} question 3: Montgomery County MC2021061469 (AIR 6449 B41 installed on new support pipes for sectors 2 and 3); page not opened here", {}),
 ("ports:hexport", "ports", "W", "A hexport panel (like the SBNHH) has 6 connectors. We have not checked how they split between low and mid band.", S_PANEL, {}),
 ("ports:nnhh", "ports", "W", "An NNHH panel has 8 connectors: 4 for low band and 4 for mid band.", S_PANEL, {}),
 ("ports:ntnr", "ports", "inference", "A band that works as 4T4R needs 4 antenna ports, so counting a band's ports usually tells you its T and R number. This is a good guess from how the panels are built, not a law.", f"{NOTE} question 3 (inference from the panel and radio listings above)", {}),
 ("ports:panel-length", "ports", "W", "In a CommScope panel name, the last letter is the length: A is 1.3 m, B is 2.0 m and C is 2.6 m. In the band letters, N means 698 to 896 MHz and H means 1710 to 2180 MHz.", S_PANEL, {}),
 ("model:air-64xx", "model", "inference", "Ericsson's AIR means Antenna Integrated Radio. The first two digits of the model number usually match the radio paths: AIR 6449 has 64 (64T64R) and AIR 3268 has 32. This is a pattern in the examples we found, not a law.", f"{S_AAU}; the 'first two digits' rule is our reading of the AIR 6449, AIR 6419 and AIR 3268 examples", {}),
 ("model:air-suffix", "model", "P", "The ending of an Ericsson AIR name shows the band: B41 is 2.5 GHz (2496 to 2690 MHz), B77D is C-band (3700 to 3980 MHz) and B48 is CBRS.", S_AIR, {}),
 ("model:radio-dual", "model", "P", "A dual-band Ericsson radio lists both bands in its name, such as Radio 4449 B5/B13 or Radio 4480 B71+B85.", S_RADIO, {}),
 ("model:nokia-aehc", "model", "P", "Nokia's AEHC is the AirScale MAA 64T64R 192AE B41: a 64T64R massive MIMO box for band 41.", S_NOKIA, {}),
 ("model:samsung-suffix", "model", "inference", "Samsung names may end in the band: -77A for n77 and -13A for band 13. This is only our guess from two examples.", S_SAMS_HYP, {"status": "UNVERIFIED"}),
 ("use:air6449-b41-tmobile", "use", "P", "T-Mobile's filings list the Ericsson AIR 6449 B41, so it is a T-Mobile n41 (2.5 GHz) radio.", S_TMO, {}),
 ("use:air6449-b77d-attvz", "use", "P", "The Ericsson AIR 6449 B77D is a C-band radio. AT&T is named in its filings. Verizon's C-band uses Samsung boxes in the filings we found.", S_AIR, {}),
 ("use:samsung-verizon", "use", "P", "Verizon's filings list the Samsung MT6407-77A (a 64T64R C-band all-in-one) and the Samsung RF4440d-13A (a 700/850 MHz radio).", S_SAMSUNG, {}),
 ("use:4480-b71-b85", "use", "P", "A T-Mobile tower-share notice lists the Ericsson Radio 4480 B71+B85, a dual-band radio that includes the 600 MHz band 71.", S_CT4480, {}),
 ("weight:massive-mimo", "weight", "T", "Massive MIMO boxes have got lighter with each generation. Very roughly, a big one is about 25 to 40 kg and a small one about 12 kg. Sources disagree on exact weights.", S_WEIGHT, {"quiz": False}),
 ("evidence:brand-weakest", "rule", "inference", "A radio's model name usually tells you what the box is, but not always who runs it. The carrier's own sticker counts most and the equipment brand counts least.", S_ORDER, {}),
]


def main():
    rows = []
    for rid, kind, grade, text, source, extra in ROWS:
        row = {"id": rid, "kind": kind, "grade": grade, "text": text,
               "status": extra.get("status", "CURRENT"), "as_of": AS_OF, "source": source}
        if extra.get("quiz") is False:
            row["quiz"] = False
        rows.append(row)
    with open("content/hardware.json", "w", encoding="utf-8") as f:
        json.dump({"as_of": AS_OF, "hardware": rows}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"Wrote content/hardware.json with {len(rows)} rows.")


if __name__ == "__main__":
    main()
