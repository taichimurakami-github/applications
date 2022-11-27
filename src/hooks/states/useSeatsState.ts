import { useState, useEffect } from "react";
import { useIpcEventsSender } from "../controllers/useIpcEventsSender";

const getSeatsStateInitialValue = () => {
  const initialValue: seatsState = {};
  for (let i = 1; i <= 16; i++) {
    initialValue[`seat${i}`] = {
      active: false,
      enterTime: "",
      studentID: "",
    };
  }

  return initialValue;
};

export const seatsState_initialValue = getSeatsStateInitialValue();

const useSeatsState = () => {
  const { readSeatsState } = useIpcEventsSender();
  //現在の座席状況を管理する変数
  const [seatsState, setSeatsState] = useState<seatsState>(
    seatsState_initialValue
  );

  useEffect(() => {
    (async () => {
      //今日の分のseatsState記録が残っていれば読み込み
      const seatsState_bcup = await readSeatsState();

      console.log("read_seatsstate_bcup_result", seatsState_bcup);
      setSeatsState(
        seatsState_bcup ? seatsState_bcup : seatsState_initialValue
      );
    })();
  }, []);

  return { seatsState, setSeatsState };
};

export default useSeatsState;
