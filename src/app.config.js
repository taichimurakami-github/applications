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
 */

const appConfig = {
  appMode: {
    development: "DEVELOPMENT",
    production: "PRODUCTION",
  },
  // appComponentCodeList: {
  //   "1001": "TOP",
  //   "1002": "CONFIG",
  //   "1003": "STUDENT",
  // },
  modalCodeList: {
    "1001": "CONFIRM",
    "1002": "ERROR",
    "1003": "EXIT",
  },
  confirmCodeList: {
    //before execute confirm
    "1001": "SAVE_ATTENDANCE_ENTER",
    "1002": "SAVE_ATTENDANCE_EXIT",

    //after execute confirm
    "2001": "SAVE_ATTENDANCE_ENTER_DONE",
    "2002": "SAVE_ATTENDANCE_EXIT_DONE",
    "2003": "STUDENTS_FILE_LOADED_SUCCESSFULLY",
    "2004": "STUDENTS_FILE_CONFIG_PATH_CHANGED_SUCCESSFULLY",
  },
  errorCodeList: {
    //top page error list
    "1001": "NOT_READ_STUDENTSLIST_FILE",

    //config page error list
    "2001": "WRONG_FILE_TYPE_IS_LOADED",
    "2002": "FAILED_TO_CHANGE_CONFIG_PATH",

    //student data select page list
    "3001": "",
  },
}

export { appConfig }