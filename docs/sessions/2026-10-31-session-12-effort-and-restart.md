# Handoff note: 2026-10-31, T24 effort levels, restart after the limit, and the approval stall

**Status:** DONE
**Model used:** Medium (Sonnet), then Large (Opus, switched by the owner during the chat); Max effort throughout · **Branch / pull request:** `claude/go-4h9lw1`, #15 (merged by Claude)

## In simple words (for the owner)
You asked whether the robot can change effort levels and know when to, and whether it starts back up after your limit.
- **Effort:** the robot can't turn a dial for effort, but each model comes with its own effort. Haiku gets Low and Sonnet gets Medium, which I measured inside robot-style chats. So the robot changes effort by picking a different model, and its rules now say when: after a failed try it moves up one size.
- **Restarting:** after your limit resets, the 2-hour check starts it again, and unfinished work from a chat that died gets picked up straight away.
- **Approvals:** the one thing it can't fix by itself is waiting for your approval. The robot's first job stopped on "Publish Files" until you approved it, so now the robot pings your phone when that happens, and the steps to stop those questions for good are written down.

## What was done
- **Measured effort** with two throwaway chats started the way the robot starts its helpers. Haiku had `CLAUDE_EFFORT=low` and Sonnet had `CLAUDE_EFFORT=medium`, matching `modelSettings` in `.claude/settings.json`. This chat (started in the app) had `CLAUDE_EFFORT=max`. `create_session` has no effort setting, and no tool changes a running chat's effort.
- **Found the approval stall:** the robot's panel run waited on `mcp__claude-artifacts__publish_files` ("Publish Files"). The rule came from the connector's own policy (`mcpServerPolicy`), so the permission file isn't the fix. The documentation says to set the tool to Allowed at claude.ai/customize/connectors. The owner approved it, and the panel was published and merged (#13).
- **Rules (`docs/WORKFLOW.md`):**
  - Section A2: a chat that stopped with an error (bucket FAILED, for example at the usage limit) counts as 🟡 right away, not after 2 hours. A chat waiting for an approval stays 🔴, but robot runs push the owner a note naming the action.
  - Section G: effort is now measured, not "unverified", and there's a list of what restarts the robot in each "down" case.
  - Step 5: move up one size after a failed try; a Large task is retried once; Fable only by the owner's choice.
- **`docs/permission-lines.md`** is rewritten as 3 steps: approve if waiting; allow the publishing tools on claude.ai; add the permission lines. The T21 row is updated to match.
- Archived my 2 probe chats.

## What's next
- Owner: T21 (about 5 minutes) and T22 (look at the panel on the PC and phone).
- Robot: T23 (can the panel read the project live), then T08, T09 and T04, in its own runs.

## Decisions made (also added to docs/DECISIONS.md)
- Effort follows the model. The robot moves up a size after a failed try.
- What restarts the robot when it's down; pull requests from crashed chats are taken over right away.
- Connector questions like "Publish Files" are fixed on claude.ai, not in the permission file.

## Questions for the owner
- T21: the 3 steps in `docs/permission-lines.md`.
- T22: does the panel look right?

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- This ran at the same time as the robot's T23 run (#14), at the owner's direct request. Both edit TASKS.md, DECISIONS.md and the diary; whoever merges second keeps both sides' lines.
- The robot's panel note took session number 10, and its T23 note took 11. This note is 12. Before naming a note, check open `claude/` branches for in-flight note numbers.
- The robot wrote "nothing asked for approval" in its T18 note, but its run did wait on "Publish Files" until the owner approved. Robot notes may miss approvals the owner gave.
- Panel refreshes call `publish_files` again, so they will stop and ask until the owner allows that tool on the connector (T21 step 2).
- Opus High effort was not measured (no Opus probe was run, to save the limit).
