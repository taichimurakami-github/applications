import { useEffect } from "react";
import { appConfig } from "~/app.config";
import {
  useAppSetStateCtx,
  useModalStateCtx,
  useStudentsListCtx,
} from "../states/useAppContext";

const useAutoDataReadChecker = (): void => {
  const modalState = useModalStateCtx();
  const studentsList = useStudentsListCtx();
  const { setModalState } = useAppSetStateCtx();

  //生徒情報ファイルが読み込まれていない時は、エラーモーダルを最初に表示
  useEffect(() => {
    if (studentsList.length === 0) {
      setModalState({
        active: true,
        name: appConfig.modalCodeList["1002"],
        content: {
          errorCode: appConfig.errorCodeList["1001"],
        },
      });
    } else {
      modalState.active &&
        modalState.name === appConfig.modalCodeList["1002"] &&
        modalState.content.errorCode === appConfig.errorCodeList["1001"] &&
        setModalState({
          active: false,
          name: "",
          content: {},
        });
    }
  }, [studentsList]);
};

export default useAutoDataReadChecker;
