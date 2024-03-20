console.log('preload.js is loaded');
const { contextBridge, ipcRenderer } = require('electron');
const html2canvas = require('html2canvas');

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});

contextBridge.exposeInMainWorld('html2canvasAPI', {
  takeScreenshot: (selector) => {
    return html2canvas(document.querySelector(selector))
      .then(canvas => {
        // You can now do something with the canvas
        return canvas.toDataURL('image/png');
      })
      .catch(error => {
        console.error('Error taking screenshot:', error);
      });
  }
});
