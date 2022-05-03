import React from "react";

interface StudentsList {
  onSaveAttendance: (i: string) => void;
  onHandleModalState: (t: modalState) => void;
  onHandleScrollNavigation: () => void;
  activateConfirmModal: (e: React.MouseEvent) => void;
  school: string;
  grade: string;
  seatID: string;
  studentsList: { [index: string]: string }[];
  seatsState: seatsState;
}

const StudentsList: React.VFC<StudentsList> = (props) => {
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
              onClick={props.activateConfirmModal}
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

export { StudentsList };
