import { createContext, useEffect } from "react";
import App from "./App";
import { useIpcEventsSender } from "./hooks/controllers/useIpcEventsSender";
import useAppState from "./hooks/states/useAppState";
import useAttendanceState from "./hooks/states/useAttendanceState";
import useModalState from "./hooks/states/useModalState";
import useSeatsState from "./hooks/states/useSeatsState";
import useStudentsListState from "./hooks/states/useStudentsListState";

export const AppStateContext = createContext<any>(null);

const AppContainer: React.VFC = (props) => {
  /**
   * -------------------------------
   *    React Hooks declearation
   * -------------------------------
   */

  //アプリの動作状態を管理する変数
  const { appState, setAppState, resetAppState, handleAppState } =
    useAppState();

  //エクセルから取得した生徒情報(生徒名簿リストデータ)を格納しておく変数
  const { studentsList, setStudentsList } = useStudentsListState();

  //入退室記録のデータを保存しておく変数
  const { attendanceState, setAttendanceState } = useAttendanceState();

  //現在の座席状況を管理する変数
  const { seatsState, setSeatsState } = useSeatsState();

  //モーダル管理変数
  const { modalState, setModalState, handleModalState } = useModalState();

  /**
   * -----------------------------------------------
   *    app update status checker (experimental)
   * -----------------------------------------------
   */
  const { checkAppAutoUpdateProgress } = useIpcEventsSender();

  useEffect(() => {
    setInterval(async () => {
      const result = await checkAppAutoUpdateProgress();
      console.log(result);
    }, 2000);
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        appState: appState,
        setAppState,
        resetAppState,
        handleAppState,
        studentsList: studentsList,
        setStudentsList,
        attendanceState: attendanceState,
        setAttendanceState,
        seatsState: seatsState,
        setSeatsState,
        modalState: modalState,
        setModalState,
        handleModalState,
      }}
    >
      <App></App>
    </AppStateContext.Provider>
  );
};

export default AppContainer;
