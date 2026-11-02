import { describe, it, expect } from 'vitest';
import { picturesDemoItems, PICTURES_DEMO } from './sampleLessons';
import { resolveItem, type Def } from './resolve';
import { DATA } from './sampleLessons';
import { mark, rightAnswerText, inside, type PhotoChoice, type TapClue } from './questions';

const [pc, tc] = picturesDemoItems() as [PhotoChoice, TapClue];
describe('photo-choice', () => {
  it('carries the picture, its alt words and a credit line', () => {
    expect(pc.kind).toBe('photo-choice');
    expect(pc.photo.src).toBe('photos/demo-drawing-01.svg');
    expect(pc.photo.alt.length).toBeGreaterThan(5);
    expect(pc.photo.credit).toContain('Claude');
    expect(pc.photo.credit).toContain('CC0');
  });
  it('is marked by the chosen index', () => {
    expect(mark(pc, pc.answer)).toBe(true);
    expect(mark(pc, (pc.answer + 1) % pc.choices.length)).toBe(false);
    expect(rightAnswerText(pc)).toBe(pc.choices[pc.answer]);
  });
});
describe('tap-clue', () => {
  it('is right only inside the target box (edges count)', () => {
    const t = tc.target;
    expect(mark(tc, [t.x + t.w / 2, t.y + t.h / 2])).toBe(true);
    expect(mark(tc, [t.x, t.y])).toBe(true);
    expect(mark(tc, [t.x + t.w + 0.01, t.y])).toBe(false);
    expect(mark(tc, [0.01, 0.99])).toBe(false);
    expect(mark(tc, [0.5])).toBe(false);
    expect(mark(tc, 3)).toBe(false);
    expect(rightAnswerText(tc)).toContain(tc.clue);
    expect(inside({ x: 0.2, y: 0.2, w: 0.1, h: 0.1 }, 0.25, 0.25)).toBe(true);
  });
});
describe('resolving picture questions', () => {
  const base = PICTURES_DEMO[0];
  const bad = (patch: Partial<Def>) => () => resolveItem({ ...base, ...patch }, DATA);
  it('refuses an unknown photo, a missing alt, and boxes outside the picture', () => {
    expect(bad({ photo: 'nope' })).toThrow(/credits/);
    expect(bad({ alt: undefined })).toThrow(/alt/);
    expect(bad({ outline: { x: 0.9, y: 0.1, w: 0.5, h: 0.1 } })).toThrow(/outline/);
    expect(bad({ answer: 9 })).toThrow(/choices/);
    expect(() => resolveItem({ ...PICTURES_DEMO[1], target: { x: 0, y: 0, w: 0, h: 0.2 } }, DATA)).toThrow(/target/);
    expect(() => resolveItem({ ...PICTURES_DEMO[1], clue: undefined }, DATA)).toThrow(/clue/);
  });
});
