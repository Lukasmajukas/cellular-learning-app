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
- When a robot chat finishes a task, it starts the next one right away. Every hour a check restarts it if it stopped.
- It gives each task the right brain: Haiku with Low effort for small jobs, Sonnet with Medium for most work, Opus with High for big planning.
- It never uses paid extra usage. When your plan's limit is used up, it waits for the reset and carries on.
- It does Claude's tasks, including the first draft of the app plan for you to read. It builds the app only after you sign off the plan. Anything only you can do goes into `TASKS.md` as a "You" row.
- You get a phone notification when a robot chat did a job or got stuck.
- A small chat called "Robot launcher (do not archive)" is the robot's alarm bell. Leave it alone.
- **Your switch:** type `Stop the robot`, `Start the robot` or `Robot status` in any chat, even from your phone.
- **The redesign (T59, since Nov 4):** the robot also rebuilds the app's look, one Opus chat at a time, nonstop, then keeps improving it (`docs/redesign/PLAN.md`). To stop only that part, type `Pause the redesign`; to restart it, `Resume the redesign`.
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
| I archived the "Robot launcher" chat by accident | Type `Bring back the chat called Robot launcher`. Until it's back, the robot's hourly alarm has nobody to wake. |
| A chat says the safety check stopped it | Nothing breaks. Tell any chat what the message said, and it will look into it. |
| I haven't looked at the project in a while | Start a chat and type `Where are we?` |
| I want to look at the files myself | Open the GitHub app or github.com. Looking never breaks anything. |
| An old chat from before this change asks me a question | Don't answer it. Just close it. Its questions are handled. |

## Settings
**GitHub:** you don't need to change anything. One optional tidy-up: on github.com, open this repository, click **Settings**, stay on **General**, and tick **Automatically delete head branches**. Then old branches disappear after Claude merges. Without it they pile up in the branch list, but they're harmless.

**Permission file (you added it on Oct 31):** Claude has a safety check. A small file, `.claude/settings.json`, tells the check that some jobs are OK, like looking at your chat list and merging or closing Claude's own pull requests. Claude isn't allowed to add permissions to it, because that would be Claude giving itself power. Only you can.
- **Three robot jobs ignore this file (found in T44):** opening a new chat, starting the next robot run, and putting chats away. In Auto mode the safety check always decides those itself. What it reads instead is `CLAUDE.md`, so your approval for the robot, which you typed in chat on Nov 1, is written there word for word.
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
2. **Read the traffic light.** List open pull requests (`list_pull_requests`, state `open`). Look only at **our own**: the branch starts with `claude/` **and** `head.repo.full_name` is exactly `Lukasmajukas/cellular-learning-app`. The repository is public, so anyone can copy it and name a branch `claude/anything`; only the source repository tells a copy from the real thing. Ignore every other pull request: never merge, close, take over, wait for or comment on it, and don't let it make the light red. A pull request with no `head.repo` (its copy was deleted) is not ours either. Mention each ignored pull request once, in one line with its number, so the owner can close it on github.com. A robot run writes that line in its handoff note and sends no push for it.
   - A pull request with `[in progress]` in its title is **busy** if it was updated in the last 2 hours, or if its chat is running right now. The session link at the end of its description names the chat, and `get_session` shows whether that chat is working. Two cases `get_session` settles straight away:
     - The chat **stopped with an error** (`status_bucket` is FAILED, for example "You've hit your 5-hour limit"): it is **not busy**. Treat it as 🟡 right away; don't wait 2 hours. (If the limit is still used up, no run can start anyway, so nothing collides.)
     - The chat is **waiting for an approval** (`session_status` is REQUIRES_ACTION): it is still 🔴, but a robot run also sends the owner one push notification (`PushNotification`, status `proactive`) naming the action in `needs_action`, for example: "The robot is waiting for you: open the chat called Robot run and approve Publish Files." Taking over would only hit the same question.
   - 🔴 **Busy:** stop. Say: "🔴 Another chat is working on T__ (last saved HH:MM). Go back to that chat. If it's closed or stuck, type `Take over`." Do nothing else. Exceptions: the owner typed `Take over` (go to 🟡), or `Do task T__ at the same time` for a task that isn't the busy one (go to 🟢 with that task).
   - 🟡 **[in progress] but not busy, or the owner typed `Take over`:** claim the same task (step 3). Bring in its work with `git fetch origin <its-branch>` and `git merge origin/<its-branch>`, read its handoff note, and finish the task. Close the old pull request with the comment "Continued in #<yours>." Tell the owner: "An earlier chat stopped halfway through T__. I'm finishing it here. Don't go back to the old chat."
   - 🟢 **A pull request without [in progress]** is finished work that never got merged. Merge it (squash). Right before you merge, check again that `head.repo.full_name` is this repository and `user.login` is `Lukasmajukas`. If either is different, don't merge it: it counts as an ignored pull request. If GitHub refuses because of a conflict, treat it as 🟡. Then fetch main again.
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
2a. **Refresh the panel** (`panel/README.md`): update `panel/live.json`, run `python3 panel/build.py`, commit `panel/index.html`, and republish the page. If publishing fails, note it in the handoff note; it never blocks the merge. **Robot runs:** never republish. The page-publishing tool always asks first, and the owner can't switch that off (it's built into Claude, not one of their connectors; found in T21), so publishing would stop and wait for an approval nobody is there to give. Still update `panel/live.json` and commit the rebuilt `panel/index.html`, and write "panel not republished (robot run)" in the handoff note. Chats the owner is in do republish; the owner clicks Approve once. Task T39 looks for a hands-free way.
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
- Merge, close, take over or wait for a pull request whose source repository isn't this one (section A2).
- Archive a chat that is working, a chat from another project, a chat named in an open `[in progress]` pull request, or the "Robot launcher (do not archive)" chat. The one exception: a robot chat puts itself away at the end of its own run (section G step 10).
- Add permissions to `.claude/settings.json`. Only the owner adds permissions. Change other settings in it only when the owner asks in chat.
- Merge app code before the owner signs off on `docs/PRD.md`.

### G. Robot runs (chats that start by themselves)
**Setup:** one scheduled task named "Robot" wakes one small, permanent chat called "Robot launcher (do not archive)" every hour, at about half past. That's the heartbeat. The launcher has the project attached, so `CLAUDE.md` (with the owner's approval for its job) is loaded, but it never works on the project. It starts a fresh robot chat with `create_session` (project attached, Sonnet, Auto mode, titled "Robot run"). Robot chats also start the next run themselves when they finish, by firing "Robot": the chain. Everything runs in the cloud; the owner's PC can be off.

**Why a launcher (found in T13, 2026-10-31):** a scheduled task made with `create_trigger` can't attach the project or the chat tools to the chats it starts, so a chat started that way was empty and could do nothing. A chat started with `create_session` gets the project, the GitHub tools and the chat tools (tested). So the schedule wakes the launcher, and the launcher starts the real robot chat. Robot runs don't start each other directly with `create_session`: chats have a family-tree limit of 8 levels (`lineage.limit` in `get_session`), so a long chain would break. With the launcher, every robot run is one level below it.

**Why the launcher has the project attached (found in T44, 2026-11-01):** in Auto mode, Claude's safety check always judges `create_session`, `fire_trigger` and `archive_session` itself. The permission lines in `.claude/settings.json` don't count for these three: each call's record (`list_events`, `tool_result_meta[].permission_decision.reason_type`) says `"classifier"`, never `"rule"`, even with the project attached. Auto mode's own allow list (`autoMode.allow`) can't be set from project files. What the safety check does read is `CLAUDE.md`. So the owner typed a standing approval in chat, recorded word for word in `CLAUDE.md` ("The robot: what the owner approved"), and the launcher has the project attached so its safety check reads it on every call. The first launcher had no project; it was refused at 04:21 and 07:18 UTC on 2026-11-01 ("Interfere With Workloads"), and the robot stood still. The approval makes a refusal much less likely, not impossible. If one happens, the chat says so in one line, and the next hourly heartbeat tries again. Never retry a refusal or look for another way around it. Only the owner can add to or change that approval, in their own words in chat.

**Effort (measured 2026-10-31):** a chat started with `create_session` runs at the effort that `modelSettings` in `.claude/settings.json` gives its model. Haiku Low and Sonnet Medium were measured (the `CLAUDE_EFFORT` setting inside the chat); Opus High is expected but not measured. No tool changes the effort of a running chat, and `create_session` has no effort setting. The owner's app picker only sets the effort of chats the owner starts (those can be Max). So the robot changes effort only by choosing a different model, and it moves up a size when a try fails (step 5).

**If the robot is down, what starts it again:**
- **Usage limit used up.** Chats the owner starts in the app carried on after the reset (seen in T24). A chat started with `create_session` did not (seen in T13). So a robot chat that hits the limit just stops. The heartbeat wakes the launcher every hour, and the first one after the reset starts a new run, so the most the robot waits after a reset is about an hour. A pull request left `[in progress]` by a chat that died on the limit counts as 🟡 right away (section A2), so that run finishes the unfinished work.
- **A robot chat that stopped with an error.** Same: 🟡 right away.
- **A robot chat waiting for an approval.** This can't fix itself: only the owner can click Approve. The next robot run sends the owner a push naming the action (section A2). The lasting fix is to set that tool to Allowed (`docs/permission-lines.md`).
- **The safety check refused a start.** The launcher's last line names the step and the refusal, and `get_session` on the launcher shows it in `post_turn_summary`. A robot run whose `fire_trigger` was refused says so in its push. Nothing to do: the next hourly heartbeat tries again. If it happens at most heartbeats, tell a chat the owner is in: the approval in `CLAUDE.md` may need clearer wording, which only the owner can give.
- **The launcher refuses to start runs** (for example, it took quick firings for a loop): tell it the firings are expected and to follow its steps, with `send_message` to the launcher or by typing in the launcher chat. Its runaway guard allows up to 6 runs an hour.
- **The launcher or the "Robot" alarm is missing or off.** `Robot status` shows it (a FAILED last run), and the owner's commands in this section put it right.

**Every robot run, in this order:**
1. **Quick checks, before reading anything big:**
   - `list_triggers`: if the one named exactly "Robot" is off, stop with "The robot is paused." (Ignore the old paused one.)
   - `get_session` with no ID: if `rate_limit_info.isUsingOverage` is true, stop with "Your plan's limit is used up. I'll try again after it resets." Never work on paid usage.
   - **A warning is not a stop.** If `rate_limit_info.status` is `allowed_warning` (the limit is nearly used up), carry on exactly as normal: same model, same tasks. No "small chores only" runs. The owner chose this on 2026-11-03 (T50): work until the limit is really used up. Only `isUsingOverage` stops a run.
   - `list_pull_requests`: if another chat is busy (🔴, section A2; our own pull requests only), stop with "Another chat is working."
2. **Start-up check:** sections A1 and A2 as usual.
3. **Pick one job**, in this order:
   - 🟡 unfinished work: take it over (section A2).
   - Otherwise the first task in `TASKS.md`, top to bottom ("Now" table first), that:
     - has "Who" = "Claude", or "Claude + you" (do only Claude's part);
     - isn't app code, unless `docs/PRD.md` has a line `Signed off by owner: YYYY-MM-DD`;
     - hasn't failed twice (two handoff notes for it say BLOCKED);
     - doesn't need the owner to be there.
   - **T59, the redesign** (owner's choice in T58, 2026-11-04: the robot runs it nonstop, doesn't wait for the owner, and makes the design decisions itself): it also needs the line `Signed off by owner:` in `docs/redesign/PLAN.md` and `**Redesign switch:** ON` there. The job is the first session in PLAN.md that isn't ✅ or ⛔ (R01 to R04 strictly in order); after R24, the top unticked idea in `docs/redesign/IDEAS.md`, with every 8th of those chats a design review. Follow PLAN.md's checklist. "Failed twice" counts per session (R05, R06...), not for T59 as a whole. Name the chat `Robot: Redesign, <session name>`, and in step 5's prompt write "do task T59, session R__".
   - Nothing fits: claim nothing, do the tidy step (A4), and stop with "Nothing for me to do."
4. **Claim it** (section A3). Then **name yourself**, so the owner can tell robot chats apart: `set_session_title` on your own session ID with `Robot: <the task in a few plain words>`, for example "Robot: Photo sources list". No task numbers.
5. **Right brain:** read the task's size in `TASKS.md`.
   - Medium: do it yourself.
   - Small or Large: start a new chat with `create_session`. Use model `claude-haiku-5-5` for Small or `claude-opus-5-5` for Large, `source_url` `https://github.com/Lukasmajukas/cellular-learning-app`, `permission_mode` `auto` if allowed, and the title `Robot (Haiku): <same plain name>` or `Robot (Opus): <same plain name>`. Prompt: "You are a robot worker for the cellular-learning-app project. The owner is away. Take over pull request #<your claim> and do task T__. Follow CLAUDE.md and docs/WORKFLOW.md, sections A to C and G steps 6 to 10. Never wait for an answer." Then point your pull request at the new chat: in its description, swap your session link for the new chat's link (`update_pull_request`), so the busy check looks at the chat that is really working. Then put yourself away (step 10). The new chat takes over your claim (🟡 rules).
   - **Move up one size after a failed try.** A try failed if the task's last handoff note says BLOCKED because the work wasn't good enough or a check failed (not because of missing access or an answer only the owner has), or if a review turned it down. Retry one size up: Small → Medium → Large (Haiku → Sonnet → Opus), which also raises the effort (Low → Medium → High). Never go down a size. A Large task is retried once at Large. After two failed tries step 3 leaves it for the owner (a "You" row), and only the owner may choose Fable (Extra large).
6. **Do the job and finish** the normal way (section C), including the merge. For a "Claude + you" task, merge Claude's part as a draft, then change the row's "Who" to "You" and say what the owner needs to do, for example: "Read `docs/PRD.md`, then type `I sign off the plan` in any chat." In your handoff note, also write whether anything asked for approval or was blocked, and name the action.
7. **If the job is blocked** (missing access, or an answer only the owner has): write it in the handoff note with the word BLOCKED, add a "You" row, merge that, then go to step 9.
8. **Tidy** (A4), with one change: a finished robot chat goes right away, but any other chat only after 2+ quiet hours, so a chat the owner is in the middle of is never touched. A finished robot chat is one that another chat started (`origin` is `claude_code_mcp_seed` in `list_sessions`), that isn't working, and that isn't waiting for an approval (`session_status` REQUIRES_ACTION: leave those for the owner).
9. **Chain:** if "Robot" is still on, you're not on paid usage, and another task could fit step 3, start the next run now with `fire_trigger` on "Robot" (that wakes the launcher). If the safety check refuses it, don't retry: write "the next run starts at the hourly heartbeat" in your summary. End with a two-line summary and send it with `PushNotification` (status `proactive`): that is the owner's phone notification. Send it only when you did a job or got stuck, not for "Another chat is working", "Nothing for me to do" or "The robot is paused".
10. **Put yourself away, last.** After everything else, run `archive_session` on your own session ID (`get_session` with no ID). Do this however the run ends: a job done, blocked, handed to a new chat in step 5, or an early stop in steps 1 to 3 ("The robot is paused", "Another chat is working", "Nothing for me to do", limit used up). An archived chat isn't deleted: the owner can still open it. If the archive is refused, leave it; the next run's tidy step puts it away. A run stuck waiting for an approval can't do this, so it stays in the owner's list where they can find it.
11. **Never:** start helper agents, change the schedule (except for the owner's commands below), touch `.claude/settings.json`, rename or archive the Robot launcher, start a second job in the same run, or use paid usage.

**The owner's commands** (any chat, any device; they skip the traffic light because they don't change project files):
- `Stop the robot`: `update_trigger` with `enabled: false` on the trigger named exactly "Robot" (ignore "Robot (old, off: launcher had no project)"). Say: "The robot is stopped. The task it's on will finish, then nothing new starts."
- `Start the robot`: `update_trigger` with `enabled: true` on "Robot", then `fire_trigger` once.
- `Robot status`: whether "Robot" is on, the next heartbeat and how the last one went (`list_triggers`: `next_run_at` and `last_run`; a FAILED last run means the launcher is missing or the limit was used up); whether the launcher's last start went through (`get_session` on the launcher chat: a refusal shows in `post_turn_summary`; a SUCCEEDED `last_run` only means the message arrived); what's being worked on (open `[in progress]` pull requests); and the top 3 diary lines.
- `I sign off the plan`: add `Signed off by owner: YYYY-MM-DD` to `docs/PRD.md` and merge it. That unlocks app building for the robot.
- `Pause the redesign` / `Resume the redesign`: set the `**Redesign switch:**` line in `docs/redesign/PLAN.md` to PAUSED / ON. This one does change a file, so claim it as a tiny task ("Pause the redesign"), even while a redesign chat is busy (like `Do task T__ at the same time`), and merge at once. Say: "The redesign is paused. A session that's already running finishes; no new one starts. The robot's other tasks carry on." (or "The redesign is back on; the robot picks it up at its next run.").

**How the robot is built** (set up in T13 on 2026-10-31, rebuilt in T44 on 2026-11-01; use this to rebuild it):
1. **The launcher chat:** `create_session` with title "Robot launcher (do not archive)", model `claude-sonnet-5-5`, `permission_mode: auto`, and `source_url` `https://github.com/Lukasmajukas/cellular-learning-app` (so `CLAUDE.md` loads, with the owner's approval). Its first message is the launcher prompt below. It does a self-check and waits.
2. **The heartbeat:** `create_trigger` with name "Robot", `persistent_session_id` set to the launcher's session ID, `initiation: human_request`, cron `0 * * * *` (hourly; the server moves the minute to the minute it was made), and the heartbeat prompt below (it carries the launcher's full steps, so the launcher's memory can be wiped; until T51 is done the live schedule still has the old one-line prompt "Heartbeat: start one robot run now. Follow your launcher steps 1 to 4 exactly.") A schedule that wakes an existing chat can't send phone notifications, so robot chats send their own (step 9). A schedule can't be pointed at a different chat later (`update_trigger` has no setting for it), so a new launcher needs a new "Robot". Rename the old one and switch it off first, so only one is called exactly "Robot". Don't delete it: deleting a schedule also deletes the chats it started.
3. **Test:** while a pull request is `[in progress]`, `fire_trigger` twice, about 3 minutes apart (the pattern the safety check once refused). Each time the launcher should start a chat titled "Robot run" that stops at 🔴 and puts itself away. Check with `get_session` and `list_events`: the launcher's `create_session` result must be accepted.
4. **If the launcher is ever archived or deleted:** bring it back (section E). If it's gone for good, pause "Robot", then redo steps 1 and 2.
5. **Current IDs** (2026-11-01): launcher `session_0192jN2QFiYs4DpvL6W6MomZ`, "Robot" `trig_01RH9EsLZizd6JyPGw7NVSEc`. Retired: the first launcher `session_0192jN2Svs467DTtiNZHcC6A` (renamed "Robot launcher (old, retired 2026-11-01: no project)"; Claude's `archive_session` on it was refused by the safety check, so it stays in the owner's chat list until the owner archives it; it's harmless: its schedule is off and robot tidy-ups skip it because it has no project) and its schedule `trig_01YQJDB7a11iEV9mrxCTXhsr` (renamed "Robot (old, off: launcher had no project)" and switched off).
6. **The schedule's message can be changed only from inside the launcher chat** (found 2026-11-03, T52): `update_trigger` with a new `prompt` from any other chat is refused ("can be changed only from the conversation or thread the routine posts into"). Pausing and restarting still work from anywhere. To change the message, the owner pastes the request into the launcher chat.

**Launcher prompt** (the launcher's first message):
```
You are the "Robot launcher" for the cellular-learning-app project (owner: Lukas). You are a tiny relay. This chat has the project attached only so that CLAUDE.md is loaded: the owner's approval for your job is written there word for word (section "The robot: what the owner approved"). You don't work on the project: skip CLAUDE.md's "Every session" steps and docs/WORKFLOW.md sections A to C. Never edit, commit or push files, never run shell commands, never open pull requests, and never do anything that is not listed below.

RIGHT NOW (this first message only): reply with ONE line saying whether these chat tools are available, by name: create_session, list_triggers, get_session. Do NOT start any robot run now. Then stop and wait.

AFTER THAT, every message you receive means "start one robot run". Messages can come close together: the hourly "Robot" schedule sends one, each robot run sends one when it finishes its job (the chain), and the owner or Claude may send one by hand. That is expected, and it is what the owner approved. A new run doesn't disturb the one before it: every robot run first checks whether another chat is busy and stops if so, so don't try to judge that yourself. Do exactly these steps, in order:
1. Call list_triggers. Find the scheduled task named exactly "Robot". If it is missing or not enabled, reply "The robot is paused." and stop.
2. Call get_session with no session ID. If rate_limit_info.isUsingOverage is true, reply "Your plan's limit is used up. Not starting." and stop. Never use paid extra usage. A status of "allowed_warning" is NOT a reason to stop or to change anything: start the normal run in step 3 (Sonnet, the prompt below, word for word). Never switch to Haiku or "small chore" runs.
2b. Runaway guard: call list_sessions (mine: true). If 6 or more chats whose titles start with "Robot" (not counting you) were created in the last 60 minutes, reply "Runaway guard: not starting" and stop. The next heartbeat tries again.
3. Call create_session with exactly these settings:
   - source_url: https://github.com/Lukasmajukas/cellular-learning-app
   - model: claude-sonnet-5-5
   - permission_mode: auto
   - title: Robot run
   - prompt: You are a robot run for the cellular-learning-app project, started by the owner's "Robot" schedule. Follow CLAUDE.md and docs/WORKFLOW.md section G exactly, starting with the quick checks. If something needs the owner, add a 'You' row to TASKS.md instead of waiting for an answer.
4. Reply with one line: "Started robot run <new session id>." Then stop.

If a step fails, including a refusal by the safety check, reply with one line naming the step and the error, then stop. Never retry, never look for another way to start a run, and never start more than one robot run per message. The next message tries again.
```

**Heartbeat prompt** (the "Robot" schedule's message; set in T51 by the owner pasting it into the launcher chat, because only that chat can change it). It carries every step, so the launcher needs nothing from its own memory:
```
Heartbeat for the "Robot launcher (do not archive)" chat. These steps are complete on their own: you don't need anything from earlier in this chat. Your approval is in CLAUDE.md ("The robot: what the owner approved"). Skip CLAUDE.md's "Every session" steps. Never edit files, run shell commands or open pull requests.
1. list_triggers: if the scheduled task named exactly "Robot" is missing or off, reply "The robot is paused." and stop.
2. get_session (no ID): if rate_limit_info.isUsingOverage is true, reply "Your plan's limit is used up. Not starting." and stop. A status of "allowed_warning" changes nothing.
3. Runaway guard: list_sessions (mine: true). If 6 or more chats whose titles start with "Robot" (not counting this launcher) were created in the last 60 minutes, reply "Runaway guard: not starting." and stop.
4. create_session with exactly: source_url https://github.com/Lukasmajukas/cellular-learning-app, model claude-sonnet-5-5, permission_mode auto, title "Robot run", prompt: "You are a robot run for the cellular-learning-app project, started by the owner's "Robot" schedule. Follow CLAUDE.md and docs/WORKFLOW.md section G exactly, starting with the quick checks. If something needs the owner, add a 'You' row to TASKS.md instead of waiting for an answer."
5. Reply in one line: "Started robot run <id>." If a step fails or is refused, reply in one line naming the step and the error. Never retry, and never start more than one run per message.
```

**Keeping the launcher small** (T52, 2026-11-03). The launcher's chat grows about 10,000 tokens a run and re-reads all of it every hour; by 2026-11-03 it held about 720,000. Once the heartbeat prompt above is live, its memory is safe to wipe. Only the owner can type these commands, in the "Robot launcher (do not archive)" chat (a message from another chat arrives as plain text, not a command):
- `/clear`: wipes its memory to empty. Same chat, so the "Robot" schedule keeps working. Do it whenever `/context` shows it big.
- `/autocompact 100k`: it then shrinks its memory into a summary at about 100,000 tokens (the smallest allowed). Saved on the chat's cloud computer, so it may be lost when that computer is recycled; check with `/context`.
- `/effort low`: the launcher's job is copy-paste; low effort costs less every hour.
- Not done: a project-wide size limit in `.claude/settings.json`. It would also shrink robot runs and the owner's chats, which already reach about 90,000 tokens just reading the project files.
