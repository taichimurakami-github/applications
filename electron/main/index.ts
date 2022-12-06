// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "../..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST_ELECTRON, "../public");

import { app, BrowserWindow } from "electron";
import { release } from "os";
import { join, resolve as resolvePath } from "path";
import * as logger from "electron-log";
import { listenIpcMainEvents } from "./ipcMainEventsListener";
import { listenAppAutoUpdateEvent } from "./appUpdateEventsListener";

console.log = logger.log;
console.error = logger.error;
console.info = logger.info;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;

function createWindow() {
  const preload = join(__dirname, "../preload/index.js");
  const url = process.env.VITE_DEV_SERVER_URL;
  const indexHtml = process.env.DIST
    ? join(process.env.DIST, "index.html")
    : "";

  win = new BrowserWindow({
    title: "Attendance-management(win-x64)",
    width: 1920,
    height: 1080,
    icon: process.env.PUBLIC ? join(process.env.PUBLIC, "favicon.svg") : "",
    // show: true,
    webPreferences: {
      preload,
      // nodeIntegration: true,
      contextIsolation: true,
    },
  });

  //activate full-screen view
  win.maximize();
  win.show();
  win.focus();

  if (process.env.VITE_DEV_SERVER_URL) {
    console.log("\n\n\n");
    console.log(process.env.VITE_DEV_SERVER_URL);
    console.log("\n\n\n");
    // electron-vite-vue#298
    win.loadURL(url as string);
  } else {
    win.loadFile(indexHtml);
  }

  // ・ipcMain -> ipcRenderer方向の通信
  // ・BrowserWindow上でのdevToolsの起動
  // に関しては、Renderer側の読み込みが終わっていないとmessageを送れないためここで定義
  win.webContents.on("did-finish-load", () => {
    if (process.env.VITE_DEV_SERVER_URL) {
      // Open devTool if the app is not packaged
      win.webContents.openDevTools();
    }
    listenAppAutoUpdateEvent(win);
  });
}

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

//アプリケーションの起動準備を実行
app.whenReady().then(() => {
  const APP_CONFIG_DIR_PATH = resolvePath(
    app.getPath("userData"),
    "./appLocalData"
  );

  listenIpcMainEvents(APP_CONFIG_DIR_PATH);

  //appのwindowを作成
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
