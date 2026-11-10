import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
const { handleInstallerSignal, signalFor, GIVE_UP_MS } = createRequire(import.meta.url)('../electron/squirrel.cjs');

// T67: the Windows installer starts the app with a signal as the first argument and waits for the app to answer and quit.
// These tests act the installer out with a pretend Windows computer and a pretend Update.exe, so they run anywhere.
const EXE = 'C:\\Users\\Lukas\\AppData\\Local\\CellLearning\\app-0.1.0\\Cell Learning.exe';
const UPDATE_EXE = 'C:\\Users\\Lukas\\AppData\\Local\\CellLearning\\Update.exe';

// A pretend Update.exe, and a pretend clock the test winds by hand.
function setup(argv: string[], platform = 'win32') {
  const child = new EventEmitter();
  const spawnFn = vi.fn((_program: string, _args: string[], _options: object) => child);
  const quit = vi.fn();
  const timers: { fn: () => void; ms: number; cleared: boolean }[] = [];
  const setTimer = (fn: () => void, ms: number) => { const t = { fn, ms, cleared: false }; timers.push(t); return t; };
  const clearTimer = (t: { cleared: boolean } | null) => { if (t) t.cleared = true; };
  const run = () => handleInstallerSignal({ quit, platform, argv: ['C:\\x\\Cell Learning.exe', ...argv], execPath: EXE, spawnFn, setTimer, clearTimer });
  const winding = () => timers.filter(t => !t.cleared).forEach(t => t.fn());
  return { child, spawnFn, quit, timers, run, winding };
}

describe('the installer\'s start-up signals', () => {
  it.each(['--squirrel-install', '--squirrel-updated'])('%s: makes the icons, then quits (and opens no window)', signal => {
    const s = setup([signal, '0.1.0']);
    expect(s.run()).toBe(true); // true = "this was the installer; open no window"
    expect(s.spawnFn).toHaveBeenCalledTimes(1);
    expect(s.spawnFn).toHaveBeenCalledWith(UPDATE_EXE, ['--createShortcut=Cell Learning.exe'], { detached: true });
    expect(s.quit).not.toHaveBeenCalled(); // waits for Update.exe to finish the icons first
    s.child.emit('close');
    expect(s.quit).toHaveBeenCalledTimes(1);
  });

  it('--squirrel-uninstall: removes the icons, then quits', () => {
    const s = setup(['--squirrel-uninstall', '0.1.0']);
    expect(s.run()).toBe(true);
    expect(s.spawnFn).toHaveBeenCalledWith(UPDATE_EXE, ['--removeShortcut=Cell Learning.exe'], { detached: true });
    s.child.emit('close');
    expect(s.quit).toHaveBeenCalledTimes(1);
  });

  it('--squirrel-obsolete: quits right away and runs nothing', () => {
    const s = setup(['--squirrel-obsolete', '0.1.0']);
    expect(s.run()).toBe(true);
    expect(s.quit).toHaveBeenCalledTimes(1);
    expect(s.spawnFn).not.toHaveBeenCalled();
  });

  it('--squirrel-firstrun is NOT answered: the app just opens, as the first real start after install', () => {
    const s = setup(['--squirrel-firstrun']);
    expect(s.run()).toBe(false);
    expect(s.spawnFn).not.toHaveBeenCalled();
    expect(s.quit).not.toHaveBeenCalled();
  });

  it('a normal start (clicking the icon, or `electron .`) is left alone', () => {
    for (const argv of [[], ['.'], ['--cell-look=night'], ['C:\\somewhere\\main.cjs']]) {
      const s = setup(argv);
      expect(s.run()).toBe(false);
      expect(s.spawnFn).not.toHaveBeenCalled();
      expect(s.quit).not.toHaveBeenCalled();
    }
  });

  it('only the first argument counts, so nothing else can be mistaken for a signal', () => {
    const s = setup(['--cell-look=night', '--squirrel-install']);
    expect(s.run()).toBe(false);
    expect(s.spawnFn).not.toHaveBeenCalled();
  });

  it('off Windows it does nothing at all, whatever the arguments', () => {
    for (const platform of ['linux', 'darwin']) {
      const s = setup(['--squirrel-install'], platform);
      expect(s.run()).toBe(false);
      expect(s.spawnFn).not.toHaveBeenCalled();
      expect(s.quit).not.toHaveBeenCalled();
    }
  });

  it('no Update.exe to run (for instance unpacked from a zip): quits at once instead of crashing', () => {
    const s = setup(['--squirrel-install']);
    expect(s.run()).toBe(true);
    s.child.emit('error', Object.assign(new Error('spawn Update.exe ENOENT'), { code: 'ENOENT' }));
    expect(s.quit).toHaveBeenCalledTimes(1);
  });

  it('a throw while starting Update.exe still ends in a quit', () => {
    const s = setup(['--squirrel-install']);
    s.spawnFn.mockImplementation(() => { throw new Error('boom'); });
    expect(s.run()).toBe(true);
    expect(s.quit).toHaveBeenCalledTimes(1);
  });

  it('a stuck Update.exe cannot keep the installer waiting: the app quits after the give-up time', () => {
    const s = setup(['--squirrel-install']);
    s.run();
    expect(s.timers).toHaveLength(1);
    expect(s.timers[0].ms).toBe(GIVE_UP_MS);
    expect(GIVE_UP_MS).toBeLessThan(15000); // the installer's own limit is about 15 s
    expect(s.quit).not.toHaveBeenCalled();
    s.winding();
    expect(s.quit).toHaveBeenCalledTimes(1);
  });

  it('quits only once, however many of "finished", "error" and "give up" arrive', () => {
    const s = setup(['--squirrel-updated']);
    s.run();
    s.child.emit('close');
    s.child.emit('error', new Error('late'));
    s.winding(); // the give-up timer was cancelled by the first quit, so nothing fires
    expect(s.quit).toHaveBeenCalledTimes(1);
    expect(s.timers.every(t => t.cleared)).toBe(true);
  });

  it('finds Update.exe one folder above the program, whichever version folder it runs from', () => {
    const s = setup(['--squirrel-install']);
    s.spawnFn.mockClear();
    handleInstallerSignal({ quit: s.quit, platform: 'win32', argv: ['x', '--squirrel-install'],
      execPath: 'D:\\Apps\\CellLearning\\app-2.3.4\\Cell Learning.exe', spawnFn: s.spawnFn, setTimer: () => null, clearTimer: () => {} });
    expect(s.spawnFn.mock.calls[0][0]).toBe('D:\\Apps\\CellLearning\\Update.exe');
  });

  it('signalFor names each signal and ignores the rest', () => {
    expect(signalFor(['x', '--squirrel-install'])).toBe('make-shortcuts');
    expect(signalFor(['x', '--squirrel-updated'])).toBe('make-shortcuts');
    expect(signalFor(['x', '--squirrel-uninstall'])).toBe('remove-shortcuts');
    expect(signalFor(['x', '--squirrel-obsolete'])).toBe('step-aside');
    expect(signalFor(['x', '--squirrel-firstrun'])).toBeNull();
    expect(signalFor(['x'])).toBeNull();
    expect(signalFor([])).toBeNull();
  });
});

// The wiring in main.cjs can't run here (it needs Electron), so check the two lines that matter are really there:
// the answer comes first, and no window opens when the installer was the one that called.
describe('main.cjs is wired to answer the installer', () => {
  it('asks first and opens a window only when it was not the installer', async () => {
    const { readFileSync } = await import('node:fs');
    const main = readFileSync(new URL('../electron/main.cjs', import.meta.url), 'utf8');
    expect(main).toMatch(/const answeredInstaller = handleInstallerSignal\(\{ quit: \(\) => app\.quit\(\) \}\);/);
    expect(main).toMatch(/if \(!answeredInstaller\) app\.whenReady\(\)\.then\(create\);/);
    expect(main).not.toMatch(/^app\.whenReady\(\)\.then\(create\);/m); // the unguarded version must not come back
    expect(main.indexOf('handleInstallerSignal({')).toBeLessThan(main.indexOf('createStore('));
  });
});
