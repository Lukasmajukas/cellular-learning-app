import { useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { c, COLUMN } from './theme';
import { Icon, type IconName } from './Icon';
import { AnswerTile, Beacon, BEACON_SIZE, Button, Card, IconButton, SectionLabel, SpeechBubble } from './ui';
import { WELCOME, pageGlide, useCalm } from './theme/motion';
import { useKeys, pressFor } from './keys';

// The first-start welcome (redesign R21): two short pages, shown once, before the path.
//   1. Hello: Beacon says hi, and three rows say what the app teaches.
//   2. Daily goal: 1, 2, 3 or 5 lessons a day (the same choices as Settings), then the first lesson, or a look around.
// Keys: Enter = the page's main button, 1, 2, 3 or 5 pick that many lessons (each goal's key is its own count, idea I78),
// Esc goes back to the first page.
// The pages glide like questions (pageGlide, in from the right going on, from the left going back).
// It describes the app only: no band or carrier facts here (those come from the data files, in the lessons).
export const GOALS = [
  { n: 1, name: 'A gentle start', minutes: 5 },
  { n: 2, name: 'Steady', minutes: 10 },
  { n: 3, name: 'Keen', minutes: 15 },
  { n: 5, name: 'All in', minutes: 25 },
] as const;
// Lessons are 3 to 5 minutes each (content/tools/lesson_timing.py), so a goal takes "up to" 5 minutes a lesson.
export const goalHint = (minutes: number) => `up to ${minutes} minutes a day`;

const TEACHES: { icon: IconName; name: string; hint: string }[] = [
  { icon: 'waves', name: 'US LTE and 5G bands', hint: 'What the band numbers mean, from low band to mmWave.' },
  { icon: 'tower', name: 'Which carrier runs what', hint: 'Who uses which bands, each fact with its date and source.' },
  { icon: 'mapPin', name: 'Spot a cell site', hint: 'Towers, small cells, equipment brands and the IDs your phone shows.' },
];
// Beacon's lines (8 words or fewer, DESIGN.md section 8).
export const WELCOME_SAYS = { hello: "Hi, I'm Beacon. Let's read the airwaves.", goal: 'Pick what feels easy. You can change it.' };

export function Welcome({ goal: startGoal, onDone }: { goal: number; onDone: (goal: number, play: boolean) => void }) {
  const calm = useCalm();
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [goal, setGoal] = useState<number>(GOALS.some(g => g.n === startGoal) ? startGoal : 1);
  const root = useRef<HTMLDivElement>(null);
  const to = (p: number) => { setDir(p > page ? 1 : -1); setPage(p); };
  useKeys(k => {
    if (k === 'back') { if (page === 0) return false; to(0); return true; }
    return pressFor(root.current, k);
  });
  return (
    <div ref={root} data-testid="welcome" data-page={page} style={{ maxWidth: COLUMN, margin: '0 auto', padding: '16px 20px 32px', boxSizing: 'border-box',
      minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* The top row: back (on the second page) and two dots that say which page you're on. */}
      <div style={{ display: 'flex', alignItems: 'center', height: 44, marginBottom: 8 }}>
        <div style={{ width: 44 }}>
          {page === 1 && <IconButton icon="back" label="Back (Esc)" data-testid="welcome-back" aria-keyshortcuts="Escape" onClick={() => to(0)} style={{ marginLeft: -10 }} />}
        </div>
        <div data-testid="welcome-dots" role="img" aria-label={`Page ${page + 1} of 2`} style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[0, 1].map(i => <span key={i} data-on={i === page} style={{ width: i === page ? 20 : 8, height: 8, borderRadius: 4,
            background: i === page ? c.signal : c.borderStrong }} />)}
        </div>
        <div style={{ width: 44 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div key={page} data-testid={`welcome-page-${page}`} custom={dir} {...pageGlide(calm)}>
            {page === 0 ? <Hello onNext={() => to(1)} /> : <Goal goal={goal} onPick={setGoal} onDone={play => onDone(goal, play)} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Beacon with its line in a bubble beside its head.
function Says({ face, size, children }: { face: 'happy' | 'idle'; size: number; children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 16 }}>
      <Beacon face={face} size={size} data-testid="welcome-beacon" />
      <SpeechBubble delay={WELCOME.says} data-testid="welcome-says" style={{ marginTop: size * 0.12 }}>{children}</SpeechBubble>
    </div>
  );
}

function Hello({ onNext }: { onNext: () => void }) {
  return (
    <>
      <Says face="happy" size={BEACON_SIZE.complete * 0.86}>{WELCOME_SAYS.hello}</Says>
      <SectionLabel tone="signal" style={{ margin: 0 }}>Welcome</SectionLabel>
      <h1 style={{ margin: '2px 0 4px', fontSize: 28 }}>Learn the signals around you</h1>
      <p style={{ margin: '0 0 16px', fontSize: 16, color: c.textMuted }}>
        Short lessons of 3 to 5 minutes. You start at the very beginning: no radio know-how needed.</p>
      <Card title="What you'll learn" data-testid="welcome-teaches" style={{ marginBottom: 24 }}>
        {TEACHES.map((t, i) => <Row key={t.icon} icon={t.icon} name={t.name} last={i === TEACHES.length - 1}>{t.hint}</Row>)}
      </Card>
      <Button full big data-primary data-testid="welcome-next" onClick={onNext}>Next</Button>
    </>
  );
}

// The goal page (exported for its unit test). Each tile's key is its own lesson count, so 5 picks "5 lessons" (I78).
export function Goal({ goal, onPick, onDone }: { goal: number; onPick: (n: number) => void; onDone: (play: boolean) => void }) {
  return (
    <>
      <Says face="idle" size={BEACON_SIZE.question}>{WELCOME_SAYS.goal}</Says>
      <SectionLabel tone="signal" style={{ margin: 0 }}>Daily goal</SectionLabel>
      <h1 style={{ margin: '2px 0 4px', fontSize: 28 }}>How many lessons a day?</h1>
      <p style={{ margin: '0 0 8px', fontSize: 16, color: c.textMuted }}>The bar at the top fills as you finish them. Change it any time in Settings.</p>
      <div role="radiogroup" aria-label="Daily goal, lessons a day" data-testid="welcome-goals" style={{ marginBottom: 16 }}>
        {GOALS.map(g => (
          <AnswerTile key={g.n} n={g.n} data-pick={g.n} aria-keyshortcuts={String(g.n)} data-testid={`welcome-goal-${g.n}`} role="radio" aria-checked={g.n === goal}
            state={g.n === goal ? 'selected' : 'idle'} onClick={() => onPick(g.n)} style={{ margin: '8px 0', minHeight: 60 }}>
            <span style={{ display: 'block' }}><b>{g.n} {g.n === 1 ? 'lesson' : 'lessons'}</b> <span style={{ color: c.textMuted }}>· {g.name}</span></span>
            <span style={{ display: 'block', fontSize: 14, color: c.textMuted }}>{goalHint(g.minutes)}</span>
          </AnswerTile>
        ))}
      </div>
      <Button full big icon="play" data-primary data-testid="welcome-start" onClick={() => onDone(true)}>Start the first lesson</Button>
      <Button full kind="quiet" data-testid="welcome-look" onClick={() => onDone(false)} style={{ marginTop: 12 }}>Look around first</Button>
    </>
  );
}

// One row of "What you'll learn": a small icon tile (like the Settings rows), the name and one quiet line.
function Row({ icon, name, last, children }: { icon: IconName; name: string; last?: boolean; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0', borderBottom: last ? 'none' : `1px solid ${c.border}` }}>
      <span aria-hidden style={{ width: 36, height: 36, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: 10,
        background: c.surface2, border: `1px solid ${c.border}`, color: c.signal, boxSizing: 'border-box' }}><Icon name={icon} size={20} /></span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontWeight: 700 }}>{name}</span>
        <span style={{ display: 'block', fontSize: 15, color: c.textMuted, lineHeight: 1.4 }}>{children}</span>
      </span>
    </div>
  );
}
