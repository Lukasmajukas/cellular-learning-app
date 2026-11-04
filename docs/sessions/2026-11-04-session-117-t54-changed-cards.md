# Handoff note: 2026-11-04, T54 "This changed" cards
<!-- File name: docs/sessions/YYYY-MM-DD-session-N-short-name.md (N = the highest session number so far + 1) -->

**Status:** DONE
**Model used:** Medium, Medium effort · **Branch / pull request:** robot/run-2026-11-04-t54-changed-cards

## In simple words (for the owner)
When a carrier fact really changes (say a spectrum sale closes), the app now shows a blue card once, saying what changed. When you press "Got it", the questions about that fact come back for review. Nothing has changed yet, so you will not see a card today.

## What was done
- `content/changes.json` (empty list) + `app/src/changes.ts` (pending, acknowledge, first-start baseline); `seenChanges` added to the save file (`storage.ts`, `electron/store.cjs`); card in `main.tsx`.
- Checker: `check_changes` in `check_content.py` (id, date, title, text, source; listed questions must exist) + test. 5 new app tests (101 pass); all 14 click tests pass.
- The card screen itself has no click test (the list is empty, so nothing to show); only the logic is unit-tested.
- Panel updated and rebuilt, not republished (robot run).

## What's next
- T54 only has the final-exam badge left (needs the owner's yes). Then T10 (Later). Medium (Sonnet), Medium effort, `Go`.

## Decisions made (also added to docs/DECISIONS.md)
- Hand-written changes list; existing entries are old news on first start.

## Questions for the owner
- Final-exam badge: yes or no? (suggestion: yes)

## New words (also added to GLOSSARY.md)
- "This changed" card

## Notes for the next Claude
Nothing asked for approval or was blocked. Panel not republished (robot run). A save made before this change has `seenChanges: null`, so entries present at its first start are silently marked seen; add new entries only after shipping.
