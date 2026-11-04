const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { createStore } = require('./store.cjs');

// CELL_DATA_DIR lets automatic tests use a throwaway folder instead of your real save.
const store = createStore(process.env.CELL_DATA_DIR || path.join(app.getPath('userData'), 'data'));

function create() {
  const win = new BrowserWindow({ width: 480, height: 760, backgroundColor: '#08101D' /* Night 'bg' token (src/theme/tokens.ts), so the window never flashes white */,
    webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'preload.cjs') } });
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}
ipcMain.handle('save:load', () => store.load());
ipcMain.handle('save:save', (_e, state) => store.save(state));
ipcMain.handle('save:backup', () => store.backup());
ipcMain.handle('save:show', () => { shell.showItemInFolder(store.file); return store.file; });
app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
