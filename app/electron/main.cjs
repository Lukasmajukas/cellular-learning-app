const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { createStore, WINDOW_BG } = require('./store.cjs');

// CELL_DATA_DIR lets automatic tests use a throwaway folder instead of your real save.
const store = createStore(process.env.CELL_DATA_DIR || path.join(app.getPath('userData'), 'data'));
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
  return clean;
});
ipcMain.handle('save:backup', () => store.backup());
ipcMain.handle('save:show', () => { shell.showItemInFolder(store.file); return store.file; });
app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
