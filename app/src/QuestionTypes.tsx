// The bodies of every question type, and what the "Right!" / "Not quite" sheet explains (redesign R10, Night Signal).
// Moved out of LessonPlayer.tsx in R10. Everything sits on the question's left edge, under the label and the question,
// built from the R03 blocks: numbered answer tiles, chips, cards, and one full-width Check button.
//   pick one / photo:   numbered tiles (keys 1-9 pick them), the photo above with its credit
//   type the number:    one big box in the code font, with its unit (MHz) inside on the right
//   match the pairs:    two columns; the left ones are numbered, and a right one shows the number of its partner
//   put them in order:  numbered slots (dashed until filled), the items as chips underneath
//   read the clues:     one card per clue, its answers as chips
//   tap the picture:    the photo; after a tap, a dot (green or red) where you tapped
// After Check, every tile and chip shows right (green + tick) or wrong (red + cross), so colour is never the only clue.
// R11: and it moves a little: the right one pops and glows, a wrong one shakes gently (src/ui/feedback.tsx); order
// chips glide into their slots and back (Fly). With Reduce motion only the looks change.
import { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { c, mono, RADIUS } from './theme';
import { Icon } from './Icon';
import { SpectrumBar } from './SpectrumBar';
import { mark, rightAnswerText, correctOrder, shuffleOrder, type Answer, type Scored, type Photo, type Rect, type Badge } from './questions';
import { AnswerTile, Button, Card, Chip, Fly, Glow, useFeedback, type Places, type TileState } from './ui';
import { FEEDBACK, useCalm, useEntrance } from './theme/motion';
import { KIND_HINT, FOLD_LABEL } from './questionScreen';

// Same shuffle every time for the same question (so a re-render never reshuffles), and never already in the right order.
export function shuffled<T>(arr: T[], seed: string): T[] {
  let h = 7; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const a = arr.map((v, i) => [v, i] as const);
  for (let i = a.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  if (a.every(([, i], k) => i === k)) a.push(a.shift()!);
  return a.map(([v]) => v);
}

// A tile's look: plain while answering; after checking, the right one is "on air" green, a wrong pick "miss" red, the rest dim.
const tileState = (locked: boolean, right: boolean, picked: boolean): TileState => !locked ? 'idle' : right ? 'right' : picked ? 'wrong' : 'dim';

// The "how to answer" line under the question (R10). Quiet, small, one line.
export function KindHint({ kind }: { kind: Scored['kind'] }) {
  const hint = KIND_HINT[kind];
  return hint ? <div data-testid="kind-hint" style={{ fontSize: 14, color: c.textMuted, margin: '-4px 0 12px' }}>{hint}</div> : null;
}

// How sure we are of a carrier or band fact, and when it was checked (CLAUDE.md "facts discipline"). Same words as before R10.
export function FactBadge({ badge, style }: { badge: Badge; style?: React.CSSProperties }) {
  return (
    <div data-testid="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: c.textMuted, ...mono,
      border: `1px solid ${c.border}`, borderRadius: RADIUS.pill, padding: '3px 10px', ...style }}>
      <Icon name="info" size={14} />{badge.status} · as of {badge.asOf}
    </div>);
}

// The main button under the answers. It stays in its place but is hidden after Check, because the sheet's Continue
// takes over (as in look A, where the question screen has no button of its own once you've answered).
function CheckButton({ ready, locked, onClick, submit }: { ready: boolean; locked: boolean; onClick?: () => void; submit?: boolean }) {
  return <Button full big kind="signal" type={submit ? 'submit' : 'button'} data-testid="check" data-primary aria-keyshortcuts="Enter"
    disabled={locked || !ready} onClick={onClick} style={{ marginTop: 20, visibility: locked ? 'hidden' : 'visible' }}>Check</Button>;
}

// The answer tiles of a pick-one question, numbered 1, 2, 3... in the order they're shown. Keys 1-9 press them (data-pick).
function Choices({ q, order, locked, picked, onSubmit }: { q: { choices: string[]; answer: number }; order: number[]; locked: boolean; picked?: Answer; onSubmit: (a: Answer) => void }) {
  return <>{order.map((i, k) => (
    <AnswerTile key={q.choices[i]} n={k + 1} data-pick={k + 1} aria-keyshortcuts={String(k + 1)} data-testid={`choice-${i}`} disabled={locked} quiet
      state={tileState(locked, i === q.answer, i === picked)} onClick={() => onSubmit(i)}>{q.choices[i]}</AnswerTile>))}</>;
}

// A picture with its credit line. `outline` draws a box on it; `tap` makes it tappable (gives x, y as fractions);
// `dot` shows where the player tapped, green if that was right and red if not (with the sheet saying which).
export function PhotoView({ photo, outline, tap, dot, dotOk, locked }: { photo: Photo; outline?: Rect; tap?: (x: number, y: number) => void; dot?: [number, number] | null; dotOk?: boolean; locked?: boolean }) {
  const [broken, setBroken] = useState(false);
  const box = (r: Rect): React.CSSProperties => ({ position: 'absolute', left: `${r.x * 100}%`, top: `${r.y * 100}%`, width: `${r.w * 100}%`, height: `${r.h * 100}%`, border: `3px solid ${c.streak}`, borderRadius: 8, boxSizing: 'border-box', pointerEvents: 'none' });
  return (
    <figure style={{ margin: '0 0 12px' }}>
      <div data-testid="photo" role={tap ? 'button' : 'img'} aria-label={photo.alt}
        onClick={e => { if (!tap || locked) return; const b = e.currentTarget.getBoundingClientRect(); tap((e.clientX - b.left) / b.width, (e.clientY - b.top) / b.height); }}
        style={{ position: 'relative', lineHeight: 0, cursor: tap && !locked ? 'crosshair' : 'default', borderRadius: RADIUS.tile, overflow: 'hidden',
          background: c.surface2, border: `1px solid ${c.border}`, minHeight: 120 }}>
        {broken ? <div style={{ lineHeight: 1.3, padding: 40, color: c.textMuted, textAlign: 'center' }}><Icon name="image" size={32} style={{ display: 'block', margin: '0 auto 8px' }} />Picture not downloaded yet: {photo.alt}</div>
          : <img src={photo.src} alt={photo.alt} draggable={false} onError={() => setBroken(true)} style={{ width: '100%', display: 'block' }} />}
        {outline && <div data-testid="outline" style={box(outline)} />}
        {dot && <TapDot at={dot} ok={!!dotOk} />}
      </div>
      <figcaption data-testid="photo-credit" style={{ fontSize: 12, color: c.textMuted, marginTop: 6 }}>{photo.credit}</figcaption>
    </figure>);
}

// Where the player tapped: green if that was right and red if not. It lands with a pop if right, or shakes if not
// (R11). It appears already marked, so it starts from its "from" look and moves one render later (useEntrance), which
// Motion does animate (a first animation alone would be skipped inside the app's screens).
function TapDot({ at, ok }: { at: [number, number]; ok: boolean }) {
  const on = useEntrance(), calm = useCalm(), color = ok ? c.onAir : c.miss;
  const land = calm || !on ? undefined : ok ? { ...FEEDBACK.dotKeys, transition: FEEDBACK.pop } : { ...FEEDBACK.shakeKeys, transition: FEEDBACK.shake };
  return <motion.div data-testid="tap-dot" data-ok={ok} initial={ok && !calm ? { scale: 0 } : false} animate={land}
    style={{ position: 'absolute', left: `${at[0] * 100}%`, top: `${at[1] * 100}%`, width: 18, height: 18, margin: -9,
      borderRadius: '50%', background: color, border: `2px solid ${c.bg}`, boxShadow: `0 0 0 2px ${color}`, pointerEvents: 'none' }} />;
}

// Type the number: one big box in the code font, the unit inside it on the right. After Check the box turns green with a
// tick or red with a cross.
function NumberBox({ q, locked, ok, onSubmit }: { q: Extract<Scored, { kind: 'number' }>; locked: boolean; ok?: boolean; onSubmit: (a: Answer) => void }) {
  const [text, setText] = useState(''), [focus, setFocus] = useState(false);
  const state: TileState = !locked ? (focus ? 'selected' : 'idle') : ok ? 'right' : 'wrong';
  const border = state === 'right' ? c.onAir : state === 'wrong' ? c.miss : focus ? c.signal : c.borderStrong;
  const bg = state === 'right' ? c.onAirBg : state === 'wrong' ? c.missBg : c.surface;
  const move = useFeedback(state);
  return (
    <form onSubmit={e => { e.preventDefault(); if (!locked && text.trim()) onSubmit(text); }}>
      <motion.label data-testid="number-box" data-state={state} {...move} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, minHeight: 64, padding: '0 16px', boxSizing: 'border-box',
        borderRadius: RADIUS.tile, border: `1.5px solid ${border}`, background: bg, cursor: 'text' }}>
        <input data-testid="number-input" autoFocus inputMode="decimal" autoComplete="off" spellCheck={false} placeholder="Your answer" value={text} disabled={locked}
          onChange={e => setText(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} aria-label={`Your answer${q.unit ? ` in ${q.unit}` : ''}`}
          style={{ flex: 1, minWidth: 0, fontSize: 28, padding: '10px 0', border: 0, outline: 'none', background: 'transparent', color: c.text, ...mono, fontVariantNumeric: 'tabular-nums' }} />
        {q.unit && <span data-testid="number-unit" style={{ ...mono, fontSize: 18, color: c.textMuted }}>{q.unit}</span>}
        {state === 'right' && <Icon name="check" size={22} label="right answer" style={{ color: c.onAir }} />}
        {state === 'wrong' && <Icon name="cross" size={22} label="not right" style={{ color: c.miss }} />}
        <Glow on={state === 'right'} radius={RADIUS.tile} />
      </motion.label>
      <CheckButton ready={!!text.trim()} locked={locked} submit />
    </form>);
}

// Match the pairs: the left column is numbered (keys 1-9 pick a left one too), and the left one you're pairing glows blue.
// Tap a right one to pair them: it takes on that left one's number. The next unpaired left one lights up by itself, so
// most of the time you only tap the right column. Tap a paired one again to change it.
function MatchPairs({ q, locked, picked, onSubmit }: { q: Extract<Scored, { kind: 'match' }>; locked: boolean; picked?: Answer; onSubmit: (a: Answer) => void }) {
  const rightOrder = useMemo(() => shuffled(q.pairs.map((_, i) => i), q.id), [q]);
  const [paired, setPaired] = useState<(number | null)[]>(() => q.pairs.map(() => null));
  const [left, setLeft] = useState<number | null>(0);
  const final = locked && Array.isArray(picked) ? (picked as number[]) : paired;
  const partnerOf = (j: number) => final.indexOf(j); // which left one is paired with right one j (-1: none)
  const tap = (j: number) => {
    if (locked || left === null) return;
    const p = paired.map((v, i) => (i === left ? j : v === j ? null : v));
    setPaired(p);
    const n = p.length, next = Array.from({ length: n }, (_, k) => (left + 1 + k) % n).find(i => p[i] === null);
    setLeft(next ?? null);
  };
  const all = paired.every(p => p !== null);
  const leftState = (i: number): TileState => locked ? (final[i] === i ? 'right' : 'wrong') : left === i ? 'selected' : paired[i] !== null ? 'paired' : 'idle';
  const rightState = (j: number): TileState => { const p = partnerOf(j); return locked ? (p === j ? 'right' : 'wrong') : p >= 0 ? 'paired' : 'idle'; };
  const cell: React.CSSProperties = { margin: 0, minHeight: 52, padding: '10px 12px', gap: 10, fontSize: 16 };
  return <>
    <div data-testid="match-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {q.pairs.map((p, i) => {
        const j = rightOrder[i], partner = partnerOf(j);
        return [
          <AnswerTile key={`l${i}`} n={i + 1} data-pick={i + 1} aria-keyshortcuts={String(i + 1)} data-testid={`match-left-${i}`} disabled={locked}
            aria-pressed={left === i} state={leftState(i)} onClick={() => setLeft(i)} style={cell}>{p[0]}</AnswerTile>,
          <AnswerTile key={`r${j}`} n={partner >= 0 ? partner + 1 : undefined} keyEmpty data-testid={`match-right-${j}`} disabled={locked}
            aria-label={`${q.pairs[j][1]}${partner >= 0 ? `, paired with ${q.pairs[partner][0]}` : ''}`}
            state={rightState(j)} onClick={() => tap(j)} style={cell}>{q.pairs[j][1]}</AnswerTile>,
        ];
      })}
    </div>
    <CheckButton ready={all} locked={locked} onClick={() => onSubmit(paired as number[])} />
  </>;
}

// Put them in order: numbered slots, dashed until filled (the next empty one is outlined in blue), and the items as
// chips underneath. Tap a chip to put it in the next slot; tap a filled slot to take it back. After Check each slot
// shows whether that position is right.
function OrderSlots({ q, locked, onSubmit }: { q: Extract<Scored, { kind: 'order' }>; locked: boolean; onSubmit: (a: Answer) => void }) {
  const pool = useMemo(() => shuffled(q.items.map(i => i.label), q.id), [q]);
  const [placed, setPlaced] = useState<string[]>([]);
  const right = useMemo(() => correctOrder(q), [q]);
  const rest = pool.filter(l => !placed.includes(l));
  // Where each item last sat, so a chip glides into its slot and back, and the others glide to close the gap (R11, I40).
  const places = useRef<Places>(new Map()).current;
  return <div data-fly-group>
    <div data-testid="order-placed" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {q.items.map((_, i) => {
        const l = placed[i];
        if (l) return <Fly key={l} name={l} places={places}><AnswerTile n={i + 1} data-testid={`order-placed-${i}`} disabled={locked} aria-label={`Place ${i + 1}: ${l}. Tap to take it back.`}
          state={locked ? (right[i] === l ? 'right' : 'wrong') : 'paired'} onClick={() => setPlaced(p => p.filter(x => x !== l))}
          style={{ margin: 0, minHeight: 48, padding: '8px 14px' }}>{l}</AnswerTile></Fly>;
        const next = i === placed.length && !locked;
        return <div key={`slot-${i}`} data-testid={`order-slot-${i}`} data-next={next} aria-hidden style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 48,
          padding: '8px 14px', boxSizing: 'border-box', borderRadius: RADIUS.tile, border: `1.5px dashed ${next ? c.signal : c.border}` }}>
          <span style={{ ...mono, width: 26, height: 26, display: 'grid', placeItems: 'center', fontSize: 13, borderRadius: 7, boxSizing: 'border-box',
            border: `1.5px dashed ${next ? c.signal : c.borderStrong}`, color: next ? c.signal : c.textMuted }}>{i + 1}</span>
        </div>;
      })}
    </div>
    <div data-testid="order-pool" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14, minHeight: 44, alignItems: 'center' }}>
      {rest.map(l => <Fly key={l} name={l} places={places} style={{ display: 'flex' }}>
        <Chip data-testid={`order-item-${l}`} disabled={locked} onClick={() => setPlaced(p => [...p, l])}>{l}</Chip></Fly>)}
      {!rest.length && !locked && <span style={{ fontSize: 14, color: c.textMuted }}>All placed. Tap one above to take it back.</span>}
    </div>
    <CheckButton ready={!rest.length} locked={locked} onClick={() => onSubmit(placed)} />
  </div>;
}

// Read the clues: one card per clue, with a small "CLUE 1" label, the clue, and its answers as chips. After Check the
// card's outline turns green or red, and the chips show the right answer (and your pick if it wasn't).
function Clues({ q, locked, onSubmit }: { q: Extract<Scored, { kind: 'scenario' }>; locked: boolean; onSubmit: (a: Answer) => void }) {
  const [picks, setPicks] = useState<(number | null)[]>(() => q.clues.map(() => null));
  const orders = useMemo(() => q.clues.map(clue => shuffleOrder(clue.choices.length)), [q]);
  const all = picks.every(p => p !== null);
  return <>
    {q.clues.map((clue, ci) => {
      const ok = picks[ci] === clue.answer;
      return (
        <Card key={clue.text} data-testid={`clue-${ci}`} data-ok={locked ? ok : undefined} accent={locked ? (ok ? 'onAir' : 'miss') : undefined}
          style={{ margin: '0 0 10px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <Icon name="search" size={20} style={{ color: c.signal, marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ ...mono, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: c.textMuted }}>Clue {ci + 1}</div>
              <div style={{ fontSize: 17, lineHeight: 1.35 }}>{clue.text}</div>
            </div>
          </div>
          <div role="group" aria-label={`Answers for clue ${ci + 1}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {orders[ci].map(i => (
              <Chip key={clue.choices[i]} data-testid={`clue-${ci}-choice-${i}`} disabled={locked} aria-pressed={picks[ci] === i}
                state={locked ? tileState(true, i === clue.answer, picks[ci] === i) : picks[ci] === i ? 'selected' : 'idle'}
                onClick={() => setPicks(p => p.map((v, k) => (k === ci ? i : v)))}>{clue.choices[i]}</Chip>))}
          </div>
        </Card>);
    })}
    <CheckButton ready={all} locked={locked} onClick={() => onSubmit(picks as number[])} />
  </>;
}

// One question's answers, by type. `picked` is what was answered (after Check).
export function Question({ q, locked, picked, onSubmit }: { q: Scored; locked: boolean; picked?: Answer; onSubmit: (a: Answer) => void }) {
  const [tapped, setTapped] = useState<[number, number] | null>(null);
  // Answer buttons come in a new random order each time a question is shown (the lesson files mostly list the right one first).
  // Buttons keep their written number in data-testid and in what they submit, so marking doesn't change.
  const choiceOrder = useMemo(() => (q.kind === 'choice' || q.kind === 'photo-choice' ? shuffleOrder(q.choices.length) : []), [q]);
  const ok = locked && picked !== undefined ? mark(q, picked) : undefined;
  switch (q.kind) {
    case 'choice': return <Choices q={q} order={choiceOrder} locked={locked} picked={picked} onSubmit={onSubmit} />;
    case 'photo-choice': return <>
      <PhotoView photo={q.photo} outline={locked ? q.outline : undefined} />
      <Choices q={q} order={choiceOrder} locked={locked} picked={picked} onSubmit={onSubmit} /></>;
    case 'tap-clue': return <PhotoView photo={q.photo} outline={locked ? q.target : undefined} dot={tapped} dotOk={ok} locked={locked}
      tap={(x, y) => { setTapped([x, y]); onSubmit([x, y]); }} />;
    case 'number': return <NumberBox q={q} locked={locked} ok={ok} onSubmit={onSubmit} />;
    case 'match': return <MatchPairs q={q} locked={locked} picked={picked} onSubmit={onSubmit} />;
    case 'order': return <OrderSlots q={q} locked={locked} onSubmit={onSubmit} />;
    case 'scenario': return <Clues q={q} locked={locked} onSubmit={onSubmit} />;
  }
}

// What the bottom sheet explains after an answer. Kept short (idea I38): the right answer, what you gave, one line why,
// and the as-of badge. The long parts (each clue's reason; the bands on the ruler) wait behind a quiet button.
export function Feedback({ q, ok, a }: { q: Scored; ok: boolean; a: Answer }) {
  const [open, setOpen] = useState(false);
  const fold = FOLD_LABEL[q.kind];
  const clueOk = q.kind === 'scenario' && Array.isArray(a) ? q.clues.map((clue, i) => (a as number[])[i] === clue.answer) : [];
  return (
    <div data-testid="explain">
      {!ok && q.kind !== 'scenario' && <div data-testid="right-answer"><strong>Right answer:</strong> {rightAnswerText(q)}</div>}
      {!ok && q.kind === 'choice' && typeof a === 'number' && <div>You picked: {q.choices[a]}</div>}
      {!ok && q.kind === 'number' && <div>You typed: <span style={mono}>{String(a)}</span></div>}
      {q.kind === 'scenario' && <div data-testid="clue-score">
        {clueOk.every(Boolean) ? (clueOk.length === 2 ? 'Both clues right.' : 'Every clue right.') : `${clueOk.filter(Boolean).length} of ${clueOk.length} clues right. The right answers are marked above.`}</div>}
      {q.why && <div data-testid="why" style={{ marginTop: 6 }}>{q.why}</div>}
      {q.badge && <FactBadge badge={q.badge} style={{ marginTop: 8 }} />}
      {fold && <>
        <button type="button" data-testid="why-toggle" aria-expanded={open} onClick={() => setOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, minHeight: 44, marginTop: 4, padding: 0, border: 0, background: 'transparent',
            color: 'inherit', fontSize: 15, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>
          {fold}<Icon name="chevron" size={16} style={{ transform: `rotate(${open ? -90 : 90}deg)` }} />
        </button>
        {open && <div data-testid="why-more">
          {q.kind === 'scenario' && Array.isArray(a) && q.clues.map((clue, i) => (
            <div key={clue.text} data-testid={`clue-why-${i}`} data-ok={clueOk[i]} style={{ marginTop: 4, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              {clueOk[i] ? <Icon name="check" size={18} label="Right:" style={{ color: c.onAir, marginTop: 2, flexShrink: 0 }} />
                : <Icon name="cross" size={18} label="Missed:" style={{ color: c.miss, marginTop: 2, flexShrink: 0 }} />}
              <span>{clue.text}: {clue.choices[clue.answer]}{clue.why ? `. ${clue.why}` : ''}</span></div>))}
          {q.kind === 'order' && <div style={{ marginTop: 4, color: c.text }}><SpectrumBar testId="order-bar"
            ranges={correctOrder(q).map(l => q.items.find(i => i.label === l)!).map(i => ({ label: i.label, low: i.low, high: i.high }))} /></div>}
        </div>}
      </>}
    </div>);
}
