import { useEffect, useRef, useState } from 'react';
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
import { mark, isScored, type Answer, type Item, type Scored } from './questions';
import { Question, Feedback, KindHint, FactBadge } from './QuestionTypes';
import { startRun, advance, current, finished, scoredCount } from './session';
import { xpFor, signalBars } from './gamify';
import { Button, IconButton, ProgressBar, BottomSheet, SpeechBubble, SectionLabel, Card } from './ui';
import { SPRING, TIME, useCalm } from './theme/motion';
import { KIND_LABEL, counter, beaconLine } from './questionScreen';
import { useKeys, pressFor } from './keys';

export type LessonResult = { stars: number; xp: number; results: { id: string; ok: boolean }[] };

// Bright buttons (signal / on-air) always carry dark text (DESIGN.md: "Text on signal, on-air, miss buttons").
// Only the lesson-complete screen still uses this; R12 redraws that screen with the R03 buttons.
const btn = (bg: string): React.CSSProperties => ({ padding: '12px 32px', fontSize: 18, fontWeight: 700, border: 0, borderRadius: 14, background: bg, color: c.onBright, cursor: 'pointer' });

// Plays one lesson. Calls onFinish with the result when the player taps "Back to the path".
// The question screen (redesign R09, look A): a top row (leave, progress bar, "5 / 12"), Beacon at the left with a
// speech bubble, a small label ("PICK ONE"), the question, numbered answer tiles, and after an answer the bottom sheet
// ("Right!" / "Not quite") with a Continue button in the sheet's own colour.
export function LessonPlayer({ lesson, onFinish, onQuit }: { lesson: Lesson; onFinish: (r: LessonResult) => void; onQuit: () => void }) {
  const [run, setRun] = useState(() => startRun(lesson.questions));
  const [res, setRes] = useState<{ ok: boolean; a: Answer } | null>(null);
  const [retriesRight, setRetriesRight] = useState(0);
  // What the sheet shows. Kept after Continue, so the sheet keeps its words while it slides away (the next question is already in).
  const [shown, setShown] = useState<{ q: Scored; ok: boolean; a: Answer; n: number } | null>(null);
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
    const ok = mark(it, a); setRes({ ok, a }); setShown(s => ({ q: it, ok, a, n: (s?.n ?? 0) + 1 }));
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
              // A learn card (R10): the same left edge as a question, with "SOMETHING NEW" above its title, the band on the
              // radio ruler in a raised card, the as-of badge, and a full-width "Got it".
              <div data-testid="learn-card">
                <SectionLabel data-testid="kind-label" tone="signal" style={{ margin: '14px 0 0' }}>{KIND_LABEL.learn}</SectionLabel>
                <h2 data-testid="prompt" style={{ fontSize: 23, lineHeight: 1.25, fontWeight: 700, margin: '6px 0 10px' }}>{it.title ?? 'Learn this'}</h2>
                <p data-testid="learn-text" style={{ fontSize: 18, lineHeight: 1.45, margin: '0 0 14px' }}>{it.text}</p>
                {it.bars && <Card raised title="On the radio ruler" data-testid="learn-ruler" style={{ margin: '0 0 12px', padding: '12px 14px 10px' }}><SpectrumBar ranges={rangesFor(it.bars)} /></Card>}
                {it.badge && <FactBadge badge={it.badge} />}
                <Button full big kind="onAir" data-testid="learn-ok" data-primary aria-keyshortcuts="Enter" onClick={() => next(true)} style={{ marginTop: 20 }}>Got it</Button>
              </div>
            ) : (
              <>
                <SectionLabel data-testid="kind-label" tone="signal" style={{ margin: '14px 0 0' }}>{KIND_LABEL[it.kind]}</SectionLabel>
                <h2 data-testid="prompt" style={{ fontSize: 23, lineHeight: 1.25, fontWeight: 700, margin: '6px 0 12px' }}>{it.prompt}</h2>
                <KindHint kind={it.kind} />
                {/* Every type in the look A layout (R10): on the same left edge, built from the R03 blocks (src/QuestionTypes.tsx). */}
                <Question key={it.id + run.index} q={it} locked={!!res} picked={res?.a} onSubmit={submit} />
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
        {shown && <Feedback key={shown.n} q={shown.q} ok={shown.ok} a={shown.a} />}
      </BottomSheet>
    </div>
  );
}
