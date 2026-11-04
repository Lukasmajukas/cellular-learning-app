// A small drawing of where bands sit on the radio "ruler". Each band is a coloured block.
import { DATA } from './sampleLessons';
import { c, FONT } from './theme';
export type Range = { label: string; low: number; high: number; color?: string };
export const rangesFor = (ids: string[]): Range[] => ids.flatMap(id => {
  const b = DATA.bands.find(x => x.id === id);
  return b ? [{ label: id, low: Number(b.dl_low_mhz), high: Number(b.dl_high_mhz) }] : [];
});
const PALETTE = [c.chart1, c.chart2, c.chart3, c.chart4, c.chart5, c.chart6];

export function SpectrumBar({ ranges, testId = 'spectrum-bar' }: { ranges: Range[]; testId?: string }) {
  if (!ranges.length) return null;
  const lo = Math.min(...ranges.map(r => r.low)), hi = Math.max(...ranges.map(r => r.high));
  const pad = Math.max(20, (hi - lo) * 0.08), min = lo - pad, span = hi + pad - min, W = 360;
  const x = (v: number) => ((v - min) / span) * W;
  return (
    <svg data-testid={testId} viewBox={`0 0 ${W} 74`} role="img" aria-label={`Spectrum bar: ${ranges.map(r => `${r.label} ${r.low}–${r.high} MHz`).join(', ')}`} style={{ width: '100%', maxWidth: 380, fontFamily: FONT.mono }}>
      <rect x={0} y={34} width={W} height={10} rx={5} fill={c.track} />
      {ranges.map((r, i) => {
        const w = Math.max(6, x(r.high) - x(r.low)), cx = x(r.low) + w / 2, row = i % 2;
        return (
          <g key={r.label}>
            <rect x={x(r.low)} y={30} width={w} height={18} rx={4} fill={r.color ?? PALETTE[i % PALETTE.length]} />
            <text x={Math.min(W - 14, Math.max(14, cx))} y={row ? 68 : 22} fontSize={11} textAnchor="middle" fill="currentColor">{r.label}</text>
          </g>);
      })}
      <text x={2} y={58} fontSize={9} fill={c.textMuted}>{Math.round(lo)} MHz</text>
      <text x={W - 2} y={58} fontSize={9} fill={c.textMuted} textAnchor="end">{Math.round(hi)} MHz</text>
    </svg>);
}
