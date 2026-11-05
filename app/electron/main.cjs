const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { createStore, WINDOW_BG } = require('./store.cjs');

// CELL_DATA_DIR lets automatic tests use a throwaway folder instead of your real save.
const store = createStore(process.env.CELL_DATA_DIR || path.join(app.getPath('userData'), 'data'));

function create() {
  // The saved look (R20), so the window opens in its own background colour (never a white or dark flash) and the
  // page can paint that look from the very first frame (the preload passes it on as cellApi.look).
  const look = store.look();
  const win = new BrowserWindow({ width: 480, height: 760, backgroundColor: WINDOW_BG[look],
    webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'preload.cjs'), additionalArguments: [`--cell-look=${look}`] } });
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}
ipcMain.handle('save:load', () => store.load());
ipcMain.handle('save:save', (e, state) => {
  const clean = store.save(state);
  BrowserWindow.fromWebContents(e.sender)?.setBackgroundColor(WINDOW_BG[clean.settings.look]); // the look may have changed
  return clean;
});
ipcMain.handle('save:backup', () => store.backup());
ipcMain.handle('save:show', () => { shell.showItemInFolder(store.file); return store.file; });
app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
