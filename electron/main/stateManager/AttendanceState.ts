import { unlink } from "fs/promises";
import { resolve as resolvePath } from "path";
import { TAttendanceState } from "../../@types/main";
import { StateManagerBase } from "./StateManagerBase";

export class AttendanceState extends StateManagerBase<TAttendanceState> {
  constructor(fileDirPath: string) {
    super("AttendanceStateManager", fileDirPath);
  }

  public getFileName() {
    const now = new Date();
    return `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}.json`;
  }

  public getFilePath() {
    return resolvePath(this.FILE_DIR_PATH, this.getFileName());
  }

  public async deleteData() {
    if (!this._fileDirExists) {
      return false;
    }

    return await unlink(this.getFilePath())
      .then((_) => true)
      .catch((e) => {
        this._logError(this._ERR_ID.DELETE_FILE, e);
        return false;
      });
  }
}
