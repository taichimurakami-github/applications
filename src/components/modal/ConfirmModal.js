import { appConfig } from "../../app.config";

const ConfirmModal = (props) => {

  const onSaveAttendanceForEnter = () => props.onSaveForEnter(props.content.targetID);
  const onSaveAttendanceForExit = () => props.onSaveForExit(props.content.targetID);
  const closeModal = () => props.onCloseModal(true);


  const handleComponent = () => {

    switch(props.content.confirmCode){
      case appConfig.confirmCodeList["1001"]:
        return (
          <div className="enter-confirm-selector-container">
            <p>本当に {props.content.val.name} さんでよろしいですか？</p>
            <button className="btn btn__yes" onClick={onSaveAttendanceForEnter}>はい</button>
            <button className="btn btn__no" onClick={closeModal}>いいえ</button>
          </div>);


      case appConfig.confirmCodeList["1002"]:
        // console.log(props.content);
        // console.log(props.seatsState[props.content.targetID]);
        const targetInfo = (props.seatsState[props.content.targetID].studentID !== "__OTHERS__") ?
          props.studentsList.filter((val) => {
            return val.id == props.seatsState[props.content.targetID].studentID;
          })[0]

          :

          {id: "__OTHERS__", name: "(関係者その他)"}


        // console.log(targetInfo);
        return (
          <div className="exit-confirm-selector-container">
            <p>本当に {targetInfo.name} さんでよろしいですか？</p>
            <button className="btn btn__yes" onClick={onSaveAttendanceForExit}>はい</button>
            <button className="btn btn__no" onClick={closeModal}>いいえ</button>
          </div>
        );


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


      default:
        throw new Error("Unexpected confirmCode in ConfirmModal.js");
    }
  }

  return (
    <div className="confirm-modal-wrapper">
      {handleComponent()}
    </div>
  );

};

export {ConfirmModal};