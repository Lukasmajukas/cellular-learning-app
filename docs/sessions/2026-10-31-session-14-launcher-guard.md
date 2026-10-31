# Handoff note: 2026-10-31, T25 the launcher paused itself

**Status:** DONE
**Model used:** Large (Opus), Max effort (same chat as T13, T20 and T24) · **Branch / pull request:** `claude/go-4h9lw1` (merged by Claude)

## In simple words (for the owner)
The robot's launcher (the small chat the alarm wakes) stopped starting robot runs. It saw the alarm go off several times close together and thought it was a runaway loop. It wasn't. That was the chain working (each finished job starts the next one) plus my manual starts. I explained it, gave it a clear safety limit (at most 6 runs an hour), and it started the next job (the photo-sources list). The launcher's written instructions now say this too, so a rebuilt launcher won't make the same mistake.

## What was done
- Checked all five firings of "Robot": 20:18 and 20:39 (manual), 20:47:11 and 20:48:47 (the chain, from the panel run and the live-panel test run), 20:53:33 (manual). The "three runs already going" had all finished.
- Told the launcher (with `send_message`): close firings are expected; don't judge other runs (each run checks the traffic light itself); runaway guard of 6 runs an hour. It accepted and started a run, which claimed the photo-sources list (T08, pull request #16).
- `docs/WORKFLOW.md`: the launcher prompt says close firings are expected and has step 2b (runaway guard); "If the robot is down" covers a launcher that refuses.

## What's next
- The robot carries on: photo sources (T08), then carrier codes (T09), then the first draft of the plan (T04).
- Owner: T21 (about 5 minutes), T22 (look at the panel).

## Decisions made (also added to docs/DECISIONS.md)
- Close firings are expected; the launcher's runaway guard is 6 runs an hour.

## Questions for the owner
- None new.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- The live launcher learned the new rule from a message, not from its first prompt. If it's ever rebuilt, use the prompt in `docs/WORKFLOW.md` section G, which now includes the rule.
- An owner chat's open pull request blocks the robot's chain (the next run sees 🔴 and stops). After merging while the robot is idle, fire "Robot" once.
