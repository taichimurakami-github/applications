import React, { useState, useRef, useContext } from "react";
import { StudentsList } from "../views/StudentsList";
import { appConfig } from "../../app.config";
import { AppStateContext } from "../../AppContainer";
import useEnterRecorder from "../../hooks/controllers/useEnterRecorder";
import StudentCategorySelector from "../views/StudentCategorySelector";

//style imports
import "@styles/modules/StudentDataSelector.scss";

interface StudentDataSelectorStates {
  seat: string;
  school: string;
  grade: string;
  nav: boolean;
}

export const StudentDataSelector: React.VFC = (props) => {
  const categorySelectorContainer = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLDivElement>(null);

  const {
    appState,
    seatsState,
    studentsList,
    resetAppState,
    handleModalState,
  }: AppStateContext = useContext(AppStateContext);

  const enterRecorder = useEnterRecorder();

  const [state, setState] = useState<StudentDataSelectorStates>({
    seat: appState.selectedSeat,
    school: "",
    grade: "",
    nav: false,
  });

  //現在の SelectData stateに基づいて、適当な生徒をStudentsListから取り出して配列として返す
  const getStudentsList = (): { [index: string]: string }[] => {
    const matchData: { [index: string]: string }[] = [];

    studentsList.forEach((val: { [index: string]: string }) => {
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

  const backToTop = () => resetAppState({ mode: "DEFAULT" });

  //関係者用の処理
  const selectOthers = () => {
    enterRecorder("__OTHERS__");
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

    const selected_student_data = studentsList.filter((val) => {
      //val.idがnumber, e.target.idがString
      //returnされるのは配列であり、該当生徒は一人だけなのでreturn valのindex=0を入れる -> [0]
      return val.id === targetElem.id;
    })[0];

    //選ばれた生徒は既に着席しているか？（退席していないか？）
    let isAlreadySeated = false;
    for (let key of Object.keys(seatsState)) {
      seatsState[key].studentID === selected_student_data.id &&
        !isAlreadySeated &&
        (isAlreadySeated = true);
    }

    isAlreadySeated
      ? //退席していない生徒を選択したとき
        //エラーモーダルを起動
        handleModalState({
          active: true,
          name: appConfig.modalCodeList["1002"],
          content: {
            //入出記録前確認
            errorCode: appConfig.errorCodeList["3001"],
            studentData: selected_student_data,
          },
        })
      : //確認モーダルを起動
        handleModalState({
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
      <div className="component-select-student-data-wrapper">
        <StudentCategorySelector
          backToTop={backToTop}
          onSelect={selectStudentsCategory}
          onSelectOthers={selectOthers}
          ref={categorySelectorContainer}
        />

        {state.school !== "" && state.grade !== "" ? (
          <StudentsList
            onSaveAttendance={enterRecorder}
            onHandleModalState={handleModalState}
            onHandleScrollNavigation={handleScrollNavigation}
            activateConfirmModal={activateConfirmModal}
            school={state.school}
            grade={state.grade}
            seatID={appState.selectedSeat}
            studentsList={getStudentsList()}
            seatsState={seatsState}
          />
        ) : undefined}
        <div ref={navigation} className="scroll-nav">
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
      </div>
    </>
  );
};
