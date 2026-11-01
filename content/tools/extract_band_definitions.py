"""Turns tables A-E of docs/research/notes/band_verification.md into band rows.
Usage: python3 content/tools/extract_band_definitions.py   (run from the repo root)
Prints JSON to stdout. Nothing is invented: every value is copied from the tables."""
import json, re, sys

SRC = "docs/research/notes/band_verification.md"
TABLES = {  # table letter -> (kind, source text)
    "A": ("LTE", "Wikipedia 'LTE frequency bands', oldid 1363024101, pp.2-3 (transcribes 3GPP TS 36.101 V19.3.0)"),
    "B": ("LTE-satellite", "Wikipedia 'LTE frequency bands', oldid 1363024101, p.4 (transcribes 3GPP TS 36.102 V19.1.0)"),
    "C": ("NR-FR1", "Wikipedia '5G NR frequency bands', oldid 1382980478, pp.2-4 (transcribes 3GPP TS 38.101-1 V19.3.1)"),
    "D": ("NR-FR2", "Wikipedia '5G NR frequency bands', oldid 1382980478, p.5 (transcribes 3GPP TS 38.101-2 V19.2.0)"),
    "E": ("NR-satellite", "Wikipedia '5G NR frequency bands', oldid 1382980478, pp.5-6 (transcribes 3GPP TS 38.101-5 V19.3.0)"),
}
def clean(s):
    return s.strip().replace("**", "")
rows, cur = [], None
for line in open(SRC, encoding="utf-8"):
    m = re.match(r"#### Corrected master table ([A-E])", line)
    if m:
        cur, header = m.group(1), None
        continue
    if line.startswith("#### Discrepancy"):
        cur = None
    if not cur or not line.startswith("|"):
        continue
    cells = [clean(c) for c in line.strip().strip("|").split("|")]
    if cells[0] == "Band":
        header = cells; continue
    if set(cells[0]) <= set("-"):
        continue
    d = dict(zip(header, cells))
    band = re.sub(r"\s*\(NEW[^)]*\)", "", d["Band"]).replace(" / ", "/")
    kind, src = TABLES[cur]
    name = next((v for k, v in d.items() if k.startswith("Wikipedia common name")), "")
    ul = d.get("UL (MHz)") or d.get("UL") or d.get("UL / DL (GHz)", "")
    dl = d.get("DL (MHz)") or d.get("DL") or ""
    rows.append({
        "id": band, "kind": kind, "name": name, "uplink": ul, "downlink": dl,
        "duplex": d.get("Duplex", "TDD"),
        "duplex_spacing_mhz": d.get("Duplex spacing (MHz)", ""),
        "channel_bandwidths_mhz": d.get("Channel BWs (MHz)", ""),
        "relations": d.get("Subset / superset", ""),
        "notes": d.get("Wikipedia notes / footnotes") or d.get("Notes", ""),
        "new_in_research": "(NEW" in d["Band"] or "(NEW" in line.split("|")[1],
        "verification": d["Status"],
        "status": "CURRENT", "as_of": "2026-10-31", "source": src,
    })

# --- T43 fixes: split grouped rows (A2), add plain number fields (A3), flag B23 (A1) ---
def num_range(text, kind):
    """First 'a-b' range in a text cell, in MHz (GHz cells are converted). None if there is none."""
    m = re.search(r"(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)", text or "")
    if not m:
        return None, None
    lo, hi = float(m.group(1)), float(m.group(2))
    if kind == "NR-FR2" or "GHz" in (text or ""):
        lo, hi = lo * 1000, hi * 1000
    return round(lo, 3), round(hi, 3)

out = []
for r in rows:
    if r["id"] == "B35/B36/B37":   # three bands in one table row: one band per row, as the app needs
        ids = ["B35", "B36", "B37"]
        ranges = [x.strip().replace("TDD ", "") for x in r["uplink"].split("/")]
        names = ["PCS TDD (uplink part)", "PCS TDD (downlink part)", "PCS TDD (duplex gap)"]
        bws = [x.strip() for x in r["channel_bandwidths_mhz"].split("/")]
        bws = [bws[0], bws[0] if bws[1] == "same" else bws[1], bws[2]]
        notes = [x.strip().strip('"') for x in r["notes"].split("/")]
        for i, b in enumerate(ids):
            n = dict(r, id=b, name=names[i], uplink=ranges[i], channel_bandwidths_mhz=bws[i],
                     notes=f'Wikipedia label: "{notes[i]}". Split from the row "B35 / B36 / B37"',
                     group="PCS TDD (B35/B36/B37)")
            out.append(n)
    else:
        out.append(dict(r, group=""))
for r in out:
    ul = num_range(r["uplink"], r["kind"]); dl = num_range(r["downlink"], r["kind"])
    if r["duplex"].startswith("TDD") and ul != (None, None) and dl == (None, None):
        dl = ul   # TDD: one range, used both ways
    r["ul_low_mhz"], r["ul_high_mhz"] = ul
    r["dl_low_mhz"], r["dl_high_mhz"] = dl
    r["not_applicable"] = False
    if r["id"] == "B23":
        # Wikipedia footnote: "Bands b6 and b23 are not applicable". Never quiz on it as a live band.
        r["not_applicable"] = True
        r["status"] = "HISTORICAL"
        r["notes"] += " | T43: Wikipedia marks this band not applicable, so it is not taught as a live band"
json.dump(out, sys.stdout, indent=1, ensure_ascii=False)
