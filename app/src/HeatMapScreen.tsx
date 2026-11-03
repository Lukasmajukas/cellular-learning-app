import { motion } from 'motion/react';
import type { Cell, Group } from './heatmap';
import { heatColor, heatLabel } from './heatmap';

const TITLES: Record<Group, string> = { low: 'Low bands (below 1 GHz)', mid: 'Mid bands', high: 'High bands (mmWave)' };

// The heatmap screen: every band we teach as a tile, coloured by how well you remember it.
export function HeatMap({ cells, onBack }: { cells: Cell[]; onBack: () => void }) {
  return (
    <div data-testid="heatmap" style={{ maxWidth: 440, margin: '0 auto', padding: 20 }}>
      <button data-testid="heatmap-back" onClick={onBack} style={{ border: 0, background: 'transparent', fontSize: 16, cursor: 'pointer' }}>← Back</button>
      <h1 style={{ margin: '8px 0 4px' }}>Band memory</h1>
      <p style={{ margin: '0 0 12px', color: '#667' }}>Green = you know it. Red = it is fading, so review it. Grey = you have not been quizzed on it yet.</p>
      {(['low', 'mid', 'high'] as Group[]).map(g => {
        const row = cells.filter(c => c.group === g);
        if (!row.length) return null;
        return (
          <section key={g}>
            <h3 style={{ margin: '16px 0 8px' }}>{TITLES[g]}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {row.map((c, i) => (
                <motion.div key={c.id} data-testid={`heat-${c.id}`} data-label={heatLabel(c.score)}
                  title={`${c.id}: ${c.score === null ? 'not quizzed yet' : Math.round(c.score * 100) + '% remembered'}`}
                  aria-label={`${c.id}, ${heatLabel(c.score)}`}
                  initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.4, delay: i * 0.02 }}
                  style={{ minWidth: 58, padding: '8px 6px', borderRadius: 10, textAlign: 'center', background: heatColor(c.score), color: c.score === null ? '#445' : '#111', fontWeight: 600 }}>
                  {c.id}
                  <div style={{ fontSize: 11, fontWeight: 400 }}>{c.score === null ? 'new' : `${Math.round(c.score * 100)}%`}</div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
