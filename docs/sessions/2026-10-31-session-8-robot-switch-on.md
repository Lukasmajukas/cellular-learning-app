# Handoff note: 2026-10-31, T13 switch on the 24/7 robot

**Status:** DONE
**Model used:** Medium, Max effort (T13 asks for Medium effort; this chat was started on Max, see the notes below) · **Branch / pull request:** `claude/go-4h9lw1`, #11 (merged by Claude)

## In simple words (for the owner)
The robot is switched on and tested. My first try failed the test: a chat started by the robot's alarm gets no copy of your project, so it couldn't do anything. So I changed how the alarm works. It now wakes one small chat, the "Robot launcher", and that chat starts each robot run with the project attached. I tested it all the way through: a robot run started, read the rules, saw another chat was busy, and stopped, exactly as it should. The robot's first real job (the progress panel) should start at about 6:18 PM Eastern.

## What was done
- Claimed T13 (traffic light 🟢). Put away 2 old idle chats (the chat that wrote the robot rules, and the research chat). Nothing was deleted.
- Created the scheduled task "Robot" exactly as section G said, and fired it once.
- **Test 1, the alarm's own chat: failed.** No project files (empty folder, no git repo), no GitHub tools, no chat tools (`create_session`, `fire_trigger`, `list_triggers`, `get_session`). It did run on Sonnet in Auto mode, nothing waited for approval, and it sent a phone notification saying the repo was missing. Cause: `create_trigger` can't attach a repository or connectors to the chats it starts (`sources: []`, `mcp_connections: []`, plus a warning).
- **Test 2, a chat started with `create_session` and the repo attached: passed.** Project files, the full GitHub tool set, all chat tools, Sonnet, Auto mode, nothing blocked.
- Paused the broken alarm and renamed it "Robot (old, paused: no project attached)". It was not deleted.
- Built the fix: a permanent chat "Robot launcher (do not archive)" and a new "Robot" alarm that wakes it every 2 hours (`persistent_session_id`). The launcher starts each robot run with `create_session`.
- **End-to-end test: passed.** Alarm → launcher woke in 2 seconds → started a "Robot run" chat 8 seconds later (repo attached, Sonnet, Auto) → it ran the quick checks, saw pull request #11 was busy, stopped with 🔴 and changed nothing. About 22 seconds, `permission_denials: []`.
- Archived my 3 test chats. Rewrote `docs/WORKFLOW.md` section G to match (launcher, why, how to rebuild, owner commands, phone notifications), ticked T13, added T20, and updated README, cheat sheet, glossary, decisions and the diary.
- The first alarm run (20:07 UTC) failed at once because the 5-hour usage limit hadn't reset yet. That was before the fix.

## What's next
- Next task: **T18** (progress panel), model: **Medium (Sonnet)**, effort: **Medium**. The robot starts it by itself at about 22:18 UTC (6:18 PM Eastern). Or type `Go` in a fresh chat.
- T20 (you): two quick questions, below.

## Decisions made (also added to docs/DECISIONS.md)
- The alarm wakes a launcher chat, which starts each robot run (the alarm can't start a chat with the project itself).
- The first alarm is paused and renamed, not deleted.
- Bypass permissions can't be turned on in cloud chats; Auto mode is the hands-free setting.
- Robot chats send their own phone notification, only when they did a job or got stuck (changed from "after each run").

## Questions for the owner
- You typed `claude --permission-mode bypassPermissions` and then "get it into bypass mode, I need it hands free". It isn't possible in cloud chats: the app doesn't offer it, and cloud chats ignore it even in a settings file. Auto mode is the hands-free setting, and this chat never got stuck in it. If something did pop up asking you to approve, that's what T20 is for.
- T20 (1): while T13 ran, did the app ever show you a button or pop-up asking you to approve something? If yes, which action? Then Claude can ask you to add that one rule to the permission file.
- T20 (2): should Claude delete the old paused alarm "Robot (old, paused: no project attached)"?

## New words (also added to GLOSSARY.md)
- Robot launcher, Auto mode, Bypass permissions

## Notes for the next Claude
- **IDs.** Launcher chat: `session_0192jN2Svs467DTtiNZHcC6A`. Alarm "Robot": `trig_01YQJDB7a11iEV9mrxCTXhsr` (wakes the launcher; minute :18, even Eastern hours; first real tick 22:18 UTC). Old alarm, paused: `trig_017ujQMbKYQXA6bjqvoKr3vF`. The owner's unrelated "Weekly south hadley tower diff" alarm is disabled; leave it alone.
- **Proven:** a robot run started through the launcher has the project, GitHub tools and chat tools, is on Sonnet in Auto mode, and runs the quick checks and the 🔴 stop with no approval waits. The launcher called `list_triggers`, `get_session` and `create_session` unattended in Auto mode with no stall.
- **Not proven yet:**
  - A robot run's effort level. Chats started by `create_session` or the alarm don't show one, and a chat can't see its own. `modelSettings` may be ignored in cloud chats. This chat itself ran on Max even though `modelSettings` says Sonnet should be Medium, and the previous chat ran on Max with Opus (High expected), so the app's own effort setting wins for chats the owner starts.
  - A full robot run: `create_pull_request`, merging, `fire_trigger` for the chain, and `PushNotification` from a `create_session` chat. T18 will be the first real run; its handoff note must say whether anything asked for approval or was blocked (section G step 6).
  - Whether the launcher survives this chat being archived or timing out. If "Robot status" ever shows a FAILED last run, rebuild it from `docs/WORKFLOW.md` section G.
- **Platform facts learned.** `create_trigger` has no repo or effort setting, and a trigger that wakes an existing chat can't take notifications. Allow rules in `.claude/settings.json` are only read by a chat with exactly one repository (so not by the launcher). The earlier chat's prefilled `settings.local.json` link was never used by the owner and, per the documentation, the file that counts is `.claude/settings.json`. No denials were seen, so it isn't needed yet.
- **Cost, at list price.** An alarm chat with no project: about $0.09. A robot run that stops at 🔴: about $0.17. Each heartbeat that finds nothing to do costs about that, 12 times a day. The robot shares the owner's usage limit.
- The owner's phone got one notification from my first test ("Robot run couldn't start: the repo isn't in the environment"). That was expected.
