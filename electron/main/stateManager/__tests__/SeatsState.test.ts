import { AttendanceState } from "../AttendanceState";
import { resolve as resolvePath } from "path";
import { TSeatsState } from "../../../@types/main";
import { getPathExists, removePath } from "../../../utils/testUtil";
import { SeatsState } from "../SeatsState";

/**
 * test utils
 */

const TEST_DIR_PATH = resolvePath("./", ".TEST_LOCAL_DIR/seats");
const SEATS_FILE_PATH = resolvePath(
  TEST_DIR_PATH,
  new AttendanceState(TEST_DIR_PATH).getFileName()
);
const date = new Date();

/**
 * tests
 */

describe("SeatsState(state manager)", () => {
  test("seatsフォルダが存在しない場合は新たにフォルダ作成が行われる", async () => {
    await removePath(TEST_DIR_PATH);

    const seats = new SeatsState(TEST_DIR_PATH);

    expect(await getPathExists(TEST_DIR_PATH)).toBeTruthy();
    expect(seats.readData()).toBeUndefined();
  });

  test("seatsフォルダが存在し，その中に古い日付に対応するファイルが存在した場合，が行われる", async () => {
    await removePath(TEST_DIR_PATH);

    const seats = new SeatsState(TEST_DIR_PATH);

    expect(await getPathExists(TEST_DIR_PATH)).toBeTruthy();
    expect(seats.readData()).toBeUndefined();
  });

  test("seatsファイルが存在しない場合、ファイルを作成して書き込みを行う", async () => {
    await removePath(TEST_DIR_PATH);

    const seats = new SeatsState(TEST_DIR_PATH);
    const dummyData: TSeatsState = {
      seat01: {
        active: false,
        enterTime: date.toLocaleString(),
        studentId: "000000",
      },
      seat02: {
        active: true,
        enterTime: date.toLocaleString(),
        studentId: "111111",
      },
    };

    seats.updateData(dummyData);
    const readData = seats.readData();
    expect(JSON.stringify(readData) === JSON.stringify(dummyData)).toBe(true);
  });
});
