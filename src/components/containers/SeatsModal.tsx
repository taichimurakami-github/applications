import { appConfig } from "../../app.config";
import React, { useContext, useState } from "react";
import { SeatsTable } from "../views/SeatsTable";

import "~styles/modules/Top.scss";
import closeButtonIcon from "../../images/close-button.svg";
import { AppStateContext } from "../../AppContainer";
import useSeatsController from "../../hooks/controllers/useSeatsController";

const seatsModalState_initialValue: {
  mode: string;
  content: {
    nowSeatID: string;
  };
} = {
  mode: appConfig.seatsModalModeList["1001"],
  content: {
    nowSeatID: "",
  },
};

const SeatsModal = (props: {
  onCloseModal: () => void;
  onHandleBgClose: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { seatsState, studentsList, handleModalState }: AppStateContext =
    useContext(AppStateContext);
  const seatsController = useSeatsController();

  const [seatsModalState, setSeatsModalState] = useState(
    seatsModalState_initialValue
  );

  const handleExit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // e.preventDefault();
    //親要素のLi Elementを取得
    const targetLIElement = e.currentTarget.parentNode as HTMLLIElement;

    handleModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        confirmCode: appConfig.confirmCodeList["1002"],
        targetID: targetLIElement.id,
      },
    });
  };

  const handleReset = () => setSeatsModalState(seatsModalState_initialValue);

  const activateSelectSeat = (e: React.MouseEvent) => {
    const targetButtonElement = e.target as HTMLButtonElement;
    const targetLIElement = targetButtonElement.parentNode as HTMLLIElement;

    setSeatsModalState({
      mode: appConfig.seatsModalModeList["1002"],
      content: {
        nowSeatID: targetLIElement.id,
      },
    });
  };

  const handleChangeSeat = (nextSeatID: string) => {
    const nowSeatID = seatsModalState.content.nowSeatID;
    console.log(nowSeatID, " >> ", nextSeatID);

    seatsController({
      mode: appConfig.seatOperationCodeList["1001"],
      content: {
        nowSeatID: seatsModalState.content.nowSeatID,
        nextSeatID: nextSeatID,
      },
    });
  };

  /**
   *
   * //////////////////////////////
   *
   * !!! getAttendedStudentsList() 関数にissue#6のバグの原因ありそう !!!
   *
   * //////////////////////////////
   *
   */
  const getAttendedStudentsList = () => {
    const seats = seatsState;
    const activeSeatList = [];
    const othersList = [];

    //active状態の席IDを配列に格納
    for (let key in seatsState) {
      //埋まっている席番号を格納
      seats[key].active && activeSeatList.push(key);

      //関係者がいたら別配列でも監視
      seats[key].studentId === "__OTHERS__" && othersList.push(key);
    }

    if (activeSeatList.length > 0 && activeSeatList[0]) {
      //active状態の席一つひとつに対し、
      //その席に登録されている生徒IDからstudentsListを検索し、該当する要素を返す
      //valは席IDの文字列
      return activeSeatList.map((val) => {
        let result: TStudentsList;

        //関係者が座っている席の場合
        if (seats[val].studentId === "__OTHERS__") {
          result = [
            {
              id: "__OTHERS__",
              name: "関係者等(記録されません)",
              grade: "",
              school: "",
              belongs: "",
            },
          ];
        } else {
          //生徒IDが一致する生徒情報をデータシートのデータより取得
          result = studentsList.filter((elem) => {
            return elem.id == seats[val].studentId;
          });
        }

        console.log("seats check:", seats[val]);
        //取得した入室時間を、表示する形式に変換
        //一桁の数字だったときは、0を先頭に追加
        let enteredTime = seats[val].enterTime.split(":").map((val, index) => {
          return val.length === 2 ? val : "0" + val;
        });

        return (
          <li id={val} key={val} className="active-seat-user">
            <span className="seat-id">{val.slice(4)}</span>
            <span className="student-name">{result[0].name}</span>
            <span className="entered-time">{enteredTime.join(" : ")}</span>
            <button
              className="btn btn-change-seat btn__typeC"
              onClick={activateSelectSeat}
            >
              座席を移動
            </button>
            <button className="btn btn-exit btn__typeC" onClick={handleExit}>
              退室する
            </button>
          </li>
        );
      });
    } else {
      //activeSeatsが存在しない
      return (
        <li className="all-seats-unactive">
          現在使用されている席はありません。
        </li>
      );
    }
  };

  return (
    <div className="seats-modal-wrapper">
      {seatsModalState.mode === appConfig.seatsModalModeList["1001"] && (
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
            {getAttendedStudentsList()}
          </ul>
        </>
      )}

      {seatsModalState.mode === appConfig.seatsModalModeList["1002"] && (
        <div className="seats-modal-container">
          <nav className="title-nav active-seat-navigation">
            <h2>移動先の座席を選んでください</h2>
            <button className="btn btn__close" onClick={handleReset}>
              戻る
            </button>
          </nav>
          <p>使用されていない座席の中から、移動先の座席を選択してください。</p>
          <SeatsTable
            seatsState={seatsState}
            onClickFunction={(e) => {
              handleChangeSeat(e.target.id);
            }}
          />
        </div>
      )}
    </div>
  );
};

export { SeatsModal };
