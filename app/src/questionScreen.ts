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

// A short "how to answer" line under the question (R10), for the types that aren't just "tap an answer".
// Plain help with the controls only: no facts (those live in the lesson files).
export const KIND_HINT: Partial<Record<Item['kind'], string>> = {
  number: 'Type the number. Commas are fine.',
  match: 'Tap one on the left, then its partner.',
  order: 'Tap them in order. Tap one again to undo.',
  scenario: 'Pick one answer for every clue.',
  'tap-clue': 'Tap the picture where you see it.',
};

// The quiet button in the "Right!" / "Not quite" sheet that opens the longer explanation (R10, idea I38).
// Only these two types have one: the rest fit in the sheet as they are.
export const FOLD_LABEL: Partial<Record<Item['kind'], string>> = {
  order: 'Show them on the ruler',
  scenario: 'Clue by clue',
};

// "Question 5 of 12" (R11, idea I37): `ids` is the lesson's queue (a missed question is in it twice: it comes back
// once later on), `index` the one on screen now. Only first-time questions count, so the total never grows after a
// miss (that felt like a penalty). When a missed one comes back, `comeback` is true and the number stays where it was.
export function questionCount(ids: string[], index: number) {
  const total = new Set(ids).size;
  const n = Math.min(new Set(ids.slice(0, index + 1)).size, total);
  const comeback = index < ids.length && ids.indexOf(ids[index]) < index;
  return { n, total, comeback, text: `${n} / ${total}` };
}

// Beacon's lines. 8 words or fewer, plain and kind, never guilt (DESIGN.md section 8, PRD 4d).
// No facts here: the facts live in the lesson files. Change the words here, nowhere else.
export const BEACON_LINES = {
  // Question screen (R09; R18 added comeback, fixed and streak).
  ask: ['Take your time.', 'You can do this one.', 'Read it once more, then pick.', 'Trust your first idea.', 'Let’s tune in to this one.'],
  learn: ['Something new for you.', 'Have a read first.', 'A new piece of the puzzle.'],
  right: ['Nice, that’s it!', 'Spot on!', 'Yes! Signal locked.', 'You got it.', 'Clear signal!'],
  wrong: ['Close! Have a look below.', 'Almost. The answer is below.', 'Tricky one. See below.', 'No worries, this one is tricky.'],
  comeback: ['This one again. You’ve got it now.', 'Back for another try. Easy does it.', 'You’ve seen this one. Take a look.'],
  fixed: ['Fixed it! That one’s yours now.', 'Got it this time. Nice!', 'See? You had it.'],
  streak: ['You’re on a roll!', 'Another one! Keep going.', 'Strong signal. Keep it up!'],
  // Lesson complete (R18), by how many stars you earned, and when you fixed a missed one on its comeback.
  perfect: ['Perfect signal! Every one right.', 'Full bars! Brilliant work.', 'Not one missed. Wow!'],
  strong: ['Strong signal. Nicely done!', 'Great work on that one.', 'Most of them first time. Nice!'],
  done: ['You finished it. That counts!', 'Every lesson makes the signal stronger.', 'Done! It sticks better each time.'],
  fixedAll: ['You fixed the tricky ones!', 'Missed, then fixed. That’s learning!', 'You came back and got it!'],
} as const;
export type Moment = keyof typeof BEACON_LINES;

// Picks one line for a moment. The same question always gets the same line (no flicker when the screen redraws),
// but different questions get different ones.
export function beaconLine(moment: Moment, seed: string): string {
  let h = 7; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const lines = BEACON_LINES[moment];
  return lines[h % lines.length];
}

// When Beacon speaks on the question screen (R18, idea I39). A line before every question became background noise,
// so it speaks only: before the first question, right after each answer, and when a missed question comes back.
// The rest of the time the bubble is gone (Beacon's spot keeps its height, so nothing jumps).
// - `answered`: what just happened, if you've answered the question on screen (null before you answer);
// - `inRow`: right answers in a row, counting this one: every 3rd says "on a roll" instead of a plain "right";
// - `comeback`: the question on screen is a missed one, back for a second try (a right answer then is "fixed").
export function beaconMoment({ index, kind, answered, inRow, comeback }:
  { index: number; kind: Item['kind']; answered: boolean | null; inRow: number; comeback: boolean }): Moment | null {
  if (answered === false) return 'wrong';
  if (answered === true) return comeback ? 'fixed' : inRow > 0 && inRow % 3 === 0 ? 'streak' : 'right';
  if (comeback) return 'comeback';
  if (index === 0) return kind === 'learn' ? 'learn' : 'ask';
  return null;
}

// What Beacon says on the lesson-complete screen (R18): fixing a missed one on its comeback is worth a word of its own
// (unless every one was right the first time); otherwise the line goes with the stars.
export function completeMoment(stars: number, fixed: number): Moment {
  if (stars >= 3) return 'perfect';
  if (fixed > 0) return 'fixedAll';
  return stars === 2 ? 'strong' : 'done';
}
