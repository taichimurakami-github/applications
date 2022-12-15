import React from "react";
import "~styles/modules/StudentDataSelector.scss";

const StudentsList = (props: {
  onSaveAttendance: (i: string) => void;
  onHandleModalState: (t: TModalState) => void;
  onHandleScrollNavigation: () => void;
  activateConfirmModal: (e: React.MouseEvent) => void;
  school: "高校" | "中学校" | "小学校";
  grade: string;
  seatID: string;
  studentsList: { [index: string]: string }[];
  seatsState: TSeatsState;
}) => {
  return (
    <div className={"students-list-container"}>
      <h3 className={props.school}>
        {props.school} {props.grade} 年生の生徒リスト
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
