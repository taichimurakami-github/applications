import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve as resolvePath } from "path";
import { TAppLocalConfig } from "../../@types/main";
import { StateManagerBase } from "./StateManagerBase";

export class AppConfigState extends StateManagerBase<TAppLocalConfig> {
  public readonly defaultAppLocalConfig: TAppLocalConfig;

  constructor(appConfigDirPath: string) {
    super("AppLocalConfigManager", appConfigDirPath);

    this.defaultAppLocalConfig = {
      version: "1.0.0",
      path: {
        studentsList: "",
        attendance: this.getAttendanceDir(),
        seats: this.getSeatsDir(),
      },
      appConfig: {
        msg: "現在、お知らせは特にありません。体調に気を付けて、今日も一日頑張ってください！",
        fn: {
          stable: {
            eraceAppDataTodayAll: true,
            cancelOperation: true,
            changeSeatID: true,
          },
          nightly: {},
        },
      },
    };

    if (!existsSync(this.getFilePath())) {
      //config.jsonファイルが存在しないので新たにファイル作成
      console.log("cannot find app config file. creating...");

      writeFileSync(
        this.getFilePath(),
        JSON.stringify(this.defaultAppLocalConfig)
      );
    } else {
      //config.jsonファイルが既に存在する場合は、ファイルのバージョンの整合性チェック
      //バージョンが古い場合は最新バージョンのテンプレートデータに置き換え
      this._resolveAppConfigLocalFileVersion();
    }

    this.readData();
  }

  private _resolveAppConfigLocalFileVersion() {
    const nowAppConfig = JSON.parse(readFileSync(this.getFilePath(), "utf-8"));

    if (
      !("version" in nowAppConfig) ||
      nowAppConfig.version !== this.defaultAppLocalConfig.version
    ) {
      console.log("your LocalConfig is available to be updated.");
      console.log("now making new App LocalConfig file...");

      //データ引継ぎ処理
      const newData = { ...this.defaultAppLocalConfig };
      newData.path.studentsList = nowAppConfig.path.studentsList;

      //新規バージョンのconfigデータで上書き
      writeFileSync(this.getFilePath(), JSON.stringify(newData));
    }
  }

  public getFileName() {
    return "config.json";
  }

  public getFilePath() {
    return resolvePath(this.FILE_DIR_PATH, this.getFileName());
  }

  public getSeatsDir() {
    return resolvePath(this.FILE_DIR_PATH, "./seats");
  }

  public getAttendanceDir() {
    return resolvePath(this.FILE_DIR_PATH, "./attendance");
  }

  public getStudentsFilepath() {
    return this.getData()?.path.studentsList || "";
  }
}
