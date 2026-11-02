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


if __name__ == "__main__":
    unittest.main()