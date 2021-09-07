/**
 * attendance-management App configuration
 * 
 * object形式でアプリケーション実行に必要な定数データを保管
 * アプリ設定などの情報もまとめて保管する
 * 
 * !!!ATTENTION!!!
 * DO NOT CHANGE KEY & VALUE HERE EXCEPT DEVELOPERS.
 * APPLICATION CANNOT RUN PROPERLY
 * 
 * 値をいじらないでください
 * 
 */

const appConfig = {

  localConfigTemplate: {
    fn: {
      nightly: {
      },
      stable: {
        eraceAppDataTodayAll: false,
        cancelOperation: false,
        changeSeatID: false,
      }
    },
  },

  //--------------これより下、いじるべからず--------------//

  //アプリの動作モードを切り替えるコードで使用
  appMode: {
    development: "DEVELOPMENT",
    production: "PRODUCTION",
  },

  // appComponentCodeList: {
  //   "1001": "TOP",
  //   "1002": "CONFIG",
  //   "1003": "STUDENT",
  // },

  /**
   * for ModalWrapper.js
   */
  modalCodeList: {
    "1001": "CONFIRM",
    "1002": "ERROR",
    "1003": "SEATS",
  },
  confirmCodeList: {
    //before execute confirm
    "1001": "SAVE_ATTENDANCE_ENTER",
    "1002": "SAVE_ATTENDANCE_EXIT",
    "1003": "ERACE_APPDATA_TODAY_ALL",
    "1004": "CANCEL_CURRENT_OPERATION",

    //after execute confirm
    "2001": "SAVE_ATTENDANCE_ENTER_DONE",
    "2002": "SAVE_ATTENDANCE_EXIT_DONE",
    "2003": "STUDENTS_FILE_LOADED_SUCCESSFULLY",
    "2004": "STUDENTS_FILE_CONFIG_PATH_CHANGED_SUCCESSFULLY",
    "2005": "APPLOCALDATA_ERACED_SUCCESSFULLY",
    "2006": "CURRENT_OPERATION_IS_CANCELED_SUCCESSFULLY",
    "2007": "APP_LOCAL_CONFIG_IS_CHANGED_SUCCESSFULLY",
    "2008": "SEATID_IS_CHANGED_SUCCESSFULLY",

  },
  errorCodeList: {
    //top page error list
    "1001": "NOT_READ_STUDENTSLIST_FILE",

    //config page error list
    "2001": "WRONG_FILE_TYPE_IS_LOADED",
    "2002": "FAILED_TO_CHANGE_CONFIG_PATH",

    //student data select page list
    "3001": "SELECTED_ALREADY_SEATED_STUDENT",
  },

  /**
   * for SeatsModal.js
   */
  seatOperetionCodeList: {
    "1001": "CHANGE_SEATID"
  },
  seatsModalModeList: {
    "1001": "STUDENTS_LIST",
    "1002": "SELECT_NEW_SEAT"
  }
}


/**
 * App.js react app states initialValue
 * 
 * アプリの状態変数を定義しています。
 * いじらないでください
 * 
 */

const studentsList_initialValue: null = null;
const attendanceState_initialValue = {};
const seatsState_initialValue: seatsState = {
  seat1: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat2: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat3: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat4: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat5: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat6: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat7: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat8: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat9: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat10: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat11: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat12: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat13: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat14: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat15: {
    active: false,
    enterTime: "",
    studentID: ""
  },
  seat16: {
    active: false,
    enterTime: "",
    studentID: ""
  },
}
const modalState_initialValue: modalState = {
  active: false,
  name: "",
  content: {}
};


export {
  appConfig,
  studentsList_initialValue,
  attendanceState_initialValue,
  seatsState_initialValue,
  modalState_initialValue,
}