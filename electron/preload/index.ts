import { ipcRenderer, contextBridge } from "electron";

// const fs = require("fs");
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: ipcRenderer, //ipcRendererも渡せるのでやり取りできる

  onListenUpdateProcess: (callback) =>
    ipcRenderer.on("app-update-process", (events, args) => {
      console.log("\n\n\napp-update-process!!!");
      console.log("events:", events);
      callback(args);
    }),
});
