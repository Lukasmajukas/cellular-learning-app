import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { backupNow, showFile, hasFileAccess, type Settings } from './storage';
import { c, COLUMN, mono } from './theme';
import { Icon, type IconName } from './Icon';
import { Button, Card, Switch, Slider, PillChoice, TabHead, BottomSheet, useCalm, QUICK_FADE } from './ui';
import { SAMPLE } from './theme/motion';
import { prefs } from './prefs';
import { play, playSample, SAMPLE_SET } from './sound';
import { GOALS } from './Welcome';
import { WhatHappened } from './Trouble';
import { NO_UPDATER, updateLine, canCheck, checkForUpdate, restartIntoUpdate, type UpdateStatus } from './updates';

// The small square each row starts with (redesign R15, idea I11): its own icon in signal blue, so the list is quick to scan.
// `children` = layers drawn behind the icon (the sample's rings and glow).
function RowIcon({ name, children }: { name: IconName; children?: ReactNode }) {
  return (
    <span aria-hidden data-row-icon={name} style={{ position: 'relative', width: 36, height: 36, flexShrink: 0, display: 'grid', placeItems: 'center',
      borderRadius: 10, background: c.surface2, border: `1px solid ${c.border}`, color: c.signal, boxSizing: 'border-box' }}>
      {children}
      <Icon name={name} size={20} style={{ position: 'relative' }} />
    </span>
  );
}

// One settings row: the icon, the words (a name, and a quieter line saying what it does), the control on the right.
// Rows with a switch are a <label>, so clicking the words flips the switch too. Rows with a button are not
// (a label would pass a click on its words on to the button).
// R22: when the words would get narrower than WORDS_MIN (a phone-narrow window, or a wide control like the volume slider),
// the control moves onto its own line under them, on the right, instead of squeezing the words to one word a line.
const WORDS_MIN = 100;
function Row({ name, hint, icon, control, last, asLabel = true, testId }:
  { name: string; hint?: string; icon: ReactNode; control?: ReactNode; last?: boolean; asLabel?: boolean; testId?: string }) {
  const Tag = asLabel ? 'label' : 'div';
  return (
    <Tag data-testid={testId} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 12, rowGap: 8, minHeight: 60, padding: '8px 0', cursor: asLabel ? 'pointer' : 'default',
      borderBottom: last ? 0 : `1px solid ${c.border}` }}>
      {icon}
      <span style={{ flex: `1 1 ${WORDS_MIN}px`, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 16, fontWeight: 500, lineHeight: 1.25 }}>{name}</span>
        {hint && <span data-part="hint" style={{ display: 'block', fontSize: 14, lineHeight: 1.4, color: c.textMuted, marginTop: 2 }}>{hint}</span>}
      </span>
      {control && <span data-part="control" style={{ marginLeft: 'auto', display: 'flex' }}>{control}</span>}
    </Tag>
  );
}

// "Play a sample": plays the lesson's sounds in a row (a pick, a right answer, a not-quite one, a finished lesson: R19,
// idea I55) and shows it: one soft ring goes out from the play icon with each sound (SAMPLE in the speed file).
// With Reduce motion the icon's glow just fades in and out.
function SampleRow() {
  const calm = useCalm();
  const [plays, setPlays] = useState(0), [playing, setPlaying] = useState(false);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const play = () => {
    const length = playSample();
    setPlays(n => n + 1); setPlaying(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPlaying(false), length * 1000);
  };
  return (
    <Row asLabel={false} last testId="sample-row" name="Play a sample" hint="A pick, right, not quite, lesson done. Works with Sounds off too."
      icon={<RowIcon name="play">
        <motion.span data-part="glow" initial={false} animate={{ opacity: playing ? 1 : 0 }} transition={QUICK_FADE}
          style={{ position: 'absolute', inset: -1, borderRadius: 10, border: `1.5px solid ${c.signal}`, boxShadow: `0 0 14px ${c.signal}` }} />
        {!calm && plays > 0 && SAMPLE_SET.map((_, k) => (
          <motion.span key={`${plays}-${k}`} data-part="ring" data-ring={k} initial={SAMPLE.from} animate={SAMPLE.to} transition={{ ...SAMPLE.ring, delay: k * SAMPLE.gap }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${c.signal}`, pointerEvents: 'none' }} />
        ))}
      </RowIcon>}
      control={<Button kind="quiet" data-testid="sound-sample" data-playing={playing} onClick={play} style={{ padding: '8px 16px' }}>Play</Button>} />
  );
}

// A key on the keyboard, drawn as a small key cap (code font).
function Key({ children }: { children: ReactNode }) {
  return (
    <kbd style={{ ...mono, display: 'inline-block', minWidth: 30, padding: '3px 8px', boxSizing: 'border-box', textAlign: 'center', fontSize: 14,
      lineHeight: 1.4, color: c.text, background: c.surface2, border: `1px solid ${c.borderStrong}`, borderBottomWidth: 2, borderRadius: 7 }}>{children}</kbd>
  );
}
// Every key the app knows (R22: A-I for the match, Tab), shown in the Keys sheet.
export const KEYS: [string, string][] = [['1-9', 'Pick an answer by its number'], ['A-I', 'Pick a partner on the right, in "Match the pairs"'],
  ['Enter', 'Check, or go on'], ['Esc', 'Leave a lesson, close a panel, or go back to the path'],
  ['Arrows', 'Aim on a picture you tap; then Enter taps there'], ['Tab', 'Move to the next button; a blue ring shows where you are']];

// The settings screen, redesign R15: sound (with a sample), movement, daily goal, the look (Night / Day), your progress,
// and the keyboard keys. Every row has its own icon. Built only from the blocks in ./ui (R03).
// R04: it's a tab, so it has no back button (the Path tab, or Esc, goes back).
// T76: the "Updates" card. `update` is the updater's status (src/updates.ts); the switch is the saved setting.
export function SettingsScreen({ settings, onChange, update = NO_UPDATER }: { settings: Settings; onChange: (s: Settings) => void; update?: UpdateStatus }) {
  const [note, setNote] = useState('');
  const [keys, setKeys] = useState(false);
  const files = hasFileAccess();
  const set = (patch: Partial<Settings>) => onChange({ ...settings, ...patch });
  const day = settings.look === 'day';
  const card = { marginBottom: 16, paddingBottom: 8 };
  return (
    <div data-testid="settings" style={{ maxWidth: COLUMN, margin: '0 auto', padding: '16px 20px 32px', boxSizing: 'border-box' }}>
      <TabHead label="Your app" title="Settings" help="Changes are saved on this computer straight away." />

      <Card title="Sound" style={card} data-testid="set-card-sound">
        <Row name="Sounds" hint="Soft sounds for answers, finished lessons and your streak." icon={<RowIcon name={settings.sounds ? 'soundOn' : 'soundOff'} />}
          control={<Switch testId="set-sounds" checked={settings.sounds} onChange={sounds => set({ sounds })} />} />
        {/* R19: how loud the sounds are (quiet by default, 60%). You hear the new loudness when you let go. */}
        <Row asLabel={false} testId="volume-row" name="Volume" hint="You hear it when you let go." icon={<RowIcon name="waves" />}
          control={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Slider testId="set-volume" label="Volume" width={112} value={settings.volume} onChange={volume => set({ volume })}
              onDone={v => { prefs.volume = v / 100; play('right', 0, true); }} />
            <span data-testid="volume-value" style={{ ...mono, fontSize: 14, width: 40, textAlign: 'right', color: c.textMuted }}>{settings.volume}%</span>
          </span>} />
        <SampleRow />
      </Card>

      <Card title="Movement" style={card} data-testid="set-card-motion">
        <Row name="Reduce motion" hint="No bursts, no sliding or bouncing." icon={<RowIcon name="motion" />}
          control={<Switch testId="set-motion" checked={settings.reduceMotion} onChange={reduceMotion => set({ reduceMotion })} />} />
        <Row name="Show frame rate" hint="Pictures per second, in the corner." last icon={<RowIcon name="gauge" />}
          control={<Switch testId="set-fps" checked={settings.showFps} onChange={showFps => set({ showFps })} />} />
      </Card>

      <Card title="Daily goal" style={{ ...card, paddingBottom: 16 }} data-testid="set-card-goal">
        <Row asLabel={false} last name="Lessons a day" hint="The bar at the top fills as you finish them." icon={<RowIcon name="target" />} />
        <div style={{ paddingLeft: 48, marginTop: 4 }}>
          <PillChoice testId="set-goal" label="Daily goal, lessons a day" value={settings.dailyGoal}
            options={GOALS.map(({ n }) => ({ value: n, text: String(n) }))} onChange={dailyGoal => set({ dailyGoal })} />
        </div>
      </Card>

      {/* R22 (idea I57): the Night / Day choice sits on its row's right, like the switches. */}
      <Card title="Look" style={card} data-testid="set-card-look">
        <Row asLabel={false} last name="Colours" icon={<RowIcon name={day ? 'sun' : 'moon'} />}
          hint={day ? 'Light and clear, for daylight.' : 'Dark and calm, for night.'}
          control={<PillChoice testId="set-look" label="Look" value={settings.look}
            options={[{ value: 'night', text: 'Night', icon: 'moon' }, { value: 'day', text: 'Day', icon: 'sun' }]} onChange={look => set({ look })} />} />
      </Card>

      <Card title="Your progress" style={card} data-testid="set-card-progress">
        <Row asLabel={false} name="Back up" hint="The app also makes one each day and keeps 7." icon={<RowIcon name="backup" />}
          control={<Button kind="quiet" data-testid="backup-now" disabled={!files} style={{ padding: '8px 14px' }}
            onClick={async () => setNote(`Backup saved: ${(await backupNow()) ?? 'nothing to back up yet'}`)}>Back up now</Button>} />
        <Row asLabel={false} last name="Progress file" hint="Opens the folder your progress is saved in." icon={<RowIcon name="folder" />}
          control={<Button kind="quiet" data-testid="show-file" disabled={!files} onClick={() => showFile()} style={{ padding: '8px 14px' }}>Show</Button>} />
        {!files && <p style={{ color: c.textMuted, fontSize: 14, margin: '4px 0 8px' }}>Backups need the real app (not the browser preview).</p>}
        {note && <p data-testid="settings-note" role="status" style={{ margin: '4px 0 8px', fontSize: 14, color: c.textMuted, overflowWrap: 'anywhere' }}>{note}</p>}
      </Card>

      {/* T76: the app updates itself. The switch is yours; the version row says what the updater is doing, in plain
          words, and "Check now" asks at once. When a newer version has been fetched the button becomes "Restart now".
          If a check didn't work the reason is folded away (no alarm: no internet is normal, and it asks again). */}
      <Card title="Updates" style={card} data-testid="set-card-updates">
        <Row name="Update by itself" hint="Fetches new versions quietly. You get them the next time you open the app." icon={<RowIcon name="update" />}
          control={<Switch testId="set-autoupdate" checked={settings.autoUpdate} onChange={autoUpdate => set({ autoUpdate })} />} />
        <Row asLabel={false} last testId="version-row" name={update.version ? `Version ${update.version}` : 'Version'} hint={updateLine(update, Date.now())} icon={<RowIcon name="info" />}
          control={update.state === 'ready'
            ? <Button data-testid="update-restart-settings" onClick={() => restartIntoUpdate()} style={{ padding: '8px 14px' }}>Restart now</Button>
            : <Button kind="quiet" data-testid="update-check" disabled={!canCheck(update)} onClick={() => checkForUpdate()} style={{ padding: '8px 14px' }}>Check now</Button>} />
        {update.state === 'failed' && update.detail && <WhatHappened id="update" detail={update.detail} style={{ marginTop: -4 }} />}
      </Card>

      {/* R22 (idea I57): the keys fold into one row; "Show" opens them in a sheet, which gives the keyboard back to "Show" when it closes. */}
      <Card title="Keys" data-testid="set-card-keys" style={{ paddingBottom: 8 }}>
        <Row asLabel={false} last name="Keyboard keys" hint="Play without the mouse." icon={<RowIcon name="keyboard" />}
          control={<Button kind="quiet" data-testid="show-keys" aria-haspopup="dialog" onClick={() => setKeys(true)} style={{ padding: '8px 14px' }}>Show</Button>} />
      </Card>
      <BottomSheet open={keys} tone="info" icon="keyboard" testId="keys-sheet" title="Keys"
        onClose={() => { setKeys(false); document.querySelector<HTMLElement>('[data-testid=show-keys]')?.focus({ preventScroll: true }); }}>
        {KEYS.map(([k, what], i) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 40, padding: '4px 0', borderBottom: i < KEYS.length - 1 ? `1px solid ${c.border}` : 0 }}>
            <span style={{ width: 72, flexShrink: 0 }}><Key>{k}</Key></span>
            <span style={{ fontSize: 15, color: c.textMuted }}>{what}</span>
          </div>
        ))}
      </BottomSheet>
    </div>
  );
}

