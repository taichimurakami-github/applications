import { ipcRenderer, contextBridge } from "electron";
import { TAppAutoUpdateProcessContent } from "../@types/contextBridge";
import {
  TAppLocalConfig,
  TAttendanceState,
  TSeatsState,
  TStudentsList,
} from "../@types/main";

export default {
  ipcRenderer: ipcRenderer, //ipcRendererも渡せるのでやり取りできる

  /**
   * ipcRenderer -> ipcMain dispatchers
   */

  readAttendanceState: (): Promise<TAttendanceState | undefined> => {
    return ipcRenderer.invoke("read_attendanceState");
  },
  writeAttendanceState: (newAttendanceState: TAttendanceState) => {
    return ipcRenderer.invoke("write_attendanceState", {
      data: newAttendanceState,
    });
  },

  readSeatsState: () => {
    return ipcRenderer.invoke("read_seatsState");
  },
  writeSeatsState: (newSeatsState: TSeatsState): Promise<boolean> => {
    return ipcRenderer.invoke("write_seatsState", {
      data: newSeatsState,
    });
  },

  readStudentsList: (): Promise<TStudentsList | undefined> => {
    return ipcRenderer.invoke("read_studentsList");
  },

  readAppLocalConfig: (): Promise<TAppLocalConfig | undefined> => {
    return ipcRenderer.invoke("read_appLocalConfig");
  },

  updateTopMessageConfig: (newTopMessage: string): Promise<boolean> => {
    return ipcRenderer.invoke("update_appLocalConfig_topMessage", {
      message: newTopMessage,
    });
  },

  updateAppFunctionsConfig: (
    fn_id: "appConfig_fn_cancelOperation" | "appConfig_fn_eraceAppDataTodayAll",
    fn_status: "stable" | "nightly",
    fn_value: boolean
  ): Promise<boolean> => {
    return ipcRenderer.invoke("update_appLocalConfig_fnConfig", {
      fn_id: fn_id,
      fn_status: fn_status,
      fn_value: fn_value,
    });
  },

  updateStudentsListPathConfig: (filePath: string): Promise<boolean> => {
    return ipcRenderer.invoke("update_appLocalConfig_studentsListPath", {
      path: filePath,
    });
  },

  deleteAppLocalData: (): Promise<void> => {
    return ipcRenderer.invoke("delete_appLocalData");
  },

  /**
   * ipcMain -> ipcRenderer dispatchers
   */

  onListenUpdateProcess: (
    callback: (content: TAppAutoUpdateProcessContent) => void
  ) =>
    ipcRenderer.on(
      "app-update-process",
      (_events, content: TAppAutoUpdateProcessContent) => {
        callback(content);
      }
    ),
};
