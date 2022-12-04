import { ipcMain } from "electron";
import { SeatsState } from "./stateManager/SeatsState";
import { AttendanceState } from "./stateManager/AttendanceState";
import { StudentsListState } from "./stateManager/StudentsList";
import { AppConfigState } from "./stateManager/AppConfigState";
import { autoUpdater } from "electron-updater";
import * as logger from "electron-log";

export const listenIpcMainEvents = (appConfigDirPath: string) => {
  /**
   * Create state manager instance
   */
  const Config = new AppConfigState(appConfigDirPath);
  const Seats = new SeatsState(Config.getSeatsDir());
  const Attendance = new AttendanceState(Config.getAttendanceDir());
  const StudentsList = new StudentsListState(Config.getStudentsFilepath());

  /**
   * Add event listener sent from ipcRenderer.invoke
   */
  ipcMain.handle("read_studentsList", async (event, arg) => {
    return StudentsList.readData();
    // return readStudentsList(Config.getData());
  });

  ipcMain.handle("read_attendanceState", async (event, arg) => {
    return Attendance.readData();
  });

  ipcMain.handle("write_attendanceState", async (event, arg) => {
    return Attendance.updateData(arg.data);
  });

  ipcMain.handle("read_seatsState", (event, arg) => {
    return Seats.readData();
  });

  ipcMain.handle("write_seatsState", (event, arg) => {
    return Seats.updateData(arg.data);
  });

  ipcMain.handle("delete_appLocalData", () => {
    Attendance.deleteData();
    Seats.deleteData();
  });

  ipcMain.handle("read_appLocalConfig", async (event, arg) => {
    const configData = await Config.readData();
    console.log(configData);

    if (!configData?.appConfig) {
      return undefined;
    }

    // rendererで必要な項目のみ抽出してreturnする
    return {
      fn: configData.appConfig.fn,
      msg: configData.appConfig.msg,
    };
  });

  ipcMain.handle(
    "update_appLocalConfig_studentsListPath",
    async (event, arg) => {
      const newData = {
        ...Config.getData(),
      };
      newData.path.studentsList = arg.path;
      console.log("\n\n\npath:", arg.path, "\n\n\n");

      return Config.updateData(newData);
    }
  );

  ipcMain.handle("update_appLocalConfig_topMessage", async (event, arg) => {
    const newData = {
      ...Config.getData(),
    };
    newData.appConfig.msg = arg.message;

    return Config.updateData(newData);
  });

  ipcMain.handle("update_appLocalConfig_fnConfig", async (event, arg) => {
    const newData = {
      ...Config.getData(),
    };

    switch (arg.fn_id) {
      case "appConfig_fn_cancelOperation":
        newData.appConfig.fn[arg.fn_status].cancelOperation = arg.fn_value;
        break;

      case "appConfig_fn_eraceAppDataTodayAll":
        newData.appConfig.fn[arg.fn_status].eraceAppDataTodayAll = arg.fn_value;
        break;

      default:
        throw new Error("invalid arg.id in ipcHandler_handle_appLocalConfig");
    }

    return Config.updateData(newData);
  });

  ipcMain.handle("check_autoUpdater_progress", (event, arg) => {
    autoUpdater.logger = logger;
    return autoUpdater.checkForUpdatesAndNotify();
  });
};
