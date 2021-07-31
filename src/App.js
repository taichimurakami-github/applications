//module import
import { useEffect, useState } from 'react';
import { appConfig } from './app.config';
import { Top } from './components/Top';
import { SelectData } from './components/SelectData';
import { ModalWrapper } from "./components/modal/MordalWrapper";
import { Config } from "./components/Config";
import XLSX from 'xlsx';

//style import
import "./components/styles/components.scss";
import "./components/styles/app.common.scss";

function App() {


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
   * function readXLSXFileByUser()
   * 
   * xlsx読み込み用関数
   * inputを用いてユーザーが手動で読み込む
   * config専用の関数
   * 
   * @returns {object:Promise}
   */
  const readXLSXFileByUser = async () => {
    console.log("xlsxファイルの読み込みを行ってください。");
    return new Promise((resolve) => {
      const debugInput = document.createElement("input");
      const acceptFileTypeList = [".xlsx", ".csv"];

      debugInput.type = "file";
      debugInput.click();
      debugInput.addEventListener("change", e => {
        const file = e.target.files[0];

        //ファイルの拡張子をチェック
        const fileTypeCheckResult = acceptFileTypeList.filter((val) => {
          return file.name.indexOf(val) !== -1;
        });

        if (fileTypeCheckResult.length === 0) {
          setModalState({
            active: true,
            name: appConfig.modalCodeList["1002"],
            content: {
              errorCode: appConfig.errorCodeList["2001"],
              onHandleAppState: handleAppState,
            },
          });
        }

        file.arrayBuffer().then((buffer) => {
          const workbook = XLSX.read(buffer, { type: 'buffer', bookVBA: true })
          const firstSheetName = workbook.SheetNames[1]
          const worksheet = workbook.Sheets[firstSheetName]
          const data = XLSX.utils.sheet_to_json(worksheet)

          setStudentsList(data);

          setModalState({
            active: true,
            name: appConfig.modalCodeList["1001"],
            content: {
              confirmCode: appConfig.confirmCodeList["2003"],
              onHandleAppState: handleAppState,
            },
          });
        });

        //return Promise.resolve
        return resolve();
      });
    })
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
        />;

      case "CONFIG":
        return <Config
          onHandleStudentFile={setStudentsList}
          onHandleAppState={handleAppState}
          onReadXLSX={readXLSXFileByUser}
          onHandleModalState={handleModalState}
        />;


      default:
        throw new Error("Unexpected appState.now case in App.js");
    }
  };



  //生徒情報ファイルが読み込まれていない時は、エラーモーダルを最初に表示
  useEffect(() => {
    if (studentsList === null) {
      setModalState({
        active: true,
        name: appConfig.modalCodeList["1002"],
        content: {
          errorCode: appConfig.errorCodeList["1001"],
          onHandleAppState: handleAppState
        }
      });
    }

    else if (studentsList !== null) {
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


  //attendanceファイルを自動で書き出し
  useEffect(async () => {
    (Object.keys(attendanceState).length > 0) &&
      await window.electron.ipcRenderer
        .invoke("write_attendance_json", JSON.stringify(attendanceState));
  }, [attendanceState]);

  //seatsStateファイルを自動で書き出し
  useEffect(() => {
    console.log("changed seatsState");
    console.log(seatsState);
    window.electron.ipcRenderer
      .invoke("handle_seatsState", { mode: "write", data: JSON.stringify(seatsState) });
  }, [seatsState]);

  //起動時に1回だけ行われる処理
  useEffect(async () => {
    setStudentsList(
      await window.electron.ipcRenderer
        .invoke("read_studentsList_xlsx")
    );

    //今日の分のattendanceState記録が残っていれば読み込み
    setAttendanceState(
      await window.electron.ipcRenderer
        .invoke("read_attendance_json")
    );

    const seatsState_bcup = await window.electron.ipcRenderer.invoke("handle_seatsState", { mode: "read" })
    seatsState_bcup && setSeatsState(seatsState_bcup);
  }, []);


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