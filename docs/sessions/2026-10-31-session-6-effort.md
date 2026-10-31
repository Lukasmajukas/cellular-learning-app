# Handoff note: 2026-10-31, T17 say the effort level with the model

**Status:** DONE
**Model used:** Large, Max effort · **Branch / pull request:** `claude/dreamy-bohr-8ovj16`, #9 (merged by Claude)

## In simple words (for the owner)
Claude now tells you the effort along with the model, like "Opus, High effort". Chats now carry on by themselves when a usage limit resets. You chose a robot that runs twice a day, and the panel being built now. The next chat switches the robot on.

## What was done
- Added effort everywhere a model is named: `CLAUDE.md` (table and rule), `README.md` (table, plus what effort means), `TASKS.md` (a "Model + effort" column), `CHEATSHEET.md`, `docs/WORKFLOW.md`, the handoff template and `GLOSSARY.md`.
- The owner added `.claude/settings.json` from the link (commit `09fb5df`). Checked it: valid, with the 5 permissions. T16 is done.
- At the owner's request, added `"autoContinueAtUsageLimit": true` to `.claude/settings.json`. The safety check allowed it. It's not tested yet: a chat has to hit the limit first.
- Asked the owner about automation. Answers: twice a day; restart unfinished work plus safe tasks; build the panel now. Recorded in `docs/DECISIONS.md`, at the top of `docs/panel-plan.md`, in `TASKS.md` (new T13 robot ⭐, new T18 panel, T08 and T09 moved up), and in `docs/WORKFLOW.md` (rule 6 and section G).
- Answered the owner's question: no new repository for the panel. It lives in a `panel/` folder in this project.
- `docs/WORKFLOW.md` A1: a push refused with "stale info" means GitHub already deleted the old copy of the branch. Run `git fetch --prune origin`, then push normally.

## What's next
- Next task: **T13** (switch on the robot), model: **Medium (Sonnet)**, effort: **Medium**, type: `Go`
- After that: **T04** (the app plan) in a chat with the owner, model: **Large (Opus)**, effort: **High**.

## Decisions made (also added to docs/DECISIONS.md)
- Effort is always named with the model.
- Auto-continue after usage limits is on.
- Robot: twice a day, about 2 AM and 2 PM US Eastern; restart unfinished work plus safe tasks; phone notification; `Pause the robot` to pause; no practice week.
- Panel: built now, in this project; no new repository.
- T08 and T09 moved before the plan sign-off, so the robot may do them.

## Questions for the owner
- None. If your time zone isn't US Eastern, say so.

## New words (also added to GLOSSARY.md)
- effort, robot run, auto-continue

## Notes for the next Claude
- I didn't create the scheduled task here on purpose. This chat ran on the Large size at Max effort, and the robot would probably copy that. Do T13 from a Medium (Sonnet) chat at Medium effort. If the test run's `configured_model` still isn't Sonnet, ask the owner to say "use Sonnet for the robot", then use `update_trigger` with `model`.
- `create_trigger` settings: `create_new_session_on_fire: true`, `notifications: {push: true}`, cron with `CRON_TZ=America/New_York` at about 2 AM and 2 PM, with the minute moved off the hour as the tool's guidance says. Prompt: copy it from `docs/WORKFLOW.md` section G.
- I skipped this chat's tidy step (A4): it archived what it could earlier, and the next chat has the permission file.
- The branch `claude/dreamy-bohr-8ovj16` was deleted on GitHub after #8 merged. A push with `--force-with-lease` then failed with "stale info"; `git fetch --prune origin` and a plain push fixed it.
