import { useState, useEffect } from "react";

const useAttendanceState = (attendanceState_initialValue: attendanceState) => {
  const [attendanceState, setAttendanceState] =
    useState<attendanceState | null>(null);

  useEffect(() => {
    (async () => {
      const attendanceState_bcup = await window.electron.ipcRenderer.invoke(
        "handle_attendanceState",
        { mode: "read" }
      );
      console.log("attendanceState_bcup_result", attendanceState_bcup);

      setAttendanceState(
        attendanceState_bcup
          ? attendanceState_bcup
          : attendanceState_initialValue
      );
    })();
  }, []);

  return { attendanceState, setAttendanceState };
};

export default useAttendanceState;
