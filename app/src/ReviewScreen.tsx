import { useEffect, useLayoutEffect, useRef } from 'react';
import { animate, type AnimationPlaybackControls } from 'motion/react';
import { c, COLUMN, mono } from './theme';
import { Icon, type IconName } from './Icon';
import { Card, Button, TabHead } from './ui';
import { SCOPE, popInDelay, useCalm, useAwake } from './theme/motion';
import { whenNext, type Outlook } from './dailyReview';

// The Review tab, the "drive test" (redesign R13). Like a drive-test engineer's radar scope: one blip for each question
// waiting for you, farther out the longer it has waited. Under it: how many, about how long, and the button to start.
// Three looks: questions waiting (the sweep turns), all clear (when the next one comes back), and nothing yet (before
// your first lesson). Speeds: SCOPE in src/theme/motion.tsx.
const SIZE = 224, MID = SIZE / 2;
const RINGS = [52, 76, 100];                 // the scope's rings (px from the middle); blips sit on them
const ringFor = (lateDays: number) => (lateDays < 1 ? 0 : lateDays < 7 ? 1 : 2); // came due today / this week / longer ago
const GOLDEN = 137.508;                      // turning each blip this far from the last spreads them evenly round the scope
const at = (deg: number, r: number) => ({ x: MID + r * Math.sin((deg * Math.PI) / 180), y: MID - r * Math.cos((deg * Math.PI) / 180) });

// How many blips were already on the scope the last time you looked (since the app started). Only newer ones pop in.
let seen = 0;

export function ReviewScreen({ outlook: o, onStart, onPath }: { outlook: Outlook; onStart: () => void; onPath: () => void }) {
  const look = o.due ? 'due' : o.known ? 'clear' : 'empty';
  return (
    <div data-testid="review-screen" data-look={look} style={{ maxWidth: COLUMN, margin: '0 auto', padding: '16px 20px 32px', boxSizing: 'border-box' }}>
      <TabHead label="Drive test" tone="review" title="Daily review" />
      <Card raised accent={o.due ? 'review' : undefined} style={{ marginBottom: 16, textAlign: 'center' }}>
        <Scope late={o.late} due={o.due} />
        <div data-testid="review-count" style={{ fontSize: 20, fontWeight: 700, margin: '12px 0 4px' }}>
          {look === 'due' ? <><span style={mono}>{o.due}</span> {o.due === 1 ? 'question is' : 'questions are'} waiting</>
            : look === 'clear' ? 'All clear for now' : 'Nothing to review yet'}
        </div>
        <div data-testid="review-hint" style={{ fontSize: 15, color: c.textMuted, margin: '0 0 16px', lineHeight: 1.4 }}>
          {look === 'due' ? (o.due > o.today
              ? <>Today: the oldest <span style={mono}>{o.today}</span>, about <span style={mono}>{o.minutes}</span> minutes.</>
              : <>About <span style={mono}>{o.minutes}</span> {o.minutes === 1 ? 'minute' : 'minutes'}. Oldest first.</>)
            : look === 'clear' ? (o.nextDue === null ? 'Nothing is waiting.' : `The next question comes back ${whenNext(o.nextDue, Date.now())}.`)
            : 'Finish a lesson, and its questions come back here just before you\'d forget them.'}
        </div>
        {look === 'due'
          ? <Button full big icon="repeat" data-testid="review-start" onClick={onStart}>Start the review</Button>
          : <Button full big kind={look === 'clear' ? 'quiet' : 'signal'} icon="tower" data-testid="review-path" onClick={onPath}>
              {look === 'clear' ? 'Play a new lesson' : 'Go to your first lesson'}</Button>}
      </Card>
      {o.known > 0 && (
        <Card title="Coming up" data-testid="review-coming" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Stat n={o.next24} label="in the next 24 hours" testId="review-next24" />
            <Stat n={o.next7} label="in the next 7 days" testId="review-next7" />
          </div>
        </Card>
      )}
      <Card title="How it works">
        <Row icon="repeat" tone="review">Questions come back just before you would forget them.</Row>
        <Row icon="waves" tone="signal">Oldest first, at most 20 a day. Farther out on the scope = waiting longer.</Row>
        <Row icon="flame" tone="streak">A review counts for your streak and your XP.</Row>
      </Card>
    </div>
  );
}

function Stat({ n, label, testId }: { n: number; label: string; testId: string }) {
  return (
    <div data-testid={testId} style={{ flex: 1, minWidth: 0 }}>
      <div style={{ ...mono, fontSize: 23, fontWeight: 700, color: n ? c.text : c.textMuted }}>{n ? `+${n}` : '0'}</div>
      <div style={{ fontSize: 14, color: c.textMuted }}>{label}</div>
    </div>
  );
}

function Row({ icon, tone, children }: { icon: IconName; tone: 'review' | 'signal' | 'streak'; children: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '6px 0', fontSize: 15, lineHeight: 1.4, color: c.textMuted }}>
      <Icon name={icon} size={20} style={{ color: c[tone], marginTop: 1 }} />
      <span>{children}</span>
    </div>
  );
}

// The radar scope: three rings, a cross, a blip per question (today's ones), the count in the middle, and the sweep.
function Scope({ late, due }: { late: number[]; due: number }) {
  const calm = useCalm(), awake = useAwake();
  const root = useRef<HTMLDivElement>(null), sweep = useRef<HTMLDivElement>(null), run = useRef<AnimationPlaybackControls | null>(null);
  const fresh = calm ? late.length : Math.min(seen, late.length); // blips before this index are already known: no pop
  const blips = late.map((d, i) => ({ ...at(i * GOLDEN + 20, RINGS[ringFor(d)]), ring: ringFor(d) }));
  // New blips pop in one after another, before the first paint (they start at their "from" look, set below).
  useLayoutEffect(() => {
    const el = root.current;
    const pops = el && !calm ? [...el.querySelectorAll<HTMLElement>('[data-blip-new]')] : [];
    const runs = pops.map((b, k) => animate(b, SCOPE.blipKeys, { ...SCOPE.blip, delay: popInDelay(k, pops.length) }));
    seen = late.length;
    return () => runs.forEach(a => a.complete());
  }, [late.length, calm]); // eslint-disable-line react-hooks/exhaustive-deps -- when the number of blips changes
  // The sweep: the screen's one background loop, only while questions wait; paused while the window is hidden.
  useLayoutEffect(() => {
    if (calm || !due || !sweep.current) return;
    const a = animate(sweep.current, SCOPE.sweepKeys, SCOPE.sweep);
    run.current = a;
    return () => { a.stop(); run.current = null; };
  }, [calm, due > 0]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (awake) run.current?.play(); else run.current?.pause(); }, [awake]);
  return (
    <div ref={root} data-testid="scope" role="img" aria-label={due ? `${due} ${due === 1 ? 'question' : 'questions'} waiting` : 'No questions waiting'}
      style={{ position: 'relative', width: SIZE, height: SIZE, margin: '4px auto 0' }}>
      <svg width={SIZE} height={SIZE} aria-hidden style={{ position: 'absolute', inset: 0 }}>
        {RINGS.map((r, i) => <circle key={r} cx={MID} cy={MID} r={r} fill="none" stroke={i === 2 ? c.borderStrong : c.border} strokeWidth={1.5} />)}
        <path d={`M${MID} ${MID - RINGS[2]}V${MID + RINGS[2]}M${MID - RINGS[2]} ${MID}H${MID + RINGS[2]}`} stroke={c.border} strokeWidth={1} strokeDasharray="2 5" />
      </svg>
      {due > 0 && <div ref={sweep} data-testid="scope-sweep" aria-hidden style={{ position: 'absolute', inset: 0 }}><Sweep /></div>}
      {blips.map((b, i) => {
        const pop = i >= fresh;
        return <span key={i} data-testid="blip" data-orbit={b.ring} {...(pop ? { 'data-blip-new': '' } : {})}
          style={{ position: 'absolute', left: b.x - 5, top: b.y - 5, width: 10, height: 10, borderRadius: '50%', background: c.review,
            boxShadow: `0 0 0 3px color-mix(in srgb, ${c.review} 22%, transparent)`, ...(pop ? { transform: 'scale(0)', opacity: 0 } : {}) }} />;
      })}
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
        {due ? (
          <div>
            <div data-testid="scope-count" style={{ ...mono, fontSize: 40, fontWeight: 700, lineHeight: 1, color: c.text }}>{due}</div>
            <div style={{ ...mono, fontSize: 12, letterSpacing: '0.12em', color: c.review, marginTop: 4 }}>DUE</div>
          </div>
        ) : (
          <div style={{ color: c.onAir }}>
            <Icon name="check" size={32} />
            <div style={{ ...mono, fontSize: 12, letterSpacing: '0.12em', marginTop: 4 }}>ALL CLEAR</div>
          </div>
        )}
      </div>
    </div>
  );
}

// The sweep's wedge: a bright leading line (pointing up) with a tail that fades behind it, drawn as thin slices.
// The whole layer turns (a transform), so nothing inside it is redrawn while it moves.
const SLICE = 5, SLICES = 8;
function Sweep() {
  const r = RINGS[2];
  const slice = (k: number) => {
    const a = at(-SLICE * (k + 1), r), b = at(-SLICE * k, r);
    return `M${MID} ${MID}L${a.x.toFixed(2)} ${a.y.toFixed(2)}A${r} ${r} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}Z`;
  };
  return (
    <svg width={SIZE} height={SIZE}>
      {Array.from({ length: SLICES }, (_, k) => <path key={k} d={slice(k)} fill={c.review} opacity={0.2 * (1 - k / SLICES) ** 1.5} />)}
      <line x1={MID} y1={MID} x2={MID} y2={MID - r} stroke={c.review} strokeWidth={1.5} opacity={0.7} strokeLinecap="round" />
    </svg>
  );
}
