# Handoff note: 2026-11-01, T31 Design units 1-3

**Status:** DONE
**Model used:** Large (Opus), High effort (robot worker, took over the claim in pull request #40) · **Branch / pull request:** `claude/robot-run`, #40

## In simple words (for the owner)
I wrote the lesson plan for the first three units, like a teacher planning the first three weeks: 15 short lessons, which band facts each one teaches, in what order, and which kind of question each step uses. I found that most "which carrier uses this band" facts for low and mid band aren't checked yet. So, for now, the lessons teach the bands themselves plus only the checked carrier facts, and a new task checks the rest.

## What was done
- New: `docs/curriculum/units-1-3.md` (DRAFT v1, ready to build from):
  - shared lesson rules: lesson shape, item types, wrong-choice rule, feedback, what may be quizzed, IDs;
  - a lesson-file format sketch with templates, so no frequency is typed;
  - unit 1 (spectrum ruler), unit 2 (low band) and unit 3 (mid band), lesson by lesson, every item with its fact references and label;
  - a table of every fact used and its status;
  - hand-off lists for T32 and T33.
- Checked by script: all 44 fact references in the plan exist in `content/bands.json`, and every `{band:ID.field}` template points at a filled field. The only UNVERIFIED reference (change:8, the Grain → SpaceX B26 headline) is marked "not shown".
- TASKS: T31 ticked; T32 and T33 rows point at the plan; new T47 (⭐ check the carrier facts units 2–3 need) and T48 (owner, optional: two small questions).
- DECISIONS: 5 rows (the tier rule, checked-carriers-only with the wrong-choice rule, the lesson shape, the new IDs, templates). GLOSSARY: 8 words.
- Panel: `panel/live.json` updated and `panel/index.html` rebuilt; **panel not republished (robot run)**.

## What's next
- Next task: T47 (check the carrier facts), model: Medium (Sonnet), effort: Medium, type: `Do the next task in TASKS.md`. T32 (question types) can run in parallel; T33 comes after T32.

## Decisions made (also added to docs/DECISIONS.md)
- Tier rule: low < 1000 MHz, high = FR2, mid = the rest of FR1, worked out from the data.
- Only checked carrier facts are quizzed; unchecked ones are greyed out and never used as wrong choices; every wrong choice must be proven wrong by a checked fact.
- 4 lessons + a no-hints checkpoint per unit, 12–15 items, one band family per lesson, mixing in review steps; no true/false.
- New IDs (`unit01-l1`…); the sample IDs are never reused (the owner's save file has stars on them).
- Lesson files use `{band:ID.field}` templates and `answer_from:`; band numbers exact, MHz ±5.

## Questions for the owner
- T48 (optional): keep a few exact numbers to type, or fewer or more? Is the tier rule OK? Defaults: keep as is; yes.

## New words (also added to GLOSSARY.md)
- Learn card, checkpoint, wrong choices (distractors), nesting bands, upside-down band, downlink-only band (SDL), interleaving, tier.

## Notes for the next Claude
- Approvals and blocks in this run: nothing asked for approval and nothing was blocked. I didn't start any other chat. The title change (`set_session_title`) went through.
- The plan's "After T47" items must stay out of the lesson files until T47 marks those carrier rows CURRENT; the checker would refuse them anyway.
- FR1/FR2 edges are verified in `band_verification.md` but aren't rows in `bands.json`; T33 adds a `frequency_ranges` list and teaches the checker `range:FR1` / `range:FR2`.
- `change:5` (Array → Verizon) has a disputed band list: use only its buyer and date.
- The bands file marks more upside-down bands than B13/B14/B71 (B24, B103, satellite bands, n105). Lessons must say "the ones you'll meet most", not "the only ones".
- Concept items marked [concept] in the plan (reach vs speed, uplink meaning, 1 GHz = 1000 MHz) rest on no data row; the T37 review should check their wording.
