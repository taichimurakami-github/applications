import { useContext } from "react";
import { appConfig } from "../../app.config";
import { AppStateContext } from "../../AppContainer";

/**
 * function handleEraceAppData()
 *
 * 本日の分の、アプリのローカルデータを完全に削除する
 * ※削除されるのはアプリ起動日1日分のみ
 *
 */
const useAppDataEracer = () => {
  const { handleModalState }: AppStateContext = useContext(AppStateContext);

  const appDataEracer = async () => {
    await window.electron.ipcRenderer.invoke("handle_eraceAppLocalData");
    handleModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        //アプリデータ削除完了
        confirmCode: appConfig.confirmCodeList["2005"],
      },
    });
  };

  return appDataEracer;
};

export default useAppDataEracer;
