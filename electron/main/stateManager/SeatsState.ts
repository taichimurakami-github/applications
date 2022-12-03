import { readdir, unlink } from "fs/promises";
import { resolve as resolvePath } from "path";
import { TSeatsState } from "../../@types/main";
import { StateManagerBase } from "./StateManagerBase";

export class SeatsState extends StateManagerBase<TSeatsState> {
  constructor(fileDirPath: string) {
    super("SeatsStateManager", fileDirPath);

    this._deleteOldFiles();
  }

  private async _deleteOldFiles() {
    //本日付以外のファイルは不要なため削除する
    try {
      const fileNameList = await readdir(this.FILE_DIR_PATH).catch(
        (e): undefined => {
          this._logError(this._ERR_ID.READ_DIR, e);
          return undefined;
        }
      );

      if (!fileNameList || fileNameList.length === 0) {
        return;
      }

      for (const fileName of fileNameList) {
        if (fileName !== this.getFileName())
          unlink(resolvePath(this.FILE_DIR_PATH, fileName)).catch((e) =>
            this._logError(this._ERR_ID.DELETE_FILE, e)
          );
      }
    } catch (e) {}
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
