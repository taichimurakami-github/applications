import React, { useState, useRef } from "react";
import { StudentsList } from "../views/StudentsList";
import { appConfig } from "../../app.config";

//style imports
import "../styles/modules/StudentData.scss";
import StudentCategorySelector from "../views/StudentCategorySelector";

interface StudentDataSelectorProps {
  onSaveAttendance: (i: string) => void;
  onResetAppState: (arg: { mode: "APPLOG" | "DEFAULT"; content?: any }) => void;
  onHandleModalState: (t: modalState) => void;
  appState: appState;
  studentsList: studentsList;
  seatsState: seatsState;
}

interface StudentDataSelectorStates {
  seat: string;
  school: string;
  grade: string;
  nav: boolean;
}

export const StudentDataSelector: React.VFC<StudentDataSelectorProps> = (
  props
) => {
  const categorySelectorContainer = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<StudentDataSelectorStates>({
    seat: props.appState.selectedSeat,
    school: "",
    grade: "",
    nav: false,
  });

  //現在の SelectData stateに基づいて、適当な生徒をStudentsListから取り出して配列として返す
  const getStudentsList = (): { [index: string]: string }[] => {
    const matchData: { [index: string]: string }[] = [];

    props.studentsList.forEach((val: { [index: string]: string }) => {
      return (
        val.school === state.school &&
        val.grade === state.grade &&
        matchData.push(val)
      );
    });

    return matchData;
  };

  const handleScrollNavigation = () => {
    navigation.current?.classList.remove("active");
    navigation.current?.classList.add("active");
  };

  const backToTop = () => props.onResetAppState({ mode: "DEFAULT" });

  //関係者用の処理
  const selectOthers = () => {
    const e = "__OTHERS__";
    props.onSaveAttendance(e);
  };

  //生徒用の処理
  const selectStudentsCategory = (e: React.MouseEvent) => {
    handleScrollNavigation();
    const targetElem = e.target as HTMLButtonElement;
    const selectedData = targetElem.id.split("-");
    const school = selectedData[0];
    const grade = selectedData[1];

    //学年セレクトボタンからactiveクラスを除外
    categorySelectorContainer.current?.childNodes.forEach((val) => {
      const selectorButton = val as HTMLButtonElement;
      selectorButton.classList.remove("active");
    });
    //クリック対象にactiveを追加
    targetElem.classList.add("active");

    setState({ ...state, school: school, grade: grade });
  };

  const activateConfirmModal = (e: React.MouseEvent) => {
    const targetElem = e.target as HTMLLIElement;

    const selected_student_data = props.studentsList.filter((val) => {
      //val.idがnumber, e.target.idがString
      //returnされるのは配列であり、該当生徒は一人だけなのでreturn valのindex=0を入れる -> [0]
      return val.id === targetElem.id;
    })[0];

    //選ばれた生徒は既に着席しているか？（退席していないか？）
    let isAlreadySeated = false;
    for (let key of Object.keys(props.seatsState)) {
      props.seatsState[key].studentID === selected_student_data.id &&
        !isAlreadySeated &&
        (isAlreadySeated = true);
    }

    isAlreadySeated
      ? //退席していない生徒を選択したとき
        //エラーモーダルを起動
        props.onHandleModalState({
          active: true,
          name: appConfig.modalCodeList["1002"],
          content: {
            //入出記録前確認
            errorCode: appConfig.errorCodeList["3001"],
            studentData: selected_student_data,
          },
        })
      : //確認モーダルを起動
        props.onHandleModalState({
          active: true,
          name: appConfig.modalCodeList["1001"],
          content: {
            //入出記録前確認
            confirmCode: appConfig.confirmCodeList["1001"],
            targetID: targetElem.id,
            targetData: selected_student_data,
          },
        });
  };

  return (
    <>
      <StudentCategorySelector
        backToTop={backToTop}
        onSelect={selectStudentsCategory}
        onSelectOthers={selectOthers}
        ref={categorySelectorContainer}
      />

      <div ref={navigation} className="scroll-nav">
        {state.school !== "" && state.grade !== "" ? (
          <StudentsList
            onSaveAttendance={props.onSaveAttendance}
            onHandleModalState={props.onHandleModalState}
            onHandleScrollNavigation={handleScrollNavigation}
            activateConfirmModal={activateConfirmModal}
            school={state.school}
            grade={state.grade}
            seatID={props.appState.selectedSeat}
            studentsList={getStudentsList()}
            seatsState={props.seatsState}
          />
        ) : undefined}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </>
  );
};
