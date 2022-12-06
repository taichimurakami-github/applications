import { useCallback, useContext } from "react";
import { appConfig } from "../../app.config";
import { AppStateContext } from "../../AppContainer";
import { seatsState_initialValue } from "../states/useSeatsState";

const useSeatsController = () => {
  const {
    seatsState,
    attendanceState,
    setSeatsState,
    setModalState,
    setAttendanceState,
  }: AppStateContext = useContext(AppStateContext);

  /**
   * function handleSeatOperation()
   * @param {object}
   * {
   *    mode: {String},
   *    content: {Object}
   * }
   * @returns
   */
  const seatsController = useCallback((arg: { mode: string; content: any }) => {
    if (arg.mode === appConfig.seatOperationCodeList["1001"]) {
      const nowSeatID: string = arg.content.nowSeatID;
      const nextSeatID: string = arg.content.nextSeatID;
      const targetID: string = seatsState[arg.content.nowSeatID].studentId;

      //AttendanceState書き換え
      if (targetID !== "__OTHERS__") {
        //attendanceStateから対象生徒のarrayを取得し、書換用データ保持objを作成
        const insertObjectForAttendanceState: { [index: string]: any } = {};
        insertObjectForAttendanceState[targetID] = [
          ...attendanceState[targetID],
        ];

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
        setAttendanceState((beforeAttendanceState) => ({
          ...beforeAttendanceState,
          ...insertObjectForAttendanceState,
        }));
      }

      //SeatsState書き換え
      //attendanceStateから対象の席のobjectを取得し、書換用データ保持objを作成
      const insertObjectForSeatsState: { [index: string]: any } = {};
      insertObjectForSeatsState[nowSeatID] = {
        ...seatsState_initialValue[nowSeatID],
      };
      insertObjectForSeatsState[nextSeatID] = { ...seatsState[nowSeatID] };

      setSeatsState((beforeSeatsState) => ({
        ...beforeSeatsState,
        ...insertObjectForSeatsState,
      }));

      // console.log("insertObj-attendance");
      // console.log(insertObjectForSeatsState);

      setModalState({
        active: true,
        name: appConfig.modalCodeList["1001"],
        content: {
          confirmCode: appConfig.confirmCodeList["2008"],
          studentId: targetID,
          nextSeatID: nextSeatID,
        },
      });
    }
  }, []);

  return seatsController;
};
export default useSeatsController;
