import { useContext } from "react";
import { appConfig } from "../../app.config";
import { AppStateContext } from "../../AppContainer";
import useCancelController from "../../hooks/controllers/useCancelController";
import useEnterRecorder from "../../hooks/controllers/useEnterRecorder";
import useExitRecorder from "../../hooks/controllers/useExitRecorder";

interface ConfirmModalProps {
  content: modalStateContents;
  onCloseModal: () => void;
  onHandleBgClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmModal: React.VFC<ConfirmModalProps> = (props) => {
  const { seatsState, studentsList, resetAppState }: AppStateContext =
    useContext(AppStateContext);
  const enterRecorder = useEnterRecorder();
  const exitRecorder = useExitRecorder();
  const cancelController = useCancelController();
  const closeModal = () => props.onCloseModal();

  const getStudentInfoFromStudentID = (studentID: string) => {
    if (!studentsList) {
      return console.log("studentsList null");
    }

    return studentID !== "__OTHERS__"
      ? studentsList.filter((val: { [index: string]: string }) => {
          return val.id == studentID;
        })[0]
      : { id: "__OTHERS__", name: "(関係者その他)" };
  };

  const handleComponent = () => {
    switch (props.content.confirmCode) {
      //入室処理を実行
      case appConfig.confirmCodeList["1001"]:
        return (
          <div className="enter-confirm-selector-container">
            <p>
              本当に {props.content.targetData?.name} さんでよろしいですか？
            </p>
            <p>「はい」を押すと入室します</p>
            <button
              className="btn btn__yes"
              onClick={() => {
                enterRecorder(props.content.targetID);
              }}
            >
              はい
            </button>
            <button className="btn btn__no" onClick={closeModal}>
              いいえ
            </button>
          </div>
        );

      //退室処理を実行
      case appConfig.confirmCodeList["1002"]:
        if (!seatsState) {
          console.log("studentsList null");
          return undefined;
        }

        //処理を実行する準備を行う
        //まず、処理を実行する生徒IDをseatsStateより取り出す
        //関係者の場合は特殊パターンとして別途オブジェクトを作成する

        //undefinedが渡された場合はエラーチェック（Typescriptでは必要）
        if (props.content.targetID === undefined)
          throw new Error("invalid props.content.targetID value: undefined");

        const targetInfo = getStudentInfoFromStudentID(
          seatsState[props.content.targetID].studentID
        );

        // console.log(targetInfo);
        //確認モーダルの中身
        return (
          <div className="exit-confirm-selector-container">
            <p>本当に {targetInfo?.name} さんでよろしいですか？</p>
            <p>「はい」を押すと退室します</p>
            <button
              className="btn btn__yes"
              onClick={() => {
                //TOP画面に遷移
                resetAppState({ mode: "DEFAULT" });
                exitRecorder(props.content.targetID);
              }}
            >
              はい
            </button>
            <button className="btn btn__no" onClick={closeModal}>
              いいえ
            </button>
          </div>
        );

      //アプリのデータを完全に削除する
      case appConfig.confirmCodeList["1003"]:
        return (
          <>
            <p>今日1日分のアプリ内部データを完全に削除します。</p>
            <p>※この機能はアプリの動作が不安定な場合のみ使用してください※</p>
            <p>一度削除したデータはもとに戻せません。本当によろしいですか？</p>

            <button className="btn btn__yes" onClick={cancelController}>
              はい
            </button>
            <button className="btn btn__no" onClick={closeModal}>
              いいえ
            </button>
          </>
        );

      //直前の操作を取り消す
      case appConfig.confirmCodeList["1004"]:
        return (
          <>
            <p>直前の操作を取り消しますか？</p>
            <p className="current-operation">
              直前の操作：<b>{props.content.studentName}</b>さんが
              <b>{props.content.currentOperation}</b>しました
            </p>
            <p>※一度取り消すと元に戻せません</p>
            <button className="btn btn__yes" onClick={cancelController}>
              はい
            </button>
            <button className="btn btn__no" onClick={closeModal}>
              いいえ
            </button>
          </>
        );

      //着席している生徒全員の
      case appConfig.confirmCodeList["1005"]:
        return (
          <>
            <p>着席している生徒全員を退席させますか？</p>
            <p>※一度実行すると元に戻せません</p>
            <button className="btn btn__yes" onClick={props.content.handler}>
              はい
            </button>
            <button className="btn btn__no" onClick={closeModal}>
              いいえ
            </button>
          </>
        );

      //自習室の入室を記録
      case appConfig.confirmCodeList["2001"]:
        console.log("入出記録完了");

        return (
          <>
            <p className="message-cheers">
              自習室の入室を記録します。頑張ってください！
            </p>
            <button className="btn btn__close" onClick={closeModal}>
              閉じる
            </button>
          </>
        );

      //自習室の使用完了を記録
      case appConfig.confirmCodeList["2002"]:
        // console.log("退室記録完了")
        const enterTime = props.content.enterTime?.split(":");
        const exitTime = props.content.enterTime?.split(":");
        const time = props.content.timeLength;

        if (!enterTime || !exitTime || !time) {
          throw new Error("invalid props.modalContents has been passed.");
        }

        return (
          <>
            <p className="message-cheers">
              自習室の使用を記録しました。お疲れさまでした！
            </p>
            <p>
              退室時刻： {exitTime[0]}時 {exitTime[1]}分 {exitTime[2]}秒
            </p>
            <p>
              トータル勉強時間：
              <b>
                {time[0]} 時間 {time[1]} 分{" "}
              </b>
            </p>

            <button className="btn btn__close" onClick={closeModal}>
              閉じる
            </button>
          </>
        );

      case appConfig.confirmCodeList["2003"]:
        return (
          <>
            <p>生徒情報ファイルの読み込みに成功しました。</p>
            <button className="btn btn__close" onClick={closeModal}>
              閉じる
            </button>
          </>
        );

      case appConfig.confirmCodeList["2004"]:
        return (
          <>
            <p>生徒情報ファイルの保存場所を設定しました。</p>
            <button className="btn btn__close" onClick={closeModal}>
              閉じる
            </button>
          </>
        );

      //アプリのローカルデータを削除完了
      case appConfig.confirmCodeList["2005"]:
        //background closerを無効化
        props.onHandleBgClose(false);

        //アプリを自動リロード
        setTimeout(() => window.location.reload(), 3000);
        return (
          <>
            <p>アプリの本日分の内部データを削除しました。</p>
            <p>3秒後にアプリを再読み込みします...</p>
          </>
        );

      //直前の操作取り消し完了
      case appConfig.confirmCodeList["2006"]:
        return (
          <>
            <p>直前の操作を取り消しました。</p>
            <button className="btn btn__close" onClick={closeModal}>
              閉じる
            </button>
          </>
        );

      case appConfig.confirmCodeList["2007"]:
        let itemName;

        if (props.content.fn_id === "appConfig_fn_cancelOperation")
          itemName = "直前の操作取り消し機能";
        if (props.content.fn_id === "appConfig_fn_eraceAppDataTodayAll")
          itemName = "アプリ内部データ(1日分)削除機能";

        return (
          <>
            <p>
              {itemName} を {props.content.fn_value ? "有効化" : "無効化"}{" "}
              しました。
            </p>
            <button className="btn btn__close" onClick={closeModal}>
              閉じる
            </button>
          </>
        );

      case appConfig.confirmCodeList["2008"]:
        if (props.content.studentID === undefined)
          throw new Error("invalid props.content.studentID value: undefined");
        if (props.content.nextSeatID === undefined)
          throw new Error("invalid props.nextSeatID value: undefined");

        const studentName = getStudentInfoFromStudentID(
          props.content.studentID
        )?.name;

        return (
          <>
            <p>
              {studentName} さんの座席番号を
              <br></br>
              {props.content.nextSeatID.substring(4)} 番に変更しました。
            </p>
            <button className="btn btn__close" onClick={closeModal}>
              閉じる
            </button>
          </>
        );

      //トップ画面メッセージ変更
      case appConfig.confirmCodeList["2009"]:
        return (
          <>
            <p>トップ画面のメッセージを変更しました。</p>
            <button className="btn btn__close" onClick={closeModal}>
              閉じる
            </button>
          </>
        );

      case appConfig.confirmCodeList["2010"]:
        return (
          <>
            <p>現在着席していた生徒を全員退席しました。</p>
            <button className="btn btn__close" onClick={closeModal}>
              閉じる
            </button>
          </>
        );

      case appConfig.confirmCodeList["2011"]:
        return (
          <>
            <p>本日分のアプリ内部データを削除しました。</p>
            <button className="btn btn__close" onClick={closeModal}>
              閉じる
            </button>
          </>
        );

      default:
        console.log("confirm code:", props.content.confirmCode);
        throw new Error("Unexpected confirmCode in ConfirmModal.js");
    }
  };

  return <div className="confirm-modal-wrapper">{handleComponent()}</div>;
};

export { ConfirmModal };
