import { useContext, useEffect } from "react";
import { appConfig } from "../../app.config";
import { AppStateContext } from "../../AppContainer";

const useAutoDataReadChecker = (): void => {
  const { studentsList, modalState, setModalState }: AppStateContext =
    useContext(AppStateContext);

  //生徒情報ファイルが読み込まれていない時は、エラーモーダルを最初に表示
  useEffect(() => {
    if (!studentsList) {
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
