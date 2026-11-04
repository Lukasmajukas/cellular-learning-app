# Handoff note: 2026-11-04, T59 R04 motion kit and app frame

**Status:** DONE
**Model used:** Large (Opus), High effort (handed over by a Sonnet robot run) · **Branch / pull request:** claude/t59-r04-motion-kit, #127

## In simple words (for the owner)
The app now has a frame like a phone app: a bar at the top with your streak, XP and daily goal, and four tabs at the bottom (Path, Review, Heatmap, Settings). Screens glide sideways when you switch tabs, and a lesson rises up from the bottom when you open it. You can also play with the keyboard now: press 1, 2, 3 or 4 to pick an answer, Enter to go on, and Esc to leave a lesson. All the app's speeds now live in one file, like one volume knob for all the movement.

## What was done
- **The one speed file** (`app/src/theme/motion.tsx`, DESIGN.md section 7): the springs (snappy, bouncy, sheet, fill, tab), the timings (tap 0.15 s, feedback 0.25 s, screen change 0.12 s out + 0.30 s in, pop-ins 60 ms apart and all within 0.4 s, celebration 1.6 s at most, background loops 2.4 s, Reduce motion fade 0.15 s), the press sizes, `popInDelay()`, `screenGlide()`, `useCalm()` and `<MotionKit>` (Reduce motion in one place: it tells Motion and the confetti code). The springs moved here from `ui/tones.ts` and `ui/press.ts`; the path map, heatmap, lesson player and old mascot now take their speeds from it instead of typing their own.
- **The app frame** (`app/src/ui/AppShell.tsx`): a top bar that stays at the top while you scroll (streak, XP with today's XP, streak freezes, and the daily goal as a small bar with "1 of 2"), and the bottom tabs with icons (map pin, repeat, grid, gear). The tab you're on is signal blue with a short marker on top that glides from tab to tab. The Review tab shows a small purple count when reviews are due.
- **A Review tab** (`app/src/ReviewScreen.tsx`): how many questions are due and a "Start the review" button. The path's own Daily review button stays for now (R05/R13 decide).
- **Settings and Heatmap are tabs now**, so their back buttons are gone; the Path tab or Esc goes back.
- **Screens glide**: tabs slide 28 px sideways (towards the tab you picked) and fade; a lesson rises 56 px from below; the frame only fades (sliding it would carry the fixed tab bar). With Reduce motion: a quick fade only.
- **Keys** (`app/src/keys.ts`, PRD 4e): 1-9 press the answer tile with that number, Enter presses the screen's main button (Check, Continue, Got it, Back to the path), Esc leaves a lesson or goes back to the Path tab. Typing in the number box keeps its keys. A button you reached with Tab keeps its own Enter; one you clicked with the mouse doesn't (so Enter still means Check).
- **Pick-one and photo questions now use the numbered answer tiles** from R03 (`AnswerTile`), so the number keys are visible. The rest of the question screen is R09's job.
- **Small fixes found by looking**: a sideways scrollbar flashed while a tab slid in (now clipped); the lesson's progress bar shrank from full while the lesson rose (now starts in place); the first question no longer slides in sideways while the whole lesson rises; "Back to the path" can't count a lesson twice if pressed twice while the lesson glides away; the frame-rate badge moved to the top left so the tabs don't cover it.
- **Tests**: unit tests 140 pass (124 before + `motion.test.ts` 11 + `keys.test.ts` 5; `ui.test.ts` updated for AppShell and the missing back button). New guards: the speed file matches DESIGN.md; screens glide with transforms and see-through-ness only; Reduce motion = a fade of 150 ms at most; no other file types a spring or timing; only the speed file talks to Motion's Reduce motion setting. Click tests 24 pass (19 before + 5 new in `tests/frame.spec.ts`: the frame and Review tab; tab glide, tab marker and lesson rise measured at 60 fps with 8-16 in-between frames; Reduce motion = nothing slides; a whole lesson played with keys 1 and Enter, then Esc twice; learn card, number box and match question with keys). Old click tests now use the tabs instead of the back buttons. Content checker OK (253 facts, 27 photos, 635 questions; `content/` untouched). TypeScript OK.
- **Gallery**: all pictures redone; new `13-review` (narrow and wide).

## What I looked at (gallery, by eye)
Before: the R03 pictures in `gallery/latest/` (the path with two icon buttons top right, Settings with a back button). After: 01 path (narrow), 03 question, 04 feedback wrong, 08 settings wide, 09 path Day, 13 review; plus a 4-picture flip book of the tab glide and the lesson rise (in the session's scratch folder, not saved). Compared with look A: the bottom tabs, the top bar (flame, bolt, small goal bar "1 of 2") and the numbered tiles match it closely. The first top bar wrapped "120 XP" and "+30 today" onto two lines; it now shows "120 +30" on one line (the words "XP" and "today" are kept for screen readers and the hover tip).
**Still looks weak (later sessions' jobs):** the top bar is plain (R07 restyles it); the path map is unchanged inside the frame and its own Daily review button now repeats the Review tab (R05/R13); after switching tabs, the Path always opens at the top (R05 opens it at your current lesson); the lesson circles pop in again, with a slow bounce, every time you come back to the Path tab (idea I17).

## What's next
- Next task: T59, session R05 (Path map: layout). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- One speed file `app/src/theme/motion.tsx`; the app frame with four bottom tabs; Settings and Heatmap became tabs without back buttons; a Review tab; lessons fill the window without the frame; screen glides; keys 1-9 / Enter / Esc with the "focus by Tab vs by click" rule.

## Questions for the owner
- None. Optional: try the keys in a lesson (1-4, Enter, Esc) and say if they feel right.

## New words (also added to GLOSSARY.md)
- Tab bar, speed file, keyboard shortcut, flip book.

## Approvals and blocks
- Nothing asked for approval; nothing was blocked. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.

## Notes for the next Claude
- Speeds: import from `./theme/motion` (screens) or `../theme/motion` (blocks). `motion.test.ts` fails if a file other than the speed file types `stiffness`, `damping`, `bounce`, a number after `duration:` / `delay:`, a CSS `transition: '... 0.4s'`, or `whileTap={{` / `whileHover={{`. Use `usePress()` for presses.
- `usePress` puts `transition: SPRING.snappy` on the element. If the same element also pops in with a delay, the press's transition would replace it: put the pop-in on a wrapper (see `LessonNode` in `PathMap.tsx`).
- Never give an ancestor of a `position: fixed` thing (the tab bar, the bottom sheet) a transform animation: the fixed thing would move with it. That's why the frame only fades. The lesson screen rises with `y`, so a `BottomSheet` inside a lesson (R09) is fine only after the rise ends (Motion leaves `transform: none` then; check it).
- Keys: mark a screen's main button with `data-primary` and answer tiles with `data-pick={n}`; `pressFor()` clicks them. Inside a lesson the keys are off while it glides away (`useIsPresent`).
- **Windows build, first try failed** (then fixed): `blocks.spec.ts` measured the switch knob and the 44 px sizes while the Settings screen was still gliding in (a tab change now animates), so the knob seemed to move 7 px instead of 18 and a pill measured 43.999996 px. The test now waits until the screen stops (`openSettings()`: `transform` is `none` and opacity 1). Ran it 5 times and `frame.spec.ts` 3 times in the cloud: all pass. Any new test that measures something right after a tab change should wait the same way.
- Playwright only clicks things that stand still; the path's lesson circles bounce for about a second after the Path tab comes back. Wait about 1.5 s before clicking one in a test.
- Chromium turns `:focus-visible` on for a clicked button as soon as any key is pressed, so `keys.ts` tracks Tab/arrows vs pointer itself.
