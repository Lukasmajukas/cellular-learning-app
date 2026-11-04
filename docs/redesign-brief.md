# Redesign brief (starting point for the planning chat, task T58)

**Status: DRAFT.** Written 2026-11-04 from the owner's words in chat. Nothing here is signed off. The planning chat should revise it with the owner first.

## In simple words
The app works, but the owner wants it to *feel* finished: motion everywhere, a real look, a "fully made app". The owner wants this done slowly and well, over weeks, in 20 or more careful Opus sessions, and does not want it rushed.

## The owner's words (2026-11-04, spelling tidied)
- "The whole interface needs animation."
- Asked which animations (screens sliding in, lesson circles popping in, counters and bars filling, a mascot that reacts): "almost all".
- "Plan over 20+ Opus sessions of graphic redesign. This should've not been done till months. We need it to take weeks at least to get good results. We can't rush it. I want a full made app."
- Measured on the owner's PC with the test build: the frame rate stays at 60, so speed is fine; this is about look and movement.

## What exists today (so the plan starts from facts)
- Path map with lesson circles that fade in; daily review button; streak, XP and signal bars; a band memory heatmap; a settings screen with sound, reduce motion and a frame-rate counter.
- A small tower mascot (T05, fixed in T45) and confetti when a lesson ends (T46; the owner did not see the confetti on their PC, see T57).
- Drawings made by Claude as SVG, copyright-free photos with credits. Windows first; a Mac version and an iPhone later.

## Constraints already decided (see `CLAUDE.md` and `docs/DECISIONS.md`)
- The owner has no coding background: plain words, glossary entries for new terms.
- No AI-generated photos for identification questions. Pictures are copyright-free with credits, or drawn by Claude.
- Facts come only from the bands file; the redesign changes looks, not facts.
- The ⚙️ reduce-motion switch must keep working (decided in T46). Every session ends with the real app tested and a pull request merged.

## Open questions for the owner (the planning chat should ask these first)
1. **Pace:** how many sessions a week? (20+ sessions over 6 to 8 weeks is about 3 a week.)
2. **Look:** which apps or games do you like the look of? What should it *feel* like (playful, calm, techy)? Dark mode a must?
3. **Mascot and sound:** keep the tower mascot and grow it, or start again? Music, sound effects, both?
4. **Mac and iPhone later:** design now so it carries over, or Windows only for now?
5. **Robot:** should the hourly robot stop changing how the app looks until the plan is signed off? (Recommended: yes. Three UI pull requests, T53 and T54 twice, were merged by it on Nov 4 alone.)

## Risks the planning chat must handle
- **Usage limit.** Recent long Opus chats in this project each used roughly 6 to 8 dollars' worth of usage (the chat records show it). 20+ of them is heavy next to a weekly limit that is already at its warning. Plan the pace, and decide whether the robot keeps running meanwhile.
- **Art.** Claude can design a style guide, draw SVG shapes and write the motion code. Claude cannot paint like a professional illustrator. The plan must say which art Claude draws, which needs outside assets (with licences), and which the owner wants to commission or pick.
- **Testing on the real PC.** Claude tests the app in the cloud, which has no real graphics chip. Some problems (like the start-up picture, T57) only show on the owner's PC. Build owner checks into the plan: a short test after each few sessions.
- **PRD change.** `docs/PRD.md` Level 5 "Polish" is small. This program replaces it, so the PRD needs an update and the owner's sign-off before the first build session.

## What the planning chat should produce (no app code)
1. A design direction: look, colours, type, mascot, motion rules, sounds.
2. A session-by-session roadmap: 20+ sessions in order, each small enough to finish and check, with a model and effort for each.
3. How each session is checked (screenshots in the real app, frame rate, owner check).
4. The PRD changes, written as a draft for the owner to sign off.
