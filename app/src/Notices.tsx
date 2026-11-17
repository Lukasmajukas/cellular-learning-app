import { AnimatePresence, motion } from 'motion/react';
import { c, COLUMN, RADIUS, mono } from './theme';
import { Icon } from './Icon';
import { Button, IconButton, Pill, SectionLabel } from './ui';
import { noticeMotion, useCalm } from './theme/motion';
import type { Change } from './changes';
import { WhatHappened } from './Trouble';
import { UPDATE_WORDS, versionName } from './updates';

// Notices at the top of the frame (redesign R13): "your save was restored" and the "This changed" card; idea I69 added
// "Couldn't save your last change", always the top one, because it's the one that can cost you something.
// Each one slides down a little and fades in; closing it fades it out, and the page under it glides up into the space
// (main.tsx wraps the page in a layout move, NOTICE.shift). A second "This changed" card takes the first one's place.
// Speeds: NOTICE in src/theme/motion.tsx.
const wrap = { maxWidth: COLUMN, margin: '0 auto', padding: '12px 20px 0', boxSizing: 'border-box' } as const;

// saveFail: the last save didn't work (null = it did); see SaveFailedNotice.
// update (T76): a newer version of the app has been fetched and waits for a restart (its number; null = nothing to show).
export type SaveFail = { detail: string; tries: number };
export function Notices({ saveFail, onRetrySave, restored, onCloseRestored, change, changeOf, onChangeOk, update = null, onUpdateRestart, onUpdateClose }:
  { saveFail?: SaveFail | null; onRetrySave?: () => void; restored: string | null; onCloseRestored: () => void; change?: Change; changeOf: number; onChangeOk: () => void;
    update?: string | null; onUpdateRestart?: () => void; onUpdateClose?: () => void }) {
  const calm = useCalm();
  return (
    // popLayout: a closing notice steps out of the page's flow at once (it fades out on top), so the page under it can
    // glide up in the same moment (main.tsx). Without it, the page only noticed the space once the notice was gone,
    // and then jumped (found in R13's click test).
    <AnimatePresence initial={false} mode="popLayout">
      {saveFail && (
        <motion.div key="savefail" data-notice style={wrap} {...noticeMotion(calm)}>
          <SaveFailedNotice fail={saveFail} onRetry={() => onRetrySave?.()} />
        </motion.div>
      )}
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
      {update !== null && (
        <motion.div key="update" data-notice style={wrap} {...noticeMotion(calm)}>
          <UpdateReadyNotice version={update} onRestart={() => onUpdateRestart?.()} onClose={() => onUpdateClose?.()} />
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

// Idea I69: "Couldn't save your last change". Saving can fail (a full disk, the file locked by another program); before,
// that was only written to the log, so a finished lesson could be lost without you knowing. Same warm notice look as
// "Your progress is safe" (not red: nothing you did wrong), with the backup icon. There's no close button on purpose:
// hiding it would hide a change that isn't saved. It goes by itself as soon as a save works: Try again saves at once,
// and every later change (the whole progress is saved each time) tries again too.
export const SAVE_FAIL = {
  title: "Couldn't save your last change",
  text: "It's still here while the app stays open, but it isn't in your progress file yet. Keep the app open and try again.",
  tries: (n: number) => `Tried ${n} times. A full disk, or another program using the progress file, can cause this.`,
} as const;
export function SaveFailedNotice({ fail, onRetry }: { fail: SaveFail; onRetry: () => void }) {
  return (
    <section data-testid="savefail" role="alert" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px',
      borderRadius: RADIUS.card, background: c.noticeBg, border: `1px solid ${c.notice}`, color: c.notice }}>
      <Icon name="backup" size={22} style={{ marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{SAVE_FAIL.title}</div>
        <p data-testid="savefail-text" style={{ margin: '2px 0 0', fontSize: 15, lineHeight: 1.4 }}>{SAVE_FAIL.text}</p>
        {fail.tries > 1 && <p data-testid="savefail-tries" style={{ margin: '6px 0 0', fontSize: 15, lineHeight: 1.4 }}>{SAVE_FAIL.tries(fail.tries)}</p>}
        <Button data-testid="savefail-retry" onClick={onRetry} style={{ marginTop: 12 }}>Try again</Button>
        <WhatHappened id="savefail" detail={fail.detail} color={c.notice} style={{ marginTop: 4 }} />
      </div>
    </section>
  );
}

// T76: "A new version is ready". The app fetched a newer version of itself in the background (electron/updater.cjs)
// and will use it the next time it opens; "Restart now" does that at once. Good news, so it wears the calm signal-blue
// card look of "This changed", not the warm notice colours. It can be closed: nothing is lost, the new version is
// used at the next start anyway. Lessons don't show the frame, so this never appears in the middle of one.
export function UpdateReadyNotice({ version, onRestart, onClose }: { version: string; onRestart: () => void; onClose: () => void }) {
  const named = versionName(version); // '' when the installer's helper named no version: then no number is shown
  return (
    <section data-testid="update-ready" role="status" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 4px 12px 16px',
      borderRadius: RADIUS.card, background: c.surface2, border: `1px solid ${c.signal}` }}>
      <Icon name="update" size={22} style={{ marginTop: 2, color: c.signal, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{UPDATE_WORDS.noteTitle}</div>
        <p data-testid="update-ready-text" style={{ margin: '2px 0 0', fontSize: 15, lineHeight: 1.4, color: c.textMuted }}>
          {named && <>Version <span data-testid="update-ready-version" style={mono}>{named}</span>. </>}{UPDATE_WORDS.noteText}
        </p>
        <Button data-testid="update-restart" onClick={onRestart} style={{ marginTop: 12 }}>Restart now</Button>
      </div>
      <IconButton icon="close" label="Close this notice" data-testid="update-close" onClick={onClose} style={{ marginTop: -8 }} />
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
