# Handoff note: 2026-11-09, T66 look-back review (past chats and the code)
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE
**Model used:** Extra large (Fable), Extra high effort (the owner's pick for this chat) · **Branch / pull request:** `claude/awesome-cerf-fk6hdi` / [#163](https://github.com/Lukasmajukas/cellular-learning-app/pull/163)

## In simple words (for the owner)
You asked Claude to look back over the old chats and the code, like a coach re-watching a match, and say where things went the wrong way and what could be better. This chat only read, checked and wrote a report. It changed nothing in the app and nothing in the rules. The report is `docs/reviews/2026-11-09-look-back-review.md`; start with the part called "In simple words".

## What was done
- **Read the record:** this project's chat list back to Oct 31 (about 270 chats), the launcher chat's latest events, the Nov 1 "Overnight failure investigation" chat, usage figures for a dozen chats, the alarm (`list_triggers`), open pull requests, the Releases page, the last 40 Windows build runs, the plan (`docs/PRD.md`), the redesign plan and ideas board, the reviews, and the handoff notes at the turning points.
- **Read the code:** the Electron shell, saving, review timers, streak, the lesson player, question marking, fact fill-in, the build workflow.
- **Ran the checks on `main` (5b9492c):** see "Test results".
- **Wrote the report** (Status: DRAFT): 12 findings about how the chats went (part A), 17 gaps in the code (part B), 10 suggested rules (part C), a suggested order, and 5 questions for the owner.
- **`TASKS.md`:** T66 in Done; six new rows T67 to T72, all marked so the robot doesn't start them before the owner says OK; a short update on the T57 row (the green picture).
- **Also:** two decision rows, five glossary words, a diary line, the panel (republished from this chat).
- **Tidy:** put away 3 old chats of this project ("Robot run" from Nov 5, "T40", "Overnight failure investigation"). The half-done redesign chat named in pull request #162 and the launcher were left alone.

## The seven biggest finds (details in the report)
1. The look was polished while 52 of 68 carrier facts stayed unchecked (the same number as on Nov 1).
2. The weekly limit was gone 37 hours after its reset (Nov 4, 10:00 to Nov 5, 23:35 UTC); 40 Opus chats.
3. The newest installer is from Nov 5, 07:48 UTC (R18). 19 later changes were never built or tested on Windows; 16 were merged with the Windows check left out.
4. T57's green picture is very likely the installer's own waiting animation (`install-spinner.gif`: green, 268 x 167 px, x 1.25 = the 335 x 208 measured in session 118). `app/electron/main.cjs` never answers the installer's start-up signals, which also means no shortcut gets made.
5. Advice from the Nov 1 Opus chat was never written into the project and was lost.
6. T51 was ticked on the owner's word; the alarm's message is still the old one-liner today.
7. A finished lesson is saved only on "Back to the path".

## Test results
- Type check (`tsc --noEmit`): OK. Unit tests: 269 of 269. Content checker: OK (253 facts, 27 photos, 635 questions). Checker's own tests: 39 of 39.
- Click tests (cloud, `xvfb-run -a npx playwright test --trace off`): 131 of 131 passed in 18.1 minutes, on the first try.
- Windows build: not run (GitHub gives it no computer since Nov 5, T62). This pull request changes only documents, so no build is triggered.
- Panel: republished from this chat (version 1794257392-67b6).

## What's next
- **The owner:** read the report's "In simple words" and answer its 5 questions in any chat. The most useful first: look at GitHub's Billing page (T62); say how you open the app (Setup.exe each time, or the Start menu); say whether the robot may do T67 to T69; decide whether to type `Pause the redesign` until those are in.
- **Next task for a chat, once the owner says OK:** T67 (make the app answer the installer), model: Medium (Sonnet), effort: Medium, type: `Do task T67`.
- **The robot:** it is on again (since Nov 9, 20:38 UTC; it wakes at about half past every hour). Its next job is the 🟡 pull request #162 (redesign idea I85), on Opus.

## Decisions made (also added to docs/DECISIONS.md)
- This review changes nothing by itself; its fixes and rule ideas wait for the owner.
- T57's working theory is now "the installer's waiting animation"; the graphics-chip test build is dropped.

## Questions for the owner
1. How do you open the app each time: `Setup.exe`, or the Start menu or a desktop icon?
2. Pause the redesign until T67 to T69 are in? (My advice: yes.)
3. Did you change your Claude plan today around 19:35 UTC? (Chats started working again then, before the Nov 11 reset.)
4. Which of the rule ideas C1, C2, C3 and C9 do you want? (Each changes something you chose before.)
5. May the robot do T67, T68 and T69 by itself?

## New words (also added to GLOSSARY.md)
- Look-back review; installer's waiting animation; start-up signal (from the installer); shortcut; one copy at a time (single-instance lock).

## Notes for the next Claude
- **Session number:** 157 belongs to the open pull request #162, so this note is 158.
- **Traffic light at the start:** 🟡 (#162, its chat `session_0192jN2Qr2Yh1v9ocKWA8saK` died on the weekly limit on Nov 5). The owner named a different task, so I left #162 alone. It is still open.
- **Claimed late:** the chat began in plan mode (read-only), so the claim came about 9 minutes in.
- **Cut off by the limit:** this chat used up the owner's 5-hour limit about 20 minutes in (Nov 9, about 20:54 UTC) and carried on at 00:31 UTC on Nov 10, when the owner said the limit had reset. Nothing was lost (the unsaved files were still on disk) and nothing else ran meanwhile: no robot run started, `main` didn't move. Lesson: a look-back like this doesn't need Fable at Extra high; Opus, High effort, in two smaller chats, would do.
- **For T67:** `electron-winstaller`'s README ("Handling Squirrel Events") describes the signals (`--squirrel-install`, `--squirrel-updated`, `--squirrel-uninstall`, `--squirrel-obsolete`, `--squirrel-firstrun`) and the roughly 15-second wait. The usual helper is the `electron-squirrel-startup` package; it must be a real dependency (not a dev one), because Forge leaves dev packages out of the packed app. `forge.config.cjs` sets no `loadingGif`, so the default green one is used. Add a single-instance lock in the same change (B5). None of it can be proven without a Windows build (T62) and, better, the install test in T68.
- **For T68:** the workflow's `paths` list has `app/**` only, yet the app imports `content/lessons.json` and `content/bands.json`. `get_workflow_run_usage` reports 0 billable milliseconds even for early runs, so the API can't confirm the billing theory; only the owner's Billing page can.
- **For T69:** `LessonPlayer.tsx` calls `onFinish` only from `finish()` ("Back to the path" or Esc). `restart()` ("Again") throws the finished result away.
- **How to read an old chat cheaply:** `list_events` with `kinds: ["user", "assistant"]` and `limit: 100` returns a big file; the words are under `internal_anthropic_catchall.message.content`, not under `message`.
- **The launcher today:** 78,640 of 100,000 tokens, effort low, and it writes a fresh summary on every wake-up. On Nov 9 at 19:35 UTC the owner typed "pause for 1hr" into it; it paused the "Robot" alarm and set a one-time reminder that switched it on again at 20:38 UTC.
- **Not in the report, small:** the panel's "Waiting for you" list only counts rows whose "Who" is exactly "You", so T57's question, T60's paste and T47's links don't show there. `GLOSSARY.md` has grown past its three headings (words after line 125 all sit under "Photo words"). Both fit T71.
- **Approvals and blocks:** nothing asked for approval and nothing was blocked.
