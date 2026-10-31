# Handoff note: 2026-10-31, T20 the owner's answers and the panel wishes

**Status:** DONE
**Model used:** Medium, Max effort (same chat as T13, which was started on Max) · **Branch / pull request:** `claude/go-4h9lw1`, #12 (merged by Claude)

## In simple words (for the owner)
You answered my two questions and told me what the progress panel should be. I wrote your answers down, deleted the old alarm, and put your panel wishes at the top of the panel's plan, where the robot reads them before it builds the panel. I also saved the few permission lines you need to add, so the robot never stops to ask about opening a new chat.

## What was done
- Deleted the old paused alarm (you said yes). Its two empty test chats went with it.
- Recorded your answers: an approval pop-up for "opening a new chat" did appear; you want the robot hands-free and running around the clock so the whole usage limit gets used.
- Put your panel wishes at the top of `docs/panel-plan.md`: a separate app connected to the project, clean and app-like, plain words, no task numbers, what it shows, pinned like an app, and a fallback if it can't read the private repo. Updated the panel task row (T18) to point at them.
- Added `docs/permission-lines.md` (the exact text and 4 steps for the owner) and a "You" row for it (T21). I did not touch `.claude/settings.json`: only the owner adds permissions.
- Explained the T-numbers in plain words at the top of `TASKS.md` and in the README, and added a "progress panel: link coming" line to the README.
- The safety check refused `git push --force-with-lease` (it counts as destructive). I used a content-neutral merge of the old branch instead, then a normal push. I changed `docs/WORKFLOW.md` (sections A1, B and F) so chats merge instead of force-pushing.

## What's next
- The owner adds the permission lines (T21, about 2 minutes), then tells Claude `done`.
- The robot builds the progress panel (T18), then the photo-sources list, the carrier-code list and the first draft of the plan. After those it runs out of tasks it's allowed to do, unless more are queued or the plan is signed off.

## Decisions made (also added to docs/DECISIONS.md)
- The owner wants the robot hands-free, around the clock, using the whole limit. The fix for the "approve opening a new chat" pop-up is allow rules in `.claude/settings.json`, which only the owner adds.
- The progress panel is a separate app, connected to the project: clean, app-like, plain words, no task numbers.
- The old paused alarm was deleted.
- No force-pushes (the safety check blocks them).
- The robot can only use the limit while it has tasks it's allowed to do.

## Questions for the owner
- T21: add the permission lines (steps in `docs/permission-lines.md` and in the chat).
- Optional: what else should the robot work on, so it stays busy? Claude can queue more research and content tasks, or the owner can read the plan draft and sign off so the robot starts building.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- The pop-up the owner saw ("approve opening a new chat") was `create_session` in an owner-started chat in Auto mode. The launcher did the same call unattended with no stall, probably because its first message told it to. Robot chats that open helper chats (Small and Large tasks) may still be asked, until the owner commits the lines in `docs/permission-lines.md`. The allow rules are only read by a chat with exactly one repository.
- `delete_trigger` also deletes the chats the trigger started. That's why the two "⚡ Robot" test chats are gone.
- After a squash merge GitHub deletes the old branch, so reusing the branch name is a plain push. If the old branch is still there, merge it in (`git merge origin/<branch>`); don't force-push.
- The panel needs the owner to click "Allow" once for a connector, if the plan's option A works. If the robot can't do that part it should write a "You" row (WORKFLOW section G, step 7), not stall.
