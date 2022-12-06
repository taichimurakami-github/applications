import { autoUpdater } from "electron-updater";
import * as logger from "electron-log";
import { BrowserWindow } from "electron";

/**
 * 上手く動作しないようなので一旦コードのみ残して使用しないことにする
 */
export const listenAppAutoUpdateEvent = (win: BrowserWindow | null) => {
  autoUpdater.logger = logger;
  autoUpdater.checkForUpdatesAndNotify();

  const sendNotificationToIpcRenderer = (message: string) => {
    if (win) {
      win.webContents.send("app-update-process", message);
    }
  };

  autoUpdater.on("checking-for-update", () => {
    logger.log("Now checking new github releases...");
    sendNotificationToIpcRenderer(
      "Now checking avairable app update exists..."
    );
  });

  autoUpdater.on("update-available", (info) => {
    logger.log("Found available app update release !! Details are below :");
    logger.log(info);

    sendNotificationToIpcRenderer("Found available app update...");
    sendNotificationToIpcRenderer(JSON.stringify(info));
  });

  autoUpdater.on("update-not-available", (info) => {
    logger.log("There is no available app update.");
    sendNotificationToIpcRenderer("There is no available app update.");
  });

  autoUpdater.on("error", (err) => {
    logger.error("Failed to fetch app update. The reason is below :");
    logger.error(err);
    sendNotificationToIpcRenderer("There is no available app update.");
  });

  autoUpdater.on("download-progress", (progressObj) => {
    logger.log("Fetching app update from github releases...");

    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + " - Downloaded " + progressObj.percent + "%";
    log_message =
      log_message +
      " (" +
      progressObj.transferred +
      "/" +
      progressObj.total +
      ")";

    logger.log(log_message);
    sendNotificationToIpcRenderer(log_message);
  });

  autoUpdater.on("update-downloaded", (info) => {
    logger.log("App update data has been downloaded successfully");

    sendNotificationToIpcRenderer(
      "Update data download completed. App will be updated after quitted."
    );
  });
};
