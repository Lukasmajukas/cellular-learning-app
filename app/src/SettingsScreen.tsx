import { useState, type ReactNode } from 'react';
import { backupNow, showFile, hasFileAccess, type Settings } from './storage';
import { c, COLUMN } from './theme';
import { Icon } from './Icon';
import { Button, IconButton, Card, Switch, PillChoice } from './ui';

// One settings row: the words on the left (a name, and a quieter line saying what it does), the control on the right.
// Rows with a switch are a <label>, so clicking the words flips the switch too.
function Row({ name, hint, icon, control, last, asLabel = true }: { name: string; hint?: string; icon?: ReactNode; control: ReactNode; last?: boolean; asLabel?: boolean }) {
  const Tag = asLabel ? 'label' : 'div';
  return (
    <Tag style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, padding: '6px 0', cursor: asLabel ? 'pointer' : 'default',
      borderBottom: last ? 0 : `1px solid ${c.border}` }}>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 500 }}>{icon}{name}</span>
        {hint && <span style={{ display: 'block', fontSize: 14, color: c.textMuted, marginTop: 2 }}>{hint}</span>}
      </span>
      {control}
    </Tag>
  );
}

// The settings screen: sounds, reduce motion, frame rate, daily goal, look, backup, and where the save file is.
// Redesign R03: the first screen built only from the building blocks in ./ui (cards, switches, pill choice, buttons).
export function SettingsScreen({ settings, onChange, onBack }: { settings: Settings; onChange: (s: Settings) => void; onBack: () => void }) {
  const [note, setNote] = useState('');
  const files = hasFileAccess();
  const set = (patch: Partial<Settings>) => onChange({ ...settings, ...patch });
  return (
    <div data-testid="settings" style={{ maxWidth: COLUMN, margin: '0 auto', padding: '8px 20px 32px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '0 0 12px -10px' }}>
        <IconButton data-testid="settings-back" icon="back" label="Back to the path" onClick={onBack} />
        <h1 style={{ margin: 0 }}>Settings</h1>
      </div>

      <Card title="Sound and movement" style={{ marginBottom: 16, paddingBottom: 6 }}>
        <Row name="Sounds" hint="A soft sound for right and wrong answers."
          icon={<Icon name={settings.sounds ? 'soundOn' : 'soundOff'} size={20} style={{ color: c.textMuted }} />}
          control={<Switch testId="set-sounds" checked={settings.sounds} onChange={sounds => set({ sounds })} />} />
        <Row name="Reduce motion" hint="No confetti, no sliding or bouncing."
          control={<Switch testId="set-motion" checked={settings.reduceMotion} onChange={reduceMotion => set({ reduceMotion })} />} />
        <Row name="Show frame rate" hint="Pictures per second, in the corner." last
          control={<Switch testId="set-fps" checked={settings.showFps} onChange={showFps => set({ showFps })} />} />
      </Card>

      <Card title="Daily goal" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 10 }}>Lessons a day</div>
        <PillChoice testId="set-goal" label="Daily goal, lessons a day" value={settings.dailyGoal}
          options={[1, 2, 3, 5].map(n => ({ value: n, text: String(n) }))} onChange={dailyGoal => set({ dailyGoal })} />
      </Card>

      <Card title="Look" style={{ marginBottom: 16, paddingBottom: 6 }}>
        <Row name="Day look" hint="Light colours. An early test, finished later." last
          control={<Switch testId="set-day" checked={settings.look === 'day'} onChange={on => set({ look: on ? 'day' : 'night' })} />} />
      </Card>

      <Card title="Your progress">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Button kind="quiet" data-testid="backup-now" disabled={!files}
            onClick={async () => setNote(`Backup saved: ${(await backupNow()) ?? 'nothing to back up yet'}`)}>Back up now</Button>
          <Button kind="quiet" data-testid="show-file" disabled={!files} onClick={() => showFile()}>Show my progress file</Button>
        </div>
        {!files && <p style={{ color: c.textMuted, fontSize: 14, margin: '10px 0 0' }}>Backups need the real app (not the browser preview).</p>}
        {note && <p data-testid="settings-note" role="status" style={{ margin: '10px 0 0', fontSize: 14, color: c.textMuted, overflowWrap: 'anywhere' }}>{note}</p>}
      </Card>
    </div>
  );
}
