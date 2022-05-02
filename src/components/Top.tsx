import React, { useRef } from "react";
import { appConfig } from "../app.config";
import { TopMessage } from "./UI/TopMessage";

interface TopComponentProps {
  appState: appState,
  studentsList: studentsList,
  seatsState: seatsState,
  onHandleAppState: (d: { [index: string]: any }) => void,
  // onHandleSeatState: VoidFunction,
  onHandleModalState: (t: modalState) => void
}

export const Top: React.VFC<TopComponentProps> = (props) => {

  const _fn = useRef(props.appState.localConfig.fn);

  const handleEnter = (e: React.MouseEvent): void => {

    const targetElem = e.target as HTMLLIElement;

    if (props.studentsList === null) return;

    //activeの席をクリックしたときは何もしない
    if (props.seatsState[targetElem.id].active) return;
    // e.target.classList.add("active");

    props.onHandleAppState({
      selectedElement: e.target,
      selectedSeat: targetElem.id,
      now: "STUDENT"
    });
  }

  const handleConfig = () => props.onHandleAppState({ now: "CONFIG" });

  const displayExitModal = () => {
    props.onHandleModalState({
      active: true,
      name: appConfig.modalCodeList["1003"],
      content: {}
    });
  }

  const displayNewsModal = () => {
    props.onHandleModalState({
      active: true,
      name: appConfig.modalCodeList["1004"],
      content: {}
    });
  }

  const displayCancelOperationModal = () => {

    const name = (props.appState.appLog.studentID === "__OTHERS__")
      ? "関係者その他"
      : props.studentsList.filter(
        (val: { [index: string]: string }) =>
          val.id == props.appState.appLog.studentID)[0].name;
    const operation = props.appState.appLog.operation === "enter" ? "入室" : "退室";

    props.onHandleModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        confirmCode: appConfig.confirmCodeList["1004"],
        studentName: name,
        currentOperation: operation,
      }
    });

  }

  return (
    <>
      {
        (props.studentsList === null) ?
          <>
            <h1>現在、アプリの操作ができません。</h1>
            <p>生徒情報が読み込まれていません。</p>
            <p>設定画面を開き、生徒情報ファイルを読み込むと、再びアプリを利用できます。</p>
          </>

          :

          <>
            <h1>使用する座席を選んでください</h1>
            <p>未使用の席から、使用したい席を選ぶと入室操作ができます。下の「座席の操作」から、座席変更、退室操作ができます。</p>
          </>
      }
      <div className="info-container">
        <TopMessage activateNewsModal={displayNewsModal} msg={props.appState.localConfig.msg} />
      </div>
      <div className={props.studentsList === null ? "seat-table-container unactive" : "seat-table-container"}>
        <ul className={"column"}>
          <li id="seat13" className={props.seatsState.seat13.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat13.active ? "使用中" : 13}</li>
          <li id="seat14" className={props.seatsState.seat14.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat14.active ? "使用中" : 14}</li>
          <li id="seat15" className={props.seatsState.seat15.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat15.active ? "使用中" : 15}</li>
          <li id="seat16" className={props.seatsState.seat16.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat16.active ? "使用中" : 16}</li>
        </ul>
        <ul className={"column"}>
          <li id="seat9" className={props.seatsState.seat9.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat9.active ? "使用中" : 9}</li>
          <li id="seat10" className={props.seatsState.seat10.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat10.active ? "使用中" : 10}</li>
          <li id="seat11" className={props.seatsState.seat11.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat11.active ? "使用中" : 11}</li>
          <li id="seat12" className={props.seatsState.seat12.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat12.active ? "使用中" : 12}</li>
        </ul>

        <ul className={"column"}>
          <li id="seat5" className={props.seatsState.seat5.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat5.active ? "使用中" : 5}</li>
          <li id="seat6" className={props.seatsState.seat6.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat6.active ? "使用中" : 6}</li>
          <li id="seat7" className={props.seatsState.seat7.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat7.active ? "使用中" : 7}</li>
          <li id="seat8" className={props.seatsState.seat8.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat8.active ? "使用中" : 8}</li>
        </ul>

        <ul className={"column"}>
          <li id="seat1" className={props.seatsState.seat1.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat1.active ? "使用中" : 1}</li>
          <li id="seat2" className={props.seatsState.seat2.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat2.active ? "使用中" : 2}</li>
          <li id="seat3" className={props.seatsState.seat3.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat3.active ? "使用中" : 3}</li>
          <li id="seat4" className={props.seatsState.seat4.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat4.active ? "使用中" : 4}</li>
        </ul>
      </div>
      <div className="btn-wrapper">
        {
          _fn.current.stable.cancelOperation &&
          <button className={`btn cancel-manipulation-btn ${(props.appState.appLog) ? "active" : "unactive"}`} onClick={displayCancelOperationModal}><span className="cancel-arrow"></span>直前の操作を取り消す</button>
        }
        {
          props.studentsList &&
          <button className="btn activate-exit-btn btn__exit" onClick={displayExitModal}>座席の操作</button>}
        <button className="btn btn__typeC" onClick={handleConfig}>設定画面を開く</button>
      </div>
    </>
  )
}