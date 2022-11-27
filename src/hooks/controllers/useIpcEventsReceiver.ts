import { useEffect } from "react";

export const useIpcEventsReceiver = () => {
  useEffect(() => {
    console.log("onListenUpdateProcess listen on renderer");
    console.log(window.electron);
    window.electron.ipcRendererOn(
      "app-update-process",
      (event: any, content: any) => {
        console.log(content);
      }
    );
    window.electron.onListenUpdateProcess((event: any, content: any) => {
      console.log(content);
      const a = document.createElement("div");
      a.innerText = ":ewipofjgt0prijgo9rfjpojiu-@vjhner-jhnbo9jh-n";
      document.appendChild(a);
    });
  }, []);
};
