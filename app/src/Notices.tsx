import { AnimatePresence, motion } from 'motion/react';
import { c, COLUMN, RADIUS, mono } from './theme';
import { Icon } from './Icon';
import { Button, IconButton, Pill, SectionLabel } from './ui';
import { noticeMotion, useCalm } from './theme/motion';
import type { Change } from './changes';

// Notices at the top of the frame (redesign R13): "your save was restored" and the "This changed" card.
// Each one slides down a little and fades in; closing it fades it out, and the page under it glides up into the space
// (main.tsx wraps the page in a layout move, NOTICE.shift). A second "This changed" card takes the first one's place.
// Speeds: NOTICE in src/theme/motion.tsx.
const wrap = { maxWidth: COLUMN, margin: '0 auto', padding: '12px 20px 0', boxSizing: 'border-box' } as const;

export function Notices({ restored, onCloseRestored, change, changeOf, onChangeOk }:
  { restored: string | null; onCloseRestored: () => void; change?: Change; changeOf: number; onChangeOk: () => void }) {
  const calm = useCalm();
  return (
    // popLayout: a closing notice steps out of the page's flow at once (it fades out on top), so the page under it can
    // glide up in the same moment (main.tsx). Without it, the page only noticed the space once the notice was gone,
    // and then jumped (found in R13's click test).
    <AnimatePresence initial={false} mode="popLayout">
      {restored !== null && (
        <motion.div key="restored" data-notice style={wrap} {...noticeMotion(calm)}>
          <RestoredNotice when={restored} onClose={onCloseRestored} />
        </motion.div>
      )}
      {change && (
        <motion.div key={`change-${change.id}`} data-notice style={wrap} {...noticeMotion(calm)}>
          <ChangeCard change={change} of={changeOf} onOk={onChangeOk} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// "Your save file was damaged": calm and plain, in the notice colours (warm, not red: nothing you did wrong).
// `when` is the backup's day in words ("from yesterday"), or '' if it isn't known.
export function RestoredNotice({ when, onClose }: { when: string; onClose: () => void }) {
  return (
    <section data-testid="notice" role="status" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 4px 12px 16px',
      borderRadius: RADIUS.card, background: c.noticeBg, border: `1px solid ${c.notice}`, color: c.notice }}>
      <Icon name="repair" size={22} style={{ marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Your progress is safe</div>
        <p data-testid="notice-text" style={{ margin: '2px 0 0', fontSize: 15, lineHeight: 1.4 }}>
          Your save file was damaged, so I restored your backup{when ? ` ${when}` : ''}. Anything you did after it may need doing again.
        </p>
      </div>
      <IconButton icon="close" label="Close this notice" data-testid="notice-close" onClick={onClose} style={{ color: c.notice, marginTop: -8 }} />
    </section>
  );
}

// "This changed": a carrier fact changed after the lessons were written (content/changes.json). Shown once; "Got it"
// restarts that fact's questions, so they come back in the daily review.
export function ChangeCard({ change, of, onOk }: { change: Change; of: number; onOk: () => void }) {
  const n = change.questions?.length ?? 0;
  return (
    <section data-testid="change-card" style={{ padding: 16, borderRadius: RADIUS.card, background: c.surface2, border: `1px solid ${c.signal}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ width: 36, height: 36, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0, color: c.signal,
          background: `color-mix(in srgb, ${c.signal} 14%, transparent)`, border: `1px solid ${c.signal}` }}><Icon name="waves" size={20} /></span>
        <SectionLabel tone="signal" style={{ margin: 0, flex: 1 }}>This changed</SectionLabel>
        {of > 1 && <span data-testid="change-of" style={{ ...mono, fontSize: 14, color: c.textMuted }}>1 of {of}</span>}
      </div>
      <h2 data-testid="change-title" style={{ margin: '0 0 6px', fontSize: 18, lineHeight: 1.25 }}>{change.title}</h2>
      <p style={{ margin: '0 0 10px', fontSize: 16, lineHeight: 1.4 }}>{change.text}</p>
      <div data-testid="change-meta" style={{ fontSize: 14, color: c.textMuted, lineHeight: 1.4, marginBottom: n ? 10 : 12 }}>
        As of <span style={mono}>{change.date}</span> · Source: {change.source}
      </div>
      {n > 0 && <Pill tone="review" icon="repeat" data-testid="change-review" style={{ marginBottom: 12, whiteSpace: 'normal' }}>
        {n} {n === 1 ? 'question comes' : 'questions come'} back for review</Pill>}
      <Button full data-testid="change-ok" onClick={onOk}>Got it</Button>
    </section>
  );
}
