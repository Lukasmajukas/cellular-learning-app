// T76: the app updates itself (Windows).
//
// In simple words: now and then the app asks a web address "is there a version newer than mine?". If yes, the
// installer's helper (Update.exe, already on the PC since the install) downloads it in the background and puts it
// next to the running one. Nothing changes while you play. The new version is used the next time the app opens, or
// at once if you press "Restart now".
//
// The addresses are tried in order (electron/update-feeds.json): the Cloudflare front door first, then GitHub itself
// as the spare. If one doesn't answer, the next is asked. If none answers (no internet, say) the app stays quiet and
// asks again later: the app must work with no internet (the plan's promise S5).
//
// This file holds only the thinking; everything it touches is passed in (Electron's autoUpdater, the clock, the
// timers), so tests can run it on any computer with pretend parts (src/updater.test.ts), like electron/squirrel.cjs.
const path = require('path');

// How long after the app opens it first asks. Not at once: the app should be up first, and right after an install
// the installer still holds its lock for a few seconds (Electron's docs: a check then fails).
const FIRST_CHECK_MS = 15 * 1000;
// The very first start after installing (the installer adds --squirrel-firstrun): wait a full minute.
const FIRST_RUN_CHECK_MS = 60 * 1000;
// While the app stays open it asks again this often.
const EVERY_MS = 4 * 60 * 60 * 1000;

// Why the updater can't work here, or null if it can. Only an app that the Windows installer put on the PC can
// update itself: Update.exe sits one folder above the program (...\CellLearning\Update.exe).
function whyNot({ platform, packaged, hasUpdateExe, feeds }) {
  if (platform !== 'win32') return 'not-windows';
  if (!packaged) return 'not-packaged';
  if (!hasUpdateExe) return 'not-installed';
  if (!feeds || !feeds.length) return 'no-address';
  return null;
}
const updateExeFor = execPath => path.win32.resolve(path.win32.dirname(execPath), '..', 'Update.exe');

// The addresses to ask, in order. `override` (CELL_UPDATE_URL, automatic tests only) replaces the list: one address,
// or several with commas between them. Anything that isn't a web address is dropped.
function feedsFrom(config, override) {
  const list = override ? String(override).split(',') : (config && Array.isArray(config.feeds) ? config.feeds : []);
  return list.map(s => String(s).trim().replace(/\/+$/, '')).filter(s => /^https?:\/\/\S+$/.test(s));
}

// The status the screens show (src/updates.ts). state is one of:
//   'unsupported'  can't update here (`why` says which reason)        'off'          the Settings switch is off
//   'idle'         nothing to do (checkedAt = when it last asked)     'checking'     asking right now
//   'downloading'  fetching a newer version                           'ready'        fetched: newVersion waits for a restart
//   'failed'       no address answered (quiet; it asks again later; `detail` = the last error's words)
function createUpdater({ autoUpdater, feeds, version, enabled = true, why = null, firstRun = false,
  setTimer = setTimeout, clearTimer = clearTimeout, now = () => Date.now(), onStatus = () => {}, log = () => {},
  firstCheckMs = firstRun ? FIRST_RUN_CHECK_MS : FIRST_CHECK_MS, everyMs = EVERY_MS }) {
  let status = { state: why ? 'unsupported' : enabled ? 'idle' : 'off', version, ...(why ? { why } : {}) };
  let on = !why && enabled;
  let timer = null;       // the next planned round
  let busy = false;       // a round is running (Update.exe does one thing at a time)
  let feed = 0;           // which address this round is asking
  let ready = null;       // the version that has been downloaded and waits for a restart

  const set = patch => {
    status = { ...status, ...patch };
    // Once a newer version is downloaded it stays "ready" whatever a later check says: it IS on the disk.
    if (ready && status.state !== 'checking' && status.state !== 'downloading') status = { ...status, state: 'ready', newVersion: ready };
    onStatus(status);
    return status;
  };
  const plan = ms => { clearTimer(timer); timer = on ? setTimer(() => { timer = null; round(); }, ms) : null; };

  // One round: ask the first address; if it fails, the next one; and so on.
  function ask() {
    const url = feeds[feed];
    log({ event: 'ask', feed, url });
    try {
      autoUpdater.setFeedURL({ url });
      autoUpdater.checkForUpdates();
    } catch (e) { failed(e); }
  }
  function round() {
    if (busy || why) return;
    busy = true; feed = 0;
    set({ state: 'checking' });
    ask();
  }
  function done(patch) {
    busy = false;
    set({ ...patch, checkedAt: now() });
    plan(everyMs);
  }
  function failed(e) {
    if (!busy) return; // an error outside a round (nothing we asked for): ignore it
    const detail = e && e.message ? String(e.message) : String(e);
    log({ event: 'failed', feed, url: feeds[feed], detail });
    if (feed + 1 < feeds.length) { feed += 1; ask(); return; }
    done({ state: 'failed', detail });
  }

  if (!why) {
    // Always listen for 'error': Node stops the whole program on an error nobody listens for.
    autoUpdater.on('error', failed);
    autoUpdater.on('checking-for-update', () => { if (busy) set({ state: 'checking' }); });
    autoUpdater.on('update-available', () => { if (busy) set({ state: 'downloading' }); });
    autoUpdater.on('update-not-available', () => { if (busy) { log({ event: 'newest', feed }); done({ state: 'idle', detail: undefined }); } });
    autoUpdater.on('update-downloaded', (_event, _notes, name) => {
      ready = name ? String(name) : 'newer'; // the installer's helper names the version; 'newer' only if it ever doesn't
      log({ event: 'ready', feed, newVersion: ready });
      if (busy) done({ state: 'ready', newVersion: ready, detail: undefined });
      else set({ state: 'ready', newVersion: ready });
    });
    if (on) plan(firstCheckMs);
  }

  return {
    status: () => status,
    // "Check now" in Settings. Works with the switch off too (you asked for it by hand).
    check() { if (!why && !busy) { clearTimer(timer); timer = null; round(); } return status; },
    // The Settings switch. Off: no more rounds (one that is already running finishes).
    setEnabled(value) {
      const next = !!value;
      if (why || next === on) return status;
      on = next;
      if (on) { if (!busy) { if (status.state === 'off') set({ state: 'idle' }); plan(firstCheckMs); } }
      else { clearTimer(timer); timer = null; if (!busy) set({ state: 'off' }); }
      return status;
    },
    // "Restart now": closes the app and opens the new version. Only when one is really waiting.
    restart() { if (!ready) return false; log({ event: 'restart', newVersion: ready }); autoUpdater.quitAndInstall(); return true; },
  };
}

// Automatic tests only (CELL_TEST_UPDATE holds a status as JSON): an updater that only pretends, so click tests can
// show "New version ready" without a real update. It remembers what was pressed, for the test to read back.
function createPretendUpdater(first) {
  let status = { ...first };
  return {
    status: () => status,
    check() { status = { ...status, checkAsked: (status.checkAsked || 0) + 1 }; return status; },
    setEnabled(value) { if (status.state === 'idle' || status.state === 'off') status = { ...status, state: value ? 'idle' : 'off' }; return status; },
    restart() { status = { ...status, restartAsked: true }; return true; },
  };
}

module.exports = { createUpdater, createPretendUpdater, whyNot, feedsFrom, updateExeFor, FIRST_CHECK_MS, FIRST_RUN_CHECK_MS, EVERY_MS };
