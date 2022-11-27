import { readdirSync, unlinkSync } from "fs";
import { resolve as resolvePath } from "path";
import { TSeatsState } from "../../@types/main";
import { AppConfigState } from "./AppConfigState";
import { StateManagerBase } from "./StateManagerBase";

export class SeatsState extends StateManagerBase<TSeatsState> {
  constructor(Config: AppConfigState) {
    super("SeatsStateManager", Config.getSeatsDir());

    this._deleteOldFiles();
  }

  private _deleteOldFiles() {
    //本日付以外のファイルは不要なため削除する
    try {
      for (const fileName of readdirSync(this.FILE_DIR_PATH)) {
        if (fileName !== this.getFileName()) {
          unlinkSync(resolvePath(this.FILE_DIR_PATH, fileName));
        }
      }
    } catch (e) {
      console.error("E_FAILED_TO_DELETE_OLD_SEATS_STATE_FILE");
    }
  }

  public getFileName() {
    const now = new Date();
    return `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}.json`;
  }

  public getFilePath() {
    return resolvePath(this.FILE_DIR_PATH, this.getFileName());
  }

  public deleteData() {
    if (!this._fileDirExists) {
      return false;
    }

    try {
      unlinkSync(this.getFilePath());
      return true;
    } catch (e) {
      console.error("E_FAILED_TO_DELETE_SEAT_STATE_LATEST_FILE");
      console.log(e);
      return false;
    }
  }
}
