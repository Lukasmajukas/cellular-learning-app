# 🚦 How chats share the work

**Your whole job, every time:**
1. Start a new chat with this repository selected. Leave the branch on **main** (the normal choice).
2. Pick the model and effort that `TASKS.md` says.
3. Type `Do the next task in TASKS.md`, or just `Go`.
4. Read Claude's last message. It tells you what changed, anything it needs from you, and when to start a fresh chat.

That's it. You don't open GitHub. You don't merge. You don't have to remember which chat did what. Claude does all of that.

---

## What went wrong before (Oct 31)
You opened four chats in half an hour and typed "do the next task" in each one. Every chat read the to-do list, saw T03 wasn't ticked yet, and did T03. So T03 got done four times.

It's like four friends each buying milk because nobody wrote "I'm getting the milk" on the fridge note. Two things were missing:
- **No "I'm on it" note.** A chat couldn't see that another chat had already started.
- **The list only got ticked when you merged.** Merging was your job, so the list stayed out of date.

## The fix: six simple rules

### 1. Every chat starts from the newest copy
A chat always grabs the newest version of the binder (`main`) first. If you pick the wrong branch by accident, Claude switches to the newest copy by itself. The branch you picked isn't changed or deleted.

### 2. The traffic light
Before doing anything, every chat checks whether another chat is busy:

| Light | What it means | What the chat does |
|---|---|---|
| 🔴 Red | Another chat is working right now | Stops and tells you. Go back to the other chat. If that chat is closed or stuck, type `Take over`. |
| 🟡 Yellow | An earlier chat stopped halfway and went quiet | Picks up the unfinished work and finishes it. Nothing is lost. |
| 🟢 Green | Nobody is busy | Starts the next ⭐ task. |

### 3. A "busy" sign on the door
In its first few minutes, a chat hangs a sign on its task. The sign is a pull request with **[in progress]** in its name, like `T04: Write the plan [in progress]`. That's the "I'm getting the milk" note, and every other chat can see it.

### 4. Claude saves its own work into the binder
At the end, Claude merges its own work into `main` and takes the sign down. The next chat sees the task ticked. Nothing sits around waiting for you.

**When Claude needs your "yes"** (like signing off the plan, or "the test build works"), you type it in a chat. Claude writes it down and saves it. No clicking on GitHub.

### 5. Old chats put themselves away
When a new chat starts a task, it archives this project's older chats, so your list stays short. Archiving is like putting a finished worksheet in a drawer: it's out of the way, but not thrown out. A chat that is still working is never put away. Robot chats tidy up after themselves: each one names itself after its job (like "Robot: Photo sources list") and puts itself away when it's done. A robot chat that's waiting for your approval stays in your list so you can find it.

### 6. A robot keeps working around the clock
The robot works day and night in the cloud, so your PC can be off. (Switched on in task T13 on Oct 31.)
- When a robot chat finishes a task, it starts the next one right away. Every 2 hours a check restarts it if it stopped.
- It gives each task the right brain: Haiku with Low effort for small jobs, Sonnet with Medium for most work, Opus with High for big planning.
- It never uses paid extra usage. When your plan's limit is used up, it waits for the reset and carries on.
- It does Claude's tasks, including the first draft of the app plan for you to read. It builds the app only after you sign off the plan. Anything only you can do goes into `TASKS.md` as a "You" row.
- You get a phone notification when a robot chat did a job or got stuck.
- A small chat called "Robot launcher (do not archive)" is the robot's alarm bell. Leave it alone.
- **Your switch:** type `Stop the robot`, `Start the robot` or `Robot status` in any chat, even from your phone.
- Your own chats share the same limit. Stop the robot when you want the limit for yourself.

Also, if any chat hits your usage limit, it waits for the limit to reset and carries on by itself.

## What if...?
| What happened | What to do |
|---|---|
| I opened two chats by accident | Nothing. The second one shows 🔴 and tells you to use the first. Close the second. |
| I picked the wrong branch when I started a chat | Nothing. Claude starts from the newest copy by itself. |
| I closed a chat in the middle of a task | Start a new chat and type `Go`. If it shows 🔴, type `Take over`. |
| I want two different tasks done at the same time | In the second chat, type `Do task T__ at the same time`. It only works for a different task. |
| I don't like what Claude did | Tell Claude what to change, or type `Undo the last change`. |
| The robot used up my limit and I want to chat | Type `Stop the robot`. Later, type `Start the robot`. |
| I want an archived chat back | Type `Bring back the chat called ___` in any chat. Archived chats aren't deleted. |
| I archived the "Robot launcher" chat by accident | Type `Bring back the chat called Robot launcher`. Until it's back, the robot's 2-hour alarm has nobody to wake. |
| A chat says the safety check stopped it | Nothing breaks. Tell any chat what the message said, and it will look into it. |
| I haven't looked at the project in a while | Start a chat and type `Where are we?` |
| I want to look at the files myself | Open the GitHub app or github.com. Looking never breaks anything. |
| An old chat from before this change asks me a question | Don't answer it. Just close it. Its questions are handled. |

## Settings
**GitHub:** you don't need to change anything. One optional tidy-up: on github.com, open this repository, click **Settings**, stay on **General**, and tick **Automatically delete head branches**. Then old branches disappear after Claude merges. Without it they pile up in the branch list, but they're harmless.

**Permission file (you added it on Oct 31):** Claude has a safety check. A small file, `.claude/settings.json`, tells the check that some jobs are OK: looking at your chat list, putting old chats away, and merging or closing Claude's own pull requests. Claude isn't allowed to add permissions to it, because that would be Claude giving itself power. Only you can.
- **If it ever goes missing:** use [this link to add it again](this link](https://github.com/Lukasmajukas/cellular-learning-app/new/main?filename=.claude%2Fsettings.json&value=%7B%0A%20%20%22permissions%22%3A%20%7B%0A%20%20%20%20%22allow%22%3A%20%5B%0A%20%20%20%20%20%20%22mcp__claude-code-remote__list_sessions%22%2C%0A%20%20%20%20%20%20%22mcp__claude-code-remote__get_session%22%2C%0A%20%20%20%20%20%20%22mcp__claude-code-remote__archive_session%22%2C%0A%20%20%20%20%20%20%22mcp__github__merge_pull_request%22%2C%0A%20%20%20%20%20%20%22mcp__github__update_pull_request%22%0A%20%20%20%20%5D%0A%20%20%7D%0A%7D%0A). Check that the big box shows a few lines of text. Click **Commit changes**, then **Commit changes** again in the box that pops up.
- **To remove it:** ask Claude in any chat. Taking permissions away is allowed.

---

## Rules for Claude (follow exactly)

### A. Start-up check: before any other work
1. **Get the newest main.**
   ```bash
   git fetch origin main
   git merge-base --is-ancestor HEAD origin/main && git merge --ff-only origin/main
   ```
   If the second line fails, this chat began on some other branch (picked by mistake, or old). Start clean from main. The old branch stays on GitHub untouched:
   ```bash
   git checkout -B "$(git branch --show-current)" origin/main
   ```
   Tell the owner in one line: "You started from an old branch. I switched to the newest copy, and nothing was lost." If your first push is refused because the old copy of the branch is still on GitHub, bring it in with `git fetch origin <branch> && git merge origin/<branch>` (its content is the same, so nothing changes), then push normally. Never force-push: the safety check blocks it. If GitHub already deleted the old copy, run `git fetch --prune origin` and push normally.
2. **Read the traffic light.** List open pull requests (`list_pull_requests`, state `open`). Look only at ones from `claude/` branches.
   - A pull request with `[in progress]` in its title is **busy** if it was updated in the last 2 hours, or if its chat is running right now. The session link at the end of its description names the chat, and `get_session` shows whether that chat is working. Two cases `get_session` settles straight away:
     - The chat **stopped with an error** (`status_bucket` is FAILED, for example "You've hit your 5-hour limit"): it is **not busy**. Treat it as 🟡 right away; don't wait 2 hours. (If the limit is still used up, no run can start anyway, so nothing collides.)
     - The chat is **waiting for an approval** (`session_status` is REQUIRES_ACTION): it is still 🔴, but a robot run also sends the owner one push notification (`PushNotification`, status `proactive`) naming the action in `needs_action`, for example: "The robot is waiting for you: open the chat called Robot run and approve Publish Files." Taking over would only hit the same question.
   - 🔴 **Busy:** stop. Say: "🔴 Another chat is working on T__ (last saved HH:MM). Go back to that chat. If it's closed or stuck, type `Take over`." Do nothing else. Exceptions: the owner typed `Take over` (go to 🟡), or `Do task T__ at the same time` for a task that isn't the busy one (go to 🟢 with that task).
   - 🟡 **[in progress] but not busy, or the owner typed `Take over`:** claim the same task (step 3). Bring in its work with `git fetch origin <its-branch>` and `git merge origin/<its-branch>`, read its handoff note, and finish the task. Close the old pull request with the comment "Continued in #<yours>." Tell the owner: "An earlier chat stopped halfway through T__. I'm finishing it here. Don't go back to the old chat."
   - 🟢 **A pull request without [in progress]** is finished work that never got merged. Merge it (squash). If GitHub refuses because of a conflict, treat it as 🟡. Then fetch main again.
   - 🟢 **Nothing open:** take the task the owner named, or else the ⭐ task in `TASKS.md`.
3. **Claim the task within the first few minutes.**
   - Copy `docs/sessions/TEMPLATE.md` to `docs/sessions/YYYY-MM-DD-session-N-<short-name>.md`. N is the highest session number so far plus 1. Leave `**Status:** IN PROGRESS` at the top.
   - Commit, push, and open a **draft** pull request titled `T__: <task name> [in progress]`. Its description ends with this chat's session link.
   - List open pull requests again. If another `[in progress]` pull request for the same task has a **lower** number than yours, close yours with "Duplicate of #__" and stop with the 🔴 message. (Skip this check for a pull request you are taking over in 🟡.)
4. **Tidy the chat list.** Do this only after step 3, never after a 🔴 stop.
   - `get_session` with no ID gives your own session ID. `list_sessions` with `mine: true` lists recent chats.
   - Archive a chat with `archive_session` only if all of these are true: it isn't you; it isn't archived already; it isn't working right now; `get_session` shows `Lukasmajukas/cellular-learning-app` in its sources; and its session link isn't in any open `[in progress]` pull request. Never archive the chat titled "Robot launcher (do not archive)".
   - If an archive is refused, skip that chat. Tell the owner once: "The safety check stopped me putting away some old chats." Never retry or work around a refusal.
   - Tell the owner in one line how many old chats you put away.

### B. While working
- One task per chat.
- Push at least once an hour, so your sign stays fresh.
- Before each push, check that your pull request is still open. If another chat closed it ("Continued in #__"), stop and tell the owner: "This work moved to a newer chat. Please use that one."
- Push before you stop to wait for an answer.
- **Never leave a pull request open waiting for the owner.** Merge drafts as drafts, with `Status: DRAFT` written inside the file. Ask questions in the chat, and add them to `TASKS.md` as rows where "Who" is "You".
- If the owner asks for more after your pull request was merged, start from a fresh copy (`git fetch --prune origin && git checkout -B <branch> origin/main`). If the old copy of your branch is still on GitHub, bring it in with `git merge origin/<branch>` (same content, so nothing changes) before you push. Then push normally (no force-push: the safety check blocks it) and claim again (step A3).

### C. Finishing: after the end-of-session steps in `CLAUDE.md`
1. Bring in the newest main: `git fetch origin main && git merge origin/main`. Fix any conflicts. In logs and lists, keep the lines from both sides.
2. Push. Update the pull request description using the template, and set its Status line to done.
2a. **Refresh the panel** (`panel/README.md`): update `panel/live.json`, run `python3 panel/build.py`, commit `panel/index.html`, and republish the page. If publishing fails, note it in the handoff note; it never blocks the merge. **Robot runs:** republish only once the owner has allowed the page-publishing tools on the connector (T21 is under Done in `TASKS.md`). Until then, skip the republish and write "panel not republished: waiting for T21" in the handoff note, because publishing would stop and wait for an approval nobody is there to give. Chats the owner is in may republish; the owner can approve.
3. Take `[in progress]` out of the title and mark it ready (`update_pull_request` with `draft: false`).
4. Merge it: `merge_pull_request`, method `squash`, commit title `T__: <task name> (#<number>)`.
5. If the merge fails, repeat step 1 and try once more. If it still fails, leave the title without `[in progress]` so the next chat merges it (🟢), and tell the owner in plain words.
6. Tell the owner what changed and what you need from them. End with "Time for a fresh chat:", the model and effort (for example "Opus, High effort"), and exactly what to type.

### D. "Undo the last change"
Run the start-up check and claim a task called "Undo: <what>". Find the last merge with `git log --first-parent --oneline origin/main`, then `git revert` it (add `-m 1` if it's a merge commit). Finish the normal way, and tell the owner exactly what was undone.

### E. "Bring back the chat called ___"
Find it with `list_sessions` and run `unarchive_session` on it. Tell the owner it's back in their list.

### F. Never
- Push straight to `main`.
- Force-push anything. The safety check blocks it. Merge the old copy of your branch instead (steps A1 and B).
- Delete branches.
- Merge a pull request that another chat is busy with (🔴).
- Archive a chat that is working, a chat from another project, a chat named in an open `[in progress]` pull request, or the "Robot launcher (do not archive)" chat. The one exception: a robot chat puts itself away at the end of its own run (section G step 10).
- Add permissions to `.claude/settings.json`. Only the owner adds permissions. Change other settings in it only when the owner asks in chat.
- Merge app code before the owner signs off on `docs/PRD.md`.

### G. Robot runs (chats that start by themselves)
**Setup:** one scheduled task named "Robot" wakes one small, permanent chat called "Robot launcher (do not archive)" every 2 hours, US Eastern. That's the heartbeat. The launcher starts a fresh robot chat with `create_session` (project attached, Sonnet, Auto mode, titled "Robot run"). Robot chats also start the next run themselves when they finish, by firing "Robot": the chain. Everything runs in the cloud; the owner's PC can be off.

**Why a launcher (found in T13, 2026-10-31):** a scheduled task made with `create_trigger` can't attach the project or the chat tools to the chats it starts, so a chat started that way was empty and could do nothing. A chat started with `create_session` gets the project, the GitHub tools and the chat tools (tested). So the schedule wakes the launcher, and the launcher starts the real robot chat.

**Effort (measured 2026-10-31):** a chat started with `create_session` runs at the effort that `modelSettings` in `.claude/settings.json` gives its model. Haiku Low and Sonnet Medium were measured (the `CLAUDE_EFFORT` setting inside the chat); Opus High is expected but not measured. No tool changes the effort of a running chat, and `create_session` has no effort setting. The owner's app picker only sets the effort of chats the owner starts (those can be Max). So the robot changes effort only by choosing a different model, and it moves up a size when a try fails (step 5).

**If the robot is down, what starts it again:**
- **Usage limit used up.** Chats the owner starts in the app carried on after the reset (seen in T24). A chat started with `create_session` did not (seen in T13). So a robot chat that hits the limit just stops. The heartbeat wakes the launcher every 2 hours, and the first one after the reset starts a new run, so the most the robot waits after a reset is about 2 hours. A pull request left `[in progress]` by a chat that died on the limit counts as 🟡 right away (section A2), so that run finishes the unfinished work.
- **A robot chat that stopped with an error.** Same: 🟡 right away.
- **A robot chat waiting for an approval.** This can't fix itself: only the owner can click Approve. The next robot run sends the owner a push naming the action (section A2). The lasting fix is to set that tool to Allowed (`docs/permission-lines.md`).
- **The launcher refuses to start runs** (for example, it took quick firings for a loop): tell it the firings are expected and to follow its steps, with `send_message` to the launcher or by typing in the launcher chat. Its runaway guard allows up to 6 runs an hour.
- **The launcher or the "Robot" alarm is missing or off.** `Robot status` shows it (a FAILED last run), and the owner's commands in this section put it right.

**Every robot run, in this order:**
1. **Quick checks, before reading anything big:**
   - `list_triggers`: if the one named exactly "Robot" is off, stop with "The robot is paused." (Ignore the old paused one.)
   - `get_session` with no ID: if `rate_limit_info.isUsingOverage` is true, stop with "Your plan's limit is used up. I'll try again after it resets." Never work on paid usage.
   - `list_pull_requests`: if another chat is busy (🔴, section A2), stop with "Another chat is working."
2. **Start-up check:** sections A1 and A2 as usual.
3. **Pick one job**, in this order:
   - 🟡 unfinished work: take it over (section A2).
   - Otherwise the first task in `TASKS.md`, top to bottom ("Now" table first), that:
     - has "Who" = "Claude", or "Claude + you" (do only Claude's part);
     - isn't app code, unless `docs/PRD.md` has a line `Signed off by owner: YYYY-MM-DD`;
     - hasn't failed twice (two handoff notes for it say BLOCKED);
     - doesn't need the owner to be there.
   - Nothing fits: claim nothing, do the tidy step (A4), and stop with "Nothing for me to do."
4. **Claim it** (section A3). Then **name yourself**, so the owner can tell robot chats apart: `set_session_title` on your own session ID with `Robot: <the task in a few plain words>`, for example "Robot: Photo sources list". No task numbers.
5. **Right brain:** read the task's size in `TASKS.md`.
   - Medium: do it yourself.
   - Small or Large: start a new chat with `create_session`. Use model `claude-haiku-5-5` for Small or `claude-opus-5-5` for Large, `source_url` `https://github.com/Lukasmajukas/cellular-learning-app`, `permission_mode` `auto` if allowed, and the title `Robot (Haiku): <same plain name>` or `Robot (Opus): <same plain name>`. Prompt: "You are a robot worker for the cellular-learning-app project. The owner is away. Take over pull request #<your claim> and do task T__. Follow CLAUDE.md and docs/WORKFLOW.md, sections A to C and G steps 6 to 10. Never wait for an answer." Then point your pull request at the new chat: in its description, swap your session link for the new chat's link (`update_pull_request`), so the busy check looks at the chat that is really working. Then put yourself away (step 10). The new chat takes over your claim (🟡 rules).
   - **Move up one size after a failed try.** A try failed if the task's last handoff note says BLOCKED because the work wasn't good enough or a check failed (not because of missing access or an answer only the owner has), or if a review turned it down. Retry one size up: Small → Medium → Large (Haiku → Sonnet → Opus), which also raises the effort (Low → Medium → High). Never go down a size. A Large task is retried once at Large. After two failed tries step 3 leaves it for the owner (a "You" row), and only the owner may choose Fable (Extra large).
6. **Do the job and finish** the normal way (section C), including the merge. For a "Claude + you" task, merge Claude's part as a draft, then change the row's "Who" to "You" and say what the owner needs to do, for example: "Read `docs/PRD.md`, then type `I sign off the plan` in any chat." In your handoff note, also write whether anything asked for approval or was blocked, and name the action.
7. **If the job is blocked** (missing access, or an answer only the owner has): write it in the handoff note with the word BLOCKED, add a "You" row, merge that, then go to step 9.
8. **Tidy** (A4), with one change: a finished robot chat goes right away, but any other chat only after 2+ quiet hours, so a chat the owner is in the middle of is never touched. A finished robot chat is one that another chat started (`origin` is `claude_code_mcp_seed` in `list_sessions`), that isn't working, and that isn't waiting for an approval (`session_status` REQUIRES_ACTION: leave those for the owner).
9. **Chain:** if "Robot" is still on, you're not on paid usage, and another task could fit step 3, start the next run now with `fire_trigger` on "Robot" (that wakes the launcher). End with a two-line summary and send it with `PushNotification` (status `proactive`): that is the owner's phone notification. Send it only when you did a job or got stuck, not for "Another chat is working", "Nothing for me to do" or "The robot is paused".
10. **Put yourself away, last.** After everything else, run `archive_session` on your own session ID (`get_session` with no ID). Do this however the run ends: a job done, blocked, handed to a new chat in step 5, or an early stop in steps 1 to 3 ("The robot is paused", "Another chat is working", "Nothing for me to do", limit used up). An archived chat isn't deleted: the owner can still open it. If the archive is refused, leave it; the next run's tidy step puts it away. A run stuck waiting for an approval can't do this, so it stays in the owner's list where they can find it.
11. **Never:** start helper agents, change the schedule (except for the owner's commands below), touch `.claude/settings.json`, rename or archive the Robot launcher, start a second job in the same run, or use paid usage.

**The owner's commands** (any chat, any device; they skip the traffic light because they don't change project files):
- `Stop the robot`: `update_trigger` with `enabled: false` on the trigger named exactly "Robot" (ignore the paused "Robot (old, paused: no project attached)"). Say: "The robot is stopped. The task it's on will finish, then nothing new starts."
- `Start the robot`: `update_trigger` with `enabled: true` on "Robot", then `fire_trigger` once.
- `Robot status`: whether "Robot" is on, the next heartbeat and how the last one went (`list_triggers`: `next_run_at` and `last_run`; a FAILED last run means the launcher is missing or the limit was used up); what's being worked on (open `[in progress]` pull requests); and the top 3 diary lines.
- `I sign off the plan`: add `Signed off by owner: YYYY-MM-DD` to `docs/PRD.md` and merge it. That unlocks app building for the robot.

**How the robot is built** (set up in T13, 2026-10-31; use this to rebuild it):
1. **The launcher chat:** `create_session` with title "Robot launcher (do not archive)", model `claude-sonnet-5-5`, `permission_mode: auto`, and no `source_url`. Its first message is the launcher prompt below. It does a self-check and waits.
2. **The heartbeat:** `create_trigger` with name "Robot", `persistent_session_id` set to the launcher's session ID, `initiation: human_request`, cron `CRON_TZ=America/New_York 0 */2 * * *` (the server spreads the minute across the hour), and the prompt "Heartbeat: start one robot run now. Follow your launcher steps 1 to 4 exactly." A schedule that wakes an existing chat can't send phone notifications, so robot chats send their own (step 9).
3. **Test:** `fire_trigger` once while a pull request is `[in progress]`. The launcher should start a chat titled "Robot run" that stops at 🔴. Check it with `get_session` and `list_events`.
4. **If the launcher is ever archived or deleted:** bring it back (section E). If it's gone for good, pause "Robot", then redo steps 1 and 2.

**Launcher prompt** (the launcher's first message):
```
You are the "Robot launcher" for the cellular-learning-app project (owner: Lukas). You are a tiny relay. You have no project folder and you don't need one. Never read, write or delete any files, never open pull requests, and never do anything that is not listed below.

RIGHT NOW (this first message only): reply with ONE line saying whether these chat tools are available, by name: create_session, fire_trigger, list_triggers, get_session. Do NOT start any robot run now. Then stop and wait.

AFTER THAT, every message you receive means "start one robot run". Messages can come close together: each robot run sends one when it finishes its job (the chain), the 2-hour heartbeat sends one, and the owner or Claude may send one by hand. That is expected; it is not a loop. Don't try to judge whether other runs are still working: each robot run checks the traffic light itself. Do exactly these steps, in order:
1. Call list_triggers. Find the scheduled task named exactly "Robot". If it is missing or not enabled, reply "The robot is paused." and stop.
2. Call get_session with no session ID. If rate_limit_info.isUsingOverage is true, reply "Your plan's limit is used up. Not starting." and stop. Never use paid extra usage.
2b. Runaway guard: if you have started 6 or more robot runs in the last 60 minutes, reply "Runaway guard: not starting" and stop. The next heartbeat tries again.
3. Call create_session with exactly these settings:
   - source_url: https://github.com/Lukasmajukas/cellular-learning-app
   - model: claude-sonnet-5-5
   - permission_mode: auto
   - title: Robot run
   - prompt: You are the robot run for the cellular-learning-app project. The owner is away. Follow CLAUDE.md and docs/WORKFLOW.md section G exactly, starting with the quick checks. Never wait for an answer: put questions in TASKS.md as 'You' rows.
4. Reply with one line: "Started robot run <new session id>." Then stop.

If a step fails, reply with one line naming the step and the error, then stop. Never retry in a loop, and never start more than one robot run per message.
```
