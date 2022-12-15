import { existsSync } from "fs";
import { TStudentsList } from "../../@types/main";
import { StateManagerBase } from "./StateManagerBase";
import { readFile as readXlsxFile, utils as xlsxUtils } from "xlsx";
import { AppConfigState } from "./AppConfigState";

export class StudentsListState extends StateManagerBase<TStudentsList> {
  private _appConfig: AppConfigState;
  private _sourceFileTargetSheetId: number;

  constructor(appConfig: AppConfigState) {
    super("StudentsListManager", "", true);
    this._appConfig = appConfig;
    this._sourceFileTargetSheetId = 0;
  }

  public getFileName() {
    return "";
  }

  public getFilePath() {
    return this._appConfig.getStudentsFilepath();
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
      workbook.Sheets[workbook.SheetNames[this._sourceFileTargetSheetId]];
    const data_json = xlsxUtils.sheet_to_json(sheetData) as TStudentsList;

    return data_json;
  }
}
