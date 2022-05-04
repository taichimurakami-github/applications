import { createContext, ReactChild, ReactChildren, useCallback } from "react";
import App from "./App";
import {
  appState_initialValue,
  attendanceState_initialValue,
  modalState_initialValue,
  seatsState_initialValue,
  studentsList_initialValue,
} from "./app.config";
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
  const { appState, setAppState, resetAppState, handleAppState } = useAppState(
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
  const { modalState, setModalState } = useModalState(modalState_initialValue);

  /**
   * function handleModalState()
   *
   * モーダルの表示を管理する関数
   * 引数tはactive, nameキーと、モーダルごとに異なるcontentキーを持つオブジェクトとする
   *
   * @param {object} t
   * @returns {void}
   */
  const handleModalState = useCallback((t: modalState) => {
    //t.active = falseだった場合：modalStateをリセットする
    if (!t.active) {
      setModalState(modalState_initialValue);
      return;
    }

    //その他：引数に従ってモーダルを起動
    if (t.active && t.name !== "" && t.content !== {}) {
      setModalState({
        active: true,
        name: t.name,
        content: t.content,
      });
      return;
    }

    //正しく引数が指定されていない場合はエラー
    throw new Error(
      "handleModal argument type error in App.js: you need to include active, name, content properties those are truthy."
    );
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
