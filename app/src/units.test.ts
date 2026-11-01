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

describe('unit 2 content', () => {
  const u2 = () => allLessons(REAL_PATH).filter(l => l.id.startsWith('unit02'));
  it('has 4 lessons and a checkpoint', () => {
    expect(u2().map(l => l.id)).toEqual(['unit02-l1', 'unit02-l2', 'unit02-l3', 'unit02-l4', 'unit02-check']);
    u2().forEach(l => expect(l.questions.length).toBeGreaterThanOrEqual(10));
  });
  it('"smallest/biggest box" answers follow the downlink width', () => {
    const w = (id: string) => band(id).dl_high_mhz - band(id).dl_low_mhz;
    const qs = u2().flatMap(l => l.questions) as any[];
    const small = qs.find(q => q.id === 'u2-box-small-01'), big = qs.find(q => q.id === 'u2-box-big-01');
    expect(small.choices[small.answer]).toBe(['B17', 'B12', 'B85'].sort((a, b) => w(a) - w(b))[0]);
    expect(big.choices[big.answer]).toBe(['B17', 'B12', 'B85'].sort((a, b) => w(b) - w(a))[0]);
  });
  it('"higher/lower on the ruler" answers follow dl_low_mhz', () => {
    const qs = u2().flatMap(l => l.questions) as any[];
    const q = qs.find(x => x.id === 'u2-b13b14-higher-01');
    expect(q.choices[q.answer]).toBe(band('B14').dl_low_mhz > band('B13').dl_low_mhz ? 'B14' : 'B13');
    const r = qs.find(x => x.id === 'u2-b71-lower-01');
    expect(r.choices[r.answer]).toBe(band('B71').dl_low_mhz < band('B12').dl_low_mhz ? 'B71' : 'B12');
  });
});
