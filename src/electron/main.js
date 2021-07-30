// Modules to control application life and create native browser window
const { ipcMain, ipcRenderer, app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require("electron-is-dev");
const fs = require("fs");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// exec read file event
ipcMain.on("sync_execFileHandler_read", (event, arg) => {
  console.log("read exec");
  return;
});

ipcMain.handle("fileHandler_read", () => {
  console.log("read exec");
  return;
});


// exec write file event

ipcMain.on("sync_execFileHandler_write", (event, arg) => {
  console.log("write exec");
  return;
});

/**
 * @param {object} arg
 * {
 *  file_name: <string>,
 *  data: <string> (JSON_STRING)
 * }
 */
ipcMain.handle("write_json", (event, arg) => {
  const parent_dir = path.resolve(__dirname, "../data")
  console.log(path.resolve(parent_dir, arg.fileName));
  const save_dir = path.resolve(parent_dir, arg.fileName);

  return new Promise((resolve) => {
    fs.writeFileSync(save_dir, arg.data);
    resolve("ipcMain.handle__write_json completed");
  })
});