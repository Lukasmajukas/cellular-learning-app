import { describe, it, expect } from 'vitest';
import { REAL_PATH } from './units';
import { DATA } from './sampleLessons';
import { allLessons } from './path';

const band = (id: string) => DATA.bands.find(b => b.id === id) as Record<string, any>;
// The app's own tier rule (decision D1): low = starts below 1000 MHz, high = mmWave (FR2), mid = the rest.
const tier = (id: string) => { const b = band(id); return b.kind === 'NR-FR2' ? 2 : b.dl_low_mhz < 1000 ? 0 : 1; };

describe('units 1-3 content', () => {
  it('every lesson resolves and has questions', () => {
    const ls = allLessons(REAL_PATH);
    expect(ls.length).toBeGreaterThanOrEqual(5);
    ls.forEach(l => expect(l.questions.length).toBeGreaterThanOrEqual(8));
    expect(ls[ls.length - 1].id).toMatch(/check|l4/);
  });
  it('lesson ids are the new ones (never the sample ids)', () => {
    allLessons(REAL_PATH).forEach(l => expect(l.id).toMatch(/^unit\d\d-(l\d|check)$/));
  });
  it('"which part of the ruler" answers follow the tier rule', () => {
    const asks = allLessons(REAL_PATH).flatMap(l => l.questions).filter((q: any) => q.kind === 'choice' && /^Which part of the ruler is (\S+) in\?$/.test(q.prompt));
    expect(asks.length).toBeGreaterThanOrEqual(8);
    asks.forEach((q: any) => {
      const id = /is (\S+) in/.exec(q.prompt)![1];
      expect(q.choices[q.answer], q.id).toBe(['Low band', 'Mid band', 'High band'][tier(id)]);
    });
  });
  it('"FDD or TDD" and "normal or upside-down" answers follow the duplex field', () => {
    const qs = allLessons(REAL_PATH).flatMap(l => l.questions) as any[];
    let n = 0;
    qs.filter(q => q.kind === 'choice').forEach(q => {
      const id = /\b([Bn]\d+)\b/.exec(q.prompt)?.[1];
      if (id && /FDD or TDD/.test(q.prompt) && band(id)) { n++; expect(q.choices[q.answer], q.id).toBe(String(band(id).duplex).startsWith('FDD') ? 'FDD' : 'TDD'); }
      if (id && /normal or upside-down/.test(q.prompt) && band(id)) { n++; expect(q.choices[q.answer], q.id).toBe(String(band(id).duplex).includes('UL above DL') ? 'Upside-down' : 'Normal'); }
    });
    expect(n).toBeGreaterThanOrEqual(15);
  });
});
