import { ipcRenderer } from "electron";

declare global {
  interface Window {
    electron: {
      ipcRenderer: ipcRenderer;
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

  interface modalStateContent {
    confirmCode?: string;
    errorCode?: string;

    // //App.tsx
    studentID?: string;
    nextSeatID?: string;
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

    //StudentsData.tsx
    studentData?: { [key: string]: string };
    targetID?: string;
    targetData?: { [key: string]: string };
  }

  interface modalState {
    active: boolean;
    name: string;
    content: modalStateContent;
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
    seatsState: seatsState | null;
    attendanceState: attendanceState | null;
    studentsList: studentsList | null;
    modalState: modalState;
    resetAppState: (arg: { mode: "APPLOG" | "DEFAULT"; content?: any }) => void;
    setAppState: React.Dispatch<React.SetStateAction<appState>>;
    setSeatsState: React.Dispatch<React.SetStateAction<seatsState | null>>;
    setStudentsList: React.Dispatch<React.SetStateAction<studentsList | null>>;
    setModalState: React.Dispatch<React.SetStateAction<modalState>>;
    setAttendanceState: React.Dispatch<
      React.SetStateAction<attendanceState | null>
    >;
    handleModalState: (t: modalState) => void;
  };
}
