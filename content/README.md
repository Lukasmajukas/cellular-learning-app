# content/ (facts and lessons)

Facts live here, separate from the app's code, so updating a fact means changing one line, not rebuilding the app.

- **`bands.md` / `bands.json`:** every band with its frequencies and which carrier uses it, each with a status, date and source. DRAFT v2. Built in T06, reviewed in T42 (`docs/reviews/2026-10-31-bands-review.md`), fixed in T43: one band per row with plain number fields (`ul_low_mhz` etc., in MHz), carrier rows with shared carrier ids, and a separate `spectrum_changes` list for sales. `bands.json` is what the app reads; `bands.md` is the same data to read. Both are made by `python3 content/tools/build_bands.py`.
- **`carrier-codes.md`:** which number tag (MCC/MNC) means which carrier. DRAFT.
- **`tools/`:** the small programs that build the bands files from `docs/research/notes/`.
- **Later:** lesson files (questions and explanations for each unit) and image credits.
