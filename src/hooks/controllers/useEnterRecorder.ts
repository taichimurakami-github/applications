import { useCallback, useContext } from "react";
import { appConfig } from "../../app.config";
import { AppStateContext } from "../../AppContainer";
import { getFormattedDate } from "../../utils/getFormattedDate";

/**
 * function handleSaveAttendanceForEnter()
 *
 * 入室記録を保存する関数
 *
 * @param {string} i : TARGET STUDENT ID (studentsList student.id)
 */
const useEnterRecorder = () => {
  const {
    appState,
    attendanceState,
    handleAppState,
    setSeatsState,
    setAttendanceState,
    setModalState,
  }: AppStateContext = useContext(AppStateContext);

  const handleStudentsAttendanceState = (i: string, enterDateTime: string) => {
    //関係者その他（i === "__OTHERS__"）ではないとき、
    //attendanceStateを更新
    const insertObjectForAttendanceState: { [index: string]: any } = {};
    const attendance_enterData = {
      id: i,
      seatID: appState.selectedSeat,
      enter: enterDateTime,
    };

    //attendanceState内に該当生徒のkeyが存在するか確認
    i in attendanceState
      ? //既に同日内に自習室に記録が残っている場合、要素を追加する形で記録
        (insertObjectForAttendanceState[i] = attendanceState[i].map(
          (val: any) => val
        ))
      : //同日内で初めて自習室に来た場合、新しくkeyと配列を作成
        (insertObjectForAttendanceState[i] = []);

    insertObjectForAttendanceState[i].push(attendance_enterData);
    //atttendanceStateを更新
    setAttendanceState((beforeAttendanceState) => ({
      ...beforeAttendanceState,
      ...insertObjectForAttendanceState,
    }));
  };

  const enterRecorder = useCallback((i: string | undefined) => {
    if (!i) {
      throw new Error(
        "invalid props.content.targetID value: undefined has passed."
      );
    }

    console.log("出席処理を開始します...");
    //時刻を取得
    const nowDate = getFormattedDate();

    //該当の席を「使用中」にする
    appState.selectedElement &&
      appState.selectedElement.classList.add("active");

    //seatsStateに挿入する値を定義
    const insertObjectForSeatsState: { [index: string]: any } = {};
    insertObjectForSeatsState[appState.selectedSeat] =
      i === "__OTHERS__"
        ? {
            active: true,
            enterTime: nowDate.HMS,
            studentID: "__OTHERS__",
          }
        : {
            active: true,
            enterTime: nowDate.HMS,
            studentID: i,
          };

    //seatsStateを更新
    setSeatsState((beforeSeatsState) => ({
      ...beforeSeatsState,
      ...insertObjectForSeatsState,
    }));

    if (i !== "__OTHERS__") {
      handleStudentsAttendanceState(i, `${nowDate.YMD} ${nowDate.HMS}`);
    }

    //確認モーダルの表示
    setModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        //入室記録完了
        confirmCode: appConfig.confirmCodeList["2001"],
      },
    });

    handleAppState({
      now: "TOP",
      appLog: {
        studentID: i,
        enterTime: insertObjectForSeatsState[appState.selectedSeat].enterTime,
        seatID: appState.selectedSeat,
        operation: "enter",
      },
    });
  }, []);

  return enterRecorder;
};

export default useEnterRecorder;
