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

  /**
   * ---appConfigへようこそ---
   * 
   * アプリの動作を細かく設定できるファイルです。
   * 以下に説明を記します。
   * 
   * (1)本ファイルを変更した場合は、ビルドし直さないとアプリ自体に反映されません。
   * (2)以下の説明に載せたプロパティ以外は絶対に変更しないこと。アプリが正常動作しなくなります。
   * (3)該当機能のプロパティをfalseもしくはfalthy値に変更することで、その機能を無効化することができます。
   * (4)そもそもこの機能自体がまだまだ実装途中なので、今後設定項目は増えると思います。
   * 
   * 
   * ---変更可能なプロパティの説明---
   * 
   * ・nightly
   * 開発中の実験的な機能です。正式に実装が完了したものは後述のfunctionsオブジェクトに格納されます。
   * 実験的な機能ですので、実戦投入はおすすめできません。
   * 
   * ・functions
   * 正式に実装された機能です。何らかの不具合があった場合、速やかにプロパティをfalseに変えることで、
   * 該当機能を無効化することができます。
   * 
   */

  //開発中の機能を試すかどうかを選択
  //該当機能をtrueに設定するとアプリのGUI上に表示される
  nightly: {
    cancelOperation: true
  },

  //実装済みの機能を有効にするかどうかを選択
  //該当機能をtrueに設定するとアプリのGUI上に表示される
  stable: {
    eraceAppDataTodayAll: true,
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
  modalCodeList: {
    "1001": "CONFIRM",
    "1002": "ERROR",
    "1003": "EXIT",
  },
  confirmCodeList: {
    //before execute confirm
    "1001": "SAVE_ATTENDANCE_ENTER",
    "1002": "SAVE_ATTENDANCE_EXIT",
    "1003": "ERACE_APPDATA_TODAY_ALL",

    //after execute confirm
    "2001": "SAVE_ATTENDANCE_ENTER_DONE",
    "2002": "SAVE_ATTENDANCE_EXIT_DONE",
    "2003": "STUDENTS_FILE_LOADED_SUCCESSFULLY",
    "2004": "STUDENTS_FILE_CONFIG_PATH_CHANGED_SUCCESSFULLY",
    "2005": "APPLOCALDATA_ERACED_SUCCESSFULLY",

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
}

export { appConfig }