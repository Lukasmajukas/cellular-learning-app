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
When a new chat starts a task, it archives this project's older chats, so your list stays short. Archiving is like putting a finished worksheet in a drawer: it's out of the way, but not thrown out. A chat that is still working is never put away.

### 6. A robot keeps going while you're away
Twice a day, at about 2 AM and 2 PM (US Eastern), a robot chat starts by itself. It finishes anything a chat left half-done, for example when your usage limit ran out. It may also do Claude-only tasks that don't need you and aren't app code. It never writes the app plan or app code. You get a phone notification when it's done. To pause it, type `Pause the robot` in any chat. (Being switched on in task T13.)

Also, if a chat hits your usage limit, it now waits for the limit to reset and carries on by itself.

## What if...?
| What happened | What to do |
|---|---|
| I opened two chats by accident | Nothing. The second one shows 🔴 and tells you to use the first. Close the second. |
| I picked the wrong branch when I started a chat | Nothing. Claude starts from the newest copy by itself. |
| I closed a chat in the middle of a task | Start a new chat and type `Go`. If it shows 🔴, type `Take over`. |
| I want two different tasks done at the same time | In the second chat, type `Do task T__ at the same time`. It only works for a different task. |
| I don't like what Claude did | Tell Claude what to change, or type `Undo the last change`. |
| I want an archived chat back | Type `Bring back the chat called ___` in any chat. Archived chats aren't deleted. |
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
   Tell the owner in one line: "You started from an old branch. I switched to the newest copy, and nothing was lost." If your first push is refused, use `git push --force-with-lease -u origin <branch>`. Only ever do that to this chat's own new branch. If it says "stale info", GitHub already deleted the old copy of the branch: run `git fetch --prune origin`, then push normally.
2. **Read the traffic light.** List open pull requests (`list_pull_requests`, state `open`). Look only at ones from `claude/` branches.
   - A pull request with `[in progress]` in its title is **busy** if it was updated in the last 2 hours, or if its chat is running right now. The session link at the end of its description names the chat, and `get_session` shows whether that chat is working.
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
   - Archive a chat with `archive_session` only if all of these are true: it isn't you; it isn't archived already; it isn't working right now; `get_session` shows `Lukasmajukas/cellular-learning-app` in its sources; and its session link isn't in any open `[in progress]` pull request.
   - If an archive is refused, skip that chat. Tell the owner once: "The safety check stopped me putting away some old chats." Never retry or work around a refusal.
   - Tell the owner in one line how many old chats you put away.

### B. While working
- One task per chat.
- Push at least once an hour, so your sign stays fresh.
- Before each push, check that your pull request is still open. If another chat closed it ("Continued in #__"), stop and tell the owner: "This work moved to a newer chat. Please use that one."
- Push before you stop to wait for an answer.
- **Never leave a pull request open waiting for the owner.** Merge drafts as drafts, with `Status: DRAFT` written inside the file. Ask questions in the chat, and add them to `TASKS.md` as rows where "Who" is "You".
- If the owner asks for more after your pull request was merged, start from a fresh copy (`git fetch origin main && git checkout -B <branch> origin/main`, then `git push --force-with-lease`) and claim again (step A3).

### C. Finishing: after the end-of-session steps in `CLAUDE.md`
1. Bring in the newest main: `git fetch origin main && git merge origin/main`. Fix any conflicts. In logs and lists, keep the lines from both sides.
2. Push. Update the pull request description using the template, and set its Status line to done.
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
- Force-push anything except this chat's own branch (steps A1 and B only).
- Delete branches.
- Merge a pull request that another chat is busy with (🔴).
- Archive a chat that is working, a chat from another project, or a chat named in an open `[in progress]` pull request.
- Add permissions to `.claude/settings.json`. Only the owner adds permissions. Change other settings in it only when the owner asks in chat.
- Merge app code before the owner signs off on `docs/PRD.md`.

### G. Robot runs (a chat that starts by itself)
A scheduled task starts a fresh chat twice a day, at about 2 AM and 2 PM US Eastern. The owner is away, so the robot never waits for answers.
1. Run the start-up check (section A) like any chat. On 🔴, stop.
2. Pick one job, in this order:
   - 🟡 unfinished work: take it over and finish it (section A2).
   - Otherwise, the first task in the "Now" table of `TASKS.md` where "Who" is exactly "Claude", the size is Small or Medium, and it isn't app code. Never the app plan (T04). Never anything that needs the owner.
   - Nothing fits: claim nothing. Do the tidy step (A4) anyway, then stop with "Nothing for me to do."
   - In a robot run, the tidy step only puts away chats that have been quiet for at least 2 hours, so a chat the owner is in the middle of is never touched.
3. Do that one job, then finish the normal way (section C), including the merge.
4. If the job needs something missing (a blocked website, an answer only the owner has), write it in the handoff note and as a "You" row in `TASKS.md`, merge that, and stop.
5. Never: start helper agents, change the schedule, touch `.claude/settings.json`, or start a second job in the same run.
6. End with a two-line summary. It becomes the owner's phone notification.

**The owner's commands** (any chat): `Pause the robot` turns the scheduled task off (`update_trigger`, `enabled: false`). `Turn the robot back on` turns it on. `Run the robot now` fires it once (`fire_trigger`). `What did the robot do?` reads the latest diary lines.

**Prompt for the scheduled task** (task T13 copies this): "You are the robot run for the cellular-learning-app project. The owner is away. Follow CLAUDE.md and docs/WORKFLOW.md section G exactly. Never wait for an answer: put questions in TASKS.md as 'You' rows."
