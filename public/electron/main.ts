// Modules to control application life and create native browser window
const { ipcMain, app, BrowserWindow, session } = require('electron')
const path = require('path')
const isDev = require("electron-is-dev");
const fs = require("fs");
const XLSX = require("xlsx");
const fileType = require("file-type");
const { resolve } = require('path');
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
  });

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
  console.log("app local data directory:", configDirPath);
  //appLocalDataフォルダが存在しない場合、新たにフォルダを作成
  if (!fs.existsSync(configDirPath)) {
    console.log("no config dir. creating new config dir ...");
    fs.mkdirSync(configDirPath);
  }

  //config.jsonの最新版テンプレートを読み込み
  //ただし、pathに関しては空白なので、手動で付け加える
  const configTemplate = JSON.parse(fs.readFileSync(path.resolve(__dirname, "electron.config.template.json")));
  configTemplate.path.seats = path.resolve(configDirPath, "./seats/");
  configTemplate.path.attendance = path.resolve(configDirPath, "./attendance/");

  console.log("configTemplate:");
  console.log(configTemplate);

  if (!fs.existsSync(path.resolve(configDirPath, "./config.json"))) {
    //config.jsonファイルが存在しない場合、新たに設定ファイルを作成
    console.log("no config files. now creating new config files ...");

    // fs.writeFileSync(path.resolve(configDirPath, "./config.json"), JSON.stringify(configPrototype));
    fs.writeFileSync(path.resolve(configDirPath, "./config.json"), JSON.stringify(configTemplate));

    //appLocalConfigには、configTemplate(最新版テンプレートファイル)からロードしたJSONデータを入れる
    appLocalConfig = { ...configTemplate };
  }
  else {
    //config.jsonのバージョンが古い場合、新たに設定ファイルを作成
    const nowAppConfig = JSON.parse(fs.readFileSync(path.resolve(configDirPath, "./config.json"), "utf-8"));

    console.log("now Local Config is below:");
    console.log(nowAppConfig);

    //LocalConfigファイルが存在するがバージョンが古い場合、新バージョンのファイルを生成する
    if (!("version" in nowAppConfig) || nowAppConfig.version !== configTemplate.version) {
      console.log("your LocalConfig is available to be updated.");
      console.log("now making new App LocalConfig file...");

      //studentsListのpathデータを保持するために、configTemplate内にコピー
      configTemplate.path.studentsList = nowAppConfig.path.studentsList;

      //新規バージョンのconfigで上書き
      fs.writeFileSync(path.resolve(configDirPath, "./config.json"), JSON.stringify(configTemplate));

      //appLocalConfigには、configTemplate(最新版テンプレートファイル)からロードしたJSONデータを入れる
      appLocalConfig = { ...configTemplate };
    } else {
      //現在のLocalConfigファイルが最新の場合、appLocalConfigには先程読み込んだJSONファイルを入れる
      appLocalConfig = { ...nowAppConfig };
    }
  }

  //LocalConfigファイルの生成完了
  console.log("app LocalConfig file: check completed.");

  //appのwindowを作成
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.handle("handle_studentsList", async (event, arg) => {
  const fullFilePath = appLocalConfig.path.studentsList;

  switch (arg.mode) {
    case "read":
      try {
        const workbook = XLSX.readFile(fullFilePath);

        //sheet名を指定
        /**
         * studentsListで読み込み不良が出た場合、まずはworkbookの中身を参照する事
         * 
         * case 1: Sheetのidが0ではない
         */

        //生徒情報が格納されているSheetのID(何番目か)
        const SheetID = 0;

        //workbookの中からSheet情報を取得し、json化
        const Sheet = workbook.Sheets[workbook.SheetNames[SheetID]];
        // console.log(Sheet);
        const data_json = XLSX.utils.sheet_to_json(Sheet);

        return data_json;
      } catch (e) {
        console.log("failed to read studentsList (main.js line 85~)");
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
      console.log("ready for reading attendanceState...");
      return new Promise((resolve, reject) => {
        if (fs.existsSync(fullFilePath)) {
          const r = JSON.parse(fs.readFileSync(fullFilePath, "utf-8"));
          return resolve(r);
        }

        else {
          return resolve(undefined);
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
      console.log("ready for reading seatsState...");
      //本日付のバックアップファイルがあるか確認
      const dirFiles = fs.readdirSync(fileDirPath);
      let existsCheck = false;
      for (let val of dirFiles) {
        //定義したファイル名と一致するファイルがあればexistsCheckをtrueに、
        //それ以外のファイルは削除する(座席状態のバックアップデータ重複を避けるため)
        val === fileName ?
          (existsCheck = true) :
          fs.unlinkSync(path.resolve(fileDirPath, val));
      }
      console.log("reading seatsState...");
      //既にseatsStateのバックアップデータがある場合 -> 読み込み
      //既にseatsStateのバックアップデータがない場合 -> falseを返す
      return new Promise((resolve) => {
        existsCheck ?
          resolve(JSON.parse(fs.readFileSync(fullFilePath, "utf-8"))) :
          resolve(undefined);
      });

    case "write":
      console.log("write seatsState...");
      fs.writeFileSync(fullFilePath, arg.data);
      return;

  }
});

ipcMain.handle("handle_eraceAppLocalData", () => {
  const now = new Date();
  const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}.json`;
  const fullFilePathForSeatsStateBCUP = path.resolve(appLocalConfig.path.seats, fileName);
  const fullFilePathForAttendanceStateBCUP = path.resolve(appLocalConfig.path.attendance, fileName);

  fs.existsSync(fullFilePathForSeatsStateBCUP) && fs.unlinkSync(fullFilePathForSeatsStateBCUP);
  fs.existsSync(fullFilePathForAttendanceStateBCUP) && fs.unlinkSync(fullFilePathForAttendanceStateBCUP);

});

ipcMain.handle("handle_loadAppLocalConfig", (event, arg) => {

  switch (arg.mode) {
    case "read":
      //名称変更時などに対応するため、プロパティの中間変換を行う
      return {
        fn: appLocalConfig.appConfig.fn
      }

    case "write":
      const newAppLocalConfig = { ...appLocalConfig };
      // console.log(arg.content.value);
      //switch文中にswitchをネストするとかいう最高に頭が悪い構造をしているので、
      //なんかいい方法を見つけたら変更したい

      switch (arg.content.id) {
        case "appConfig_fn_cancelOperation":
          newAppLocalConfig.appConfig.fn[arg.content.status].cancelOperation = arg.content.value;
          break;

        case "appConfig_fn_eraceAppDataTodayAll":
          newAppLocalConfig.appConfig.fn[arg.content.status].eraceAppDataTodayAll = arg.content.value;
          break;

        default:
          throw new Error("invalid arg.content.id in ipcHandler_handle_appLocalConfig");
      }
      // console.log(newAppLocalConfig);
      fs.writeFileSync(path.resolve(configDirPath, "./config.json"), JSON.stringify(newAppLocalConfig));
      appLocalConfig = newAppLocalConfig;
      return appLocalConfig;

    default:
      throw new Error("an error has occured in ipcMain.handle(handle_loadAppLocalConfig: invalid switch mode)")
  }


});