# Handoff note: 2026-11-01, T44 permanent fix for the robot stopping by itself

**Status:** IN PROGRESS <!-- change to DONE when the chat finishes -->
**Model used:** Large, High effort · **Branch / pull request:** `claude/jolly-brown-5q0cng`

## In simple words (for the owner)
(Being written. Waiting for the owner's answer: see "Questions for the owner".)

## What was done
- Start-up check: 🟢, claimed as pull request #32, put 1 old chat away.
- **Tested the T44 fix idea against the record: it can't work.** Each tool call in a chat's record says who approved it: `reason_type: "rule"` (the permission list) or `"classifier"` (the safety check).
  - Old launcher (no project): `list_triggers` and `get_session` were approved by rule (built-in), `create_session` by the classifier every time: yes at 02:19, 02:22, 02:26 and 04:18, **no** at 04:21 ("Interfere With Workloads").
  - Robot runs *with* the project and the T21 lines loaded (lines landed 2026-10-31 21:00 UTC): `create_session` (22:03, the Opus hand-off) and `fire_trigger` (04:21:27, the chain) still went to the **classifier**, while `create_pull_request`, `merge_pull_request` and `list_pull_requests` went by rule.
  - This chat (project attached): `archive_session` went to the **classifier** too.
  - Conclusion: in Auto mode, the permission lines for `archive_session`, `create_session` and `fire_trigger` are never used. The safety check always judges those three, so attaching the project to the launcher changes nothing for `create_session`.
- **Other ways checked (all closed):**
  - `autoMode.allow` (Auto mode's own allow list): the docs say it is **not read from the project's `.claude/settings.json`**, only from `~/.claude/settings.json` on a computer or company-wide managed settings. A cloud chat has neither.
  - A launcher in another mode (Accept edits, etc.) would honour the permission lines, but `create_session` "cannot be more permissive than the calling session's mode", so it couldn't start Auto-mode robot runs.
  - Bypass / don't-ask modes: not offered in cloud chats.
  - The alarm starting robot runs directly: no project attached (T13).
  - Robot runs starting the next run directly with `create_session`: still judged by the safety check, and chats have a family-tree limit of 8 levels (`lineage.limit` 8 in `get_session`), so a long chain would hit it.
- **The way that can work:** the docs say the safety check "reads the same CLAUDE.md content Claude itself loads", and the refusing rule is a *soft* block that clears when the user's approval names the action and the specific detail. So: the owner states the approval in their own chat message, Claude records it in `CLAUDE.md`, and the new launcher gets the project attached so its safety check reads it on every call (the old launcher has no project, so it never saw any approval of the owner's; heartbeats arrive marked "not from the user"). The safety-check rules forbid Claude writing an approval the owner didn't give ("Self-Modification", "Instruction Poisoning"), so this needs the owner's own message.

## What's next
- Next task: [T__], model: [size], effort: [level], type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- 

## Questions for the owner
- Asked in chat 2026-11-01 ~07:10 UTC: (1) type the robot approval in their own words, to be recorded in `CLAUDE.md`; (2) heartbeat every hour instead of every 2 hours?

## New words (also added to GLOSSARY.md)
- 

## Notes for the next Claude
- The safety check's rule text: run `claude auto-mode defaults --label 'Interfere'` (works in the cloud container). "Interfere With Workloads" is a soft block: "must name: interfering with those jobs or that shared resource".
- Docs read: https://code.claude.com/docs/en/auto-mode-config ("The classifier doesn't read `autoMode` from project settings"; "The classifier reads the same CLAUDE.md content Claude itself loads").
- To read who approved a call: `list_events` with `kinds: ["user"]`, then look at `tool_result_meta[].permission_decision.reason_type` (the results are big: save them and parse with python).
- Nothing changed yet on the alarm or the launcher. Old alarm: `trig_01YQJDB7a11iEV9mrxCTXhsr`. Old launcher: `session_0192jN2Svs467DTtiNZHcC6A`.
