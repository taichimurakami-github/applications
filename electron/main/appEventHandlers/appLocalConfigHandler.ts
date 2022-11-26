import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve as resolvePath } from "path";

export const readAndResolveAppLocalConfigWhenAppReady = (
  configDirPath,
  localConfigTemplatePath
) => {
  let appLocalConfig;

  try {
    //config.jsonの最新版テンプレートを読み込み
    //ただし、pathに関しては空白なので、手動で付け加える
    const configTemplate = JSON.parse(
      readFileSync(localConfigTemplatePath, "utf-8")
    );
    configTemplate.path.seats = resolvePath(configDirPath, "./seats/");
    configTemplate.path.attendance = resolvePath(
      configDirPath,
      "./attendance/"
    );

    console.log("configTemplate:");
    console.log(configTemplate);

    if (!existsSync(resolvePath(configDirPath, "./config.json"))) {
      //config.jsonファイルが存在しない場合、新たに設定ファイルを作成
      console.log("no config files. now creating new config files ...");

      // writeFileSync(resolvePath(configDirPath, "./config.json"), JSON.stringify(configPrototype));
      writeFileSync(
        resolvePath(configDirPath, "./config.json"),
        JSON.stringify(configTemplate)
      );

      //appLocalConfigには、configTemplate(最新版テンプレートファイル)からロードしたJSONデータを入れる
      appLocalConfig = { ...configTemplate };
    } else {
      //config.jsonのバージョンが古い場合、新たに設定ファイルを作成
      const nowAppConfig = JSON.parse(
        readFileSync(resolvePath(configDirPath, "./config.json"), "utf-8")
      );

      console.log("now Local Config is below:");
      console.log(nowAppConfig);

      //LocalConfigファイルが存在するがバージョンが古い場合、新バージョンのファイルを生成する
      if (
        !("version" in nowAppConfig) ||
        nowAppConfig.version !== configTemplate.version
      ) {
        console.log("your LocalConfig is available to be updated.");
        console.log("now making new App LocalConfig file...");

        //studentsListのpathデータを保持するために、configTemplate内にコピー
        configTemplate.path.studentsList = nowAppConfig.path.studentsList;

        //新規バージョンのconfigで上書き
        writeFileSync(
          resolvePath(configDirPath, "./config.json"),
          JSON.stringify(configTemplate)
        );

        //appLocalConfigには、configTemplate(最新版テンプレートファイル)からロードしたJSONデータを入れる
        appLocalConfig = { ...configTemplate };
      } else {
        //現在のLocalConfigファイルが最新の場合、appLocalConfigには先程読み込んだJSONファイルを入れる
        appLocalConfig = { ...nowAppConfig };
      }
    }

    //LocalConfigファイルの生成完了
    console.log("app LocalConfig file: check completed.");
  } catch (e) {
    console.log(e);
  }

  return appLocalConfig;
};
