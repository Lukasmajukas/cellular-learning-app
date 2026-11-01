# Handoff note: 2026-11-01, T40 Owner tries the test build

**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** `claude/lucid-noether-8qdtwg` [pull request 37](https://github.com/Lukasmajukas/cellular-learning-app/pull/37)

## In simple words (for the owner)
You installed the test build and told me what you saw. I wrote your answer down so nothing is lost. The idea and the look are a thumbs-up, so Level 3 is passed. The two things you didn't like (the mascot, and a bit of choppiness) are now tasks, and the confetti is still unproven, so it's in a task too.

## What was done
- Start-up check: green (no open pull requests, `main` already newest).
- Found the newest Windows build for the owner: run 10 on `main` (the T30 merge), artifact `windows-installer` (~467 MB, expires 2026-12-01): https://github.com/Lukasmajukas/cellular-learning-app/actions/runs/41285678320 . I could not see the exact installer file name inside the zip, so I told the owner to look for the `.exe` with "Setup" in its name.
- Owner's first message, typed in chat 2026-11-01, word for word: "I do hear beep but the maskcot animation is wierd and all samlpe lessons are same but the bisuals is solid and the concept is perfect".
- Because that message did not answer "smooth?" or "confetti?" and "weird" was vague, I asked four multiple-choice questions. Answers: smooth = "A bit choppy"; confetti = "Didn't notice"; mascot = "Looks cut off or misplaced"; move on = "Level 3 passed, move on".
- The "all sample lessons are the same" comment is expected, not a bug: `SAMPLE_PATH` in `app/src/path.ts` reuses one placeholder lesson five times. Real lessons come from T31 and T33. T31 is now "Open" (was "Later").
- `TASKS.md`: T40 moved to Done with the owner's words; added T45 (mascot) and T46 (smoothness and confetti).
- `ROADMAP.md` and `README.md`: Level 3 is Done, the marker is on Level 4.
- `docs/DECISIONS.md`, `docs/PROGRESS-LOG.md`, `GLOSSARY.md` ("Frame rate (fps)") updated.
- Put away 1 old chat ("Panel mark-off at 22": finished, idle, this project's, its pull request merged). Left alone: "Robot launcher (do not archive)".
- No app code changed.
- Panel: `panel/live.json` and `panel/index.html` refreshed (Level 3 done, Level 4 current, T45/T46 next); republished from this chat (the owner is here, so one Approve click is expected).
- Looked at (not changed) while writing T45 and T46: the mascot's swinging antenna uses `transformBox: 'view-box'` with `transformOrigin: '60px 20px'` in `app/src/Mascot.tsx`; `main.tsx` wraps the app in `MotionConfig reducedMotion={'user'}` unless the owner switched reduce motion on, so the OS "animation effects" setting can dim animations; confetti defaults to on (`prefs.reduceMotion` false). These are guesses to check with pictures and a frame-rate readout, not findings.

## What's next
- Next task: T45 (fix the mascot), model: Medium (Sonnet), effort: Medium, type: `Do the next task in TASKS.md`. Then T46. T31 (design units 1–3, Opus) is also open now.

## Decisions made (also added to docs/DECISIONS.md)
- Level 3 passed; marker moves to Level 4; the mascot, choppiness and confetti check are fix tasks that don't hold up Level 4.

## Questions for the owner
- None open. (Optional: if the mascot still looks wrong after T45, a phone photo of the screen helps.)

## New words (also added to GLOSSARY.md)
- Frame rate (fps).

## Notes for the next Claude
- T45: render the mascot in the real app (Playwright/Electron, as in `app/tests/`) at 3–4 moments and look at the pictures before changing anything. Add a screenshot or bounding-box test so it can't regress.
- T46: the owner's PC model and Windows animation setting are unknown. Don't conclude "choppy" is fixed from cloud tests alone; it needs the owner's frame-rate number from a new installer. The confetti check should really draw confetti in the real-app click test and assert the canvas appears.
- The owner's verdict covers only the sample lesson and the path map at build run 10; later app changes need a new check.
- Files touched: `TASKS.md`, `ROADMAP.md`, `README.md`, `GLOSSARY.md`, `docs/DECISIONS.md`, `docs/PROGRESS-LOG.md`, `panel/live.json`, `panel/index.html`, this note.
