#!/usr/bin/env python3
"""Estimate how long each lesson takes (PRD success check S3: 3 to 5 minutes).

This is a MODEL, not a stopwatch: it adds reading time and thinking time per step.
Run:  python3 content/tools/lesson_timing.py
Facts like {band:B71.id} are counted as 1 word. Two learners: FAST (confident) and SLOW (beginner); the verdict uses the middle of the two.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
# seconds: (words per second, think seconds per choice, per match pair, per number, per order item, per learn card,
#           pause between steps, share of questions missed, seconds to read the "why" after a miss)
FAST = dict(wps=4.0, choice=3, pair=3, number=8, order=4, learn=3, gap=1.5, miss=0.10, why=3, retry=1.0)
SLOW = dict(wps=2.5, choice=6, pair=6, number=15, order=8, learn=6, gap=2.5, miss=0.30, why=6, retry=1.0)

def words(*parts):
    n = 0
    for p in parts:
        if isinstance(p, str):
            n += len(re.sub(r"\{[^}]*\}", "x", p).split())
        elif isinstance(p, (list, tuple)):
            n += words(*p)
    return n

def step_seconds(q, m):
    k = q["kind"]
    if k == "learn":
        return words(q.get("title", ""), q.get("text", "")) / m["wps"] + m["learn"] + m["gap"]
    read = words(q.get("prompt", "")) / m["wps"]
    why = words(q.get("why", "")) / m["wps"]
    if k == "choice":
        base = read + words(q["choices"]) / m["wps"] + m["choice"]
    elif k == "match":
        base = read + len(q["pairs"]) * m["pair"] + words(q["pairs"]) / m["wps"]
    elif k == "number":
        base = read + m["number"]
    elif k == "order":
        base = read + len(q.get("bands", q.get("items", []))) * m["order"]
    else:
        base = read + m["choice"]
    # feedback: always a beat; a miss adds reading the explanation and answering again once
    return base + m["gap"] + m["miss"] * (m["why"] + why + (base * m["retry"]))

def main():
    data = json.loads((ROOT / "lessons.json").read_text())
    rows, bad = [], 0
    for u in data["units"]:
        for l in u["lessons"]:
            qs = l["questions"]
            f = sum(step_seconds(q, FAST) for q in qs) / 60
            s = sum(step_seconds(q, SLOW) for q in qs) / 60
            rows.append((l["id"], len(qs), f, s))
    print(f"{'lesson':<14}{'steps':>6}{'fast min':>10}{'slow min':>10}{'middle':>9}  verdict (middle must be 3 to 5)")
    for lid, n, f, s in rows:
        mid = (f + s) / 2
        v = "too short" if mid < 3 else ("too long" if mid > 5 else "ok")
        if v != "ok": bad += 1
        print(f"{lid:<14}{n:>6}{f:>10.1f}{s:>10.1f}{mid:>9.1f}  {v}")
    print(f"\n{len(rows)} lessons, {bad} outside the range")
    return 0

if __name__ == "__main__":
    sys.exit(main())
