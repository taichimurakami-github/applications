import { ipcRenderer } from "electron";
import { TContextBridgeAPI } from "~electron/@types/contextBridge";
import {
  TAttendanceState as _TAttendanceState,
  TSeatsState as _TSeatsState,
  TStudentsList as _TStudentsList,
} from "~electron/@types/main";

declare global {
  interface Window {
    electron: TContextBridgeAPI;
  }

  type TAppState = {
    selectedElement: null | HTMLElement;
    selectedSeat: string;
    now: string;
    localConfig: any;
    appLog: any;
  };

  type TStudentsList = _TStudentsList;

  type TOtherStudentData = {
    id: "__OTHERS__";
    name: "関係者等(記録されません)";
    grade: "";
    school: "";
    belongs: "";
  };

  type TAttendanceState = _TAttendanceState;

  type TModalStateContents = {
    confirmCode?: string;
    errorCode?: string;

    // //App.tsx
    studentId?: string;
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
  };

  type TModalState = {
    active: boolean;
    name: string;
    content: TModalStateContents;
  };

  type TSeatsState = _TSeatsState;

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
    appState: TAppState;
    seatsState: TSeatsState;
    attendanceState: TAttendanceState;
    studentsList: TStudentsList;
    modalState: TModalState;
    resetAppState: (arg: { mode: "APPLOG" | "DEFAULT"; content?: any }) => void;
    handleAppState: (d: { [index: string]: any }) => void;
    setAppState: React.Dispatch<React.SetStateAction<TAppState>>;
    setSeatsState: React.Dispatch<React.SetStateAction<TSeatsState>>;
    setStudentsList: React.Dispatch<React.SetStateAction<TStudentsList>>;
    setModalState: React.Dispatch<React.SetStateAction<TModalState>>;
    setAttendanceState: React.Dispatch<React.SetStateAction<TAttendanceState>>;
    handleModalState: (t: TModalState) => void;
  };
}
