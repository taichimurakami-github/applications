import { appConfig } from "../../app.config";

const ErrorModal = (props) => {

  const activateConfig = () => {
    props.onHandleAppState({ now: "CONFIG" });
    props.onCloseModal(true);
  }

  const onCloseModal = () => props.onCloseModal(true);

  const handleComponent = () => {

    switch (props.content.errorCode) {

      //エラー：生徒情報が表示されていない
      case appConfig.errorCodeList["1001"]:
        return (
          <>
            <h2>生徒情報ファイルが読み込まれていません。</h2>
            <p>入室管理システムを使用できません。</p>
            <p>設定画面から、生徒情報ファイルを読み込んでください。</p>
            <button className="btn btn__typeC" onClick={activateConfig}>設定画面を開く</button>
          </>
        );

      case appConfig.errorCodeList["2001"]:
        return (
          <>
            <h2>ファイル読み込み中にエラーが発生しました。</h2>
            <p>指定されたファイル形式が間違っています。読み込めるファイル形式はxlsxのみです。</p>
            <button className="btn btn__typeC" onClick={onCloseModal}>閉じる</button>
          </>
        );

      case appConfig.errorCodeList["2002"]:
        return (
          <>
            <h2>生徒情報ファイルの読み込みに失敗しました。</h2>
            <p>指定されたファイル形式が間違っています。読み込めるファイル形式はxlsxのみです。</p>
          </>
        );

      case appConfig.errorCodeList["3001"]:
        return (
          <>
            <h2>{props.content.studentData.name} さんは既に着席しています</h2>
            <p>正しい名前を選択しているかもう一度ご確認ください。</p>
            <p>もしご本人の場合、一旦退席操作を行った上、改めて登録操作をしてください。</p>
            <button className="btn btn__typeC" onClick={onCloseModal}>閉じる</button>
          </>
        )

      default:
        throw new Error("Unexpected errorCode in ErrorModal.js");
    }
  }

  return (
    <>
      <div className="error-modal-container">
        {handleComponent()}
      </div>
    </>
  );
}

export { ErrorModal };