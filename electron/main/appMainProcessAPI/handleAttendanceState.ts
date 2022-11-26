import { existsSync, readFileSync, writeFileSync } from "original-fs";

export const readAttendanceState = (readFilePath) => {
  console.log("now reading attendanceState...");
  return new Promise((resolve, reject) => {
    if (existsSync(readFilePath)) {
      const r = JSON.parse(readFileSync(readFilePath, "utf-8"));
      return resolve(r);
    } else {
      return resolve(undefined);
    }
  });
};

export const writeAttendanceState = (writeFilePath, data) => {
  console.log("writing attendanceState...");
  writeFileSync(writeFilePath, data);
};
