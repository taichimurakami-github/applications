import { useState, useEffect } from "react";
import { useIpcEventsSender } from "../controllers/useIpcEventsSender";

export const attendanceState_initialValue: {} = {};

const useAttendanceState = () => {
  const { readAttendanceState } = useIpcEventsSender();
  const [attendanceState, setAttendanceState] = useState<attendanceState>(
    attendanceState_initialValue
  );

  useEffect(() => {
    (async () => {
      const attendanceState_bcup: attendanceState = await readAttendanceState();
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
