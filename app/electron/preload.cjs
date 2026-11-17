const { contextBridge, ipcRenderer } = require('electron');
// The only doors between the app screen and the save file.
contextBridge.exposeInMainWorld('cellApi', {
  load: () => ipcRenderer.invoke('save:load'),
  save: state => ipcRenderer.invoke('save:save', state),
  backupNow: () => ipcRenderer.invoke('save:backup'),
  showFile: () => ipcRenderer.invoke('save:show'),
  // T76: the app updates itself. The screens read the status, ask for a check or the restart, and hear about changes.
  // onStatus hands back a function that stops the listening.
  update: {
    get: () => ipcRenderer.invoke('update:get'),
    check: () => ipcRenderer.invoke('update:check'),
    restart: () => ipcRenderer.invoke('update:restart'),
    onStatus: tell => {
      const heard = (_event, status) => tell(status);
      ipcRenderer.on('update:status', heard);
      return () => ipcRenderer.removeListener('update:status', heard);
    },
  },
  // R20: the saved look, read by the main process before the window opened, so the first paint is already in that look.
  look: process.argv.includes('--cell-look=day') ? 'day' : 'night',
  // R21: the saved Reduce motion, read the same way, so the start screen's fade-out follows it before the save has loaded.
  calm: process.argv.includes('--cell-calm'),
  // Automatic tests set CELL_SKIP_WELCOME=1 (playwright.config.ts does, for every click test) so the app opens on the path
  // instead of the first-start welcome; the welcome's own tests switch it back on.
  skipWelcome: process.env.CELL_SKIP_WELCOME === '1',
  // ... and CELL_TEST_CRASH=1 to make the app trip over once, to show the "something went wrong" screen (R21).
  testCrash: process.env.CELL_TEST_CRASH === '1',
  // Automatic tests set CELL_SAMPLE_PATH=1 to get the five sample lessons instead of the real ones.
  useSamplePath: process.env.CELL_SAMPLE_PATH === '1',
  // ... and CELL_TEST_CHANGES (a JSON list) to show "This changed" cards, because the real list stays empty until a fact changes.
  testChanges: process.env.CELL_TEST_CHANGES ? JSON.parse(process.env.CELL_TEST_CHANGES) : undefined,
});
