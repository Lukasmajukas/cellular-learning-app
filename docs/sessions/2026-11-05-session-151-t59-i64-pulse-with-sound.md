# Handoff note: 2026-11-05, T59 idea I64 (pulse starts with the unlock sound)
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE
**Model used:** Large, High effort (Opus, handed over by a robot run) · **Branch:** claude/robot-i64

## In simple words (for the owner)
When you finish a lesson and a new one opens on the path, Beacon sends out a happy ring and you hear a rising "unlock" sound. Until now the sound started a tenth of a second before the ring, like a film where the voice runs a little ahead of the lips. Now both start in the very same instant, so seeing and hearing feel like one "new lesson is on air!" moment.

## What was done
- **Which one moved, and why:** the idea said "let the pulse start with the sound", but the pulse can't come earlier. Beacon stands inside the new lesson's circle, and that circle only starts popping in at 0.9 s, so at the sound's old start (0.85 s) Beacon isn't on screen yet. So the **sound now waits for the pulse**, at 0.95 s. Three things line up there:
  - Beacon's happy ring starts (as before);
  - the lock has only just begun to fly off (it speeds up as it goes, so at 0.95 s it has moved 12% of its way);
  - the sound's loudest part comes 60-80 ms into the file (measured from `unlock.ogg`), so you hear its peak at about 1.02 s, just as the new circle first reaches full size (the spring passes full size about 0.125 s after it starts).
  - The sound now ends at 1.33 s, still before the top bar's turn (1.6 s), so the streak sound doesn't overlap it.
- **The speed file** (`app/src/theme/motion.tsx`): a new shared beat, `ON_AIR_BEAT` = 0.95 s. `ON_AIR.beaconHappy` and a new `ON_AIR.unlockSound` both use it.
- **The path** (`app/src/PathMap.tsx`): plays the unlock sound at `ON_AIR.unlockSound` instead of `ON_AIR.lockOff.delay`. With Reduce motion it still plays at once (unchanged).
- **The sound log** (`app/src/sound.ts`): each sound it starts now also notes *when*, on the page's own clock (`at`, in ms, the same clock the film tool uses). Nothing you hear changed; it only lets a test line sounds up with filmed frames.
- **Tests:**
  - `app/src/motion.test.ts` (+1): the sound and the pulse share one beat; it comes after Beacon pops in, while the lock is in the first half of its flight; the sound is over before the top bar's turn; `PathMap.tsx` plays it at that beat.
  - `app/tests/sound.spec.ts` (+1, 1 changed): a new click test films Beacon's pulse on the path after a lesson and checks it starts within 40 ms of the unlock sound's planned start, at 50+ fps. The lesson test now expects the unlock sound at 0.95 s (it said 0.85).
- **Docs:** `DESIGN.md` (Beacon on the path, and the `unlock` row of the sounds table), `IDEAS.md` (I64 ✅, new I90, I91), `TASKS.md` (the T59 row), `DECISIONS.md`, `PROGRESS-LOG.md`, the panel.

## Test results
- Unit tests: 269 pass (1 new). TypeScript and the build: OK.
- Content checker: OK (253 facts, 27 photos, 635 questions). Nothing in `content/` changed.
- Click tests (cloud, `xvfb-run -a npx playwright test`): **129 of 129 pass** (17.2 min), the speed tests included.
- The new test: the pulse's first frame came **5 ms after** the sound's start; pulse peak 0.88; 60.0 fps.
- **It bites:** the same test with the old timing put back (sound at `lockOff.delay`) fails: the pulse came **104 ms after** the sound.
- Windows build on GitHub (run 42091884365): **failed in 4 seconds with no log**: the job never got a computer, the same as every run since 09:17 UTC (T62). Not caused by this change.
- Panel not republished (robot run).

## What I looked at (by eye)
- Nothing on screen changed: only the moment the sound starts moved. No drawing, colour, size or animation timing was touched, so the gallery (`docs/redesign/gallery/latest/`) was left as it is; new pictures would be the same as the old ones.
- I listened to the sound "by numbers": its loudness every 20 ms (with ffmpeg). It has a small click at the very start, its loudest burst at 60-80 ms, then two smaller ones at 120-140 ms and 200 ms, and it fades out by 360 ms.
- **Still weak (new ideas):** I90: the sound log's new clock could check the app's other sound-and-sight pairs the same way (lesson complete's burst, the streak flicker, Settings' sample). I91: sound on a Windows PC comes out a little late; when I87 measures that, check the unlock sound too and start it earlier by that much if the gap is over about 40 ms.
- An idea I dropped: letting the sound wait for the screen's fade-in with Reduce motion on. With Reduce motion the path fades in within 0.15 s, so the sound's loud part already lands while it shows.

## What's next
- Next task: T59, **design review 4** (the 8th idea chat after R24: score every screen again, fix small problems, re-order `docs/redesign/IDEAS.md`). Large (Opus), High effort. Type `Do the next task in TASKS.md`.

## Decisions made (also added to docs/DECISIONS.md)
- On the path, the unlock sound starts with Beacon's happy ring pulse at one shared "on air" beat, 0.95 s after the path appears (`ON_AIR.unlockSound` = `beaconHappy`). Before, it started with the lock at 0.85 s.

## Questions for the owner
- None new. T62 (the Windows build on GitHub) and T57 (the green start-up picture) are still open.
- Nothing asked for approval or was blocked during this chat.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
- `window.__sounds.played[i].at` is the sound's planned start on `performance.now()`'s clock (ms). It doesn't include the speakers' own delay, which a test can't hear.
- The path Beacon's pulse waits for a timer (`setTimeout`) and a repaint, so it lands a frame or so after its exact time; the sound is scheduled to the sample. 40 ms is the test's "together".
