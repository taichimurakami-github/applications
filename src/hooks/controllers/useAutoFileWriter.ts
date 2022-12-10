import { useContext, useEffect } from "react";
import { AppStateContext } from "~/AppContainer";
import { objectNotEmpty } from "~/utils/objectNotEmpty";

const useAutoFileWriter = (): void => {
  const { attendanceState, seatsState }: AppStateContext =
    useContext(AppStateContext);

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

      //  window.electron.ipcRenderer.invoke("handle_attendanceState", {
      //   mode: "write",
      //   data: JSON.stringify(attendanceState),
      // }));
    })();
  }, [attendanceState, seatsState]);

  useEffect(() => {
    (async () => {
      //seatsState書き出し
      // objectNotEmpty(seatsState) &&
      !isSeatsStateInitialized() &&
        (await window.electron.writeSeatsState(seatsState));
      // (await window.electron.ipcRenderer.invoke("handle_seatsState", {
      //   mode: "write",
      //   data: JSON.stringify(seatsState),
      // }));
    })();
  }, [seatsState]);
};

export default useAutoFileWriter;
