# Handoff note: 2026-10-31, T28 Robot chats name themselves and put themselves away

**Status:** DONE
**Model used:** Large (Opus), Max effort (the owner's pick for this chat) · **Branch / pull request:** `claude/go-4h9lw1` (merged by Claude)

## In simple words (for the owner)
Finished robot chats were piling up in your list, all called "Robot run". That happened because robot chats only put away chats that had been quiet for 2 hours, and never themselves. Now each robot chat names itself after its job, like "Robot: Photo sources list", and puts itself away when it's done.

## What was done
- **Found the cause.** In `docs/WORKFLOW.md` section G, step 8 let robot runs tidy only chats that had been quiet for 2+ hours (to protect the owner's own chats). No rule said a robot chat should put itself away.
- **New rules in section G:**
  - Step 4: after claiming, a run renames itself `Robot: <plain task name>` (`set_session_title`).
  - Step 5: worker chats get the title `Robot (Haiku): …` or `Robot (Opus): …`. The run that hands off points its pull request at the worker's link, then puts itself away.
  - Step 8: finished robot chats (started by another chat, not working, not waiting for an approval) are tidied right away. Other chats still wait for 2 quiet hours.
  - Step 10 (new): every run archives itself last, however it ended.
  - "Never" is now step 11, and also forbids renaming the launcher.
- **Other docs:**
  - Section F notes the one exception (a robot chat putting itself away).
  - Section 5 tells the owner.
- **By hand:**
  - Put away 4 finished robot chats (the T18, T23, T08 and T09 runs).
  - Renamed the T04 pair: "Robot: App plan (handed to Opus)" and "Robot (Opus): First draft of the app plan".
- Nothing asked for approval in this change. The panel republish in this chat did ask, but that's the separate panel change.

## What's next
- The robot's Opus worker is finishing T04 (pull request #19). The next robot run follows the new rules and will put away the T04 pair once #19 is merged.
- Panel and T21: a separate change from this same chat.

## Decisions made (also added to docs/DECISIONS.md)
- Robot chats name themselves after their job and put themselves away as the last step of every run. Finished robot chats are tidied right away.

## Questions for the owner
- None for this change.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- Running robot chats read the rules when they start, so the two T04 chats still follow the old rules: they won't rename or archive themselves. The first run started after this merge is the first to follow the new rules.
- `set_session_title` worked from this chat on robot chats, but it isn't tested from inside a robot chat. If it's refused there, the run just keeps the name "Robot run".
- Robot chats are spotted by `origin: claude_code_mcp_seed` in `list_sessions`. Test chats started by owner chats have that origin too, so they get tidied the same way.
- This ran while the robot worked on T04 (#19), at the owner's direct request. Both edit TASKS.md and the logs, so whoever merges second keeps both sides.
