import { readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { resolve as resolvePath } from "path";

export const readSeatsState = (fileName, fileDirPath, fullFilePath) => {
  console.log("ready for reading seatsState...");
  //本日付のバックアップファイルがあるか確認
  const dirFiles = readdirSync(fileDirPath);
  let bcupFileExists = false;

  for (let val of dirFiles) {
    //定義したファイル名と一致するファイルがあればbcupFileExistsをtrueに、
    //それ以外のファイルは削除する(座席状態のバックアップデータ重複を避けるため)
    val === fileName
      ? (bcupFileExists = true)
      : unlinkSync(resolvePath(fileDirPath, val));
  }

  console.log("reading seatsState...");
  //既にseatsStateのバックアップデータがある場合 -> 読み込み
  //既にseatsStateのバックアップデータがない場合 -> falseを返す
  return new Promise((resolve) => {
    bcupFileExists
      ? resolve(JSON.parse(readFileSync(fullFilePath, "utf-8")))
      : resolve(undefined);
  });
};

export const writeSeatsState = (fullFilePath, data) => {
  console.log("writing seatsState...");
  writeFileSync(fullFilePath, data);
};
