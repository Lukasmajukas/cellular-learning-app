import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useIsPresent } from 'motion/react';
import rawConfetti from 'canvas-confetti';
import { prefs } from './prefs';
import { c, mono } from './theme';
// Confetti draws on a canvas, so it needs real colour codes: read the current look's token values.
const burstColors = () => ['--signal', '--on-air', '--streak', '--review'].map(v => getComputedStyle(document.documentElement).getPropertyValue(v).trim()).filter(Boolean);
// Only the in-app switch turns confetti off (not Windows' setting). window.__confettiBursts lets the click test prove bursts fire.
const confetti = (o: Parameters<typeof rawConfetti>[0]) => { if (prefs.reduceMotion) return; (window as unknown as { __confettiBursts?: number }).__confettiBursts = ((window as unknown as { __confettiBursts?: number }).__confettiBursts ?? 0) + 1; rawConfetti({ disableForReducedMotion: false, colors: burstColors(), ...o }); };
import { stars } from './lesson';
import type { Lesson } from './path';
import { beep } from './sound';
import { Beacon, BEACON_SIZE } from './ui/Beacon';
import { Icon, SignalBars } from './Icon';
import { SpectrumBar, rangesFor } from './SpectrumBar';
import { mark, rightAnswerText, isScored, correctOrder, shuffleOrder, type Answer, type Item, type Scored, type Photo, type Rect } from './questions';
import { startRun, advance, current, finished, scoredCount } from './session';
import { xpFor, signalBars } from './gamify';
import { AnswerTile, Button, IconButton, ProgressBar, BottomSheet, SpeechBubble, SectionLabel, type TileState } from './ui';
import { SPRING, TIME, useCalm } from './theme/motion';
import { KIND_LABEL, counter, beaconLine } from './questionScreen';
import { useKeys, pressFor } from './keys';

export type LessonResult = { stars: number; xp: number; results: { id: string; ok: boolean }[] };

// Same shuffle every time for the same question (so a re-render never reshuffles), and never already in the right order.
function shuffled<T>(arr: T[], seed: string): T[] {
  let h = 7; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const a = arr.map((v, i) => [v, i] as const);
  for (let i = a.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  if (a.every(([, i], k) => i === k)) a.push(a.shift()!);
  return a.map(([v]) => v);
}
// Bright buttons (signal / on-air) always carry dark text (DESIGN.md: "Text on signal, on-air, miss buttons").
const btn = (bg: string): React.CSSProperties => ({ padding: '12px 32px', fontSize: 18, fontWeight: 700, border: 0, borderRadius: 14, background: bg, color: c.onBright, cursor: 'pointer' });
const tile = (bg: string, border: string = c.border): React.CSSProperties => ({ display: 'block', width: '100%', margin: '8px 0', padding: 12, fontSize: 18, borderRadius: 14, cursor: 'pointer', border: `1.5px solid ${border}`, background: bg, color: c.text });
// An answer tile's look: plain while answering; after checking, the right one is "on air" green and a wrong pick is "miss" red.
const answerLook = (locked: boolean, right: boolean, picked: boolean): [string, string] =>
  !locked ? [c.surface, c.border] : right ? [c.onAirBg, c.onAir] : picked ? [c.missBg, c.miss] : [c.surface, c.border];
// The same idea for the numbered answer tiles (src/ui/AnswerTile.tsx): idle, then right / wrong (your pick) / dim (the rest).
const tileState = (locked: boolean, right: boolean, picked: boolean): TileState => !locked ? 'idle' : right ? 'right' : picked ? 'wrong' : 'dim';
// The answer tiles of a pick-one question, numbered 1, 2, 3... in the order they're shown. Keys 1-9 press them (data-pick).
function Choices({ q, order, locked, picked, onSubmit }: { q: { choices: string[]; answer: number }; order: number[]; locked: boolean; picked?: Answer; onSubmit: (a: Answer) => void }) {
  return <>{order.map((i, k) => (
    <AnswerTile key={q.choices[i]} n={k + 1} data-pick={k + 1} aria-keyshortcuts={String(k + 1)} data-testid={`choice-${i}`} disabled={locked}
      state={tileState(locked, i === q.answer, i === picked)} onClick={() => onSubmit(i)}>{q.choices[i]}</AnswerTile>))}</>;
}

// A picture with its credit line. `outline` draws a box on it; `tap` makes it tappable (gives x, y as fractions); `dot` shows where the player tapped.
function PhotoView({ photo, outline, tap, dot, locked }: { photo: Photo; outline?: Rect; tap?: (x: number, y: number) => void; dot?: [number, number] | null; locked?: boolean }) {
  const [broken, setBroken] = useState(false);
  const box = (r: Rect): React.CSSProperties => ({ position: 'absolute', left: `${r.x * 100}%`, top: `${r.y * 100}%`, width: `${r.w * 100}%`, height: `${r.h * 100}%`, border: `3px solid ${c.streak}`, borderRadius: 8, boxSizing: 'border-box', pointerEvents: 'none' });
  return (
    <figure style={{ margin: '8px 0' }}>
      <div data-testid="photo" role={tap ? 'button' : 'img'} aria-label={photo.alt}
        onClick={e => { if (!tap || locked) return; const b = e.currentTarget.getBoundingClientRect(); tap((e.clientX - b.left) / b.width, (e.clientY - b.top) / b.height); }}
        style={{ position: 'relative', lineHeight: 0, cursor: tap && !locked ? 'crosshair' : 'default', borderRadius: 14, overflow: 'hidden', background: c.surface2, minHeight: 120 }}>
        {broken ? <div style={{ lineHeight: 1.3, padding: 40, color: c.textMuted }}><Icon name="image" size={32} style={{ display: 'block', margin: '0 auto 8px' }} />Picture not downloaded yet: {photo.alt}</div>
          : <img src={photo.src} alt={photo.alt} draggable={false} onError={() => setBroken(true)} style={{ width: '100%', display: 'block' }} />}
        {outline && <div data-testid="outline" style={box(outline)} />}
        {dot && <div data-testid="tap-dot" style={{ position: 'absolute', left: `${dot[0] * 100}%`, top: `${dot[1] * 100}%`, width: 16, height: 16, margin: -8, borderRadius: 8, background: c.miss, border: `2px solid ${c.text}`, pointerEvents: 'none' }} />}
      </div>
      <figcaption data-testid="photo-credit" style={{ fontSize: 12, color: c.textMuted, marginTop: 4 }}>{photo.credit}</figcaption>
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
  // Answer buttons come in a new random order each time a question is shown (the lesson files mostly list the right one first).
  // Buttons keep their written number in data-testid and in what they submit, so marking doesn't change.
  const choiceOrder = useMemo(() => (q.kind === 'choice' || q.kind === 'photo-choice' ? shuffleOrder(q.choices.length) : []), [q]);
  const clueOrders = useMemo(() => (q.kind === 'scenario' ? q.clues.map(clue => shuffleOrder(clue.choices.length)) : []), [q]);
  if (q.kind === 'choice') return <Choices q={q} order={choiceOrder} locked={locked} picked={picked} onSubmit={onSubmit} />;
  if (q.kind === 'photo-choice') return <>
    <PhotoView photo={q.photo} outline={locked ? q.outline : undefined} />
    <Choices q={q} order={choiceOrder} locked={locked} picked={picked} onSubmit={onSubmit} /></>;
  if (q.kind === 'tap-clue') return <>
    <PhotoView photo={q.photo} outline={locked ? q.target : undefined} dot={tapped} locked={locked} tap={(x, y) => { setTapped([x, y]); onSubmit([x, y]); }} />
    <div style={{ fontSize: 14, color: c.textMuted }}>Tap the picture where you see it.</div></>;
  if (q.kind === 'number') return (
    <form onSubmit={e => { e.preventDefault(); if (!locked && text.trim()) onSubmit(text); }}>
      <input data-testid="number-input" autoFocus inputMode="decimal" value={text} disabled={locked} onChange={e => setText(e.target.value)} aria-label="Your answer"
        style={{ fontSize: 28, width: 160, textAlign: 'center', padding: 8, borderRadius: 12, border: `1.5px solid ${c.borderStrong}`, background: c.surface, color: c.text, ...mono }} /> {q.unit}
      <div><button data-testid="check" data-primary aria-keyshortcuts="Enter" type="submit" disabled={locked || !text.trim()} style={{ ...btn(c.signal), marginTop: 12, opacity: text.trim() ? 1 : 0.5 }}>Check</button></div>
    </form>);
  if (q.kind === 'match') {
    const used = new Set(paired.filter(p => p !== null));
    const tap = (j: number) => { if (locked || left === null) return; setPaired(p => p.map((v, i) => (i === left ? j : v === j ? null : v))); setLeft(null); };
    const all = paired.every(p => p !== null);
    return <>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>{q.pairs.map((p, i) => (
          <button key={p[0]} data-testid={`match-left-${i}`} disabled={locked} onClick={() => setLeft(i)}
            style={tile(left === i || paired[i] !== null ? c.surface2 : c.surface, left === i ? c.signal : paired[i] !== null ? c.borderStrong : c.border)}>{p[0]}{paired[i] !== null && <small style={{ color: c.textMuted }}> <Icon name="chevron" size={14} label="goes with" /> {q.pairs[paired[i]!][1]}</small>}</button>))}</div>
        <div style={{ flex: 1 }}>{rightOrder.map(j => (
          <button key={q.pairs[j][1]} data-testid={`match-right-${j}`} disabled={locked} onClick={() => tap(j)} style={tile(used.has(j) ? c.surface2 : c.surface, used.has(j) ? c.borderStrong : c.border)}>{q.pairs[j][1]}</button>))}</div>
      </div>
      <button data-testid="check" data-primary aria-keyshortcuts="Enter" disabled={locked || !all} onClick={() => onSubmit(paired as number[])} style={{ ...btn(c.signal), marginTop: 12, opacity: all ? 1 : 0.5 }}>Check</button></>;
  }
  if (q.kind === 'scenario') {
    const all = picks.every(p => p !== null);
    return <>
      {q.clues.map((clue, ci) => (
        <div key={clue.text} data-testid={`clue-${ci}`} style={{ textAlign: 'left', margin: '10px 0' }}>
          <div style={{ fontSize: 17, marginBottom: 4, display: 'flex', gap: 8, alignItems: 'flex-start' }}><Icon name="search" size={20} style={{ color: c.signal, marginTop: 1 }} /><span>{clue.text}</span></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{clueOrders[ci].map(i => [clue.choices[i], i] as const).map(([ch, i]) => (
            <button key={ch} data-testid={`clue-${ci}-choice-${i}`} disabled={locked} onClick={() => setPicks(p => p.map((v, k) => (k === ci ? i : v)))}
              style={{ ...tile(...(!locked && picks[ci] === i ? [c.surface2, c.signal] as [string, string] : answerLook(locked, i === clue.answer, picks[ci] === i))), width: 'auto', margin: 0, fontSize: 16 }}>{ch}</button>))}</div>
        </div>))}
      <button data-testid="check" data-primary aria-keyshortcuts="Enter" disabled={locked || !all} onClick={() => onSubmit(picks as number[])} style={{ ...btn(c.signal), marginTop: 12, opacity: all ? 1 : 0.5 }}>Check</button></>;
  }
  const rest = orderPool.filter(l => !placed.includes(l));
  return <>
    <div data-testid="order-placed" style={{ minHeight: 56, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', padding: 8, border: `2px dashed ${c.borderStrong}`, borderRadius: 14 }}>
      {placed.map((l, i) => <button key={l} data-testid={`order-placed-${i}`} disabled={locked} onClick={() => setPlaced(p => p.filter(x => x !== l))} style={{ ...tile(c.surface2, c.signal), width: 'auto', margin: 0 }}>{i + 1}. {l}</button>)}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 10 }}>
      {rest.map(l => <button key={l} data-testid={`order-item-${l}`} disabled={locked} onClick={() => setPlaced(p => [...p, l])} style={{ ...tile(c.surface), width: 'auto', margin: 0 }}>{l}</button>)}
    </div>
    <button data-testid="check" data-primary aria-keyshortcuts="Enter" disabled={locked || rest.length > 0} onClick={() => onSubmit(placed)} style={{ ...btn(c.signal), marginTop: 12, opacity: rest.length ? 0.5 : 1 }}>Check</button></>;
}

// What the bottom sheet explains after an answer (R09: the sheet itself is the box, with the verdict as its title).
function Feedback({ q, ok, a }: { q: Scored; ok: boolean; a: Answer }) {
  return (
    <div data-testid="explain">
      {!ok && <div data-testid="right-answer"><strong>Right answer:</strong> {rightAnswerText(q)}</div>}
      {!ok && q.kind === 'choice' && typeof a === 'number' && <div>You picked: {q.choices[a]}</div>}
      {!ok && q.kind === 'number' && <div>You typed: {String(a)}</div>}
      {q.kind === 'scenario' && Array.isArray(a) && q.clues.map((clue, i) => <div key={clue.text} data-testid={`clue-why-${i}`} data-ok={(a as number[])[i] === clue.answer} style={{ marginTop: 4, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
        {(a as number[])[i] === clue.answer ? <Icon name="check" size={18} label="Right:" style={{ color: c.onAir, marginTop: 2 }} /> : <Icon name="cross" size={18} label="Missed:" style={{ color: c.miss, marginTop: 2 }} />}
        <span>{clue.text}: {clue.choices[clue.answer]}{clue.why ? `. ${clue.why}` : ''}</span></div>)}
      {q.why && <div data-testid="why" style={{ marginTop: 6 }}>{q.why}</div>}
      {q.badge && <div data-testid="badge" style={{ marginTop: 6, fontSize: 13, color: c.textMuted, ...mono }}>{q.badge.status} · as of {q.badge.asOf}</div>}
      {q.kind === 'order' && <SpectrumBar testId="order-bar" ranges={correctOrder(q).map(l => q.items.find(i => i.label === l)!).map(i => ({ label: i.label, low: i.low, high: i.high }))} />}
    </div>);
}

// Plays one lesson. Calls onFinish with the result when the player taps "Back to the path".
// The question screen (redesign R09, look A): a top row (leave, progress bar, "5 / 12"), Beacon at the left with a
// speech bubble, a small label ("PICK ONE"), the question, numbered answer tiles, and after an answer the bottom sheet
// ("Right!" / "Not quite") with a Continue button in the sheet's own colour.
export function LessonPlayer({ lesson, onFinish, onQuit }: { lesson: Lesson; onFinish: (r: LessonResult) => void; onQuit: () => void }) {
  const [run, setRun] = useState(() => startRun(lesson.questions));
  const [res, setRes] = useState<{ ok: boolean; a: Answer } | null>(null);
  const [retriesRight, setRetriesRight] = useState(0);
  // What the sheet shows. Kept after Continue, so the sheet keeps its words while it slides away (the next question is already in).
  const [shown, setShown] = useState<{ q: Scored; ok: boolean; a: Answer } | null>(null);
  const [sheetH, setSheetH] = useState(0);
  // Leaving the lesson clears its confetti (and a burst still waiting to start), so it doesn't keep falling over the path
  // while "coming on air" plays: two celebrations at once (idea I23), and on a computer without a graphics chip the
  // confetti and the path's moment fight for the same processor (design review 1: 47.9-49.8 fps on GitHub's Windows machines).
  const burst = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => { clearTimeout(burst.current); rawConfetti.reset(); }, []);
  const done = finished(run), it: Item | undefined = current(run);
  const total = scoredCount(run), right = run.firstRight.length;
  const submit = (a: Answer) => {
    if (res || !it || !isScored(it)) return;
    const ok = mark(it, a); setRes({ ok, a }); setShown({ q: it, ok, a });
    if (ok && run.seen.includes(it.id)) setRetriesRight(n => n + 1);
    // The sound and the confetti start on the next frame, after the answer and Beacon's new face are drawn (R17: Beacon
    // must react within 0.1 s). Inside the click, the first answer's sound set-up alone held the face back ~55 ms.
    // R11 drops this confetti (idea I31); R19 brings the new sounds.
    requestAnimationFrame(() => { beep(ok); if (ok) confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } }); });
  };
  const next = (ok: boolean) => {
    const r = advance(run, ok); setRun(r); setRes(null);
    if (finished(r)) burst.current = setTimeout(() => confetti({ particleCount: 200, spread: 120 }), TIME.burstWait * 1000);
  };
  const perfect = right === total;
  const xp = xpFor(right, retriesRight, perfect);
  const result = (): LessonResult => ({ stars: stars(right, total), xp, results: [...run.firstRight.map(id => ({ id, ok: true })), ...run.firstMissed.map(id => ({ id, ok: false }))] });
  const restart = () => { setRun(startRun(lesson.questions)); setRes(null); setRetriesRight(0); };
  // Send the result only once, even if "Back to the path" is pressed twice while the lesson glides away.
  const sent = useRef(false);
  const finish = () => { if (sent.current) return; sent.current = true; onFinish(result()); };
  // Keys (src/keys.ts): 1-9 pick an answer tile, Enter presses the main button, Esc leaves. Off while the lesson glides away.
  // The sheet lives outside the lesson's box (see BottomSheet), so Enter looks for its Continue button there too.
  const root = useRef<HTMLDivElement>(null);
  const present = useIsPresent(), calm = useCalm();
  useKeys(k => (k === 'back' ? (onQuit(), true) : pressFor(root.current, k) || (k === 'enter' && pressFor(document.querySelector('[data-testid=feedback]'), k))), present);
  // After an answer, if the sheet covers the bottom of the question (a picture question, a short window), scroll just
  // enough to show it above the sheet, so you can see which tile was right.
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = body.current;
    if (!res || !sheetH || !el) return;
    const hidden = el.getBoundingClientRect().bottom - (window.innerHeight - sheetH) + 12;
    if (hidden > 0) window.scrollBy({ top: hidden, behavior: calm ? 'auto' : 'smooth' });
  }, [res, sheetH, calm]);
  const face = done ? 'cheering' : !res ? 'idle' : res.ok ? 'happy' : 'oops';
  const says = !it || done ? '' : res ? beaconLine(res.ok ? 'right' : 'wrong', `${it.id}-${run.index}`) : beaconLine(it.kind === 'learn' ? 'learn' : 'ask', `${it.id}-${run.index}`);
  return (
    <div ref={root} style={{ maxWidth: 440, margin: '0 auto', padding: `20px 20px ${20 + sheetH}px`, boxSizing: 'border-box', textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <IconButton icon="close" label="Leave the lesson (Esc)" data-testid="quit" onClick={onQuit} aria-keyshortcuts="Escape" style={{ marginLeft: -10 }} />
        <div style={{ flex: 1 }}><ProgressBar testId="lesson-progress" label="Lesson progress" height={12} value={Math.min(run.index, run.queue.length) / run.queue.length} /></div>
        <span data-testid="lesson-count" aria-label={`Question ${counter(run.index, run.queue.length).replace(' / ', ' of ')}`}
          style={{ ...mono, fontSize: 13, color: c.textMuted, fontVariantNumeric: 'tabular-nums', minWidth: 44, textAlign: 'right' }}>{counter(run.index, run.queue.length)}</span>
      </div>
      {/* Beacon's spot (R09): at the left, with what it says beside it. It waits, is happy or a little worried within 0.1 s
          of an answer (R17), and cheers, bigger and centred, when the lesson is done (R12 reworks that screen). */}
      {!done ? (
        <div data-testid="beacon-spot" style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 6, minHeight: 79 }}>
          <Beacon face={face} size={BEACON_SIZE.question} />
          {says && <SpeechBubble key={says} data-testid="beacon-says" style={{ marginBottom: 8 }}>{says}</SpeechBubble>}
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}><Beacon face={face} size={BEACON_SIZE.complete} /></div>
      )}
      {/* initial={false}: the first question is already in place while the whole lesson rises (R04); later ones slide in. */}
      <AnimatePresence mode="wait" initial={false}>
        {!done && it ? (
          <motion.div ref={body} key={`${run.index}-${it.id}`} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }}>
            {it.kind === 'learn' ? (
              <div data-testid="learn-card">
                <h2 data-testid="prompt" style={{ textAlign: 'center' }}>{it.title ?? 'Learn this'}</h2>
                <p style={{ fontSize: 18, lineHeight: 1.4 }}>{it.text}</p>
                {it.bars && <SpectrumBar ranges={rangesFor(it.bars)} />}
                {it.badge && <div data-testid="badge" style={{ fontSize: 13, color: c.textMuted, ...mono }}>{it.badge.status} · as of {it.badge.asOf}</div>}
                <div style={{ textAlign: 'center' }}><button data-testid="learn-ok" data-primary aria-keyshortcuts="Enter" onClick={() => next(true)} style={{ ...btn(c.onAir), marginTop: 12 }}>Got it</button></div>
              </div>
            ) : (
              <>
                <SectionLabel data-testid="kind-label" tone="signal" style={{ margin: '14px 0 0' }}>{KIND_LABEL[it.kind]}</SectionLabel>
                <h2 data-testid="prompt" style={{ fontSize: 23, lineHeight: 1.25, fontWeight: 700, margin: '6px 0 12px' }}>{it.prompt}</h2>
                {/* The other question types keep their old layout (centred) until R10 redraws them. */}
                <div style={{ textAlign: it.kind === 'choice' || it.kind === 'photo-choice' ? 'left' : 'center' }}>
                  <Question key={it.id + run.index} q={it} locked={!!res} picked={res?.a} onSubmit={submit} />
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div key="end" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={SPRING.bouncy} style={{ textAlign: 'center' }}>
            <h2 data-testid="done">Lesson complete!</h2>
            <div data-testid="stars" data-count={stars(right, total)} aria-label={`${stars(right, total)} of 3 stars`} style={{ display: 'flex', justifyContent: 'center', gap: 8, color: c.streak, minHeight: 44 }}>
              {[0, 1, 2].map(k => <Icon key={k} name="star" size={44} solid={k < stars(right, total)} style={{ opacity: k < stars(right, total) ? 1 : 0.35 }} />)}</div>
            <p>{right} of {total} right the first time</p>
            <p data-testid="xp" style={{ ...mono, fontSize: 28, color: c.signal, margin: '8px 0' }}>+{xp} XP</p>
            <p data-testid="bars" data-count={signalBars(right, total)} aria-label={`${signalBars(right, total)} of 5 signal bars`} style={{ margin: '0 0 16px', color: c.onAir }}><SignalBars on={signalBars(right, total)} size={40} /></p>
            <button onClick={restart} style={{ ...btn(c.signal), marginRight: 8 }}>Again</button>
            <button data-testid="finish" data-primary aria-keyshortcuts="Enter" onClick={finish} style={btn(c.onAir)}>Back to the path</button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* The bottom sheet (R03's block; design review 1: Continue in the sheet's colour, red after "Not quite", as in look A).
          It slides away with the lesson when you leave (present), and keeps its words while it goes. */}
      <BottomSheet open={!!res && present} tone={shown?.ok ? 'right' : 'wrong'} testId="feedback" onHeight={setSheetH}
        title={<span data-testid="verdict">{shown?.ok ? 'Right!' : 'Not quite'}</span>}
        action={<Button full big kind={shown?.ok ? 'onAir' : 'miss'} data-testid="next" data-primary aria-keyshortcuts="Enter" onClick={() => res && next(res.ok)}>Continue</Button>}>
        {shown && <Feedback q={shown.q} ok={shown.ok} a={shown.a} />}
      </BottomSheet>
    </div>
  );
}
