import { writeFileSync, readFileSync } from "fs";
import { extname, resolve as resolvePath } from "path";
import { readFile as readXlsxFile, utils as xlsxUtils } from "xlsx";

export const readStudentsList = async (appLocalConfig) => {
  console.log("called readStudentsList");
  const fullPath = appLocalConfig.path.studentsList;
  console.log(appLocalConfig);
  console.log("readStudentsList path=", fullPath);

  try {
    const workbook = readXlsxFile(fullPath);

    //sheet名を指定
    /**
     * studentsListで読み込み不良が出た場合、まずはworkbookの中身を参照する事
     *
     * case 1: Sheetのidが0ではない
     */

    //生徒情報が格納されているSheetのID(何番目か)
    const SheetID = 0;

    //workbookの中からSheet情報を取得し、json化
    const Sheet = workbook.Sheets[workbook.SheetNames[SheetID]];
    // console.log(Sheet);
    const data_json = xlsxUtils.sheet_to_json(Sheet);
    return data_json;
  } catch (e) {
    console.log("failed to read studentsList (main.js line 85~)");
    console.log(e);
    return undefined;
  }
};

export const changeStudentListPathConfig = async (
  arg,
  appLocalConfig,
  appConfigDirPath
) => {
  const filepath = arg.data;
  const ALLOW_EXT_LIST = [".xlsx", ".xlsm"];

  if (typeof filepath !== "string" || filepath === "") {
    return false;
  }

  const fileExtension = extname(filepath);

  if (!ALLOW_EXT_LIST.includes(fileExtension)) return false;

  appLocalConfig.path.studentsList = filepath;

  console.log("\n\nnew app local config data:");

  try {
    writeFileSync(
      resolvePath(appConfigDirPath, "./config.json"),
      JSON.stringify(appLocalConfig)
    );
    console.log(true);
    return true;
  } catch (e) {
    console.log(e);
    console.log("E_INVALID_FILE_EXTENSION");
    return false;
  }
};
