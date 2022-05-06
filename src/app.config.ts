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

/**
 * 名言・迷言集データベース
 * 退室時にランダムで表示するコメントのデータベースです。
 * 今のところは1種類のみ。
 */
const randomComments = {
  adage: [
    {
      author: "太宰治",
      content: "大人とは、裏切られた青年の姿である",
    },
    {
      author: "アインシュタイン",
      content:
        "私は天才ではありません。ただ、人より長く一つの事柄と付き合っていただけです。",
    },
    {
      author: "デンマークのことわざより",
      content:
        "みんなからの忠告に基づいて家を建てると、出来た家はいびつになる。",
    },
    {
      author: "マーク・トウェイン",
      content: "禁煙なんて簡単さ。私はもう何千回もやめてきたのだから。",
    },
    {
      author: "アナトール・フランス",
      content:
        "本は人に貸してはならない。貸せば戻ってこないからだ。私の書斎に残っている本といったら、そうやって人から借りたものばかりだ。",
    },
    {
      author: "アルマン・サラクルー",
      content:
        "人間は判断力の欠如によって結婚し、忍耐力の欠如によって離婚し、記憶力の欠如によって再婚する。",
    },
    {
      author: "リチャード・M・ニクソン",
      content: "人間は負けたら終わりなのではない。辞めたら終わりなのだ。",
    },
    {
      author: "（出典不明）",
      content: "幸せは去ったあとに光を放つ",
    },
    {
      author: "リチャード・バック",
      content:
        "責任を回避するいちばん良い方法は、「責任は果たしている」と言うことである。",
    },
    {
      author: "マルセル・プルースト",
      content:
        "時は過ぎゆく。そして少しずつ、我々が口にしてきた嘘は、真実になる。",
    },
    {
      author: "ロバート・フロスト",
      content:
        "1日8時間、誠実に働く。そうすればやがて人を使う立場になり、1日12時間働くことになる。",
    },
    {
      author: "長州力",
      content: "無事故、無違反で名を遺した人間はいない。",
    },
    {
      author: "イチロー",
      content:
        "何かを長期間、成し遂げるためには考えや行動を一貫させる必要がある。",
    },
    {
      author: "ウィトゲンシュタイン",
      content: "私の言語の限界が私の世界の限界を意味する。",
    },
    {
      author: "羽生 善治",
      content:
        "何事であれ、最終的には自分で考える覚悟がないと、情報の山に埋もれるだけである。",
    },
    {
      author: "ローランド",
      content:
        "世の中には3つのやり方がある。正しいやり方。間違ったやり方。そして俺のやり方。",
    },
    {
      author: "",
      content: "",
    },
    {
      author: "",
      content: "",
    },
    {
      author: "",
      content: "",
    },
  ],
};

/**
 * App.js react app states initialValue
 *
 * アプリの状態変数を定義しています。
 * いじらないでください
 *
 */
const appState_initialValue: appState = {
  selectedElement: null,
  selectedSeat: "",
  now: "TOP",
  localConfig: appConfig.localConfigTemplate,
  appLog: null,
};
const studentsList_initialValue: [] = [];
const attendanceState_initialValue: {} = {};
const seatsState_initialValue: seatsState = {
  seat1: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat2: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat3: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat4: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat5: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat6: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat7: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat8: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat9: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat10: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat11: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat12: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat13: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat14: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat15: {
    active: false,
    enterTime: "",
    studentID: "",
  },
  seat16: {
    active: false,
    enterTime: "",
    studentID: "",
  },
};
const modalState_initialValue: modalState = {
  active: false,
  name: "",
  content: {},
};

export {
  appConfig,
  randomComments,
  appState_initialValue,
  studentsList_initialValue,
  attendanceState_initialValue,
  seatsState_initialValue,
  modalState_initialValue,
};
