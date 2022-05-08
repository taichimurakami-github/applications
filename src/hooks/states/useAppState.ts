import { useState, useEffect, useCallback } from "react";

const useAppState = (appState_initialValue: appState) => {
  const [appState, setAppState] = useState<appState>(appState_initialValue);

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
      if (arg.mode === "APPLOG") {
        //appLogが渡された場合
        setAppState((beforeAppState) => ({
          ...beforeAppState,
          ...appState_initialValue,
          localConfig: { ...appState.localConfig },
          appLog: arg.content,
        }));
      } else {
        //appLogが渡されなかった場合
        setAppState((beforeAppState) => ({
          ...beforeAppState,
          ...appState_initialValue,
          localConfig: { ...appState.localConfig },
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
      const appLocalConfigData = await window.electron.ipcRenderer.invoke(
        "handle_loadAppLocalConfig",
        { mode: "read" }
      );
      if (appLocalConfigData) {
        setAppState((beforeAppState) => {
          return {
            ...beforeAppState,
            localConfig: appLocalConfigData,
          };
        });
      }
    })();
  }, []);
  return { appState, setAppState, resetAppState, handleAppState };
};

export default useAppState;
