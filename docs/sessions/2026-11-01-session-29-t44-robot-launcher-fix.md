# Handoff note: 2026-11-01, T44 permanent fix for the robot stopping by itself

**Status:** DONE
**Model used:** Large, High effort · **Branch / pull request:** `claude/jolly-brown-5q0cng`, pull requests #32 (part 1) and #33 (part 2)

## In simple words (for the owner)
The robot kept stopping because Claude's safety check sometimes said "no" when the launcher tried to open the next robot chat. Your permission list can't help with that: for opening chats, starting the next run and putting chats away, the safety check always decides by itself. But the safety check reads `CLAUDE.md`. So you typed your approval, it's written there word for word, and a new launcher that can read it now starts the robot chats. The alarm also rings every hour now, so if a "no" ever happens again, the robot waits an hour at most.

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
- **Part 1, merged as pull request #32:** the owner typed the approval (and "yes" to an hourly alarm) at about 07:25 UTC. Recorded word for word in `CLAUDE.md`, new section "The robot: what the owner approved", plus a line saying the launcher chat skips the "Every session" steps. Merged first because the new launcher reads `CLAUDE.md` from `main`. Part 2 continues on a new pull request.
- **Part 2, pull request #33:**
  - The old launcher was refused a second time at 07:18 UTC, so the switch was urgent.
  - Old launcher renamed "Robot launcher (old, retired 2026-11-01: no project)". Old schedule renamed "Robot (old, off: launcher had no project)" and switched off (not deleted: deleting a schedule deletes the chats it started).
  - New launcher `session_0192jN2QFiYs4DpvL6W6MomZ`: project attached, Sonnet, Auto mode, new prompt (`docs/WORKFLOW.md` section G). Self-check passed, and it skipped the every-session steps as told.
  - New schedule "Robot" `trig_01RH9EsLZizd6JyPGw7NVSEc`: hourly (`30 * * * *` UTC after the server's shift; first heartbeat about 08:36 UTC).
  - **Test 1** (07:30:59): the launcher's `create_session` was accepted; robot run `session_0192jN2QzR5PFGYDDAaVqfUZ` read the rules, saw 🔴 (pull request #33), claimed nothing and put itself away (07:31:35).
  - **Test 2** (07:33:18, 2 min 20 s after the last start, the pattern refused overnight): accepted again; robot run `session_0192jN2REPCmShBKwj57Eo1b`.
  - Both acceptances say `reason_type: "classifier"`: the safety check said yes. It can't be `"rule"` for this tool in Auto mode.
  - My `archive_session` on the old launcher was **refused** by the safety check ("judged this action dangerous"; it's a chat this chat didn't create, and the owner's approval covers robot chats archiving robot chats, not this). Not retried. It stays in the owner's list; it's harmless.
  - Docs: `docs/WORKFLOW.md` (rule 6, permission-file note, section G: setup, why, if-down, chain, `Robot status`, rebuild steps, launcher prompt), `GLOSSARY.md` (Classifier; heartbeat and launcher now hourly), `docs/permission-lines.md`, `docs/DECISIONS.md`, `docs/PROGRESS-LOG.md`, `TASKS.md`, panel.
- **The way that can work:** the docs say the safety check "reads the same CLAUDE.md content Claude itself loads", and the refusing rule is a *soft* block that clears when the user's approval names the action and the specific detail. So: the owner states the approval in their own chat message, Claude records it in `CLAUDE.md`, and the new launcher gets the project attached so its safety check reads it on every call (the old launcher has no project, so it never saw any approval of the owner's; heartbeats arrive marked "not from the user"). The safety-check rules forbid Claude writing an approval the owner didn't give ("Self-Modification", "Instruction Poisoning"), so this needs the owner's own message.

## What's next
- The robot carries on by itself (next Claude task in `TASKS.md`). Watch the first few hours: `Robot status` now also shows whether the launcher's last start was refused.
- For the owner: T40 (try the test build) is the ⭐. In a chat: Sonnet, Medium effort, `Do task T39 in TASKS.md`.

## Decisions made (also added to docs/DECISIONS.md)
- The permission lines can't cover `archive_session`, `create_session`, `fire_trigger` in Auto mode; the owner's own approval, typed in chat, is recorded word for word in `CLAUDE.md` instead.
- New launcher with the project attached; old launcher and schedule renamed and switched off, not deleted.
- Heartbeat every hour (owner said yes).
- Softer robot-run prompt; never retry a refusal.

## Questions for the owner
- Asked in chat ~07:10 UTC: (1) type the robot approval in their own words; (2) hourly heartbeat? Both answered yes at ~07:25 UTC.
- Optional: archive the old launcher chat by hand (Claude's archive was refused).

## New words (also added to GLOSSARY.md)
- Classifier (Claude's safety check in Auto mode).

## Notes for the next Claude
- The safety check's rule text: run `claude auto-mode defaults --label 'Interfere'` (works in the cloud container). "Interfere With Workloads" is a soft block: "must name: interfering with those jobs or that shared resource".
- Docs read: https://code.claude.com/docs/en/auto-mode-config ("The classifier doesn't read `autoMode` from project settings"; "The classifier reads the same CLAUDE.md content Claude itself loads").
- To read who approved a call: `list_events` with `kinds: ["user"]`, then look at `tool_result_meta[].permission_decision.reason_type` (the results are big: save them and parse with python).
- Old alarm: `trig_01YQJDB7a11iEV9mrxCTXhsr` (off). Old launcher: `session_0192jN2Svs467DTtiNZHcC6A` (retired, not archived).
- The schedule record has `auto_mode_allow` / `auto_mode_environment` / `sources` fields in its `session_request.config`, all empty. No tool sets them, so they're not a way in; don't try to.
- If refusals keep happening even with the approval: look at the launcher's `post_turn_summary` and the refusal reason (`claude auto-mode defaults --label '<reason>'`). Only the owner can reword or widen the approval, in their own chat message.
- Robot runs read `CLAUDE.md` from `main`; the launcher gets a fresh copy whenever its container restarts.
