import { existsSync } from "fs";
import { TStudentsList } from "../../@types/main";
import { StateManagerBase } from "./StateManagerBase";
import { readFile as readXlsxFile, utils as xlsxUtils } from "xlsx";
import { AppConfigState } from "./AppConfigState";

export class StudentsListState extends StateManagerBase<TStudentsList> {
  public readonly SOURCE_FILE_PATH: string;
  public readonly SOURCE_FILE_TARGET_SHEET_ID: number; //生徒情報が格納されているxlsxデータ内のSheetのID（指定したSheetを読み込む）

  constructor(sourceFilePath: string) {
    super("StudentsListManager", "", true);

    this.SOURCE_FILE_PATH = sourceFilePath;
    this.SOURCE_FILE_TARGET_SHEET_ID = 0;
  }

  public getFileName() {
    return "";
  }

  public getFilePath() {
    return this.SOURCE_FILE_PATH;
  }

  public override readData(): TStudentsList | undefined {
    console.log(
      `${this.STATE_ID} : reading bcup file from config directory...`
    );

    const filePath = this.getFilePath();

    const workbook = existsSync(filePath) ? readXlsxFile(filePath) : undefined;

    if (!workbook) {
      return undefined;
    }

    const sheetData =
      workbook.Sheets[workbook.SheetNames[this.SOURCE_FILE_TARGET_SHEET_ID]];
    const data_json = xlsxUtils.sheet_to_json(sheetData) as TStudentsList;

    return data_json;
  }
}
