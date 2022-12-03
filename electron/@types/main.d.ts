export type TAppLocalConfig = {
  version: string;
  path: {
    studentsList: string;
    attendance: string;
    seats: string;
  };
  appConfig: {
    msg: string;
    fn: { stable: { [key: string]: boolean }; nightly: {} };
  };
};

export type TSeatsState = {
  [seatId: string]: {
    active: boolean;
    enterTime: string;
    studentId: string;
  };
};

export type TAttendanceState = {
  [studentId: string]: {
    id: string;
    seatID: string;
    enter: string;
    exit?: string; //退席していない生徒のデータには含まれない
  }[];
};

export type TStudentsList = {
  id: string;
  name: string;
  school: "high" | "middle" | "elementary";
  grade: string;
  belongs: string;
}[];

export interface IStateManager<TData> {
  // STAE_ID: string;
  getFilePath: () => string;
  getFileName: () => string;
  readData: () => Promise<TData | undefined>;
  updateData: (newData: TData) => Promise<boolean>;
}
