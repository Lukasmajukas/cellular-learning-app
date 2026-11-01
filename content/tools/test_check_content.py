"""Tests for the fact checker. Run: python3 -m unittest discover content/tools"""
import json
import tempfile
import unittest
from pathlib import Path

import check_content as cc

GOOD = {"status": "CURRENT", "as_of": "2026-11-01", "source": "x"}


def make(tmp, bands=None, credits=None, questions=None, locked=None):
    root = Path(tmp)
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

    def test_missing_locked_id_fails(self):
        e = self.check(questions=[{"id": "q2", "facts": ["band:B2"]}], locked=["q1"])
        self.assertTrue(any("locked" in x for x in e))

    def test_duplicate_id_fails(self):
        e = self.check(questions=[{"id": "q1", "facts": ["band:B2"]}, {"id": "q1", "facts": ["band:B2"]}])
        self.assertTrue(any("duplicate" in x for x in e))


if __name__ == "__main__":
    unittest.main()
