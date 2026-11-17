const { app, BrowserWindow, ipcMain, shell, autoUpdater } = require('electron');
const fs = require('fs');
const path = require('path');
const { createStore, WINDOW_BG } = require('./store.cjs');
const { handleInstallerSignal } = require('./squirrel.cjs');
const { createUpdater, createPretendUpdater, whyNot, feedsFrom, updateExeFor } = require('./updater.cjs');

// T67: first thing, before anything else. When the Windows installer starts the app only to say "you were just
// installed / updated / are being removed", the app answers (makes or removes its Start-menu and desktop icons),
// quits, and opens no window. Any normal start (you clicking the icon) comes back false and carries on below.
// The one-copy-at-a-time lock (T69) must go AFTER this line: the installer's start must never be turned away by it.
const answeredInstaller = handleInstallerSignal({ quit: () => app.quit() });

// CELL_DATA_DIR lets automatic tests use a throwaway folder instead of your real save.
const store = createStore(process.env.CELL_DATA_DIR || path.join(app.getPath('userData'), 'data'));

// T76: the app updates itself (electron/updater.cjs has the how and why). Started here, in the main program and
// before any window, on purpose: if a build's screen were ever broken, the updater would still fetch the fixed one.
// It only really runs in the installed Windows app; everywhere else (tests, `npm start`, a Mac) it reports
// "unsupported" and does nothing. Automatic tests: CELL_TEST_UPDATE (a status as JSON) swaps in a pretend updater;
// CELL_UPDATE_URL replaces the addresses, CELL_UPDATE_FIRST_MS the first wait, CELL_UPDATE_LOG names a file that gets
// one line per step, and CELL_UPDATE_TEST_RESTART=1 presses "Restart now" by itself (tools/update-e2e.mjs uses these).
const tellWindows = status => { for (const w of BrowserWindow.getAllWindows()) if (!w.isDestroyed()) w.webContents.send('update:status', status); };
function updateLog(entry) {
  if (!process.env.CELL_UPDATE_LOG) return;
  try { fs.appendFileSync(process.env.CELL_UPDATE_LOG, `${JSON.stringify({ at: new Date().toISOString(), version: app.getVersion(), ...entry })}\n`); } catch { /* a log must never break the app */ }
}
function startUpdater() {
  if (process.env.CELL_TEST_UPDATE) return createPretendUpdater(JSON.parse(process.env.CELL_TEST_UPDATE));
  let config = null;
  try { config = JSON.parse(fs.readFileSync(path.join(__dirname, 'update-feeds.json'), 'utf8')); } catch { /* no list: no updates */ }
  const feeds = feedsFrom(config, process.env.CELL_UPDATE_URL);
  const why = whyNot({ platform: process.platform, packaged: app.isPackaged, hasUpdateExe: fs.existsSync(updateExeFor(process.execPath)), feeds });
  const firstMs = Number(process.env.CELL_UPDATE_FIRST_MS);
  const updater = createUpdater({ autoUpdater, feeds, version: app.getVersion(), why, enabled: store.startup().autoUpdate,
    firstRun: process.argv.includes('--squirrel-firstrun'), ...(firstMs > 0 ? { firstCheckMs: firstMs } : {}), log: updateLog,
    onStatus: status => {
      tellWindows(status);
      if (status.state === 'ready' && process.env.CELL_UPDATE_TEST_RESTART === '1') setTimeout(() => updater.restart(), 1000);
    } });
  updateLog({ event: 'start', why, feeds, dataFile: store.file });
  return updater;
}
// If anything about the updater goes wrong at start-up, the app must still open: it then simply doesn't update.
let updater = null;
if (!answeredInstaller) {
  try { updater = startUpdater(); } catch (e) { console.error('The updater could not start:', e); }
}
const updateStatus = () => updater?.status() ?? { state: 'unsupported', why: 'not-started', version: app.getVersion() };

// The longest the window waits for its first picture before it shows anyway (R21; normally it's well under a second).
const SHOW_AT_LATEST_MS = 3000;
const MIN_SIZE = { w: 360, h: 560 };

function create() {
  // The saved look (R20), so the window opens in its own background colour (never a white or dark flash) and the
  // page can paint that look from the very first frame (the preload passes it on as cellApi.look). R21: Reduce motion too,
  // for the start screen's fade.
  const { look, reduceMotion } = store.startup();
  const args = [`--cell-look=${look}`, ...(reduceMotion ? ['--cell-calm'] : [])];
  // R21: the window stays hidden until the page has drawn its first picture (our start screen, index.html), so the very
  // first thing you see is the app's own start screen, never an empty or half-drawn window (on a cold start in the
  // cloud the page took about 4 s to draw anything).
  // R22: the smallest the window can be made is a phone-narrow 360 x 560 (the page inside it; useContentSize), the
  // narrowest size every screen is checked at. Smaller, words would have to be cut off.
  const win = new BrowserWindow({ width: 480, height: 760, minWidth: MIN_SIZE.w, minHeight: MIN_SIZE.h, useContentSize: true, show: false, backgroundColor: WINDOW_BG[look],
    webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'preload.cjs'), additionalArguments: args } });
  win.setMenuBarVisibility(false);
  let shown = false;
  const show = () => { if (!shown && !win.isDestroyed()) { shown = true; win.show(); } };
  win.once('ready-to-show', show);
  setTimeout(show, SHOW_AT_LATEST_MS);
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}
// Automatic tests only (R21): CELL_TEST_LOAD_FAIL=n makes the first n loads fail, to show the "couldn't open" screen;
// CELL_TEST_LOAD_DELAY=ms makes the first load that slow, like a slow computer, so the start screen stays up.
let failLoads = Number(process.env.CELL_TEST_LOAD_FAIL) || 0;
// Idea I69: CELL_TEST_SAVE_FAIL=n makes the first n saves fail (like a full disk), to show "Couldn't save your last change".
let failSaves = Number(process.env.CELL_TEST_SAVE_FAIL) || 0;
let delay = Number(process.env.CELL_TEST_LOAD_DELAY) || 0;
ipcMain.handle('save:load', async () => {
  if (delay) { const ms = delay; delay = 0; await new Promise(r => setTimeout(r, ms)); }
  if (failLoads > 0) { failLoads--; throw new Error('Test: the save file could not be read (CELL_TEST_LOAD_FAIL).'); }
  return store.load();
});
ipcMain.handle('save:save', (e, state) => {
  if (failSaves > 0) { failSaves--; throw new Error('Test: the save file could not be written (CELL_TEST_SAVE_FAIL).'); }
  const clean = store.save(state);
  BrowserWindow.fromWebContents(e.sender)?.setBackgroundColor(WINDOW_BG[clean.settings.look]); // the look may have changed
  updater?.setEnabled(clean.settings.autoUpdate); // T76: the "Update by itself" switch may have changed
  return clean;
});
ipcMain.handle('save:backup', () => store.backup());
ipcMain.handle('save:show', () => { shell.showItemInFolder(store.file); return store.file; });
// T76: the screens ask for the update status, for a check right now, and for the restart into the new version.
ipcMain.handle('update:get', () => updateStatus());
ipcMain.handle('update:check', () => { updater?.check(); return updateStatus(); });
ipcMain.handle('update:restart', () => updater?.restart() ?? false);
if (!answeredInstaller) app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
