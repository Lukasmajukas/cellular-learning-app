import { useState } from 'react';
import { c, COLUMN } from './theme';
import { MotionKit, Button, IconButton, Card, SectionLabel, AnswerTile, Pill, StatChip, PillChoice, Switch, ProgressBar, BottomSheet, SpeechBubble, type TileState } from './ui';

// Every building block on one page (redesign R03), for the gallery pictures and the click tests. Not part of the normal app:
// open it by adding #blocks to the address (the gallery and tests/blocks.spec.ts do that). It has its own "Reduce motion" switch.
export function BlocksSheet() {
  const [reduce, setReduce] = useState(false);
  const [on, setOn] = useState(true);
  const [goal, setGoal] = useState(2);
  const [fill, setFill] = useState(0.42);
  const [sheet, setSheet] = useState<'right' | 'wrong' | null>(null);
  const [said, setSaid] = useState(0);
  const lines = ['Hmm, look at the units!', 'Nice, that one is on air.'];
  const tiles: TileState[] = ['idle', 'selected', 'right', 'wrong', 'dim'];
  return (
    <MotionKit calm={reduce}>
      <div data-testid="blocks" style={{ maxWidth: COLUMN, margin: '0 auto', padding: '16px 20px 260px', boxSizing: 'border-box', display: 'grid', gap: 16 }}>
        <h1 style={{ margin: 0 }}>Building blocks</h1>
        <Card title="Buttons">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <Button data-testid="block-button-signal">Check</Button>
            <Button kind="onAir" icon="check">Got it</Button>
            <Button kind="miss">Continue</Button>
            <Button kind="quiet" icon="back">Back</Button>
            <Button disabled>Not yet</Button>
            <IconButton icon="gear" label="Settings" />
          </div>
        </Card>
        <Card title="Pills and stats" raised>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Pill tone="review" data-testid="block-pill">6 due</Pill><Pill tone="onAir" icon="check">Done</Pill><Pill tone="streak">New</Pill><Pill>Locked</Pill>
            <StatChip icon="flame" tone="streak" title="Streak">4</StatChip><StatChip icon="bolt" tone="signal">120 XP</StatChip>
          </div>
          <div style={{ marginTop: 12 }}><PillChoice testId="block-choice" label="Daily goal" value={goal} onChange={setGoal} options={[1, 2, 3, 5].map(n => ({ value: n, text: String(n) }))} /></div>
        </Card>
        <Card title="Switches and progress">
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Reduce motion (this page)<Switch testId="block-reduce" checked={reduce} onChange={setReduce} /></label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>A switch<Switch testId="block-switch" checked={on} onChange={setOn} /></label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <div style={{ flex: 1 }}><ProgressBar testId="block-progress" label="Example progress" value={fill} /></div>
            <Button kind="quiet" data-testid="block-progress-more" onClick={() => setFill(f => (f >= 1 ? 0.08 : Math.min(1, f + 0.25)))}>More</Button>
          </div>
        </Card>
        <div>
          <SectionLabel tone="signal">Pick one</SectionLabel>
          {tiles.map((s, i) => <AnswerTile key={s} n={i + 1} state={s} data-testid={`block-tile-${s}`}>{s === 'idle' ? '2 GHz' : s === 'selected' ? 'Picked, not checked yet' : s === 'right' ? 'They are the same' : s === 'wrong' ? '2000 MHz' : 'Another answer'}</AnswerTile>)}
        </div>
        <Card title="Beacon says" raised>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SpeechBubble key={said} data-testid="block-bubble">{lines[said % lines.length]}</SpeechBubble>
            <Button kind="quiet" data-testid="block-bubble-again" onClick={() => setSaid(n => n + 1)}>Again</Button>
          </div>
        </Card>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button kind="onAir" data-testid="block-sheet-right" onClick={() => setSheet('right')}>Show "Right!"</Button>
          <Button kind="miss" data-testid="block-sheet-wrong" onClick={() => setSheet('wrong')}>Show "Not quite"</Button>
        </div>
        <p style={{ color: c.textMuted, fontSize: 14, margin: 0 }}>The sheet slides up from the bottom of the window.</p>
      </div>
      <BottomSheet testId="block-sheet" open={!!sheet} tone={sheet ?? 'right'} title={sheet === 'wrong' ? 'Not quite' : 'Right!'}
        action={<Button full big kind={sheet === 'wrong' ? 'miss' : 'onAir'} data-testid="block-sheet-close" onClick={() => setSheet(null)}>Continue</Button>}>
        {sheet === 'wrong' ? <><strong>Right answer:</strong> They are the same. 1 GHz is 1000 MHz, so 2 GHz is 2000 MHz.</> : '1 GHz is 1000 MHz, so they are the same.'}
      </BottomSheet>
    </MotionKit>
  );
}
