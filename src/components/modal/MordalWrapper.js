//modal module import
import { useEffect } from "react";
import { ErrorModal } from "./ErrorModal";
import { ExitModal } from "./ExitModal";
import { ConfirmModal } from "./ConfirmModal";

//import styles
import "../styles/modal.scss";

const ModalWrapper = (props) => {

  const closeModal = (e) => {
    // console.log(e.target);

    //returnしないと、trueのときにe.target === undefinedとなってエラーになる
    if(e === true){
      return props.onHandleModalState({
        active: false
      });
    }

    if(e.target.classList.contains("onclick-close")){
      return props.onHandleModalState({
        active: false
      });
    }
  }

  const handleModal = () => {
    if(props.modalState.active){
      // console.log(props.modalState);
      switch(props.modalState.name){
        case "EXIT":
          return <ExitModal 
            seatsState={props.modalState.content.seatsState}
            studentsList={props.modalState.content.studentsList}
            onCloseModal={closeModal}
            onHandleModalState={props.onHandleModalState}
            onSaveForExit={props.onSaveForExit}
           />

        case "CONFIRM":
          return <ConfirmModal
            content={props.modalState.content}
            onCloseModal={closeModal}
            onSaveForEnter={props.onSaveForEnter}
           />

        case "ERROR":
          return <ErrorModal
            onCloseModal={closeModal}
            content={props.modalState.content}
          />

        // case "ERROR":
        default:
          console.log("handleModal on modalWrapper is ignored");
          return undefined;
      }
    }
  }

  return(
    <>
      {
        props.modalState.active ?      
        <div onClick={closeModal} className="modal-wrapper onclick-close">
          {handleModal()}
        </div>
         : 
        undefined
      }
    </>
  )
}

export {ModalWrapper}