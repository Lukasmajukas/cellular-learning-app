// A small drawing of where bands sit on the radio "ruler" (redesign R10: Night Signal look).
// Each band is a coloured block on a thin track. Its name sits above it, on one of two rows, so names never overlap;
// a hairline joins a name to its block. The lowest and highest MHz sit under the ends of the track.
import { DATA } from './sampleLessons';
import { c, FONT } from './theme';
export type Range = { label: string; low: number; high: number; color?: string };
export const rangesFor = (ids: string[]): Range[] => ids.flatMap(id => {
  const b = DATA.bands.find(x => x.id === id);
  return b ? [{ label: id, low: Number(b.dl_low_mhz), high: Number(b.dl_high_mhz) }] : [];
});
const PALETTE = [c.chart1, c.chart2, c.chart3, c.chart4, c.chart5, c.chart6];

export const W = 360;          // drawing width (it scales to fit the column)
const CHAR = 7, GAP = 8;       // a code-font letter at 11 px is about 6.6 px wide; GAP = room between two names
const labelWidth = (s: string) => s.length * CHAR;

// Where each name goes: its middle (x, kept inside the drawing) and its row (0 = top, 1 = just above the track).
// Names go left to right; each takes the lower row if it fits there, else the top row, else the row with more room.
// Plain logic, so a unit test (src/spectrum.test.ts) can check that names never overlap.
export function placeLabels(items: { label: string; cx: number }[]): { x: number; row: 0 | 1 }[] {
  const end: [number, number] = [-Infinity, -Infinity]; // right edge of the last name on each row
  const out: { x: number; row: 0 | 1 }[] = new Array(items.length);
  const order = items.map((it, i) => ({ ...it, i })).sort((a, b) => a.cx - b.cx);
  for (const it of order) {
    const half = labelWidth(it.label) / 2;
    const x = Math.min(W - half, Math.max(half, it.cx));
    const fits = (r: 0 | 1) => x - half >= end[r] + GAP;
    const row: 0 | 1 = fits(1) ? 1 : fits(0) ? 0 : end[1] <= end[0] ? 1 : 0;
    // If neither row has room, slide the name right until it clears (it keeps its hairline to its block).
    const left = Math.max(x - half, end[row] + GAP);
    out[it.i] = { x: Math.min(W - half, left + half), row };
    end[row] = left + 2 * half;
  }
  return out;
}

export function SpectrumBar({ ranges, testId = 'spectrum-bar' }: { ranges: Range[]; testId?: string }) {
  if (!ranges.length) return null;
  const lo = Math.min(...ranges.map(r => r.low)), hi = Math.max(...ranges.map(r => r.high));
  const pad = Math.max(20, (hi - lo) * 0.06), min = lo - pad, span = hi + pad - min;
  const x = (v: number) => ((v - min) / span) * W;
  const ROW_Y = [13, 29], BAR_Y = 40, BAR_H = 14, SCALE_Y = 72;
  const blocks = ranges.map((r, i) => { const w = Math.max(6, x(r.high) - x(r.low)); return { r, i, x0: x(r.low), w, cx: x(r.low) + w / 2 }; });
  const labels = placeLabels(blocks.map(b => ({ label: b.r.label, cx: b.cx })));
  return (
    <svg data-testid={testId} viewBox={`0 0 ${W} 78`} role="img" aria-label={`Spectrum bar: ${ranges.map(r => `${r.label} ${r.low}–${r.high} MHz`).join(', ')}`}
      style={{ display: 'block', width: '100%', fontFamily: FONT.mono, overflow: 'visible' }}>
      <rect x={0} y={BAR_Y + BAR_H / 2 - 3} width={W} height={6} rx={3} fill={c.track} />
      {blocks.map(({ r, i, x0, w, cx }) => {
        const col = r.color ?? PALETTE[i % PALETTE.length], l = labels[i];
        return (
          <g key={r.label} data-band={r.label}>
            <line x1={l.x} y1={ROW_Y[l.row] + 3} x2={cx} y2={BAR_Y - 1} stroke={col} strokeWidth={1} opacity={0.7} />
            <rect x={x0} y={BAR_Y} width={w} height={BAR_H} rx={4} fill={col} />
            <text x={l.x} y={ROW_Y[l.row]} fontSize={11} fontWeight={500} textAnchor="middle" fill={c.text}>{r.label}</text>
          </g>);
      })}
      <line x1={x(lo)} y1={BAR_Y + BAR_H + 3} x2={x(lo)} y2={BAR_Y + BAR_H + 7} stroke={c.textMuted} strokeWidth={1} />
      <line x1={x(hi)} y1={BAR_Y + BAR_H + 3} x2={x(hi)} y2={BAR_Y + BAR_H + 7} stroke={c.textMuted} strokeWidth={1} />
      <text x={Math.max(0, x(lo) - 4)} y={SCALE_Y} fontSize={10} fill={c.textMuted}>{Math.round(lo)} MHz</text>
      <text x={Math.min(W, x(hi) + 4)} y={SCALE_Y} fontSize={10} fill={c.textMuted} textAnchor="end">{Math.round(hi)} MHz</text>
    </svg>);
}
