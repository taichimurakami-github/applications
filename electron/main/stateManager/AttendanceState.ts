import { unlinkSync } from "fs";
import { resolve as resolvePath } from "path";
import { TAttendanceState } from "../../@types/main";
import { AppConfigState } from "./AppConfigState";
import { StateManagerBase } from "./StateManagerBase";

export class AttendanceState extends StateManagerBase<TAttendanceState> {
  constructor(Config: AppConfigState) {
    super("AttendanceStateManager", Config.getAttendanceDir());
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
      console.error("E_FAILED_TO_DELETE_ATTENDANCE_STATE_LATEST_FILE");
      console.log(e);
      return false;
    }
  }
}
