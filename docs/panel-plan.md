# 🛰️ Progress panel + automation: the plan (T11)

**Status:** DRAFT. Waiting for the owner's sign-off. Nothing here gets built until you say "proceed".
**Written:** 2026-10-31 · **Task:** T11 · **Separate from:** the learning app and its plan (`docs/PRD.md`)

---

## 1. The short version (for the owner)
You want three things:
1. **A dashboard** on your phone and PC that shows where the project is.
2. **Claude doing tasks by itself** on a schedule, without making a mess.
3. **A fact check every 3 months**, to catch carrier changes.

**My recommendation:**
- **The panel:** a private page on claude.ai that reads this repo through your GitHub connection. Only you can open it, there's no password hidden inside it, and looking at it costs no Claude usage.
- **The robot runs:** a Claude scheduled task that runs at most **2 times a week**. Before it starts, it does a checklist. If anything is wrong, it stops and tells you why.
- **The fact check:** a second scheduled task, 4 times a year. It only switches on after the bands data file exists (task T06).

**Something to fix first:** right now **4 pull requests are open**, and 3 of them are copies of the same task (T03). With the rules below, the robot would never run until those are cleared. See §8.

---

## 2. The problem
- **Checking progress is clumsy.** To see where things stand, you open GitHub and read 3–4 files. Or you ask Claude "where are we?", which uses up your limit.
- **Work only happens when you start a chat.** Small, safe tasks wait until you remember to start one.
- **Facts go stale.** Carriers change bands. `CLAUDE.md` says to re-check every 3 months, but nothing reminds anyone.
- **It already went wrong once.** Several chats were given "do the next task" around the same time. They all did T03, so now there are 3 duplicate pull requests. Any automation must make that impossible, not more likely.

## 3. How we'll know it worked (success criteria)
| # | The panel or robot must… | How we test it |
|---|---|---|
| S1 | Open on your phone and your PC | You open it on both |
| S2 | Show: the current level, the next task, what's waiting for you, and the last 3 diary lines | Compare it with the files on GitHub |
| S3 | Cost **zero** Claude usage to look at | The page never uses the "ask Claude" feature, and your usage doesn't move after 10 refreshes |
| S4 | Never contain a GitHub password or key | Read the page's code: there's no key in it. A shared copy shows nothing to anyone else. |
| S5 | Always say when it's fetching, when it last updated, and if it's showing an old copy | Turn on airplane mode: the page should say "offline, showing the copy from 10:42" |
| S6 | Refresh by itself while it's open | Merge a pull request, wait at most 5 minutes, and see the change |
| S7 | The robot runs at most 2 times a week | The schedule settings show it |
| S8 | The robot never starts while a Claude pull request is waiting for you | Leave one open: the next run stops and tells you why |
| S9 | The robot never writes app code before the PRD is signed off | The checklist (§6) blocks it. We test this in the practice week. |
| S10 | You can pause everything with one switch | Flip it and the next run does nothing |

## 4. What's in and what's out (scope)
**In:**
- A read-only panel (it shows things; it doesn't change anything).
- One scheduled task for normal task runs.
- One scheduled task for the 3-month fact check.
- The checklist rules in §6.

**Out (for now):**
- Buttons on the panel that make Claude do things. Pressing a button could quietly use your limit, so the panel only looks.
- Showing the robot's run history. The panel can't see Claude's scheduled-task list. It shows what the **next** run would do (§5).
- Phone alerts from the panel. Claude's scheduled tasks can already push a phone notification when a run ends, so we use that.
- Anything inside the learning app.

## 5. The panel

### What it shows (top to bottom)
1. **Freshness bar:** "🔄 Fetching…", or "✅ Updated 2 min ago (GitHub: last change 1:14 PM)", or "⚠️ Can't reach GitHub. Showing the saved copy from 10:42."
2. **You are here:** the current level from `ROADMAP.md`.
3. **Waiting for you:** open pull requests (with links) and tasks where "Who" is "You".
4. **Next task ⭐:** its number, name, model size, and what to type.
5. **What the robot will do next:** the panel runs the same checklist as the robot (§6) on the same files. Example: "Next run: Tuesday 7:41 PM. It will **skip**, because 4 pull requests are waiting." You see the answer before the run happens.
6. **Recent diary:** the top 3 lines of `docs/PROGRESS-LOG.md`.

### Where the information comes from
- The panel reads `TASKS.md`, `ROADMAP.md` and `docs/PROGRESS-LOG.md` from **main**, the real binder.
- It also reads the list of **open pull requests**. Work in a pull request isn't in main until you merge it, so without that list the panel would look out of date.

### How it refreshes
- Every **5 minutes** while it's open.
- Again whenever you switch back to its tab.
- Whenever you tap a **Refresh** button.
- Each refresh makes about 5 small requests to GitHub. That's about 60 an hour, far below GitHub's limits (normally thousands an hour).

### How the page reads a private repo safely: options compared
| Option | How it works | Safe? | Costs | Effort for you | Verdict |
|---|---|---|---|---|---|
| **A. Private claude.ai page + your GitHub connector** | The page asks claude.ai to fetch the files using **your** GitHub connection. The page never sees a key. | ✅ No key exists in the page. If someone else opened a copy, they'd see nothing. | Free. Viewing doesn't use Claude. | Click "Allow" once | ⭐ **Recommended** |
| B. GitHub Pages (a free website from GitHub) | A GitHub Action (a little robot on GitHub) writes a status page | ❌ For a private repo you'd need a paid plan, and even then the page is public on the internet | $4/month (paid GitHub plan) | Low | No: your task list would be public |
| C. A plain web page + a key you paste in | You make a read-only GitHub key and paste it into the page on each device | ⚠️ Fine if done carefully, but the key lives in each browser and expires | Free | Medium: you make a key, then paste it again when it expires | Backup if A fails |
| D. The GitHub phone app | Open `TASKS.md` in the app you already have | ✅ | Free | None | **Use it today.** No summary, though, and it doesn't show what the robot will do |

**Why A:**
- The claude.ai page system has a feature for this ("connectors"). The page calls your connector, and the call uses your login without showing the key to the page.
- It also saves the last answer, with a timestamp, so the page can say how old its data is (S5).
- Pages start out **private to you**.

**Things I could not check from here.** We test these first, in build step 1. If any fails, we switch to option C:
1. That the page can use your GitHub connector, and that the connector can see this private repo.
2. That the page works in the Claude app on your phone, not just on a PC.
3. That viewing really costs zero usage. The page won't use the "ask Claude" feature, so it shouldn't cost anything, but we'll watch your usage to be sure.

## 6. The robot runs (scheduled Claude tasks)

### How it works
- A Claude **scheduled task** starts a fresh chat at set times, like an alarm clock that starts a chat for you.
- Each run follows `CLAUDE.md` exactly, the same way a chat you start does:
  - one task;
  - a branch and a draft pull request;
  - a handoff note;
  - the end-of-session steps.
- When the run ends, you get a **phone notification** saying what happened.

### The checklist (every run, in this order; any "no" means stop)
The run checks these **before** doing any real work, so a run that stops early costs only a tiny bit of your limit.

| # | Check | If it fails |
|---|---|---|
| 1 | **Switch is ON:** `docs/automation.md` says `Robot runs: ON` | Stop. "Paused." |
| 2 | **Nothing waiting:** no open pull request from a Claude branch (names starting with `claude/`) | Stop. "2 pull requests are waiting for you: #4, #5." |
| 3 | **Weekly cap:** fewer than 2 Claude pull requests opened in the last 7 days. This is a second safety net on top of the schedule. | Stop. "Weekly cap reached." |
| 4 | **Pick a task:** the first task in `TASKS.md` that is not done, where "Who" is exactly **Claude** (not "Claude + you") and that you have marked **🤖** (OK for the robot) | Stop. "No robot-OK task." |
| 5 | **Right size:** the task's model size is Small or Medium. Large tasks are planning and design work, and need you there. | Stop. "T__ needs a Large model; do it in a chat." |
| 6 | **Plan signed off:** if the task is under "After you sign off on the plan", `docs/PRD.md` must contain a line `Signed off by owner: YYYY-MM-DD` | Stop. "The PRD isn't signed off yet." |
| 7 | **Can actually do it:** nothing it needs is missing. For example, T07 needs etsi.org allowed in the network settings. | Open a pull request with only a handoff note explaining what's missing. Rule 2 then pauses the robot until you've read it. |

Then it does the task and opens a draft pull request.
- It never merges or pushes to main.
- It never starts helper agents. `CLAUDE.md` says no multi-agent work without your OK.

### Why each rule exists
- **Rule 2** stops pull requests piling up, so you never come back to 10 of them. It's also what prevents the T03 duplicates from happening again.
- **Rule 4's 🤖 mark** means the robot only does tasks you've picked for it.
- **Rule 6** keeps the project's main rule: no app work before the plan is signed off.

### Schedule (proposed)
- **2 runs a week:** Tuesday and Friday at 7:41 PM. That's not on the hour, because runs at :00 can be delayed.
- I need your **time zone** for this; see the questions in §10.
- **Cost:** a run that does a task uses about as much as one normal chat of that size. A run that stops at the checklist uses very little. I can't give an exact number before the practice week.

### Practice week first
For the first week, the robot runs the checklist, sends a phone notification saying "I would have done T__", and stops. It makes no pull requests. If those messages look right, we switch it on for real.

## 7. The 3-month fact check
- **When:** on the 1st of January, April, July and October. It turns on only after the bands data file exists (task T06).
- **What it does:**
  - checks every carrier and band fact for its status, as-of date and source;
  - opens a pull request with a report: what's unchanged, what changed (with a new source), and what it couldn't confirm.
- **What it never does:** change a fact without a source, or mark a fact CURRENT just because it couldn't find anything newer.
- **Model:** Medium for the check. If anything changed, it adds a task to `TASKS.md` for a Large review.
- **Rules from §6 that still apply:** the switch (1) and nothing waiting (2). The weekly cap doesn't count it.
- **Might need:** network access to FCC and carrier websites. We check that the first time it runs. If something is blocked, rule 7 applies.

## 8. Fix this first (before anything is built)
- **4 open pull requests:**
  - #5 (`claude/peaceful-davinci-i5w6zd`) is the only one with your T02 answers and task T11. It looks like the one to keep.
  - #2, #3 and #4 are earlier copies of T03.
- **My suggestion:**
  - Skim #5 and merge it, then close #2, #3 and #4.
  - Closing a pull request can be undone: there's a "Reopen" button.
  - I haven't closed anything. That's your call.
- **This pull request builds on #5.** Merge #5 first; then this one shows only the T11 changes.

## 9. Build steps (after you sign off)
| Step | What | Model size | Done when |
|---|---|---|---|
| 1 | Test the 3 unknowns in §5 with a bare-bones page | Medium | We know whether option A works on your phone |
| 2 | Build the panel | Medium | S1–S6 pass |
| 3 | Add `docs/automation.md` (the switch), add the 🤖 column to `TASKS.md`, and set up the robot in practice mode. Check that scheduled runs can see GitHub pull requests; rule 2 needs that. | Medium | You get practice-week messages |
| 4 | Turn the robot on for real | Small | S7–S10 pass |
| 5 | Set up the 3-month fact check (after T06) | Medium | First report pull request |

## 10. Questions for you
1. **Is the panel separate from the "no code before the PRD is signed off" rule?** `CLAUDE.md` says "no app code until the owner signs off on `docs/PRD.md`". The panel isn't part of the app, so I'd treat **this** plan as its own sign-off. Do you agree? If you'd rather wait for the PRD too, the build steps simply wait.
2. **Your time zone?** I guessed US Eastern (your sites are in Massachusetts), but I don't want to assume.
3. **Is 2 runs a week right?** Fewer runs means less of your limit used. More runs means faster progress, but more pull requests to read.
4. **The 🤖 mark:** should you pick robot tasks one by one (my recommendation), or may the robot do any task marked "Claude"?
5. **Pause switch:** a line in a file (the panel can show it, and you can edit it in the GitHub app), or just the on/off toggle in the Claude app? I recommend the file, because the panel can display it.
6. **Should the panel also show tasks from the open pull requests?** For example, "T11 done, waiting for your merge". It's a bit harder, but more accurate.
