# Handoff note: 2026-11-15, T73 items 1 to 4 (the rule, the settings, the rewording)
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE for Claude's part (T73 stays open: items 2 and 3 are clicks only the owner can make)
**Model used:** Medium (Sonnet), chat started by the owner (same chat as session 167) · **Branch / pull request:** claude/bold-lamport-t5kc92, pull request #173

## In simple words (for the owner)
You said `fix the rule`, so I saved it: the robot now only trusts pull requests that come from this repository itself. You said yes to rewording two more lines, so those are done too. You also asked me to change two GitHub settings by controlling your PC and to show you. I couldn't: this chat has no tool for controlling your PC or a browser, and I didn't pretend. The exact clicks are below, and they take about two minutes.

## What was done
- **Item 1, the rule (owner typed `fix the rule`, draft approved as written):** four edits in `docs/WORKFLOW.md`: A2 step 2 (act only on our own pull requests: branch starts with `claude/` AND `head.repo.full_name` is `Lukasmajukas/cellular-learning-app`; ignore the rest; a deleted copy counts as not ours; mention an ignored one once), A2's 🟢 bullet (second check of source repository and author right before merging), G step 1 (the quick check follows it), and a new line in F "Never". Not tested on a real stranger's pull request (none exists); the fields were seen on #171 in both the list and the single-pull-request tool.
- **Item 4 (owner said yes):** the two other lines that hinted at where the owner lives are reworded (`docs/reuse-review.md` and the time-zone row in `docs/DECISIONS.md`). My own lines from session 167 that repeated the phrase were neutralized too, and one phrase in the session 166 note. A search of every `.md` file finds no "near home", "area you live" or "where you live" any more. Old wording stays in the history of earlier saved versions.
- **Items 2 and 3, NOT done by Claude:** the owner asked me to do them with "cowork / control PC" and to show the screen. This chat has no computer-use tools, no browser tools and no `enable__...computer` tool (searched with the skill's own query, "computer", plus a search for the browser tools). Per the computer-use skill I did not pretend. I also did not use the GitHub command-line tool for account settings: it is for searching only in this session. So the clicks are the owner's, below.
- `TASKS.md` T73 row rewritten to show only what is left; `docs/DECISIONS.md` (the rule, the rewording), `docs/PROGRESS-LOG.md`, `panel/live.json` and `panel/index.html` updated.
- Nothing asked for approval; nothing else was blocked.

## What's next
Owner, in a browser where you are signed in to GitHub (names are from memory, so check them on screen):

**Item 2a: approval for outside contributors' pull requests.**
1. Open https://github.com/Lukasmajukas/cellular-learning-app/settings/actions
2. Find "Fork pull request workflows from outside collaborators".
3. Choose **Require approval for all outside collaborators**, then click **Save**.

**Item 2b: only collaborators may interact for a while.**
1. Open https://github.com/Lukasmajukas/cellular-learning-app/settings/interaction_limits (or Settings, then Moderation options, then Interaction limits).
2. Choose **Limit to repository collaborators**, with the longest duration (6 months).
3. Effect: strangers can't open pull requests, issues or comments for that time. You can switch it off earlier on the same page.

**Item 3: your email address.**
1. Open https://github.com/settings/emails
2. Tick **Keep my email addresses private**.
3. Tick **Block command line pushes that expose my email**.
4. Effect: new squash merges on `main` use your private GitHub address, not your Gmail. The 168 old commits still show the Gmail address: that can't be undone without starting a fresh repository (Claude's advice: accept it).
5. If a push is ever refused with "GH007", untick the second box and tell a chat.

If the owner still wants Claude to do these by controlling the PC: on claude.ai in a browser, the + menu in the message box can offer **Devices** (pick the PC before sending a new message); in the Claude desktop app it is Settings, This computer, Computer use (off by default). Browsers are read-only in computer use, so the clicking would also need the Claude in Chrome extension or the built-in browser. Then type `Do T73 items 2 and 3`.

- After the owner says the boxes are ticked: move T73 to Done in `TASKS.md`, refresh the panel, and (optionally) check that the next squash merge's author is no longer the Gmail address (`git log -1 --format='%ae'` on a fresh `main`).
- Next task (owner's choice): T68 or T69, Sonnet, Medium effort, type `Do task T68`.

## Decisions made (also added to docs/DECISIONS.md)
- The robot acts only on pull requests from this repository.
- Two other "where the owner lives" hints were reworded.

## Questions for the owner
- Items 2 and 3 above: please tick the boxes, then say so in any chat.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- The old copy of the branch `claude/bold-lamport-t5kc92` was already gone from GitHub after the squash merge of #172, so nothing needed merging in; the branch restarted cleanly from `main` (d90f936).
- Files touched: `docs/WORKFLOW.md`, `docs/reuse-review.md`, `docs/DECISIONS.md`, `docs/PROGRESS-LOG.md`, `TASKS.md`, `panel/live.json`, `panel/index.html`, `docs/sessions/` (this note, and one phrase in the session 166 and 167 notes).
