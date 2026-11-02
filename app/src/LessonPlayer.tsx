import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import rawConfetti from 'canvas-confetti';
import { prefs } from './prefs';
// Only the in-app switch turns confetti off (not Windows' setting). window.__confettiBursts lets the click test prove bursts fire.
const confetti = (o: Parameters<typeof rawConfetti>[0]) => { if (prefs.reduceMotion) return; (window as unknown as { __confettiBursts?: number }).__confettiBursts = ((window as unknown as { __confettiBursts?: number }).__confettiBursts ?? 0) + 1; rawConfetti({ disableForReducedMotion: false, ...o }); };
import { stars } from './lesson';
import type { Lesson } from './path';
import { beep } from './sound';
import { Mascot } from './Mascot';
import { SpectrumBar, rangesFor } from './SpectrumBar';
import { mark, rightAnswerText, isScored, correctOrder, type Answer, type Item, type Scored, type Photo, type Rect } from './questions';
import { startRun, advance, current, finished, scoredCount } from './session';
import { xpFor, signalBars } from './gamify';

export type LessonResult = { stars: number; xp: number; results: { id: string; ok: boolean }[] };

// Same shuffle every time for the same question (so a re-render never reshuffles), and never already in the right order.
function shuffled<T>(arr: T[], seed: string): T[] {
  let h = 7; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const a = arr.map((v, i) => [v, i] as const);
  for (let i = a.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  if (a.every(([, i], k) => i === k)) a.push(a.shift()!);
  return a.map(([v]) => v);
}
const btn = (bg: string): React.CSSProperties => ({ padding: '12px 32px', fontSize: 18, border: 0, borderRadius: 14, background: bg, color: '#fff', cursor: 'pointer' });
const tile = (bg: string, border = '#cfd8e0'): React.CSSProperties => ({ display: 'block', width: '100%', margin: '8px 0', padding: 12, fontSize: 18, borderRadius: 14, cursor: 'pointer', border: `2px solid ${border}`, background: bg, color: '#222' });

// A picture with its credit line. `outline` draws a box on it; `tap` makes it tappable (gives x, y as fractions); `dot` shows where the player tapped.
function PhotoView({ photo, outline, tap, dot, locked }: { photo: Photo; outline?: Rect; tap?: (x: number, y: number) => void; dot?: [number, number] | null; locked?: boolean }) {
  const [broken, setBroken] = useState(false);
  const box = (r: Rect): React.CSSProperties => ({ position: 'absolute', left: `${r.x * 100}%`, top: `${r.y * 100}%`, width: `${r.w * 100}%`, height: `${r.h * 100}%`, border: '3px solid #ff9600', borderRadius: 8, boxSizing: 'border-box', pointerEvents: 'none' });
  return (
    <figure style={{ margin: '8px 0' }}>
      <div data-testid="photo" role={tap ? 'button' : 'img'} aria-label={photo.alt}
        onClick={e => { if (!tap || locked) return; const b = e.currentTarget.getBoundingClientRect(); tap((e.clientX - b.left) / b.width, (e.clientY - b.top) / b.height); }}
        style={{ position: 'relative', lineHeight: 0, cursor: tap && !locked ? 'crosshair' : 'default', borderRadius: 14, overflow: 'hidden', background: '#dde6ee', minHeight: 120 }}>
        {broken ? <div style={{ lineHeight: 1.3, padding: 40, color: '#555' }}>🖼️ Picture not downloaded yet: {photo.alt}</div>
          : <img src={photo.src} alt={photo.alt} draggable={false} onError={() => setBroken(true)} style={{ width: '100%', display: 'block' }} />}
        {outline && <div data-testid="outline" style={box(outline)} />}
        {dot && <div data-testid="tap-dot" style={{ position: 'absolute', left: `${dot[0] * 100}%`, top: `${dot[1] * 100}%`, width: 16, height: 16, margin: -8, borderRadius: 8, background: '#e53935', border: '2px solid #fff', pointerEvents: 'none' }} />}
      </div>
      <figcaption data-testid="photo-credit" style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{photo.credit}</figcaption>
    </figure>);
}

function Question({ q, locked, picked, onSubmit }: { q: Scored; locked: boolean; picked?: Answer; onSubmit: (a: Answer) => void }) {
  const [text, setText] = useState('');
  const [left, setLeft] = useState<number | null>(null), [paired, setPaired] = useState<(number | null)[]>(() => (q.kind === 'match' ? q.pairs.map(() => null) : []));
  const [placed, setPlaced] = useState<string[]>([]);
  const [picks, setPicks] = useState<(number | null)[]>(() => (q.kind === 'scenario' ? q.clues.map(() => null) : []));
  const [tapped, setTapped] = useState<[number, number] | null>(null);
  const rightOrder = useMemo(() => (q.kind === 'match' ? shuffled(q.pairs.map((_, i) => i), q.id) : []), [q]);
  const orderPool = useMemo(() => (q.kind === 'order' ? shuffled(q.items.map(i => i.label), q.id) : []), [q]);
  if (q.kind === 'choice') return <>{q.choices.map((c, i) => (
    <motion.button key={c} data-testid={`choice-${i}`} disabled={locked} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.92 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }}
      onClick={() => onSubmit(i)} style={tile(!locked ? '#fff' : i === q.answer ? '#d7ffb8' : i === picked ? '#ffdfe0' : '#fff')}>{c}</motion.button>))}</>;
  if (q.kind === 'photo-choice') return <>
    <PhotoView photo={q.photo} outline={locked ? q.outline : undefined} />
    {q.choices.map((c, i) => (
      <motion.button key={c} data-testid={`choice-${i}`} disabled={locked} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.92 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }}
        onClick={() => onSubmit(i)} style={tile(!locked ? '#fff' : i === q.answer ? '#d7ffb8' : i === picked ? '#ffdfe0' : '#fff')}>{c}</motion.button>))}</>;
  if (q.kind === 'tap-clue') return <>
    <PhotoView photo={q.photo} outline={locked ? q.target : undefined} dot={tapped} locked={locked} tap={(x, y) => { setTapped([x, y]); onSubmit([x, y]); }} />
    <div style={{ fontSize: 14, color: '#666' }}>Tap the picture where you see it.</div></>;
  if (q.kind === 'number') return (
    <form onSubmit={e => { e.preventDefault(); if (!locked && text.trim()) onSubmit(text); }}>
      <input data-testid="number-input" autoFocus inputMode="decimal" value={text} disabled={locked} onChange={e => setText(e.target.value)} aria-label="Your answer"
        style={{ fontSize: 28, width: 160, textAlign: 'center', padding: 8, borderRadius: 12, border: '2px solid #cfd8e0' }} /> {q.unit}
      <div><button data-testid="check" type="submit" disabled={locked || !text.trim()} style={{ ...btn('#4a90d9'), marginTop: 12, opacity: text.trim() ? 1 : 0.5 }}>Check</button></div>
    </form>);
  if (q.kind === 'match') {
    const used = new Set(paired.filter(p => p !== null));
    const tap = (j: number) => { if (locked || left === null) return; setPaired(p => p.map((v, i) => (i === left ? j : v === j ? null : v))); setLeft(null); };
    const all = paired.every(p => p !== null);
    return <>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>{q.pairs.map((p, i) => (
          <button key={p[0]} data-testid={`match-left-${i}`} disabled={locked} onClick={() => setLeft(i)}
            style={tile(left === i ? '#dbeafe' : paired[i] !== null ? '#eef6e8' : '#fff', left === i ? '#4a90d9' : '#cfd8e0')}>{p[0]}{paired[i] !== null && <small> → {q.pairs[paired[i]!][1]}</small>}</button>))}</div>
        <div style={{ flex: 1 }}>{rightOrder.map(j => (
          <button key={q.pairs[j][1]} data-testid={`match-right-${j}`} disabled={locked} onClick={() => tap(j)} style={tile(used.has(j) ? '#eef6e8' : '#fff')}>{q.pairs[j][1]}</button>))}</div>
      </div>
      <button data-testid="check" disabled={locked || !all} onClick={() => onSubmit(paired as number[])} style={{ ...btn('#4a90d9'), marginTop: 12, opacity: all ? 1 : 0.5 }}>Check</button></>;
  }
  if (q.kind === 'scenario') {
    const all = picks.every(p => p !== null);
    return <>
      {q.clues.map((c, ci) => (
        <div key={c.text} data-testid={`clue-${ci}`} style={{ textAlign: 'left', margin: '10px 0' }}>
          <div style={{ fontSize: 17, marginBottom: 4 }}>🔎 {c.text}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{c.choices.map((ch, i) => (
            <button key={ch} data-testid={`clue-${ci}-choice-${i}`} disabled={locked} onClick={() => setPicks(p => p.map((v, k) => (k === ci ? i : v)))}
              style={{ ...tile(!locked ? (picks[ci] === i ? '#dbeafe' : '#fff') : i === c.answer ? '#d7ffb8' : picks[ci] === i ? '#ffdfe0' : '#fff', picks[ci] === i && !locked ? '#4a90d9' : '#cfd8e0'), width: 'auto', margin: 0, fontSize: 16 }}>{ch}</button>))}</div>
        </div>))}
      <button data-testid="check" disabled={locked || !all} onClick={() => onSubmit(picks as number[])} style={{ ...btn('#4a90d9'), marginTop: 12, opacity: all ? 1 : 0.5 }}>Check</button></>;
  }
  const rest = orderPool.filter(l => !placed.includes(l));
  return <>
    <div data-testid="order-placed" style={{ minHeight: 56, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', padding: 8, border: '2px dashed #cfd8e0', borderRadius: 14 }}>
      {placed.map((l, i) => <button key={l} data-testid={`order-placed-${i}`} disabled={locked} onClick={() => setPlaced(p => p.filter(x => x !== l))} style={{ ...tile('#dbeafe', '#4a90d9'), width: 'auto', margin: 0 }}>{i + 1}. {l}</button>)}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 10 }}>
      {rest.map(l => <button key={l} data-testid={`order-item-${l}`} disabled={locked} onClick={() => setPlaced(p => [...p, l])} style={{ ...tile('#fff'), width: 'auto', margin: 0 }}>{l}</button>)}
    </div>
    <button data-testid="check" disabled={locked || rest.length > 0} onClick={() => onSubmit(placed)} style={{ ...btn('#4a90d9'), marginTop: 12, opacity: rest.length ? 0.5 : 1 }}>Check</button></>;
}

function Feedback({ q, ok, a }: { q: Scored; ok: boolean; a: Answer }) {
  return (
    <motion.div data-testid="feedback" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ marginTop: 14, padding: 12, borderRadius: 14, textAlign: 'left', background: ok ? '#d7ffb8' : '#ffdfe0', color: '#222' }}>
      <strong data-testid="verdict">{ok ? 'Right!' : 'Not quite.'}</strong>
      {!ok && <div data-testid="right-answer">Right answer: {rightAnswerText(q)}</div>}
      {!ok && q.kind === 'choice' && typeof a === 'number' && <div>You picked: {q.choices[a]}</div>}
      {!ok && q.kind === 'number' && <div>You typed: {String(a)}</div>}
      {q.kind === 'scenario' && Array.isArray(a) && q.clues.map((c, i) => <div key={c.text} data-testid={`clue-why-${i}`} style={{ marginTop: 4 }}>{(a as number[])[i] === c.answer ? '✅' : '❌'} {c.text}: {c.choices[c.answer]}{c.why ? `. ${c.why}` : ''}</div>)}
      {q.why && <div data-testid="why" style={{ marginTop: 6 }}>{q.why}</div>}
      {q.badge && <div data-testid="badge" style={{ marginTop: 6, fontSize: 13 }}>{q.badge.status} · as of {q.badge.asOf}</div>}
      {q.kind === 'order' && <SpectrumBar testId="order-bar" ranges={correctOrder(q).map(l => q.items.find(i => i.label === l)!).map(i => ({ label: i.label, low: i.low, high: i.high }))} />}
    </motion.div>);
}

// Plays one lesson. Calls onFinish with the result when the player taps "Back to the path".
export function LessonPlayer({ lesson, onFinish, onQuit }: { lesson: Lesson; onFinish: (r: LessonResult) => void; onQuit: () => void }) {
  const [run, setRun] = useState(() => startRun(lesson.questions));
  const [res, setRes] = useState<{ ok: boolean; a: Answer } | null>(null);
  const [retriesRight, setRetriesRight] = useState(0);
  const done = finished(run), it: Item | undefined = current(run);
  const total = scoredCount(run), right = run.firstRight.length;
  const submit = (a: Answer) => {
    if (res || !it || !isScored(it)) return;
    const ok = mark(it, a); beep(ok); setRes({ ok, a });
    if (ok && run.seen.includes(it.id)) setRetriesRight(n => n + 1);
    if (ok) confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  };
  const next = (ok: boolean) => {
    const r = advance(run, ok); setRun(r); setRes(null);
    if (finished(r)) setTimeout(() => confetti({ particleCount: 200, spread: 120 }), 200);
  };
  const perfect = right === total;
  const xp = xpFor(right, retriesRight, perfect);
  const result = (): LessonResult => ({ stars: stars(right, total), xp, results: [...run.firstRight.map(id => ({ id, ok: true })), ...run.firstMissed.map(id => ({ id, ok: false }))] });
  const restart = () => { setRun(startRun(lesson.questions)); setRes(null); setRetriesRight(0); };
  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: 20, textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button data-testid="quit" onClick={onQuit} aria-label="Leave the lesson" style={{ border: 0, background: 'none', fontSize: 22, cursor: 'pointer' }}>✕</button>
        <div style={{ flex: 1, height: 10, background: '#dde6ee', borderRadius: 5, overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', background: '#58cc02' }} animate={{ width: `${(Math.min(run.index, run.queue.length) / run.queue.length) * 100}%` }} />
        </div>
      </div>
      <Mascot happy={!res || res.ok} />
      <AnimatePresence mode="wait">
        {!done && it ? (
          <motion.div key={`${run.index}-${it.id}`} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }}>
            {it.kind === 'learn' ? (
              <div data-testid="learn-card" style={{ textAlign: 'left' }}>
                <h2 data-testid="prompt" style={{ textAlign: 'center' }}>{it.title ?? 'Learn this'}</h2>
                <p style={{ fontSize: 18, lineHeight: 1.4 }}>{it.text}</p>
                {it.bars && <SpectrumBar ranges={rangesFor(it.bars)} />}
                {it.badge && <div data-testid="badge" style={{ fontSize: 13 }}>{it.badge.status} · as of {it.badge.asOf}</div>}
                <div style={{ textAlign: 'center' }}><button data-testid="learn-ok" onClick={() => next(true)} style={{ ...btn('#58cc02'), marginTop: 12 }}>Got it</button></div>
              </div>
            ) : (
              <>
                <h2 data-testid="prompt">{it.prompt}</h2>
                <Question key={it.id + run.index} q={it} locked={!!res} picked={res?.a} onSubmit={submit} />
                {res && <>
                  <Feedback q={it} ok={res.ok} a={res.a} />
                  <motion.button data-testid="next" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} whileTap={{ scale: 0.92 }} onClick={() => next(res.ok)}
                    style={{ ...btn('#58cc02'), marginTop: 10 }}>Continue</motion.button></>}
              </>
            )}
          </motion.div>
        ) : (
          <motion.div key="end" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <h2 data-testid="done">Lesson complete!</h2>
            <div style={{ fontSize: 40 }} data-testid="stars">{'⭐'.repeat(stars(right, total))}</div>
            <p>{right} of {total} right the first time</p>
            <p data-testid="xp">+{xp} XP</p>
            <p data-testid="bars" aria-label={`${signalBars(right, total)} of 5 signal bars`} style={{ fontSize: 28, margin: 0, letterSpacing: 2 }}>{'▮'.repeat(signalBars(right, total))}{'▯'.repeat(5 - signalBars(right, total))}</p>
            <button onClick={restart} style={{ ...btn('#4a90d9'), marginRight: 8 }}>Again</button>
            <button data-testid="finish" onClick={() => onFinish(result())} style={btn('#58cc02')}>Back to the path</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
