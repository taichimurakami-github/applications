import { createContext } from "react";
import App from "./App";
import useAppState from "~/hooks/states/useAppState";
import useAttendanceState from "~/hooks/states/useAttendanceState";
import useModalState from "~/hooks/states/useModalState";
import useSeatsState from "~/hooks/states/useSeatsState";
import useStudentsListState from "~/hooks/states/useStudentsListState";

export type TAppSetStateContext = {
  //useAppState dispatchers
  setAppState: React.Dispatch<React.SetStateAction<TAppState>>;
  resetAppState: (arg: { mode: "APPLOG" | "DEFAULT"; content?: any }) => void;
  handleAppState: (d: { [index: string]: any }) => void;

  //useAttendanceState dispatcher
  setAttendanceState: React.Dispatch<React.SetStateAction<TAttendanceState>>;

  //useSeatsState dispatcher
  setSeatsState: React.Dispatch<React.SetStateAction<TSeatsState>>;

  //useStudentsList dispatcher
  setStudentsList: React.Dispatch<React.SetStateAction<TStudentsList>>;

  //useModalState dispatchers
  setModalState: React.Dispatch<React.SetStateAction<TModalState>>;
  handleModalState: (t: TModalState) => void;
};

//@ts-ignore
export const AppStateContext = createContext<TAppState>();
//@ts-ignore
export const AttendanceStateContext = createContext<TAttendanceState>();
//@ts-ignore
export const SeatsStateContext = createContext<TSeatsState>();
//@ts-ignore
export const ModalStateContext = createContext<TModalState>();
//@ts-ignore
export const StudentsListContext = createContext<TStudentsList>();
//@ts-ignore
export const AppSetStateContext = createContext<TAppSetStateContext>();

const AppContainer = () => {
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

  return (
    <AppSetStateContext.Provider
      value={{
        setAppState,
        resetAppState,
        handleAppState,
        setAttendanceState,
        setSeatsState,
        setStudentsList,
        setModalState,
        handleModalState,
      }}
    >
      <AppStateContext.Provider value={appState}>
        <AttendanceStateContext.Provider value={attendanceState}>
          <SeatsStateContext.Provider value={seatsState}>
            <StudentsListContext.Provider value={studentsList}>
              <ModalStateContext.Provider value={modalState}>
                <App></App>
              </ModalStateContext.Provider>
            </StudentsListContext.Provider>
          </SeatsStateContext.Provider>
        </AttendanceStateContext.Provider>
      </AppStateContext.Provider>
    </AppSetStateContext.Provider>
  );
};

export default AppContainer;
