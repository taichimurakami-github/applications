import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { IStateManager } from "../../@types/main";

export abstract class StateManagerBase<TData> implements IStateManager<TData> {
  private _data: TData | undefined;
  private _readonly: boolean;
  protected _fileDirExists: boolean;
  public readonly STATE_ID: string;
  public readonly FILE_DIR_PATH: string;

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

  protected _setData(data: TData) {
    if (!this._fileDirExists) {
      this._data = undefined;
      return this.getData();
    }

    try {
      console.log(`${this.STATE_ID} : writing new file...`);
      writeFileSync(this.getFilePath(), JSON.stringify(data));
      this._data = data;
    } catch (e) {
      console.error(`${this.STATE_ID} : E_FAILED_TO_WRITE_FILE`);
      console.log(e);
      this._data = undefined;
    }

    return this.getData();
  }

  protected _resolveFileDir() {
    if (!existsSync(this.FILE_DIR_PATH)) {
      console.log(`${this.STATE_ID} : making file directory...`);
      mkdirSync(this.FILE_DIR_PATH);
    }

    this._fileDirExists = true;
  }

  public abstract getFileName(): string;

  public abstract getFilePath(): string;

  public readData() {
    console.log(`${this.STATE_ID} : reading bcup file from local directory...`);
    if (!this._fileDirExists) {
      console.error(`${this.STATE_ID} : E_FAILED_TO_READ_FILE`);
      return undefined;
    }

    const filePath = this.getFilePath();
    const data: undefined | TData = existsSync(filePath)
      ? JSON.parse(readFileSync(filePath, "utf-8"))
      : undefined;

    if (!data) {
      return undefined;
    }

    return this._setData(data);
  }

  public updateData(data: TData) {
    if (this._readonly) {
      console.error(
        `${this.STATE_ID} : E_FAILED_TO_DISPATCH_UPDATE_STATE_METHOD`
      );
      console.error(`${this.STATE_ID} : readonly mode is enabled.`);
      return false;
    }

    return Boolean(this._setData(data));
  }
}
