import { describe, it, expect } from 'vitest';
import { SAMPLE_PATH, allLessons, lessonStatus, recordResult, doneCount, sideOf, focusLessonId, unitStatus } from './path';
describe('path', () => {
  it('has unique lesson ids and questions in every lesson', () => {
    const ids = allLessons(SAMPLE_PATH).map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    allLessons(SAMPLE_PATH).forEach(l => expect(l.questions.length).toBeGreaterThan(0));
  });
  it('opens only the first lesson at the start', () => {
    expect(lessonStatus(SAMPLE_PATH, {}, 'u1-l1')).toBe('current');
    expect(lessonStatus(SAMPLE_PATH, {}, 'u1-l2')).toBe('locked');
  });
  it('unlocks the next lesson across units', () => {
    const p = { 'u1-l1': 3, 'u1-l2': 2, 'u1-l3': 1 };
    expect(lessonStatus(SAMPLE_PATH, p, 'u1-l3')).toBe('done');
    expect(lessonStatus(SAMPLE_PATH, p, 'u2-l1')).toBe('current');
    expect(lessonStatus(SAMPLE_PATH, p, 'u2-l2')).toBe('locked');
  });
  it('keeps the best stars and never lowers them', () => {
    let p = recordResult({}, 'u1-l1', 2);
    p = recordResult(p, 'u1-l1', 1);
    expect(p['u1-l1']).toBe(2);
    p = recordResult(p, 'u1-l1', 3);
    expect(p['u1-l1']).toBe(3);
  });
  it('counts finished lessons and rejects unknown ids', () => {
    expect(doneCount(SAMPLE_PATH, { 'u1-l1': 1, 'u2-l1': 3 })).toBe(2);
    expect(() => lessonStatus(SAMPLE_PATH, {}, 'nope')).toThrow();
  });
});

describe('path map layout (redesign R05)', () => {
  it('circles zig-zag: left, right, left, right', () => {
    expect([0, 1, 2, 3, 4].map(sideOf)).toEqual(['left', 'right', 'left', 'right', 'left']);
  });
  it('opens at the current lesson, or at the last one when everything is done', () => {
    expect(focusLessonId(SAMPLE_PATH, {})).toBe('u1-l1');
    expect(focusLessonId(SAMPLE_PATH, { 'u1-l1': 3, 'u1-l2': 1, 'u1-l3': 2 })).toBe('u2-l1');
    const all = Object.fromEntries(allLessons(SAMPLE_PATH).map(l => [l.id, 3]));
    expect(focusLessonId(SAMPLE_PATH, all)).toBe('u2-l4');
    expect(focusLessonId([], {})).toBeUndefined();
  });
  it('a unit is done, open (something to play) or locked', () => {
    expect(unitStatus(SAMPLE_PATH, {}, 'u1')).toBe('open');
    expect(unitStatus(SAMPLE_PATH, {}, 'u2')).toBe('locked');
    const p = { 'u1-l1': 3, 'u1-l2': 1, 'u1-l3': 2 };
    expect(unitStatus(SAMPLE_PATH, p, 'u1')).toBe('done');
    expect(unitStatus(SAMPLE_PATH, p, 'u2')).toBe('open');
    expect(() => unitStatus(SAMPLE_PATH, {}, 'nope')).toThrow();
  });
});
