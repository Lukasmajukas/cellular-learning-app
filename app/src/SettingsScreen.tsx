import { useState } from 'react';
import { backupNow, showFile, hasFileAccess, type Settings } from './storage';
import { c, COLUMN } from './theme';
import { Icon } from './Icon';

// The settings screen: sounds, reduce motion, daily goal, look, backup, and where the save file is.
export function SettingsScreen({ settings, onChange, onBack }: { settings: Settings; onChange: (s: Settings) => void; onBack: () => void }) {
  const [note, setNote] = useState('');
  const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${c.border}` } as const;
  const btn = { padding: '8px 14px', borderRadius: 10, border: `1px solid ${c.borderStrong}`, background: c.surface, color: c.signal, cursor: 'pointer', fontSize: 14 } as const;
  const files = hasFileAccess();
  return (
    <div style={{ maxWidth: COLUMN, margin: '0 auto', padding: 20, boxSizing: 'border-box' }}>
      <button data-testid="settings-back" onClick={onBack} style={{ ...btn, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="back" size={18} />Back</button>
      <h1 style={{ margin: '12px 0' }}>Settings</h1>
      <label style={row}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name={settings.sounds ? 'soundOn' : 'soundOff'} size={20} style={{ color: c.textMuted }} />Sounds</span>
        <input data-testid="set-sounds" type="checkbox" checked={settings.sounds} onChange={e => onChange({ ...settings, sounds: e.target.checked })} /></label>
      <label style={row}>Reduce motion (no confetti, no movement)
        <input data-testid="set-motion" type="checkbox" checked={settings.reduceMotion} onChange={e => onChange({ ...settings, reduceMotion: e.target.checked })} /></label>
      <label style={row}>Show frame rate (pictures per second)
        <input data-testid="set-fps" type="checkbox" checked={settings.showFps} onChange={e => onChange({ ...settings, showFps: e.target.checked })} /></label>
      <label style={row}>Daily goal (lessons a day)
        <select data-testid="set-goal" value={settings.dailyGoal} onChange={e => onChange({ ...settings, dailyGoal: Number(e.target.value) })}>
          {[1, 2, 3, 5].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
      <label style={row}>Day look (light; an early test, finished later)
        <input data-testid="set-day" type="checkbox" checked={settings.look === 'day'} onChange={e => onChange({ ...settings, look: e.target.checked ? 'day' : 'night' })} /></label>
      <div style={{ ...row, borderBottom: 0 }}>
        <button data-testid="backup-now" style={btn} disabled={!files}
          onClick={async () => setNote(`Backup saved: ${(await backupNow()) ?? 'nothing to back up yet'}`)}>Back up my progress now</button>
        <button data-testid="show-file" style={btn} disabled={!files} onClick={() => showFile()}>Show my progress file</button>
      </div>
      {!files && <p style={{ color: c.textMuted }}>Backups need the real app (not the browser preview).</p>}
      <p data-testid="settings-note" style={{ minHeight: 20 }}>{note}</p>
    </div>
  );
}
