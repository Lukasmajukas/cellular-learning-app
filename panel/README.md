# Progress panel

A private page that shows how far Claude has got. Link (only the owner can open it): https://claude.ai/artifact/UFEWWa8kh5cWFcyQVJU5bc
Artifact slug: `dca37b4f-e1cc-4582-9b28-3f7a51a9f0ef`

## How it works (v1)
- `python3 panel/build.py` reads `TASKS.md`, `ROADMAP.md` and `docs/PROGRESS-LOG.md`, plus `panel/live.json` (robot, traffic light, usage limit), and writes `panel/index.html`.
- Publish it with `publish_files` (slug above, `base_version` from `get_artifact`). The page says "As of <time>".
- It has no keys and makes no network calls, so viewing costs no Claude usage.

## Why a snapshot and not live (tested in T23, 2026-10-31)
- The owner's claude.ai connectors are: Apple Music, Clinical Trials, Gmail, Google Calendar, Docs, Drive, Sheets, Slides, Indeed. **There is no GitHub connector**, so a page cannot read this repository through `mcp`.
- The `files` capability reads a Claude Code project's files, but needs the project's id (`chan_...`), which a robot chat can't see. It is also for project members only, and the repository is a GitHub one, not a project.
- A cloud chat can't run the page's code, so tool arguments for the Claude Code Remote connector can't be tested here. Guessing them is not allowed.
- **Result:** live is not possible today. The snapshot stays. Re-test only if the owner adds a GitHub connector or tells Claude a project id.

## Keeping it fresh (now part of the end-of-chat steps)
`docs/WORKFLOW.md` section C, step 2a: before merging, a chat runs `panel/build.py` after updating `panel/live.json`, then republishes with `publish_files` (slug above, `base_version` from `get_artifact`). If publishing fails, say so in the handoff note and carry on: it never blocks a merge.
