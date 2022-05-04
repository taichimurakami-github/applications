//module import
import React, { useContext } from "react";

//React components import
import { Top } from "./components/containers/Top";
import { StudentDataSelector } from "./components/containers/StudentDataSelector";
import { ModalRoot } from "./components/containers/MordalRoot";
import { Config } from "./components/containers/Config";

//styles import
import "./components/styles/modules/Top.scss";
import "./components/styles/app.common.scss";
import { resolve } from "path";

import { AppStateContext } from "./AppContainer";
import useAutoDataReadChecker from "./hooks/controllers/useAutoDataReadChecker";
import useAutoFileWriter from "./hooks/controllers/useAutoFileWriter";

const App: React.VFC = () => {
  const {
    appState,
    setAppState,
    studentsList,
    seatsState,
    handleModalState,
  }: AppStateContext = useContext(AppStateContext);

  console.log("test");
  console.log(appState, studentsList, handleModalState);

  const handleChangeAppLocalConfig = async (arg: {
    fn_id?: string;
    fn_status?: string;
    fn_value?: boolean;
    msg?: string;
  }) => {
    const newAppLocalConfig = await window.electron.ipcRenderer.invoke(
      "handle_loadAppLocalConfig",
      { mode: "write", content: arg }
    );
    //変更を反映
    setAppState({
      ...appState,
      localConfig: { ...newAppLocalConfig.appConfig },
    });

    resolve();
  };

  //appState, seatStateを変更する
  const handleAppState = (d: { [index: string]: any }) =>
    setAppState({ ...appState, ...d });
  // const handleSeatsState = (d: { [index: string]: any }) =>
  //   setSeatsState({ ...seatsState, ...d });

  /**
   * function handleComponent()
   *
   * render()内のReact Componentを、appStateの変更に合わせて動的に返す
   *
   * @returns {void}
   */
  const handleComponent = () => {
    switch (appState.now) {
      case "TOP":
        return (
          <Top
            onHandleAppState={handleAppState}
            // onHandleModalState={handleModalState}
            // appState={appState}
            // seatsState={seatsState as seatsState}
            // studentsList={studentsList as studentsList}
          />
        );

      case "STUDENT":
        return <StudentDataSelector />;

      case "CONFIG":
        return (
          <Config
            onHandleAppState={handleAppState}
            onHandleChangeAppLocalConfig={handleChangeAppLocalConfig}
          />
        );

      default:
        throw new Error(
          "an Error has occured in App.js: unexpected appState.now case"
        );
    }
  };

  // //生徒情報ファイルが読み込まれていない時は、エラーモーダルを最初に表示
  useAutoDataReadChecker();

  // //バックアップ兼記録ファイル 自動書き出し
  useAutoFileWriter();

  return (
    <div className="App">
      {handleComponent()}
      <ModalRoot />
    </div>
  );
};

export default App;

//デバッグ用コンソール表示関数
// useEffect(() => {
//   console.log("seatsState checker---------");
//   console.log(seatsState);
// }, [seatsState]);
// useEffect(() => {
//   if (studentsList) {
//     console.log("student list data has loaded");
//     console.log(studentsList);
//   }
// }, [studentsList]);
// useEffect(() => {
//   console.log("appState checker---------");
//   console.log(appState);
// }, [appState]);
// useEffect(() => {
//   console.log("appState checker---------");
//   console.log(modalState);
// }, [modalState]);
// useEffect(() => {
//   console.log("attendanceState checker........")
//   console.log(attendanceState);
// }, [attendanceState]);
//
//---------------------------
//
//起動時、もしくはリロード時に1回だけ行われる処理
// useEffect(() => {
//   console.log("バックアップファイルの読み込みを開始します");

//   const reloadProc = async () => {
// isFirstReadSeatsStateBCUP.current = false;
// isFirstReadAttendanceStateBCUP.current = false;
//アプリのローカルファイルからアプリデータを取得
// const appLocalConfigData = await window.electron.ipcRenderer.invoke(
//   "handle_loadAppLocalConfig",
//   { mode: "read" }
// );
// appConfig.fn = appLocalConfigData.fn;
// appConfig.msg = appLocalConfigData.msg;
// setAppState({
//   ...appState,
//   localConfig: appLocalConfigData,
// });
// console.log("appConfig loaded:", appConfig.fn);
// //生徒情報ファイルが存在していれば自動読み込み
// //grade, idが整数値で取得されるので、文字列型に変換しておく
// const studentsList_autoloadedData: studentsList =
//   await window.electron.ipcRenderer.invoke("handle_studentsList", {
//     mode: "read",
//   });
// if (studentsList_autoloadedData) {
//   // const convertedStudentsList = [];
//   //keyが数値のオブジェクトが手渡されるので、
//   //grade, idを文字列に変換
//   for (let i = 0; i < studentsList_autoloadedData.length; i++) {
//     studentsList_autoloadedData[i].grade = String(
//       studentsList_autoloadedData[i].grade
//     );
//     studentsList_autoloadedData[i].id = String(
//       studentsList_autoloadedData[i].id
//     );
//   }
//   setStudentsList(studentsList_autoloadedData);
//   // console.log(studentsList_autoloadedData);
// }
// //今日の分のseatsState記録が残っていれば読み込み
// const seatsState_bcup = await window.electron.ipcRenderer.invoke(
//   "handle_seatsState",
//   { mode: "read" }
// );
// console.log("read_seatsstate_bcup_result", seatsState_bcup);
// seatsState_bcup && setSeatsState(seatsState_bcup);
//今日の分のattendanceState記録が残っていれば読み込み
// const attendanceState_bcup = await window.electron.ipcRenderer.invoke(
//   "handle_attendanceState",
//   { mode: "read" }
// );
// console.log("attendanceState_bcup_result", attendanceState_bcup);
// attendanceState_bcup && setAttendanceState(attendanceState_bcup);
//初回読み込みを完了、フラグを変更
// isFirstReadSeatsStateBCUP.current = true;
// isFirstReadAttendanceStateBCUP.current = true;
//   };

//   reloadProc();
// }, []);
