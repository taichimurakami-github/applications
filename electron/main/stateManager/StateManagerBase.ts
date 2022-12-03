import { readFile, writeFile, constants, access, mkdir } from "fs/promises";
import { IStateManager } from "../../@types/main";

export abstract class StateManagerBase<TData> implements IStateManager<TData> {
  private _data: TData | undefined;
  private _readonly: boolean;
  protected _fileDirExists: boolean;
  public readonly STATE_ID: string;
  public readonly FILE_DIR_PATH: string;

  protected _ERR_ID: {
    READ_FILE: "E_FAILDED_TO_READ_FILE";
    READ_DIR: "E_FAILED_TO_READ_DIR";
    WRITE_FILE: "E_FAILED_TO_WRITE_FILE";
    CREATE_DIR: "E_FAILED_TO_CREATE_DIR";
    CREATE_FILE: "E_FAILED_TO_CREATE_FILE";
    DELETE_FILE: "E_FAILED_TO_DELETE_FILE";
  };

  constructor(
    stateId: string,
    fileDirPath: string,
    enableReadonlyMode: boolean = false
  ) {
    this._fileDirExists = false;
    this._readonly = enableReadonlyMode;
    this.STATE_ID = stateId;
    this.FILE_DIR_PATH = fileDirPath;

    // 記録用ディレクトリ存在確認
    if (!enableReadonlyMode) {
      this._resolveFileDir();
    }
  }

  public getData() {
    return this._data;
  }

  protected async _setData(data: TData) {
    if (!this._fileDirExists) {
      this._data = undefined;
      return this.getData();
    }

    try {
      console.log(`${this.STATE_ID} : writing new file...`);
      await writeFile(this.getFilePath(), JSON.stringify(data));
      this._data = data;
    } catch (e) {
      this._logError(this._ERR_ID.WRITE_FILE, e);
      this._data = undefined;
    }

    return this.getData();
  }

  /**
   * Check if path is acceissible or not.
   * Path can be directory or each specific file.
   */
  private async _checkPathAccessibility(path: string) {
    return await access(path, constants.W_OK | constants.R_OK)
      .then((_) => true)
      .catch((e) => false);
  }

  /**
   * Log helper for undefined error
   * @param errorId
   * @param errorObj
   */
  protected _logError(errorId: string, errorObj: any) {
    console.error(`${this.STATE_ID} : ${errorId}`);
    console.error(`Cannot execute operation due to below error.`);
    console.error(errorObj);
  }

  protected async _resolveFileDir() {
    if (this._checkPathAccessibility(this.FILE_DIR_PATH)) {
      return this._fileDirExists;
    }

    //create new directory
    try {
      console.log(`${this.STATE_ID} : making file directory...`);
      const craetedPath = await mkdir(this.FILE_DIR_PATH, {
        recursive: true,
      });
      console.log("Directory is successfully created, at", craetedPath);
      return (this._fileDirExists = true);
    } catch (e) {
      this._logError(this._ERR_ID.CREATE_DIR, e);
      return (this._fileDirExists = false);
    }
  }

  public async readData() {
    console.log(`${this.STATE_ID} : reading bcup file from local directory...`);
    if (!this._fileDirExists) {
      this._logError(
        this._ERR_ID.READ_FILE,
        `Target directory is not accessible.`
      );
      return undefined;
    }

    const data = await readFile(this.getFilePath(), "utf-8")
      .then((d) => JSON.parse(d))
      .catch((e) => {
        this._logError(this._ERR_ID.READ_FILE, e);
        return undefined;
      });

    return await this._setData(data);
  }

  public async updateData(data: TData) {
    if (this._readonly) {
      this._logError(
        this._ERR_ID.WRITE_FILE,
        "Trying update operation but readonly flg is activated. Code shold be wrong."
      );
      console.error(
        `${this.STATE_ID} : E_FAILED_TO_DISPATCH_UPDATE_STATE_METHOD`
      );
      console.error(`${this.STATE_ID} : readonly mode is enabled.`);
      return false;
    }

    return Boolean(await this._setData(data));
  }

  public abstract getFileName(): string;

  public abstract getFilePath(): string;
}
