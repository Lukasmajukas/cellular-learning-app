"""Tests for the fact checker. Run: python3 -m unittest discover content/tools"""
import json
import tempfile
import unittest
from pathlib import Path

import check_content as cc

GOOD = {"status": "CURRENT", "as_of": "2026-11-01", "source": "x"}


def make(tmp, bands=None, credits=None, questions=None, locked=None, sites=None):
    root = Path(tmp)
    if sites is not None:
        (root / "sites.json").write_text(json.dumps(sites))
    (root / "bands.json").write_text(json.dumps(bands or {"bands": [dict(id="B2", **GOOD), dict(id="B9", status="UNVERIFIED", as_of="2026-11-01", source="x")]}))
    if credits is not None:
        (root / "photos").mkdir()
        import yaml
        (root / "photos" / "credits.yaml").write_text(yaml.safe_dump(credits))
    if questions is not None:
        (root / "lessons" / "unit-01").mkdir(parents=True)
        import yaml
        (root / "lessons" / "unit-01" / "a.yaml").write_text(yaml.safe_dump({"questions": questions}))
    if locked is not None:
        (root / "question-ids.json").write_text(json.dumps({"ids": locked}))
    return root


class Checker(unittest.TestCase):
    def check(self, **kw):
        with tempfile.TemporaryDirectory() as t:
            return cc.run(make(t, **kw))

    def test_real_content_passes(self):
        self.assertEqual(cc.run(Path(__file__).resolve().parent.parent), [])

    def test_fact_without_source_fails(self):
        e = self.check(bands={"bands": [{"id": "B1", "status": "CURRENT", "as_of": "2026-11-01"}]})
        self.assertTrue(any("source missing" in x for x in e))

    def test_fact_without_status_or_bad_date_fails(self):
        e = self.check(bands={"bands": [{"id": "B1", "source": "s", "as_of": "soon"}]})
        self.assertEqual(len(e), 2)

    def test_frequency_range_needs_source_and_is_referable(self):
        e = self.check(bands={"bands": [], "frequency_ranges": [{"id": "FR1", "status": "CURRENT", "as_of": "2026-11-01"}]})
        self.assertTrue(any("frequency_range FR1" in x and "source missing" in x for x in e))
        bands = {"bands": [], "frequency_ranges": [dict(id="FR1", **GOOD)]}
        with tempfile.TemporaryDirectory() as t:
            idx = cc.fact_index(bands, [])
        self.assertIn("range:FR1", idx)

    def site(self, **kw):
        row = dict(id="type:x", kind="type", grade="C", text="A thing that looks odd.", **GOOD)
        row.update(kw)
        return {"sites": [row]}

    def test_good_site_row_passes_and_is_referable(self):
        self.assertEqual(self.check(sites=self.site(), questions=[{"id": "q1", "facts": ["site:type:x"]}]), [])

    def test_site_row_needs_source_grade_and_text(self):
        e = self.check(sites=self.site(source="", grade="Z", text=""))
        self.assertTrue(any("source missing" in x for x in e))
        self.assertTrue(any("grade must be" in x for x in e))
        self.assertTrue(any("text missing" in x for x in e))

    def test_grade_c_site_row_may_not_carry_numbers(self):
        e = self.check(sites=self.site(text="About 120 m tall."))
        self.assertTrue(any("may not carry numbers" in x for x in e))
        self.assertEqual(self.check(sites=self.site(grade="A", text="Over 200 ft needs a registration.")), [])

    def test_site_row_with_phone_number_fails(self):
        e = self.check(sites=self.site(grade="A", text="Call 877-282-7483 for problems."))
        self.assertTrue(any("phone number" in x for x in e))

    def test_unverified_site_answer_fails(self):
        e = self.check(sites=self.site(status="UNVERIFIED"), questions=[{"id": "q1", "facts": ["site:type:x"]}])
        self.assertTrue(any("UNVERIFIED" in x for x in e))

    def test_unverified_answer_fails(self):
        e = self.check(questions=[{"id": "q1", "facts": ["band:B9"]}])
        self.assertTrue(any("UNVERIFIED" in x for x in e))

    def test_good_question_passes(self):
        self.assertEqual(self.check(questions=[{"id": "q1", "facts": ["band:B2"]}]), [])

    def test_unknown_fact_fails(self):
        e = self.check(questions=[{"id": "q1", "facts": ["band:B99"]}])
        self.assertTrue(any("does not exist" in x for x in e))

    def test_historical_needs_label(self):
        b = {"bands": [{"id": "B1", "status": "HISTORICAL", "as_of": "2026-11-01", "source": "s"}]}
        self.assertTrue(self.check(bands=b, questions=[{"id": "q1", "facts": ["band:B1"]}]))
        self.assertEqual(self.check(bands=b, questions=[{"id": "q1", "facts": ["band:B1"], "label": "history"}]), [])

    def test_bad_licence_fails(self):
        p = [{"id": "p1", "file": "a.webp", "source_url": "u", "author": "me", "licence": "CC BY-NC", "date_checked": "2026-11-01"}]
        e = self.check(credits=p)
        self.assertTrue(any("not allowed" in x for x in e))

    def test_good_photo_passes_and_ai_identify_fails(self):
        p = {"id": "p1", "file": "a.webp", "source_url": "u", "author": "me", "licence": "CC BY-SA", "date_checked": "2026-11-01"}
        self.assertEqual(self.check(credits=[p]), [])
        e = self.check(credits=[dict(p, ai_generated=True)], questions=[{"id": "q1", "facts": ["band:B2"], "photo": "p1", "kind": "identify"}])
        self.assertTrue(any("AI-made" in x for x in e))

    def test_ai_made_photo_fails_in_picture_questions(self):
        p = {"id": "p1", "file": "a.webp", "source_url": "u", "author": "me", "licence": "CC0", "date_checked": "2026-11-01", "ai_made": True}
        for kind in ("photo-choice", "tap-clue"):
            e = self.check(credits=[p], questions=[{"id": "q1", "facts": ["band:B2"], "photo": "p1", "kind": kind}])
            self.assertTrue(any("AI-made" in x for x in e), kind)

    def test_missing_locked_id_fails(self):
        e = self.check(questions=[{"id": "q2", "facts": ["band:B2"]}], locked=["q1"])
        self.assertTrue(any("locked" in x for x in e))

    def test_duplicate_id_fails(self):
        e = self.check(questions=[{"id": "q1", "facts": ["band:B2"]}, {"id": "q1", "facts": ["band:B2"]}])
        self.assertTrue(any("duplicate" in x for x in e))


class CodesAndIcons(unittest.TestCase):
    def test_code_fact_is_referable_and_needs_source(self):
        bands = {"bands": [], "carrier_codes": [dict(id="310-260", **GOOD)]}
        errs = []
        self.assertIn("code:310-260", cc.fact_index(bands, errs))
        self.assertEqual(errs, [])
        e = []
        cc.fact_index({"carrier_codes": [{"id": "310-260", "status": "CURRENT", "as_of": "2026-11-01"}]}, e)
        self.assertTrue(any("carrier_code 310-260" in x and "source missing" in x for x in e))

    def test_bad_code_id_fails(self):
        e = []
        cc.fact_index({"carrier_codes": [dict(id="3105", **GOOD)]}, e)
        self.assertTrue(any("must look like 310-260" in x for x in e))

    def test_unverified_code_blocks_a_question(self):
        bands = {"bands": [], "carrier_codes": [dict(id="310-004", status="UNVERIFIED", as_of="2026-11-01", source="x")]}
        q = [dict(id="u1", facts=["code:310-004"])]
        with tempfile.TemporaryDirectory() as t:
            e = cc.run(make(t, bands=bands, questions=q))
        self.assertTrue(any("UNVERIFIED fact code:310-004" in x for x in e))

    def test_good_code_allows_a_question(self):
        bands = {"bands": [], "carrier_codes": [dict(id="310-260", **GOOD)]}
        q = [dict(id="u1", facts=["code:310-260"])]
        with tempfile.TemporaryDirectory() as t:
            self.assertEqual(cc.run(make(t, bands=bands, questions=q)), [])

    def test_icon_only_on_current_rows(self):
        row = dict(tech="NR", band="n77", carrier_id="att", icon="5G+")
        e = []
        cc.fact_index({"carrier_use": [dict(row, **GOOD)]}, e)
        self.assertEqual(e, [])
        e = []
        cc.fact_index({"carrier_use": [dict(row, status="UNVERIFIED", as_of="2026-11-01", source="x")]}, e)
        self.assertTrue(any("icon" in x for x in e))


class HardwareAndCellIds(unittest.TestCase):
    ROOT = Path(__file__).resolve().parent.parent

    def kb(self, key, **kw):
        row = dict(id="form:x", kind="form", grade="W", text="A plain box.", **GOOD)
        row.update(kw)
        return [row]

    def errs(self, rows, kinds=None, prefix="hardware"):
        e = []
        cc.check_kb(rows, "hardware", prefix, kinds or cc.HARDWARE_KINDS, e)
        return e

    def test_good_row_passes_and_is_referable(self):
        e = []
        idx = cc.check_kb(self.kb("h"), "hardware", "hardware", cc.HARDWARE_KINDS, e)
        self.assertEqual(e, [])
        self.assertIn("hardware:form:x", idx)

    def test_missing_source_bad_grade_and_bad_kind_fail(self):
        self.assertTrue(any("source missing" in x for x in self.errs(self.kb("h", source=""))))
        self.assertTrue(any("grade must be" in x for x in self.errs(self.kb("h", grade="Z"))))
        self.assertTrue(any("kind must be" in x for x in self.errs(self.kb("h", kind="bogus"))))

    def test_inference_row_must_hedge(self):
        self.assertTrue(any("must say" in x for x in self.errs(self.kb("h", grade="inference", text="It is exactly so."))))
        self.assertEqual(self.errs(self.kb("h", grade="inference", text="It is usually so.")), [])

    def test_forum_row_must_be_never_quizzed(self):
        row = self.kb("h", grade="C", text="A community pattern, may have changed.")
        self.assertTrue(any("quiz: false" in x for x in self.errs(row)))
        self.assertEqual(self.errs([dict(row[0], quiz=False)]), [])

    def test_quiz_false_row_blocks_a_question(self):
        row = dict(id="weight:x", kind="weight", grade="T", text="Roughly 12 kg.", quiz=False, **GOOD)
        with tempfile.TemporaryDirectory() as t:
            root = make(t, questions=[dict(id="u1", facts=["hardware:weight:x"])])
            (root / "hardware.json").write_text(json.dumps({"hardware": [row]}))
            e = cc.run(root)
        self.assertTrue(any("taught only" in x for x in e))

    def test_unverified_cell_id_row_blocks_a_question(self):
        row = dict(id="nr:pci", kind="nr", grade="gap", text="PCI is 0 to 1007.", status="UNVERIFIED", as_of="2026-11-01", source="x")
        with tempfile.TemporaryDirectory() as t:
            root = make(t, questions=[dict(id="u1", facts=["cellid:nr:pci"])])
            (root / "cell-ids.json").write_text(json.dumps({"cell_ids": [row]}))
            e = cc.run(root)
        self.assertTrue(any("UNVERIFIED fact cellid:nr:pci" in x for x in e))

    # ---- cross-checks against the real files ----
    def load(self, name):
        return json.loads((self.ROOT / name).read_text(encoding="utf-8"))

    def test_earfcn_ranges_match_bands_file(self):
        bands = {b["id"]: b for b in self.load("bands.json")["bands"]}
        rows = [r for r in self.load("cell-ids.json")["cell_ids"] if r["id"].startswith("lte:earfcn-b")]
        self.assertEqual(len(rows), 4)
        for r in rows:
            v = r["values"]
            b = bands[v["band"]]
            channels = v["n_high"] - v["n_low"] + 1
            self.assertAlmostEqual(channels * 0.1, b["dl_high_mhz"] - b["dl_low_mhz"], places=6, msg=r["id"])
            self.assertIn(f"{b['dl_low_mhz']:g} to {b['dl_high_mhz']:g} MHz", r["text"], r["id"])
            self.assertIn(f"{v['n_low']} to {v['n_high']}", r["text"], r["id"])

    def test_panel_band_letters_match_bands_file(self):
        bands = {b["id"]: b for b in self.load("bands.json")["bands"]}
        text = next(r for r in self.load("hardware.json")["hardware"] if r["id"] == "ports:panel-length")["text"]
        self.assertIn("698 to 896 MHz", text)
        self.assertIn("1710 to 2180 MHz", text)
        for b in ("B5", "B12", "B13"):
            self.assertTrue(698 <= bands[b]["dl_low_mhz"] and bands[b]["dl_high_mhz"] <= 896, b)
        for b in ("B2", "B4"):
            self.assertTrue(1710 <= bands[b]["dl_low_mhz"] and bands[b]["dl_high_mhz"] <= 2180, b)

    def test_worked_arithmetic(self):
        v = next(r for r in self.load("cell-ids.json")["cell_ids"] if r["id"] == "lte:eci")["values"]
        self.assertEqual(v["eci_bits"], v["enb_bits"] + v["cell_bits"])
        self.assertEqual(2 ** v["cell_bits"], v["multiplier"])
        self.assertEqual(102006 * v["multiplier"] + 2, 26113538)       # the research's worked example
        self.assertEqual(divmod(26113538, v["multiplier"]), (102006, 2))
        n = next(r for r in self.load("cell-ids.json")["cell_ids"] if r["id"] == "nr:nci")["values"]
        nci = 102006 * 2 ** (n["nci_bits"] - 24) + 5                   # a 24-bit gNB ID
        self.assertEqual(divmod(nci, 2 ** (n["nci_bits"] - 24)), (102006, 5))
        self.assertNotEqual(nci >> (n["nci_bits"] - 22), nci >> (n["nci_bits"] - 24))   # the length matters
        b66 = next(r for r in self.load("cell-ids.json")["cell_ids"] if r["id"] == "lte:earfcn-b66")["values"]
        self.assertAlmostEqual(2110 + 0.1 * (66786 - b66["n_low"]), 2145.0)  # the research's worked example

    def test_uncertain_rows_are_marked(self):
        rows = {r["id"]: r for r in self.load("cell-ids.json")["cell_ids"]}
        self.assertEqual(rows["lte:earfcn-other"]["status"], "UNVERIFIED")
        self.assertEqual(rows["nr:pci"]["status"], "UNVERIFIED")
        hw = {r["id"]: r for r in self.load("hardware.json")["hardware"]}
        self.assertEqual(hw["model:samsung-suffix"]["status"], "UNVERIFIED")
        self.assertIs(hw["weight:massive-mimo"].get("quiz"), False)
        for r in list(rows.values()):
            if r["grade"] == "C":
                self.assertIs(r.get("quiz"), False, r["id"])


if __name__ == "__main__":
    unittest.main()

class MadeUpNumbers(unittest.TestCase):
    """Unit 9 drill numbers are typed in the lessons, so the checker recomputes every one (decision G4)."""
    ROOT = Path(__file__).resolve().parent.parent

    def test_calc_examples(self):
        self.assertEqual(cc.calc_value({"eci": [102006, 2]}), 26113538)   # the research's worked example
        self.assertEqual(cc.calc_value({"enb": [26113538]}), 102006)
        self.assertEqual(cc.calc_value({"cell": [26113538]}), 2)
        self.assertEqual(cc.calc_value({"gnb": [417816578, 24]}), 102006)
        self.assertEqual(cc.calc_value({"mhz_b66": [66786]}), 2145)       # the research's worked B66 example
        self.assertEqual(cc.calc_value({"count": [3, 4]}), 12)
        self.assertIsNone(cc.calc_value({"eci": [1, 300]}))               # a cell number must fit in 8 bits
        self.assertIsNone(cc.calc_value({"gnb": [5, 40]}))                # gNB bits are 22 to 32
        self.assertIsNone(cc.calc_value({"bogus": [1]}))

    def test_wrong_answer_and_missing_calc_fail(self):
        q = dict(id="u9-x", kind="number", facts=["band:B2"], answer=13, calc={"count": [3, 4]})
        with tempfile.TemporaryDirectory() as t:
            e = cc.run(make(t, questions=[q]))
        self.assertTrue(any("does not match the calc" in x for x in e))
        q2 = dict(id="u9-y", kind="number", facts=["band:B2"], answer=12)
        with tempfile.TemporaryDirectory() as t:
            e = cc.run(make(t, questions=[q2]))
        self.assertTrue(any("needs a calc" in x for x in e))
        q3 = dict(q, answer=12)
        with tempfile.TemporaryDirectory() as t:
            self.assertFalse(any("calc" in x for x in cc.run(make(t, questions=[q3]))))

    def test_unit9_channel_numbers_land_in_the_right_band(self):
        import re, yaml
        ranges = {r["values"]["band"]: (r["values"]["n_low"], r["values"]["n_high"])
                  for r in json.loads((self.ROOT / "cell-ids.json").read_text())["cell_ids"] if r["id"].startswith("lte:earfcn-b") and "values" in r}
        seen = 0
        for f in sorted((self.ROOT / "lessons" / "unit-09").glob("*.yaml")):
            for q in yaml.safe_load(f.read_text())["questions"]:
                m = re.search(r"channel number (\d+)\. Which band|Channel (\d+) (?:is in which band|falls in)", q.get("prompt", ""))
                if q.get("kind") == "choice" and m:
                    n = int(m.group(1) or m.group(2))
                    right = q["choices"][q["answer"]]
                    self.assertIn(right, ranges, q["id"])
                    lo, hi = ranges[right]
                    self.assertTrue(lo <= n <= hi, f"{q['id']}: {n} is not in {right}")
                    seen += 1
        self.assertGreaterEqual(seen, 6)
