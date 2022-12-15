import { AppConfigState } from "../AppConfigState";
import { readFile, writeFile, rmdir } from "fs/promises";
import { resolve as resolvePath } from "path";

/**
 * test utils
 */

const TEST_DIR_PATH = resolvePath("./", ".TEST_LOCAL_DIR");

const dummyconfig = new AppConfigState(
  resolvePath("./", ".TEST_DUMMY_LOCAL_DIR")
);
const APP_LOCAL_CONFIG_FILE_PATH = resolvePath(
  TEST_DIR_PATH,
  dummyconfig.getFileName()
);

const date = new Date();

/**
 * tests
 */

describe("AppConfigState(state manager)", () => {
  test("config.jsonファイルがローカルに存在しない場合は新たにファイル作成を行い、作成されたファイルのデータがテンプレートデータである", async () => {
    await rmdir(TEST_DIR_PATH, { recursive: true }).catch((e) =>
      console.log(e)
    );
    const config = new AppConfigState(TEST_DIR_PATH);

    const data = await readFile(APP_LOCAL_CONFIG_FILE_PATH, "utf-8");
    expect(data === JSON.stringify(config.defaultAppLocalConfig)).toBe(true);
  });

  test("既存のconfig.jsonのデータが古く、versionプロパティが存在しない場合、新たなバージョンのconfig.jsonのデータに上書きしたうえ、互換性のある情報を自動で引き継ぐ", async () => {
    const oldDataDummy = {
      path: {
        studentsList: "TEST_DUMMY_STUDENTLIST_PATH",
      },
    };
    await writeFile(APP_LOCAL_CONFIG_FILE_PATH, JSON.stringify(oldDataDummy));
    const config = new AppConfigState(TEST_DIR_PATH);
    const data = config.readData();
    if (!data) {
      throw new Error("dataの書き込みに失敗しました");
    }

    expect(
      JSON.stringify(data) === JSON.stringify(config.defaultAppLocalConfig)
    ).toBe(true);
    expect(data.path.studentsList === oldDataDummy.path.studentsList).toBe(
      true
    );
  });

  test("既存のconfig.jsonのデータが古く、versionプロパティがテンプレートのものと一致しない場合、新たなバージョンのconfig.jsonのデータに上書きしたうえ、互換性のある情報を自動で引き継ぐ", async () => {
    //単純にデータが最新版ではない場合
    const oldDataDummy = {
      version: "falhewfds9oahnusidanf",
      path: {
        studentsList: "TEST_DUMMY_STUDENTLIST_PATH",
      },
    };
    await writeFile(APP_LOCAL_CONFIG_FILE_PATH, JSON.stringify(oldDataDummy));
    const config = new AppConfigState(TEST_DIR_PATH);
    const data = config.readData();
    if (!data) {
      throw new Error("dataの書き込みに失敗しました");
    }

    expect(data.version === config.defaultAppLocalConfig.version).toBe(true); //読み込んだjsonファイルのversion情報が細心になっている
    expect(data.path.studentsList === oldDataDummy.path.studentsList).toBe(
      true
    );
  });

  test("新しいデータをupdateメソッドに渡すと、ローカルファイルにデータを書き込んで更新できる", async () => {
    const config = new AppConfigState(TEST_DIR_PATH);
    const oldDataInLocalConfigFile = config.getData();
    const newData = {
      ...config.getData(),
      path: {
        attendance: date.toLocaleString() + "_attendance",
        seats: date.toLocaleString() + "_seats",
        studentsList: date.toLocaleString() + "_studentsList",
      },
    };

    await writeFile(APP_LOCAL_CONFIG_FILE_PATH, JSON.stringify(newData));
    const data = config.readData();

    expect(data).toBeTruthy();
    expect(
      JSON.stringify(oldDataInLocalConfigFile) === JSON.stringify(data)
    ).toBe(false);
  });
});
