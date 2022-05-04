import { useContext, useEffect } from "react";
import { AppStateContext } from "../../AppContainer";

const useAutoFileWriter = (): void => {
  const { attendanceState, seatsState }: AppStateContext =
    useContext(AppStateContext);

  //バックアップ兼記録ファイル 自動書き出し
  useEffect(() => {
    (async () => {
      //attendanceState書き出し
      attendanceState &&
        (await window.electron.ipcRenderer.invoke("handle_attendanceState", {
          mode: "write",
          data: JSON.stringify(attendanceState),
        }));

      //seatsState書き出し
      seatsState &&
        (await window.electron.ipcRenderer.invoke("handle_seatsState", {
          mode: "write",
          data: JSON.stringify(seatsState),
        }));
    })();
  }, [attendanceState, seatsState]);
};

export default useAutoFileWriter;
