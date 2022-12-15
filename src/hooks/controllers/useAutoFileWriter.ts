import { useEffect } from "react";
import { objectNotEmpty } from "~/utils/objectNotEmpty";
import {
  useAttendanceStateCtx,
  useSeatsStateCtx,
} from "../states/useAppContext";

const useAutoFileWriter = (): void => {
  const attendanceState = useAttendanceStateCtx();
  const seatsState = useSeatsStateCtx();

  //seatsStateの全てのactiveプロパティがfalseだったら初期化されている状態とみなす
  const isSeatsStateInitialized = () => {
    for (const seatData of Object.values(seatsState)) {
      if (seatData.active) return false;
    }

    return true;
  };

  //バックアップ兼記録ファイル 自動書き出し
  useEffect(() => {
    (async () => {
      //attendanceStateが初期値{}でなければ書き出し
      objectNotEmpty(attendanceState) &&
        (await window.electron.writeAttendanceState(attendanceState));
    })();
  }, [attendanceState, seatsState]);

  useEffect(() => {
    (async () => {
      //seatsState書き出し
      !isSeatsStateInitialized() &&
        (await window.electron.writeSeatsState(seatsState));
    })();
  }, [seatsState]);
};

export default useAutoFileWriter;
