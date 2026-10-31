import { describe, it, expect } from 'vitest';
import { SAMPLE, isCorrect, stars } from './lesson';
describe('lesson', () => {
  it('has 3 questions with valid answers', () => {
    expect(SAMPLE).toHaveLength(3);
    SAMPLE.forEach(q => expect(q.answer).toBeLessThan(q.choices.length));
  });
  it('checks answers', () => { expect(isCorrect(SAMPLE[0], 0)).toBe(true); expect(isCorrect(SAMPLE[0], 1)).toBe(false); });
  it('gives stars', () => { expect(stars(3, 3)).toBe(3); expect(stars(2, 3)).toBe(2); expect(stars(0, 3)).toBe(1); });
});
