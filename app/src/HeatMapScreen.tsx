import { motion } from 'motion/react';
import type { Cell, Group } from './heatmap';
import { heatColor, heatLabel } from './heatmap';
import { c, mono, COLUMN } from './theme';
import { SPRING, popInDelay } from './theme/motion';

const TITLES: Record<Group, string> = { low: 'Low bands (below 1 GHz)', mid: 'Mid bands', high: 'High bands (mmWave)' };

// The heatmap screen: every band we teach as a tile, coloured by how well you remember it.
// R04: it's a tab now, so it has no back button (the Path tab, or Esc, goes back).
export function HeatMap({ cells }: { cells: Cell[] }) {
  return (
    <div data-testid="heatmap" style={{ maxWidth: COLUMN, margin: '0 auto', padding: '16px 20px 20px', boxSizing: 'border-box' }}>
      <h1 style={{ margin: '0 0 4px' }}>Band memory</h1>
      <p style={{ margin: '0 0 12px', color: c.textMuted }}>Green = you know it. Red = it is fading, so review it. Grey = you have not been quizzed on it yet.</p>
      {(['low', 'mid', 'high'] as Group[]).map(g => {
        const row = cells.filter(x => x.group === g);
        if (!row.length) return null;
        return (
          <section key={g}>
            <h3 style={{ margin: '16px 0 8px' }}>{TITLES[g]}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {row.map((cell, i) => (
                <motion.div key={cell.id} data-testid={`heat-${cell.id}`} data-label={heatLabel(cell.score)}
                  title={`${cell.id}: ${cell.score === null ? 'not quizzed yet' : Math.round(cell.score * 100) + '% remembered'}`}
                  aria-label={`${cell.id}, ${heatLabel(cell.score)}`}
                  initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...SPRING.bouncy, delay: popInDelay(i, row.length) }}
                  style={{ minWidth: 58, padding: '8px 6px', borderRadius: 10, textAlign: 'center', background: heatColor(cell.score), color: cell.score === null ? c.textMuted : c.onBright, border: cell.score === null ? `1px dashed ${c.locked}` : '1px solid transparent', fontWeight: 600, ...mono }}>
                  {cell.id}
                  <div style={{ fontSize: 11, fontWeight: 400 }}>{cell.score === null ? 'new' : `${Math.round(cell.score * 100)}%`}</div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
