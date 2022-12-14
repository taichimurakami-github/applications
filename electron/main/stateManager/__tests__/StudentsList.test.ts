import { resolve as resolvePath } from "path";
import { StudentsListState } from "../StudentsList";
import { AppConfigState } from "../AppConfigState";

/**
 * test utils
 */
const APP_CONFIG_DIR_PATH = resolvePath("./", ".TEST_LOCAL_DIR");
const TEST_RESOURCE_PATH = resolvePath(
  "./electron/resources/students-list-dummy.xlsx"
);
const appConfig = new AppConfigState(APP_CONFIG_DIR_PATH);

/**
 * tests
 */

describe("AttendanceState(state manager)", () => {
  test("studentsListのソースパスが設定されていない場合、undefinedを返す", async () => {
    const studentList = new StudentsListState(appConfig);
    const appConfigData = appConfig.getData();
    if (!appConfigData) {
      throw new Error("appConfig is not exists.");
    }
    appConfig.updateData({
      ...appConfigData,
      path: {
        ...appConfigData.path,
        studentsList: "",
      },
    });

    expect(studentList.readData()).toBeUndefined(); //まだ作成されていないのでundefined（readに失敗する）
  });

  test("studentsListのソースパスが設定されている場合、bufferデータを読み込む", async () => {
    const studentList = new StudentsListState(appConfig);

    const appConfigData = appConfig.getData();
    if (!appConfigData) {
      throw new Error("appConfig is not exists.");
    }

    appConfig.updateData({
      ...appConfigData,
      path: {
        ...appConfigData.path,
        studentsList: resolvePath(TEST_RESOURCE_PATH),
      },
    });

    console.log(studentList.getFilePath());

    expect(studentList.readData()).toBeTruthy();
  });
});
