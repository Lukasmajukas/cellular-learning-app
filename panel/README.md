# Progress panel

A private page that shows how far Claude has got. Link (only the owner can open it): https://claude.ai/artifact/UFEWWa8kh5cWFcyQVJU5bc
Artifact slug: `dca37b4f-e1cc-4582-9b28-3f7a51a9f0ef`

## How it works (v1)
- `python3 panel/build.py` reads `TASKS.md`, `ROADMAP.md` and `docs/PROGRESS-LOG.md`, plus `panel/live.json` (robot, traffic light, usage limit), and writes `panel/index.html`.
- Publish it with `publish_files` (slug above, `base_version` from `get_artifact`). The page says "As of <time>".
- It has no keys and makes no network calls, so viewing costs no Claude usage.

## Why a snapshot and not live
The page-connector route (`mcp` capability) could not be tested from a cloud chat, and guessing its tool arguments is not allowed. Open step for a later chat: test whether the page can call the GitHub connector and the Claude Code Remote connector; if yes, make it live.

## Keeping it fresh
Before merging, a chat may run `build.py` after updating `live.json` and republish. Not yet part of WORKFLOW.md.
