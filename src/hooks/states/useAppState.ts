import { useState, useEffect, useCallback } from "react";
import { appConfig } from "../../app.config";

const appState_initialValue: TAppState = {
  selectedElement: null,
  selectedSeat: "",
  now: "TOP",
  localConfig: appConfig.localConfigTemplate,
  appLog: null,
};

const useAppState = () => {
  const [appState, setAppState] = useState<TAppState>(appState_initialValue);

  /**
   * function resetAppState()
   *
   * appStateをリセットする関数
   * 引数に何も渡さない場合はappStateの初期値を使って、
   * logが含まれている場合はlogを反映して
   * appStateを上書きする
   * (logの書き換え関数を別途用意しないのは、stateの更新時のマージによるバグを防ぐため)
   *
   * @param {object} arg
   */
  const resetAppState = useCallback(
    (arg: { mode: "APPLOG" | "DEFAULT"; content?: any }) => {
      const resetPropaties = {
        selectedElement: null,
        selectedSeat: "",
        now: "TOP",
      };
      if (arg.mode === "APPLOG") {
        //appLogが渡された場合
        setAppState((beforeAppState) => ({
          ...beforeAppState,
          ...resetPropaties,
          appLog: arg.content,
        }));
      } else {
        //appLogが渡されなかった場合
        setAppState((beforeAppState) => ({
          ...beforeAppState,
          ...resetPropaties,
          appLog: null,
        }));
      }
    },
    []
  );

  //appState, seatStateを変更する
  const handleAppState = useCallback(
    (d: { [index: string]: any }) =>
      setAppState((beforeAppState) => ({
        ...beforeAppState,
        ...d,
      })),
    []
  );

  useEffect(() => {
    (async () => {
      //アプリのローカルファイルからアプリデータを取得
      const appLocalConfigData = await window.electron.readAppLocalConfig();
      console.log(appLocalConfigData);

      if (appLocalConfigData) {
        setAppState((beforeAppState) => {
          return {
            ...beforeAppState,
            localConfig: appLocalConfigData.appConfig,
          };
        });
      }
    })();
  }, []);

  useEffect(() => {
    console.log(appState);
  }, [appState]);

  return { appState, setAppState, resetAppState, handleAppState };
};

export default useAppState;
