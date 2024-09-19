/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  changeAnimal: (animal) => ipcRenderer.send('change-pet', animal),
  changeFrequency: (frequency) => ipcRenderer.send('change-frequency', frequency),
  onVersion: (callback) => ipcRenderer.on('app-version', (_event, value) => callback(value))
})
