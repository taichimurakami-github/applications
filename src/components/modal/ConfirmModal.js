import { appConfig } from "../../app.config";

const ConfirmModal = (props) => {

  const onSaveAttendanceForEnter = () => props.onSaveForEnter(props.content.targetID);
  const onSaveAttendanceForExit = () => props.onSaveForExit(props.content.targetID);
  const onEraceAppData = () => props.onEraceAppData();
  const onCancelOperation = () => props.onCancelOperation();
  const closeModal = () => props.onCloseModal(true);


  const handleComponent = () => {

    switch (props.content.confirmCode) {
      case appConfig.confirmCodeList["1001"]:
        return (
          <div className="enter-confirm-selector-container">
            <p>本当に {props.content.val.name} さんでよろしいですか？</p>
            <button className="btn btn__yes" onClick={onSaveAttendanceForEnter}>はい</button>
            <button className="btn btn__no" onClick={closeModal}>いいえ</button>
          </div>);


      case appConfig.confirmCodeList["1002"]:
        //退席処理を実行する準備を行う
        //まず、処理を実行する生徒IDをseatsStateより取り出す
        //関係者の場合は特殊パターンとして別途オブジェクトを作成する
        const targetInfo = (props.seatsState[props.content.targetID].studentID !== "__OTHERS__") ?
          props.studentsList.filter((val) => {
            return val.id == props.seatsState[props.content.targetID].studentID;
          })[0]

          :

          { id: "__OTHERS__", name: "(関係者その他)" }


        // console.log(targetInfo);
        //確認モーダルの中身
        return (
          <div className="exit-confirm-selector-container">
            <p>本当に {targetInfo.name} さんでよろしいですか？</p>
            <button className="btn btn__yes" onClick={onSaveAttendanceForExit}>はい</button>
            <button className="btn btn__no" onClick={closeModal}>いいえ</button>
          </div>
        );

      case appConfig.confirmCodeList["1003"]:
        //アプリのデータを完全に削除する
        return (
          <>
            <p>今日1日分のアプリ内部データを完全に削除します。</p>
            <p>※この機能はアプリの動作が不安定な場合のみ使用してください※</p>
            <p>一度削除したデータはもとに戻せません。本当によろしいですか？</p>
            
            <button className="btn btn__yes" onClick={onEraceAppData}>はい</button>
            <button className="btn btn__no" onClick={closeModal}>いいえ</button>
          </>
        )

      case appConfig.confirmCodeList["1004"]:
          const isAppLogExists = (props.content.appLog) ? true : false;


        //直前の操作を取り消す
        return (
          <>
            <p>直前の操作を取り消しますか？</p>
            <p className="current-operation">直前の操作：<b>{props.content.studentName}</b>さんが<b>{props.content.currentOperation}</b>しました</p>
            <p>※一度取り消すと元に戻せません</p>   
            <button className="btn btn__yes" onClick={onCancelOperation}>はい</button>
            <button className="btn btn__no" onClick={closeModal}>いいえ</button>
          </>
        )


      //自習室の入室を記録
      case appConfig.confirmCodeList["2001"]:
        return (
          <>
            <p className="message-cheers">自習室の入室を記録します。頑張ってください！</p>
            <button className="btn btn__close" onClick={closeModal}>閉じる</button>
          </>
        );


      //自習室の使用完了を記録
      case appConfig.confirmCodeList["2002"]:
        return (
          <>
            <p className="message-cheers">自習室の使用を記録しました。お疲れさまでした！</p>
            <button className="btn btn__close" onClick={closeModal}>閉じる</button>
          </>
        );


      case appConfig.confirmCodeList["2003"]:
        return (
          <>
            <p>生徒情報ファイルの読み込みに成功しました。</p>
            <button className="btn btn__close" onClick={closeModal}>閉じる</button>
          </>
        );

      case appConfig.confirmCodeList["2004"]:
        return (
          <>
            <p>生徒情報ファイルの保存場所を設定しました。</p>
            <button className="btn btn__close" onClick={closeModal}>閉じる</button>
          </>
        );

      //アプリのローカルデータを削除完了
      case appConfig.confirmCodeList["2005"]:

        //background closerを無効化
        props.onHandleBcClose(false);

        //リロード
        setTimeout(()=>window.location.reload(), 3000);
        return(
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
            <button className="btn btn__close" onClick={closeModal}>閉じる</button>
          </>
        );

      case appConfig.confirmCodeList["2007"]:
        let itemName;

        if(props.content.id === "appConfig_fn_cancelOperation") itemName = "直前の操作取り消し機能";
        if(props.content.id === "appConfig_fn_eraceAppDataTodayAll") itemName = "アプリ内部データ(1日分)削除機能";

        return (
          <>
            <p>{itemName} を {(props.content.value) ? "有効化" : "無効化"} しました。</p>
            <button className="btn btn__close" onClick={closeModal}>閉じる</button>
          </>
        );

      default:
        console.log("confirm code:", props.content.confirmCode);
        throw new Error("Unexpected confirmCode in ConfirmModal.js");
    }
  }

  return (
    <div className="confirm-modal-wrapper">
      {handleComponent()}
    </div>
  );

};

export { ConfirmModal };