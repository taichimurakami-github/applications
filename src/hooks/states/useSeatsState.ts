import { useState, useEffect } from "react";

const getSeatsStateInitialValue = () => {
  const initialValue: TSeatsState = {};
  for (let i = 1; i <= 16; i++) {
    initialValue[`seat${i}`] = {
      active: false,
      enterTime: "",
      studentId: "",
    };
  }

  return initialValue;
};

export const seatsState_initialValue = getSeatsStateInitialValue();

const useSeatsState = () => {
  //現在の座席状況を管理する変数
  const [seatsState, setSeatsState] = useState<TSeatsState>(
    seatsState_initialValue
  );

  useEffect(() => {
    (async () => {
      //今日の分のseatsState記録が残っていれば読み込み
      const seatsState_bcup = await window.electron.readSeatsState();

      console.log("read_seatsstate_bcup_result", seatsState_bcup);
      setSeatsState(
        seatsState_bcup ? seatsState_bcup : seatsState_initialValue
      );
    })();
  }, []);

  return { seatsState, setSeatsState };
};

export default useSeatsState;
