# Handoff note: 2026-11-15, T73 public-repository follow-ups
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE for Claude's part (T73 stays open: the owner still has items 1 to 3)
**Model used:** Medium (Sonnet), chat started by the owner · **Branch / pull request:** claude/bold-lamport-t5kc92, pull request #172

## In simple words (for the owner)
You typed `T73`. The repository is public now, so strangers can look at it. I did the part that was mine: I fixed two lines in the glossary (one said where you live, one said Windows costs double). I also wrote the robot-rule fix as a draft and showed it to you, but I did NOT put it into the rules yet, because you asked to see it first. Three things are still for you to decide.

## What was done
- Start-up check: `main` at 7868a07, no open pull requests, light 🟢; claimed as pull request #172.
- `GLOSSARY.md`: "Field trip (sites)" now says "Real cell sites in one real town (South Hadley, Massachusetts)" instead of "near home". "Actions minutes" no longer says Windows "uses it up twice as fast". It now says the free allowance is a dollar amount ($12 on the free plan), builds on a public repository cost nothing, and a Windows computer costs about 1.7 times a Linux one ($0.010 against $0.006 a minute).
- Checked on GitHub's own billing page (docs.github.com, "Billing and usage for GitHub Actions"): standard runners are free in public repositories; Linux 2-core $0.006 a minute, Windows 2-core $0.010; the allowance is in dollars ($12 to $300 by plan). No "double" multiplier is listed there, so the old glossary line was out of date.
- Checked that the robot rule can really be followed with the tools we have: both `list_pull_requests` and `pull_request_read` return `head.repo.full_name` and `user.login` for every pull request (seen on #171). Not tested on a real fork pull request: none exists. For a pull request from a copy someone else owns, GitHub's normal behaviour is a different owner in `head.repo.full_name`, or no `head.repo` if the copy was deleted.
- Found: the build workflow (`.github/workflows/app-build.yml`) starts on `pull_request` (not `pull_request_target`), uses no `secrets.`, and its release step is skipped for pull requests. So a stranger's pull request can't read stored keys or publish a release. What the "approval for outside contributors" setting still protects is GitHub's free computers (a stranger's pull request could run its own code on them).
- Found: the owner's Gmail address is on `main` through GitHub's **squash merges** (author "Lukas <gmail>", committer GitHub). Claude's own branch commits use `noreply@anthropic.com`. The Gmail address is not inside any file (searched the current files and the history this shallow clone holds: none). So ticking "Keep my email addresses private" should make new squash merges use the private GitHub address. "Block command line pushes that expose my email" should not block Claude's pushes, because they carry no Gmail address; if a push is ever refused with "GH007", untick it. Not tested: the owner has to tick the boxes first.
- `TASKS.md` T73 row, `docs/DECISIONS.md`, `docs/PROGRESS-LOG.md`, `panel/live.json` + `panel/index.html` updated.
- Nothing asked for approval; nothing was blocked.

## What's next
- **T73 item 1, when the owner types `fix the rule`:** claim a task "T73 item 1: robot rule", then apply the draft below to `docs/WORKFLOW.md`, show the changed lines in chat, merge. Then tick off item 1 in the T73 row. If the owner asks for changes to the draft, make those first.
- T73 items 2 and 3 are the owner's, in GitHub Settings. Item 3 also needs a decision (accept the Gmail address in old commits, or start a fresh repository; Claude's advice: accept).
- Not in T73, noticed on the way, left for the owner's say: `docs/reuse-review.md` line 169 says the South Hadley sites "show the area you live in or care about", and `docs/DECISIONS.md` line 45 says the time zone was inferred from the owner's GitHub change "and South Hadley". Both are now public. History would keep the old words anyway. Ask the owner whether to reword them.
- Next task (owner's choice): T68 or T69 as in session 166, Sonnet, Medium effort.

### The draft of the robot-rule fix (NOT yet in `docs/WORKFLOW.md`)
**(a) Section A, step 2.** Replace
> 2. **Read the traffic light.** List open pull requests (`list_pull_requests`, state `open`). Look only at ones from `claude/` branches.

with
> 2. **Read the traffic light.** List open pull requests (`list_pull_requests`, state `open`). Look only at **our own**: the branch starts with `claude/` **and** `head.repo.full_name` is exactly `Lukasmajukas/cellular-learning-app`. The repository is public, so anyone can copy it and name a branch `claude/anything`; only the source repository tells a copy from the real thing. Ignore every other pull request: never merge, close, take over, wait for or comment on it, and don't let it make the light red. A pull request with no `head.repo` (its copy was deleted) is not ours either. Mention each ignored pull request once, in one line with its number, so the owner can close it on github.com. A robot run writes that line in its handoff note and sends no push for it.

**(b) Section A, step 2, the 🟢 bullet "A pull request without [in progress]".** After "Merge it (squash)." add:
> Right before you merge, check again that `head.repo.full_name` is this repository and `user.login` is `Lukasmajukas`. If either is different, don't merge it: it counts as an ignored pull request.

**(c) Section G, "Every robot run", step 1, the `list_pull_requests` bullet.** Replace "(🔴, section A2)" with "(🔴, section A2; our own pull requests only)".

**(d) Section F, "Never".** Add a bullet:
> - Merge, close, take over or wait for a pull request whose source repository isn't this one (section A2).

Why four places: (a) is the rule, (b) is a second check at the one moment that matters (the merge), (c) makes the robot's own quick check follow it, (d) puts it on the "never" list. Side benefit: a stranger can no longer jam the robot by opening a pull request titled "[in progress]".

## Decisions made (also added to docs/DECISIONS.md)
- The glossary no longer says "near home"; Windows costs about 1.7 times Linux (checked on GitHub's price page).

## Questions for the owner
- T73 item 1: type `fix the rule` to save the draft above (or ask for changes).
- T73 item 2: the two GitHub settings (the owner's clicks).
- T73 item 3: tick the two email boxes, and decide: accept the Gmail address in old commits (Claude's advice), or start a fresh repository.
- May Claude also reword the two "area you live in / South Hadley" lines in `docs/reuse-review.md` and `docs/DECISIONS.md`?

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- This clone is shallow (51 commits visible). The 186-commit scan in session 166 was done after un-shallowing; it wasn't repeated here.
- The panel was refreshed (`panel/live.json`: the "working" text now says three follow-ups are left). Whether it was republished is in the final message of this chat; if the note here says nothing else, assume the owner's Approve click happened.
- Files touched: `GLOSSARY.md`, `TASKS.md`, `docs/DECISIONS.md`, `docs/PROGRESS-LOG.md`, `docs/sessions/` (this note), `panel/live.json`, `panel/index.html`.
