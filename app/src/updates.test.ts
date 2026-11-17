import { describe, it, expect } from 'vitest';
import { updateLine, ago, canCheck, versionName, UPDATE_WORDS, type UpdateStatus } from './updates';

// T76: what the Settings card says about updates, in plain words (src/updates.ts).
const NOW = Date.UTC(2026, 10, 15, 12, 0, 0);
const st = (patch: Partial<UpdateStatus>): UpdateStatus => ({ state: 'idle', version: '0.1.177', ...patch });

describe('the update line in Settings', () => {
  it('says what the updater is doing', () => {
    expect(updateLine(st({ state: 'unsupported' }), NOW)).toBe('Updates work in the installed Windows app.');
    expect(updateLine(st({ state: 'off' }), NOW)).toBe('Not looking for new versions.');
    expect(updateLine(st({}), NOW)).toBe('Looks for a newer version soon after the app opens.');
    expect(updateLine(st({ checkedAt: NOW - 5 * 60000 }), NOW)).toBe('You have the newest version. Checked 5 minutes ago.');
    expect(updateLine(st({ state: 'checking' }), NOW)).toBe('Looking for a newer version...');
    expect(updateLine(st({ state: 'downloading' }), NOW)).toBe('Fetching a newer version. Keep playing.');
    expect(updateLine(st({ state: 'ready', newVersion: '0.1.180' }), NOW)).toBe('Version 0.1.180 is ready. You get it the next time you open the app.');
    expect(updateLine(st({ state: 'ready', newVersion: 'newer' }), NOW)).toBe('A newer version is ready. You get it the next time you open the app.');
    expect(updateLine(st({ state: 'failed', detail: 'net::ERR_INTERNET_DISCONNECTED' }), NOW)).toBe("Couldn't look just now. It tries again by itself.");
  });
  it('counts time in friendly steps', () => {
    expect(ago(NOW - 20000, NOW)).toBe('just now');
    expect(ago(NOW - 60000, NOW)).toBe('1 minute ago');
    expect(ago(NOW - 59 * 60000, NOW)).toBe('59 minutes ago');
    expect(ago(NOW - 60 * 60000, NOW)).toBe('1 hour ago');
    expect(ago(NOW - 4 * 3600000, NOW)).toBe('4 hours ago');
    expect(ago(NOW - 26 * 3600000, NOW)).toBe('1 day ago');
    expect(ago(NOW - 3 * 86400000, NOW)).toBe('3 days ago');
    expect(ago(NOW + 5000, NOW)).toBe('just now'); // a clock that jumped back never says "minus"
  });
  it('"Check now" can be pressed when nothing is running, not where updates can\'t work', () => {
    expect((['off', 'idle', 'failed'] as const).every(state => canCheck(st({ state })))).toBe(true);
    expect((['unsupported', 'checking', 'downloading', 'ready'] as const).some(state => canCheck(st({ state })))).toBe(false);
  });
  it('shows no number when the installer\'s helper named none', () => {
    expect(versionName('0.1.180')).toBe('0.1.180');
    expect(versionName('newer')).toBe('');
    expect(versionName(undefined)).toBe('');
  });
  // The plan's rule (DESIGN.md, error screens): never blaming words on screen. No internet is normal.
  it('never uses blaming words', () => {
    const all = Object.values(UPDATE_WORDS).map(w => (typeof w === 'function' ? w('0.1.180') : w)).join(' ');
    expect(all).not.toMatch(/fail|fatal|crash|error|invalid/i);
  });
});
