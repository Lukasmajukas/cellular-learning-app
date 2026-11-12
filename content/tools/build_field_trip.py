"""Builds content/field-trip.json (the "local field trip" sites). Run from the repo root:
   python3 content/tools/build_field_trip.py
Do not edit field-trip.json by hand. The input is the untouched copy of the 23 South Hadley rows
from the owner's SpectrumScope project: content/field-trip/spectrumscope-south-hadley-raw.json.
Rules (task T10, owner said yes 2026-10-31):
  - every site is UNVERIFIED: nobody here has re-checked the permit or FCC record;
  - every site keeps its original evidence (the source text) and the original note;
  - carriers and bands are only what the old project CLAIMED ("claimed_bands"); band facts for
    lessons still come only from bands.json;
  - coordinates are stored with how exact they are: surveyed by the FCC, or a rough guess;
  - nothing here is used in a quiz question yet."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "content"
RAW = ROOT / "field-trip" / "spectrumscope-south-hadley-raw.json"
OUT = ROOT / "field-trip.json"

TYPES = {"tower": "tower", "watertank": "water tank", "rooftop": "rooftop", "stealth": "hidden (stealth)",
         "macro": "macro tower", "chimney": "chimney", "steeple": "steeple"}
CARRIERS = {"tmobile": "T-Mobile", "verizon": "Verizon", "att": "AT&T", "dish": "Dish", None: "several / not named"}


def coord_precision(row):
    """Only the source line decides (the note text can say "not surveyed")."""
    text = row.get("source", "").lower()
    if "approx" in text or "geocode" in text:
        return "rough (building or street guess)"
    if "surveyed" in text or "fcc asr" in text:
        return "surveyed (FCC record)"
    return "rough (building or street guess)"


def build():
    raw = json.loads(RAW.read_text(encoding="utf-8"))
    sites = []
    for r in raw["sites"]:
        sites.append({
            "id": "trip:" + r["id"],
            "label": r["label"],
            "town": r["town"],
            "type": r["type"],
            "type_plain": TYPES.get(r["type"], r["type"]),
            "carrier": CARRIERS.get(r.get("carrierId"), r.get("carrierId")),
            "claimed_bands": r.get("bands", []),
            "lat": r["lat"], "lon": r["lon"],
            "coord_precision": coord_precision(r),
            "status": "UNVERIFIED",
            "as_of": raw["source_as_of"],
            "source": r["source"] + " | via " + raw["copied_from"],
            "note": r.get("note", ""),
        })
    return {"as_of": raw["source_as_of"], "copied_from": raw["copied_from"], "sites": sites}


if __name__ == "__main__":
    data = build()
    OUT.write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} with {len(data['sites'])} sites.")
