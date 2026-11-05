import { describe, it, expect } from 'vitest';
import { buildHeatmap, groupOf, heatLabel, heatGlow, heatBars, heatCounts, lessonsByBand, questionsByBand, HEAT_TONE, HEAT_TINT, LEVELS } from './heatmap';
import { NIGHT, DAY, type Palette } from './theme/tokens';
import { contrast } from './theme/contrast';
import { review } from './fsrs';

const NOW = Date.UTC(2026, 10, 2);
const lessons = [{ questions: [
  { id: 'a', kind: 'learn', facts: ['band:B71'] },
  { id: 'b', kind: 'number', facts: ['band:B71', 'band:n71'] },
  { id: 'c', kind: 'choice', facts: ['carrier_use:n71/tmobile', 'band:n260'] },
] }];
const bands = [
  { id: 'B71', dl_low_mhz: 617 }, { id: 'n71', dl_low_mhz: 617 }, { id: 'n260', dl_low_mhz: 37000 },
  { id: 'B2', dl_low_mhz: 1930 }, { id: 'B99', dl_low_mhz: 100, not_applicable: true },
];

describe('heatmap', () => {
  it('groups by the owner rule', () => {
    expect([groupOf(617), groupOf(1930), groupOf(3450), groupOf(37000)]).toEqual(['low', 'mid', 'mid', 'high']);
  });
  it('ignores learn cards and non-band facts when tagging', () => {
    expect(questionsByBand(lessons)).toEqual({ B71: ['b'], n71: ['b'], n260: ['c'] });
  });
  it('lists only taught bands, sorted, new ones with no score', () => {
    const cells = buildHeatmap(bands, lessons, {}, NOW);
    expect(cells.map(c => c.id)).toEqual(['B71', 'n71', 'n260']);
    expect(cells.every(c => c.score === null)).toBe(true);
  });
  it('scores a band from its answered questions and fades over time', () => {
    const reviews = { b: review(undefined, true, NOW) };
    const fresh = buildHeatmap(bands, lessons, reviews, NOW).find(c => c.id === 'B71')!;
    const later = buildHeatmap(bands, lessons, reviews, NOW + 30 * 86_400_000).find(c => c.id === 'B71')!;
    expect(fresh.score).toBeCloseTo(1, 5);
    expect(later.score!).toBeLessThan(fresh.score!);
    expect(buildHeatmap(bands, lessons, reviews, NOW).find(c => c.id === 'n260')!.score).toBeNull();
  });
  it('labels: new, fading (under 70%), okay (70-90%), strong (90% and up)', () => {
    expect([heatLabel(null), heatLabel(0.95), heatLabel(0.9), heatLabel(0.8), heatLabel(0.7), heatLabel(0.5)]).toEqual(['new', 'strong', 'strong', 'okay', 'okay', 'fading']);
    // By the whole percent the tile shows: 89.6% shows as "90%", so it's strong; 69.4% shows as "69%", so it's fading.
    expect([heatLabel(0.896), heatLabel(0.894), heatLabel(0.695), heatLabel(0.694)]).toEqual(['strong', 'okay', 'okay', 'fading']);
    expect([0.896, 0.894, 0.695, 0.694].map(heatBars)).toEqual([4, 3, 2, 1]);
    expect(HEAT_TONE).toEqual({ strong: 'onAir', okay: 'streak', fading: 'miss', new: 'locked' });
  });
  it('R14: the glow gets brighter the better you remember (none for new, faint at 50% or less, full at 100%)', () => {
    expect(heatGlow(null)).toBe(0);
    expect(heatGlow(0.2)).toBe(0.15); expect(heatGlow(0.5)).toBe(0.15); expect(heatGlow(1)).toBe(1);
    const steps = [0.5, 0.6, 0.7, 0.8, 0.9, 1].map(heatGlow);
    for (let i = 1; i < steps.length; i++) expect(steps[i]).toBeGreaterThan(steps[i - 1]);
  });
  it('R14: the signal bars say the level without colour (1 fading, 2-3 okay, 4 strong, 0 new)', () => {
    expect([null, 0.3, 0.69, 0.7, 0.79, 0.8, 0.89, 0.9, 1].map(heatBars)).toEqual([0, 1, 1, 2, 2, 3, 3, 4, 4]);
    for (const s of [0.3, 0.75, 0.85, 0.95]) {
      const l = heatLabel(s), b = heatBars(s);
      expect(l === 'fading' ? b === 1 : l === 'okay' ? b === 2 || b === 3 : b === 4, `${s}`).toBe(true);
    }
  });
  it('R14: counts the bands at each level for the legend', () => {
    const reviews = { b: review(undefined, true, NOW) };
    expect(heatCounts(buildHeatmap(bands, lessons, reviews, NOW))).toEqual({ strong: 2, okay: 0, fading: 0, new: 1 });
    expect(LEVELS).toEqual(['strong', 'okay', 'fading', 'new']);
  });
  it('R14: lists the lessons that ask about each band, in path order with their unit number (learn cards don\'t count)', () => {
    const units = [
      { id: 'u1', title: 'One', lessons: [{ id: 'l1', title: 'First', questions: [{ id: 'a', kind: 'learn', facts: ['band:n41'] }, { id: 'b', facts: ['band:B71'] }] }] },
      { id: 'u2', title: 'Two', lessons: [{ id: 'l2', title: 'Second', questions: [{ id: 'c', facts: ['band:B71', 'band:n41'] }, { id: 'd', facts: ['band:B71'] }] }] },
    ];
    expect(lessonsByBand(units)).toEqual({
      B71: [{ id: 'l1', title: 'First', unit: 1 }, { id: 'l2', title: 'Second', unit: 2 }],
      n41: [{ id: 'l2', title: 'Second', unit: 2 }],
    });
  });
});

// The tile's fill is the level's colour mixed into the card colour (HEAT_TINT %). Its words and bars must stay readable.
const hex = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => '#' + hex(a).map((x, i) => Math.round(x * t + hex(b)[i] * (1 - t)).toString(16).padStart(2, '0')).join('');
describe('heatmap tiles are readable (Night and Day)', () => {
  const check = (p: Palette) => (['strong', 'okay', 'fading'] as const).flatMap(l => {
    const bg = mix(p[HEAT_TONE[l]], p.surface, HEAT_TINT / 100);
    return [
      ['band name', contrast(p.text, bg), 4.5], ['percent', contrast(p.textMuted, bg), 4.5], ['bars and outline', contrast(p[HEAT_TONE[l]], bg), 3],
    ].filter(([, r, min]) => (r as number) < (min as number)).map(([what, r]) => `${l} ${what}: ${(r as number).toFixed(2)}`);
  });
  it('Night', () => expect(check(NIGHT)).toEqual([]));
  it('Day (early values, finished in R20)', () => expect(check(DAY)).toEqual([]));
  it('a new band: its dim words on the card colour', () => {
    for (const p of [NIGHT, DAY]) expect(contrast(p.textMuted, p.surface)).toBeGreaterThanOrEqual(4.5);
  });
});
