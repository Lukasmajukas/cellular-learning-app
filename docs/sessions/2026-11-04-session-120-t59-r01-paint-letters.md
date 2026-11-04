# Handoff note: 2026-11-04, T59 redesign, R01 Paint and letters

**Status:** DONE
**Model used:** Large (Opus), High effort (handed over by a Sonnet robot run; the first Opus chat stopped on the weekly limit, this chat took over in 🟡) · **Branch / pull request:** claude/robot-t59-r01, #124

## In simple words (for the owner)
The app now wears its new "Night Signal" kit: a dark night background with a soft glow in the middle, bright cyan for "go", green for "right", soft red for "not quite", gold for streaks and stars, purple for reviews. The letters are new too (Space Grotesk, and a "code" style font for numbers like 120 XP). Duolingo's colours are gone, and a test now fails if one ever comes back. There is also a picture tool: every screen photographed, in `docs/redesign/gallery/latest/`.

## What was done
- **One colour file** (`app/src/theme/tokens.ts`): every colour for Night (the default) and an early Day look, as CSS variables. Screens use `c.signal`, `c.surface` and so on (`app/src/theme/index.ts`). All 8 screen files switched over; none types a colour code any more.
- **Fonts bundled inside the app** (npm `@fontsource/space-grotesk` 400/500/700 and `@fontsource/jetbrains-mono` 500/700, Latin only), with their OFL licences copied to `app/public/licenses/`. No internet needed.
- **Night background glow** (`app/src/theme/theme.css`): a still radial glow behind the content column, plus dark scrollbars. The Electron window's own background is now the Night colour too, so it never flashes white while starting.
- **Settings:** `theme: light/dark` became `look: night/day` (save file `electron/store.cjs` and `src/storage.ts`). Everyone starts on Night. The ⚙️ switch is now "Day look (light; an early test, finished later)", test id `set-day`.
- **Heatmap colours** now come from the tokens (red → gold → green blend with `color-mix`); new tiles are dim outlines. Confetti uses the token colours.
- **Gallery tool:** `npm run gallery` in `app/` (`app/tools/gallery.mjs`). It builds, starts the real app with a made-up save, and saves 9 screens × 2 sizes (620 × 960 and 1280 × 800) as WebP into `docs/redesign/gallery/latest/` (about 350 KB). It restarts itself inside `xvfb-run` on Linux with no screen.
- **New tests:** `src/theme.test.ts` (no Duolingo colours anywhere; no colour codes in `.tsx` files; every `var(--x)` is a real token; contrast for 39 colour pairs in both Night and Day) and `tests/theme.spec.ts` (Night is the default, both fonts load, no font comes from the internet, the glow is there).
- **Checks:** unit tests 108 pass; click tests 15 pass (the old 14 + the new one); content checker OK (253 facts, 27 photos, 635 questions; `content/` untouched); TypeScript OK. The Windows build on GitHub runs on the pull request (see below).

## What I looked at (gallery, by eye)
Opened 01 path map, 03 question, 04 wrong answer, 05 right answer, 06 lesson complete, 07 heatmap, 08 settings, 09 path map in Day (wide). Compared with `looks/look-a-night-signal.webp`: background colour and glow, fonts, the answer-tile colours (green right, red wrong) and the mono numbers all match. The first pictures showed **no glow**; the cause was a typo in a CSS variable name (`--glow1` instead of `--glow-1`), so I fixed it and added a test that catches unknown variable names.
**Still looks weak (later sessions' jobs):** emoji in buttons and the path circles (R02), plain grey checkboxes (R03, idea I08), the old triangle mascot (R17), the path map layout (R05), the heatmap's "Grey =" text (I09). The wrong-answer picture has some confetti left over from the right answer before it.

## What's next
- Next task: T59, session R02 (our own icons). Large (Opus), High effort. The robot picks it up by itself.

## Decisions made (also added to docs/DECISIONS.md)
- `theme` → `look` (night/day); everyone starts on Night.
- Five Day starting colours made darker to pass the contrast test (noted in DESIGN.md too).
- Colours are CSS variables from one token file; a test blocks colour codes in screen files.

## Questions for the owner
- None. Optional: look at the pictures in `docs/redesign/gallery/latest/` (they open in the GitHub app) and tell any chat what you think.

## New words (also added to GLOSSARY.md)
- CSS variable, WebP.

## Approvals and blocks
- Nothing asked for approval; nothing was blocked. Panel not republished (robot run): `panel/live.json` updated and `panel/index.html` rebuilt.
- The first Electron download failed once (network); `node node_modules/electron/install.js` fixed it.

## Notes for the next Claude
- Use `c.<token>` from `./theme` for every colour; `mono` for numbers. Add new colours to `tokens.ts` (both looks) and to the contrast pairs in `src/theme.test.ts` if they carry text.
- Token names become CSS variables with dashes: `glow1` → `--glow-1`, `borderStrong` → `--border-strong` (`cssVar()`).
- Canvas things (confetti) need real colour codes: read them with `getComputedStyle(document.documentElement).getPropertyValue('--signal')`.
- Gallery: `cd app && npm run gallery` (or `node tools/gallery.mjs` after a build). It needs the real lesson IDs `unit01-l4` etc. and test ids `quit`, `open-heatmap`, `heatmap-back`, `open-settings`, `set-day`, `settings-back`; update it if a session renames those. New screens should be added to it.
- R02's "no emoji in screens" test can sit next to the colour tests in `src/theme.test.ts`. Tests still look for emoji text such as `🔥 1` (`tests/save.spec.ts`), so R02 must update them.
