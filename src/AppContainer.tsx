import { createContext, ReactChild, ReactChildren } from "react";
import App from "./App";
import {
  appState_initialValue,
  attendanceState_initialValue,
  modalState_initialValue,
  seatsState_initialValue,
  studentsList_initialValue,
} from "./app.config";
import useAppState from "./hooks/useAppState";
import useAttendanceState from "./hooks/useAttendanceState";
import useModalState from "./hooks/useModalState";
import useSeatsState from "./hooks/useSeatsState";
import useStudentsListState from "./hooks/useStudentsListState";

export const AppStateContext = createContext<any>(null);

const AppContainer = (props: { children: ReactChildren }) => {
  /**
   * -------------------------------
   *    React Hooks declearation
   * -------------------------------
   */

  //アプリの動作状態を管理する変数
  const { appState, setAppState, resetAppState } = useAppState(
    appState_initialValue
  );

  //エクセルから取得した生徒情報(生徒名簿リストデータ)を格納しておく変数
  const { studentsList, setStudentsList } = useStudentsListState(
    studentsList_initialValue
  );

  //入退室記録のデータを保存しておく変数
  const { attendanceState, setAttendanceState } = useAttendanceState(
    attendanceState_initialValue
  );

  //現在の座席状況を管理する変数
  const { seatsState, setSeatsState } = useSeatsState(seatsState_initialValue);

  //モーダル管理変数
  const { modalState, setModalState, handleModalState } = useModalState(
    modalState_initialValue
  );

  return (
    <AppStateContext.Provider
      value={{
        appState: appState,
        setAppState,
        resetAppState,
        studentsList: studentsList,
        setStudentsList,
        attendanceState: attendanceState,
        setAttendanceState,
        seatsState: seatsState,
        setSeatsState,
        modalState: modalState,
        setModalState,
      }}
    >
      <App></App>
    </AppStateContext.Provider>
  );
};

export default AppContainer;
