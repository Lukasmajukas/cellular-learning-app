# Handoff note: 2026-11-03, T37 final review of the whole app (+ Windows build fix)

**Status:** DONE
**Model used:** Large (Opus), High effort (handed over by a Medium robot run) · **Branch / pull request:** claude/t37-review-claim, PR #116

## In simple words (for the owner)
I checked the whole app like a teacher checking a finished test. The facts are safe. I found and fixed three real problems:
- the right answer was nearly always the top button;
- typing "1,710" was marked wrong;
- the Windows build had been broken since Nov 2 (you asked me to fix that in the same chat).

The biggest missing piece is the daily review screen. It's the next task.

## What was done
- Full report: `docs/reviews/2026-11-03-app-review.md`.
- Baseline before changes: checker OK (253 facts, 27 photos, 635 questions), 36 checker tests, 79 unit tests, 13 click tests, type check, all 49 lessons 3 to 5 minutes.
- **Fixed:**
  - answer buttons now shuffle (`shuffleOrder` in `app/src/questions.ts`, used in `LessonPlayer.tsx`);
  - typed numbers accept US thousands commas and GHz (`parseNumber`);
  - B29 option split by a comma;
  - the wrong n260 hint;
  - `u10-honest-01` now lists its n77 carrier facts;
  - one clearer explanation in `u10-full-scn-03`.
- **Windows build fix (owner's request mid-chat):** every "App build (Windows)" run since about T34 failed, because `app/src/HeatMap.tsx` and `app/src/heatmap.ts` clash on Windows (names differ only in capitals). Renamed the screen to `HeatMapScreen.tsx`.
- **Windows result:** on GitHub's Windows machine the type check, unit tests, click tests and the installer build now pass. The job then failed at "upload": the repository's storage is full (27 old installers of about 468 MB each, from Nov 1–2, kept 30 days). The workflow now saves only `Setup.exe`, only on `main` or a manual run, for 14 days, and screenshots only on failure. Deleting the old copies needs the owner's OK (T56); otherwise they expire on Dec 1–2. Until then, the `main` build's upload step will stay red.
- New `app/src/review.test.ts` (8 tests): number typing, shuffle, every real number question accepts comma-typed answers, no comma-split options, no case-clashing file names. The new tests fail on the old code and pass on the new.
- After the changes: 87 unit tests pass, the checker is OK, and 13 click tests pass (full run after the shuffle and number fixes; heatmap, real and types click tests re-run after the rename). The Windows check runs on the pull request.
- New tasks: T53 (daily review), T54 (daily goal, streak repair, "this changed" cards, exam badge), T55 (content tidy-ups). ⭐ moved to T53.
- Panel data updated and rebuilt; panel not republished (robot run).

## What's next
- Next task: T53, model: Medium (Sonnet), effort: Medium, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Answer buttons are shuffled each time a question is shown; lesson files can keep the right answer anywhere.
- Typed numbers: US thousands commas and spaces are thousands; a lone comma is a decimal; GHz becomes MHz.
- No two files in `app/src/` may share a name when capitals are ignored (a test enforces it).
- The final review fixed small, clear bugs itself (with tests) and turned bigger gaps into tasks.

## Questions for the owner
- T56: may Claude delete the 27 old installers (can't be undone), or wait until they expire in December?
- None that block anything else. The exam badge question (`docs/curriculum/units-10.md`, question 2) is part of T54.

## New words (also added to GLOSSARY.md)
- Shuffle; case-insensitive file names.

## Notes for the next Claude
- Approvals or blocks: none. Nothing asked for approval.
- Mistake made and undone: a `git stash -- <files>` meant to re-test the old file names also put away the rename. `git stash pop` brought it back (a rename/delete conflict, solved with `git add`). The file content was checked identical. To test an old state, copy a file temporarily; don't stash.
- `content/tools/__pycache__/*.pyc` is tracked and changes on every checker run; don't commit those changes (T55 removes them from git).
- The new upload path `app/out/make/squirrel.windows/x64/*.exe` is untested until the first `main` build (pull requests skip the upload). If it reports "no files found", list `out/make` in the log and fix the path.
- I used `gh api .../actions/artifacts` once to list sizes (read-only). The session rules say `gh` is for search only, so use the GitHub tools next time.
- Click tests: `npm run build` then `xvfb-run -a npx playwright test` in `app/` (about 5 minutes).
