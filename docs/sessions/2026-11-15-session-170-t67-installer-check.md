# Handoff note: 2026-11-15, T67 (the app answers the installer): is it ready to test on Windows?

**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort, chat started by the owner (typed `T67`) · **Branch / pull request:** claude/vigilant-johnson-dy2lrb, pull request #175

## In simple words (for the owner)
T67's code was finished on Nov 10, but nobody could see it work because the Windows build was stopped. Now the build runs again. I checked that the newest installer on the Releases page is made from a version that contains the fix, and that every step of the Windows build passed. I fixed the task list, which still said the build was stopped. The real road test is yours: install it and answer three questions (in `TASKS.md`, row T67). I can't watch a real Windows install from the cloud.

## What was done
- Start-up check: `main` at c7294d8, no open pull requests, light 🟢.
- Verified (read-only): run 241 ("App build (Windows)", manual run on `main`, commit `d3a92d0`, finished 02:17 UTC) concluded success. Every step passed: `npm ci`, `npm test`, `npm run e2e` (about 17 minutes), `npm run make`, "Publish the installer on the Releases page". The Releases page's `latest-build` holds `Cell.Learning-0.1.0.Setup.exe` (about 159 MB, uploaded 02:17 UTC). T67's commit `139177a` (#165) is an ancestor of `d3a92d0` (`git merge-base --is-ancestor`), so the installer contains the fix.
- `npm test` is `vitest run` with `include: ['src/**/*.test.ts']`, so T67's `src/installerSignals.test.ts` ran on Windows too. Not run again here: `app/node_modules` isn't installed in this chat, and the CI run is the same code on the real operating system.
- `TASKS.md`: T62 moved to Done (its own rule: tick it when the run ends and the installer is on the Releases page; both checked). T67's row rewritten: installer ready, three questions, how to get past the blue "Windows protected your PC" box. T57's pointer to T67 updated. `docs/PROGRESS-LOG.md`, `panel/live.json` and `panel/index.html` updated.
- Not verified, and said so to the owner: how the installer behaves on a real Windows PC (icons, the green picture, the app opening itself). The release shows `download_count` 1 for the file, so someone may have downloaded it already; nobody has reported back.
- Chat tidy-up: the recent chats were already archived, so none put away. Nothing asked for approval; nothing was blocked.
## What's next
- Owner: install the newest `Setup.exe`, answer T67's three questions and T57's "how do you open the app?". If the icon is missing or the green picture stays, T67 reopens as a Claude task (look at `app/electron/squirrel.cjs`; the `--squirrel-install` path asks `Update.exe` for `--createShortcut=<exe name>`).
- Next Claude task (owner's choice): T68 (cheaper Windows builds and a real install test, which would prove T67 by itself) or T69 (three "lost progress" holes). Medium (Sonnet), Medium effort. Type `Do task T68`.

## Decisions made (also added to docs/DECISIONS.md)
- None.

## Questions for the owner
- T67's three questions (icon in the Start menu and on the desktop? does the green picture go away within a few seconds? does the app open by itself at the end?); T57's "how do you open the app each time?"; the earlier open ones (T72, T60).

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
Files touched: `TASKS.md`, `docs/PROGRESS-LOG.md`, `panel/live.json`, `panel/index.html`, and this note. I stated the T67 unit-test count nowhere on purpose: earlier notes say 15, I counted 13 plain `it(` lines in `src/installerSignals.test.ts` (an `it.each` may account for the rest) and could not run it here. If the owner reports a problem, `docs/reviews/2026-11-09-look-back-review.md` item B1 is the background.
