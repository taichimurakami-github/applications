export const useIpcEventsSender = () => {
  const _invoke = window.electron.ipcRenderer.invoke;

  //handle attendanceState
  const readAttendanceState = async () => {
    return await _invoke("read_attendanceState");
  };
  const writeAttendanceState = async (newAttendanceState: attendanceState) => {
    return await _invoke("write_attendanceState", {
      data: newAttendanceState,
    });
  };

  //handle seatsState
  const readSeatsState = async (): Promise<seatsState | undefined> => {
    return await _invoke("read_seatsState");
  };
  const writeSeatsState = async (newSeatsState: seatsState) => {
    return await _invoke("write_seatsState", {
      data: newSeatsState,
    });
  };

  //handle studetnsList
  const readStudentsList = async (): Promise<studentsList | undefined> => {
    return await _invoke("read_studentsList");
  };

  //handle appLocalConfig
  const readAppLocalConfig = async (): Promise<any> => {
    return await _invoke("read_appLocalConfig");
  };

  const updateTopMessageConfig = async (newTopMessage: string) => {
    return await _invoke("update_appLocalConfig_topMessage", {
      message: newTopMessage,
    });
  };

  const updateAppFunctionsConfig = async (
    fn_id: "appConfig_fn_cancelOperation" | "appConfig_fn_eraceAppDataTodayAll",
    fn_status: "stable" | "nightly",
    fn_value: boolean
  ) => {
    return await _invoke("update_appLocalConfig_fnConfig", {
      fn_id: fn_id,
      fn_status: fn_status,
      fn_value: fn_value,
    });
  };

  const updateStudentsListPathConfig = async (
    filePath: string
  ): Promise<boolean> => {
    return await _invoke("update_appLocalConfig_studentsListPath", {
      path: filePath,
    });
  };

  //handle other events
  const deleteAppLocalData = async () => {
    return await _invoke("delete_appLocalData");
  };

  return {
    readAttendanceState,
    writeAttendanceState,
    readSeatsState,
    writeSeatsState,
    readStudentsList,
    readAppLocalConfig,
    updateStudentsListPathConfig,
    updateTopMessageConfig,
    updateAppFunctionsConfig,
    deleteAppLocalData,
  };
};
