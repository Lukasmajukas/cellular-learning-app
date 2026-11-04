// The question screen's words (redesign R09, look A): the small label above each question ("PICK ONE"),
// the counter beside the progress bar ("5 / 12"), and what Beacon says in its speech bubble.
// Plain data and logic, so a unit test (src/questionScreen.test.ts) can check every line.
// R18 adds Beacon's lines for the path map and the lesson-complete screen to this same file.
import type { Item } from './questions';

// The label above the question: tells you what kind of answer it wants, in a few capital letters.
export const KIND_LABEL: Record<Item['kind'], string> = {
  choice: 'Pick one',
  'photo-choice': 'Pick one',
  number: 'Type the number',
  match: 'Match the pairs',
  order: 'Put them in order',
  scenario: 'Read the clues',
  'tap-clue': 'Tap the picture',
  learn: 'Something new',
};

// "Question 5 of 12": the one on screen now (counting from 1), and how many there are in this run.
// A missed question comes back once later on, so the total can grow by one after a miss.
export const counter = (index: number, length: number) => `${Math.min(index + 1, length)} / ${length}`;

// Beacon's lines. 8 words or fewer, plain and kind, never guilt (DESIGN.md section 8, PRD 4d).
// No facts here: the facts live in the lesson files. Change the words here, nowhere else.
export const BEACON_LINES = {
  ask: ['Take your time.', 'You can do this one.', 'Read it once more, then pick.', 'Trust your first idea.', 'Let’s tune in to this one.'],
  learn: ['Something new for you.', 'Have a read first.', 'A new piece of the puzzle.'],
  right: ['Nice, that’s it!', 'Spot on!', 'Yes! Signal locked.', 'You got it.', 'Clear signal!'],
  wrong: ['Close! Have a look below.', 'Almost. The answer is below.', 'Tricky one. See below.', 'No worries, this one is tricky.'],
} as const;
export type Moment = keyof typeof BEACON_LINES;

// Picks one line for a moment. The same question always gets the same line (no flicker when the screen redraws),
// but different questions get different ones.
export function beaconLine(moment: Moment, seed: string): string {
  let h = 7; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const lines = BEACON_LINES[moment];
  return lines[h % lines.length];
}
