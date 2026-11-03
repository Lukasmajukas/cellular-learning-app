# Handoff note: 2026-11-03, T52 Launcher can be wiped safely

**Status:** DONE
**Model used:** Large (Opus), High effort · **Branch / pull request:** claude/funny-gates-0x4h4s, PR #115

## In simple words (for the owner)
The robot's launcher chat kept its instructions only in its own memory, so its memory could never be wiped, and it grew huge (about 720,000 tokens, re-read every hour). The fix: the hourly alarm message will carry the full instructions. Only the launcher chat itself can change that message, so you paste one message into it (T51). After that, `/clear` wipes its memory safely.

## What was done
- Checked Claude Code's docs: `/clear`, `/compact` and `/context` work in cloud chats; `/clear` starts fresh in the same chat; `/autocompact` accepts 100k to 1M and is saved on the chat's own cloud computer.
- Tried `update_trigger` with the new heartbeat prompt: refused ("can be changed only from the conversation or thread the routine posts into"). Nothing changed. Recorded in `docs/WORKFLOW.md` section G ("How the robot is built", step 6).
- `docs/WORKFLOW.md` section G: new "Heartbeat prompt" (full steps, runaway guard counts recent "Robot" chats with `list_sessions` instead of memory) and "Keeping the launcher small". The launcher prompt's step 2b now matches the new runaway guard.
- `TASKS.md`: T51 is now the owner's paste-then-/clear steps; T52 in Done. Decision, diary line, glossary word ("/clear and /compact"). Panel data rebuilt.
- Seen on main: the robot is working normally again (T37 unit 10 merged in #113 and #114).

## What's next
- Owner: T51 (paste the message into the launcher chat, then `/clear`).
- Robot: carries on by itself.

## Decisions made (also added to docs/DECISIONS.md)
- Keep the same launcher and wipe it with `/clear`; no project-wide compaction setting.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- /clear and /compact.

## Notes for the next Claude
- `update_trigger` can't change a bound schedule's prompt from another chat. Pausing (`enabled`) still works from anywhere.
- After T51, check the launcher's next `create_session` call (`list_events`, kinds `assistant`) to confirm it follows the new heartbeat.
