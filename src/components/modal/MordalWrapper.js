//modal module import
import { ErrorModal } from "./ErrorModal";
import { SeatsModal } from "./SeatsModal";
import { ConfirmModal } from "./ConfirmModal";
import { appConfig } from "../../app.config";
import { useState } from "react";

//import styles
import "../styles/modal.scss";


const ModalWrapper = (props) => {

  const [BackgroundClose, setBackgroundClose] = useState(true);

  const closeModal = (e) => {
    //returnしないと、e.target === trueのときにe.target === undefinedとなってエラーになる
    if (e === true) {
      return props.onHandleModalState({ active: false });
    }

    if (e.target.classList.contains("onclick-close")) {
      return props.onHandleModalState({ active: false });
    }
  }

  const handleModal = () => {
    if (props.modalState.active) {
      // console.log(props.modalState);
      switch (props.modalState.name) {

        case appConfig.modalCodeList["1001"]:
          return <ConfirmModal
            content={props.modalState.content}
            onCloseModal={closeModal}
            onHandleBcClose={setBackgroundClose}
            onSaveForEnter={props.onSaveForEnter}
            onSaveForExit={props.onSaveForExit}
            onEraceAppData={props.onEraceAppData}
            onCancelOperation={props.onCancelOperation}
            seatsState={props.seatsState}
            studentsList={props.studentsList}
          />

        case appConfig.modalCodeList["1002"]:
          return <ErrorModal
            onCloseModal={closeModal}
            onHandleBcClose={setBackgroundClose}
            content={props.modalState.content}
          />

        case appConfig.modalCodeList["1003"]:
          return <SeatsModal
            seatsState={props.modalState.content.seatsState}
            studentsList={props.modalState.content.studentsList}
            onCloseModal={closeModal}
            onHandleBcClose={setBackgroundClose}
            onHandleModalState={props.onHandleModalState}
            onHandleSeatOperation={props.handleSeatOperation}
            onSaveForExit={props.onSaveForExit}
          />

        default:
          console.log("handleModal on modalWrapper is ignored");
          return undefined;
      }
    }
  }

  return (
    <>
      {
        props.modalState.active ?

          <div onClick={closeModal} className={`modal-wrapper ${BackgroundClose && "onclick-close"}`}>
            {handleModal()}
          </div>

          :

          undefined
      }
    </>
  );
}

export { ModalWrapper }