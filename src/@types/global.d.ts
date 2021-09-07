import { ipcRenderer } from "electron";

declare global {
  interface Window {
    electron: {
      ipcRenderer: ipcRenderer
    }
  }

  interface studentsList {
    [index: string]: string
  }

  interface modalState {
    active: boolean,
    name: string,
    content: {}
  }

  interface seatsState {
    [index: string]: {
      active: boolean,
      enterTime: string,
      studentID: string,
    }
  }
}