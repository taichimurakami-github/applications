import { AttendanceState } from "../AttendanceState";
import { writeFile } from "fs/promises";
import { resolve as resolvePath } from "path";
import { TAttendanceState } from "../../../@types/main";
import { getPathExists, removePath } from "../../../utils/testUtil";

/**
 * test utils
 */

const TEST_DIR_PATH = resolvePath("./", ".TEST_LOCAL_DIR/attendance");
const ATTENDANCE_FILE_PATH = resolvePath(
  TEST_DIR_PATH,
  new AttendanceState(TEST_DIR_PATH).getFileName()
);
const date = new Date();

/**
 * tests
 */

describe("AttendanceState(state manager)", () => {
  test("attendanceフォルダが存在しない場合は新たにフォルダ作成が行われる", async () => {
    await removePath(TEST_DIR_PATH);
    const attendance = new AttendanceState(TEST_DIR_PATH);

    expect(await getPathExists(TEST_DIR_PATH)).toBeTruthy();
    expect(attendance.readData()).toBeUndefined(); //まだ作成されていないのでundefined（readに失敗する）
  });

  test("インスタンス生成時にattendanceファイルが存在しない場合には、ファイルを作成して書き込みを行う", async () => {
    await removePath(TEST_DIR_PATH);

    const attendance = new AttendanceState(TEST_DIR_PATH);
    const dummyData: TAttendanceState = {
      "100000": [
        {
          id: "studentId",
          seatID: "seatId",
          enter: date.toLocaleString(),
          exit: date.toLocaleString(),
        },
      ],
    };

    attendance.updateData(dummyData);
    const readDataStr = attendance.readData();
    expect(JSON.stringify(readDataStr) === JSON.stringify(dummyData)).toBe(
      true
    );
  });

  test("既存のattendanceファイルに対して書き込みを行う", async () => {
    if (!(await getPathExists(ATTENDANCE_FILE_PATH))) {
      await writeFile(ATTENDANCE_FILE_PATH, JSON.stringify([]));
    }

    const attendance = new AttendanceState(TEST_DIR_PATH);

    const dummyData: TAttendanceState = {
      "100000": [
        {
          id: "studentId",
          seatID: "seatId",
          enter: date.toLocaleString(),
          exit: date.toLocaleString(),
        },
      ],
    };

    attendance.updateData(dummyData);
    const readDataStr = attendance.readData();
    expect(JSON.stringify(readDataStr) === JSON.stringify(dummyData)).toBe(
      true
    );
  });
});
