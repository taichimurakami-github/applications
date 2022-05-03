import { useContext } from "react";
import { appConfig } from "../app.config";
import { AppStateContext } from "../AppContainer";

/**
 * function handleSaveAttendanceForExit()
 *
 * 退室記録を保存する関数
 *
 * @param {string} i : SELECTED SEAT ID
 */
const useExitRecorder = (
  i: string
  // seatsState: seatsState,
  // attendanceState: attendanceState,
  // setAttendanceState: any,
  // resetAppState: (arg: { mode: "APPLOG" | "DEFAULT"; content?: any }) => void,
  // setSeatsState: React.Dispatch<React.SetStateAction<seatsState | null>>,
  // setModalState: React.Dispatch<React.SetStateAction<modalState>>
) => {
  const {
    seatsState,
    attendanceState,
    resetAppState,
    setSeatsState,
    setAttendanceState,
    setModalState,
  }: AppStateContext = useContext(AppStateContext);

  if (!seatsState || !attendanceState) {
    throw new Error("state is empty");
  }

  console.log("退席処理を開始します...");
  const insertObjectForSeatsState: { [index: string]: any } = {};
  insertObjectForSeatsState[i] = {
    active: false,
    enterTime: "",
    studentID: "",
  };
  const now = new Date();
  const attendance_exitData = {
    exit: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
  };

  if (seatsState[i].studentID !== "__OTHERS__") {
    //"関係者その他"でなければ、attendanceStateを更新

    //id: 対象生徒のid(objのindexになる)
    const id = seatsState[i].studentID;

    //対象生徒のkeyで参照したattendanceStateのvalueの中で、
    //配列の最後の要素のみ更新し、元のattendanceStateにマージする
    const insertObjectForAttendanceState: { [index: string]: any } = {};
    insertObjectForAttendanceState[id] = attendanceState[id].map(
      (val: any, index: number) => {
        //exitのデータを、配列の最後の要素に書き込み
        //それ以外のデータは変更しないでそのまま返す
        return index === Number(attendanceState[id].length) - 1
          ? { ...val, ...attendance_exitData }
          : val;
      }
    );

    setAttendanceState({
      ...attendanceState,
      ...insertObjectForAttendanceState,
    });
  }

  setSeatsState({ ...seatsState, ...insertObjectForSeatsState });

  //確認モーダルの表示
  setModalState({
    active: true,
    name: appConfig.modalCodeList["1001"],
    content: {
      //退室記録完了
      confirmCode: appConfig.confirmCodeList["2002"],
      exitTime: attendance_exitData.exit,
      enterTime: seatsState[i].enterTime,
    },
  });

  //appStateのリセット兼ログ保存
  resetAppState({
    mode: "APPLOG",
    content: {
      studentID: seatsState[i].studentID,
      enterTime: seatsState[i].enterTime,
      seatID: i,
      operation: "exit",
    },
  });
};

export default useExitRecorder;
