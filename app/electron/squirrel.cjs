// T67: answers the Windows installer's start-up signals.
//
// The installer (Squirrel) starts the app on its own while installing, updating and uninstalling, and hands it a signal
// as the first argument: --squirrel-install, --squirrel-updated, --squirrel-uninstall or --squirrel-obsolete. The
// installer then waits (up to about 15 seconds, behind its green "please wait" picture) for the app to quit. Until
// T67 the app ignored the signal and simply opened its window, so the installer waited out its full time, the window
// popped up in the middle of an install, and no Start-menu or desktop icon was ever made.
//
// What each signal means, and what the app does about it:
//   --squirrel-install, --squirrel-updated  just installed or updated: make the shortcuts, then quit
//   --squirrel-uninstall                    being removed: remove the shortcuts, then quit
//   --squirrel-obsolete                     an old version being replaced: quit right away
//   --squirrel-firstrun                     the first normal start after install: NOT a signal to answer, just open
//
// This is the same job the small `electron-squirrel-startup` package does. It is written out here instead because it
// is about 40 lines, it needs no new package (Forge leaves dev-only packages out of the packed app), and this way
// tests can run it on any computer with pretend Windows values (see src/installerSignals.test.ts).
const path = require('path');
const { spawn } = require('child_process');

// If the installer's helper (Update.exe) is slow or stuck, quit anyway after this long, so the installer is never
// kept waiting for us (its own limit is about 15 s).
const GIVE_UP_MS = 5000;

// Which signal is this? The installer puts it first, so the app looks at the first argument only: nothing else can
// be mistaken for one. (argv[0] is the program itself.) Returns 'make-shortcuts', 'remove-shortcuts', 'step-aside' or null.
function signalFor(argv) {
  switch (argv[1]) {
    case '--squirrel-install':
    case '--squirrel-updated': return 'make-shortcuts';
    case '--squirrel-uninstall': return 'remove-shortcuts';
    case '--squirrel-obsolete': return 'step-aside';
    default: return null;
  }
}

// Call this first thing in the main file. Returns true when this start was the installer's signal: the app has
// then answered it (and will quit by itself) and must NOT open a window. Returns false for a normal start.
// Everything is passed in, so tests can fake it: `quit` is app.quit, `platform`/`argv`/`execPath` are the process's.
function handleInstallerSignal({ quit, platform = process.platform, argv = process.argv, execPath = process.execPath,
  spawnFn = spawn, setTimer = setTimeout, clearTimer = clearTimeout }) {
  if (platform !== 'win32') return false; // the installer only exists on Windows
  const signal = signalFor(argv);
  if (!signal) return false;

  if (signal === 'step-aside') { quit(); return true; }

  // The program's own path is ...\CellLearning\app-<version>\<name>.exe and the helper sits one folder up, at
  // ...\CellLearning\Update.exe. Windows paths, so path.win32 whatever computer this runs on (it only matters for tests).
  const w = path.win32;
  const updateExe = w.resolve(w.dirname(execPath), '..', 'Update.exe');
  const flag = signal === 'make-shortcuts' ? '--createShortcut=' : '--removeShortcut=';

  let done = false;
  let timer = null;
  const finish = () => { if (done) return; done = true; clearTimer(timer); quit(); };
  timer = setTimer(finish, GIVE_UP_MS);
  try {
    // Update.exe's default is a Start-menu icon and a desktop icon.
    const child = spawnFn(updateExe, [flag + w.basename(execPath)], { detached: true });
    child.on('close', finish);
    child.on('error', finish); // no Update.exe here (for instance the app was unpacked from a zip): just step aside
  } catch {
    finish();
  }
  return true;
}

module.exports = { handleInstallerSignal, signalFor, GIVE_UP_MS };
