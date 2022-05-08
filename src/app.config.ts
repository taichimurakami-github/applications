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

const appConfig: appConfig = {
  localConfigTemplate: {
    msg: "",
    fn: {
      nightly: {},
      stable: {
        eraceAppDataTodayAll: false,
        cancelOperation: false,
        changeSeatID: false,
      },
    },
  },

  fn: {},
  msg: "",

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
    "1004": "NEWS",
  },
  confirmCodeList: {
    //before execute confirm
    "1001": "SAVE_ATTENDANCE_ENTER",
    "1002": "SAVE_ATTENDANCE_EXIT",
    "1003": "ERACE_APPDATA_TODAY_ALL",
    "1004": "CANCEL_CURRENT_OPERATION",
    "1005": "FORCE_EXIT_ALL_STUDENTS_NOW_ATTENDING",

    //after execute confirm
    "2001": "SAVE_ATTENDANCE_ENTER_DONE",
    "2002": "SAVE_ATTENDANCE_EXIT_DONE",
    "2003": "STUDENTS_FILE_LOADED_SUCCESSFULLY",
    "2004": "STUDENTS_FILE_CONFIG_PATH_CHANGED_SUCCESSFULLY",
    "2005": "APPLOCALDATA_ERACED_SUCCESSFULLY",
    "2006": "CURRENT_OPERATION_IS_CANCELED_SUCCESSFULLY",
    "2007": "APP_LOCAL_CONFIG_IS_CHANGED_SUCCESSFULLY",
    "2008": "SEATID_IS_CHANGED_SUCCESSFULLY",
    "2009": "TOPMESSAGE_IS_CHANGED_SUCCESSFULLY",
    "2010": "FORCE_EXIT_ALL_STUDENTS_NOW_ATTENDING_DONE",
    "2011": "ERACE_APPDATA_TODAY_ALL_DONE",
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
  seatOperationCodeList: {
    "1001": "CHANGE_SEATID",
  },
  seatsModalModeList: {
    "1001": "STUDENTS_LIST",
    "1002": "SELECT_NEW_SEAT",
  },
};

export { appConfig };
