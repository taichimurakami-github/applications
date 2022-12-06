import { useEffect } from "react";
import { TAppAutoUpdateProcessContent } from "~electron/@types/contextBridge";

export const useIpcEventsListener = () => {
  useEffect(() => {
    window.electron.onListenUpdateProcess(
      (content: TAppAutoUpdateProcessContent) => {
        console.log("content:", content);
      }
    );
  }, []);
};
