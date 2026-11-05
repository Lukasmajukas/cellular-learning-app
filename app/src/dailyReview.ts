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

// What the Review tab ("drive test", redesign R13) shows: what's due now, what comes due soon, and when the next one is.
// Only questions that still exist in the lessons count (like dueCount).
const HOUR = 3_600_000, DAY = 24 * HOUR;
export type Outlook = {
  due: number;          // due right now (all of them, even past the cap)
  today: number;        // how many today's review plays (at most REVIEW_CAP)
  minutes: number;      // about how long that takes (about 30 s a question; 20 questions = 10 minutes)
  late: number[];       // for each question today's review plays, oldest first: how many days it has waited since it came due
  next24: number;       // not due yet, but due within the next 24 hours
  next7: number;        // ... within the next 7 days (includes next24)
  nextDue: number | null; // when the next one that isn't due yet comes due (null = none scheduled)
  known: number;        // questions with a review timer at all (0 = you haven't finished a lesson yet)
};
export function reviewOutlook(units: Unit[], reviews: Reviews, now: number): Outlook {
  const ids = new Set<string>();
  for (const l of allLessons(units)) for (const q of l.questions) if (isScored(q)) ids.add(q.id);
  const cards = Object.entries(reviews).filter(([id]) => ids.has(id)).map(([, c]) => c);
  const waiting = cards.filter(c => c.due <= now).sort((a, b) => a.due - b.due);
  const later = cards.filter(c => c.due > now).map(c => c.due);
  const today = Math.min(waiting.length, REVIEW_CAP);
  return {
    due: waiting.length, today, minutes: today ? Math.max(1, Math.round(today / 2)) : 0,
    late: waiting.slice(0, REVIEW_CAP).map(c => (now - c.due) / DAY),
    next24: later.filter(d => d <= now + DAY).length, next7: later.filter(d => d <= now + 7 * DAY).length,
    nextDue: later.length ? Math.min(...later) : null, known: cards.length,
  };
}

// "in 5 hours", "tomorrow", "in 3 days": when the next question comes due, in plain words.
export function whenNext(at: number, now: number): string {
  const ms = at - now;
  if (ms < HOUR) return 'within the hour';
  if (ms < 20 * HOUR) { const h = Math.round(ms / HOUR); return `in ${h} ${h === 1 ? 'hour' : 'hours'}`; }
  const days = Math.max(1, Math.round(ms / DAY));
  return days === 1 ? 'tomorrow' : `in ${days} days`;
}
