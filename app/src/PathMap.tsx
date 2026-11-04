import { motion } from 'motion/react';
import { allLessons, lessonStatus, doneCount, type Unit, type Progress } from './path';
import { c, mono, COLUMN } from './theme';
import { Icon } from './Icon';

// Done = on air (green glow), current = signal (bright), locked = dim with a dashed ring. R05 redraws the whole map.
const LOOK = {
  done: { background: c.onAirBg, color: c.onAir, border: `2px solid ${c.onAir}` },
  current: { background: c.signal, color: c.onBright, border: `2px solid ${c.signal}` },
  locked: { background: 'transparent', color: c.lockedIcon, border: `2px dashed ${c.locked}` },
};

// The path map: towers "come on air" (light up) as lessons get finished.
export function PathMap({ units, progress, onStart, due = 0, onReview }: { units: Unit[]; progress: Progress; onStart: (lessonId: string) => void; due?: number; onReview?: () => void }) {
  const total = allLessons(units).length;
  return (
    <div style={{ maxWidth: COLUMN, margin: '0 auto', padding: 20, textAlign: 'center', boxSizing: 'border-box' }}>
      <h1 style={{ margin: '0 0 4px' }}>Your path</h1>
      <p data-testid="path-count" style={{ margin: '0 0 16px', color: c.textMuted, ...mono, fontSize: 14 }}>{doneCount(units, progress)} of {total} lessons done</p>
      {onReview && (
        <motion.button data-testid="daily-review" disabled={due === 0} onClick={onReview} whileHover={due ? { scale: 1.04 } : undefined} whileTap={due ? { scale: 0.94 } : undefined}
          style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 14, cursor: due ? 'pointer' : 'default', fontWeight: due ? 700 : 400,
            border: `1px solid ${due ? c.review : c.border}`, color: due ? c.onBright : c.textMuted, background: due ? c.review : c.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Icon name="repeat" size={22} />{due ? `Daily review: ${due} due` : 'Daily review: nothing due today'}
        </motion.button>)}
      {units.map(u => (
        <section key={u.id} data-testid={`unit-${u.id}`}>
          <h3 style={{ margin: '24px 0 8px', color: c.text }}>{u.title}</h3>
          {u.lessons.map((l, i) => {
            const s = lessonStatus(units, progress, l.id), stars = progress[l.id] ?? 0;
            const open = s !== 'locked';
            return (
              <div key={l.id} style={{ marginLeft: i % 2 ? 50 : -50 }}>
                <motion.button data-testid={`lesson-${l.id}`} data-status={s} disabled={!open} onClick={() => onStart(l.id)}
                  aria-label={`${l.title}, ${s}`}
                  initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: i * 0.08 }}
                  whileHover={open ? { scale: 1.1 } : undefined} whileTap={open ? { scale: 0.9 } : undefined}
                  style={{ width: 76, height: 76, borderRadius: '50%', margin: '10px 0 2px', display: 'inline-grid', placeItems: 'center',
                    ...LOOK[s], cursor: open ? 'pointer' : 'not-allowed',
                    // A still glow ring (not animated): the current lesson is "on air next".
                    boxShadow: s === 'current' ? `0 0 0 6px ${c.surface2}, 0 0 0 8px ${c.borderStrong}` : 'none' }}>
                  <Icon name={s === 'locked' ? 'lock' : s === 'done' ? 'check' : 'tower'} size={s === 'locked' ? 28 : 38} />
                </motion.button>
                <div style={{ fontSize: 14, color: s === 'locked' ? c.textMuted : c.text }}>{l.title}</div>
                {stars > 0 && <div data-testid={`stars-${l.id}`} data-count={stars} aria-label={`${stars} of 3 stars`} style={{ color: c.streak, display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
                  {Array.from({ length: stars }, (_, k) => <Icon key={k} name="star" size={16} solid />)}</div>}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
