import { rm, lstat } from "fs/promises";

export const getPathExists = (path: string) =>
  lstat(path)
    .then((_) => true)
    .catch((e) => {
      console.log(e);
      return false;
    });

export const removePath = (path: string, recursive: boolean = true) =>
  rm(path, { recursive: recursive }).catch((e) => console.log(e));
