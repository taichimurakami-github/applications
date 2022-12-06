import { useState, useEffect } from "react";

export const attendanceState_initialValue: {} = {};

const useAttendanceState = () => {
  const [attendanceState, setAttendanceState] = useState<TAttendanceState>(
    attendanceState_initialValue
  );

  useEffect(() => {
    (async () => {
      const attendanceState_bcup = await window.electron.readAttendanceState();
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
