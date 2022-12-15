import { calculateTimeDiff } from "../calculateTimeDiff";

describe("calculateTimeDiff", (): void => {
  test("enter: 8:00:10, exit: 12:10:10 の返り値は [2,10,0] でなければならない", (): void => {
    const response: number[] = calculateTimeDiff("8:00:10", "12:10:10");
    expect(response).toStrictEqual([4, 10, 0]);
  });

  test("enter: 8:50:10, exit: 10:10:10 の返り値は [1,20,0] でなければならない", (): void => {
    const response: number[] = calculateTimeDiff("8:50:10", "10:10:50");
    expect(response).toStrictEqual([1, 20, 40]);
  });

  test("enter: 9:50:30, exit: 10:10:10 の返り値は [0,19,40] でなければならない", (): void => {
    const response: number[] = calculateTimeDiff("9:50:30", "10:10:10");
    expect(response).toStrictEqual([0, 19, 40]);
  });
});
