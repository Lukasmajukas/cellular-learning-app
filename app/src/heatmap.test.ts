import { describe, it, expect } from 'vitest';
import { buildHeatmap, groupOf, heatColor, heatLabel, questionsByBand } from './heatmap';
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
  it('colours and labels', () => {
    expect(heatColor(null)).toBe('#cfd8e0');
    expect(heatColor(1)).toBe('hsl(120, 65%, 52%)');
    expect(heatColor(0.2)).toBe('hsl(0, 65%, 52%)');
    expect([heatLabel(null), heatLabel(0.95), heatLabel(0.8), heatLabel(0.5)]).toEqual(['new', 'strong', 'okay', 'fading']);
  });
});
