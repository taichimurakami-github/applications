const Config = (props) => {
  const handleBackToTop = () => {
    props.onHandleAppState({now: "TOP"});
  }

  const onReadStudentsFile = () => {
    props.onReadXLSX();
  }

  return (
    <>
      <p>CONFIG COMPONENT</p>
      <button className="btn read-student-list" onClick={onReadStudentsFile}>生徒情報ファイルを読み込む</button>
      <button className="btn read-student-list" onClick={onReadStudentsFile}>生徒情報ファイルを読み込む</button>
      <button className="btn btn__typeC" onClick={handleBackToTop}>トップページに戻る</button>
    </>
  );
}

export {Config};