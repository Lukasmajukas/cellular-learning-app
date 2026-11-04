import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import { mark, parseNumber, correctOrder, rightAnswerText, type NumberQ, type Order, type Match } from './questions';
import { fill, lookup } from './templates';
import { resolveItem, resolveLesson } from './resolve';
import { DATA, TYPES_DEMO } from './sampleLessons';
import { review, retrievability, dueIds } from './fsrs';
import { startRun, advance, current, finished, scoredCount } from './session';
import { recordDay, liveStreak, signalBars, xpFor, EMPTY_GAME, doneToday, repairable, repairStreak } from './gamify';
import { finishLesson } from './finish';
import { EMPTY_STATE } from './storage';
const { normalize } = createRequire(import.meta.url)('../electron/store.cjs');

describe('marking', () => {
  const num: NumberQ = { id: 'n', kind: 'number', prompt: '', answer: 617, tolerance: 5 };
  it('number accepts a small error and units, rejects far or empty', () => {
    expect(mark(num, '617')).toBe(true); expect(mark(num, ' 620 MHz')).toBe(true); expect(mark(num, '630')).toBe(false); expect(mark(num, '')).toBe(false); expect(mark(num, 'abc')).toBe(false);
    expect(parseNumber('1,5')).toBe(1.5);
  });
  it('band numbers are exact when tolerance is 0', () => { expect(mark({ ...num, answer: 71, tolerance: 0 }, '72')).toBe(false); });
  it('order checks the whole sequence', () => {
    const o: Order = { id: 'o', kind: 'order', prompt: '', items: [{ label: 'B', value: 2, low: 2, high: 3 }, { label: 'A', value: 1, low: 1, high: 2 }] };
    expect(correctOrder(o)).toEqual(['A', 'B']); expect(mark(o, ['A', 'B'])).toBe(true); expect(mark(o, ['B', 'A'])).toBe(false); expect(rightAnswerText(o)).toBe('A → B');
  });
  it('match needs every pair right', () => {
    const m: Match = { id: 'm', kind: 'match', prompt: '', pairs: [['a', '1'], ['b', '2']] };
    expect(mark(m, [0, 1])).toBe(true); expect(mark(m, [1, 0])).toBe(false); expect(mark(m, [0])).toBe(false);
  });
});

describe('templates', () => {
  it('fills band, carrier and change facts', () => {
    expect(fill('{band:B71.dl_low_mhz}–{band:B71.dl_high_mhz}', DATA)).toBe('617–652');
    expect(lookup('carrier_use:n71/tmobile.status', DATA)).toBe('CURRENT');
    expect(lookup('change:0.status', DATA)).toBeTruthy();
    expect(fill('{code:310-260.shows_as}', DATA)).toBe('T-Mobile');
    expect(() => fill('{code:999-999.shows_as}', DATA)).toThrow(/No such fact/);
  });
  it('fails loudly on a missing band, field or bad reference', () => {
    expect(() => fill('{band:B999.dl_low_mhz}', DATA)).toThrow(/No such fact/);
    expect(() => fill('{band:B71.nope}', DATA)).toThrow(/no field/);
    expect(() => fill('{oops}', DATA)).toThrow(/Bad fact/);
  });
});

describe('resolving lessons from the bands file', () => {
  const items = resolveLesson(TYPES_DEMO, DATA);
  it('builds every type with data-filled numbers', () => {
    expect(items.map(i => i.kind)).toEqual(['learn', 'choice', 'number', 'match', 'order', 'choice', 'scenario']);
    const n = items[2] as NumberQ; expect(n.answer).toBe(617);
    expect(JSON.stringify(items)).not.toMatch(/\{band:/);
  });
  it('sorts the order question by the data', () => { expect(correctOrder(items[4] as Order)).toEqual(['B71', 'B12', 'B5', 'B2']); });
  it('puts the weakest status badge on carrier items only', () => {
    expect(items[1].badge).toBeUndefined();
    expect(items[5].badge?.status).toBe('HISTORICAL');
  });
  it('refuses items with no facts and bad answers', () => {
    expect(() => resolveItem({ id: 'x', kind: 'choice', prompt: 'p', choices: ['a'], answer: 0 }, DATA)).toThrow(/facts/);
    expect(() => resolveItem({ id: 'x', kind: 'choice', no_facts_needed: true, prompt: 'p', choices: ['a'], answer: 3 }, DATA)).toThrow(/bad choices/);
    expect(() => resolveItem({ id: 'x', kind: 'number', facts: ['band:B71'], prompt: 'p', answer_from: 'band:B71.nope' }, DATA)).toThrow(/no field/);
  });
});

describe('missed questions come back once', () => {
  const qs = resolveLesson(TYPES_DEMO, DATA);
  it('re-asks a first-try miss a few steps later, only once', () => {
    let r = startRun(qs); r = advance(r, true); // learn card
    const id = current(r)!.id; r = advance(r, false);
    expect(r.queue.length).toBe(qs.length + 1);
    expect(r.queue.filter(q => q.id === id)).toHaveLength(2);
    while (!(current(r)!.id === id && r.seen.includes(id))) r = advance(r, true);
    expect(current(r)!.id).toBe(id);
    r = advance(r, false); // missed again: no third time
    expect(r.queue.filter(q => q.id === id)).toHaveLength(2);
    expect(r.firstMissed).toEqual([id]);
  });
  it('counts each question once and ignores learn cards', () => {
    const r = startRun(qs); expect(scoredCount(r)).toBe(6);
    let x = r; while (!finished(x)) x = advance(x, true);
    expect(x.firstRight).toHaveLength(6); expect(x.firstMissed).toHaveLength(0);
  });
});

describe('FSRS review schedule', () => {
  const t0 = Date.UTC(2026, 10, 1), DAY = 86_400_000;
  it('first right answer waits days; first miss comes back in 1 day', () => {
    expect(review(undefined, true, t0).due).toBeGreaterThan(t0 + DAY);
    expect(review(undefined, false, t0).due).toBe(t0 + DAY);
  });
  it('a right answer on time makes the gap grow; a miss shrinks it', () => {
    const c1 = review(undefined, true, t0), t1 = c1.due;
    const grew = review(c1, true, t1), shrank = review(c1, false, t1);
    expect(grew.s).toBeGreaterThan(c1.s); expect(shrank.s).toBeLessThan(c1.s); expect(shrank.lapses).toBe(1);
  });
  it('memory fades with time and is due-sorted', () => {
    const c = review(undefined, true, t0);
    expect(retrievability(c, t0)).toBeCloseTo(1, 5); expect(retrievability(c, t0 + 30 * DAY)).toBeLessThan(0.9);
    expect(dueIds({ a: { ...c, due: t0 + 5 }, b: { ...c, due: t0 + 1 }, z: { ...c, due: t0 + 9 * DAY } }, t0 + 10)).toEqual(['b', 'a']);
  });
});

describe('streak, XP and signal bars', () => {
  it('counts days in a row and resets after a gap', () => {
    let g = recordDay(EMPTY_GAME, 50, new Date(2026, 10, 1, 9));
    expect(g.streak).toBe(1);
    g = recordDay(g, 10, new Date(2026, 10, 1, 20)); expect(g.streak).toBe(1); expect(g.xpToday).toBe(60);
    g = recordDay(g, 10, new Date(2026, 10, 2)); expect(g.streak).toBe(2); expect(g.xpToday).toBe(10); expect(g.xp).toBe(70);
    expect(liveStreak(g, new Date(2026, 10, 3))).toBe(2); expect(liveStreak(g, new Date(2026, 10, 4))).toBe(0);
    g = recordDay(g, 10, new Date(2026, 10, 5)); expect(g.streak).toBe(1);
  });
  it('works across a month end', () => { expect(recordDay(recordDay(EMPTY_GAME, 1, new Date(2026, 9, 31)), 1, new Date(2026, 10, 1)).streak).toBe(2); });
  it('XP and bars', () => { expect(xpFor(5, 1, true)).toBe(75); expect(signalBars(5, 5)).toBe(5); expect(signalBars(0, 5)).toBe(1); expect(signalBars(3, 5)).toBe(3); });
});

describe('finishing a lesson', () => {
  it('saves stars, a review card per question, streak and XP', () => {
    const s = finishLesson(EMPTY_STATE, 'u1-l1', { stars: 2, xp: 40, results: [{ id: 'q1', ok: true }, { id: 'q2', ok: false }] }, new Date(2026, 10, 1));
    expect(s.progress['u1-l1']).toBe(2); expect(Object.keys(s.reviews)).toEqual(['q1', 'q2']); expect(s.reviews.q2.lapses).toBe(1);
    expect(s.game.streak).toBe(1); expect(s.game.xp).toBe(40);
  });
});

describe('save file keeps reviews and game', () => {
  it('round-trips good data and drops bad data', () => {
    const s = finishLesson(EMPTY_STATE, 'a', { stars: 1, xp: 10, results: [{ id: 'q1', ok: true }] }, new Date(2026, 10, 1));
    const n = normalize(JSON.parse(JSON.stringify(s))); expect(n.reviews).toEqual(s.reviews); expect(n.game).toEqual(s.game);
    const bad = normalize({ reviews: { x: { d: 'no' }, y: null }, game: { streak: -3, lastDay: 'tuesday', xp: 1.5 } });
    expect(bad.reviews).toEqual({}); expect(bad.game).toEqual(EMPTY_GAME);
    expect(normalize({ progress: { a: 2 } }).reviews).toEqual({});
  });
});

describe('T54 goal, freeze and repair', () => {
  const d = (n: number) => new Date(2026, 10, n, 12);
  const run = (days: number[]) => days.reduce((g, n) => recordDay(g, 10, d(n)), EMPTY_GAME);
  it('counts lessons done today for the goal bar', () => {
    const g = run([1, 1, 1]); expect(doneToday(g, d(1))).toBe(3); expect(doneToday(g, d(2))).toBe(0);
  });
  it('earns a freeze at 7 days (max 2) and spends it on one missed day', () => {
    let g = run([1, 2, 3, 4, 5, 6, 7]); expect(g.freezes).toBe(1);
    expect(liveStreak(g, d(9))).toBe(7);
    g = recordDay(g, 10, d(9)); expect(g.streak).toBe(8); expect(g.freezes).toBe(0);
    expect(liveStreak(run([1, 2, 3, 4, 5, 6, 7]), d(10))).toBe(0);
  });
  it('lets you repair within 48 hours, before or after the next lesson', () => {
    const g = run([1, 2, 3]);
    expect(repairable(g, d(4))).toBe(0);
    expect(repairable(g, d(5))).toBe(3);
    expect(repairable(g, d(7))).toBe(0);
    const pre = recordDay(repairStreak(g, d(5)), 10, d(5)); expect(pre.streak).toBe(4);
    const post = repairStreak(recordDay(g, 10, d(5)), d(5)); expect(post.streak).toBe(4); expect(repairable(post, d(5))).toBe(0);
  });
});
