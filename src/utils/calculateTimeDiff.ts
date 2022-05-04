export const calculateTimeDiff = (
  enterTime: string,
  exitTime: string
): number[] => {
  //時刻、分、秒の数値をそれぞれ数値化して、配列に格納
  const enterTimeArr = enterTime.split(":").map((val) => Number(val));
  const exitTimeArr = exitTime.split(":").map((val) => Number(val));
  const result: number[] = [0, 0, 0];

  // step1: 秒を計算
  result[2] = exitTimeArr[2] - enterTimeArr[2];

  // step2: 分を計算
  result[1] = exitTimeArr[1] - enterTimeArr[1];

  if (result[2] < 0) {
    result[2] += 60;
    exitTimeArr[1] -= 1;
  }

  // step3: 時刻を計算
  result[0] = exitTimeArr[0] - enterTimeArr[0];

  if (result[1] < 0) {
    result[1] += 60;
    exitTimeArr[0] -= 1;
  }

  return result;
};
