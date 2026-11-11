# Handoff note: 2026-11-11, T63 plain words in type-the-number questions
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE
**Model used:** Small, Low effort (Haiku robot worker, taking over the claim from the robot run that opened #166) · **Branch / pull request:** `claude/robot-t63` / [#166](https://github.com/Lukasmajukas/cellular-learning-app/pull/166)

## In simple words (for the owner)
A type-the-number question had the words "(type the number)" at the end of its question, but the box above it already says "TYPE THE NUMBER". So it said the same thing twice. I took the extra words out of that one question. The question still asks the same thing and the answer is the same.

## What was done
- `content/lessons/unit-01/lesson-5-check.yaml`: the B71 downlink question now reads "B71's downlink starts at how many MHz?" (the "(type the number)" part is gone).
- `content/lessons.json`: rebuilt with `python3 content/tools/build_lessons.py`. The only change is that same one line.
- `TASKS.md`: T63 moved from "Now" to "Done".
- `panel/index.html` rebuilt with `python3 panel/build.py`. Not republished (robot run).

## Test results
- `python3 content/tools/check_content.py`: OK (253 facts, 27 photos, 635 questions).
- `python3 content/tools/test_check_content.py`: 36 of 36 passed.
- App tests and the Windows build: not run (content-only change, no app code touched).

## What's next
- Nothing claimed from this note. Pick the next task from the "Now" table in `TASKS.md`.

## Decisions made (also added to docs/DECISIONS.md)
- None new. The one prompt was the only place with the extra words in `content/`.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None new.

## Notes for the next Claude
- `app/src/sampleLessons.ts` line 16 still has "(type the number)" in the app's built-in demo question. It is app code, so it was left alone. A later app chat can remove it (and only after the owner has signed off `docs/PRD.md`, which is already signed off).
- The branch had one placeholder commit (the claim) before this work. This commit fills it in.
- Panel: not republished (robot run). Rebuilt `panel/index.html` is committed, so the next owner chat can publish it.
- Approvals and blocks: nothing asked for approval and nothing was blocked.
