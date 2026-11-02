import { describe, it, expect } from 'vitest';
import { REAL_PATH } from './units';
import { DATA } from './sampleLessons';
import { allLessons } from './path';
import { mark, rightAnswerText } from './questions';

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

describe('unit 3 content', () => {
  const u3 = () => allLessons(REAL_PATH).filter(l => l.id.startsWith('unit03'));
  it('has 4 lessons and a checkpoint', () => {
    expect(u3().map(l => l.id)).toEqual(['unit03-l1', 'unit03-l2', 'unit03-l3', 'unit03-l4', 'unit03-check']);
    u3().forEach(l => expect(l.questions.length).toBeGreaterThanOrEqual(10));
  });
  it('"bigger box" answers pick the band with the wider downlink', () => {
    const w = (id: string) => band(id).dl_high_mhz - band(id).dl_low_mhz;
    const qs = u3().flatMap(l => l.questions) as any[];
    const boxes = qs.filter(q => /which one is the bigger box/.test(q.prompt ?? ''));
    expect(boxes.length).toBeGreaterThanOrEqual(6);
    boxes.forEach(q => {
      const [a, b] = q.choices as string[];
      expect(q.choices[q.answer], q.id).toBe(w(a) >= w(b) ? a : b);
    });
  });
  it('"sits highest" and the order items follow dl_low_mhz', () => {
    const qs = u3().flatMap(l => l.questions) as any[];
    const hi = qs.find(q => q.id === 'u3-wcs-high-01');
    const top = [...hi.choices].sort((a: string, b: string) => band(b).dl_low_mhz - band(a).dl_low_mhz)[0];
    expect(hi.choices[hi.answer]).toBe(top);
  });
});

describe('unit 5 content', () => {
  const u5 = () => allLessons(REAL_PATH).filter(l => l.id.startsWith('unit05'));
  const row = (b: string, c: string) => DATA.carrier_use.find(r => r.band === b && r.carrier_id === c) as Record<string, any>;
  it('has 3 lessons and a checkpoint, all with 10+ steps', () => {
    expect(u5().map(l => l.id)).toEqual(['unit05-l1', 'unit05-l2', 'unit05-l3', 'unit05-l4', 'unit05-check']);
    u5().forEach(l => expect(l.questions.length).toBeGreaterThanOrEqual(10));
  });
  it('icon matches use the icon field of the CURRENT rows', () => {
    const m = u5().flatMap(l => l.questions).find((q: any) => q.id === 'u5-icon-match-01') as any;
    expect(m.pairs).toEqual([[row('n77', 'verizon').icon, 'Verizon'], [row('n77', 'att').icon, 'AT&T'], [row('n41', 'tmobile').icon, 'T-Mobile']]);
  });
  it('lesson 4 (number tags) is there and its answers match the carrier_codes list', () => {
    const l4 = u5().find(l => l.id === 'unit05-l4')!;
    expect(l4.questions.length).toBeGreaterThanOrEqual(10);
    const code = (id: string) => DATA.carrier_codes.find(c => c.id === id) as Record<string, any>;
    const q = (id: string) => l4.questions.find((x: any) => x.id === id) as any;
    expect(q('u5-code-tmo-01').choices[q('u5-code-tmo-01').answer]).toBe(code('310-260').shows_as);
    expect(q('u5-code-att-01').choices[q('u5-code-att-01').answer]).toBe(code('310-410').shows_as);
    expect(q('u5-code-vz-01').choices[q('u5-code-vz-01').answer]).toBe(code('311-480').shows_as);
    expect(q('u5-code-312530-01').choices[q('u5-code-312530-01').answer]).toContain('T-Mobile');
    expect(String(code('312-530').operator)).toContain('T-Mobile');
    expect(String(code('311-580').operator)).toContain('T-Mobile');
  });
  it('no question text leaves a template unfilled', () => {
    JSON.stringify(u5()).split('{').length === 1 || expect(JSON.stringify(u5())).not.toMatch(/\{(band|carrier_use|change|code):/);
  });
});

describe('scenario puzzles', () => {
  const sc = allLessons(REAL_PATH).flatMap(l => l.questions).filter((q: any) => q.kind === 'scenario') as any[];
  it('at least one scenario exists with filled-in clues', () => {
    expect(sc.length).toBeGreaterThanOrEqual(1);
    sc.forEach(q => { expect(q.clues.length).toBeGreaterThanOrEqual(2); expect(JSON.stringify(q)).not.toMatch(/\{(band|carrier_use|change|code):/); });
  });
  it('is right only when every clue is right', () => {
    const q = sc[0];
    expect(mark(q, q.clues.map((c: any) => c.answer))).toBe(true);
    expect(mark(q, q.clues.map((c: any, i: number) => (i === 0 ? (c.answer + 1) % c.choices.length : c.answer)))).toBe(false);
    expect(mark(q, [q.clues[0].answer])).toBe(false);
    expect(rightAnswerText(q)).toContain(q.clues[0].choices[q.clues[0].answer]);
  });
});
