//modal module import
import { ErrorModal } from "./ErrorModal";
import { SeatsModal } from "./SeatsModal";
import { ConfirmModal } from "./ConfirmModal";
import { NewsModal } from "./NewsModal";
import { appConfig } from "../../app.config";
import React, { useContext, useState } from "react";

//import styles
import "@styles/modal.scss";
import { AppStateContext } from "../../AppContainer";

export const ModalRoot = () => {
  const [BackgroundClose, setBackgroundClose] = useState(true);

  const { modalState, handleModalState }: AppStateContext =
    useContext(AppStateContext);

  //モーダル消去用関数
  const closeModal = () =>
    handleModalState({ active: false, name: "", content: {} });

  //背景をクリックしてモーダル消去
  const closeModalWithBgClose = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    //targetを明示的にDiv Elementと指定
    const clickedElem = e.target as HTMLDivElement;
    BackgroundClose && clickedElem.id === "modalWrapper" && closeModal();
  };

  const handleModal = () => {
    if (modalState.active) {
      // console.log(props.modalState);
      switch (modalState.name) {
        case appConfig.modalCodeList["1001"]:
          return (
            <ConfirmModal
              content={modalState.content}
              onCloseModal={closeModal}
              onHandleBgClose={setBackgroundClose}
            />
          );

        case appConfig.modalCodeList["1002"]:
          return (
            <ErrorModal
              onCloseModal={closeModal}
              onHandleBgClose={setBackgroundClose}
              content={modalState.content}
            />
          );

        case appConfig.modalCodeList["1003"]:
          return (
            <SeatsModal
              onCloseModal={closeModal}
              onHandleBgClose={setBackgroundClose}
            />
          );

        case appConfig.modalCodeList["1004"]:
          return <NewsModal onCloseModal={closeModal} />;

        default:
          console.log("invalid modalCode has been passed");
          return undefined;
      }
    }
  };

  return (
    <>
      {modalState.active ? (
        <div
          id="modalWrapper"
          onClick={closeModalWithBgClose}
          className="modal-wrapper"
        >
          {handleModal()}
        </div>
      ) : undefined}
    </>
  );
};
