import { appConfig } from "../../app.config";
import { useState } from "react";
import { SeatsTable } from "../UI/SeatsTable";

import "../styles/modules/Top.scss";

const StudentsList = (props) => {
  return (
    <ul className="exit-modal-container">
      <li className="active-seat-user">
        <span>席番号</span>
        <span>お名前</span>
        <span>入室時刻</span>
      </li>
      {props.generateStudentsList()}
    </ul>
  )
}

const SelectNewSeat = (props) => {
  const onHandleSelectSeat = (e) => {
    props.onHandleChangeSeat({
      nextSeatID: e.target.id
    });
  }

  return (
    <div className="exit-modal-container">
      <SeatsTable
        seatsState={props.seatsState}
        onClickFunction={onHandleSelectSeat}
      />
    </div>
  )
}

const SeatsModal = (props) => {

  const [seatsModalState, setSeatsModalState] = useState({
    mode: appConfig.seatsModalModeList["1001"],
    content: {
      nowSeatID: null,
    }
  });

  const handleExit = (e) => {
    // console.log(e.target.id);
    // props.onSaveForExit(e.target.id);
    props.onHandleModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        confirmCode: appConfig.confirmCodeList["1002"],
        targetID: e.target.parentNode.id,
      }
    });
  }

  const activateSelectSeat = (e) => {
    console.log(e.target.parentNode.id);
    setSeatsModalState({
      mode: appConfig.seatsModalModeList["1002"],
      content: {
        nowSeatID: e.target.parentNode.id,
      }
    });
  }

  const handleChangeSeat = (arg) => {
    const nowSeatID = seatsModalState.content.nowSeatID;
    const nextSeatID = arg.nextSeatID;
    console.log(nowSeatID, " >> ", nextSeatID);

    props.onHandleSeatOperation({
      mode: appConfig.seatOperetionCodeList["1001"],
      content: {
        nowSeatID: seatsModalState.content.nowSeatID,
        nextSeatID: arg.nextSeatID
      }
    });
  }

  const generateStudentsList = () => {
    const seats = props.seatsState;
    const activeSeatList = [];
    const othersList = [];

    //active状態の席IDを配列に格納
    for (let key in props.seatsState) {
      //埋まっている席番号を格納
      seats[key].active && activeSeatList.push(key);
      
      //関係者がいたら別配列でも監視
      seats[key].studentID === "__OTHERS__" && othersList.push(key);
    }

    if(activeSeatList[0]){
    //active状態の席一つひとつに対し、
    //その席に登録されている生徒IDからstudentsListを検索し、該当する要素を返す
    //valは席IDの文字列
      return activeSeatList.map((val) => {
        let result;

        //関係者が存在したら
        if(seats[val].studentID === "__OTHERS__"){
          result = [{
            id: "__OTHERS__",
            name: "関係者等(記録されません)",
            school: null,
            grade: null,
            belongs: null
          }];
        }
        else{
          //生徒IDが一致する生徒情報をデータシートのデータより取得
          result = props.studentsList.filter(elem => {
            return elem.id == seats[val].studentID;
          });
        }
        
        return <li id={val} key={val} className="active-seat-user">
          <span>{val.slice(4)}</span>
          <span>{result[0].name}</span>
          <span>10:00</span>
          <button onClick={activateSelectSeat}>座席を移動</button>
          <button onClick={handleExit}>退室する</button>
        </li>
      });
    }
    else{
      //activeSeatsが存在しない
      return <li className="no-close">現在使用されている席はありません。</li>
    }

  };


  return (
    <div className="exit-modal-wrapper">
      {
        seatsModalState.mode === appConfig.seatsModalModeList["1001"]
          && 
        <StudentsList
          generateStudentsList={generateStudentsList}
        />
      }

      {
        seatsModalState.mode === appConfig.seatsModalModeList["1002"]
          &&
        <SelectNewSeat
          seatsState={props.seatsState}
          onHandleChangeSeat={handleChangeSeat}
        />
      }
    </div>
  


  )
}

export {SeatsModal};