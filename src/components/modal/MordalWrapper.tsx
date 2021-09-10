//modal module import
import { ErrorModal } from "./ErrorModal";
import { SeatsModal } from "./SeatsModal";
import { ConfirmModal } from "./ConfirmModal";
import { appConfig } from "../../app.config";
import React, { useState } from "react";

//import styles
import "../styles/modal.scss";

interface ModalWrapperProps {
  onHandleAppState: (d: { [index: string]: any; }) => void,
  onHandleModalState: (t: modalState) => void,
  onSaveForEnter: (i: string) => void,
  onSaveForExit: (i: string) => void,
  onEraceAppData: () => Promise<void>,
  onCancelOperation: () => void,
  onHandleSeatOperation: (arg: { mode: string; content: any; }) => void,
  studentsList: studentsList,
  modalState: modalState,
  seatsState: seatsState
}

const ModalWrapper: React.VFC<ModalWrapperProps> = (props) => {

  const [BackgroundClose, setBackgroundClose] = useState(true);

  //モーダル消去用関数
  const closeModal = () => props.onHandleModalState({ active: false, name: "", content: {} });

  //背景をクリックしてモーダル消去
  const closeModalWithBgClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    //targetを明示的にDiv Elementと指定
    const clickedElem = e.target as HTMLDivElement
    BackgroundClose && clickedElem.id === "modalWrapper" && closeModal();
  };

  const handleModal = () => {
    if (props.modalState.active) {
      // console.log(props.modalState);
      switch (props.modalState.name) {

        case appConfig.modalCodeList["1001"]:
          return <ConfirmModal
            content={props.modalState.content}
            onCloseModal={closeModal}
            onHandleBgClose={setBackgroundClose}
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
            onHandleBgClose={setBackgroundClose}
            onHandleAppState={props.onHandleAppState}
            content={props.modalState.content}
          />

        case appConfig.modalCodeList["1003"]:
          return <SeatsModal
            onCloseModal={closeModal}
            onHandleBgClose={setBackgroundClose}
            onHandleModalState={props.onHandleModalState}
            onHandleSeatOperation={props.onHandleSeatOperation}
            onSaveForExit={props.onSaveForExit}
            seatsState={props.seatsState}
            studentsList={props.studentsList}
          />

        default:
          console.log("invalid modalCode has been passed");
          return undefined;
      }
    }
  }

  return (
    <>
      {
        props.modalState.active ?

          <div id="modalWrapper" onClick={closeModalWithBgClose} className="modal-wrapper">
            {handleModal()}
          </div>

          :

          undefined
      }
    </>
  );
}

export { ModalWrapper }