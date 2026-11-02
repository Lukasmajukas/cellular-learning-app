#!/usr/bin/env python3
"""Reads content/lessons/unit-*/*.yaml and writes content/lessons.json (the app reads that file).
Lessons are ordered by file name; a file ending in -check.yaml is the unit's checkpoint (always last).
Run: python3 content/tools/build_lessons.py"""
import json, pathlib, yaml

content = pathlib.Path(__file__).resolve().parents[1]
units = []
for ud in sorted((content / "lessons").glob("unit-*")):
    lessons, meta = [], {}
    for f in sorted(ud.glob("*.yaml")):
        d = yaml.safe_load(f.read_text(encoding="utf-8"))
        meta = {"id": d["unit"], "title": d["unit_title"]}
        lessons.append({"id": d["lesson"], "title": d["title"], "questions": d["questions"]})
    units.append({**meta, "lessons": lessons})
photos = []
cp = content / "photos" / "credits.yaml"
if cp.exists():
    for p in yaml.safe_load(cp.read_text(encoding="utf-8")) or []:
        photos.append({k: p[k] for k in ("id", "file", "title", "author", "licence")})
(content / "lessons.json").write_text(json.dumps({"photos": photos, "units": units}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"Wrote content/lessons.json: {len(units)} unit(s), {sum(len(u['lessons']) for u in units)} lesson(s).")
