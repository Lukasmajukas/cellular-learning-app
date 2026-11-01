const { contextBridge, ipcRenderer } = require('electron');
// The only doors between the app screen and the save file.
contextBridge.exposeInMainWorld('cellApi', {
  load: () => ipcRenderer.invoke('save:load'),
  save: state => ipcRenderer.invoke('save:save', state),
  backupNow: () => ipcRenderer.invoke('save:backup'),
  showFile: () => ipcRenderer.invoke('save:show'),
  // Automatic tests set CELL_SAMPLE_PATH=1 to get the five sample lessons instead of the real ones.
  useSamplePath: process.env.CELL_SAMPLE_PATH === '1',
});
