# Handoff note: 2026-11-04, T59 redesign R05 (path map: layout)

**Status:** DONE
**Model used:** Large (Opus), High effort (handed over by a Sonnet robot run) · **Branch / pull request:** claude/robot-t59-r05-path-map, #128

## In simple words (for the owner)
The path map now looks like the Night Signal picture you chose. Each unit starts with a banner: a small "UNIT 1", the unit's name, and how many of its lessons you've done ("3 / 5"). The lesson circles zig-zag left and right down the screen, with each lesson's name beside its circle, and a dotted "signal line" joins them. Finished lessons are green towers with a little tick and their stars. Your next lesson is the big glowing blue tower with two rings and the words "Up next". Locked lessons are small dashed circles with a lock. The path now opens right at your next lesson (with its unit's banner when both fit on screen), also after you finish a lesson or come back from another tab. The bar at the top is no longer see-through, so words don't show through it when you scroll.

## What was done
- **Layout helpers** (`app/src/path.ts`): `sideOf(i)` (left, right, left...), `focusLessonId()` (the current lesson, or the last one when all are done) and `unitStatus()` (done / open / locked). Unit tests: 3 new in `path.test.ts`.
- **Two new building blocks** (DESIGN.md section 6): `app/src/ui/UnitBanner.tsx` (bar colour signal / on-air / dim, "Unit N", a check and the word "done" for a finished unit, "2 / 5" in the code font) and `app/src/ui/LessonNode.tsx` (done 64 px green tower + check badge; current 80 px signal-blue tower with two still rings and a glow layer; locked 56 px dashed with a lock; the pop-in and press springs as before). `ui.test.ts` now expects them in the block list.
- **The path map** (`app/src/PathMap.tsx`), rebuilt: a header row ("Your path" and "3 of 49 lessons done"), the Daily review as a quiet card with a purple "8 due" pill (look A), then for each unit its banner and its lessons in rows of 112 px. Circles sit at 27% and 71% of the column. Names sit beside the circle on the open side (bold with "Up next" for the current one; dim when locked); stars under a finished name (filled ones earned, outlines for the rest). The dotted line is one SVG piece per pair of lessons (`line-to-<id>`, `data-reached`): an S-curve that leaves straight down and drops into the next circle, so it stays clear of the names. Bright signal (60%) up to the current lesson, the dim locked colour after it. Each piece is its own `<path>`, ready for R06 to draw it in.
- **Opens at your current lesson**: before the first paint, the path jumps so the current lesson sits a bit above the middle of the visible part, or lower if that lets its unit's banner show too. This happens every time the path appears (start, after a lesson, after another tab). `main.tsx`'s "back to the top" reset after a screen change now skips the path: Motion calls it *after* the new screen appears, so it was undoing the path's scroll (found with a probe script; first gallery pass showed the Day picture at the top).
- **Top bar solid** (`app/src/ui/AppShell.tsx`): `c.bg` instead of 90% see-through; the scrolled path showed a ghost of the review card behind it.
- **Click tests**: new `tests/pathmap.spec.ts`, 8 tests: unit banners (text, counts, done / open / locked); zig-zag (sides alternate, more than 120 px apart, rows 112 px, names level with and beside their circles); the three looks (size, icon, solid / dashed, check badge, 2 rings + glow only on the current one, "Up next", 3 stars with 2 filled); the dotted line (pieces per unit, round dots `0 10`, from circle middle to circle middle, dim colour towards locked); opens at the current lesson far down the real path (scrollY > 500, lesson and banner on screen), and again after Settings → Path; after finishing a lesson in a short window it opens at the next one; a 360 px narrow window (no sideways scroll, names whole and beside their circles); the review card.
- **Checks**: unit tests 143 pass (140 + 3). Click tests 32 pass (24 + 8), run twice in full; `pathmap.spec.ts` and `frame.spec.ts` repeated twice more. TypeScript OK. Content checker OK (253 facts, 27 photos, 635 questions; `content/` untouched). No colour codes, no emoji, no hand-typed speeds (the guards pass).
- **Gallery**: all pictures redone (`npm run gallery`). 01 and 09 (path) changed the most; others only changed by the solid top bar.

## What I looked at (gallery, by eye)
Before: R04's `01-path-map` (circles in a narrow left/right wobble with the names *under* them, centred unit titles, a big purple review button). After: `01-path-map` (narrow and wide) and `09-path-map-day` (narrow and wide), plus `13-review` to check the solid top bar. Compared with look A: the banner (bar, "UNIT 1", title), the zig-zag with names beside, the green done towers with stars, the big current tower with rings and the dotted line match it closely. Fixed while looking: the current lesson's name started under its rings (now it starts beside the inner ring); the review card showed through the top bar (now solid); returning to the Path tab landed at the top (now at the current lesson). The Day look works too (teal current tower, green done towers, pale dashed locked ones).
No new animation this session (the jump to your lesson is instant, on purpose), so no frame-rate or flip-book check was needed; the pop-ins are R04's, unchanged.
**Still looks weak (later sessions' jobs):** nothing moves yet on the map: the rings are still, the line doesn't draw, finishing a lesson just swaps the look (R06). The circles still pop in again, slowly, every time you come back to the Path tab (I17, R06). The Daily review card and the "Your path" header sit above the fold, so when the path opens scrolled you don't see them (the Review tab has the count, so it's fine; R13 decides). The checkpoint lessons look like any other lesson (idea I21). The top bar is still plain (R07).

## What's next
- Next task: T59, session R06 (Path map: movement). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- The path map's layout (rows, zig-zag, names beside, dotted S-curve line, the three looks) and the two new blocks.
- The path opens at the current lesson every time it appears, with its unit banner when it fits; the scroll reset skips the path.
- The top bar is solid now (reason: the scrolled path showed through it).
- The path keeps its own Daily review card (look A), next to the Review tab.

## Questions for the owner
- None. Optional: open the newest build and say whether the path feels right (circle sizes, the line, where it opens).

## New words (also added to GLOSSARY.md)
- Unit banner, zig-zag path.

## Approvals and blocks
- Nothing asked for approval; nothing was blocked. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.

## Notes for the next Claude
- **R06 hooks:** each line piece is `<path data-testid="line-to-<lessonId>" data-reached>` inside `<svg data-testid="line-<unitId>">`: animate `pathLength` on those. The current lesson's rings are `[data-testid=lesson-ring]` (two, opacity 0.38 / 0.18) and the glow `[data-testid=lesson-glow]`, all inside the `LessonNode` pop-in wrapper (siblings of the button, so the press doesn't scale them). Breathing them = the "ambient" loop in the speed file (`LOOP`), at most 2 loops on screen, paused when the window is hidden, off with Reduce motion.
- **Scroll:** the path scrolls itself in a `useLayoutEffect` in `PathMap` (on mount only). `main.tsx`'s `toTop()` resets the scroll after a screen change except when the path is showing. If you add "remember my place" (I19), do it there.
- The rows are `position: absolute` inside a box of `lessons × 112 px`; the line needs the box's pixel width, measured with a `ResizeObserver` (so the curve follows window resizes).
- Lesson rows have `data-side` (left / right) and names have `data-testid="name-<id>"`; tests use them.
- Playwright still waits for the circles to stop popping in: wait about 1.5 s before measuring or clicking them after the path appears.
