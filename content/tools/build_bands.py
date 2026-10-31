"""Builds content/bands.json and content/bands.md. Run from the repo root:
   python3 content/tools/build_bands.py
Band definitions come from the tables in band_verification.md (via extract_band_definitions.py).
Carrier use comes from the carrier x band matrix in docs/research/notes/us_bands.md.
Rule: only a matrix claim tagged [S] (has a cited source) keeps its status. Claims tagged
[U] (unverified) or [W] (weak source) become UNVERIFIED, with the original claim kept."""
import json, subprocess, sys
AS_OF = "2026-10-31"
CSRC = "docs/research/notes/us_bands.md, carrier x band matrix (built from web-search summaries; SEC/FCC/press pages were not reachable)"
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
defs = json.loads(subprocess.check_output([sys.executable, "content/tools/extract_band_definitions.py"]))
use = [{"tech":t,"band":b,"carrier":c,"claim":cl,"status":(cl if ev=="S" else "UNVERIFIED"),
        "evidence":{"S":"cited source","W":"weak source","U":"unverified background knowledge"}[ev],
        "note":n,"as_of":AS_OF,"source":CSRC} for t,b,c,cl,ev,n in C]
core = {b for _,b,*_ in C for b in b.split("/")}
for d in defs:
    d["core"] = any(p in core for p in d["id"].split("/"))
json.dump({"as_of":AS_OF,"bands":defs,"carrier_use":use}, open("content/bands.json","w"), indent=1, ensure_ascii=False)
open("content/bands.json","a").write("\n")

o = ["# US bands data file: DRAFT v1","",
 f"**As of:** {AS_OF} · **Built by:** the robot, task T06 · **Made by:** `python3 content/tools/build_bands.py` (don't edit by hand; edit the script or the research notes)","",
 "**Status of the whole file:** DRAFT. Band numbers and frequencies are copied from Wikipedia's band pages, which copy the official 3GPP documents (Release 19). Nobody has yet compared them to the 3GPP documents themselves (task T07). Carrier facts come from search-result summaries and are mostly UNVERIFIED.","",
 "**What this is (simple words):** A table of every phone band the research found that matters in the US: its band number, the frequencies it uses, and which companies use it. Every row says how sure we are, when we checked, and where the fact came from. The app reads `bands.json`; this page is the same data for people.","",
 "**Status words:** CURRENT (in use now) · HISTORICAL (used before, not now) · PENDING (a sale or change is in progress) · PLANNED (not built yet) · UNVERIFIED (a claim nobody has checked; the app must never quiz on it).","",
 "## 1. Band definitions (frequencies)","",
 f"Every row: status CURRENT (the band exists in the standard), as of {AS_OF}. `core` = a band some US carrier is claimed to use; the rest are 'defined by 3GPP' only. Source column is in `bands.json` (one source per table). Frequencies in MHz unless a row says GHz.",""]
for kind,title in [("LTE","LTE bands"),("LTE-satellite","LTE satellite bands (B252 etc. are satellite bands, not LTE-U)"),("NR-FR1","5G NR bands, FR1 (below 7.125 GHz)"),("NR-FR2","5G NR bands, FR2 (mmWave, GHz)"),("NR-satellite","5G NR satellite bands")]:
    o += [f"### {title}","","| Band | Core | Name | Uplink | Downlink | Duplex | Spacing | Relations | Checked how |","|---|---|---|---|---|---|---|---|---|"]
    for d in defs:
        if d["kind"]==kind:
            f=lambda s:s.replace("|","/")
            o.append(f"| {d['id']} | {'yes' if d['core'] else ''} | {f(d['name'])} | {f(d['uplink'])} | {f(d['downlink'])} | {f(d['duplex'])} | {f(d['duplex_spacing_mhz'])} | {f(d['relations'])} | {f(d['verification'])} |")
    o.append("")
o += ["## 2. Which carrier uses which band","",
 f"Source for every row: {CSRC}. As of {AS_OF}. 'Claim' is what the research said; 'Status' is what we trust. Only claims with a cited source keep their status; the rest are UNVERIFIED until checked (the re-check is part of the 'Keep it fresh' level).",""]
for tech in ("LTE","NR"):
    o += [f"### {tech}","","| Band | Carrier | Claim | Status | Evidence | Note |","|---|---|---|---|---|---|"]
    o += [f"| {u['band']} | {u['carrier']} | {u['claim']} | {u['status']} | {u['evidence']} | {u['note']} |" for u in use if u["tech"]==tech]
    o.append("")
o += ["## 3. Known problems (from the research)","",
 "- B252 and B255 are satellite bands in the current standard. The older notes called them LTE-U; that meaning is dropped.",
 "- B23 is marked 'not applicable' by Wikipedia. B70's channel-size note is unclear (the 25 MHz size is an NR thing, not LTE).",
 "- Wikipedia's carrier lists are older than the 2026 spectrum sales (T-Mobile 800 MHz, UScellular, EchoStar), so they are not used for status.",
 "- C Spire's band list is unsettled (weak sources only). The NR carrier table has no cited source for most rows.",
 "- Not yet checked against the 3GPP documents: task T07. Carrier-code list: `content/carrier-codes.md`.",""]
open("content/bands.md","w").write("\n".join(o))
print(len(defs),"bands,",len(use),"carrier rows,",sum(u['status']!='UNVERIFIED' for u in use),"with a trusted status")
