import { useEffect } from "react";

export const useIpcEventsListener = () => {
  useEffect(() => {
    window.electron.onListenUpdateProcess((content: any) => {
      console.log("content:", content);
    });
  }, []);
};
