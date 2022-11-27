import { autoUpdater } from "electron-updater";
import * as logger from "electron-log";
import { BrowserWindow } from "electron";

/**
 * 上手く動作しないようなので一旦コードのみ残して使用しないことにする
 */
export const listenAppAutoUpdateEvent = (win: BrowserWindow) => {
  autoUpdater.logger = logger;
  autoUpdater.checkForUpdatesAndNotify();

  if (win) {
    win.webContents.send(
      "app-update-process",
      "test from listenAppAutoUpdateEvent at main process"
    );
  }

  autoUpdater.on("checking-for-update", () => {
    logger.log("now checking new github releases...");
    if (win) {
      win.webContents.send(
        "app-update-process",
        "now checking avairable app update exists..."
      );
    }
  });
  autoUpdater.on("update-available", (info) => {
    logger.log("found available app update release !");

    if (win) {
      win.webContents.send(
        "app-update-process",
        "found available app update..."
      );
      win.webContents.send("app-update-process", info);
    }
  });
  autoUpdater.on("update-not-available", (info) => {});
  autoUpdater.on("error", (err) => {
    logger.error("failed to fetch app update.");
    logger.error();
  });
  autoUpdater.on("download-progress", (progressObj) => {
    logger.log("fetching app update from github releases...");

    // let log_message = "Download speed: " + progressObj.bytesPerSecond;
    // log_message = log_message + " - Downloaded " + progressObj.percent + "%";
    // log_message =
    //   log_message +
    //   " (" +
    //   progressObj.transferred +
    //   "/" +
    //   progressObj.total +
    //   ")";
  });
  autoUpdater.on("update-downloaded", (info) => {
    logger.log("app update data download completed successfully");
    win.webContents.send(
      "app-update-process",
      "Update data download completed. App will be updated after quitted."
    );
  });
};
