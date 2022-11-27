import { ipcRenderer, contextBridge } from "electron";

// const fs = require("fs");
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: ipcRenderer, //ipcRendererも渡せるのでやり取りできる

  onListenUpdateProcess: (handler) =>
    ipcRenderer.on("app-update-process", (events, args) => {
      console.log("\n\n\napp-update-process!!!");
      handler(args);
    }),

  ipcRendererOn: ipcRenderer.on,

  onUpdateCounter: (callback) => ipcRenderer.on("update-counter", callback),
});
