import { writeFileSync } from "original-fs";
import { resolve as resolvePath } from "path";

export const writeAppLocalConfig = (appLocalConfig, arg, writeFileDirPath) => {
  const newAppLocalConfig = { ...appLocalConfig };
  // console.log(arg.content.value);
  //fn系の更新が含まれている場合
  if (
    arg.content.fn_id &&
    arg.content.fn_status &&
    arg.content.fn_value !== undefined
  ) {
    switch (arg.content.fn_id) {
      case "appConfig_fn_cancelOperation":
        newAppLocalConfig.appConfig.fn[arg.content.fn_status].cancelOperation =
          arg.content.fn_value;
        break;

      case "appConfig_fn_eraceAppDataTodayAll":
        newAppLocalConfig.appConfig.fn[
          arg.content.fn_status
        ].eraceAppDataTodayAll = arg.content.fn_value;
        break;

      default:
        throw new Error(
          "invalid arg.content.id in ipcHandler_handle_appLocalConfig"
        );
    }
  }

  //トップ画面メッセージの更新が含まれている場合
  if (arg.content.msg) {
    newAppLocalConfig.appConfig.msg = arg.content.msg;
  }

  //ファイルの上書き
  writeFileSync(
    resolvePath(writeFileDirPath, "./config.json"),
    JSON.stringify(newAppLocalConfig)
  );

  return newAppLocalConfig;
};
