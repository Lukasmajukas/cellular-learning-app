#!/usr/bin/env python3
"""The fact checker (T28). Run it before every build: python3 content/tools/check_content.py

What it refuses (docs/PRD.md section 5):
  1. any fact (band, carrier row, carrier code, spectrum change) without a status, an as-of date and a source;
  2. any photo without an allowed licence, a credit, a source link or a date checked;
  3. any question whose answer rests on an UNVERIFIED fact (or a fact that is not allowed for that
     kind of question: HISTORICAL needs label "history", PENDING/PLANNED need label "coming");
  4. any question ID that disappeared or changed (IDs are locked in content/question-ids.json);
  5. an AI-made photo used in an "identify" question.

Exit code 0 = all good, 1 = at least one problem (each printed on its own line).
Only needs Python 3 (PyYAML is used for lessons and photo credits if it is installed).
"""
import argparse
import datetime
import json
import re
import sys
from pathlib import Path

STATUSES = {"CURRENT", "HISTORICAL", "PENDING", "PLANNED", "UNVERIFIED"}
LICENCES = {"public domain", "cc0", "cc by", "cc by-sa"}
# which labels allow which statuses as a quiz answer
ALLOWED_FOR_ANSWER = {"CURRENT": None, "HISTORICAL": "history", "PENDING": "coming", "PLANNED": "coming"}


def load_yaml(path):
    try:
        import yaml
    except ImportError:
        raise SystemExit("PyYAML is needed to read " + str(path) + " (pip install pyyaml)")
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f)


def valid_date(s):
    try:
        datetime.date.fromisoformat(str(s))
        return True
    except ValueError:
        return False


def check_fact(where, row, errors):
    """A fact needs status, as_of date and source."""
    if row.get("status") not in STATUSES:
        errors.append(f"{where}: status missing or not one of {sorted(STATUSES)} (got {row.get('status')!r})")
    if not valid_date(row.get("as_of", "")):
        errors.append(f"{where}: as_of date missing or not YYYY-MM-DD (got {row.get('as_of')!r})")
    if not str(row.get("source", "")).strip():
        errors.append(f"{where}: source missing")


def fact_index(bands, errors):
    """Check every fact and return {fact_ref: row} so questions can point at facts."""
    index = {}
    for b in bands.get("bands", []):
        where = f"band {b.get('id')}"
        check_fact(where, b, errors)
        index[f"band:{b.get('id')}"] = b
    for c in bands.get("carrier_use", []):
        where = f"carrier_use {c.get('tech')}/{c.get('band')}/{c.get('carrier_id')}"
        check_fact(where, c, errors)
        index[f"carrier_use:{c.get('band')}/{c.get('carrier_id')}"] = c
        if str(c.get("icon", "")).strip() and c.get("status") != "CURRENT":
            errors.append(f"{where}: has an icon but status is {c.get('status')} (icons are only allowed on CURRENT rows)")
    for c in bands.get("carrier_codes", []):
        check_fact(f"carrier_code {c.get('id')}", c, errors)
        if not re.fullmatch(r"\d{3}-\d{3}", str(c.get("id", ""))):
            errors.append(f"carrier_code {c.get('id')!r}: id must look like 310-260")
        index[f"code:{c.get('id')}"] = c
    for s in bands.get("spectrum_changes", []):
        cid = str(s.get("id", "")).strip()
        where = f"spectrum_change {cid or '(no id)'} ({s.get('date')})"
        check_fact(where, s, errors)
        if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", cid):
            errors.append(f"{where}: needs a short name id like array-verizon (lowercase words with dashes)")
        elif f"change:{cid}" in index:
            errors.append(f"{where}: id {cid!r} is used twice")
        index[f"change:{cid}"] = s
    for r in bands.get("frequency_ranges", []):
        check_fact(f"frequency_range {r.get('id')}", r, errors)
        index[f"range:{r.get('id')}"] = r
    return index


SITE_GRADES = {"A", "B", "C", "inference"}
SITE_KINDS = {"type", "rule", "inference", "sign", "owner"}


def check_sites(sites, errors):
    """Tower and site facts (content/sites.json). Same status/date/source rules as bands, plus:
    a grade (A/B/C/inference), a plain sentence, no numbers in grade B/C rows (decision F2: those are
    for looks and ideas only), and never a phone number (decision F4)."""
    index = {}
    for r in sites.get("sites", []):
        rid = r.get("id")
        where = f"site {rid}"
        if not rid or ":" not in str(rid):
            errors.append(f"{where}: id must look like kind:name")
            continue
        check_fact(where, r, errors)
        if r.get("kind") not in SITE_KINDS:
            errors.append(f"{where}: kind must be one of {sorted(SITE_KINDS)} (got {r.get('kind')!r})")
        if r.get("grade") not in SITE_GRADES:
            errors.append(f"{where}: grade must be one of {sorted(SITE_GRADES)} (got {r.get('grade')!r})")
        text = str(r.get("text", "")).strip()
        if not text:
            errors.append(f"{where}: text missing")
        if r.get("grade") in ("B", "C") and re.search(r"\d", text):
            errors.append(f"{where}: grade {r.get('grade')} rows may not carry numbers (only grade A does)")
        if re.search(r"\d{3}[-. )]+\d{3}[-. ]+\d{4}|\d{3}-[A-Z]{3}-[A-Z]{4}", text):
            errors.append(f"{where}: looks like a phone number (never stored)")
        index[f"site:{rid}"] = r
    return index


KB_GRADES = {"P", "T", "W", "C", "inference", "gap"}
HARDWARE_KINDS = {"form", "ports", "model", "use", "weight", "rule"}
CELLID_KINDS = {"cls", "lte", "nr", "us", "tool"}
HEDGE_WORDS = re.compile(r"usually|very likely|good guess|pattern|roughly|rule of thumb|may have changed|guess|often|may differ|differ", re.I)


def check_field_trip(data, errors):
    """Local field trip sites (content/field-trip.json): every site must stay UNVERIFIED (nobody has
    re-checked the permits) and carry status, as_of, source and a coordinate precision."""
    seen = set()
    for row in data.get("sites", []):
        where = f"field-trip {row.get('id')}"
        check_fact(where, row, errors)
        if row.get("status") != "UNVERIFIED":
            errors.append(f"{where}: field trip sites must be UNVERIFIED until someone re-checks the evidence")
        if not str(row.get("id", "")).startswith("trip:") or row.get("id") in seen:
            errors.append(f"{where}: id must start with 'trip:' and be unique")
        seen.add(row.get("id"))
        if not row.get("coord_precision"):
            errors.append(f"{where}: coord_precision missing")
        if not isinstance(row.get("lat"), (int, float)) or not isinstance(row.get("lon"), (int, float)):
            errors.append(f"{where}: lat/lon must be numbers")


def check_kb(rows, label, prefix, kinds, errors):
    """Hardware (content/hardware.json) and cell-ID (content/cell-ids.json) facts, decisions G1 to G7.
    Same status/date/source rules as bands, plus: a kind and a grade (P/T/W/C/inference/gap),
    a plain sentence, hedge words in 'inference' and 'C' rows, `quiz: false` on every grade C row
    (forum patterns are never asked, G3), and never a phone number."""
    index = {}
    for r in rows:
        rid = r.get("id")
        where = f"{label} {rid}"
        if not rid or ":" not in str(rid):
            errors.append(f"{where}: id must look like kind:name")
            continue
        check_fact(where, r, errors)
        if r.get("kind") not in kinds:
            errors.append(f"{where}: kind must be one of {sorted(kinds)} (got {r.get('kind')!r})")
        elif str(rid).split(":")[0] != r.get("kind") and not (r.get("kind") == "rule" and str(rid).startswith("evidence:")):
            errors.append(f"{where}: id must start with its kind ({r.get('kind')}:)")
        if r.get("grade") not in KB_GRADES:
            errors.append(f"{where}: grade must be one of {sorted(KB_GRADES)} (got {r.get('grade')!r})")
        text = str(r.get("text", "")).strip()
        if not text:
            errors.append(f"{where}: text missing")
        if r.get("grade") in ("inference", "C") and not HEDGE_WORDS.search(text):
            errors.append(f"{where}: grade {r.get('grade')} rows must say 'usually', 'pattern', 'good guess' or similar (never taught as a law)")
        if r.get("grade") == "C" and r.get("quiz") is not False:
            errors.append(f"{where}: grade C (forum) rows must have quiz: false (never asked as a question)")
        if re.search(r"\d{3}[-. )]+\d{3}[-. ]+\d{4}", text):
            errors.append(f"{where}: looks like a phone number (never stored)")
        index[f"{prefix}:{rid}"] = r
    return index


IDENTIFY_KINDS = ('identify', 'photo-choice', 'tap-clue')  # questions where the player must recognise something in a picture


def check_photos(credits, errors):
    photos = {}
    for p in credits or []:
        pid = p.get("id")
        where = f"photo {pid}"
        if not pid:
            errors.append("photo without an id")
            continue
        photos[pid] = p
        for field in ("file", "source_url", "author", "date_checked"):
            if not str(p.get(field, "")).strip():
                errors.append(f"{where}: {field} missing")
        if p.get("date_checked") and not valid_date(p["date_checked"]):
            errors.append(f"{where}: date_checked not YYYY-MM-DD")
        if str(p.get("licence", "")).strip().lower() not in LICENCES:
            errors.append(f"{where}: licence {p.get('licence')!r} not allowed (allowed: public domain, CC0, CC BY, CC BY-SA)")
        if p.get("file") and not str(p["file"]).lower().endswith(".webp"):
            errors.append(f"{where}: file must be .webp")
    return photos


def calc_value(calc):
    """Recompute a made-up drill answer from its inputs (unit 9). Returns None if the calc is not understood."""
    if not isinstance(calc, dict) or len(calc) != 1:
        return None
    (kind, a), = calc.items()
    try:
        if kind == "eci" and len(a) == 2 and 0 <= a[1] < 256:
            return a[0] * 256 + a[1]          # ECI = eNB x 256 + cell
        if kind == "enb" and len(a) == 1:
            return a[0] // 256
        if kind == "cell" and len(a) == 1:
            return a[0] % 256
        if kind == "count" and len(a) == 2:
            return a[0] * a[1]                # sectors x bands
        if kind == "gnb" and len(a) == 2 and 22 <= a[1] <= 32:
            return a[0] >> (36 - a[1])        # leftmost bits of the 36-bit NCI
        if kind == "mhz_b66" and len(a) == 1 and 66436 <= a[0] <= 67335:
            return round(2110 + 0.1 * (a[0] - 66436), 1)
    except TypeError:
        return None
    return None


def check_questions(questions, facts, photos, errors):
    """questions: list of (file, dict). Returns the list of ids found."""
    ids = []
    for fname, q in questions:
        qid = q.get("id")
        where = f"question {qid} ({fname})"
        if not qid:
            errors.append(f"{fname}: a question has no id")
            continue
        if qid in ids:
            errors.append(f"{where}: duplicate id")
        ids.append(qid)
        label = q.get("label")
        refs = q.get("facts") or []
        if not refs and not q.get("no_facts_needed"):
            errors.append(f"{where}: lists no facts (add `facts:` or `no_facts_needed: true`)")
        for ref in refs:
            row = facts.get(ref)
            if row is None:
                errors.append(f"{where}: fact {ref} does not exist")
                continue
            st = row.get("status")
            if st == "UNVERIFIED":
                errors.append(f"{where}: answer rests on UNVERIFIED fact {ref}")
            elif row.get("quiz") is False and q.get("kind") != "learn":
                errors.append(f"{where}: fact {ref} is taught only, never asked (quiz: false); only a learn card may list it")
            elif st in ALLOWED_FOR_ANSWER and ALLOWED_FOR_ANSWER[st] and label != ALLOWED_FOR_ANSWER[st]:
                errors.append(f"{where}: fact {ref} is {st}; the question needs label: {ALLOWED_FOR_ANSWER[st]}")
        if q.get("kind") == "number" and not q.get("answer_from"):
            want = calc_value(q.get("calc"))
            if want is None:
                errors.append(f"{where}: a made-up number answer needs a calc the checker understands (eci, enb, cell, count, gnb, mhz_b66)")
            elif q.get("answer") != want:
                errors.append(f"{where}: answer {q.get('answer')!r} does not match the calc (it works out to {want})")
        pid = q.get("photo")
        if pid:
            p = photos.get(pid)
            if p is None:
                errors.append(f"{where}: photo {pid} is not in the credits file")
            elif q.get("kind") in IDENTIFY_KINDS and (p.get("ai_generated") or p.get("ai_made")):
                errors.append(f"{where}: AI-made photo {pid} used in an identify question")
    return ids


def check_ids(ids, registry_path, update, errors):
    """Locked IDs: every registered id must still exist. New ids are added with --update-ids."""
    locked = []
    if registry_path.exists():
        locked = json.loads(registry_path.read_text(encoding="utf-8")).get("ids", [])
    for old in locked:
        if old not in ids:
            errors.append(f"question id {old} is locked but missing now (renaming an id wipes its review history)")
    new = [i for i in ids if i not in locked]
    if update and new and not errors:
        registry_path.write_text(json.dumps({"ids": sorted(set(locked) | set(ids))}, indent=1) + "\n", encoding="utf-8")
        print(f"Locked {len(new)} new question id(s).")
    elif new:
        print(f"note: {len(new)} question id(s) are not locked yet; run with --update-ids once the check passes.")


def check_changes(data, ids, errors):
    """'This changed' cards: each needs an id, date, title, text and source, and may only reset questions that exist."""
    seen = set()
    for i, c in enumerate(data.get("changes", [])):
        where = f"changes.json[{i}]"
        for f in ("id", "date", "title", "text", "source"):
            if not c.get(f):
                errors.append(f"{where}: {f} missing")
        if c.get("id") in seen:
            errors.append(f"{where}: duplicate id {c.get('id')}")
        seen.add(c.get("id"))
        if c.get("date") and not valid_date(c["date"]):
            errors.append(f"{where}: date {c['date']!r} is not YYYY-MM-DD")
        for q in c.get("questions", []):
            if q not in ids:
                errors.append(f"{where}: question {q} does not exist")
    return len(seen)


def collect_questions(content):
    out = []
    for f in sorted((content / "lessons").glob("unit-*/*.yaml")):
        data = load_yaml(f) or {}
        for q in data.get("questions", []):
            out.append((str(f.relative_to(content)), q))
    return out


def run(content, update_ids=False):
    errors = []
    bands_path = content / "bands.json"
    if not bands_path.exists():
        return [f"{bands_path} not found"]
    bands = json.loads(bands_path.read_text(encoding="utf-8"))
    facts = fact_index(bands, errors)
    sites_path = content / "sites.json"
    if sites_path.exists():
        facts.update(check_sites(json.loads(sites_path.read_text(encoding="utf-8")), errors))
    for fname, key, label, prefix, kinds in (("hardware.json", "hardware", "hardware", "hardware", HARDWARE_KINDS),
                                              ("cell-ids.json", "cell_ids", "cell-id", "cellid", CELLID_KINDS)):
        kb_path = content / fname
        if kb_path.exists():
            kb = json.loads(kb_path.read_text(encoding="utf-8"))
            facts.update(check_kb(kb.get(key, []), label, prefix, kinds, errors))
    trip_path = content / "field-trip.json"
    if trip_path.exists():
        check_field_trip(json.loads(trip_path.read_text(encoding="utf-8")), errors)
    credits_path = content / "photos" / "credits.yaml"
    photos = check_photos(load_yaml(credits_path), errors) if credits_path.exists() else {}
    questions = collect_questions(content) if (content / "lessons").exists() else []
    ids = check_questions(questions, facts, photos, errors)
    check_ids(ids, content / "question-ids.json", update_ids, errors)
    changes_path = content / "changes.json"
    if changes_path.exists():
        check_changes(json.loads(changes_path.read_text(encoding="utf-8")), set(ids), errors)
    print(f"Checked {len(facts)} facts, {len(photos)} photos, {len(questions)} questions.")
    return errors


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--content", default=str(Path(__file__).resolve().parent.parent), help="the content/ folder")
    ap.add_argument("--update-ids", action="store_true", help="lock any new question ids (only when the check passes)")
    a = ap.parse_args()
    errors = run(Path(a.content), a.update_ids)
    for e in errors:
        print("PROBLEM:", e)
    print("FAILED" if errors else "OK")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
