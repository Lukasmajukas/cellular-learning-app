# Look-back review: the old chats and the code (task T66)

**Status:** DRAFT for the owner to read and push back on · **By:** Extra large (Fable), Extra high effort, in a chat the owner started · **Date:** 2026-11-09
**What was asked:** "look back at past convos and see if models deviated or took it a wrong way and look for gaps in code or things that could be better in future".
**What this is not:** it changes no app code and no rules. Every fix below is a suggestion that waits for your OK.

## In simple words (read this part first)

Think of the project as building a quiz book with a nice cover. The chats built a very nice cover. The inside of the book is good too, but one whole chapter you asked for ("which carrier uses which band") is still mostly blank pages, and nobody has handed you a new copy of the book since November 5.

The seven things that matter most:

1. **The robot polished the look while your main goal sat still.** 52 of the 68 "which carrier uses which band" facts are still unchecked, exactly as on November 1. All 83 bands still have only Wikipedia as their source. In that time 40 big Opus chats went into colours, movement and sounds. The last ones moved a sound by a tenth of a second and added a 12-pixel light.
2. **Your whole weekly limit was gone 37 hours after it reset.** It reset Wednesday Nov 4 at 10:00 UTC. It ran out Thursday Nov 5 at 23:35 UTC. After that no chat could work for almost 4 days. You had agreed to "nonstop", and the plan did warn about this, so the robot did what it was told. But nobody stopped to ask "is this still worth it?"
3. **You can't see any of the newer work.** The newest installer is from Nov 5, 07:48 UTC (redesign step R18). The 19 changes after it (sounds, the Day look, the welcome screens, keyboard, and more) have never been built for Windows, never tested on Windows, and you have never seen them.
4. **I think I found your green start-up picture (T57), and it isn't your graphics chip.** It is the installer's own "please wait" animation. The app never tells the installer "I'm ready", so the installer waits about 15 seconds every time. The same gap means the installer never makes a Start-menu shortcut. One question from you settles it (see "Questions for you").
5. **Good advice was lost because it only lived in a chat.** On Nov 1 an Opus chat wrote a correct diagnosis and five fixes, asked for your OK, and never got an answer. Nothing was written down, so three of those five problems are still here.
6. **A task was ticked "done" on your word without checking** (the robot's hourly message, T51). It was never changed. It still isn't today.
7. **Finishing a lesson is only saved when you press "Back to the path".** Close the window on the stars screen and the whole lesson is lost.

**The good news:** the fact rules held. No quiz answer rests on an unchecked fact. All 269 small tests, the fact checker (253 facts, 635 questions) and the code check pass on today's `main`. The save file is written safely and backed up daily. The robot wrote honest notes, including about its own failures. That honesty is why this review was possible.

## How I checked

| What | How |
|---|---|
| The chat list | Every chat of this project since Oct 31, about 270 (titles, status, who started them). 19 were started by you; about 250 are robot chats. |
| Chats read in detail | The launcher chat's latest 100 events; the Nov 1 "Overnight failure investigation" chat; usage figures for a dozen chats. |
| The written record | `TASKS.md`, `docs/WORKFLOW.md`, `docs/PRD.md`, the redesign plan and ideas board, the 4 design reviews, the app review, and the handoff notes that mark turning points (sessions 107, 111, 118, 119, 139, 156). All 156 notes were scanned by a small program for status and for words like "refused" and "blocked". |
| The robot's switches | `list_triggers` (the alarm), the open pull requests, the Releases page, the last 40 Windows build runs. |
| The code | Read: the Electron shell (`app/electron/*.cjs`), saving, review timers, streak, lesson player, question marking, fact fill-in, the build workflow. Ran on `main` (5b9492c): type check OK, 269 of 269 unit tests, content checker OK, 39 checker tests, and the click tests (result under "Test run" at the end). |
| Not checked | I did not read every robot chat word for word (about 250). I did not run the app on Windows (no cloud chat can). I could not see your GitHub billing page. |

---

## Part A. Where the chats went the wrong way

Each item says what happened, how I know, and what would stop it happening again. "Deviation" below means a chat went against a written rule or the signed plan. "Drift" means nobody broke a rule, but the project slid somewhere you may not have wanted.

### A1. Drift: polish first, proof later
- **What happened.** Your first goal in `CLAUDE.md` is bands "and which carrier uses which". In `content/bands.json` today: 52 of 68 carrier rows are UNVERIFIED (AT&T 12, T-Mobile 14, Verizon 10, C Spire 11, others 5). Only 8 are CURRENT. All 83 band rows cite Wikipedia. The two tasks that fix this (T47 carrier facts, T07 official 3GPP numbers) have been blocked since Nov 1, waiting for you.
- **Meanwhile.** Nov 4 to 5: the 24 redesign steps, then 10 "idea" chats and a fourth design review, all on Opus (40 Opus chats; 6 of them stopped part-way and were started again). The app plan (PRD section 5) says: "this is a small, carefully checked fact book with a game on top. So the content design matters more than the code."
- **Was it disobedience?** No. You chose "nonstop, never wait for me" in T58, and the chat did point out the clash with your earlier "can't rush it". What was missing is a single place that showed you the trade: *"your limit is going into X while goal 1 waits on a 5-minute job from you."*
- **The moment it could have turned.** On Nov 1 an Opus chat advised: don't build units 4 to 5 yet, because "52 of the 68 carrier facts are still unchecked, so it would hit the same wall. A short session from you (new build plus carrier links) unblocks more than the robot can do alone." You never answered, the advice was never written down, and the robot built units 4 to 10 anyway.
- **Fix (rule):** a "worth it?" check before each redesign chat (Part C, C1).

### A2. Drift: the weekly limit, used up in 37 hours
- **Timeline (UTC).** Wed Nov 4, 10:00: weekly reset. 10:36: redesign step R01 starts. Thu Nov 5, about 11:30: status already "warning". 23:35: "You've hit your weekly limit · resets Nov 11, 10am". From then until today 19:33, the hourly alarm kept waking the launcher (about 92 times, once an hour), and each time the answer was the same error.
- **What it cost.** Sampled Opus chats cost $3.10, $5.24, $8.99 and $10.39 each in usage (the plan guessed $6 to 10). 40 of them is roughly $250 to $300 of usage in a day and a half. The "tiny" launcher chat alone has used $78 since Nov 1, more than any other chat I measured. (These are usage figures, not money you paid: the robot never used paid extra usage. That rule held.)
- **Two rules added up.** "A warning changes nothing" (your choice, T50) plus "nonstop" (your choice, T58). Each was reasonable alone. Together they leave no reserve for you.
- **Something changed today at about 19:35 UTC:** chats work again, a day and a half before the reset. I can't see why (a plan change on your side?). Worth knowing, because the robot is back on too.
- **Fix (your choice):** keep a reserve. For example: at "warning", the robot stops redesign chats only (C2).

### A3. Deviation in spirit: about 16 code changes merged while the Windows check couldn't run
- **What happened.** GitHub stopped running the Windows build on Nov 5, 09:17 UTC (T62). The redesign's own checklist (`docs/redesign/PLAN.md`, step 3) says every session must pass the Windows build. The robot wrote the problem down honestly, cited the rule "a block only the owner can lift is written down and merged" (`docs/DECISIONS.md`, Nov 5), and kept merging. 16 handoff notes say the Windows check was left out.
- **Why it matters.** Windows is the only place the app has to work. The rule the robot leaned on was written for a missing answer, not for a broken safety net.
- **Fix (rule):** when a safety check is down, the robot switches to work that doesn't need it (lessons, facts, documents), or stops (C3).

### A4. A wrong guess in the plan that nobody revisited: "free build minutes are plenty"
- **What happened.** 229 Windows build runs in 6 days. Every push to every pull request ran everything on a Windows computer: install, 269 unit tests, about 130 click tests, and packing the installer. Two to four times per pull request. Nothing cancels a run when a newer push replaces it. Windows minutes count double.
- **Earlier warning sign.** On Nov 3 the storage for build files was full of 27 old installers (T56). Same family of problem: nobody designed what the build costs.
- **Honest limit.** T62 says "most likely the free minutes are used up". I agree it fits (runs die in 3 seconds with no computer and no log), but I could not confirm it: only your Billing page shows it.
- **Fix (code):** B3 below. Without it, the minutes that come back on your next billing date would be gone again in about 5 days.

### A5. A wrong theory chased for three chats: the green start-up picture (T57)
- **The theory so far:** a graphics-chip glitch on your PC. A test build with graphics-chip drawing off was planned.
- **What the evidence says instead.** The tool that makes the installer (it's called Squirrel) shows a "please wait" animation while it works. Its standard picture (`install-spinner.gif` inside `electron-winstaller`) is **green, looks like a code editor being typed in, and is 268 × 167 pixels**. Session 118 measured the green blocks in your screenshot at "about 335 × 208 px". 268 × 1.25 = 335 and 167 × 1.25 = 209: that is the picture at Windows' common 125% screen setting. Your words were "looks like a coding animation", "about 12 seconds", "on every launch".
- **Why 12 seconds.** The installer starts the app with a special signal and waits for the app to answer and quit. Our app has no code for that signal (`app/electron/main.cjs`; the usual helper `electron-squirrel-startup` isn't installed). So the app just opens normally under the animation (that's the path map you saw behind it) and the installer waits out its limit of about 15 seconds.
- **Why "every launch" (my guess, needs your answer).** That same missing code is what creates the Start-menu and desktop shortcuts. Without a shortcut, the natural way to open the app is to double-click `Setup.exe` again, which re-installs it each time. `README.md` only says "download the file ending in Setup.exe"; it never says how to open the app afterwards.
- **What I can't explain:** why you saw two green pictures and not one.
- **How sure:** very sure about what the picture is. Fairly sure about the cause of "every launch".
- **Why three chats missed it.** Every test runs the app from its source code on a Linux cloud computer. Nothing ever tests the installed Windows app. The plan promised that test (success measure S1: "GitHub's own Windows computer installs and opens it on every build"). It was never built, and nobody noticed it was missing.
- **The confetti half of T57 is out of date:** the redesign replaced confetti with the "signal burst" (R11, R12), so there is no confetti to see any more.

### A6. Deviation: ticked "done" without looking (T51 → T60)
- **What happened.** T51 asked you to paste a new hourly message into the launcher chat. You said "done". A chat ticked it. The message never changed: I read it today with `list_triggers` and it is still the old one-liner. A later chat noticed a day after (T60), which is still open.
- **What it costs.** The launcher can't be wiped with `/clear`, so it re-summarises itself on every wake-up (three times inside one minute today).
- **Fix (rule):** when a tool can read the real state, read it before ticking (C4). Here that was one `list_triggers` call.

### A7. Deviation: a rule that lived only in a chat's memory
- The launcher chat invented "limit warning → only small chores", a rule in no file. It started about 30 Haiku chats that found nothing to do, and the robot stood still for about 30 hours (Nov 2 to 3). Found and fixed on paper in T50 and T52. The fix isn't finished because of A6.

### A8. Deviation: findings left in a chat and lost
- **What happened.** The Nov 1 "Overnight failure investigation" chat (Opus) found the real causes of a stalled night, proposed 5 fixes and asked 4 questions. It waited for your OK and wrote nothing into the project. `docs/WORKFLOW.md` section B says questions also go into `TASKS.md` as "You" rows. They didn't. The chat is still open in your list.
- **Still unfixed from that list:**
  1. A task blocked by a website twice should be skipped for a while. (The photo task then used about 20 more runs on "too many requests".)
  2. One phone message when the robot runs out of work, saying exactly what it needs from you.
  3. A change to lessons alone doesn't make a new installer (the build only watches `app/`, and lessons live in `content/`).
- **Fix (rule):** write findings into the project first, then ask (C5).

### A9. Drift: the signed plan and the app quietly grew apart
PRD section 11 promises "nothing is silently overwritten". These swaps are in the code but in no decision row:

| The plan says | The app does | Recorded? |
|---|---|---|
| Review timing by the `ts-fsrs` library | A hand-written 26-line copy (`app/src/fsrs.ts`) | No |
| Four grades (Again, Hard, Good, Easy), and "the time of every answer is saved" | Only right or wrong; no times saved | No |
| S11: the app keeps "8 in 10 right a week later" per unit | Nothing stores it, so it can't be measured | No |
| S5: an automatic test with the network off | No such test | No |
| S1: Windows installs and opens the app on every build | Never built (see A5) | No |
| Mastery badges and personal bests (4d) | Not built, no task | No |
| "Nothing moves on until you've said so" (section 8) | You never confirmed units 1 to 3 (T33 still says "you try"); units 4 to 10 and the redesign were built on top | Only for the redesign |
| Our own colours, keys 1 to 4 | Were broken for days; found in T58 and fixed in R01 and R04 | Yes, later |

- **Fix (habit):** a one-page checklist of the plan's promises against tests and tasks, looked at when a level ends (C6).

### A10. Drift: the robot marks its own homework
- The four design reviews were written by the same robot that built the screens: 3.4, then 4.4, then 4.7, then 4.7, with "no screen was wrong this time". The ideas board has 98 ideas; 36 are done. Your own section of that board still says "(none yet)". Nothing outside the robot has judged the redesign.
- **Fix:** your eyes on a build every so often, or stop when two reviews in a row don't move the score (C1, C2).

### A11. Drift: the paperwork got heavy
- Every chat must read `CLAUDE.md`, `TASKS.md` and `docs/WORKFLOW.md` before it starts. `TASKS.md` is now 39,000 characters; the T59 row alone is 7,700 and the T26 row 4,400. Redesign chats read 92,000 more (plan, style guide, ideas). The notes themselves say a chat spends "about 90,000 tokens just reading the project files".
- Each robot job is two chats (Sonnet claims it, Opus does it) plus the launcher. A robot run that finds nothing to do still reads about 117,000 tokens before it stops (measured on the last one, Nov 5, 23:34 UTC).
- The project folder's history is already 42 MB after 9 days, mostly because each redesign chat retook all 238 gallery pictures.
- `CLAUDE.md` says "keep this file short". The ledgers behind it need the same rule (C7).

### A12. This chat's own slips (so the record is fair)
- I hung the "busy" sign late. The chat began in plan mode (read-only), so I researched first and claimed after about 9 minutes, not "within the first few minutes".
- The traffic light was 🟡 (pull request #162, idea I85, left by a chat that died on the limit). The rule says take it over. You asked for something else, so I left #162 for the robot and say so here.
- **This chat used up your 5-hour limit by itself**, about 20 minutes in, and sat cut off for about 3.5 hours before it could finish (started Nov 9, 20:33 UTC; finished Nov 10). A very big model at Extra high effort, reading hundreds of pages, is the dearest way to do a review. Next time: Opus, High effort is enough for a look-back, and it should be split in two (the chats in one, the code in another).

---

## Part B. Gaps in the code

Ranked by how much each could hurt you. "Where" is the file to change. Nothing here was changed.

| # | Gap | Where | What could go wrong | How big |
|---|---|---|---|---|
| B1 | The app ignores the installer's start-up signals | `app/electron/main.cjs`, `app/forge.config.cjs`, `README.md` | The 15-second green animation, the app opening in the middle of an install, no Start-menu or desktop shortcut, a messy uninstall (A5) | **High** |
| B2 | No test installs and opens the real Windows app | `.github/workflows/app-build.yml` | Problems like B1 stay invisible; "your progress survives a new version" (S6) is unproven | **High** |
| B3 | The Windows build runs everything on every push | `.github/workflows/app-build.yml` | Minutes run out (A4). Also `content/**` isn't watched, so a lesson fix makes no new installer | **High** |
| B4 | A finished lesson is saved only on "Back to the path" | `app/src/LessonPlayer.tsx` (`finish`), `app/src/main.tsx` (`onFinish`) | Close the window on the stars screen, or press "Again" and then leave: stars, XP, the streak day and the review timers are all lost. Breaks S6 ("not on closing") | **Medium** |
| B5 | Two copies of the app can run at once | `app/electron/main.cjs` (no single-instance lock) | Both write the same save file; the last one wins and the other's progress vanishes. More likely while B1 exists | **Medium** |
| B6 | Review timing is simpler than planned, and unchecked | `app/src/fsrs.ts` | A copied formula with no test against the real library; no answer times; S11 can't be measured | **Medium** |
| B7 | No pass mark anywhere | `app/src/lesson.ts` (`stars`) | 0 right still gives 1 star and unlocks the next lesson, checkpoints and the final exam included. Maybe that's what you want (kind), but nobody decided it | Medium (your call) |
| B8 | Lessons unlock strictly one after another | `app/src/path.ts` (`lessonStatus`) | 49 lessons in a fixed row, no way to "test out" of what you already know (you know eight band names already) | Low to medium (your call) |
| B9 | A damaged save with no readable backup starts from zero without a word | `app/electron/store.cjs` (`load`), `app/src/Notices.tsx` | You'd see the welcome screen and think everything is gone. The old file is kept (`save.damaged-….json`) but nothing tells you | Low |
| B10 | The number box marks non-numbers as wrong answers | `app/src/questions.ts` (`parseNumber`), `app/src/QuestionTypes.tsx` | "12 cells" or "n71" counts as a miss instead of "please type just the number". A leftover in the code strips a trailing "b" or "n" (it was surely meant for a leading B or n) | Low |
| B11 | A bad lesson file would freeze the app on "Tuning in" | `app/src/units.ts` | Lessons are built before the "something went wrong" screen exists, so an error there shows nothing. Unit tests guard it today | Low |
| B12 | Standard Electron safety settings are missing | `app/index.html` (no Content-Security-Policy), `app/electron/main.cjs` (no block on opening web pages) | Small today (the app has no web links), cheap to add | Low |
| B13 | Test-only switches ship inside the real app | `app/electron/main.cjs`, `preload.cjs` (`CELL_TEST_*`) | Harmless unless set by accident; one of them (`CELL_TEST_CHANGES`) would break saving if it held bad text | Low |
| B14 | The click tests are slow and timing-based | `app/tests/*.spec.ts` | 117 fixed waits, about 17 minutes on one worker; two whole tasks (T64, T65) already went into "fair" speed tests. Test files are named after sessions (`r22.test.ts`, `r23.test.ts`, `t32.test.ts`), not after what they test | Low |
| B15 | "Now" is only read when a screen is drawn | `app/src/main.tsx` | Leave the app open past midnight: streak, today's goal and due reviews stay stale until you click something | Low |
| B16 | Confusing names | `app/src/sampleLessons.ts` exports the real `DATA`; `lesson.ts` holds samples | Future chats lose time, or edit the wrong file | Low |
| B17 | A clock that goes backwards resets the streak | `app/src/gamify.ts` (`recordDay`) | Travel across time zones, or a clock fix: streak back to 1, no repair offered | Low |

**Things I checked and found fine:** the save file can't be half-written (temp file, flush, rename); a damaged file is kept aside and the newest good backup is used; the page can't reach Node (context isolation on); the fact fill-in fails loudly on a missing fact; answers are shuffled; `1,710` and `37 GHz` are read correctly.

---

## Part C. What to do better (suggested rules; none are in force yet)

| # | Suggested rule | In plain words | Clashes with something you chose? |
|---|---|---|---|
| C1 | **"Worth it?" check** before any redesign chat | First: is there a Medium task that moves the two learning goals, or fixes a bug you reported? Do that instead. Second: if two design reviews in a row didn't move the score, pause the redesign and tell you | Softens "nonstop" (T58). Your call |
| C2 | **Keep a reserve** | When the weekly limit says "warning", the robot stops redesign chats only. Fixes and your own chats carry on | Partly undoes T50 ("a warning changes nothing"). Your call |
| C3 | **No safety net, no code** | If the Windows build can't run, the robot doesn't merge app code; it does lessons, facts and documents | Changes how WORKFLOW G7 was read on Nov 5 |
| C4 | **Look before you tick** | A task that depends on something you did gets ticked only after a tool has read the real state, when one can | No |
| C5 | **Write first, ask second** | A chat that finds problems writes them into the project (a note and "You" rows) before it asks you anything | No (it's already half-written in WORKFLOW B) |
| C6 | **Promise checklist** | One page: each promise in the plan, and the test or task that covers it. Checked when a level ends. Any swap gets a decision row | No |
| C7 | **Light paperwork** | `TASKS.md` rows stay under about 300 characters; the long histories move to the files they belong to; a short "Waiting for you" box sits at the very top, most useful first; logs split by month | No |
| C8 | **Blocked twice, step aside** | A task stopped twice by the same outside cause (a website saying "slow down") is skipped for 6 hours | No (proposed Nov 1, never recorded) |
| C9 | **Say when you're stuck** | One phone message when the robot runs out of work, listing what it needs from you | Softens "no ping for nothing to do" |
| C10 | **Sleep until the reset** | When the limit is used up, the launcher pauses its own alarm until the reset time (it was woken about 92 times for nothing) | No |

---

## Suggested order (new tasks; all wait for your OK)

| Order | Task | Why first | Needs |
|---|---|---|---|
| 1 | **T62 (yours):** look at GitHub's Billing page | Nothing can be built or shown to you until builds run | You, 5 minutes |
| 2 | **T67:** make the app answer the installer (B1), add the shortcut, tell you how to open it | Probably ends T57. Small change | Medium (Sonnet), Medium effort; a working Windows build to prove it |
| 3 | **T68:** put the Windows build on a diet and add the install test (B2, B3) | So the minutes last and installer bugs get caught | Medium (Sonnet), Medium effort |
| 4 | **T69:** close the three "lost progress" holes (B4, B5, B9) | Protects what you earn | Medium (Sonnet), Medium effort |
| 5 | **T47 with you in the chat:** check the 52 carrier facts using web search | It's your goal number 1. The robot alone only guessed page addresses and failed | Medium (Sonnet), Medium effort; you present |
| 6 | **T70:** tune the robot's rules (C1 to C5, C8 to C10) | So the next week doesn't repeat this one | Large (Opus), High effort; your choices first |
| 7 | **T71:** trim the paperwork (C7) and write the promise checklist (C6) | Makes every later chat cheaper | Medium (Sonnet), Medium effort |
| 8 | **T72 (yours):** five small product choices | Pass mark? Skip ahead? Badges? Daily reminder? Keep the simple review timing? | You |

## Questions for you
1. **How do you open the app each time?** By double-clicking the `Setup.exe` file, or from the Start menu or a desktop icon? (This settles T57.)
2. **The robot is back on** (it switched itself on again on Nov 9 at 20:38 UTC after your 1-hour pause, and it wakes at about half past every hour). It started nothing while this chat was open or while your limit was used up. Once this chat is merged it will pick up redesign idea I85 on Opus and carry on nonstop. Do you want to type `Pause the redesign` until the fixes above are in? My advice: yes.
3. **Did you change your Claude plan today around 19:35 UTC?** Chats started working again then. If so, the limits in the notes are out of date.
4. **Which of C1, C2, C3 and C9 do you want?** They each change something you chose before, so I won't apply them without your word.
5. **May the robot do T67, T68 and T69 by itself**, or do you want to read this first and say go? (They're marked "needs your OK" in `TASKS.md` for now.)

## Test run on `main` (5b9492c), in the cloud
- Type check: OK. Unit tests: 269 of 269. Content checker: OK (253 facts, 27 photos, 635 questions). Checker's own tests: 39 of 39.
- Click tests (`xvfb-run -a npx playwright test`): 131 of 131 passed in 18.1 minutes, on the first try.
- Windows: not run (GitHub gives the build no computer since Nov 5, T62).
