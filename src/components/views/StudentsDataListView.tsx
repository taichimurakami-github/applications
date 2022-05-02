import React from "react";
import { appConfig } from "../../app.config";

interface StudentsDataListProps {
  onSaveAttendance: (i: string) => void;
  onHandleModalState: (t: modalState) => void;
  onHandleNav: () => void;
  school: string;
  grade: string;
  seatID: string;
  studentsList: { [index: string]: string }[];
  seatsState: seatsState;
}

const StudentsDataList: React.VFC<StudentsDataListProps> = (props) => {
  const school_ja = [];
  switch (props.school) {
    case "high":
      school_ja.push("高校");
      break;

    case "middle":
      school_ja.push("中学校");
      break;

    case "elementary":
      school_ja.push("小学校");
      break;

    default:
      throw new Error(
        "mismatch exeption has occured in StudentsDataList component"
      );
  }

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
    <div className={"students-list-container"}>
      <h3 className={props.school}>
        {school_ja[0]} {props.grade} 年生の生徒リスト
      </h3>
      <ul className="students-list">
        {props.studentsList.map((val) => {
          return (
            <li
              id={val.id}
              className={"student-data " + props.school}
              onClick={activateConfirmModal}
            >
              <span>{val.name}</span>
              {/* <span>{school_ja} {val.grade} 年生</span> */}
              {/* <span>所属：{val.belongs}</span> */}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export { StudentsDataList };
