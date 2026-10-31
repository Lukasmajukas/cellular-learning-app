#!/usr/bin/env python3
"""Builds panel/index.html from the project's own files.

Run:  python3 panel/build.py            (reads panel/live.json for robot + pull-request state)
Then publish panel/index.html as the private claude.ai page (see panel/README.md).
No keys, no network: it only reads files in this folder tree.
"""
import html, json, re, sys, datetime, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PANEL = ROOT / "panel"


def clean(s):
    s = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)        # links -> text
    s = re.sub(r"[`*]", "", s)
    return s.strip()


def tables(md):
    """Return {section heading: [row cell lists]} for every markdown table."""
    out, cur, head = {"": []}, "", None
    for line in md.splitlines():
        if line.startswith("## "):
            cur = line[3:].strip(); out[cur] = []; continue
        if line.startswith("|"):
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if set("".join(cells)) <= set("-: "):
                continue
            out[cur].append(cells)
    return out


def short(text, n=110):
    t = clean(text)
    m = re.match(r"(.+?[.?])(\s|$)", t)
    t = m.group(1) if m else t
    return t if len(t) <= n else t[: n - 1].rsplit(" ", 1)[0] + "…"


def main():
    tasks_md = (ROOT / "TASKS.md").read_text()
    road_md = (ROOT / "ROADMAP.md").read_text()
    log_md = (ROOT / "docs/PROGRESS-LOG.md").read_text()
    live_p = PANEL / "live.json"
    live = json.loads(live_p.read_text()) if live_p.exists() else {}

    # Levels
    levels = []
    rows = [r for rs in tables(road_md).values() for r in rs if r and r[0].isdigit() and len(r) >= 5]
    for r in rows:
        st = r[-1]
        state = "done" if "Done" in st else "here" if "here" in st else "locked"
        levels.append({"n": int(r[0]), "name": clean(r[1]), "what": clean(r[2]), "state": state})
    done = sum(l["state"] == "done" for l in levels)
    pct = round(100 * (done + 0.35) / max(len(levels), 1))  # the current level counts as partly done

    # Tasks
    T = tables(tasks_md)
    def trows(prefix):
        for k, rs in T.items():
            if k.startswith(prefix):
                return [r for r in rs if r and re.match(r"T\d+", r[0])]
        return []
    now, later, donerows = trows("Now"), trows("After"), trows("Done")
    waiting = [{"id": r[0], "text": short(r[1], 220), "how": clean(r[4])} for r in now if r[2].strip() == "You"]
    nxt = [{"id": r[0], "text": short(r[1]), "who": clean(r[2]), "star": "⭐" in r[4]} for r in now if r[2].strip() != "You"]
    upcoming = [{"id": r[0], "text": short(r[1])} for r in later]
    recent = [{"id": r[0], "text": short(r[1], 150), "date": r[2]} for r in donerows[:6]]
    working = [x for x in nxt if x["star"]][:1]

    # Diary
    diary = []
    for line in log_md.splitlines():
        if re.match(r"\|\s*20\d\d-", line):
            c = [x.strip() for x in line.strip().strip("|").split("|")]
            diary.append({"date": c[0], "text": clean(c[1])})
    diary = diary[:4]

    now_t = datetime.datetime.now(datetime.timezone.utc)
    data = {
        "built": live.get("asOf") or now_t.strftime("%Y-%m-%d %H:%M UTC"),
        "levels": levels, "done": done, "pct": pct,
        "working": live.get("working") or (working[0]["text"] if working else None),
        "robot": live.get("robot", {"on": None}),
        "light": live.get("light", "unknown"),
        "limit": live.get("limit", {"state": "unknown"}),
        "waiting": waiting, "next": nxt, "upcoming": upcoming,
        "recent": recent, "diary": diary,
    }
    tpl = (PANEL / "template.html").read_text()
    out = tpl.replace("/*DATA*/null", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
    (PANEL / "index.html").write_text(out)
    print(f"Wrote panel/index.html: {done}/{len(levels)} levels done, {len(waiting)} waiting for you, {len(recent)} recent.")


if __name__ == "__main__":
    sys.exit(main())
