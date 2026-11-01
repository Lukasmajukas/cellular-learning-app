# Handoff note: 2026-11-01, T30 save file and settings screen
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE <!-- change to DONE when the chat finishes -->
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** `claude/t30-save-file-settings` / #34

## In simple words (for the owner)
The app now remembers your stars and settings after you close it, like saving a video game. It also copies the save once a day as a spare, and uses the newest spare if the main file ever breaks. There is a new ⚙️ screen to turn sounds and confetti off, pick a dark look, and make a backup yourself.

## What was done
- `app/electron/store.cjs`: save module (atomic write via temp file + fsync + rename, daily backup, keep 7, recover from damaged file).
- `electron/preload.cjs` + `main.cjs`: 4 safe doors (load, save, back up now, show file). `CELL_DATA_DIR` env var points tests at a temp folder.
- `src/storage.ts` (falls back to browser storage with no Electron), `prefs.ts`, `SettingsScreen.tsx`, `main.tsx` now loads/saves; sounds, reduce motion (no confetti, Motion `reducedMotion`) and dark look work.
- Tests: `store.test.ts` (9), `tests/save.spec.ts` (close/reopen). Added `@types/node` dev dependency. Existing click test now uses a temp save folder.
- Panel: `live.json` updated; panel not republished (robot run).
- Nothing asked for approval or was blocked.

## What's next
- Next task: T31 is Large (Opus, High) and still marked Later. T26 (photos) is retry-when-Commons-answers (still 429 today). Type: `Do the next task in TASKS.md`

## Decisions made (also added to docs/DECISIONS.md)
- Save/backup file layout; `CELL_DATA_DIR` for tests.

## Questions for the owner
- None. (Dark look and daily-goal choices [1, 2, 3, 5] are my guesses; tell me if you want others.)

## New words (also added to GLOSSARY.md)
- Save file, Backup, Atomic write, Preload

## Notes for the next Claude
Dark look only recolours the page background/text; PathMap/LessonPlayer inner colours are still light-themed (cosmetic, polish later). Daily goal is stored but unused until streaks (T32). Run e2e with `xvfb-run -a npx playwright test` in the cloud. The save file has `version: 1`; add a migration step in `normalize` if the shape changes.
