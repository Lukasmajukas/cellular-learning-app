# 🧭 Decisions

Every decision, with the date and why. Newest at the bottom.

| Date | Decision | Why |
|---|---|---|
| 2026-10-31 | Personal hobby app, not for sale | Owner's choice |
| 2026-10-31 | Cross-platform desktop app (Windows/Mac/Linux) | Owner's choice |
| 2026-10-31 | US bands only; Wikipedia's global tables used only as a cross-check | Owner's choice |
| 2026-10-31 | Research, then plan (PRD) sign-off, then build; no code before sign-off | Owner's working rule |
| 2026-10-31 | Original radio/tower look; nothing copied from Duolingo (name, owl, green, art, sounds) | Copying the look and feel is the legal risk (*Tetris v. Xio*); the mechanics themselves are free to use |
| 2026-10-31 | Images: copyright-free photos plus Claude-drawn diagrams; no AI-generated equipment photos for identification questions | Owner has no photos; AI image generators invent equipment details |
| 2026-10-31 | One GitHub repo as the project binder; one task per chat; a branch and pull request for every change | Long chats use more of the limit and lose detail |
| 2026-10-31 | Claude must say when to start a fresh chat or a new branch | Owner's request |
| 2026-10-31 | Model guide by size (Small/Medium/Large/Extra large): Sonnet by default, Opus for thinking jobs, Haiku for chores, Fable only when stuck | Balances cost and capability, and stays valid when new versions come out |
| 2026-10-31 | App engine still open; Electron is favored over Tauri (the research report's pick). Decide in the PRD. | Owner has no coding background, and Electron behaves the same everywhere |
| 2026-10-31 | Repository: `Lukasmajukas/cellular-learning-app` (private; working name) | Owner created it |
| 2026-10-31 | Everything is explained like the owner is 12; new words go in `GLOSSARY.md` | Owner's request |
| 2026-10-31 | Owner's main computer is a Windows PC (confirm whether Mac/Linux is also used). On Windows, Tauri also uses a Chromium engine, so both app engines are viable. | Seen in the owner's Remote Control computer list |
| 2026-10-31 | Owner uses a Windows PC **and** a Mac; the app must run on both. This favors Electron (same Chromium engine on both) over Tauri (WebKit on Mac). Final pick in the PRD. | Owner's answer to T02 |
| 2026-10-31 | No code reused from the owner's other projects (all Swift/Python, Apple-only). Their data is a cross-check only; band and carrier facts still come only from `band_verification.md`. | T03 reuse review |
