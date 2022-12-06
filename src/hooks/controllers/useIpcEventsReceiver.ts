import { useEffect } from "react";

export const useIpcEventsReceiver = () => {
  useEffect(() => {
    window.electron.onListenUpdateProcess((content: any) => {
      console.log("content:", content);
    });
  }, []);
};
