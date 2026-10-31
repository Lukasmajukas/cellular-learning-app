# Handoff note: 2026-10-31, T13 switch on the 24/7 robot

**Status:** IN PROGRESS
**Model used:** Medium, Max effort (T13 asks for Medium effort; see the notes below) · **Branch / pull request:** `claude/go-4h9lw1`, opened by this chat

## In simple words (for the owner)
Claude is switching on the robot. That means creating its alarm clock (the scheduled task "Robot"), ringing it once, and checking that the robot chat it starts has everything it needs to work.

## What was done
- Claimed T13. The traffic light was 🟢: nothing else was open.
- Put away 2 old idle chats (the chat that wrote the robot rules, and the research chat). Nothing was deleted.
- Created the scheduled task "Robot" exactly as section G says, and fired it once as a test.
- **Test result 1 (the scheduled task's own chat): it can't work.** The chat had no project files (empty folder, no git repo), no GitHub tools and no chat tools (`create_session`, `fire_trigger`, `list_triggers`, `get_session`). It did run on Sonnet in Auto mode, and nothing waited for approval. It sent a phone notification saying the repo is missing.
- **Why:** the chat tool `create_trigger` can't attach a repository or connectors to the chats it starts (the result showed `sources: []` and `mcp_connections: []`, with a warning).
- **Test result 2 (a chat started with `create_session` and the repo attached): it has everything.** Project files, the full GitHub tool set, all chat tools including `create_session`, `fire_trigger`, `list_triggers`, `get_session`. Sonnet, Auto mode, nothing blocked.
- The first heartbeat (20:07 UTC) fired, but failed at once because the 5-hour usage limit hadn't reset yet.

## What's next
- Pause the broken schedule, build a small "Robot launcher" chat that the heartbeat wakes, and test the whole path before leaving the robot on.

## Decisions made (also added to docs/DECISIONS.md)
- None yet.

## Questions for the owner
- None yet.

## New words (also added to GLOSSARY.md)
- None yet.

## Notes for the next Claude
- This chat was started on **Max** effort (`get_session` shows `effort_level: "max"`). T13 says to create the robot from a Sonnet chat at **Medium** effort, "so robot chats copy that". `.claude/settings.json` says Sonnet should run at medium (`modelSettings`), but this chat did not follow it. So the open question is what effort the robot chat really gets. The test below answers it.
