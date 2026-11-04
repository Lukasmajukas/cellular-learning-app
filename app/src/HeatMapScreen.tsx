import { motion } from 'motion/react';
import type { Cell, Group } from './heatmap';
import { heatColor, heatLabel } from './heatmap';
import { c, mono, COLUMN } from './theme';
import { Icon } from './Icon';

const TITLES: Record<Group, string> = { low: 'Low bands (below 1 GHz)', mid: 'Mid bands', high: 'High bands (mmWave)' };

// The heatmap screen: every band we teach as a tile, coloured by how well you remember it.
export function HeatMap({ cells, onBack }: { cells: Cell[]; onBack: () => void }) {
  return (
    <div data-testid="heatmap" style={{ maxWidth: COLUMN, margin: '0 auto', padding: 20, boxSizing: 'border-box' }}>
      <button data-testid="heatmap-back" onClick={onBack} style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 8px 0 0', border: 0, background: 'transparent', color: c.signal, fontSize: 16, cursor: 'pointer' }}><Icon name="back" size={20} />Back</button>
      <h1 style={{ margin: '8px 0 4px' }}>Band memory</h1>
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
                  initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.4, delay: i * 0.02 }}
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
