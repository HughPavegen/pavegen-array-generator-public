const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  // Create the browser window.
const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // This should be the correct path to your preload.js file
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  // and load the index.html of the app.
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/*
ipcMain.on('capture-screen', async (event) => {
  console.log('capture-screen event received');
  const win = BrowserWindow.getFocusedWindow();

  win.webContents.capturePage().then(image => {
    const filePath = dialog.showSaveDialogSync(win, {
      buttonLabel: 'Save image',
      defaultPath: path.join(app.getPath('pictures'), 'capture.png'),
      filters: [
        { name: 'Images', extensions: ['png'] }
      ]
    });

    if (filePath) {
      fs.writeFile(filePath, image.toPNG(), (err) => {
        if (err) {
          console.error('Failed to save the image', err);
        } else {
          console.log('Image saved successfully!');
        }
      });
    }
  });
  */

  ipcMain.on('save-capture', (event, base64Data) => {
    // Decode base64 string to binary data
    const data = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(data, 'base64');
  
    // Save the image file using dialog and fs
    const filePath = dialog.showSaveDialogSync({
      buttonLabel: 'Save image',
      defaultPath: path.join(app.getPath('pictures'), 'capture.png'),
      filters: [{ name: 'Images', extensions: ['png'] }],
    });
  
    if (filePath) {
      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          console.error('Failed to save the image', err);
        } else {
          console.log('Image saved successfully!');
        }
      });
    }
  });
