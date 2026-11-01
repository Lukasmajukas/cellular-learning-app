import { describe, it, expect } from 'vitest';
import { SAMPLE_PATH, allLessons, lessonStatus, recordResult, doneCount } from './path';
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
