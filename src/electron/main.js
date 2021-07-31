// Modules to control application life and create native browser window
const { ipcMain, ipcRenderer, app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require("electron-is-dev");
const fs = require("fs");
const XLSX = require("xlsx");

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


/**
 * FS READ FUNCs
 * 
 */

ipcMain.handle("read_attendance_json", (event, data) => {
  const now = new Date();
  const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}.json`;
  const fullFilePath = path.resolve(__dirname, "../data/attendance/" + fileName);
  return new Promise(async (resolve) => {
    //attendanceStateの初期値
    const attendanceState_initialVal = {};
    let readBuffer;


    try {
      //ファイル読み込みに成功したら読み込んだ内容を返す
      readBuffer = fs.readFileSync(fullFilePath, "utf-8");
      resolve(JSON.parse(readBuffer));
    } catch (err) {
      //失敗したら存在しなかったものとみなし、初期値を返す
      console.log(err);
      resolve(attendanceState_initialVal);
    }

  })
});

ipcMain.handle("read_seatsState_json", () => {
  const fileName = "seatsState.json";
  const fullFilePath = path.resolve(__dirname, "../data/attendance/" + fileName);
  return new Promise((resolve) => {

  });
});


ipcMain.handle("read_studentsList_xlsx", () => {
  const xlsxFileName = "test.xlsx";
  const xlsx_file_path = path.resolve(__dirname, "../data/studentsList/" + xlsxFileName);

  const workbook = XLSX.readFile(xlsx_file_path);

  //sheet名を指定
  const Sheet = workbook.Sheets[workbook.SheetNames[1]]
  const data_json = XLSX.utils.sheet_to_json(Sheet);

  return new Promise((resolve) => {
    resolve(data_json);
  })
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
ipcMain.handle("write_attendance_json", (event, data) => {
  const now = new Date();
  const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}.json`;
  const parent_dir = path.resolve(__dirname, "../data/attendance");
  const fullFilePath = path.resolve(parent_dir, fileName);
  fs.writeFileSync(fullFilePath, data);
});

ipcMain.handle("handle_seatsState", (event, arg) => {
  const now = new Date();
  const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}.json`;
  const fullFilePath = path.resolve(__dirname, "../data/temp/" + fileName);
  switch (arg.mode) {
    case "read":

      //本日付のバックアップファイルがあるか確認
      const dirFiles = fs.readdirSync(path.resolve(__dirname, "../data/temp/"));
      let existsCheck = false;
      for (val of dirFiles) {
        //定義したファイル名と一致するファイルがあればexistsCheckをtrueに、
        //それ以外のファイルは削除する(バックアップデータ重複を避けるため)
        val === fileName ?
          (existsCheck = true) :
          fs.unlinkSync(path.resolve(__dirname, "../data/temp/" + val));
      }

      //既にseatsStateのバックアップデータがある場合 -> 読み込み
      //既にseatsStateのバックアップデータがない場合 -> falseを返す
      return existsCheck ?
        JSON.parse(fs.readFileSync(fullFilePath, "utf-8")) :
        false;

    case "write":
      console.log("write seatsState_bcup file...");
      fs.writeFileSync(fullFilePath, arg.data);

  }
  // const fileName = "seatsState.json";
  // const fullFilePath = path.resolve(__dirname, "../data/temp/" + fileName);
  // fs.writeFileSync(fullFilePath, data);
});