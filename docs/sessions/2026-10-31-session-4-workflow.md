# Handoff note: 2026-10-31, T14 fix how chats share work

**Status:** DONE
**Model used:** Large · **Branch / pull request:** `claude/dreamy-bohr-8ovj16`, #__ (merged by Claude)

## In simple words (for the owner)
Four chats did the same task because none of them could see the others, and only you could tick the list (by merging). Now every chat checks a traffic light first, hangs a "busy" sign on its task, and merges its own work at the end. You just open a chat and type `Go`.

## What was done
- Looked at the history. Four chats opened between 15:52 and 16:21 all did T03 (pull requests #2 to #5), and #6 was stacked on top of #5.
- Asked the owner who should merge. Answer: Claude merges, and the owner only chats.
- Merged #6 (the T11 plan, still a DRAFT plan). It was the first merge done by Claude, and the GitHub tools allowed it with no settings change.
- Closed #2, #3 and #4 with a comment on each. Saved their extra findings in `docs/reuse-review.md` (new last section) and their owner answers in `docs/DECISIONS.md`.
- Wrote `docs/WORKFLOW.md`: the owner's 4-step job, the traffic light, a "what if" table, and exact rules for Claude (start-up check, claim, finishing, undo, never).
- Updated `CLAUDE.md` (every-session rules), `README.md`, `CHEATSHEET.md`, `TASKS.md`, the pull request template, the handoff template and `GLOSSARY.md`. Added a status note at the top of `docs/panel-plan.md`.

## What's next
- Owner: nothing in GitHub. Close the old chats that are still waiting for answers: "T02 device setup", and the one asking you to fill in a "My answers" template. Answer T02 and T11 in any chat, whenever you like.
- Next task: **T04** (write the PRD), model: **Large (Opus)**, type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Claude merges its own pull requests; owner approvals happen in chat.
- Start-up check plus an "[in progress]" claim. Busy means saved in the last 2 hours or running; a quiet chat gets taken over.
- Always start from the newest `main`.
- Squash merges; no pull request is left waiting for the owner.
- No move to a claude.ai project; the panel will show the traffic light.
- When two chats heard different answers, the latest one wins.

## Questions for the owner
- None new. Optional: tick "Automatically delete head branches" (steps in `docs/WORKFLOW.md`).

## New words (also added to GLOSSARY.md)
- claim ("[in progress]" sign), traffic light, take over, stale copy, conflict, squash merge, undo (revert)

## Notes for the next Claude
- This chat couldn't follow the start-up check itself, because the rules weren't on `main` yet. The next chat is the first to use them. If a rule turns out unclear, fix `docs/WORKFLOW.md` in that chat.
- The branches of #2, #3, #4 and #6 are still on GitHub; no tool here deletes branches. Ignore any branch without an open pull request.
- Merges #1 and #5 on `main` are merge commits; later ones are squash commits. `git revert` needs `-m 1` only for merge commits.
- `docs/panel-plan.md` §6 still says the robot "never merges". Update it when the owner answers T11 §10 (it's written into the T11 row).
- `get_session` (claude-code-remote tools) tells whether another chat is running, and a pull request's description ends with its chat's session link. If those tools are missing, use the 2-hour rule alone.
