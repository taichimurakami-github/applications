import { ipcRenderer } from "electron";

declare global {
  interface Window {
    electron: {
      ipcRenderer: ipcRenderer;
      ipcRendererOn: any;
      onListenUpdateProcess: (
        handler: (events: any, ...args: any) => void
      ) => void;
    };
  }

  interface appState {
    selectedElement: null | HTMLElement;
    selectedSeat: string;
    now: string;
    localConfig: any;
    appLog: any;
  }

  /**
   * ???どういう型定義???
   * studentsListのデータ型を考えておく必要がある
   */
  // interface studentsList {
  //   [index: string]: array[{ [index: string]: string }]
  // }

  //interfaceではなく型エイリアスで宣言
  type studentsList = { [index: string]: string }[];

  interface attendanceState {
    [index: string]: array[{ [index: string]: string }];
  }

  interface modalStateContents {
    confirmCode?: string;
    errorCode?: string;

    // //App.tsx
    studentID?: string;
    nextSeatID?: string;
    timeLength?: number[];
    exitTime?: string;
    enterTime?: string;

    // //Top.tsx
    studentName?: string;
    currentOperation?: string;

    // Config.tsx
    fn_id?: string;
    fn_status?: string;
    fn_value?: boolean;
    msg?: string;
    handler?: (arg?: any) => void;

    //StudentsData.tsx
    studentData?: { [key: string]: string };
    targetID?: string;
    targetData?: { [key: string]: string };
  }

  interface modalState {
    active: boolean;
    name: string;
    content: modalStateContents;
  }

  interface seatsState {
    [index: string]: {
      active: boolean;
      enterTime: string;
      studentID: string;
    };
  }

  interface appConfig {
    localConfigTemplate: {
      msg: string;
      fn: {
        nightly: {} | { [index: string]: any };
        stable: {} | { [index: string]: any };
      };
    };
    fn: any;
    msg: string;
    appMode: {
      development: string;
      production: string;
    };
    modalCodeList: {
      [index: string]: string;
    };
    confirmCodeList: {
      [index: string]: string;
    };
    errorCodeList: {
      [index: string]: string;
    };
    seatOperationCodeList: {
      [index: string]: string;
    };
    seatsModalModeList: {
      [index: string]: string;
    };
  }

  type AppStateContext = {
    appState: appState;
    seatsState: seatsState;
    attendanceState: attendanceState;
    studentsList: studentsList;
    modalState: modalState;
    resetAppState: (arg: { mode: "APPLOG" | "DEFAULT"; content?: any }) => void;
    handleAppState: (d: { [index: string]: any }) => void;
    setAppState: React.Dispatch<React.SetStateAction<appState>>;
    setSeatsState: React.Dispatch<React.SetStateAction<seatsState>>;
    setStudentsList: React.Dispatch<React.SetStateAction<studentsList>>;
    setModalState: React.Dispatch<React.SetStateAction<modalState>>;
    setAttendanceState: React.Dispatch<React.SetStateAction<attendanceState>>;
    handleModalState: (t: modalState) => void;
  };
}
