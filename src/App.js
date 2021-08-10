//module import
import { useEffect, useState, useRef } from 'react';
import { appConfig } from './app.config';
import { Top } from './components/Top';
import { SelectData } from './components/SelectData';
import { ModalWrapper } from "./components/modal/MordalWrapper";
import { Config } from "./components/Config";

//style import
import "./components/styles/components.scss";
import "./components/styles/app.common.scss";

function App() {

  const isFirstReadSeatsStateBCUP = useRef(false);
  const isFirstReadAttendanceStateBCUP = useRef(false);

  //アプリの動作状態を管理する変数
  const [appState, setAppState] = useState({
    selectedElement: null,
    selectedSeat: "",
    now: "TOP",
  });

  //エクセルから取得した生徒情報(生徒名簿リストデータ)を格納しておく変数
  const [studentsList, setStudentsList] = useState(null);

  //入退室記録のデータを保存しておく変数
  const [attendanceState, setAttendanceState] = useState({});

  //現在の座席状況を管理する変数
  const [seatsState, setSeatsState] = useState({
    seat1: {
      active: false,
      studentID: ""
    },
    seat2: {
      active: false,
      studentID: ""
    },
    seat3: {
      active: false,
      studentID: ""
    },
    seat4: {
      active: false,
      studentID: ""
    },
    seat5: {
      active: false,
      studentID: ""
    },
    seat6: {
      active: false,
      studentID: ""
    },
    seat7: {
      active: false,
      studentID: ""
    },
    seat8: {
      active: false,
      studentID: ""
    },
    seat9: {
      active: false,
      studentID: ""
    },
    seat10: {
      active: false,
      studentID: ""
    },
    seat11: {
      active: false,
      studentID: ""
    },
    seat12: {
      active: false,
      studentID: ""
    },
    seat13: {
      active: false,
      studentID: ""
    },
    seat14: {
      active: false,
      studentID: ""
    },
    seat15: {
      active: false,
      studentID: ""
    },
    seat16: {
      active: false,
      studentID: ""
    },
  });

  //モーダル管理変数
  const [modalState, setModalState] = useState({
    active: false,
    modalName: null,
    content: null
  });


  /**
   * function handleModalState()
   * 
   * モーダルの表示を管理する関数
   * 引数tはactive, nameキーと、モーダルごとに異なるcontentキーを持つオブジェクトとする
   * 
   * @param {object} t 
   * @returns {void}
   */
  const handleModalState = (t) => {

    //t.active = falseだった場合：modalStateをリセットする
    if (!t.active) {
      setModalState({
        active: false,
        name: null,
        content: null
      });
      return;
    }

    if (t.active && t.name && t.content) {
      setModalState({
        active: true,
        name: t.name,
        content: t.content
      });
      return;
    }

    throw new Error("handleModal argument type error in App.js: you need to include active, name, content properties those are truthy.");
  };

  const resetAppState = () => setAppState({ selectedElement: null, selectedSeat: "", now: "TOP" });

  /**
   * function handleSaveAttendanceForEnter()
   * 
   * 入室記録を保存する関数
   * 
   * @param {string} i : STUDENT ID (studentsList student.id)
   */
  const handleSaveAttendanceForEnter = (i) => {
    console.log("出席処理を開始します...");

    //席を赤くする
    appState.selectedElement.classList.add("active");
    const obj = {}
    obj[appState.selectedSeat] = (i === "__OTHERS__") ?
      {
        active: true,
        studentID: "__OTHERS__"
      }
      :
      {
        active: true,
        studentID: i
      }

    //seatsStateを更新
    setSeatsState({ ...seatsState, ...obj });

    if (i !== "__OTHERS__") {
      //attendanceStateを更新
      let arr;
      const now = new Date();
      const attendance_data_enter = {
        id: i,
        seatID: appState.selectedSeat,
        enter: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      }

      if (i in attendanceState) {
        //既に同日内に自習室に記録が残っている場合、要素を追加する形で記録
        arr = attendanceState[i].map((val) => { return val })
        console.log(arr);
        arr.push(attendance_data_enter);
      } else {
        //同日内で初めて自習室に来た場合、新しくkeyと配列を作成
        arr = [attendance_data_enter];
      }

      const obj2 = {}
      obj2[i] = arr;

      setAttendanceState({ ...attendanceState, ...obj2 });
    }

    //確認モーダルの表示
    setModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        //入出記録完了
        confirmCode: appConfig.confirmCodeList["2001"],
      }
    });

    resetAppState();
  };

  /**
   * function handleSaveAttendanceForExit()
   * 
   * 退室記録を保存する関数
   * 
   * @param {string} e : SELECTED SEAT ID
   */
  const handleSaveAttendanceForExit = (i) => {
    console.log("退席処理を開始します...");
    const obj = {}
    obj[i] = {
      active: false,
      studentID: ""
    }

    if (seatsState[i].studentID !== "__OTHERS__") {
      //attendanceStateを更新
      const now = new Date();
      const attendance_data_exit = {
        exit: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
      }

      // obj2[i]
      const id = seatsState[i].studentID;
      let arr = attendanceState[id].map((val, index) => {
        return (index == attendanceState[id].length - 1) ? { ...val, ...attendance_data_exit } : val
      })
      const obj2 = {};
      obj2[id] = arr;

      setAttendanceState({ ...attendanceState, ...obj2 });
    }

    setSeatsState({ ...seatsState, ...obj });

    //確認モーダルの表示
    setModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        //退出記録完了
        confirmCode: appConfig.confirmCodeList["2002"],
      }
    });

  }

  //appState, seatStateを変更する
  const handleAppState = (d) => setAppState({ ...appState, ...d });
  const handleSeatsState = (d) => setSeatsState({ ...seatsState, ...d });

  //render()内のComponentを動的に変更する
  const handleComponent = () => {
    switch (appState.now) {
      case "TOP":
        return <Top
          onHandleAppState={handleAppState}
          onHandleSeat={handleSeatsState}
          onHandleModalState={handleModalState}
          seatsState={seatsState}
          studentsList={studentsList}
        />;

      case "STUDENT":
        return <SelectData
          onSaveAttendance={handleSaveAttendanceForEnter}
          onResetAppState={resetAppState}
          onHandleModalState={handleModalState}
          appState={appState}
          studentsList={studentsList}
          seatsState={seatsState}
        />;

      case "CONFIG":
        return <Config
          onHandleStudentFile={setStudentsList}
          onHandleAppState={handleAppState}
          onReadStudentsList={setStudentsList}
          onHandleModalState={handleModalState}
        />;


      default:
        throw new Error("Unexpected appState.now case in App.js");
    }
  };

  /**
   * useEffect functions group
   */

  //起動時に1回だけ行われる処理
  useEffect(async () => {

    //生徒情報ファイルが存在していれば自動読み込み
    const studentsList_autoloadedData = await window.electron.ipcRenderer.invoke("handle_studentsList", { mode: "read" });
    studentsList_autoloadedData && setStudentsList(studentsList_autoloadedData);

    //今日の分のseatsState記録が残っていれば読み込み
    const seatsState_bcup = await window.electron.ipcRenderer.invoke("handle_seatsState", { mode: "read" });
    console.log("read_seatsstate_bcup_result", seatsState_bcup);
    if (seatsState_bcup) {
      setSeatsState(seatsState_bcup);
      isFirstReadSeatsStateBCUP.current = true;
    }

    //今日の分のattendanceState記録が残っていれば読み込み
    const attendanceState_bcup = await window.electron.ipcRenderer.invoke("handle_attendanceState", { mode: "read" });
    console.log("attendanceState_bcup_result", attendanceState_bcup);
    if (attendanceState_bcup) {
      setAttendanceState(attendanceState_bcup);
      isFirstReadAttendanceStateBCUP.current = true;
    }
  }, []);



  //生徒情報ファイルが読み込まれていない時は、エラーモーダルを最初に表示
  useEffect(() => {
    if (!studentsList) {
      setModalState({
        active: true,
        name: appConfig.modalCodeList["1002"],
        content: {
          errorCode: appConfig.errorCodeList["1001"],
          onHandleAppState: handleAppState
        }
      });
    }

    else {
      (
        modalState.active &&
        modalState.name === appConfig.modalCodeList["1002"] &&
        modalState.content.errorCode === appConfig.errorCodeList['1001']
      )
        &&
        setModalState({
          active: false,
          name: null,
          content: null
        });
    }
  }, [studentsList]);

  //バックアップ兼記録ファイル 自動書き出し
  useEffect(async () => {

    //attendanceState書き出し
    isFirstReadAttendanceStateBCUP.current &&
      await window.electron.ipcRenderer
        .invoke("handle_attendanceState", { mode: "write", data: JSON.stringify(attendanceState) });

    //seatsState書き出し
    isFirstReadSeatsStateBCUP.current &&
      await window.electron.ipcRenderer
        .invoke("handle_seatsState", { mode: "write", data: JSON.stringify(seatsState) });

  }, [attendanceState, seatsState]);



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

  return (
    <div className="App">
      {handleComponent()}
      <ModalWrapper
        modalState={modalState}
        onHandleModalState={handleModalState}
        onSaveForEnter={handleSaveAttendanceForEnter}
        onSaveForExit={handleSaveAttendanceForExit}
        studentsList={studentsList}
        seatsState={seatsState}
      />
    </div>
  );
}

export default App;


  //デバッグ用関数群
  // useEffect(() => {
  //   console.log("seatsState checker---------");
  //   console.log(seatsState);
  // }, [seatsState]);
  // useEffect(() =>{
  //   if(studentsList!== null){
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
  // useEffect(()=>{
  //   console.log("attendanceState checker........")
  //   console.log(attendanceState);
  // }, [attendanceState]);