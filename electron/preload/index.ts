import { ipcRenderer, contextBridge } from "electron";
import { TAppAutoUpdateProcessContent } from "../@types/contextBridge";

// const fs = require("fs");
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: ipcRenderer, //ipcRendererも渡せるのでやり取りできる

  onListenUpdateProcess: (callback) =>
    ipcRenderer.on(
      "app-update-process",
      (_events, content: TAppAutoUpdateProcessContent) => {
        callback(content);
      }
    ),
});
