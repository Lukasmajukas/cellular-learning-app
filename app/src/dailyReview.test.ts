import { describe, it, expect } from 'vitest';
import { buildReview, dueCount, reviewOutlook, whenNext, REVIEW_CAP, REVIEW_ID } from './dailyReview';
import { backupWhen } from './storage';
import { finishReview } from './finish';
import { review, type Reviews } from './fsrs';
import { EMPTY_STATE } from './storage';
import { REAL_PATH } from './units';
import { isScored } from './questions';

const DAY = 86_400_000;
const ids = [...new Set(REAL_PATH.flatMap(u => u.lessons.flatMap(l => l.questions)).filter(isScored).map(q => q.id))];
const NOW = Date.UTC(2026, 10, 10, 12);
const due = (n: number): Reviews => Object.fromEntries(ids.slice(0, n).map((id, i) => [id, { ...review(undefined, true, NOW - 3 * DAY), due: NOW - (n - i) * 1000 }]));

describe('daily review', () => {
  it('has nothing to play when nothing is due', () => {
    const r: Reviews = { [ids[0]]: review(undefined, true, NOW) };
    expect(dueCount(REAL_PATH, r, NOW)).toBe(0);
    expect(buildReview(REAL_PATH, r, NOW)).toBeNull();
    expect(buildReview(REAL_PATH, {}, NOW)).toBeNull();
  });
  it('plays the due questions, oldest first', () => {
    const l = buildReview(REAL_PATH, due(5), NOW)!;
    expect(l.id).toBe(REVIEW_ID);
    expect(l.questions.map(q => q.id)).toEqual(ids.slice(0, 5));
  });
  it('stops at the cap but still counts everything due', () => {
    expect(buildReview(REAL_PATH, due(REVIEW_CAP + 7), NOW)!.questions).toHaveLength(REVIEW_CAP);
    expect(dueCount(REAL_PATH, due(REVIEW_CAP + 7), NOW)).toBe(REVIEW_CAP + 7);
  });
  it('ignores ids that no longer exist in the lessons', () => {
    const r = { ...due(2), 'gone-question': review(undefined, true, NOW - 5 * DAY) };
    expect(dueCount(REAL_PATH, r, NOW)).toBe(2);
  });
  it('finishing a review moves the dates and keeps the streak, without adding path progress', () => {
    const start = { ...EMPTY_STATE, reviews: due(2) };
    const end = finishReview(start, { stars: 3, xp: 20, results: [{ id: ids[0], ok: true }, { id: ids[1], ok: false }] }, new Date(NOW));
    expect(end.progress).toEqual({});
    expect(end.reviews[ids[0]].due).toBeGreaterThan(NOW);
    expect(end.reviews[ids[1]].lapses).toBe(1);
    expect(end.game.streak).toBe(1);
    expect(end.game.xp).toBe(20);
    expect(dueCount(REAL_PATH, end.reviews, NOW)).toBe(0);
  });
});

describe('the Review tab, "drive test" (redesign R13)', () => {
  const at = (id: string, dueAt: number) => ({ [id]: { ...review(undefined, true, NOW - 3 * DAY), due: dueAt } });
  it('nothing yet: no timers at all', () => {
    expect(reviewOutlook(REAL_PATH, {}, NOW)).toMatchObject({ due: 0, today: 0, minutes: 0, known: 0, nextDue: null, next24: 0, next7: 0 });
  });
  it('counts what is due, what comes due in 24 hours and in 7 days, and when the next one is', () => {
    const r = { ...due(3), ...at(ids[10], NOW + 5 * 3_600_000), ...at(ids[11], NOW + 3 * DAY), ...at(ids[12], NOW + 30 * DAY) };
    const o = reviewOutlook(REAL_PATH, r, NOW);
    expect(o).toMatchObject({ due: 3, today: 3, minutes: 2, next24: 1, next7: 2, nextDue: NOW + 5 * 3_600_000, known: 6 });
  });
  it('today stops at the cap (about 10 minutes), but "due" still counts everything', () => {
    const o = reviewOutlook(REAL_PATH, due(REVIEW_CAP + 7), NOW);
    expect(o.due).toBe(REVIEW_CAP + 7); expect(o.today).toBe(REVIEW_CAP); expect(o.minutes).toBe(10);
    expect(o.late).toHaveLength(REVIEW_CAP);
  });
  it('one blip per question today, oldest first, with how many days each has waited', () => {
    const r = { ...at(ids[0], NOW - 10 * DAY), ...at(ids[1], NOW - 2 * DAY), ...at(ids[2], NOW - 3_600_000) };
    expect(reviewOutlook(REAL_PATH, r, NOW).late.map(d => Math.round(d * 24) / 24)).toEqual([10, 2, 1 / 24]);
  });
  it('one question takes about a minute (never "0 minutes")', () => expect(reviewOutlook(REAL_PATH, due(1), NOW).minutes).toBe(1));
  it('ignores timers of questions that no longer exist', () => {
    expect(reviewOutlook(REAL_PATH, at('gone-question', NOW + DAY), NOW)).toMatchObject({ known: 0, next24: 0, nextDue: null });
  });
  it('says when the next question comes back in plain words', () => {
    const H = 3_600_000;
    expect(whenNext(NOW + 20 * 60_000, NOW)).toBe('within the hour');
    expect(whenNext(NOW + H, NOW)).toBe('in 1 hour');
    expect(whenNext(NOW + 5 * H, NOW)).toBe('in 5 hours');
    expect(whenNext(NOW + 22 * H, NOW)).toBe('tomorrow');
    expect(whenNext(NOW + 3 * DAY, NOW)).toBe('in 3 days');
  });
});

describe('the "your progress is safe" notice (redesign R13)', () => {
  const now = new Date(2026, 10, 5, 9, 30);
  it('names the backup\'s day in words', () => {
    expect(backupWhen('2026-11-05', now)).toBe('from earlier today');
    expect(backupWhen('2026-11-04', now)).toBe('from yesterday');
    expect(backupWhen('2026-11-03', now)).toBe('from Tuesday, Nov 3');
  });
  it('says nothing about the day when it isn\'t known', () => {
    for (const d of [null, undefined, '', 'nonsense']) expect(backupWhen(d, now)).toBe('');
  });
});
