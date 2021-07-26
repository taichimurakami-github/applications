const ErrorModal = (props) => {

  const activateConfig = () => {
    props.content.onHandleAppState({now: "CONFIG"});
    props.onCloseModal(true);
  }

  const handleComponent = () => {

    switch(props.content.mode){
      case "NOT_READ_STUDENTSLIST_FILE":
        return (
          <>
            <h2>エラーが発生しました！</h2>
            <p>生徒情報ファイルが読み込まれていません。</p>
            <p>設定画面から、生徒情報ファイルを読み込んでください。</p>
            <button className="btn btn__typeC" onClick={activateConfig}>設定画面を開く</button>
          </>
        )
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

export {ErrorModal};