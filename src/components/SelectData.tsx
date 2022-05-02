import React, { useState, useRef } from "react";
import { StudentsDataList } from "./StudentsDataLists";

//style imports
import "./styles/modules/StudentData.scss";

interface SelectDataProps {
  onSaveAttendance: (i: string) => void,
  onResetAppState: (arg: { mode: "APPLOG" | "DEFAULT"; content?: any; }) => void,
  onHandleModalState: (t: modalState) => void,
  appState: appState,
  studentsList: studentsList,
  seatsState: seatsState
}

interface SelectData_ComponentState {
  seat: string,
  school: string,
  grade: string,
  nav: boolean,
}

export const SelectData: React.VFC<SelectDataProps> = (props) => {
  const selectorContainer = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<SelectData_ComponentState>(
    {
      seat: props.appState.selectedSeat,
      school: "",
      grade: "",
      nav: false,
    }
  );

  //現在の SelectData stateに基づいて、適当な生徒をStudentsListから取り出して配列として返す
  const generateStudentsList = (): { [index: string]: string }[] => {
    const matchData: { [index: string]: string }[] = [];

    props.studentsList.forEach((val: { [index: string]: string }) => {
      return (val.school === state.school && val.grade === state.grade) && matchData.push(val);
    });

    return matchData;
  }

  const handleNavigation = () => {
    navigation.current?.classList.remove("active");
    navigation.current?.classList.add("active");
  }

  const handleBackToTop = () => props.onResetAppState({ mode: "DEFAULT" });

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
        seatsState={props.seatsState}
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
  const handleStudentList = (e: React.MouseEvent) => {
    handleNavigation();
    const targetElem = e.target as HTMLButtonElement;
    const selectedData = targetElem.id.split("-");
    const school = selectedData[0];
    const grade = selectedData[1];

    //学年セレクトボタンからactiveクラスを除外
    selectorContainer.current?.childNodes.forEach((val) => {
      const selectorButton = val as HTMLButtonElement;
      selectorButton.classList.remove("active");
    });
    //クリック対象にactiveを追加
    targetElem.classList.add("active");

    setState({ ...state, school: school, grade: grade });
  }

  return (
    <div className="component-select-student-data-wrapper">
      <h1>あなたの学年と名前を選んでください</h1>
      <p>まずは学年を選びましょう。その後、表示された名簿リストから、あなたの名前を選んでください。</p>
      <button onClick={handleBackToTop} className="btn retry-btn btn__typeC">前のページに戻る</button>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5" /></svg>
      </div>
    </div>
  );
}