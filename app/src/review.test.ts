// Tests added by the final review (T37): number typing, answer-button order, and content guards.
import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mark, parseNumber, shuffleOrder, isScored, type Item } from './questions';
import { REAL_PATH } from './units';

const realItems: Item[] = REAL_PATH.flatMap(u => u.lessons.flatMap(l => l.questions));

describe('typing numbers', () => {
  it('reads US thousands commas the way the prompts write them', () => {
    expect(parseNumber('1,710')).toBe(1710);
    expect(parseNumber('104,972')).toBe(104972);
    expect(parseNumber('256,003')).toBe(256003);
    expect(parseNumber('417,816,578')).toBe(417816578);
    expect(parseNumber('1 710')).toBe(1710);
    expect(parseNumber('37,000 MHz')).toBe(37000);
  });
  it('still reads a decimal comma, plain numbers and MHz', () => {
    expect(parseNumber('1,5')).toBe(1.5);
    expect(parseNumber('2110 MHz')).toBe(2110);
    expect(parseNumber('2110.5')).toBe(2110.5);
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('abc')).toBeNull();
  });
  it('turns GHz into MHz', () => {
    expect(parseNumber('37 GHz')).toBe(37000);
    expect(parseNumber('2.5ghz')).toBe(2500);
  });
  it('every real number question accepts its answer typed with thousands commas', () => {
    const nums = realItems.filter(i => i.kind === 'number');
    expect(nums.length).toBeGreaterThan(40);
    for (const q of nums) {
      const typed = q.answer.toLocaleString('en-US', { maximumFractionDigits: 3 });
      expect(mark(q, typed), `${q.id}: "${typed}"`).toBe(true);
    }
  });
});

describe('answer buttons are shuffled', () => {
  it('gives every position once', () => {
    for (let n = 1; n <= 5; n++) expect([...shuffleOrder(n)].sort()).toEqual(Array.from({ length: n }, (_, i) => i));
  });
  it('puts the first-written answer in every position over many showings', () => {
    for (const n of [2, 3, 4]) {
      const seen = new Set<number>();
      for (let k = 0; k < 300; k++) seen.add(shuffleOrder(n).indexOf(0));
      expect(seen.size).toBe(n);
    }
  });
});

describe('Windows-safe file names', () => {
  it('no two files in src/ share a name when capital letters are ignored (Windows treats them as one)', () => {
    const stems = readdirSync(fileURLToPath(new URL('.', import.meta.url))).map(f => f.replace(/\.(tsx?|jsx?)$/, '').toLowerCase());
    expect(stems.filter((s, i) => stems.indexOf(s) !== i)).toEqual([]);
  });
});

describe('content guards', () => {
  it('no answer option was split in two by a comma (a YAML list slip)', () => {
    const opts = realItems.filter(isScored).flatMap(q =>
      q.kind === 'choice' || q.kind === 'photo-choice' ? q.choices.map(c => [q.id, c]) :
      q.kind === 'scenario' ? q.clues.flatMap(c => c.choices.map(ch => [q.id, ch])) : []);
    const bad = opts.filter(([, c]) => /^[a-z]/.test(c) && !/^(n\d|eNB|gNB|iPhone|mmWave)/.test(c));
    expect(bad).toEqual([]);
  });
});
