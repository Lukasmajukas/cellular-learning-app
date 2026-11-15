# Handoff note: 2026-11-15, T72 five small choices from the look-back review

**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort · **Branch / pull request:** claude/optimistic-faraday-tks20p, pull request #179

## In simple words (for the owner)
You asked for the five product questions as tick boxes so you wouldn't have to type. You ticked Claude's suggestion on every one. They are like the rules of a board game, agreed before the first turn. They're all written down now, and the ones that need building are new tasks (T77 to T80). No app code changed.

## What was done
- Read the signed plan (`docs/PRD.md` 4c, 4d, section 9) and the code (`app/src/lesson.ts` `stars`, `app/src/path.ts` `lessonStatus`, `app/src/fsrs.ts`) so each question matched what the app really does. Found that the daily reminder was already answered in the plan ("off by default") but never built, and said so in the question.
- Asked the five choices in the tick-box form (two rounds: the form takes four at a time). Answers, all "Claude's suggestion":
  1. **Pass mark:** only checkpoints and the final exam need one (about 7 of 10); ordinary lessons always open the next. → T77.
  2. **Skip ahead:** a "Test out" quiz per unit. → T78.
  3. **Badges and personal bests:** yes, both, kept small, after T47. → folded into T54.
  4. **Daily reminder:** not now; decide again with the iPhone. → T80 (Later).
  5. **Review timing:** keep right-or-wrong, add a test against the real `ts-fsrs` library, make the plan say two grades. → T79.
- `TASKS.md`: T72 moved to Done; T77, T78, T79 (Now) and T80 (Next, Later) added; T54's "still to do" updated.
- `docs/DECISIONS.md`: five rows. `docs/PRD.md`: two dated "Changed 2026-11-15 (T72)" notes (4c and section 9 question 4), added next to the old text so nothing is silently overwritten. `GLOSSARY.md`: grade, pass mark, test out, personal best. `docs/PROGRESS-LOG.md`: one line. `panel/live.json` and `panel/index.html` refreshed.
- Nothing asked for approval; nothing was blocked. No old chats archived (none of this project's other chats qualified: #177's chat is working).

## What's next
- Next for the owner: nothing is waiting on you. When you want one: `Do task T77` (pass mark for tests), then `T78` (Test out). T79 is for a robot run or `Do task T79`. Medium (Sonnet), Medium effort for all three.
- Still the bigger goal: T47 (the 52 unchecked carrier facts) with the owner in the chat.

## Decisions made (also added to docs/DECISIONS.md)
- Pass mark for tests only; a "Test out" per unit; badges and personal bests kept small; no PC daily reminder for now; review timing stays right-or-wrong.

## Questions for the owner
- Still open from the review, not part of T72: question 4 (which of C1, C2, C3, C9 to apply, i.e. T70) and question 5 (may the robot do T67 to T69 by itself).

## New words (also added to GLOSSARY.md)
- Grade (in reviews), Pass mark, Test out, Personal best.

## Notes for the next Claude
- **Cost the owner accepted without it being spelled out in the question:** with two grades and no answer times saved, the plan's S11 goal ("8 in 10 right a week later") can't be measured. It's in the DECISIONS row and the PRD note; if the owner later wants S11 measured, it needs a saved log of every answer.
- T77 and T78 touch `app/src/lesson.ts`, `app/src/path.ts` and the result/path screens. T78 reuses T77's pass mark, so do T77 first. T79 touches `app/src/fsrs.ts` and adds `ts-fsrs` as a dev-only dependency (`app/package.json`).
- Traffic light: pull request #177 (T76, auto-update) was open and `[in progress]` for a different task; the owner named T72 directly, and the files don't overlap (T76 edits `app/forge.config.cjs` and `docs/updates.md`). Session 172 belongs to T76, so this note is 174.
- The panel was rebuilt and republished from this chat (owner is in the chat).
