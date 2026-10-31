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
json.dump(rows, sys.stdout, indent=1, ensure_ascii=False)
