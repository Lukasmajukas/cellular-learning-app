// The daily review ("drive test"): plays the questions the memory schedule says are due, oldest first.
// About 20 questions is roughly 10 minutes, so that is the cap.
import { dueIds, type Reviews } from './fsrs';
import { isScored, type Item } from './questions';
import { allLessons, type Lesson, type Unit } from './path';

export const REVIEW_ID = 'daily-review';
export const REVIEW_CAP = 20;

// How many scored questions are due right now (only ones that still exist in the lessons).
export function dueCount(units: Unit[], reviews: Reviews, now: number): number {
  return pickDue(units, reviews, now).length;
}

function pickDue(units: Unit[], reviews: Reviews, now: number): Item[] {
  const byId = new Map<string, Item>();
  for (const l of allLessons(units)) for (const q of l.questions) if (isScored(q) && !byId.has(q.id)) byId.set(q.id, q);
  return dueIds(reviews, now).flatMap(id => (byId.has(id) ? [byId.get(id)!] : []));
}

// A pretend lesson made of the due questions (at most REVIEW_CAP). Returns null when nothing is due.
export function buildReview(units: Unit[], reviews: Reviews, now: number): Lesson | null {
  const qs = pickDue(units, reviews, now).slice(0, REVIEW_CAP);
  return qs.length ? { id: REVIEW_ID, title: 'Daily review', questions: qs } : null;
}
