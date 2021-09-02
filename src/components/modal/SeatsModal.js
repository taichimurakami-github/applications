import { appConfig } from "../../app.config";
import { useState } from "react";
import { SeatsTable } from "../UI/SeatsTable";

import "../styles/modules/Top.scss";
import closeButtonIcon from "../../images/close-button.svg";

const StudentsList = (props) => {
  return (
    <>
      <nav className="active-seat-navigation">
          <b>席番号</b>
          <b>お名前</b>
          <b>入室時刻</b>
          <button className="btn btn__close" onClick={props.onCloseModal}>
            <img className="close-button-icon" src={closeButtonIcon} />
            閉じる
          </button>
      </nav>
      <ul className="seats-modal-container scroll">
        {props.generateStudentsList()}
      </ul>  
   </>
  )
}

const SelectNewSeat = (props) => {
  const onHandleSelectSeat = (e) => {
    props.onHandleChangeSeat({
      nextSeatID: e.target.id
    });
  }


  return (
    <div className="seats-modal-container">
      <nav className="title-nav active-seat-navigation">
        <h2>移動先の座席を選んでください</h2>
        <button className="btn btn__close" onClick={props.onHandleGoBack}>
            戻る
        </button>
      </nav>
      <p>使用されていない座席の中から、移動先の座席を選択してください</p>
      <SeatsTable
        seatsState={props.seatsState}
        onClickFunction={onHandleSelectSeat}
      />

    </div>
  )
}


const seatsModalState_initialValue = {
  mode: appConfig.seatsModalModeList["1001"],
  content: {
    nowSeatID: null,
  }
}

const SeatsModal = (props) => {
  const [seatsModalState, setSeatsModalState] = useState(seatsModalState_initialValue);

  const closeModal = () => props.onCloseModal(true);

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

  const handleReset = () => setSeatsModalState(seatsModalState_initialValue);

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

        //関係者が座っている席の場合
        if(seats[val].studentID === "__OTHERS__"){
          result = [{
            id: "__OTHERS__",
            name: "関係者等(記録されません)",
            grade: null,
            school: null,
            belongs: null,
          }];
        }
        else{
          //生徒IDが一致する生徒情報をデータシートのデータより取得
          result = props.studentsList.filter(elem => {
            return elem.id == seats[val].studentID;
          });
        }
        
        //取得した入室時間を、表示する形式に変換
        //一桁の数字だったときは、0を先頭に追加
        let enteredTime = seats[val].enterTime.split(':').map((val, index) => {
          return (val.length === 2) ? val : "0" + val;
        });
        console.log(enteredTime);
        return <li id={val} key={val} className="active-seat-user">
          <span className="seat-id">{val.slice(4)}</span>
          <span className="student-name">{result[0].name}</span>
          <span className="entered-time">{enteredTime.join(" : ")}</span>
          <button className="btn btn-change-seat btn__typeC" onClick={activateSelectSeat}>座席を移動</button>
          <button className="btn btn-exit btn__typeC" onClick={handleExit}>退室する</button>
        </li>
      })
    }
    else{
      //activeSeatsが存在しない
      return <li className="all-seats-unactive">現在使用されている席はありません。</li>
    }

  };


  return (
    <div className="seats-modal-wrapper">
      {
        seatsModalState.mode === appConfig.seatsModalModeList["1001"]
          && 
        <StudentsList
          generateStudentsList={generateStudentsList}
          onCloseModal={closeModal}
        />
      }

      {
        seatsModalState.mode === appConfig.seatsModalModeList["1002"]
          &&
        <SelectNewSeat
          seatsState={props.seatsState}
          onHandleGoBack={handleReset}
          onHandleChangeSeat={handleChangeSeat}
        />
      }

      
    </div>
  


  )
}

export {SeatsModal};