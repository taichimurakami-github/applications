const ConfirmModal = (props) => {

  const onSaveAttendanceForEnter = () => {
    console.log("confirmmodal onsaveattendance for enter 起動");
    props.onSaveForEnter(props.content.targetID);
  }

  const onSaveAttendanceForExit = () => {
    console.log("confirmmodal onsaveattendance for exit 起動")
    
  }

  const closeModal = () => props.onCloseModal(true);

  const closeModalForFewSecondsLator = () => {
    const CLOSE_INTERVAL = 2000;

    return setTimeout(() => {
      closeModal();
    }, CLOSE_INTERVAL);
  }

  const handleComponent = () => {
    switch(props.content.mode){
      case "SAVE_ATTENDANCE_ENTER":
        console.log(props.content);
        return (
          <div>
            <p>本当に {props.content.val.name} さんでよろしいですか？</p>
            <button onClick={onSaveAttendanceForEnter}>はい</button>
            <button onClick={closeModal}>いいえ</button>
          </div>)

      case "SAVE_ATTENDANCE_EXIT":
        break;

      case "SAVE_ATTENDANCE_ENTER_DONE":
        const timeout = closeModalForFewSecondsLator();
        return (
          <>
            <p className="message-cheers">自習室の使用を記録します。頑張ってください！</p>
            <p>2秒後に自動で消えます</p>
          </>
        )

      case "SAVE_ATTENDANCE_EXIT_DONE":
        closeModalForFewSecondsLator();
        return (
          <>
            <p className="message-cheers">自習室の使用を記録しました。お疲れさまでした！</p>
            <p>2秒後に自動で消えます</p>
          </>
        )
    }
  }

  return (<div className="confirm-modal-wrapper">
    {handleComponent()}
  </div>)
};

export {ConfirmModal};