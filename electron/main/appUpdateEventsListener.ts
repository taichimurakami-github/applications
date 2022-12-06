import { autoUpdater } from "electron-updater";
import * as logger from "electron-log";
import { BrowserWindow } from "electron";
import { TAppAutoUpdateProcessStatus } from "../@types/main";

/**
 * 上手く動作しないようなので一旦コードのみ残して使用しないことにする
 */
export const listenAppAutoUpdateEvent = (win: BrowserWindow | null) => {
  autoUpdater.logger = logger;
  autoUpdater.checkForUpdatesAndNotify();

  const sendNotificationToIpcRenderer = (
    status: TAppAutoUpdateProcessStatus,
    message: string
  ) => {
    if (win) {
      win.webContents.send("app-update-process", {
        status: status,
        message: message,
      });
      // win.webContents.postMessage("app-update-process", message);
    }
  };

  autoUpdater.on("checking-for-update", () => {
    logger.log("Now checking new github releases...");
    sendNotificationToIpcRenderer(
      "checking-for-update",
      "Now checking avairable app update exists..."
    );
  });

  autoUpdater.on("update-available", (info) => {
    logger.log("Found available app update release !! Details are below :");
    logger.log(info);

    sendNotificationToIpcRenderer(
      "update-available",
      "Found available app update..."
    );
    sendNotificationToIpcRenderer("update-available", JSON.stringify(info));
  });

  autoUpdater.on("update-not-available", (info) => {
    logger.log("There is no available app update.");
    sendNotificationToIpcRenderer(
      "update-not-available",
      "There is no available app update."
    );
  });

  autoUpdater.on("error", (err) => {
    logger.error("Failed to fetch app update. The reason is below :");
    logger.error(err);
    sendNotificationToIpcRenderer("error", "There is no available app update.");
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
    sendNotificationToIpcRenderer("download-progress", log_message);
  });

  autoUpdater.on("update-downloaded", (info) => {
    logger.log("App update data has been downloaded successfully");

    sendNotificationToIpcRenderer(
      "update-downloaded",
      "Update data download completed. App will be updated after quitted."
    );
  });
};
