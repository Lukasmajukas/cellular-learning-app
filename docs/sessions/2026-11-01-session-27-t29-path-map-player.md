# Handoff note: 2026-11-01, T29 v0.3 skeleton part 1: path map and lesson player
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE <!-- change to DONE when the chat finishes -->
**Model used:** Medium, Medium effort (robot) · **Branch / pull request:** claude/t29-path-map-lesson-player, PR #30

## In simple words (for the owner)
We built the home screen of the app: a trail of lesson circles. You tap the glowing one to play a lesson. When you finish, the circle turns green with stars, and the next one lights up. The questions are still just samples, and the app forgets your progress when you close it (T30 fixes that).

## What was done
- `app/src/path.ts`: units, lessons, unlock-in-order rule, best-stars record (5 unit tests).
- `app/src/PathMap.tsx`: animated path map (green done, blue current, grey locked).
- `app/src/LessonPlayer.tsx`: the old sample lesson, now plays any lesson and reports stars; has a quit (X) button.
- `app/src/main.tsx`: switches between map and player; progress is in memory only.
- Click test rewritten (`app/tests/lesson.spec.ts`): map, lesson, finish, next lesson unlocks. Passes in real Electron.
- Unit tests 8/8, build OK. No outside access was blocked or asked for.

## What's next
- Next task: T30 (save file with daily backups, settings screen), Medium (Sonnet), Medium effort, type: `Go`

## Decisions made (also added to docs/DECISIONS.md)
- Lessons unlock strictly in order; best stars kept.

## Questions for the owner
- None. (T40 still waits for your verdict on the test build.)

## New words (also added to GLOSSARY.md)
- Path map, Lesson player

## Notes for the next Claude
`Progress` (lesson id -> best stars) is the shape T30 should save. Sample lessons all reuse the 3 demo questions. Panel not republished (robot run). T26 still blocked: Wikimedia Commons answered 429 again today.
