import { describe, it, expect } from 'vitest';
import { KIND_LABEL, KIND_HINT, FOLD_LABEL, counter, BEACON_LINES, beaconLine, type Moment } from './questionScreen';

// Redesign R09: the question screen's words (the label above each question, the counter, Beacon's speech bubble).
describe('question screen words', () => {
  it('every question type has a short label (2 to 4 words), like look A\'s "PICK ONE"', () => {
    for (const k of ['choice', 'photo-choice', 'number', 'match', 'order', 'scenario', 'tap-clue', 'learn'] as const) {
      const words = KIND_LABEL[k].split(' ');
      expect(words.length, k).toBeGreaterThanOrEqual(2);
      expect(words.length, k).toBeLessThanOrEqual(4);
    }
    expect(KIND_LABEL.choice.toUpperCase()).toBe('PICK ONE');
  });

  it('the "how to answer" hints and the fold buttons are short and hold no facts (R10)', () => {
    for (const k of ['number', 'match', 'order', 'scenario', 'tap-clue'] as const) expect(KIND_HINT[k], k).toBeTruthy();
    expect(KIND_HINT.choice).toBeUndefined(); // the numbered tiles say it all (look A)
    for (const line of [...Object.values(KIND_HINT), ...Object.values(FOLD_LABEL)] as string[]) {
      expect(line.split(/\s+/).length, line).toBeLessThanOrEqual(10);
      expect(line, line).not.toMatch(/\d/); // no numbers at all: an example number could give an answer away
    }
    expect(Object.keys(FOLD_LABEL).sort()).toEqual(['order', 'scenario']);
  });

  it('the counter shows the question on screen, counting from 1, and never goes past the total', () => {
    expect(counter(0, 12)).toBe('1 / 12');
    expect(counter(4, 12)).toBe('5 / 12');
    expect(counter(12, 12)).toBe('12 / 12');
  });

  it("Beacon's lines are 8 words or fewer, kind, and hold no numbers (no facts in the bubble)", () => {
    const all = Object.values(BEACON_LINES).flat();
    expect(all.length).toBeGreaterThanOrEqual(12);
    for (const line of all) {
      expect(line.split(/\s+/).length, line).toBeLessThanOrEqual(8);
      expect(line, line).not.toMatch(/\d/);
      expect(line.toLowerCase(), line).not.toMatch(/wrong|bad|fail|stupid|lazy|should have|again\?/);
    }
  });

  it('the same question always gets the same line; different questions get different ones', () => {
    for (const m of Object.keys(BEACON_LINES) as Moment[]) {
      expect(beaconLine(m, 'q1-0')).toBe(beaconLine(m, 'q1-0'));
      expect(BEACON_LINES[m]).toContain(beaconLine(m, 'q1-0'));
      const seen = new Set(Array.from({ length: 30 }, (_, i) => beaconLine(m, `q${i}-${i}`)));
      expect(seen.size, m).toBeGreaterThan(1);
    }
  });
});
