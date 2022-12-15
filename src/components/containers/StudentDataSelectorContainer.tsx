import React, { useState, useRef } from "react";
import { StudentsList } from "~/components/views/StudentsList";
import { appConfig } from "~/app.config";
import useEnterRecorder from "~/hooks/controllers/useEnterRecorder";
import StudentCategorySelector from "~/components/views/StudentCategorySelector";

//style imports
import "~styles/modules/StudentDataSelector.scss";
import { ScrollAnimation } from "../views/ScrollAnimation";
import {
  useAppSetStateCtx,
  useAppStateCtx,
  useSeatsStateCtx,
  useStudentsListCtx,
} from "~/hooks/states/useAppContext";

export const StudentDataSelectorContainer = () => {
  const appState = useAppStateCtx();
  const seatsState = useSeatsStateCtx();
  const studentsList = useStudentsListCtx();
  const { resetAppState, handleModalState } = useAppSetStateCtx();
  const enterRecorder = useEnterRecorder();

  const [state, setState] = useState({
    seat: appState.selectedSeat,
    school: "",
    grade: "",
    nav: false,
  });
  const categorySelectorContainer = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

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
    navigationRef.current?.classList.remove("active");
    navigationRef.current?.classList.add("active");
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
      seatsState[key].studentId === selected_student_data.id &&
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

  const getJapaneseSchoolName = (schoolName: string) => {
    switch (schoolName) {
      case "high":
        return "高校";

      case "middle":
        return "中学校";

      case "elementary":
        return "小学校";

      default:
        throw new Error("E_INVALID_SCHOOLNAME: 学校IDが不正です");
    }
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
            school={getJapaneseSchoolName(state.school)}
            grade={state.grade}
            seatID={appState.selectedSeat}
            studentsList={getStudentsList()}
            seatsState={seatsState}
          />
        ) : undefined}

        <ScrollAnimation ref={navigationRef}></ScrollAnimation>
      </div>
    </>
  );
};
