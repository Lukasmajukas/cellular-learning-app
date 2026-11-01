const { contextBridge, ipcRenderer } = require('electron');
// The only doors between the app screen and the save file.
contextBridge.exposeInMainWorld('cellApi', {
  load: () => ipcRenderer.invoke('save:load'),
  save: state => ipcRenderer.invoke('save:save', state),
  backupNow: () => ipcRenderer.invoke('save:backup'),
  showFile: () => ipcRenderer.invoke('save:show'),
});
