import { AppConfigState } from "../AppConfigState";
import { readFile, writeFile, rmdir } from "fs/promises";
import { resolve as resolvePath } from "path";

const TEST_DIR_PATH = resolvePath("./", ".TEST_LOCAL_DIR");

const dummyconfig = new AppConfigState(
  resolvePath("./", ".TEST_DUMMY_LOCAL_DIR")
);
const APP_LOCAL_CONFIG_FILE_PATH = resolvePath(
  TEST_DIR_PATH,
  dummyconfig.getFileName()
);

describe("AppConfigState(state manager)", () => {
  test("config.jsonファイルがローカルに存在しない場合は新たにファイル作成を行い，作成されたファイルのデータがテンプレートデータである", async () => {
    await rmdir(TEST_DIR_PATH, { recursive: true }).catch((e) =>
      console.log(e)
    );
    const config = new AppConfigState(TEST_DIR_PATH);

    const data = await readFile(APP_LOCAL_CONFIG_FILE_PATH, "utf-8");
    expect(data === JSON.stringify(config.defaultAppLocalConfig)).toBe(true);
  });

  test("既存のconfig.jsonのデータが古い場合，新たなバージョンのconfig.jsonのデータに上書きしたうえ，互換性のある情報を自動で引き継ぐ", async () => {
    // versionプロパティが存在しない場合
    const oldDataDummy01 = {
      path: {
        studentsList: "TEST_DUMMY_STUDENTLIST_PATH",
      },
    };
    await writeFile(APP_LOCAL_CONFIG_FILE_PATH, JSON.stringify(oldDataDummy01));
    const config01 = new AppConfigState(TEST_DIR_PATH);
    const data01 = await readFile(APP_LOCAL_CONFIG_FILE_PATH, "utf-8");
    expect(data01 === JSON.stringify(config01.defaultAppLocalConfig)).toBe(
      true
    );
    expect(JSON.parse(data01).path.studentsList).toBeTruthy(); //読み込んだjsonファイルの中のpath.studentsListが引き継がれている

    //単純にデータが最新版ではない場合
    const oldDataDummy02 = {
      version: {},
      path: {
        studentsList: "TEST_DUMMY_STUDENTLIST_PATH",
      },
    };
    await writeFile(APP_LOCAL_CONFIG_FILE_PATH, JSON.stringify(oldDataDummy01));
    const config02 = new AppConfigState(TEST_DIR_PATH);
    const data02 = await readFile(APP_LOCAL_CONFIG_FILE_PATH, "utf-8");
    expect(data02 === JSON.stringify(config02.defaultAppLocalConfig)).toBe(
      true
    );
    expect(JSON.parse(data02).path.studentsList).toBeTruthy(); //読み込んだjsonファイルの中のpath.studentsListが引き継がれている
  });
});
