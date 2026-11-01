import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import rawConfetti from 'canvas-confetti';
import { prefs } from './prefs';
const confetti = (o: Parameters<typeof rawConfetti>[0]) => { if (!prefs.reduceMotion) rawConfetti(o); };
import { isCorrect, stars } from './lesson';
import type { Lesson } from './path';
import { beep } from './sound';
import { Mascot } from './Mascot';

// Plays one lesson. Calls onFinish with the stars earned when the player taps "Back to the path".
export function LessonPlayer({ lesson, onFinish, onQuit }: { lesson: Lesson; onFinish: (stars: number) => void; onQuit: () => void }) {
  const qs = lesson.questions;
  const [n, setN] = useState(0), [right, setRight] = useState(0), [picked, setPicked] = useState<number | null>(null);
  const done = n >= qs.length, q = qs[n];
  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i); const ok = isCorrect(q, i); beep(ok);
    if (ok) { setRight(r => r + 1); confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } }); }
  };
  const next = () => {
    const last = n + 1 >= qs.length;
    setPicked(null); setN(n + 1);
    if (last) setTimeout(() => confetti({ particleCount: 200, spread: 120 }), 200);
  };
  const restart = () => { setN(0); setRight(0); setPicked(null); };
  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 20, textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button data-testid="quit" onClick={onQuit} aria-label="Leave the lesson" style={{ border: 0, background: 'none', fontSize: 22, cursor: 'pointer' }}>✕</button>
        <div style={{ flex: 1, height: 10, background: '#dde6ee', borderRadius: 5, overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', background: '#58cc02' }} animate={{ width: `${(Math.min(n, qs.length) / qs.length) * 100}%` }} />
        </div>
      </div>
      <Mascot happy={picked === null || (!!q && isCorrect(q, picked))} />
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={n} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }}>
            <h2 data-testid="prompt">{q.prompt}</h2>
            {q.choices.map((c, i) => {
              const state = picked === null ? '' : i === q.answer ? 'right' : i === picked ? 'wrong' : '';
              return (
                <motion.button key={c} data-testid={`choice-${i}`} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 12 }} onClick={() => pick(i)}
                  style={{ display: 'block', width: '100%', margin: '10px 0', padding: 14, fontSize: 18, borderRadius: 14, cursor: 'pointer',
                    border: '2px solid #cfd8e0', background: state === 'right' ? '#d7ffb8' : state === 'wrong' ? '#ffdfe0' : '#fff' }}>{c}</motion.button>);
            })}
            {picked !== null && (
              <motion.button data-testid="next" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} whileTap={{ scale: 0.92 }} onClick={next}
                style={{ marginTop: 10, padding: '12px 32px', fontSize: 18, border: 0, borderRadius: 14, background: '#58cc02', color: '#fff', cursor: 'pointer' }}>Continue</motion.button>)}
          </motion.div>
        ) : (
          <motion.div key="end" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <h2 data-testid="done">Lesson complete!</h2>
            <div style={{ fontSize: 40 }} data-testid="stars">{'⭐'.repeat(stars(right, qs.length))}</div>
            <p>{right} of {qs.length} right</p>
            <button onClick={restart} style={{ padding: '12px 32px', fontSize: 18, border: 0, borderRadius: 14, background: '#4a90d9', color: '#fff', cursor: 'pointer', marginRight: 8 }}>Again</button>
            <button data-testid="finish" onClick={() => onFinish(stars(right, qs.length))}
              style={{ padding: '12px 32px', fontSize: 18, border: 0, borderRadius: 14, background: '#58cc02', color: '#fff', cursor: 'pointer' }}>Back to the path</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
