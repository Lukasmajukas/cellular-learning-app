# Handoff note: 2026-11-01, T33 time one lesson per unit

**Status:** DONE
**Model used:** Medium (Sonnet), Medium effort (robot run) · **Branch / pull request:** `claude/t33-timing`, #50

## In simple words (for the owner)
Your goal is that a lesson takes 3 to 5 minutes. A robot can't sit and play with a stopwatch, so I made a small calculator. It adds up how long it takes to read each card and think about each question, for a quick learner and a slow beginner, and uses the middle number. 11 of the 15 lessons land inside 3 to 5 minutes. 4 are a bit short (2.5 to 2.9 minutes). None is too long.

## What was done
- Added `content/tools/lesson_timing.py` (run: `python3 content/tools/lesson_timing.py`). It reads `content/lessons.json`.
- Result (middle estimate, minutes): unit 1: 2.5, 3.5, 2.9, 2.7, 4.6 · unit 2: 3.6, 2.8, 3.0, 3.6, 4.2 · unit 3: 3.7, 3.8, 3.3, 3.3, 3.8.
- Too short (under 3): unit01-l1, unit01-l3, unit01-l4, unit02-l2. They have 8 to 11 steps; the plan said 12 to 15.
- Nothing asked for approval or was blocked. Panel not republished (robot run).

## What's next
- Optional: add 2 to 4 steps to the 4 short lessons (new question IDs only; do not change locked IDs).
- Owner's real stopwatch on one lesson beats this model: say how long it really took.
- Remaining T33: carrier questions "After T47" once T47 is done.

## Decisions made (also added to docs/DECISIONS.md)
- None.

## Questions for the owner
- None.

## New words (also added to GLOSSARY.md)
- None.

## Notes for the next Claude
The model ignores animation time and counts a 10% (fast) or 30% (slow) miss rate with one retry. If the owner reports real times, tune the numbers at the top of the script.
