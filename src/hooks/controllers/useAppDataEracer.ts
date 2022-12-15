import { appConfig } from "~/app.config";
import { useAppSetStateCtx } from "../states/useAppContext";

/**
 * function handleEraceAppData()
 *
 * 本日の分の、アプリのローカルデータを完全に削除する
 * ※削除されるのはアプリ起動日1日分のみ
 *
 */
const useAppDataEracer = () => {
  const { handleModalState } = useAppSetStateCtx();

  const appDataEracer = async () => {
    // await window.electron.ipcRenderer.invoke("handle_eraceAppLocalData");
    const r = await window.electron.deleteAppLocalData();
    console.log("delete app local data result:", r);
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
