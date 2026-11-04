# Handoff note: 2026-11-04, T56 Windows installer as a GitHub Release

**Status:** IN PROGRESS
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** `claude/inspiring-bohr-k7gd6k` (draft pull request, number added below once it exists)

## In simple words (for the owner)
GitHub's storage for build files is full, so new Windows installers can't be saved. You picked option B: the build will put the installer on the project's **Releases** page instead, in one slot called "Latest build" that replaces itself each time. Release files don't use that full storage.

## What was done
- (claimed the task; the work is in the next commits)

## What's next
- Next task: T53 (daily review), model: Medium (Sonnet), effort: Medium, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- (to fill in)

## Questions for the owner
- None yet.

## New words (also added to GLOSSARY.md)
- (to fill in)

## Notes for the next Claude
- Cause found in this chat: Windows run 66 on `main` (after PR #116) passed tests, click tests and `make`, then failed at the upload step with "Artifact storage quota has been hit". So the code is fine; only the saving step is blocked until the 27 old installers expire (Dec 1–2) or are deleted.
- The owner answered in chat on 2026-11-04: T51 done; T02 no app-name idea; T48 "sure and yes" (keep a few typed numbers; low/high/mid wording OK); T46 not done yet (the owner could not find a download). These get written into TASKS.md and DECISIONS.md in this pull request.
