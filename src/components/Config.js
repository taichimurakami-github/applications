import { useState } from "react";

const Config = (props) => {
  const [state, setState] = useState({
    studentListFile: {
      lastLoadDate: "",
    },
  });

  const handleBackToTop = () => {
    props.onHandleAppState({now: "TOP"});
  };

  const onReadStudentsFile = async () => {
    await props.onReadXLSX();
    const date = new Date();

    setState({
      ...state, 
      studentListFile: {
        lastLoadDate: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      }
    });
  };

  return (
    <div className="component-config-wrapper">
      <h1>アプリ設定メニュー</h1>
      <div className="btn-container">
        <button className="btn read-student-list" onClick={onReadStudentsFile}>生徒情報ファイルを読み込む</button>
        {
          state.studentListFile.lastLoadDate !== "" ?
            <p className="">読み込み完了：{state.studentListFile.lastLoadDate}</p>
            :
            undefined
        }

      </div>
      <button className="btn btn__typeC" onClick={handleBackToTop}>トップページに戻る</button>
    </div>
  );
};

export {Config};