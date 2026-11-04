# Handoff note: 2026-11-04, T56 Windows installer as a GitHub Release

**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** `claude/inspiring-bohr-k7gd6k` / [#117](https://github.com/Lukasmajukas/cellular-learning-app/pull/117)

## In simple words (for the owner)
You couldn't find a download because GitHub's storage for build files was full, so the installer could not even be saved. You picked option B, so the build now puts the installer on the project's **Releases** page, in one slot called "Latest build" that every new build replaces. Release files don't use that full storage. A first one is already there: https://github.com/Lukasmajukas/cellular-learning-app/releases/tag/latest-build

## What was done
- Found the cause of "no releases yet / no download": the installer was only ever a build file (artifact) attached to each run, never a release; and since the Nov 3 storage filled up, no new one could be saved at all (run 66 on `main` passed tests, click tests and `make`, then failed with "Artifact storage quota has been hit").
- `.github/workflows/app-build.yml`: removed the artifact upload of the installer; added a step "Publish the installer on the Releases page" (`if: github.event_name != 'pull_request'`, `permissions: contents: write`). It deletes the `latest-build` release and tag, then creates it again at the current commit with the single `Setup.exe` and plain-words install notes. Failure screenshots still use an artifact, only when a run fails.
- Tested the real step on Windows with a manual run on the branch (run 67): the step passed in 14 seconds and the release exists with `Cell.Learning-0.1.0.Setup.exe` (158,074,368 bytes, uploaded by github-actions). Normal pull-request runs (68, 69) passed and skip the publish step by design.
- Dry-ran the publish script on Linux with a fake installer and a stand-in `gh` (right file, title, notes; fails loudly if there is not exactly one .exe; works with spaces in the file name).
- Recorded the owner's answers: T51 done, T02 no name idea, T48 "sure and yes" (TASKS.md Done rows, DECISIONS.md).
- Added "Get the app" line to README.md, three glossary words, T46 now says where to download.
- Start-up check: traffic light green (PR #116 had merged); archived one finished chat ("Resuming task work"); the Opus review chat had already archived itself.

## What's next
- Next task: T53 (daily review, the ⭐ row), model: Medium (Sonnet), effort: Medium, type: `Do the next task in TASKS.md`
- Owner: T46 (frame-rate number and confetti, from the new download). T47 and T07 still need official links or PDFs.

## Decisions made (also added to docs/DECISIONS.md)
- The installer is published as a rolling `latest-build` GitHub Release instead of a workflow artifact.
- No app name yet (T02); units 1–3 keep a few typed numbers and the low/mid/high wording (T48).

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- Release (GitHub), Build file (artifact), Storage quota.

## Notes for the next Claude
- The old Nov 1–2 installer artifacts (27, about 12.6 GB) still fill the artifact storage until they expire (Dec 1–2). Nothing needs them any more. Deleting them was offered as option A and the owner chose B instead, so they were left alone. Any workflow that uploads an artifact will keep failing until then or until they are deleted; the failure-screenshots upload (only on a failed run) is the one place that still does.
- Every push to a pull request that changes `.github/workflows/app-build.yml` starts a full Windows build (about 8 minutes, billed double on Windows), even a docs-only push, because the `paths` filter looks at the whole pull request. Batch pushes.
- The Release step can't be tested on a pull request (it is skipped on purpose). Test it with `actions_run_trigger` `run_workflow` on the branch (event `workflow_dispatch`); that publishes a real `latest-build` release built from that branch, which the next build of `main` replaces.
- Not done on purpose: two main builds that finish out of order could leave an older installer in the slot (the title shows the commit). Adding `concurrency` to the job would fix it if it ever matters.
- GitHub shows the asset name with dots instead of spaces (`Cell.Learning-0.1.0.Setup.exe`); the notes say "the file ending in Setup.exe".
