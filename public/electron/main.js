// Modules to control application life and create native browser window
const { ipcMain, ipcRenderer, app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require("electron-is-dev");
const fs = require("fs");
const XLSX = require("xlsx");
const fileType = require("file-type");
const configDirPath = path.resolve(app.getPath("userData"), "./appLocalData");
let appLocalConfig;

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
      : `file://${path.join(__dirname, "../index.html")}`
  );

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//...という事らしいので、このイベント実行時にアプリケーションの起動準備を行います
app.whenReady().then(() => {
  console.log(configDirPath);
  //appLocalDataフォルダが存在しない場合、新たにフォルダを作成
  if (!fs.existsSync(configDirPath)) {
    console.log("no config dir. creating new config dir ...");
    fs.mkdirSync(configDirPath);
  }

  //config.jsonフォルダが存在していない場合、新たに設定ファイルを作成
  if (!fs.existsSync(path.resolve(configDirPath, "./config.json"))) {
    console.log("no config files. creating new config files ...");
    const configPrototype = {
      path: {
        seats: path.resolve(configDirPath, "./seats/"),
        attendance: path.resolve(configDirPath, "./attendance/"),
        studentsList: "",
      }
    }

    fs.writeFileSync(path.resolve(configDirPath, "./config.json"), JSON.stringify(configPrototype));
  }

  //設定ファイルを読み込む
  appLocalConfig = JSON.parse(fs.readFileSync(path.resolve(configDirPath, "./config.json")));

  //appのwindowを作成
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.handle("handle_studentsList", async (event, arg) => {
  const fullFilePath = appLocalConfig.path.studentsList;

  switch (arg.mode) {
    case "read":
      try {
        const workbook = XLSX.readFile(fullFilePath);

        //sheet名を指定
        const Sheet = workbook.Sheets[workbook.SheetNames[1]]
        const data_json = XLSX.utils.sheet_to_json(Sheet);

        return data_json;
      } catch (e) {
        console.log(e);
        return undefined;
      }

    case "changeConfigPath":
      const fileBuffer = fs.readFileSync(arg.data);
      const typeOfFile = await fileType.fromBuffer(fileBuffer);

      return new Promise((resolve) => {
        if (typeOfFile && typeOfFile.ext === "xlsx") {
          appLocalConfig.path.studentsList = arg.data;
          fs.writeFileSync(path.resolve(configDirPath, "./config.json"), JSON.stringify(appLocalConfig));
          return resolve(true);
        }
        else {
          throw new Error("Unexpected file type error in main.js 97~");
        }
      }).catch((e) => {
        console.log(e);
        return false;
      });
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
// ipcMain.handle("write_attendance_json", (event, data) => {
//   const now = new Date();
//   const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}.json`;
//   const parent_dir = path.resolve(__dirname, "../data/attendance");
//   const fullFilePath = path.resolve(parent_dir, fileName);
//   fs.writeFileSync(fullFilePath, data);
// });


ipcMain.handle("handle_attendanceState", (event, arg) => {
  const now = new Date();
  const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}.json`;
  const fileDirPath = appLocalConfig.path.attendance;
  const fullFilePath = path.resolve(fileDirPath, fileName);

  if (!fs.existsSync(fileDirPath)) {
    console.log("making attendance dir...");
    fs.mkdirSync(fileDirPath);
  }

  switch (arg.mode) {
    case "read":
      return new Promise((resolve) => {
        //attendanceStateの初期値
        let readBuffer;

        try {
          //ファイル読み込みに成功したら読み込んだ内容を返す
          readBuffer = fs.readFileSync(fullFilePath, "utf-8");
          resolve(JSON.parse(readBuffer));
        } catch (err) {
          //失敗したら存在しなかったものとみなし、falseを返す
          console.log(err);
          resolve(false);
        }
      });

    case "write":
      return fs.writeFileSync(fullFilePath, arg.data);
  }
});

ipcMain.handle("handle_seatsState", (event, arg) => {
  const now = new Date();
  const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}.json`;
  const fileDirPath = appLocalConfig.path.seats;
  const fullFilePath = path.resolve(fileDirPath, fileName);

  if (!fs.existsSync(fileDirPath)) {
    console.log("making seats dir...");
    fs.mkdirSync(fileDirPath);
  }


  switch (arg.mode) {
    case "read":

      //本日付のバックアップファイルがあるか確認
      const dirFiles = fs.readdirSync(fileDirPath);
      let existsCheck = false;
      for (val of dirFiles) {
        //定義したファイル名と一致するファイルがあればexistsCheckをtrueに、
        //それ以外のファイルは削除する(座席状態のバックアップデータ重複を避けるため)
        val === fileName ?
          (existsCheck = true) :
          fs.unlinkSync(path.resolve(fileDirPath, val));
      }
      console.log("read seatsState result...");
      //既にseatsStateのバックアップデータがある場合 -> 読み込み
      //既にseatsStateのバックアップデータがない場合 -> falseを返す
      return existsCheck ?
        JSON.parse(fs.readFileSync(fullFilePath, "utf-8")) :
        false;

    case "write":
      console.log("write seatsState...");
      fs.writeFileSync(fullFilePath, arg.data);
      return;

  }
  // const fileName = "seatsState.json";
  // const fullFilePath = path.resolve(__dirname, "../data/temp/" + fileName);
  // fs.writeFileSync(fullFilePath, data);
});