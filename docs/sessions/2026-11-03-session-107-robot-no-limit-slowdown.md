# Handoff note: 2026-11-03, T50 Robot works until the limit is used up

**Status:** DONE
**Model used:** Large (Opus), High effort · **Branch / pull request:** claude/funny-gates-0x4h4s, PR #111

## In simple words (for the owner)
Since Monday morning the robot only looked for tiny chores, because your weekly limit was at "warning" (nearly used up). There were no tiny chores, so it did nothing for about 30 hours. You asked to drop that. Now a warning changes nothing: the robot works normally until the limit is really used up, and it still never uses paid extra usage.

## What was done
- Found the cause: the launcher chat followed a rule that lived only in its own chat, not in any project file: "warning → start a Haiku 'small chore' run". It started about 30 of these from 2026-11-02 15:42 UTC on, and each found nothing to do.
- `docs/WORKFLOW.md` section G: step 1 now says a warning is not a stop; launcher prompt step 2 now says the same, and never to switch to Haiku or "small chore" runs.
- `docs/DECISIONS.md`: the owner's choice, with their words.
- Start-up check: merged leftover finished PR #107 (it was a draft, so it was marked ready first). Archived 6 finished robot chats. One of them (13:35 UTC) asked the owner about rewriting old commits on its own local `main`; that copy existed only in its cloud computer, so nothing on GitHub depended on it, and the safe default was to leave it.
- After the merge: told the launcher chat (`send_message`), quoting the owner's words, to drop its rule and start a normal run.
- Panel: `live.json` updated and `panel/index.html` rebuilt.
- New "You" row T51: whether to replace the launcher chat with a fresh one.

## What's next
- Next task: T37 (build unit 10), Medium (Sonnet), Medium effort. The robot should pick it up by itself (it may try T26 or T07 first and find them still blocked).

## Decisions made (also added to docs/DECISIONS.md)
- 2026-11-03: a usage warning changes nothing; the robot works until the limit is used up; still never paid extra usage.

## Questions for the owner
- T51 (optional): replace the launcher chat with a fresh one?

## New words (also added to GLOSSARY.md)
- Usage warning.

## Notes for the next Claude
- The launcher's own chat history is what holds its rules. If it ever slows down again, check its recent replies with `list_events` (kinds `assistant`) and look at the `create_session` prompt it sends.
- The launcher is near its automatic shortening point (about 722k of 784k tokens). After that it may forget rules given only in its chat; the files are the source of truth.
