export const calculateTimeDiff = (
  enterTime: string,
  exitTime: string
): number[] => {
  //引数チェック
  if (!enterTime.includes(":") || !exitTime.includes(":")) {
    throw new Error("invalid arg error");
  }

  //時刻、分、秒の数値をそれぞれ数値化して、配列に格納
  const enterTimeArr = enterTime.split(":").map((val) => Number(val));
  const exitTimeArr = exitTime.split(":").map((val) => Number(val));
  const result: number[] = [0, 0, 0];

  for (let i = 2; i >= 0; i--) {
    result[i] = exitTimeArr[i] - enterTimeArr[i];
    console.log(i, result);
    if (result[i] < 0) {
      result[i] += 60;
      exitTimeArr[i - 1] -= 1;
    }
  }

  console.log(result);

  return result;
};
