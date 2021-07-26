import { appConfig } from "../app.config";
import { ModalWrapper } from "./modal/MordalWrapper";

const StudentsDataList = (props) => {
  const school_ja = [];
  switch(props.school){
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
      throw new Error("mismatch exeption has occured in StudentsDataList component");
  }

  const activateConfirmModal = (e) => {
    const selected_student_data = props.studentsList.filter((val) => {
      return val.id == e.target.id
    })

    //確認モーダルを起動
    props.onHandleModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        //入出記録前確認
        confirmCode: appConfig.confirmCodeList["1001"],
        targetID: e.target.id,
        val: selected_student_data[0]
      }
    })
  }

  return (
    <div className={"students-list-container"}>
      <h3 className={props.school}>{school_ja[0]}{props.grade}年生の生徒リスト</h3>
      <ul className="students-list">
      {props.studentsList.map((val) => {
          return (
            <li id={val.id} className={"student-data " + props.school} onClick={activateConfirmModal}>
              <span>{val.name}</span>
              <span>{val.school}, grade: {val.grade}</span>
              <span>所属：{val.belongs}</span>
            </li>
          )
      })}
      </ul>
    </div>
  )
}


export {StudentsDataList};