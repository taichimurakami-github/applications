import {ipcRenderer} from "electron";

declare global {
  interface Window{
    electron: {
      ipcRenderer: ipcRenderer
    }
  }
}

