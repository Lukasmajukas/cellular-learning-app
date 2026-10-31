# Handoff note: 2026-10-31, T11 plan the progress panel + automation

**Model used:** Large (Opus) · **Branch / pull request:** `claude/great-planck-011r96`. It's stacked on PR #5 (`claude/peaceful-davinci-i5w6zd`), because T11 only exists there.

## In simple words (for the owner)
We wrote a plan for two things:
1. **A scoreboard page** for your phone and PC that shows where the project is.
2. **A robot** that does safe tasks twice a week.

The robot checks a list of rules first, so it can't make a mess. Nothing is built yet. Read `docs/panel-plan.md` and say "proceed" or ask for changes.

## What was done
- Wrote `docs/panel-plan.md`, a mini-PRD: problem, success criteria, scope, the panel, the robot's checklist, the 3-month fact check, build steps and questions.
- Checked what a private claude.ai page can do:
  - it can call the viewer's own connectors with their login, so no key sits in the page;
  - it can cache answers with timestamps;
  - it can refresh on a timer;
  - it doesn't need "ask Claude", so viewing should cost no usage.
  - Three things are still unproven (§5) and get tested first.
- Compared 4 ways to read a private repo (§5 table). Recommended the private claude.ai page plus the GitHub connector. Backup: a page with a pasted read-only key.
- Found 4 open PRs, 3 of them duplicate T03 work (#2, #3, #4; #5 is the newest and most complete). Flagged this for the owner. Closed nothing.
- TASKS: T11 is now the owner's review; added T13 (build it, Medium). Added 10 glossary words.

## What's next
- **Owner:**
  - tidy the PRs (merge #5, close #2–#4);
  - read `docs/panel-plan.md` and answer §10;
  - then merge this PR.
- **Next Claude task:** **T04** (write the PRD), model: **Large (Opus)**. Type: `Do task T04`. If the owner signs off T11 first, T13 can run (Medium).

## Decisions made (also added to docs/DECISIONS.md)
- None. Everything in the plan is a recommendation until the owner signs off.

## Questions for the owner
See `docs/panel-plan.md` §10:
1. Panel exempt from the PRD rule?
2. Time zone?
3. 2 runs a week?
4. 🤖 mark per task?
5. File switch or app toggle?
6. Show tasks from open PRs?

## New words (also added to GLOSSARY.md)
- progress panel, claude.ai page (artifact), connector, scheduled task, guard rails, practice run, GitHub Action, GitHub Pages, access key (token), rate limit

## Notes for the next Claude
- **Artifacts:** `describe_capabilities` (runtime contract 0.2.96):
  - `mcp` capability: declare `{mcp:{servers:[{server, tools}]}}`. `watchTool(..., {refetchInterval})` shows freshness via `cache.storedAt`.
  - Don't declare `sample`; that's what would cost tokens.
  - The connector's display name is probably "github" (tools `get_file_contents`, `list_pull_requests`, `list_commits`). Not verified from an artifact yet.
- **Scheduled tasks:**
  - use `create_trigger` with `create_new_session_on_fire: true`;
  - turn push notifications on;
  - the minimum interval is hourly;
  - pass `CRON_TZ` once the time zone is known;
  - check whether the fired session has GitHub MCP access; it may need the `connectors` field.
- If PR #5 is merged before this one, this branch's diff shrinks to just the T11 files. No rebase needed: it was built on #5's last commit `242cadf`.
- Don't start building panel code until the owner explicitly signs off `docs/panel-plan.md` (and answers §10 question 1).
