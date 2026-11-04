import { describe, it, expect } from 'vitest';
import { buildReview, dueCount, REVIEW_CAP, REVIEW_ID } from './dailyReview';
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
