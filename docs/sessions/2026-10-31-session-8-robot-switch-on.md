# Handoff note: 2026-10-31, T13 switch on the 24/7 robot

**Status:** IN PROGRESS
**Model used:** Medium, Max effort (T13 asks for Medium effort; see the notes below) · **Branch / pull request:** `claude/go-4h9lw1`, opened by this chat

## In simple words (for the owner)
Claude is switching on the robot. That means creating its alarm clock (the scheduled task "Robot"), ringing it once, and checking that the robot chat it starts has everything it needs to work.

## What was done
- Claimed T13. The traffic light was 🟢: nothing else was open.

## What's next
- Create the scheduled task "Robot" exactly as in `docs/WORKFLOW.md` section G, fire it once, then check the robot chat.

## Decisions made (also added to docs/DECISIONS.md)
- None yet.

## Questions for the owner
- None yet.

## New words (also added to GLOSSARY.md)
- None yet.

## Notes for the next Claude
- This chat was started on **Max** effort (`get_session` shows `effort_level: "max"`). T13 says to create the robot from a Sonnet chat at **Medium** effort, "so robot chats copy that". `.claude/settings.json` says Sonnet should run at medium (`modelSettings`), but this chat did not follow it. So the open question is what effort the robot chat really gets. The test below answers it.
