import React from "react";

interface ConfigView {
  onHandleBackToTop: () => void;
  onReadStudentsFile: () => void;
  onEraceAppData: () => void;
  onExitAllStudents: () => void;
  onChangeAppConfig: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onChangeTopMessage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  topMessage: string;
  isEraceAppDataTodayAllEnabled: boolean;
  isCancelOperationEnabled: boolean;
}

const ConfigView = (props: ConfigView) => {
  return (
    <div className="component-config-wrapper">
      <h1>アプリ設定</h1>

      <button
        className="btn btn__typeC back-to-top-btn"
        onClick={props.onHandleBackToTop}
      >
        トップページに戻る
      </button>

      <div className="item-wrapper">
        <h2>TOP画面メッセージ編集</h2>
        <form className="top-msg-edit-form" onSubmit={props.onSubmit}>
          <textarea
            className="top-msg-editor"
            value={props.topMessage}
            onChange={props.onChangeTopMessage}
          ></textarea>
          <button className="btn  btn__typeC btn__submit" type="submit">
            TOP画面のメッセージを変更
          </button>
        </form>
      </div>

      <div className="item-wrapper">
        <h2>設定項目</h2>
        <div className="setting-btn-container">
          <button
            className="btn btn__typeC read-student-list"
            onClick={props.onExitAllStudents}
          >
            全員退席させる
          </button>
          <button
            className="btn  btn__typeC read-student-list"
            onClick={props.onReadStudentsFile}
          >
            生徒情報ファイルを設定する
          </button>
          {props.isEraceAppDataTodayAllEnabled && (
            <button
              className="btn  btn__typeC erace-today-data-all"
              onClick={props.onEraceAppData}
            >
              アプリ内部データを削除する
            </button>
          )}
        </div>
      </div>

      <div className="item-wrapper">
        <h2>機能のon/off</h2>

        <div className="toggle-btn-container btn__toggle">
          <b>直前の操作を取り消す</b>
          <button
            id="toggle_cancelOperation"
            className={`${"toggle-wrapper "}${
              props.isCancelOperationEnabled ? "active" : "unactive"
            }`}
            onClick={props.onChangeAppConfig}
          >
            <span className="toggle"></span>
          </button>
        </div>
        {/* <div className="toggle-btn-container btn__toggle">
          <b>アプリ内部データ(1日分)を削除する</b>
          <button
            id="toggle_eraceAppDataTodayAll"
            className={`${"toggle-wrapper "}${
              props.isEraceAppDataTodayAllEnabled ? "active" : "unactive"
            }`}
            onClick={props.onChangeAppConfig}
          >
            <span className="toggle"></span>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ConfigView;
