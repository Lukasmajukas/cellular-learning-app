# content/ (facts and lessons)

Facts live here, separate from the app's code, so updating a fact means changing one line, not rebuilding the app.

- **`bands.md` / `bands.json`:** every band with its frequencies and which carrier uses it, each with a status, date and source. DRAFT v2. Built in T06, reviewed in T42 (`docs/reviews/2026-10-31-bands-review.md`), fixed in T43: one band per row with plain number fields (`ul_low_mhz` etc., in MHz), carrier rows with shared carrier ids, and a separate `spectrum_changes` list for sales. `bands.json` is what the app reads; `bands.md` is the same data to read. Both are made by `python3 content/tools/build_bands.py`.
- **`sites.json`:** tower and site facts (types, the 200 ft rule, signs, owners), each with status, date, source and grade. Made by `python3 content/tools/build_sites.py`; lessons point at rows as `site:<id>`.
- **`hardware.json`:** tower hardware facts for unit 8 (box types, port counts, model-name decoding, which carrier's filings list which model), each with status, date, source and grade. Made by `python3 content/tools/build_hardware.py`; lessons point at rows as `hardware:<id>`. Rows marked `quiz: false` are taught but never asked.
- **`cell-ids.json`:** cell types and ID facts for unit 9 (sectors, the eNB x 256 + cell maths, PCI, channel-number ranges, the 5G split, phone test screens). Made by `python3 content/tools/build_cell_ids.py`; lessons point at rows as `cellid:<id>`. Forum-only patterns are `quiz: false`.
- **`carrier-codes.md`:** which number tag (MCC/MNC) means which carrier. DRAFT.
- **`tools/`:** the small programs that build the bands files from `docs/research/notes/`.
- **`tools/check_content.py`:** the fact checker (T28). Run `python3 content/tools/check_content.py` before every build; `python3 -m unittest discover content/tools` runs its tests. It checks every fact, and (once they exist) lessons, `photos/credits.yaml` and `question-ids.json`. Rules are in `docs/DECISIONS.md` (2026-11-01).
- **Later:** lesson files (questions and explanations for each unit) and image credits.
