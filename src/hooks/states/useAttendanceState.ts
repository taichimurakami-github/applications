import { useState, useEffect } from "react";

export const attendanceState_initialValue: {} = {};

const useAttendanceState = () => {
  const [attendanceState, setAttendanceState] = useState<attendanceState>(
    attendanceState_initialValue
  );

  useEffect(() => {
    (async () => {
      const attendanceState_bcup: attendanceState =
        await window.electron.ipcRenderer.invoke("handle_attendanceState", {
          mode: "read",
        });
      console.log("attendanceState_bcup_result", attendanceState_bcup);

      setAttendanceState(
        attendanceState_bcup
          ? attendanceState_bcup
          : attendanceState_initialValue
      );
    })();
  }, []);

  useEffect(() => {
    console.log(attendanceState);
  }, [attendanceState]);

  return { attendanceState, setAttendanceState };
};

export default useAttendanceState;
