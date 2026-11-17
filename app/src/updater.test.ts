import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
const { createUpdater, createPretendUpdater, whyNot, feedsFrom, updateExeFor, FIRST_CHECK_MS, FIRST_RUN_CHECK_MS, EVERY_MS } =
  createRequire(import.meta.url)('../electron/updater.cjs');

// T76: the app updates itself. These tests act it out with a pretend Electron updater and a pretend clock the test winds
// by hand, so they run on any computer. The real thing (a real install, a real update) is tested on the Windows build
// by tools/update-e2e.mjs.
const CLOUDFLARE = 'https://cell-learning-updates.example.workers.dev/win';
const GITHUB = 'https://github.com/Lukasmajukas/cellular-learning-app/releases/download/latest-build';

type Status = { state: string; version: string; newVersion?: string; checkedAt?: number; detail?: string; why?: string };
function setup(options: Record<string, unknown> = {}) {
  // The pretend Electron updater: remembers which address it was given and each check; the test fires its events.
  const au = Object.assign(new EventEmitter(), {
    url: '', checks: [] as string[], quitAndInstall: vi.fn(),
    setFeedURL(o: { url: string }) { this.url = o.url; },
    checkForUpdates() { this.checks.push(this.url); },
  });
  const timers: { fn: () => void; ms: number; cleared: boolean; ran: boolean }[] = [];
  const setTimer = (fn: () => void, ms: number) => { const t = { fn, ms, cleared: false, ran: false }; timers.push(t); return t; };
  const clearTimer = (t: { cleared: boolean } | null) => { if (t) t.cleared = true; };
  const waiting = () => timers.filter(t => !t.cleared && !t.ran);
  // Winds the clock: runs the one timer that is waiting (there is never more than one).
  const wind = () => { const [t] = waiting(); t.ran = true; t.fn(); };
  const seen: Status[] = [];
  const log: Record<string, unknown>[] = [];
  let clock = 1000;
  const updater = createUpdater({ autoUpdater: au, feeds: [CLOUDFLARE, GITHUB], version: '0.1.177', setTimer, clearTimer,
    now: () => clock, onStatus: (s: Status) => seen.push(s), log: (e: Record<string, unknown>) => log.push(e), ...options });
  return { au, updater, timers, waiting, wind, seen, log, tick: (ms: number) => { clock += ms; } };
}

describe('where the updater may run', () => {
  const ok = { platform: 'win32', packaged: true, hasUpdateExe: true, feeds: [GITHUB] };
  it('only in the installed Windows app', () => {
    expect(whyNot(ok)).toBeNull();
    expect(whyNot({ ...ok, platform: 'darwin' })).toBe('not-windows');
    expect(whyNot({ ...ok, platform: 'linux' })).toBe('not-windows');
    expect(whyNot({ ...ok, packaged: false })).toBe('not-packaged');       // `npm start`, the click tests
    expect(whyNot({ ...ok, hasUpdateExe: false })).toBe('not-installed');  // unpacked from a zip: no installer's helper
    expect(whyNot({ ...ok, feeds: [] })).toBe('no-address');
  });
  it('finds the installer\'s helper one folder above the program', () => {
    expect(updateExeFor('C:\\Users\\Lukas\\AppData\\Local\\CellLearning\\app-0.1.177\\Cell Learning.exe'))
      .toBe('C:\\Users\\Lukas\\AppData\\Local\\CellLearning\\Update.exe');
  });
  it('where it can\'t run it does nothing at all: no listening, no timer, no check', () => {
    const s = setup({ why: 'not-packaged' });
    expect(s.updater.status()).toEqual({ state: 'unsupported', version: '0.1.177', why: 'not-packaged' });
    expect(s.timers).toHaveLength(0);
    expect(s.au.eventNames()).toEqual([]);
    s.updater.check(); s.updater.setEnabled(true);
    expect(s.au.checks).toEqual([]);
    expect(s.updater.restart()).toBe(false);
  });
});

describe('the list of addresses', () => {
  it('comes from the config file, in order, without a slash at the end', () => {
    expect(feedsFrom({ feeds: [`${CLOUDFLARE}/`, GITHUB] })).toEqual([CLOUDFLARE, GITHUB]);
  });
  it('drops anything that is not a web address', () => {
    expect(feedsFrom({ feeds: ['', 'ftp://x', 'not an address', GITHUB, 42] })).toEqual([GITHUB]);
    expect(feedsFrom(null)).toEqual([]);
    expect(feedsFrom({ feeds: 'oops' })).toEqual([]);
  });
  it('tests can replace it (CELL_UPDATE_URL), one address or several with commas', () => {
    expect(feedsFrom({ feeds: [GITHUB] }, 'http://127.0.0.1:9/win, http://127.0.0.1:8123/win')).toEqual(['http://127.0.0.1:9/win', 'http://127.0.0.1:8123/win']);
  });
});

describe('when it asks', () => {
  it('first 15 seconds after the app opens, not at once', () => {
    const s = setup();
    expect(s.updater.status().state).toBe('idle');
    expect(s.au.checks).toEqual([]);
    expect(s.waiting().map(t => t.ms)).toEqual([FIRST_CHECK_MS]);
    expect(FIRST_CHECK_MS).toBe(15000);
  });
  it('a full minute after the very first start (the installer still holds its lock then)', () => {
    const s = setup({ firstRun: true });
    expect(s.waiting().map(t => t.ms)).toEqual([FIRST_RUN_CHECK_MS]);
    expect(FIRST_RUN_CHECK_MS).toBe(60000);
  });
  it('then again every 4 hours while the app stays open', () => {
    const s = setup();
    s.wind(); s.au.emit('update-not-available');
    expect(s.waiting().map(t => t.ms)).toEqual([EVERY_MS]);
    expect(EVERY_MS).toBe(4 * 60 * 60 * 1000);
    s.wind();
    expect(s.au.checks).toEqual([CLOUDFLARE, CLOUDFLARE]); // each round starts at the front door again
  });
});

describe('a round', () => {
  it('nothing newer: asks the front door, says so, notes when', () => {
    const s = setup();
    s.wind();
    expect(s.au.checks).toEqual([CLOUDFLARE]);
    expect(s.updater.status().state).toBe('checking');
    s.tick(500); s.au.emit('update-not-available');
    expect(s.updater.status()).toEqual({ state: 'idle', version: '0.1.177', checkedAt: 1500 });
  });
  it('a newer version: downloading, then ready with its number; it never restarts by itself', () => {
    const s = setup();
    s.wind();
    s.au.emit('checking-for-update'); s.au.emit('update-available');
    expect(s.updater.status().state).toBe('downloading');
    s.au.emit('update-downloaded', {}, 'notes', '0.1.180');
    expect(s.updater.status()).toMatchObject({ state: 'ready', version: '0.1.177', newVersion: '0.1.180' });
    expect(s.seen.map(x => x.state)).toEqual(['checking', 'checking', 'downloading', 'ready']);
    expect(s.au.quitAndInstall).not.toHaveBeenCalled();
  });
  it('"Restart now" is the only way to the restart, and only once a version waits', () => {
    const s = setup();
    expect(s.updater.restart()).toBe(false);
    expect(s.au.quitAndInstall).not.toHaveBeenCalled();
    s.wind(); s.au.emit('update-downloaded', {}, '', '0.1.180');
    expect(s.updater.restart()).toBe(true);
    expect(s.au.quitAndInstall).toHaveBeenCalledTimes(1);
  });
  it('once fetched it stays "ready": a later check that finds nothing newer does not hide it', () => {
    const s = setup();
    s.wind(); s.au.emit('update-downloaded', {}, '', '0.1.180');
    s.wind(); expect(s.updater.status().state).toBe('checking');
    s.au.emit('update-not-available');
    expect(s.updater.status()).toMatchObject({ state: 'ready', newVersion: '0.1.180' });
    s.wind(); s.au.emit('error', new Error('offline')); s.au.emit('error', new Error('offline'));
    expect(s.updater.status()).toMatchObject({ state: 'ready', newVersion: '0.1.180' });
  });
});

describe('when an address does not answer', () => {
  it('Cloudflare down: asks GitHub, the spare, in the same round', () => {
    const s = setup();
    s.wind();
    s.au.emit('error', new Error('getaddrinfo ENOTFOUND'));
    expect(s.au.checks).toEqual([CLOUDFLARE, GITHUB]);
    s.au.emit('update-downloaded', {}, '', '0.1.180');
    expect(s.updater.status()).toMatchObject({ state: 'ready', newVersion: '0.1.180' });
    expect(s.log.filter(e => e.event === 'failed')).toEqual([{ event: 'failed', feed: 0, url: CLOUDFLARE, detail: 'getaddrinfo ENOTFOUND' }]);
    expect(s.log.find(e => e.event === 'ready')).toMatchObject({ feed: 1 });
  });
  it('no internet at all: stays quiet, keeps the reason, and asks again in 4 hours', () => {
    const s = setup();
    s.wind();
    s.au.emit('error', new Error('net::ERR_INTERNET_DISCONNECTED'));
    s.au.emit('error', new Error('net::ERR_INTERNET_DISCONNECTED'));
    expect(s.au.checks).toEqual([CLOUDFLARE, GITHUB]);
    expect(s.updater.status()).toMatchObject({ state: 'failed', detail: 'net::ERR_INTERNET_DISCONNECTED' });
    expect(s.waiting().map(t => t.ms)).toEqual([EVERY_MS]);
    // The next round works: the old reason is gone.
    s.wind(); s.au.emit('update-not-available');
    expect(s.updater.status().state).toBe('idle');
    expect(s.updater.status().detail).toBeUndefined();
  });
  it('a check that throws straight away counts the same as one that reports an error later', () => {
    const s = setup();
    s.au.checkForUpdates = function () { this.checks.push(this.url); if (this.url === CLOUDFLARE) throw new Error('boom'); };
    s.wind();
    expect(s.au.checks).toEqual([CLOUDFLARE, GITHUB]);
    expect(s.updater.status().state).toBe('checking');
  });
  it('an error when nothing was asked is ignored (and never stops the program)', () => {
    const s = setup();
    expect(() => s.au.emit('error', new Error('stray'))).not.toThrow();
    expect(s.updater.status().state).toBe('idle');
    expect(s.au.checks).toEqual([]);
  });
});

describe('the Settings switch and "Check now"', () => {
  it('switched off from the start: no timer, no check', () => {
    const s = setup({ enabled: false });
    expect(s.updater.status().state).toBe('off');
    expect(s.timers).toHaveLength(0);
  });
  it('switching off cancels the next round; switching on plans one', () => {
    const s = setup();
    s.updater.setEnabled(false);
    expect(s.waiting()).toHaveLength(0);
    expect(s.updater.status().state).toBe('off');
    s.updater.setEnabled(true);
    expect(s.updater.status().state).toBe('idle');
    expect(s.waiting().map(t => t.ms)).toEqual([FIRST_CHECK_MS]);
    s.updater.setEnabled(true); // saving the same setting again (every save does) plans nothing more
    expect(s.waiting()).toHaveLength(1);
  });
  it('"Check now" asks at once, also with the switch off, and then plans no further round', () => {
    const s = setup({ enabled: false });
    s.updater.check();
    expect(s.au.checks).toEqual([CLOUDFLARE]);
    s.au.emit('update-not-available');
    expect(s.waiting()).toHaveLength(0);
  });
  it('"Check now" during a round does not start a second one', () => {
    const s = setup();
    s.wind(); s.updater.check(); s.updater.check();
    expect(s.au.checks).toEqual([CLOUDFLARE]);
  });
  it('"Check now" replaces the planned round instead of adding one', () => {
    const s = setup();
    s.updater.check();
    expect(s.waiting()).toHaveLength(0);
    s.au.emit('update-not-available');
    expect(s.waiting().map(t => t.ms)).toEqual([EVERY_MS]);
  });
});

describe('the pretend updater (click tests only)', () => {
  it('shows the status it was given and remembers what was pressed', () => {
    const p = createPretendUpdater({ state: 'ready', version: '0.1.5', newVersion: '0.1.6' });
    expect(p.status()).toEqual({ state: 'ready', version: '0.1.5', newVersion: '0.1.6' });
    expect(p.restart()).toBe(true);
    p.check();
    expect(p.status()).toMatchObject({ restartAsked: true, checkAsked: 1 });
  });
});
