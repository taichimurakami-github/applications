//module import
import { useEffect, useState } from 'react';
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

  //エクセルから取得した生徒情報を格納しておく変数
  const [studentsList, setStudentsList] = useState(null);

  //データを保存しておく変数
  const [attendanceState, setAttendanceState] = useState([]);

  //座席状況を管理する変数
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

  const readXLSX = async () => {
    console.log("xlsx");
    const debugInput = document.createElement("input");
    const checkFileTypeList = [".xlsx", ".csv"];

    debugInput.type = "file";
    debugInput.click();
    debugInput.addEventListener("change", e => {
      const file = e.target.files[0];
      
      //ファイルの拡張子をチェック
      for(let val of checkFileTypeList ) {
        console.log(val, file.name.indexOf(val));
        if(file.name.indexOf(val) === -1) return;
      }
      file.arrayBuffer().then((buffer) => {
        const workbook = XLSX.read(buffer, { type: 'buffer', bookVBA: true })
        const firstSheetName = workbook.SheetNames[1]
        const worksheet = workbook.Sheets[firstSheetName]
        const data = XLSX.utils.sheet_to_json(worksheet)

        setStudentsList(data);
      });
    });

  };

  //Modal制御関数
  const handleModalState = (t) => {

    //t.active = falseだった場合：modalStateをリセットする
    if(!t.active){
      setModalState({
        active: false,
        name: null,
        content: null
      });
      return;
    }

    if(t.active && t.name && t.content){
      setModalState({
        active: true,
        name: t.name,
        content: t.content
      });
      return;
    }

    throw new Error("handleModal argument type error in App.js: you need to include active, name, content properties those are truthy.");
  };

  const resetAppState = () => setAppState({ selectedElement: null, selectedSeat: "", now: "TOP"});

  /**
   * 
   * @param {string} i : STUDENT ID (studentsList student.id)
   */
  const handleSaveAttendanceForEnter = (i) => {
    console.log("出席処理を開始...");

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

    if(i !== "__OTHERS__"){
      //attendanceStateを更新
      let arr;
      const now = new Date();
      const attendance_data_enter = {
        id: i,
        seatID: appState.selectedSeat,
        enter:`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      }

      if(i in attendanceState){
        //既に同日内に自習室に記録が残っている場合、要素を追加する形で記録
        arr = attendanceState[i].map((val) => {return val})
        console.log(arr);
        arr.push(attendance_data_enter);
      }else{
        //同日内で初めて自習室に来た場合、新しくkeyと配列を作成
        arr = [attendance_data_enter];
      }

      const obj2 = {}
      obj2[i] = arr;

      setAttendanceState({...attendanceState, ...obj2});
    }

    //確認モーダルの表示
    setModalState({
      active: true,
      name: "CONFIRM",
      content: {
        mode: "SAVE_ATTENDANCE_ENTER_DONE",
      }
    });

    resetAppState();
  };

  /**
   * 
   * @param {string} e : SELECTED SEAT ID
   */
  const handleSaveAttendanceForExit = (i) => {
    console.log("退席処理を開始...");
    const obj = {}
    obj[i] = {
      active: false,
      studentID: ""
    }

    if(seatsState[i].studentID !== "__OTHERS__"){
      //attendanceStateを更新
      const now = new Date();
      const attendance_data_exit = {
        exit: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
      }
      
      // obj2[i]
      const id = seatsState[i].studentID;
      console.log(id);
      let arr = attendanceState[id].map((val, index) => {
        return (index == attendanceState[id].length - 1) ? {...val, ...attendance_data_exit} : val
      })

      // console.log(arr);

      const obj2 = {};
      obj2[id] = arr
      

      setAttendanceState({...attendanceState, ...obj2 });
    }

    setSeatsState({ ...seatsState, ...obj });

    //確認モーダルの表示
    setModalState({
      active: true,
      name: "CONFIRM",
      content: {
        mode: "SAVE_ATTENDANCE_EXIT_DONE"
      }
    });

  }

  //appState, seatStateを変更する
  const handleAppState = (d) => setAppState({ ...appState, ...d });
  const handleSeatsState = (d) => setSeatsState({ ...seatsState, ...d});

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
          onReadXLSX={readXLSX}
          onHandleModalState={handleModalState}
        />;
    }
  };

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

  //生徒情報ファイルが読み込まれていない時は、エラーモーダルを最初に表示
  //このとき、
    useEffect(() => {
      if(studentsList === null){
        setModalState({
          active: true,
          name: "ERROR",
          content: {
            mode: "NOT_READ_STUDENTSLIST_FILE",
            onHandleAppState: handleAppState
          }
        });
      }
    },[studentsList]);


  return (
    <div className="App">
      {handleComponent()}
      <ModalWrapper 
        modalState={modalState}
        onHandleModalState={handleModalState}
        onSaveForEnter={handleSaveAttendanceForEnter}
        onSaveForExit={handleSaveAttendanceForExit}
       />
    </div>
  );
}

export default App;
