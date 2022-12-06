import { useCallback, useContext } from "react";
import { appConfig } from "~/app.config";
import { AppStateContext } from "~/AppContainer";

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
    resetAppState,
    attendanceState,
    setSeatsState,
    setModalState,
    setAttendanceState,
  }: AppStateContext = useContext(AppStateContext);

  const showExecuted = () => {
    //完了モーダルを表示
    setModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        //取り消し操作完了
        confirmCode: appConfig.confirmCodeList["2006"],
      },
    });
  };

  const removeCurrentLog = () => {
    resetAppState({ mode: "DEFAULT" });
  };

  const cancelEnterOperation = (
    insertObjectForAttendanceState: TAttendanceState,
    insertObjectForSeatsState: { [index: string]: any }
  ) => {
    /**
     * TO DO (cancel enter operation)
     * ・seatsStateに登録した座席をリセット
     * ・attendanceStateから入室記録を削除
     * ・appLogをリセット
     */

    //関係者その他ではない場合、attendanceStateのキャンセル処理を追加
    if (appState.appLog.studentId === "__OTHERS__") {
      return;
    }

    //attendanceStateのenterの記録を削除
    //attendanceState上にはkeyとvalueが必ず存在しているので、値の存在を確認せずに直接値を参照する
    attendanceState[appState.appLog.studentId].length === 1
      ? //attendanceStateのvalue内の要素が1つしかない場合、keyごと削除
        delete insertObjectForAttendanceState[appState.appLog.studentId]
      : //要素が2つ以上の場合、最後の要素 = 新しくenterで生成された要素を削除
        insertObjectForAttendanceState[appState.appLog.studentId].pop();

    setAttendanceState((beforeAttendanceState) => ({
      ...beforeAttendanceState,
      ...insertObjectForAttendanceState,
    }));

    //seatsStateの登録を削除
    insertObjectForSeatsState[appState.appLog.seatID] = {
      active: false,
      enterTime: "",
      studentId: "",
    };
    setSeatsState((beforeSeatsState) => ({
      ...beforeSeatsState,
      ...insertObjectForSeatsState,
    }));
  };

  const cancelExitOperation = (
    insertObjectForAttendanceState: TAttendanceState,
    insertObjectForSeatsState: { [index: string]: any }
  ) => {
    /**
     * TO DO (cancel enter operation)
     * ・seatsStateに登録し直す
     * ・attendanceStateから退出記録を削除
     * ・appLogをリセット
     */

    if (appState.appLog.studentId === "__OTHERS__") {
      console.log("others exit");
      insertObjectForSeatsState[appState.appLog.seatID] = {
        active: true,
        enterTime: appState.appLog.enterTime,
        studentId: "__OTHERS__",
      };

      setSeatsState((beforeSeatsState) => ({
        ...beforeSeatsState,
        ...insertObjectForSeatsState,
      }));
      return;
    }

    //seatsStateに再登録する
    insertObjectForSeatsState[appState.appLog.seatID] = {
      active: true,
      enterTime: appState.appLog.enterTime,
      studentId: appState.appLog.studentId,
    };
    setSeatsState((beforeSeatsState) => ({
      ...beforeSeatsState,
      ...insertObjectForSeatsState,
    }));

    //attendanceStateからexitの記録を削除

    //配列の最後の要素を取得し、exitプロパティを削除
    const lastElem =
      insertObjectForAttendanceState[appState.appLog.studentId].slice(-1)[0];
    delete lastElem.exit;

    //配列の最後の要素を削除し、先程いじったexitなしオブジェクトを挿入
    insertObjectForAttendanceState[appState.appLog.studentId].pop();
    insertObjectForAttendanceState[appState.appLog.studentId].push(lastElem);

    setAttendanceState((beforeAttendanceState) => ({
      ...beforeAttendanceState,
      ...insertObjectForAttendanceState,
    }));
  };

  const cancelController = useCallback(() => {
    //appState.appLogがnullだった場合、return
    if (!appState.appLog || !appState.appLog.operation) {
      console.log("本日付のappLogがありません");
      showExecuted();
      return;
    }

    // //デバッグ用コンソール
    // console.log(attendanceState[appState.appLog.studentId]);
    // console.log(appState.appLog);

    const insertObjectForAttendanceState = { ...attendanceState };
    const insertObjectForSeatsState: { [index: string]: any } = {};

    if (appState.appLog.operation === "enter") {
      cancelEnterOperation(
        insertObjectForAttendanceState,
        insertObjectForSeatsState
      );
    } else if (appState.appLog.operation === "exit") {
      cancelExitOperation(
        insertObjectForAttendanceState,
        insertObjectForSeatsState
      );
    }

    showExecuted();
  }, []);

  return cancelController;
};

export default useCancelController;
