import { motion } from 'motion/react';
import { allLessons, lessonStatus, doneCount, type Unit, type Progress } from './path';

const COLORS = { done: '#58cc02', current: '#4a90d9', locked: '#cfd8e0' };

// The path map: towers "come on air" (light up) as lessons get finished.
export function PathMap({ units, progress, onStart, due = 0, onReview }: { units: Unit[]; progress: Progress; onStart: (lessonId: string) => void; due?: number; onReview?: () => void }) {
  const total = allLessons(units).length;
  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 20, textAlign: 'center' }}>
      <h1 style={{ margin: '0 0 4px' }}>Your path</h1>
      <p data-testid="path-count" style={{ margin: '0 0 16px', color: '#667' }}>{doneCount(units, progress)} of {total} lessons done</p>
      {onReview && (
        <motion.button data-testid="daily-review" disabled={due === 0} onClick={onReview} whileHover={due ? { scale: 1.04 } : undefined} whileTap={due ? { scale: 0.94 } : undefined}
          style={{ width: '100%', padding: 14, fontSize: 18, border: 0, borderRadius: 14, color: '#fff', cursor: due ? 'pointer' : 'default', background: due ? '#ff9600' : '#cfd8e0' }}>
          {due ? `🚗 Daily review: ${due} due` : '🚗 Daily review: nothing due today'}
        </motion.button>)}
      {units.map(u => (
        <section key={u.id} data-testid={`unit-${u.id}`}>
          <h3 style={{ margin: '24px 0 8px' }}>{u.title}</h3>
          {u.lessons.map((l, i) => {
            const s = lessonStatus(units, progress, l.id), stars = progress[l.id] ?? 0;
            const open = s !== 'locked';
            return (
              <div key={l.id} style={{ marginLeft: i % 2 ? 50 : -50 }}>
                <motion.button data-testid={`lesson-${l.id}`} data-status={s} disabled={!open} onClick={() => onStart(l.id)}
                  aria-label={`${l.title}, ${s}`}
                  initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: i * 0.08 }}
                  whileHover={open ? { scale: 1.1 } : undefined} whileTap={open ? { scale: 0.9 } : undefined}
                  style={{ width: 76, height: 76, borderRadius: '50%', border: 0, margin: '10px 0 2px', fontSize: 30,
                    background: COLORS[s], color: '#fff', cursor: open ? 'pointer' : 'not-allowed',
                    boxShadow: s === 'current' ? '0 0 0 6px rgba(74,144,217,.3)' : 'none' }}>
                  {s === 'locked' ? '🔒' : s === 'done' ? '✓' : '📡'}
                </motion.button>
                <div style={{ fontSize: 14 }}>{l.title}</div>
                {stars > 0 && <div data-testid={`stars-${l.id}`}>{'⭐'.repeat(stars)}</div>}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
