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

import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "os";
import { join, resolve } from "path";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import { readAndResolveAppLocalConfigWhenAppReady } from "./appEventHandlers/appLocalConfigHandler";
import {
  readStudentsList,
  changeStudentListPathConfig,
} from "./appMainProcessAPI/handleStudentsList";
import {
  readAttendanceState,
  writeAttendanceState,
} from "./appMainProcessAPI/handleAttendanceState";
import {
  readSeatsState,
  writeSeatsState,
} from "./appMainProcessAPI/handleSeatsState";
import { writeAppLocalConfig } from "./appMainProcessAPI/handleAppLocalConfig";

const configDirPath = resolve(app.getPath("userData"), "./appLocalData");

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;

async function createWindow() {
  const preload = join(__dirname, "../preload/index.js");
  const url = process.env.VITE_DEV_SERVER_URL;
  const indexHtml = join(process.env.DIST, "index.html");

  win = new BrowserWindow({
    title: "Attendance-management(win-x64)",
    icon: join(process.env.PUBLIC, "favicon.svg"),
    show: false,
    webPreferences: {
      preload,
      // nodeIntegration: true,
      contextIsolation: true,
    },
  });

  //activate full-screen view
  win.maximize();
  win.show();

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
}

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

// app.on("second-instance", () => {
//   if (win) {
//     // Focus on the main window if the user tried to open another
//     if (win.isMinimized()) win.restore();
//     win.focus();
//   }
// });

// app.on("activate", () => {
//   const allWindows = BrowserWindow.getAllWindows();
//   if (allWindows.length) {
//     allWindows[0].focus();
//   } else {
//     createWindow();
//   }
// });

// new window example arg: new windows url
// ipcMain.handle("open-win", (event, arg) => {
//   const childWindow = new BrowserWindow({
//     webPreferences: {
//       preload,
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   });

//   if (process.env.VITE_DEV_SERVER_URL) {
//     childWindow.loadURL(`${url}#${arg}`);
//   } else {
//     childWindow.loadFile(indexHtml, { hash: arg });
//   }
// });

let appLocalConfig;
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//...という事らしいので、このイベント実行時にアプリケーションの起動準備を行います
app.whenReady().then(() => {
  const configDirPath = resolve(app.getPath("userData"), "./appLocalData");
  const localConfigTemplatePath = join(
    __dirname,
    "../appData/electron.config.template.json"
  );

  console.log("app local data directory:", configDirPath);
  //appLocalDataフォルダが存在しない場合、新たにフォルダを作成
  if (!existsSync(configDirPath)) {
    console.log("no config dir. creating new config dir ...");
    mkdirSync(configDirPath);
  }

  appLocalConfig = readAndResolveAppLocalConfigWhenAppReady(
    configDirPath,
    localConfigTemplatePath
  );

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle("handle_studentsList", async (event, arg) => {
  console.log("handle_studentsList");
  console.log(arg);
  switch (arg.mode) {
    case "read":
      return readStudentsList(appLocalConfig);

    case "changeConfigPath":
      return changeStudentListPathConfig(arg, appLocalConfig, configDirPath);
  }
});

/**
 * WRITE JSON FOR ATTENDANCE
 *
 * @param {object} arg
 * {
 *  file_name: <string>,
 *  data: <string> (JSON_STRING)
 * }
 */
ipcMain.handle("handle_attendanceState", (event, arg) => {
  const now = new Date();
  const fileName = `${now.getFullYear()}${
    now.getMonth() + 1
  }${now.getDate()}.json`;
  const fileDirPath = appLocalConfig.path.attendance;
  const fullFilePath = resolve(fileDirPath, fileName);

  if (!existsSync(fileDirPath)) {
    console.log("making attendance dir...");
    mkdirSync(fileDirPath);
  }

  switch (arg.mode) {
    case "read":
      return readAttendanceState(fullFilePath);
    // console.log("ready for reading attendanceState...");
    // return new Promise((resolve, reject) => {
    //   if (existsSync(fullFilePath)) {
    //     const r = JSON.parse(readFileSync(fullFilePath, "utf-8"));
    //     return resolve(r);
    //   } else {
    //     return resolve(undefined);
    //   }
    // });

    case "write":
      return writeAttendanceState(fullFilePath, arg.data);
  }
});

ipcMain.handle("handle_seatsState", (event, arg) => {
  const now = new Date();
  const fileName = `${now.getFullYear()}${
    now.getMonth() + 1
  }${now.getDate()}.json`;
  const fileDirPath = appLocalConfig.path.seats;
  const fullFilePath = resolve(fileDirPath, fileName);

  if (!existsSync(fileDirPath)) {
    console.log("making seats dir...");
    mkdirSync(fileDirPath);
  }

  switch (arg.mode) {
    case "read":
      return readSeatsState(fileName, fileDirPath, fullFilePath);

    case "write":
      return writeSeatsState(fullFilePath, arg.data);
  }
});

ipcMain.handle("handle_eraceAppLocalData", () => {
  const now = new Date();
  const fileName = `${now.getFullYear()}${
    now.getMonth() + 1
  }${now.getDate()}.json`;
  const fullFilePathForSeatsStateBCUP = resolve(
    appLocalConfig.path.seats,
    fileName
  );
  const fullFilePathForAttendanceStateBCUP = resolve(
    appLocalConfig.path.attendance,
    fileName
  );

  existsSync(fullFilePathForSeatsStateBCUP) &&
    unlinkSync(fullFilePathForSeatsStateBCUP);
  existsSync(fullFilePathForAttendanceStateBCUP) &&
    unlinkSync(fullFilePathForAttendanceStateBCUP);
});

ipcMain.handle("handle_loadAppLocalConfig", (event, arg) => {
  switch (arg.mode) {
    case "read":
      //名称変更時などに対応するため、プロパティの中間変換を行う
      return {
        fn: appLocalConfig.appConfig.fn,
        msg: appLocalConfig.appConfig.msg,
      };

    case "write":
      appLocalConfig = writeAppLocalConfig(appLocalConfig, arg, configDirPath);
      return appLocalConfig;

    default:
      throw new Error(
        "an error has occured in ipcMain.handle(handle_loadAppLocalConfig: invalid switch mode)"
      );
  }
});
