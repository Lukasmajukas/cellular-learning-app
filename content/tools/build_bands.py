"""Builds content/bands.json and content/bands.md. Run from the repo root:
   python3 content/tools/build_bands.py
Band definitions come from the tables in band_verification.md (via extract_band_definitions.py).
Carrier use comes from the carrier x band matrix in docs/research/notes/us_bands.md.
Rule: only a matrix claim tagged [S] (has a cited source) keeps its status. Claims tagged
[U] (unverified) or [W] (weak source) become UNVERIFIED, with the original claim kept.
T43 (2026-11-01) applied the fixes from docs/reviews/2026-10-31-bands-review.md; each fix is tagged
with its review number (A1, B1, ...) in the comments below."""
import json, subprocess, sys
AS_OF = "2026-10-31"
CSRC = "docs/research/notes/us_bands.md, carrier x band matrix (built from web-search summaries; SEC/FCC/press pages were not reachable)"
ECHO = "EchoStar 10-Q Q2 2026 (https://www.sec.gov/Archives/edgar/data/0001415404/000110465926089370/sats-20260630x10q.htm), as quoted in docs/research/notes/us_bands.md Q4 timeline; the filing itself was not opened"
VZW77 = "SlashGear (https://www.slashgear.com/1868963/5g-ultra-capacity-vs-wideband-network-differences/), MakeUseOf (https://www.makeuseof.com/verizon-att-t-mobile-different-names-fast-5g/), DCD (https://www.datacenterdynamics.com/en/news/verizon-and-att-receive-full-access-to-entire-c-band-spectrum/), as quoted in docs/research/notes/us_bands.md; pages themselves not opened"
WPDEP = "Wikipedia deployments table (undated), band_verification.md Q3; not enough to upgrade (undated table)"

# B14: one short carrier id list, shared with content/carrier-codes.md names
CARRIERS = {
 "att": "AT&T", "verizon": "Verizon", "tmobile": "T-Mobile", "boost": "Dish / Boost (EchoStar)",
 "cspire": "C Spire", "cellcom": "Cellcom (Nsight)",
 "private_cable": "Private networks / cable (a category, not a carrier)",
}
_ID = {"AT&T":"att","Verizon":"verizon","T-Mobile":"tmobile","Boost/EchoStar":"boost","C Spire":"cspire","Cellcom":"cellcom","Private networks / cable":"private_cable"}
# B13: bands that the research listed together ("B4/B66"). Rows are split to one band number each.
GROUP = {"B4":"AWS (B4/B66)","B66":"AWS (B4/B66)","B12":"Lower 700 (B12/B17/B85)","B17":"Lower 700 (B12/B17/B85)","B85":"Lower 700 (B12/B17/B85)"}
SPLIT = {"B4/B66":["B4","B66"], "B12/B17/B85":["B12","B17"]}   # B85 gets no carrier row: the research never says who uses it alone

# (tech, band, carrier, claim, evidence S/W/U, note)
C = [
("LTE","B2","AT&T","CURRENT","U","capacity layer"),
("LTE","B2","Verizon","CURRENT","U","capacity layer; plus Array PCS licences (Jun 2026)"),
("LTE","B2","T-Mobile","CURRENT","W","as B2/B25"),
("LTE","B2","C Spire","CURRENT","W",""),
("LTE","B4/B66","AT&T","CURRENT","U","main capacity layer"),
("LTE","B4/B66","Verizon","CURRENT","U","main capacity layer"),
("LTE","B4/B66","T-Mobile","CURRENT","W",""),
("LTE","B4/B66","Boost/EchoStar","HISTORICAL","U","own network wound down"),
("LTE","B4/B66","C Spire","CURRENT","W","B4"),
("LTE","B5","AT&T","CURRENT","U","coverage layer"),
("LTE","B5","Verizon","CURRENT","U","coverage layer"),
("LTE","B5","T-Mobile","CURRENT","U","former UScellular markets only"),
("LTE","B5","Cellcom","CURRENT","S","850 MHz"),
("LTE","B12/B17/B85","AT&T","CURRENT","U","B/C blocks, shown as B17 or B12; plus Array 700 (Jan 2026)"),
("LTE","B12/B17/B85","T-Mobile","CURRENT","W","A block; plus Array 700 (May 2026)"),
("LTE","B12/B17/B85","C Spire","CURRENT","W","B12"),
("LTE","B13","Verizon","CURRENT","U","nationwide coverage anchor"),
("LTE","B13","Cellcom","CURRENT","S","access to Verizon 700 (LRA partner)"),
("LTE","B14","AT&T","CURRENT","U","FirstNet public safety plus commercial"),
("LTE","B25","T-Mobile","CURRENT","U",""),
("LTE","B26","T-Mobile","HISTORICAL","S","800 MHz licences sold, closed 2026-08-10"),
("LTE","B26","SpaceX (from Grain)","PENDING","S","Grain 800 MHz to SpaceX"),
("LTE","B29","AT&T","CURRENT","U","downlink-only booster"),
("LTE","B29","Boost/EchoStar","HISTORICAL","U","E block"),
("LTE","B30","AT&T","CURRENT","U","capacity layer"),
("LTE","B41","T-Mobile","CURRENT","W","residual LTE; mostly moved to n41"),
("LTE","B46","AT&T","CURRENT","U","limited, urban"),
("LTE","B46","Verizon","CURRENT","U","limited, urban"),
("LTE","B46","T-Mobile","CURRENT","U","limited, urban"),
("LTE","B48","Verizon","CURRENT","U","capacity layer (CBRS)"),
("LTE","B70","Boost/EchoStar","HISTORICAL","S","traffic moved to AT&T by 2025-11-15"),
("LTE","B70","SpaceX (from EchoStar)","PENDING","S","spectrum sale pending"),
("LTE","B71","AT&T","PLANNED","S","owns ~20 MHz since 2026-07-28; multiyear build"),
("LTE","B71","T-Mobile","CURRENT","W","coverage layer; plus Grain 600 (Aug 2026), Array 600 (May 2026)"),
("LTE","B71","Boost/EchoStar","HISTORICAL","S","licences now AT&T's"),
("LTE","B71","C Spire","CURRENT","W","listed as n71 in research"),
("NR","n2","Verizon","CURRENT","U","DSS, 'Nationwide 5G'"),
("NR","n2","T-Mobile","CURRENT","W","some deployments"),
("NR","n2","C Spire","CURRENT","W",""),
("NR","n5","AT&T","CURRENT","U","DSS low-band '5G'"),
("NR","n5","Verizon","CURRENT","W","DSS, main low-band"),
("NR","n5","Cellcom","CURRENT","S",""),
("NR","n12","C Spire","CURRENT","W",""),
("NR","n25","T-Mobile","CURRENT","W",""),
("NR","n41","T-Mobile","CURRENT","S","'Ultra Capacity' core"),
("NR","n41","C Spire","CURRENT","W",""),
("NR","n48","Private networks / cable","CURRENT","U","private 5G and cable offload"),
("NR","n66","Verizon","CURRENT","U","DSS"),
("NR","n66","T-Mobile","CURRENT","U","some"),
("NR","n66","Boost/EchoStar","HISTORICAL","U",""),
("NR","n70","Boost/EchoStar","HISTORICAL","U","partly sourced"),
("NR","n71","AT&T","PLANNED","S","multiyear"),
("NR","n71","T-Mobile","CURRENT","S","'Extended Range'"),
("NR","n71","Boost/EchoStar","HISTORICAL","U",""),
("NR","n71","C Spire","CURRENT","W",""),
("NR","n77","AT&T","CURRENT","S","'5G+': C-band plus 3.45 GHz incl. EchoStar 30 MHz on ~23k sites"),
("NR","n77","Verizon","CURRENT","W","'5G UW': C-band, ~161 MHz average; partly sourced"),
("NR","n77","T-Mobile","CURRENT","W","unconfirmed live use; ~40 MHz C-band licences"),
("NR","n77","C Spire","CURRENT","W",""),
("NR","n258","T-Mobile","CURRENT","W","listed only"),
("NR","n260","AT&T","CURRENT","W","mmWave; sources conflict"),
("NR","n260","Verizon","CURRENT","S","mmWave"),
("NR","n261","Verizon","CURRENT","S","mmWave"),
("NR","n261","Cellcom","CURRENT","S","mmWave"),
]

# --- T43 edits, applied to the original matrix rows above (key = (tech, band, carrier)) ---
DROP = {
 ("LTE","B26","SpaceX (from Grain)"),   # B3/B5: a pending sale reported by a headline, not "uses B26"; moved to SPECTRUM below
 ("LTE","B70","SpaceX (from EchoStar)"), # B4/B5: a sale for satellite use, not "uses B70"; moved to SPECTRUM below
}
OVERRIDE = {  # fields: status, evidence, note, claim, source, weak_note
 ("LTE","B5","Cellcom"):   dict(status="UNVERIFIED", evidence="source names n5, not B5", note="source lists 850 MHz as n5 only; LTE B5 is an inference"),                       # B1
 ("LTE","B13","Cellcom"):  dict(status="UNVERIFIED", evidence="source says access, not use", note="has access to Verizon 700 MHz (LRA partner); B13 use not confirmed"),         # B2
 ("NR","n66","Boost/EchoStar"): dict(status="HISTORICAL", evidence="cited source", source=ECHO, note="all 5G Network traffic moved to AT&T by 2025-11-15"),                    # B6
 ("NR","n70","Boost/EchoStar"): dict(status="HISTORICAL", evidence="cited source", source=ECHO, note="all 5G Network traffic moved to AT&T by 2025-11-15"),                    # B6
 ("NR","n71","Boost/EchoStar"): dict(status="HISTORICAL", evidence="cited source", source=ECHO, note="all 5G Network traffic moved to AT&T by 2025-11-15"),                    # B6
 ("LTE","B4/B66","Boost/EchoStar"): dict(note="own network wound down; LTE use on this band not shown by the source"),                                                     # B6
 ("LTE","B29","Boost/EchoStar"):    dict(note="E block; LTE use not shown by the source"),                                                                                  # B6
 ("NR","n77","Verizon"):   dict(status="CURRENT", evidence="cited source", source=VZW77, note="'5G UW': C-band; mid-band reached 175M+ people (DCD)", weak_note="~161 MHz average; weak source, do not quiz"),  # B7
 ("NR","n77","T-Mobile"):  dict(claim="UNCONFIRMED (holds licences)", note="~40 MHz C-band licences; live use unconfirmed"),                                                   # B8
 ("NR","n260","AT&T"):     dict(note="mmWave; matrix tag [S, conflicting]: sources disagree on the band, so UNVERIFIED"),                                                       # B9
 ("LTE","B2","Verizon"):   dict(note="capacity layer; plus Array PCS licences (Jun 2026; band mix disputed)"),                                                                  # B15
 ("LTE","B71","C Spire"):  dict(note="research lists n71; Wikipedia deployments table also lists LTE B71 (undated)"),                                           # B11
 ("LTE","B26","T-Mobile"): dict(note="800 MHz licences sold, closed 2026-08-10 (the ex-Sprint 800 MHz slice touches B26 and B27)"),                                            # B16
}
# B10: rows the Wikipedia deployments table agrees with; they stay UNVERIFIED (undated table)
WPDEP_ROWS = {("LTE","B13","Verizon"),("LTE","B14","AT&T"),("LTE","B12/B17/B85","AT&T"),("LTE","B12/B17/B85","T-Mobile"),("LTE","B25","T-Mobile"),("LTE","B41","T-Mobile"),("LTE","B71","T-Mobile"),("LTE","B71","C Spire"),("LTE","B25","C Spire"),("LTE","B41","C Spire")}
EXTRA = [  # B11: C Spire on LTE B25 and B41 (Wikipedia deployments table, Q3)
 ("LTE","B25","C Spire","CURRENT","U","listed only in Wikipedia's deployments table"),
 ("LTE","B41","C Spire","CURRENT","U","listed only in Wikipedia's deployments table"),
]
EVID = {"S":"cited source","W":"weak source","U":"unverified background knowledge"}
use = []
for t,b,c,cl,ev,n in C + EXTRA:
    k = (t,b,c)
    if k in DROP: continue
    o = dict(status=(cl if ev=="S" else "UNVERIFIED"), evidence=EVID[ev], note=n, claim=cl, source=CSRC, weak_note="")
    if k in WPDEP_ROWS:
        o.update(evidence="consistent with Wikipedia deployments table (undated)", source=WPDEP)
    o.update(OVERRIDE.get(k, {}))
    for bb in SPLIT.get(b, [b]):
        note = o["note"]
        if b in SPLIT: note = (note + f" (research grouped this as {b})").strip()
        use.append({"tech":t,"band":bb,"group":GROUP.get(bb,""),"carrier_id":_ID[c],"carrier":CARRIERS[_ID[c]],"claim":o["claim"],"status":o["status"],
                    "evidence":o["evidence"],"note":note,"weak_note":o["weak_note"],"as_of":AS_OF,"source":o["source"]})
# Boost on "B4/B66" was HISTORICAL for B66/n66 only: keep the B66 row, drop the B4 one. C Spire's note said "B4": keep B4 only.
use = [u for u in use if not (u["carrier_id"]=="boost" and u["band"]=="B4")]
use = [u for u in use if not (u["carrier_id"]=="cspire" and u["band"]=="B66")]
# C Spire's Lower 700 note said "B12": keep B12 only.
use = [u for u in use if not (u["carrier_id"]=="cspire" and u["band"]=="B17")]
# T-Mobile's Lower 700 is the A block = B12 only.
use = [u for u in use if not (u["carrier_id"]=="tmobile" and u["band"]=="B17")]

# T34: the 5G icon each carrier shows for a band. Only on rows that are CURRENT (the names were in the notes: 'Ultra Capacity',
# '5G+', '5G UW'). The icon shares the row's status, as_of and source. Every other row gets icon "" so the field always exists.
ICONS = {("n41","tmobile"):"Ultra Capacity", ("n77","att"):"5G+", ("n77","verizon"):"5G UW"}
for u in use:
    u["icon"] = ICONS.get((u["band"], u["carrier_id"]), "")
    assert not u["icon"] or u["status"] == "CURRENT", f"icon on a row that is not CURRENT: {u['band']}/{u['carrier_id']}"

# B5: ownership changes live in their own list. Not "a phone sees this band on this carrier's sites".
# (id, date, bands, from, to, status, note, source). The id is the short name lessons use ({change:array-verizon.date}); never reuse or reorder by position.  Source texts come from the Q4 timeline in us_bands.md.
S = "docs/research/notes/us_bands.md, Q4 timeline (web-search summaries; pages not opened): "
SPECTRUM = [
 ("uscellular-tmobile","2025-08","B71/n71, B12, B2/B25, B66, n41","UScellular","T-Mobile","CURRENT","closed; about 30% of UScellular's spectrum",S+"Wikipedia: U.S. Cellular; PhoneArena"),
 ("echostar-spacex-b70","2025-11","1695-1710 MHz (B70 uplink)","EchoStar","SpaceX","PENDING","unpaired AWS-3, about $2.6B in stock; SpaceX would use it for satellites, not LTE B70",S+"Via Satellite"),
 ("array-att-700-n77","2026-01-13","n77 (3.45 GHz), B12/B17 (700 MHz)","Array (ex-UScellular)","AT&T","CURRENT","closed, $1.018B",S+"PR Newswire; Array 10-Q Q1 2026"),
 ("array-tmobile-700","2026-05-05","B12 (700 MHz)","Array (ex-UScellular)","T-Mobile","CURRENT","closed, $74.8M",S+"Array Q2 2026 8-K"),
 ("array-tmobile-600","2026-05-12","B71 (600 MHz)","Array (ex-UScellular)","T-Mobile","CURRENT","closed, $86.4M",S+"Array Q2 2026 8-K"),
 ("array-verizon","2026-06-01","B2 (PCS), B66 (AWS)","Array (ex-UScellular)","Verizon","CURRENT","closed; sources disagree on the exact bands (AWS-3/AWS-1/PCS vs. AWS/cellular/PCS)",S+"Broadband Breakfast; Verizon 10-Q Q2 2026"),
 ("echostar-att","2026-07-28","n77 (3.45 GHz), B71/n71 (600 MHz)","EchoStar","AT&T","CURRENT","closed",S+"AT&T 8-K"),
 ("tmobile-grain","2026-08-10","B26 (800 MHz, 817-824/862-869), B71","T-Mobile","Grain Management","CURRENT","800 MHz sold for $2.9B cash plus Grain's 600 MHz licences; the ex-Sprint 800 MHz slice touches both B26 and B27",S+"T-Mobile 10-Q Q3 2026"),
 ("grain-spacex","2026-10","B26 (800 MHz)","Grain Management","SpaceX","UNVERIFIED","only a news headline ('reportedly agreed'), FCC status unknown",S+"Google News / Yahoo Finance headline"),
 ("echostar-spacex-final","2027-11-30","B70/n70 downlink, B66 2180-2200, B23 (AWS-4 / H-block)","EchoStar (trust)","SpaceX","PENDING","final transfer expected on or about this date",ECHO),
]
spectrum = [{"id":i,"date":d,"bands":b,"from":f,"to":t,"status":st,"note":n,"as_of":AS_OF,"source":src} for i,d,b,f,t,st,n,src in SPECTRUM]

# T34: carrier codes (MCC-MNC) parsed from the two tables at the top of content/carrier-codes.md (the "T27 follow-up" table has no
# status column in the same place and every row is UNVERIFIED, so it is skipped). Every code gets its own row with the row's status.
# Rows written as a range ("310-200 to 310-310 (several)") are skipped: they are HISTORICAL and can't be split safely.
import re
CC_AS_OF = "2026-11-01"
CC_SRC = "content/carrier-codes.md (DRAFT v2): US registry (ATIS HNI Assignments via https://imsiadmin.com/assignments/hni/, fetched 2026-11-01) for who holds the code; Wikipedia 'Mobile network codes in ITU region 3xx' (fetched 2026-10-31) for use and brand; ITU list not checked"
codes = []
skipped_codes = []
_sec = ""
for line in open("content/carrier-codes.md", encoding="utf-8"):
    if line.startswith("## "): _sec = line
    if not (_sec.startswith("## The big carriers") or _sec.startswith("## Other codes seen")): continue
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    if len(cells) != 5 or not re.match(r"\d{3}-\d{3}", cells[0]): continue
    codes_txt, shows, who, status, note = cells
    if " to " in codes_txt or "several" in codes_txt:
        skipped_codes.append(codes_txt); continue
    for code in re.findall(r"\d{3}-\d{3}", codes_txt):
        mcc, mnc = code.split("-")
        codes.append({"id":code,"mcc":mcc,"mnc":mnc,"shows_as":shows,"operator":who,"status":status,"note":note,"as_of":CC_AS_OF,"source":CC_SRC})
assert len({c["id"] for c in codes}) == len(codes), "duplicate carrier code"

# A5: "core" was misleading. Now: has_carrier_rows (any carrier row) and us_active_claim (a CURRENT/PLANNED claim).
rows_by_band = {}
for u in use: rows_by_band.setdefault(u["band"], []).append(u)
defs = json.loads(subprocess.check_output([sys.executable, "content/tools/extract_band_definitions.py"]))
for d in defs:
    r = rows_by_band.get(d["id"], [])
    d["has_carrier_rows"] = bool(r)
    d["us_active_claim"] = any(x["claim"] in ("CURRENT","PLANNED") for x in r)
# T33: FR1/FR2 edges (band_verification.md, table C "Other block/frequency facts"; Wikipedia 5G NR page citing 3GPP TS 38.101-1/-2).
# The FR2-1/FR2-2 split is NOT included: the research could not verify it.
FRSRC = "docs/research/notes/band_verification.md section C; Wikipedia 5G NR frequency bands (oldid 1382980478), citing 3GPP TS 38.101-1 V19.3.1 and TS 38.101-2 V19.2.0; not yet compared with the 3GPP documents themselves (T07)"
RANGES = [
 {"id":"FR1","name":"Frequency Range 1 (below 7.125 GHz)","low_mhz":410,"high_mhz":7125,"text":"410 to 7125 MHz"},
 {"id":"FR2","name":"Frequency Range 2 (mmWave)","low_mhz":24250,"high_mhz":71000,"text":"24.25 to 71 GHz"},
]
ranges = [dict(r, status="CURRENT", as_of=AS_OF, source=FRSRC) for r in RANGES]
json.dump({"as_of":AS_OF,"carriers":CARRIERS,"bands":defs,"carrier_use":use,"spectrum_changes":spectrum,"frequency_ranges":ranges,"carrier_codes":codes}, open("content/bands.json","w"), indent=1, ensure_ascii=False)
open("content/bands.json","a").write("\n")

o = ["# US bands data file: DRAFT v2","",
 f"**As of:** {AS_OF} · **Built by:** the robot, tasks T06 and T43 · **Made by:** `python3 content/tools/build_bands.py` (don't edit by hand; edit the script or the research notes)","",
 "**Status of the whole file:** DRAFT. Band numbers and frequencies are copied from Wikipedia's band pages, which copy the official 3GPP documents (Release 19). Nobody has yet compared them to the 3GPP documents themselves (task T07). Carrier facts come from search-result summaries and are mostly UNVERIFIED.","",
 "**What this is (simple words):** A table of every phone band the research found that matters in the US: its band number, the frequencies it uses, and which companies use it. Every row says how sure we are, when we checked, and where the fact came from. The app reads `bands.json`; this page is the same data for people.","",
 "**Status words:** CURRENT (in use now) · HISTORICAL (used before, not now) · PENDING (a sale or change is in progress) · PLANNED (not built yet) · UNVERIFIED (a claim nobody has checked; the app must never quiz on it).","",
 "## 1. Band definitions (frequencies)","",
 f"Every row: status CURRENT (the band exists in the standard), as of {AS_OF}. `Rows` = some carrier row mentions this band; `Active` = a CURRENT or PLANNED carrier claim (not the same as trusted). The rest are 'defined by 3GPP' only. Source column is in `bands.json` (one source per table). Frequencies in MHz unless a row says GHz.",""]
for kind,title in [("LTE","LTE bands"),("LTE-satellite","LTE satellite bands (B252 etc. are satellite bands, not LTE-U)"),("NR-FR1","5G NR bands, FR1 (below 7.125 GHz)"),("NR-FR2","5G NR bands, FR2 (mmWave, GHz)"),("NR-satellite","5G NR satellite bands")]:
    o += [f"### {title}","","| Band | Rows | Active | Name | Uplink | Downlink | Duplex | Spacing | Relations | Checked how |","|---|---|---|---|---|---|---|---|---|---|"]
    for d in defs:
        if d["kind"]==kind:
            f=lambda s:s.replace("|","/")
            o.append(f"| {d['id']} | {'yes' if d['has_carrier_rows'] else ''} | {'yes' if d['us_active_claim'] else ''} | {f(d['name'])} | {f(d['uplink'])} | {f(d['downlink'])} | {f(d['duplex'])} | {f(d['duplex_spacing_mhz'])} | {f(d['relations'])} | {f(d['verification'])} |")
    o.append("")
o += ["## 2. Which carrier uses which band","",
 f"Source for every row: {CSRC}. As of {AS_OF}. 'Claim' is what the research said; 'Status' is what we trust. Only claims with a cited source keep their status; the rest are UNVERIFIED until checked (the re-check is part of the 'Keep it fresh' level).",""]
for tech in ("LTE","NR"):
    o += [f"### {tech}","","| Band | Carrier | Claim | Status | Evidence | Note |","|---|---|---|---|---|---|"]
    o += [f"| {u['band']} | {u['carrier']} | {u['claim']} | {u['status']} | {u['evidence']} | {u['note']}{(' (weak: '+u['weak_note']+')') if u['weak_note'] else ''} |" for u in use if u["tech"]==tech]
    o.append("")
o += ["## 3. Spectrum changes (who owns the licences; not the same as 'uses the band')","",
 "A sale changes who owns a slice of spectrum. It does not always mean a phone sees that band on that company's towers (for example SpaceX plans satellite use). Statuses here: CURRENT = the deal closed; PENDING = announced or approved, not closed; UNVERIFIED = a report only.","",
 "| Date | Bands | From | To | Status | Note |","|---|---|---|---|---|---|"]
o += [f"| {x['date']} | {x['bands']} | {x['from']} | {x['to']} | {x['status']} | {x['note']} |" for x in spectrum]
o += ["","Sources for each row are in `bands.json` (`spectrum_changes`). Same caveat as section 2: they come from search summaries, and the pages themselves were not opened.","",
 "## 4. Frequency ranges (FR1 and FR2)","",
 "| Id | Name | Range | Status |","|---|---|---|---|"] + [f"| {r['id']} | {r['name']} | {r['text']} | {r['status']} |" for r in ranges] + ["",
 f"As of {AS_OF}. Source: {FRSRC}. The FR2-1 / FR2-2 split is not included because the research could not verify it.","",
 "## 5. Known problems (from the research and the T42 review)","",
 "- B252 and B255 are satellite bands in the current standard. The older notes called them LTE-U; that meaning is dropped.",
 "- B23 is marked 'not applicable' by Wikipedia, so it is HISTORICAL with `not_applicable: true`; the app must not quiz it as live. B70's channel-size note is unclear (the 25 MHz size is an NR thing, not LTE).",
 "- n250, n251, n510, n511 have different uplink and downlink widths but plain 'FDD'. Probably right (that is how Wikipedia prints them); check in T07.",
 "- Twin bands can disagree on 'Rows' (B13 has carrier rows, n13 has none) because the research matrix only lists some NR bands.",
 "- Left out on purpose (all unverified): B48 private/cable [U], B13 Appalachian [U], legacy UScellular NR rows [W]. UScellular's network is now T-Mobile's.",
 "- AST SpaceMobile direct-to-cell on AT&T/Verizon 700/850 MHz is satellite service, not a carrier row; not modelled yet.",
 "- Wikipedia's carrier lists are older than the 2026 spectrum sales (T-Mobile 800 MHz, UScellular, EchoStar), so they are not used for status.",
 "- C Spire's band list is unsettled (weak sources only). The NR carrier table has no cited source for most rows.",
 "- Not yet checked against the 3GPP documents: task T07. Carrier-code list: `content/carrier-codes.md`.",""]
open("content/bands.md","w").write("\n".join(o))
print(len(codes),"carrier codes (",sum(c['status']=='CURRENT' for c in codes),"CURRENT; skipped:",skipped_codes,")")
print(len(defs),"bands,",len(use),"carrier rows,",sum(u['status']!='UNVERIFIED' for u in use),"with a trusted status")
