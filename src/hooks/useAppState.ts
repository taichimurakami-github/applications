import { useState, useEffect } from "react";

const useAppState = (appState_initialValue: appState) => {
  const [appState, setAppState] = useState<appState>(appState_initialValue);

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
  return { appState, setAppState };
};

export default useAppState;
