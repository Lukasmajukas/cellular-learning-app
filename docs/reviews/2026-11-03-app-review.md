# Final review of the whole app, units 1 to 10 (task T37)

**Status:** DONE · **Reviewed:** the app code (`app/src/`, `app/electron/`), all 49 lessons (635 questions in `content/lessons/`), the fact checker and build scripts (`content/tools/`), against `docs/PRD.md` and the unit plans in `docs/curriculum/` · **By:** Large (Opus), High effort, robot run · **Date:** 2026-11-03

## In simple words (for the owner)
I checked the whole app the way a teacher checks a finished test before handing it in.

- **The facts are safe.** No question asks you about an unchecked fact, and every number on screen comes from the fact files. I found one wrong hint (fixed).
- **Two real bugs, both fixed:**
  1. **The right answer was nearly always the top button.** In 7 of every 10 questions, and in *every* question of units 3, 4 and 7, the first button was right. You could have passed most lessons without reading them. The buttons now come in a new random order each time.
  2. **Typing a big number with a comma was marked wrong.** The questions write numbers like "104,972", but the answer box read "104,972" as 104.972. Now "1,710", "104,972" and even "37 GHz" all work.
- **The Windows build was broken, and is fixed** (you asked for this in the same chat). Since the heatmap was added on Nov 2, the Windows check had failed every time, so no new installer was made. Two files had the same name apart from capital letters (`HeatMap.tsx` and `heatmap.ts`). Linux sees two files, but Windows sees one, so it opened the wrong one.
- **The biggest thing still missing:** the daily review. The app already works out when each question should come back, but there's no screen that brings them back yet. That's the heart of the plan ("brings back each fact just before you'd forget it"), so it's the next task (T53).

## Verdict
**Ready to play, with fixes applied.** All 10 units are complete, every lesson takes 3 to 5 minutes, and the safety rules hold. Level 4 isn't finished yet, because the plan's review queue, daily goal and streak repair aren't built. Those are new tasks T53 and T54.

## How I checked
1. **Ran every automatic check before touching anything:** fact checker OK (253 facts, 27 photos, 635 questions); 36 checker tests, 79 app tests and 13 click tests pass; type check clean; lesson timer: all 49 lessons 3 to 5 minutes.
2. **Read the app code:** lesson player, marking, the lesson builder, save file, streak/XP, the memory scheduler (FSRS), the heatmap and the settings screen.
3. **Wrote audit scripts** (kept out of the repo) over all 635 questions:
   - every `{…}` fill-in in a question's words is also in its `facts:` list (so the checker really sees it);
   - numbers and carrier names typed by hand, outside fill-ins;
   - where the right answer sits among the buttons;
   - duplicate or broken answer options.
4. **Rendered every lesson exactly as the app does** and scanned the finished text for gaps like "undefined", "2110.0" or stray `{`.
5. **Compared what's built with the plan** (`docs/PRD.md` sections 4c and 4d, and the success measures S4 and S11).

## Fixed in this review
| # | What was wrong | Fix | Proof |
|---|---|---|---|
| 1 | Answer buttons were never shuffled. The right answer was the first button in 294 of 425 choice questions (69%). In units 3, 4 and 7 it was 100%, and in 40 of 43 scenario clues. | `app/src/LessonPlayer.tsx` shows choice, photo-choice and scenario buttons in a new random order each time (`shuffleOrder` in `app/src/questions.ts`). Marking is unchanged: each button still sends its written number. | New test: over many showings the first-written answer lands in every position. It fails on the old code. All 13 click tests still pass, including full real lessons from units 8, 9 and 10. |
| 2 | Typing "1,710" or "104,972" was marked wrong (read as 1.71 and 104.972). The prompts themselves write numbers this way, and units 3, 4, 9 and 10 have answers over 1,000. "37 GHz" was also refused. | `parseNumber` in `app/src/questions.ts` treats US thousands commas (and spaces) as thousands, still reads "1,5" as 1.5, and turns GHz into MHz. | New test: every one of the 61 real number questions accepts its answer typed with commas. It fails on the old code. |
| 3 | `u2-b29-use-01`: the option "Both, like any other band" was cut in two by its comma, giving the buttons "Both" and "like any other band". | Quoted in `content/lessons/unit-02/lesson-2.yaml`. | New guard test: no answer option starts with a small letter (the sign of this slip). |
| 4 | `u4-mmw-dl-01` hinted that n260 starts "a little under 37 GHz". The bands file says exactly 37,000 MHz. | Hint is now "Think 37 GHz. 1 GHz is 1000 MHz." | Checker OK. |
| 5 | `u10-honest-01` says "our checked list has AT&T and Verizon on n77" but listed only the band, so the checker couldn't see the carrier claim and no date badge showed. | Added `carrier_use:n77/att` and `carrier_use:n77/verizon` (both CURRENT). | Checker OK; the badge now shows. |
| 6 | `u10-full-scn-03`: the explanation "a phone on n41 may see more than one tower" was hard to follow. | "Your phone may be talking to a different tower nearby, so the band on your phone does not prove who runs this tree." | — |
| 7 | **Windows build broken since T34** (every "App build (Windows)" run since about run 32 failed): `app/src/HeatMap.tsx` and `app/src/heatmap.ts` differ only in capital letters. Windows file names ignore case, so `import './HeatMap'` loaded the logic file and the type check stopped (`TS1149`, `TS2305`). The tests on Linux never saw it. | Renamed the screen to `app/src/HeatMapScreen.tsx` (content unchanged) and updated `main.tsx`. | New guard test: no two files in `src/` share a name when capital letters are ignored. It fails with the old names. The Windows check on this pull request is the real proof. |

No question ID changed, so no review history is lost. `content/lessons.json` was rebuilt with `build_lessons.py`.

## What's right (keep it)
- **Facts discipline holds.** No answer rests on an UNVERIFIED fact. All but one fill-in is declared in `facts:`. The exception, `u9-eci-vendor-01`, is a teaching card for a rumour-grade fact that is never quizzed, on purpose. Carrier names typed in the words appear only in "we haven't checked this, so it's never quizzed" cards, or where a checked fact backs them.
- **Honest uncertainty is taught.** Unit 10 has "not enough clues" and "clues disagree" cases, as planned (H2, H3).
- **Saving is solid:** safe writes, a daily backup, recovery from a damaged file.
- **Lesson length:** all 49 lessons land in 3 to 5 minutes.

## Found, not fixed (new tasks)
| Task | What | Why it matters | Size |
|---|---|---|---|
| **T53** | **Daily review ("drive test").** A button on the path map that plays the questions that are due (`dueIds` in `app/src/fsrs.ts`), capped at about 10 minutes, and counts for the streak. | The plan's main learning tool (PRD 4c, S4, S11). Today the schedule is worked out and saved but never used, so missed facts never come back after the lesson. | Medium |
| **T54** | **Streak and goal extras** from PRD 4d: the daily goal bar (the ⚙️ setting is saved but does nothing), the streak freeze and 48-hour repair, and "this changed" cards when a carrier fact changes (PRD 4c). Also the final-exam badge, if you want it (`docs/curriculum/units-10.md`, question 2). | Promised in the plan; the daily goal setting looks broken today. | Medium |
| **T55** | **Content tidy-ups:** (a) lessons point at spectrum deals by list position (`change:6`), so reordering the list would silently swap deals (a slip like this already happened once, in session 110); give each deal a short name instead. (b) A few lessons copy numbers from the fact files by hand (unit 9: B66 channel 66436 and 2110 MHz; unit 8: panel lengths and "700/850 MHz"); use fill-ins so they follow the files. (c) Python's `__pycache__` files are saved in git and change on every run; remove them and add them to `.gitignore`. (d) The checker refuses a teaching card that lists a teach-only fact, which is why `u9-eci-vendor-01` can't list its fact; allow it for learn cards. | Keeps "facts only from the files" true as the files change. | Medium |

## Smaller notes (no task needed now)
- The dark look only darkens the background; answer buttons stay white. Readable, just not fully dark.
- The progress bar steps back a little when a missed question is added back in. That's normal for this kind of app, but it can look odd.
- `u4-cbrs-learn-02` has `label: not checked`. That's not a label the checker knows, but it's harmless on a teaching card.
- I checked facts only against the project's own fact files, as the rules say. Checks against outside sources are T07 (3GPP) and T47 (carrier pages).
