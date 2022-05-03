import { appConfig, seatsState_initialValue } from "../app.config";

const useSeatsController = (
  arg: { mode: string; content: any },
  seatsState: seatsState,
  attendanceState: attendanceState,
  setSeatsState: React.Dispatch<React.SetStateAction<seatsState | null>>,
  setAttendanceState: React.Dispatch<
    React.SetStateAction<attendanceState | null>
  >,
  setModalState: React.Dispatch<React.SetStateAction<modalState>>
) => {
  if (arg.mode === appConfig.seatOperationCodeList["1001"]) {
    const nowSeatID: string = arg.content.nowSeatID;
    const nextSeatID: string = arg.content.nextSeatID;
    const targetID: string = seatsState[arg.content.nowSeatID].studentID;

    //AttendanceState書き換え
    if (targetID !== "__OTHERS__") {
      //attendanceStateから対象生徒のarrayを取得し、書換用データ保持objを作成
      const insertObjectForAttendanceState: { [index: string]: any } = {};
      insertObjectForAttendanceState[targetID] = [...attendanceState[targetID]];

      // console.log("insertObj-attendance 作成直後");
      // console.log(insertObjectForAttendanceState);

      //最後の要素のseatIDを書き換えるため、insert用オブジェクトから最後の要素を取り出し、
      //書き換え後のデータを用意
      const changeData: { [index: string]: string } =
        insertObjectForAttendanceState[targetID].pop();
      changeData.seatID = nextSeatID;

      insertObjectForAttendanceState[targetID].push(changeData);
      // console.log("insertObj-attendance 作成完了");
      // console.log(insertObjectForAttendanceState);
      setAttendanceState({
        ...attendanceState,
        ...insertObjectForAttendanceState,
      });
    }

    //SeatsState書き換え
    //attendanceStateから対象の席のobjectを取得し、書換用データ保持objを作成
    const insertObjectForSeatsState: { [index: string]: any } = {};
    insertObjectForSeatsState[nowSeatID] = {
      ...seatsState_initialValue[nowSeatID],
    };
    insertObjectForSeatsState[nextSeatID] = { ...seatsState[nowSeatID] };

    setSeatsState({ ...seatsState, ...insertObjectForSeatsState });

    // console.log("insertObj-attendance");
    console.log(insertObjectForSeatsState);

    setModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        confirmCode: appConfig.confirmCodeList["2008"],
        studentID: targetID,
        nextSeatID: nextSeatID,
      },
    });
  }
};

export default useSeatsController;
