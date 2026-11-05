import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useIsPresent } from 'motion/react';
import { c, mono } from './theme';
import { stars } from './lesson';
import type { Lesson } from './path';
import { beep } from './sound';
import { Beacon, BEACON_SIZE } from './ui/Beacon';
import { SpectrumBar, rangesFor } from './SpectrumBar';
import { mark, isScored, type Answer, type Item, type Scored } from './questions';
import { Question, Feedback, KindHint, FactBadge } from './QuestionTypes';
import { startRun, advance, current, finished, scoredCount } from './session';
import { xpFor, signalBars } from './gamify';
import { Button, IconButton, ProgressBar, BottomSheet, SpeechBubble, SectionLabel, Card, Pill } from './ui';
import { SPRING, QUICK_FADE, useCalm, questionGlide } from './theme/motion';
import { LessonComplete } from './LessonComplete';
import { KIND_LABEL, questionCount, beaconLine } from './questionScreen';
import { useKeys, pressFor } from './keys';

export type LessonResult = { stars: number; xp: number; results: { id: string; ok: boolean }[] };

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
  const done = finished(run), it: Item | undefined = current(run);
  const total = scoredCount(run), right = run.firstRight.length;
  const submit = (a: Answer) => {
    if (res || !it || !isScored(it)) return;
    const ok = mark(it, a); setRes({ ok, a }); setShown(s => ({ q: it, ok, a, n: (s?.n ?? 0) + 1 }));
    if (ok && run.seen.includes(it.id)) setRetriesRight(n => n + 1);
    // The sound starts on the next frame, after the answer and Beacon's new face are drawn (R17: Beacon must react
    // within 0.1 s). Inside the click, the first answer's sound set-up alone held the face back ~55 ms. R19 brings the new sounds.
    // No burst after a right answer (R11, idea I31: confetti fell over the words and the Continue button): the right
    // tile's pop and glow and Beacon's ring pulse say it. The signal burst is for the end of the lesson only (R12).
    requestAnimationFrame(() => beep(ok));
  };
  const next = (ok: boolean) => {
    const r = advance(run, ok); setRun(r); setRes(null);
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
  // The counter (R11, idea I37): only first-time questions count, so a miss doesn't make the total grow. A missed
  // question coming back shows a quiet "Comeback" pill instead, and the counter stays where it was.
  const count = questionCount(run.queue.map(q => q.id), run.index);
  const face = !res ? 'idle' : res.ok ? 'happy' : 'oops';
  const says = !it || done ? '' : res ? beaconLine(res.ok ? 'right' : 'wrong', `${it.id}-${run.index}`) : beaconLine(it.kind === 'learn' ? 'learn' : 'ask', `${it.id}-${run.index}`);
  return (
    <div ref={root} style={{ maxWidth: 440, margin: '0 auto', padding: `20px 20px ${20 + sheetH}px`, boxSizing: 'border-box', textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <IconButton icon="close" label="Leave the lesson (Esc)" data-testid="quit" onClick={onQuit} aria-keyshortcuts="Escape" style={{ marginLeft: -10 }} />
        {/* The bar springs forward a touch past its new place and settles, with a spark at its tip (R11). */}
        <div style={{ flex: 1 }}><ProgressBar testId="lesson-progress" label="Lesson progress" height={12} spark transition={SPRING.step}
          value={Math.min(run.index, run.queue.length) / run.queue.length} /></div>
        <span data-testid="lesson-count" aria-label={`Question ${count.n} of ${count.total}${count.comeback ? ', a comeback' : ''}`}
          style={{ ...mono, fontSize: 13, color: c.textMuted, fontVariantNumeric: 'tabular-nums', minWidth: 44, textAlign: 'right' }}>{count.text}</span>
      </div>
      {/* Beacon's spot (R09): at the left, with what it says beside it. It waits, is happy or a little worried within 0.1 s
          of an answer (R17). When the lesson is done, the lesson-complete screen has its own big Beacon, which grows in (R12, I34). */}
      {!done && (
        <div data-testid="beacon-spot" style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 6, minHeight: 79 }}>
          <Beacon face={face} size={BEACON_SIZE.question} />
          {says && <SpeechBubble key={says} data-testid="beacon-says" style={{ marginBottom: 8 }}>{says}</SpeechBubble>}
        </div>
      )}
      {/* initial={false}: the first question is already in place while the whole lesson rises (R04); later ones glide in
          from the right as the old one glides out to the left (R11, questionGlide). With Reduce motion: a quick fade only. */}
      <AnimatePresence mode="wait" initial={false}>
        {!done && it ? (
          <motion.div ref={body} key={`${run.index}-${it.id}`} data-testid="question-body" {...questionGlide(calm)}>
            {it.kind === 'learn' ? (
              // A learn card (R10): the same left edge as a question, with "SOMETHING NEW" above its title, the band on the
              // radio ruler in a raised card, the as-of badge, and a full-width "Got it".
              <div data-testid="learn-card">
                <SectionLabel data-testid="kind-label" tone="signal" style={{ margin: '14px 0 0' }}>{KIND_LABEL.learn}</SectionLabel>
                <h2 data-testid="prompt" style={{ fontSize: 23, lineHeight: 1.25, fontWeight: 700, margin: '6px 0 10px' }}>{it.title ?? 'Learn this'}</h2>
                <p data-testid="learn-text" style={{ fontSize: 18, lineHeight: 1.45, margin: '0 0 14px' }}>{it.text}</p>
                {it.bars && <Card raised title="On the radio ruler" data-testid="learn-ruler" style={{ margin: '0 0 12px', padding: '12px 14px 10px' }}><SpectrumBar ranges={rangesFor(it.bars)} /></Card>}
                {it.badge && <FactBadge badge={it.badge} />}
                <Button full big data-testid="learn-ok" data-primary aria-keyshortcuts="Enter" onClick={() => next(true)} style={{ marginTop: 20 }}>Got it</Button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 0', minHeight: 22 }}>
                  <SectionLabel data-testid="kind-label" tone="signal" style={{ margin: 0 }}>{KIND_LABEL[it.kind]}</SectionLabel>
                  {count.comeback && <Pill data-testid="comeback" icon="repeat" style={{ fontSize: 12, fontWeight: 500, padding: '0 8px' }}>Comeback</Pill>}
                </div>
                <h2 data-testid="prompt" style={{ fontSize: 23, lineHeight: 1.25, fontWeight: 700, margin: '6px 0 12px' }}>{it.prompt}</h2>
                <KindHint kind={it.kind} />
                {/* Every type in the look A layout (R10): on the same left edge, built from the R03 blocks (src/QuestionTypes.tsx). */}
                <Question key={it.id + run.index} q={it} locked={!!res} picked={res?.a} onSubmit={submit} />
              </>
            )}
          </motion.div>
        ) : (
          // The lesson-complete screen (R12): src/LessonComplete.tsx. It appears once the last question has glided out.
          <motion.div key="end" data-testid="end" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: QUICK_FADE }}>
            <LessonComplete stars={stars(right, total)} right={right} total={total} fixed={retriesRight} xp={xp}
              bars={signalBars(right, total)} onFinish={finish} onAgain={restart} />
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
