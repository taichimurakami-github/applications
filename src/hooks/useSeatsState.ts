import { useState, useEffect } from "react";

const useSeatsState = (seatsState_initialValue: seatsState) => {
  //現在の座席状況を管理する変数
  const [seatsState, setSeatsState] = useState<seatsState | null>(null);

  useEffect(() => {
    async () => {
      //今日の分のseatsState記録が残っていれば読み込み
      const seatsState_bcup = await window.electron.ipcRenderer.invoke(
        "handle_seatsState",
        { mode: "read" }
      );
      console.log("read_seatsstate_bcup_result", seatsState_bcup);
      setSeatsState(
        seatsState_bcup ? seatsState_bcup : seatsState_initialValue
      );
    };
  }, []);

  return { seatsState, setSeatsState };
};

export default useSeatsState;
