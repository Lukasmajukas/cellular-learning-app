# Handoff note: 2026-10-31, T24 effort levels, restart after the limit, and the approval stall

**Status:** IN PROGRESS
**Model used:** Medium, Max effort (same chat as T13 and T20, started on Max) · **Branch / pull request:** `claude/go-4h9lw1`, opened by this chat

## In simple words (for the owner)
You asked whether the robot can change effort levels and know when to, and whether it restarts after your limit. I measured the effort of robot chats, and I'm writing the answers into the robot's rules. I also found that the robot's first job stopped to ask for approval, so I'm writing down the fix for that too.

## What was done
- Measured the effort of chats the robot starts: Haiku Low, Sonnet Medium.
- Found the robot's first real run waiting on "Publish Files" approval (a connector rule, not the permission file).

## What's next
- Write the rules (effort, moving up a size after a failed try, restart cases, approval stall) and the owner's steps.

## Notes for the next Claude
- Follow-up to T20 (pull request #12, merged). The robot's T18 pull request (#13) was open at the time; the owner asked for this directly, so it ran at the same time.
