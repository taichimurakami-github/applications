import { appConfig } from "../app.config";

const useEnterRecorder = (
  i: string,
  appState: appState,
  seatsState: seatsState,
  attendanceState: attendanceState,
  resetAppState: (arg: { mode: "APPLOG" | "DEFAULT"; content?: any }) => void,
  setSeatsState: React.Dispatch<React.SetStateAction<seatsState | null>>,
  setModalState: React.Dispatch<React.SetStateAction<modalState>>,
  setAttendanceState: React.Dispatch<
    React.SetStateAction<attendanceState | null>
  >
) => {
  console.log("出席処理を開始します...");
  //時刻を定義
  const now = new Date();
  const nowYearMonthAndDate = `${now.getFullYear()}/${
    now.getMonth() + 1
  }/${now.getDate()}`;
  const nowHoursMinutesAndSeconds = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const nowDateTime = `
    ${nowYearMonthAndDate} ${nowHoursMinutesAndSeconds}`;

  //該当の席を「使用中」にする
  appState.selectedElement && appState.selectedElement.classList.add("active");

  //seatsStateに挿入する値を定義
  const insertObjectForSeatsState: { [index: string]: any } = {};
  insertObjectForSeatsState[appState.selectedSeat] =
    i === "__OTHERS__"
      ? {
          active: true,
          enterTime: nowHoursMinutesAndSeconds,
          studentID: "__OTHERS__",
        }
      : {
          active: true,
          enterTime: nowHoursMinutesAndSeconds,
          studentID: i,
        };

  //seatsStateを更新
  setSeatsState({ ...seatsState, ...insertObjectForSeatsState });

  if (i !== "__OTHERS__") {
    //attendanceStateを更新
    const insertObjectForAttendanceState: { [index: string]: any } = {};
    const attendance_enterData = {
      id: i,
      seatID: appState.selectedSeat,
      enter: nowDateTime,
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
    setAttendanceState({
      ...attendanceState,
      ...insertObjectForAttendanceState,
    });
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

  resetAppState({
    mode: "APPLOG",
    content: {
      studentID: i,
      enterTime: insertObjectForSeatsState[appState.selectedSeat].enterTime,
      seatID: appState.selectedSeat,
      operation: "enter",
    },
  });
};

export default useEnterRecorder;
