# Handoff note: 2026-10-31, T23 can the panel read the project live?

**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort (robot run) · **Branch / pull request:** `claude/robot-t23-panel-live`, #14

## In simple words (for the owner)
I checked whether the progress panel could update itself without Claude. It can't, because none of your connected apps can read GitHub. So the panel stays a "photo" that Claude refreshes. I made refreshing it part of every chat's last steps.

## What was done
- Listed the owner's connectors (no GitHub one) and read what a page's `mcp` and `files` abilities need.
- Wrote the result in `panel/README.md`.
- Added step 2a "refresh the panel" to `docs/WORKFLOW.md` section C.
- Ticked T23, added a diary line and a decision.

## What's next
- Next robot task: T08 (photo sources), Medium (Sonnet), Medium effort.

## Decisions made (also added to docs/DECISIONS.md)
- Panel stays a snapshot, refreshed at the end of each chat.

## Questions for the owner
- Optional: if you ever add a GitHub connector or know the project id, T23 can be retried.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- I did not republish the panel this run (nothing in the panel's data changed except this task). Nothing asked for approval and nothing was blocked.
- Could not run page code from a cloud chat, so the Claude Code Remote connector route is untested, not disproven.
