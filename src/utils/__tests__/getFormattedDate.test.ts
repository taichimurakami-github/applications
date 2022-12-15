import { getFormattedDate } from "../getFormattedDate";

describe("getFormattedDate", (): void => {
  test("関数の実行結果はYMD,HMSプロパティを含むオブジェクトでなければならない", (): void => {
    const response = getFormattedDate();

    expect(response).toEqual(
      expect.objectContaining({
        YMD: expect.any(String),
        HMS: expect.any(String),
      })
    );
  });

  test("関数の実行結果のオブジェクトの各valueは、'/', ':'でsplitすると、長さ3の配列になる", (): void => {
    const response = getFormattedDate();

    expect(response.YMD).toMatch(/(\d{1,2}\/){2}\d{1,2}/);
    expect(response.HMS).toMatch(/(\d{1,2}:){2}\d{1,2}/);
  });
});
