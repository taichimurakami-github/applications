//module import
import React, { VFC, useEffect, useState, useRef } from "react";
import {
  appConfig,
  appState_initialValue,
  studentsList_initialValue,
  attendanceState_initialValue,
  seatsState_initialValue,
  modalState_initialValue,
} from "./app.config";

//React components import
import { Top } from "./components/containers/Top";
import { SelectData } from "./components/containers/StudentDataSelector";
import { ModalWrapper } from "./components/containers/MordalRoot";
import { Config } from "./components/containers/Config";

//styles import
import "./components/styles/modules/Top.scss";
import "./components/styles/app.common.scss";
import { resolve } from "path";
import useSeatsState from "./hooks/useSeatsState";
import useAttendanceState from "./hooks/useAttendanceState";
import useStudentsListState from "./hooks/useStudentsListState";
import useAppState from "./hooks/useAppState";

const App: React.VFC = () => {
  /**
   * -------------------------------
   *    React Hooks declearation
   * -------------------------------
   */

  //アプリの動作状態を管理する変数
  const { appState, setAppState } = useAppState(appState_initialValue);

  //エクセルから取得した生徒情報(生徒名簿リストデータ)を格納しておく変数
  const { studentsList, setStudentsList } = useStudentsListState(
    studentsList_initialValue
  );

  //入退室記録のデータを保存しておく変数
  const { attendanceState, setAttendanceState } = useAttendanceState(
    attendanceState_initialValue
  );

  //現在の座席状況を管理する変数
  const { seatsState, setSeatsState } = useSeatsState(seatsState_initialValue);

  //モーダル管理変数
  const [modalState, setModalState] = useState<modalState>(
    modalState_initialValue
  );

  /**
   * function handleEraceAppData()
   *
   * 本日の分の、アプリのローカルデータを完全に削除する
   * ※削除されるのはアプリ起動日1日分のみ
   *
   */
  const handleEraceAppData = async () => {
    console.log("erace");
    await window.electron.ipcRenderer.invoke("handle_eraceAppLocalData");
    setModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        //アプリデータ削除完了
        confirmCode: appConfig.confirmCodeList["2005"],
      },
    });
  };

  /**
   * function handleModalState()
   *
   * モーダルの表示を管理する関数
   * 引数tはactive, nameキーと、モーダルごとに異なるcontentキーを持つオブジェクトとする
   *
   * @param {object} t
   * @returns {void}
   */
  const handleModalState = (t: modalState): void => {
    //t.active = falseだった場合：modalStateをリセットする
    if (!t.active) {
      setModalState(modalState_initialValue);
      return;
    }

    //その他：引数に従ってモーダルを起動
    if (t.active && t.name !== "" && t.content !== {}) {
      setModalState({
        active: true,
        name: t.name,
        content: t.content,
      });
      return;
    }

    //正しく引数が指定されていない場合はエラー
    throw new Error(
      "handleModal argument type error in App.js: you need to include active, name, content properties those are truthy."
    );
  };

  /**
   * function resetAppState()
   *
   * appStateをリセットする関数
   * 引数に何も渡さない場合はappStateの初期値を使って、
   * logが含まれている場合はlogを反映して
   * appStateを上書きする
   * (logの書き換え関数を別途用意しないのは、stateの更新時のマージによるバグを防ぐため)
   *
   * @param {object} arg
   */
  const resetAppState = (arg: {
    mode: "APPLOG" | "DEFAULT";
    content?: any;
  }) => {
    if (arg.mode === "APPLOG") {
      //appLogが渡された場合
      setAppState({
        ...appState_initialValue,
        localConfig: { ...appState.localConfig },
        appLog: arg.content,
      });
    } else {
      //appLogが渡されなかった場合
      setAppState({
        ...appState_initialValue,
        localConfig: { ...appState.localConfig },
      });
    }
  };

  /**
   * function handleSaveAttendanceForEnter()
   *
   * 入室記録を保存する関数
   *
   * @param {string} i : TARGET STUDENT ID (studentsList student.id)
   */
  const handleSaveAttendanceForEnter = (i: string) => {
    if (!attendanceState) {
      return;
    }

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
    appState.selectedElement &&
      appState.selectedElement.classList.add("active");

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

  /**
   * function handleSaveAttendanceForExit()
   *
   * 退室記録を保存する関数
   *
   * @param {string} i : SELECTED SEAT ID
   */
  const handleSaveAttendanceForExit = (i: string) => {
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

    /**
     * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     * エラー！seatsState or attendanceStateが読み込めていません
     * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     */
    if (!seatsState || !attendanceState) {
      return setModalState({
        active: true,
        name: appConfig.modalCodeList["1002"],
        content: {},
      });
    }

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

  /**
   * function handleSeatOperation()
   * @param {object}
   * {
   *    mode: {String},
   *    content: {Object}
   * }
   * @returns
   */
  const handleSeatOperation = (arg: { mode: string; content: any }): void => {
    if (!attendanceState || !seatsState) {
      return;
    }

    console.log("activate fn handleSeatOperation()");

    if (arg.mode === appConfig.seatOperationCodeList["1001"]) {
      const nowSeatID: string = arg.content.nowSeatID;
      const nextSeatID: string = arg.content.nextSeatID;
      const targetID: string = seatsState[arg.content.nowSeatID].studentID;

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

  /**
   * function handleCancelOparation()
   *
   * 一つ前の操作を取り消す関数
   * 今の所、一旦取り消したらもとに戻すことはできないし、
   * 一つ前以上の操作を取り消すことはできない
   *
   * @returns {void}
   */
  const handleCancelOperation = () => {
    if (!attendanceState) {
      return;
    }

    console.log("launching cancel oparation...");

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
          insertObjectForAttendanceState[appState.appLog.studentID].slice(
            -1
          )[0];
        delete lastElem.exit;

        //配列の最後の要素を削除し、先程いじったexitなしオブジェクトを挿入
        insertObjectForAttendanceState[appState.appLog.studentID].pop();
        insertObjectForAttendanceState[appState.appLog.studentID].push(
          lastElem
        );

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

  /**
   * function handleChangeAppLocalConfig()
   *
   * appLocalConfigに保存するデータを変更する
   * 複数項目の変更を考慮し、変更項目と変更内容を格納したオブジェクトを引数に渡す
   *
   * @param {array} args
   *
   * {
   *   target: array
   * }
   */
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
  const handleSeatsState = (d: { [index: string]: any }) =>
    setSeatsState({ ...seatsState, ...d });

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
            // onHandleSeatsState={handleSeatsState}
            onHandleModalState={handleModalState}
            appState={appState}
            seatsState={seatsState as seatsState}
            studentsList={studentsList as studentsList}
          />
        );

      case "STUDENT":
        return (
          <SelectData
            onSaveAttendance={handleSaveAttendanceForEnter}
            onResetAppState={resetAppState}
            onHandleModalState={handleModalState}
            appState={appState}
            studentsList={studentsList as studentsList}
            seatsState={seatsState as seatsState}
          />
        );

      case "CONFIG":
        return (
          <Config
            onHandleStudentFile={setStudentsList}
            onHandleAppState={handleAppState}
            onReadStudentsList={setStudentsList}
            onHandleModalState={handleModalState}
            onHandleChangeAppLocalConfig={handleChangeAppLocalConfig}
            appState={appState}
          />
        );

      default:
        throw new Error(
          "an Error has occured in App.js: unexpected appState.now case"
        );
    }
  };

  /**
   * -------------------------------
   *      useEffect functions
   * -------------------------------
   */

  //生徒情報ファイルが読み込まれていない時は、エラーモーダルを最初に表示
  useEffect(() => {
    if (!studentsList) {
      setModalState({
        active: true,
        name: appConfig.modalCodeList["1002"],
        content: {
          errorCode: appConfig.errorCodeList["1001"],
        },
      });
    } else {
      modalState.active &&
        modalState.name === appConfig.modalCodeList["1002"] &&
        modalState.content.errorCode === appConfig.errorCodeList["1001"] &&
        setModalState({
          active: false,
          name: "",
          content: {},
        });
    }
  }, [studentsList]);

  //バックアップ兼記録ファイル 自動書き出し
  useEffect(() => {
    (async () => {
      //attendanceState書き出し
      attendanceState &&
        (await window.electron.ipcRenderer.invoke("handle_attendanceState", {
          mode: "write",
          data: JSON.stringify(attendanceState),
        }));

      //seatsState書き出し
      seatsState &&
        (await window.electron.ipcRenderer.invoke("handle_seatsState", {
          mode: "write",
          data: JSON.stringify(seatsState),
        }));
    })();
  }, [attendanceState, seatsState]);

  return (
    <div className="App">
      {handleComponent()}
      <ModalWrapper
        onHandleAppState={handleAppState}
        onHandleModalState={handleModalState}
        onSaveForEnter={handleSaveAttendanceForEnter}
        onSaveForExit={handleSaveAttendanceForExit}
        onEraceAppData={handleEraceAppData}
        onCancelOperation={handleCancelOperation}
        onHandleSeatOperation={handleSeatOperation}
        studentsList={studentsList}
        modalState={modalState}
        seatsState={seatsState}
        appState={appState}
      />
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
