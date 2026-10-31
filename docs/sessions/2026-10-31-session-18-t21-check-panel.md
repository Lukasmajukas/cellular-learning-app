# Handoff note: 2026-10-31, T21 check and the progress panel

**Status:** DONE
**Model used:** Large (Opus), Max effort (the owner's pick for this chat) · **Branch / pull request:** `claude/go-4h9lw1` (merged by Claude)

## In simple words (for the owner)
You did the hands-free steps you could, and I checked them: the permission lines are all there. The step about the page-publishing tools can't be done on your account, because those tools are built into Claude and aren't one of your connectors. So robot chats no longer try to publish your progress page, which means they can't get stuck on it. The page refreshes when you're in a chat with Claude, and you click Approve once.

## What was done
- **Checked `.claude/settings.json` on main** (owner's commit `ec6b987`): valid, all 16 allow lines from `docs/permission-lines.md` are there, no extras, no duplicates, and the other settings are unchanged.
- **Tested the connector step:** republished the panel from this chat at 5:12 PM. It still asked the owner ("Publish Files", approved once). The owner couldn't find those tools at claude.ai/customize/connectors. The connector list (Apple Music, Clinical Trials, Gmail, Google Calendar, Docs, Drive, Sheets, Slides, Indeed) confirms the publishing tools aren't an owner connector. There's no local setting for them either.
- **Rules:**
  - `docs/WORKFLOW.md` C2a: robot runs never republish. They still update `live.json` and commit `index.html`.
  - `panel/README.md`: says the same.
  - `docs/permission-lines.md`: step 2 now says skip it, and why.
- **Tasks:** T21 moved to Done. New T39 (You + Claude): find a hands-free way to refresh the panel.
- **Panel:** refreshed `panel/live.json` and `panel/index.html`, and republished after the merge (owner approves once).

## What's next
- Owner: read the plan (T04), and say whether the panel looks right on the phone too (T22).
- Robot: restarted after this merge.

## Decisions made (also added to docs/DECISIONS.md)
- Robot runs never republish the progress page; owner chats do, with one Approve click. This replaces the earlier "set those tools to Allowed" decision.

## Questions for the owner
- Does the panel look right on your phone as well as your PC? (T22)

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- Approval records are in this chat's own transcript: each tool result has a `permissionDecision`. `source: user_temporary` means the owner clicked; `source: config` with `ruleSource: mcpServerPolicy` means the policy allowed it without asking. `guide` and `get_artifact` are allowed; `publish_files` asks.
- T39 idea: the artifact server can keep page data (`db_write`, after `describe_capabilities`). Nobody knows yet whether `db_write` asks first. Test it in a chat the owner is in, never in a robot run.
- This change was kept separate from T38 (robot chat names and tidying, #20) at the owner's request.
