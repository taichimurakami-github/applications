import { useCallback, useContext } from "react";
import { appConfig } from "../../app.config";
import { AppStateContext } from "../../AppContainer";
import { calculateTimeDiff } from "../../utils/calculateTimeDiff";
import { getFormattedDate } from "../../utils/getFormattedDate";

const useExitRecorder = () => {
  const {
    seatsState,
    attendanceState,
    resetAppState,
    setSeatsState,
    setAttendanceState,
    setModalState,
  }: AppStateContext = useContext(AppStateContext);

  /**
   * function handleSaveAttendanceForExit()
   *
   * 退室記録を保存する関数
   *
   * @param {string} i : SELECTED SEAT ID
   */
  const exitRecorder = useCallback((i: string | undefined) => {
    if (!i) {
      throw new Error("targetID is empty");
    }

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
    const nowDate = getFormattedDate();
    const attendance_exitData = {
      exit: nowDate.HMS,
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

    const exitTime = attendance_exitData.exit;
    const enterTime = seatsState[i].enterTime;

    //確認モーダルの表示
    setModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        //退室記録完了
        confirmCode: appConfig.confirmCodeList["2002"],
        timeLength: calculateTimeDiff(enterTime, exitTime),
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
  }, []);

  return exitRecorder;
};

export default useExitRecorder;
