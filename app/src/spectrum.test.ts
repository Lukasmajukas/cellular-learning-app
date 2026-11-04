import { describe, it, expect } from 'vitest';
import { placeLabels, W } from './SpectrumBar';

// Redesign R10: the spectrum bar's band names sit on two rows above the track and must never overlap
// (before R10, B12 and B5 ran into each other and into "617 MHz" in the order question's sheet).
const CHAR = 7, GAP = 8;
const overlaps = (items: { label: string; cx: number }[]) => {
  const p = placeLabels(items);
  const boxes = p.map((l, i) => ({ row: l.row, a: l.x - (items[i].label.length * CHAR) / 2, b: l.x + (items[i].label.length * CHAR) / 2 }));
  for (const r of [0, 1]) {
    const row = boxes.filter(x => x.row === r).sort((x, y) => x.a - y.a);
    for (let i = 1; i < row.length; i++) if (row[i].a < row[i - 1].b + GAP - 0.01) return true;
  }
  return boxes.some(x => x.a < -0.01 || x.b > W + 0.01);
};

describe('spectrum bar names', () => {
  it('one band: its name sits over its block, on the lower row', () => {
    expect(placeLabels([{ label: 'B71', cx: 180 }])).toEqual([{ x: 180, row: 1 }]);
  });
  it('three low bands bunched together plus one far away (the order question): no overlaps', () => {
    const items = [{ label: 'B71', cx: 22 }, { label: 'B12', cx: 38 }, { label: 'B5', cx: 62 }, { label: 'B2', cx: 340 }];
    expect(overlaps(items)).toBe(false);
    expect(new Set(placeLabels(items).slice(0, 2).map(l => l.row)).size).toBe(2); // the two closest use both rows
  });
  it('names near the edges stay inside the drawing', () => {
    const p = placeLabels([{ label: 'n77', cx: 2 }, { label: 'n258', cx: 358 }]);
    expect(p[0].x).toBeGreaterThanOrEqual(10.5);
    expect(p[1].x).toBeLessThanOrEqual(W - 14);
  });
  it('six bands spread over the ruler: no overlaps', () => {
    const items = ['n71', 'B12', 'n5', 'n25', 'n66', 'n41'].map((label, i) => ({ label, cx: [20, 40, 70, 250, 270, 330][i] }));
    expect(overlaps(items)).toBe(false);
  });
});
