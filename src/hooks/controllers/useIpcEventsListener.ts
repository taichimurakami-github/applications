import { TAppAutoUpdateProcessContent } from "~electron/@types/contextBridge";

export const useIpcEventsListener = () => {
  const listenAppAutoUpdateProcess = (
    callback: (content: TAppAutoUpdateProcessContent) => void
  ) => {
    window.electron.onListenUpdateProcess(callback);
  };

  return { listenAppAutoUpdateProcess };
};
