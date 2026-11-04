# Handoff note: 2026-11-04, T57/T58 owner's test result, start-up picture, redesign request

**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** `claude/inspiring-bohr-k7gd6k` / [#122](https://github.com/Lukasmajukas/cellular-learning-app/pull/122)

## In simple words (for the owner)
You tried the new Windows build and told us what you saw: it runs smoothly at 60 frames a second, you didn't see the confetti, and a strange green picture appears on every start. You also said the whole app needs animation and that this should be a slow, careful redesign over weeks, not a rush. This note writes all of that down and adds two tasks: T57 finds out what the green picture is, and T58 plans the redesign (planning only, no app code).

## What was done
- Recorded the owner's T46 answers: frame rate steady at 60; confetti probably not seen; T46 moved to Done.
- Investigated the screenshot (read-only): built `main` (78e53c0) in the cloud, ran the real Electron app in a window the size of the owner's (about 620 x 960) and took screenshots at 0.3, 1, 2, 4, 6, 9, 12 and 15 seconds. The page holds zero `<img>`, zero canvases and no console errors at any moment, and the path map draws normally (the lesson circles fade in at the start). The two green blocks in the owner's screenshot are the same bitmap drawn twice (about 335 x 208 px on screen). None of the 26 pictures in `app/public/photos` is green overall (checked by average colour); note that eight of them (the 800 x 480 drawings) have almost the same shape as the blocks, so the size alone proves nothing, and only the phone-screen drawing was also looked at by eye. The owner says it appears on every launch, lasts about 12 seconds and looks like a coding animation.
- Wrote T57 (find the picture, with an A/B test build with graphics-chip drawing off) and T58 (plan the redesign, Opus, High) in TASKS.md, both "You + Claude" so the robot does not pick them.
- Wrote `docs/redesign-brief.md` (DRAFT): the owner's words, what exists, constraints, open questions, risks.
- Added two decisions, a diary line and one glossary word.
- Started from the traffic light (green, nothing open). Restarted this branch from `main` after the T56 merge and joined the old branch copy with `git merge -s ours` (identical content, so no file changed) so the push was normal.

## What's next
- Owner: T57 step 1 (3 or 4 screenshots a few seconds apart right after opening the app, and what else is open). Owner: answer the open questions in `docs/redesign-brief.md`, especially "should the robot stop changing how the app looks?".
- Next task for a chat: T58, model: Large (Opus), effort: High, type: `Do task T58`. Or T57 (Medium, Sonnet) once the screenshots are in.

## Decisions made (also added to docs/DECISIONS.md)
- Frame rate is fine (60); the owner wants more animation, not more speed.
- The redesign is a slow program: plan first, then 20+ Opus sessions over weeks, owner signs off the plan.

## Questions for the owner
- Should the robot stop changing how the app looks until the redesign plan is signed off? (Recommended: yes. Not changed yet: that needs a rule in `docs/WORKFLOW.md` section G step 3, which only the owner's OK allows.)
- Pace: how many Opus sessions a week fits your weekly limit?

## New words (also added to GLOSSARY.md)
- Graphics chip (GPU) / hardware acceleration.

## Notes for the next Claude
- My cloud test cannot show a graphics-chip glitch (no real GPU), so "not reproduced" does not rule it out. Also note a still glitch would not "animate like coding" as the owner describes it, so the GPU theory is unproven. T57 is built as an A/B test for that reason: one build with graphics-chip drawing off, then ask the owner.
- The confetti was proven in the cloud (T46) but the owner did not see it on their PC; if it also shows nothing with graphics-chip drawing off, look at the confetti code on Windows.
- The throwaway screenshot script is not in the repo; it launched Electron with Playwright (`_electron.launch`, `CELL_DATA_DIR` set to a temp folder) and called `BrowserWindow.setSize(620, 960)` through `app.evaluate`.
- The repository is private and `latest-build` on the Releases page is replaced by every build of `main`, so a test build for T57 should be a separate pre-release with its own tag (not `latest-build`), or a manual run that the next `main` build replaces. Say which in the handoff.
