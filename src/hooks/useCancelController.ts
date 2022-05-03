import { useContext } from "react";
import { appConfig } from "../app.config";
import { AppStateContext } from "../AppContainer";

/**
 * function handleCancelOparation()
 *
 * 一つ前の操作を取り消す関数
 * 今の所、一旦取り消したらもとに戻すことはできないし、
 * 一つ前以上の操作を取り消すことはできない
 *
 * @returns {void}
 */
const useCancelController = () => {
  const {
    appState,
    seatsState,
    attendanceState,
    resetAppState,
    setSeatsState,
    setModalState,
    setAttendanceState,
  }: AppStateContext = useContext(AppStateContext);

  if (!attendanceState) {
    throw new Error("attendanceState is null");
  }

  //appState.appLogがnullだった場合、return
  if (!appState.appLog) return;

  // //デバッグ用コンソール
  // console.log(attendanceState[appState.appLog.studentID]);
  // console.log(appState.appLog);

  // const targetStudentData = studentsList.filter(val => val.id == appState.appLog.studentID);
  const insertObjectForAttendanceState = { ...attendanceState };
  const insertObjectForSeatsState: { [index: string]: any } = {};

  switch (appState.appLog.operation) {
    /**
     * TO DO (cancel enter operation)
     * ・seatsStateに登録した座席をリセット
     * ・attendanceStateから入室記録を削除
     * ・appLogをリセット
     */
    case "enter":
      //関係者その他ではない場合、attendanceStateのキャンセル処理を追加
      if (appState.appLog.studentID !== "__OTHERS__") {
        //attendanceStateのenterの記録を削除
        //attendanceState上にはkeyとvalueが必ず存在しているので、値の存在を確認せずに直接値を参照する

        attendanceState[appState.appLog.studentID].length === 1
          ? //attendanceStateのvalue内の要素が1つしかない場合、keyごと削除
            delete insertObjectForAttendanceState[appState.appLog.studentID]
          : //要素が2つ以上の場合、最後の要素 = 新しくenterで生成された要素を削除
            insertObjectForAttendanceState[appState.appLog.studentID].pop();

        setAttendanceState({ ...insertObjectForAttendanceState });
      }

      //seatsStateの登録を削除
      insertObjectForSeatsState[appState.appLog.seatID] = {
        active: false,
        enterTime: "",
        studentID: "",
      };
      setSeatsState({ ...seatsState, ...insertObjectForSeatsState });
      break;

    /**
     * TO DO (cancel enter operation)
     * ・seatsStateに登録し直す
     * ・attendanceStateから退出記録を削除
     * ・appLogをリセット
     */
    case "exit":
      if (appState.appLog.studentID === "__OTHERS__") {
        console.log("others exit");
        insertObjectForSeatsState[appState.appLog.seatID] = {
          active: true,
          enterTime: appState.appLog.enterTime,
          studentID: "__OTHERS__",
        };

        setSeatsState({ ...seatsState, ...insertObjectForSeatsState });
        break;
      }

      //seatsStateに再登録する
      insertObjectForSeatsState[appState.appLog.seatID] = {
        active: true,
        enterTime: appState.appLog.enterTime,
        studentID: appState.appLog.studentID,
      };
      setSeatsState({ ...seatsState, ...insertObjectForSeatsState });

      //attendanceStateからexitの記録を削除

      //配列の最後の要素を取得し、exitプロパティを削除
      const lastElem =
        insertObjectForAttendanceState[appState.appLog.studentID].slice(-1)[0];
      delete lastElem.exit;

      //配列の最後の要素を削除し、先程いじったexitなしオブジェクトを挿入
      insertObjectForAttendanceState[appState.appLog.studentID].pop();
      insertObjectForAttendanceState[appState.appLog.studentID].push(lastElem);

      setAttendanceState({
        ...attendanceState,
        ...insertObjectForAttendanceState,
      });
      break;

    default:
      throw new Error(
        "An error has occured in cancelOparation: oparation name is probably wrong"
      );
  }

  //AppStaetをリセット
  resetAppState({ mode: "DEFAULT" });

  //完了モーダルを表示
  setModalState({
    active: true,
    name: appConfig.modalCodeList["1001"],
    content: {
      //操作が取り消されました。
      confirmCode: appConfig.confirmCodeList["2006"],
    },
  });
};

export default useCancelController;
