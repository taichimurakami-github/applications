//modal module import
import { ErrorModal } from "./ErrorModal";
import { ExitModal } from "./ExitModal";
import { ConfirmModal } from "./ConfirmModal";

//import styles
import "../styles/modal.scss";
import { appConfig } from "../../app.config";

const ModalWrapper = (props) => {

  const closeModal = (e) => {
    //returnしないと、trueのときにe.target === undefinedとなってエラーになる
    if(e === true){
      return props.onHandleModalState({active: false});
    }

    if(e.target.classList.contains("onclick-close")){
      return props.onHandleModalState({active: false});
    }
  }

  const handleModal = () => {
    if(props.modalState.active){
      // console.log(props.modalState);
      switch(props.modalState.name){

        case appConfig.modalCodeList["1001"]:
          return <ConfirmModal
            content={props.modalState.content}
            onCloseModal={closeModal}
            onSaveForEnter={props.onSaveForEnter}
            onSaveForExit={props.onSaveForExit}
            seatsState={props.seatsState}
            studentsList={props.studentsList}
           />

        case appConfig.modalCodeList["1002"]:
          return <ErrorModal
            onCloseModal={closeModal}
            content={props.modalState.content}
          />

        case appConfig.modalCodeList["1003"]:
          return <ExitModal 
            seatsState={props.modalState.content.seatsState}
            studentsList={props.modalState.content.studentsList}
            onCloseModal={closeModal}
            onHandleModalState={props.onHandleModalState}
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

        <div onClick={closeModal} className="modal-wrapper onclick-close">
          {handleModal()}
        </div>

         : 

        undefined
      }
    </>
  );
}

export {ModalWrapper}