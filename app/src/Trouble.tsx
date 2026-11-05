import { Component, Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { c, COLUMN, RADIUS, mono } from './theme';
import { Beacon, BEACON_SIZE, Button, SectionLabel, MotionKit } from './ui';
import { showFile, hasFileAccess } from './storage';
import { useKeys, pressFor } from './keys';
import { Icon } from './Icon';
import { BOOT, endStartScreen } from './startup';

// The friendly error screens (redesign R21). Calm and kind, like a radio that lost its signal for a moment:
//   'load'  the progress file couldn't be opened (nothing was changed; the app never writes until a load worked);
//   'crash' the app itself tripped over something (the error boundary below caught it).
// Both: a worried Beacon, what happened in plain words, "Try again" (Enter), and the exact error folded away under
// "What happened", to tell Claude if it keeps happening.
export const TROUBLE = {
  load: { title: "I couldn't open your progress", text: "Your progress file is still there, and nothing in it was changed. Try again in a moment." },
  crash: { title: 'Something went wrong', text: "It's not you: the app tripped over something. Your finished lessons are saved, so they're safe." },
} as const;

export function Trouble({ kind, detail, onRetry }: { kind: keyof typeof TROUBLE; detail: string; onRetry: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => endStartScreen(!!BOOT.calm), []); // it may come up before the app was ever ready
  useKeys(k => (k === 'enter' ? pressFor(root.current, k) : false));
  const t = TROUBLE[kind];
  const [more, setMore] = useState(false);
  return (
    <MotionKit calm={!!BOOT.calm}>
      <div ref={root} data-testid={`trouble-${kind}`} role="alert" style={{ maxWidth: COLUMN, margin: '0 auto', padding: '32px 20px', boxSizing: 'border-box',
        minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Beacon face="oops" size={BEACON_SIZE.complete * 0.86} data-testid="trouble-beacon" /></div>
        <SectionLabel tone="notice" style={{ margin: 0, textAlign: 'center' }}>No signal</SectionLabel>
        <h1 style={{ margin: '2px 0 8px', fontSize: 28, textAlign: 'center' }}>{t.title}</h1>
        <p style={{ margin: '0 0 24px', fontSize: 16, color: c.textMuted, textAlign: 'center' }}>{t.text}</p>
        <Button full big data-primary data-testid="trouble-retry" onClick={onRetry}>Try again</Button>
        {kind === 'load' && hasFileAccess() && (
          <Button full kind="quiet" icon="folder" data-testid="trouble-file" onClick={() => showFile()} style={{ marginTop: 12 }}>Show the progress file</Button>
        )}
        {/* Design review 3 (R24): our own chevron after the words, like every other fold in the app ("Clue by clue"),
            instead of the browser's own grey triangle in front of them. */}
        <details data-testid="trouble-details" onToggle={e => setMore(e.currentTarget.open)} style={{ marginTop: 20, fontSize: 14, color: c.textMuted }}>
          <summary style={{ cursor: 'pointer', padding: '10px 0', minHeight: 24, listStyle: 'none', display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
            What happened<Icon name="chevron" size={16} style={{ transform: `rotate(${more ? -90 : 90}deg)` }} /></summary>
          <p style={{ margin: '4px 0 8px' }}>If this keeps happening, tell Claude what it says here.</p>
          <pre data-testid="trouble-detail" style={{ ...mono, margin: 0, padding: 12, fontSize: 13, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            color: c.text, background: c.surface, border: `1px solid ${c.border}`, borderRadius: RADIUS.tile }}>{detail}</pre>
        </details>
      </div>
    </MotionKit>
  );
}

// Catches a crash anywhere in the app and shows the 'crash' screen instead of a blank window. "Try again" starts the app
// again from its save file (a fresh copy of everything inside, so nothing half-done is left over).
export class Safety extends Component<{ children: ReactNode }, { error: Error | null; round: number }> {
  state = { error: null as Error | null, round: 0 };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error) { console.error('The app tripped over:', error); }
  render() {
    const { error, round } = this.state;
    if (error) return <Trouble kind="crash" detail={`${error.name}: ${error.message}`} onRetry={() => this.setState({ error: null, round: round + 1 })} />;
    return <Fragment key={round}>{this.props.children}</Fragment>;
  }
}
