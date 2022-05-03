import React, { useRef } from "react";
import { appConfig } from "../../app.config";
import { SeatsTable } from "../views/SeatsTable";
import { TopMessage } from "../views/TopMessage";

interface TopComponentProps {
  appState: appState;
  studentsList: studentsList;
  seatsState: seatsState;
  onHandleAppState: (d: { [index: string]: any }) => void;
  onHandleModalState: (t: modalState) => void;
}

export const Top: React.VFC<TopComponentProps> = (props) => {
  const _fn = useRef(props.appState.localConfig.fn);

  const showStudentDataSelector = (e: React.MouseEvent): void => {
    const targetElem = e.target as HTMLLIElement;

    if (props.studentsList === null) return;

    //activeの席をクリックしたときは何もしない
    if (props.seatsState[targetElem.id].active) return;

    props.onHandleAppState({
      selectedElement: e.target,
      selectedSeat: targetElem.id,
      now: "STUDENT",
    });
  };

  const showAppConfig = () => props.onHandleAppState({ now: "CONFIG" });

  const showExitModal = () => {
    props.onHandleModalState({
      active: true,
      name: appConfig.modalCodeList["1003"],
      content: {},
    });
  };

  const showNewsModal = () => {
    props.onHandleModalState({
      active: true,
      name: appConfig.modalCodeList["1004"],
      content: {},
    });
  };

  const showCancelOperationModal = () => {
    const name =
      props.appState.appLog.studentID === "__OTHERS__"
        ? "関係者その他"
        : props.studentsList.filter(
            (val: { [index: string]: string }) =>
              val.id == props.appState.appLog.studentID
          )[0].name;
    const operation =
      props.appState.appLog.operation === "enter" ? "入室" : "退室";

    props.onHandleModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        confirmCode: appConfig.confirmCodeList["1004"],
        studentName: name,
        currentOperation: operation,
      },
    });
  };

  return (
    <>
      {props.studentsList === null ? (
        <>
          <h1>現在、アプリの操作ができません。</h1>
          <p>生徒情報が読み込まれていません。</p>
          <p>
            設定画面を開き、生徒情報ファイルを読み込むと、再びアプリを利用できます。
          </p>
        </>
      ) : (
        <>
          <h1>使用する座席を選んでください</h1>
          <p>
            未使用の席から、使用したい席を選ぶと入室操作ができます。下の「座席の操作」から、座席変更、退室操作ができます。
          </p>
        </>
      )}
      <div className="info-container">
        <TopMessage
          activateNewsModal={showNewsModal}
          msg={props.appState.localConfig.msg}
        />
      </div>
      <SeatsTable
        seatsState={props.seatsState}
        onClickFunction={showStudentDataSelector}
      />

      <div className="btn-wrapper">
        {_fn.current.stable.cancelOperation && (
          <button
            className={`btn cancel-manipulation-btn ${
              props.appState.appLog ? "active" : "unactive"
            }`}
            onClick={showCancelOperationModal}
          >
            <span className="cancel-arrow"></span>直前の操作を取り消す
          </button>
        )}
        {props.studentsList && (
          <button
            className="btn activate-exit-btn btn__exit"
            onClick={showExitModal}
          >
            座席の操作
          </button>
        )}
        <button className="btn btn__typeC" onClick={showAppConfig}>
          設定画面を開く
        </button>
      </div>
    </>
  );
};
