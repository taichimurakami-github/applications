import { useState, useRef } from "react";
import {StudentsDataList} from "./StudentsDataLists";

export const SelectData = (props) => {
  const selectorContainer = useRef();
  const navigation = useRef();

  const [state, setState] = useState(
    {
      seat: props.appState.selectedSeat,
      school: "",
      grade: "",
      nav: false,
    }
  );

  //モーダル管理変数
  const [modalState, setModalState] = useState({
    active: false,
    modalName: null,
    content: null
  });

  //Modal制御関数
  const handleModalState = (t) => {
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

  //現在の SelectData stateに基づいて、適当な生徒をStudentsListから取り出して配列として返す
  const generateStudentsList = () => {
    const matchData = [];
    props.studentsList.forEach((val) => {
      return (val.school === state.school && val.grade === state.grade) && matchData.push(val);
    });
    return matchData;
  }

  const handleNavigation = () => {
    navigation.current.classList.remove("active");
    navigation.current.classList.add("active");
  }
  
  //名簿表示用コンポーネントの制御
  const handleComponent = () => {

    //scool, grade両方が登録されているときのみ、登録生徒情報を表示
    return (state.school !== "" && state.grade !== "") ? 
    
    <StudentsDataList
      onSaveAttendance={props.onSaveAttendance} 
      onHandleModalState={props.onHandleModalState}
      onHandleNav={handleNavigation}
      school={state.school} 
      grade={state.grade} 
      seatID={props.appState.selectedSeat} 
      studentsList={generateStudentsList()}  
    />

    :

    undefined;
  };

  //関係者用の処理
  const handleOthers = () => {
    const e = "__OTHERS__";
    props.onSaveAttendance(e);
  }

  //生徒用の処理
  const handleStudentList = (e) => {
    handleNavigation();
    const selectedData = e.target.id.split("-");
    const school = selectedData[0];
    const grade = Number(selectedData[1]);

    //学年セレクトボタンからactiveクラスを除外
    selectorContainer.current.childNodes.forEach(val => {
      val.classList.remove("active");
    });
    //クリック対象にactiveを追加
    e.target.classList.add("active");

    setState({ ...state, school: school, grade: grade});
  }

  return (
    <div className="component-select-student-data-wrapper">
      <h1>あなたの学年と名前を選んでください</h1>
      <p>まずは学年を選びましょう。その後、表示された名簿リストから、あなたの名前を選んでください。</p>
      <button onClick={props.onResetAppState} className="btn retry-btn btn__typeA">前のページに戻る</button>
      <div ref={selectorContainer} className="grade-selector">
        <button onClick={handleStudentList} className="btn" id="middle-1">中学１年生</button>
        <button onClick={handleStudentList} className="btn" id="middle-2">中学２年生</button>
        <button onClick={handleStudentList} className="btn" id="middle-3">中学３年生</button>
        <button onClick={handleStudentList} className="btn" id="high-1">高校１年生</button>
        <button onClick={handleStudentList} className="btn" id="high-2">高校２年生</button>
        <button onClick={handleStudentList} className="btn" id="high-3">高校３年生</button>
        <button onClick={handleStudentList} className="btn" id="elementary-1">小学１年生</button>
        <button onClick={handleStudentList} className="btn" id="elementary-2">小学２年生</button>
        <button onClick={handleStudentList} className="btn" id="elementary-3">小学３年生</button>
        <button onClick={handleStudentList} className="btn" id="elementary-4">小学４年生</button>
        <button onClick={handleStudentList} className="btn" id="elementary-5">小学５年生</button>
        <button onClick={handleStudentList} className="btn" id="elementary-6">小学６年生</button>
        <button onClick={handleOthers} className="btn" id="others">その他関係者</button>
      </div>
      {handleComponent()}
      <div ref={navigation} className="scroll-nav">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
      </div>
    </div>
  );
}