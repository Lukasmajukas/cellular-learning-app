# 🏁 Unit 10 design: the final challenge

**Status:** DRAFT v1 (plan only, no lessons written yet). Same pattern as `units-1-3.md`, `units-4-5.md`, `units-6-7.md` and `units-8-9.md`.
**Written:** 2026-11-02 by a robot run (Sonnet, Medium effort), first part of task T37.
**Built from:** `docs/PRD.md` (section 4a, unit 10: "put band, photo and ID clues together to name the carrier and site type; scenario puzzles, no hints"), the five earlier unit plans, `content/bands.json`, `content/sites.json`, `content/hardware.json`, `content/cell-ids.json`.

---

## In simple words

- Units 1–9 each taught one kind of clue. **Unit 10 teaches no new facts.** It is a detective unit: you get a small "case" with 2 to 4 clues (a band, a photo, a phone screen, a sign) and you work out what it tells you, one clue at a time.
- **Big catch:** today only **8** "which carrier uses which band" rows are checked (T-Mobile n41 and n71; AT&T n77; Verizon n77, n260, n261; Cellcom n5 and n261). The other 52 are UNVERIFIED (T47). A case can only say "this is carrier X" when the clues rest on checked rows, a carrier sticker, or a checked carrier code. Everywhere else the case asks for **what kind of site, what band group, what the ID numbers mean**, which is the lasting skill anyway.
- The "answer" of a case is never a guess: every case ends with a **chain of evidence** sentence (frequency → band → who holds it → proof on the ground), the PRD's teaching rule.

---

## 1. What I found (and what it changes)

| # | Finding | What it changes |
|---|---|---|
| F1 | **No new data is needed.** Every fact a case uses already lives in a data file and is checked for status, date and source. | No new data file and no new fact kind. Cases use only existing `facts:` references; the checker already refuses UNVERIFIED ones in answers. |
| F2 | **Only 8 carrier rows are CURRENT** (see above). A "name the carrier" case from a band alone works only for n41/n71 (T-Mobile), n260 (Verizon), n261 (Verizon, Cellcom) and n77 (needs a second clue: three carriers hold n77 rows). | Cases that name a carrier use: a checked row **plus** a second clue (a sticker photo, a carrier code, the n77 holder list). Where only one clue exists, the case asks for the band *group* or the site type instead. Re-plan after T47: more cases can then name carriers. |
| F3 | **The `scenario` question type already exists** (several clues, each with its own choices and `why`). So do `photo-choice`, `tap-the-clue`, `number` and the mock phone screen. | Probably **no new app code**. Check first, build only if a gap shows (as in the unit 8–9 plan). |
| F4 | **Photos on hand:** 17 tower photos (towers, disguises, small cells, a sign, a 5G equipment shot), plus drawings of lattice, guyed, DAS, passive panel, radio unit, massive MIMO, two port panels, and the practice phone screen. | Cases reuse these. No new photo downloads (Commons is blocked most of the time from the cloud; see T26). The sign photo (`site-sign-01`) is the only sticker-type clue, so at most one or two cases may use a sticker clue. |
| F5 | **Photo licences and credits are already in `credits.yaml`.** | Every picture in a case shows its credit line, same as units 6–7. |
| F6 | **Mock numbers only.** The practice phone screen uses made-up IDs, labelled "practice screen". | Cases that show the screen use new made-up numbers (the checker re-does the maths), never a real site's data. |
| F7 | **"No hints" means the checkpoint style.** The earlier checkpoints already turn hints off. | The final exam uses the same switch. The four lessons before it keep normal feedback so they teach the method. |

---

## 2. Rules (inherited)

- Lesson shape: 12–15 steps, 3–5 minutes each (time with `content/tools/lesson_timing.py`). Final exam (checkpoint) has no hints.
- IDs: `unit10`, `unit10-l1` … `unit10-check`; question IDs `u10-<topic>-<nn>`.
- Mixed review steps pull from units 1–9 (any CURRENT fact).
- Drawings are labelled "drawing" and are not used as "unseen photo" questions (CLAUDE.md: no AI photos for identification).
- A case never rests on an UNVERIFIED fact. The checker enforces this; don't work around it.
- Carrier shortcuts like "B71 means T-Mobile" go out of date. Cases say "the checked row says…" and the exam includes one question on **why a shortcut can go stale** (spectrum changes list).

---

## 3. The unit (plan)

### Lesson 1 · One clue at a time (`unit10-l1`)
Method lesson: for each clue ask "what does this clue narrow down?" (band group, FDD/TDD, site type). Steps: a learn card with the 4-step detective method (frequency → band → holder → proof), then single-clue warm-ups: band → low/mid/high; photo → site type; channel number → band (B12, B13, B66, B71 only, as in G5). Mixed review from units 1–3.

### Lesson 2 · Two clues: band plus place (`unit10-l2`)
Two-clue `scenario` cases that join a band clue and a site clue, e.g. "n260 + a rooftop small-cell photo → mmWave (high band), short range, dense city". Includes the n77 case: three carriers hold n77 rows, so one clue is not enough; the second clue (a carrier code or sticker) decides. Uses only CURRENT rows (section 4).

### Lesson 3 · Read the phone screen (`unit10-l3`)
Cases built on the practice phone screen with new made-up numbers: split the big cell number into tower and sector; read the channel number to the band group; say what the PCI is **not** (not a tower identifier). Combines with one band clue for a 3-clue case.

### Lesson 4 · Full cases (`unit10-l4`)
Three-clue and four-clue `scenario` cases (photo + band + screen + code), with explanation after each clue and a chain-of-evidence recap card at the end. Includes one case where the clues **disagree** (a lesson in "which clue counts most": the carrier's sticker counts most, the equipment brand least), and one "not enough clues" case where the right answer is "can't tell yet". Honest uncertainty is a skill.

### Checkpoint · Final certification (`unit10-check`)
No hints, mixed:
- ~6 one- or two-clue warm-ups (band group, site type, cell structure).
- ~4 full `scenario` cases (3–4 clues each).
- 1 "which clue counts most?" question; 1 "why can a shortcut go out of date?" question.
- 2 mixed-review `number` drills from unit 9 maths.
Passing it ends the path (PRD success measure S12: you reach the final challenge).

---

## 4. Every fact unit 10 uses, and how

| Fact group | Status today | Used as |
|---|---|---|
| `band:*` frequencies and ranges | CURRENT | Band-group and FDD/TDD clues |
| `carrier_use:` rows (8 CURRENT only) | CURRENT | Named-carrier cases, **always with a second clue** |
| `carrier_use:` other 52 rows | UNVERIFIED | **Never in an answer** (T47 would unlock more) |
| `carrier_code:` (25 CURRENT) | CURRENT | Second clue for carrier |
| `site:*` (water tanks excepted) | CURRENT / UNVERIFIED | Site-type clues; water-tank row excluded |
| `hardware:form:*`, `ports:*`, `model:*` | CURRENT | Equipment clues (shape and ports, not brand colour: rule G2) |
| `cellid:lte:eci`, `nr:nci`, `earfcn` for B12/B13/B66/B71 | CURRENT | Phone-screen clues with made-up numbers |
| `spectrum_changes` | CURRENT/PLANNED | The "shortcuts go stale" question |
| `us:*-pattern` (forum patterns) | CURRENT, grade C | **Never quizzed** (rule G3) |

---

## 5. What the next chats need to build (hand-off list)

1. **Check the gap first (Medium, small):** confirm `scenario`, `photo-choice`, `tap-the-clue`, `number` and `choice` can express every case above; confirm a case may hold a picture and a phone-screen drawing in one `scenario` (clue pictures). Build only what is missing, with a unit test.
2. **Write the cases (Medium):** draft ~12 cases in a plain list first (clues → answers → chain-of-evidence sentence), each with its `facts:` list, so the checker proves every clue.
3. **Write lessons 1–4 and the exam (Medium):** YAML in `content/lessons/unit-10/`, build with `content/tools/build_lessons.py`, time each lesson, run `check_content.py`, lock IDs.
4. **Tests (Medium):** unit tests for the new units file and a click test that plays one real unit 10 lesson end to end.
5. **Then the Large review (Opus, High effort)** of the whole app (PRD v1.0 step), and T10 (local field trip) for the bonus.

---

## 6. Decisions made here (to add to `docs/DECISIONS.md` when the owner reads this)

- **H1:** Unit 10 adds **no new facts and no new data files**; every clue comes from files already checked.
- **H2:** A case names a carrier **only** on a checked row plus a second clue; otherwise it asks for band group or site type.
- **H3:** Cases include one "clues disagree" and one "not enough clues" case, so honest uncertainty is taught.
- **H4:** Hints are off only in the final exam; lessons 1–4 give normal feedback.

## 7. Open design points (none block planning)

- With only 8 carrier rows, named-carrier cases will be few. If T47 stays blocked for long, is the unit still satisfying? Suggestion: yes, the skill is the method, and T47 can add cases later without changing the unit's shape.
- One sticker photo exists (`site-sign-01`). More cases with stickers need more photos (T26, or the owner's own).

## 8. Questions for you (none block the work)

1. **Is it OK that unit 10 teaches no new facts and mostly asks for "band group / site type / what the numbers mean", naming a carrier only when the clues are checked?** My suggestion: yes, because inventing carrier answers would teach shaky facts.
2. **Should the final exam have a pass mark that unlocks something (a badge), or just show your score?** My suggestion: a badge on the path map; the badge art is a small later task.
