import React, { useEffect, useState } from "react";
import { appConfig } from "../app.config";

//style import
import "./styles/modules/Config.scss";

interface ConfigComponentProps {
  onHandleStudentFile: React.Dispatch<React.SetStateAction<[] | studentsList>>,
  onHandleAppState: (d: { [index: string]: any; }) => void,
  onReadStudentsList: React.Dispatch<React.SetStateAction<[] | studentsList>>,
  onHandleModalState: (t: modalState) => void,
  onHandleChangeAppLocalConfig: (arg: { fn_id?: string, fn_status?: string, fn_value?: boolean, msg?: string }) => Promise<void>,
  appState: appState
}

const Config: React.VFC<ConfigComponentProps> = (props) => {

  const localConfig_fn = props.appState.localConfig.fn;

  const [topMessage, setTopMessage] = useState<string>(props.appState.localConfig.msg);

  const onChangeTopMsg = (e: React.ChangeEvent<HTMLTextAreaElement>) => setTopMessage(e.target.value);

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //submitボタンを押したときの自動リロードを停止
    e.preventDefault();

    //appLocalConfigファイルを更新
    props.onHandleChangeAppLocalConfig({
      msg: topMessage,
    });

    const changedAppState = { ...props.appState };

    changedAppState.localConfig.msg = topMessage;
    changedAppState.now = "TOP"
    props.onHandleAppState({
      ...changedAppState
    });

    props.onHandleModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        confirmCode: appConfig.confirmCodeList["2009"]
      }
    });
  }

  const handleBackToTop = () => {
    props.onHandleAppState({ now: "TOP" });
  };

  const handleChangeAppConfig = (e: React.MouseEvent<HTMLButtonElement>) => {

    switch (e.currentTarget.id) {

      // case "toggle_changeSeatID":
      //   props.onHandleChangeAppLocalConfig({
      //     id: "appConfig_fn_eraceAppDataTodayAll",
      //     status: "stable",
      //     value: !localConfig_fn.stable.changeSeatID,
      //   });
      //   break;

      case "toggle_cancelOperation":
        console.log(!localConfig_fn.stable.cancelOperation);
        props.onHandleChangeAppLocalConfig({
          fn_id: "appConfig_fn_cancelOperation",
          fn_status: "stable",
          fn_value: !localConfig_fn.stable.cancelOperation
        });
        break;

      case "toggle_eraceAppDataTodayAll":
        props.onHandleChangeAppLocalConfig({
          fn_id: "appConfig_fn_eraceAppDataTodayAll",
          fn_status: "stable",
          fn_value: !localConfig_fn.stable.eraceAppDataTodayAll,
        });
        break;

      default:
        throw new Error("an Error has occued in handleChangeAppConfig: invalid target id");
    }
  }

  const onEraceAppData = () => {
    props.onHandleModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        confirmCode: appConfig.confirmCodeList["1003"],
      }
    })
  }

  const onReadStudentsFile = () => {
    const debugInput = document.createElement("input");
    // const acceptFileTypeList = [".xlsx", ".csv"];

    debugInput.type = "file";
    debugInput.click();
    debugInput.addEventListener("change", async (e) => {
      const input = e.target as HTMLInputElement;
      const result
        = await window.electron.ipcRenderer
          .invoke("handle_studentsList", {
            mode: "changeConfigPath",
            data: (input.files === null) ? null : input.files[0].path
          });

      // console.log(result);
      //成功した場合
      if (result === true) {
        props.onHandleModalState({
          active: true,
          name: appConfig.modalCodeList["1001"],
          content: {
            confirmCode: appConfig.confirmCodeList["2004"],
          }
        });
        const studentsList_loadedData = await window.electron.ipcRenderer.invoke("handle_studentsList", { mode: "read" });
        studentsList_loadedData && props.onReadStudentsList(studentsList_loadedData);

      }
      //失敗した場合
      else {
        props.onHandleModalState({
          active: true,
          name: appConfig.modalCodeList["1002"],
          content: {
            errorCode: appConfig.errorCodeList["2001"],
          }
        })
      }
    })
  };

  //デバッグ用関数
  useEffect(() => { console.log(topMessage) }, [topMessage]);


  return (
    <div className="component-config-wrapper">
      <h1>アプリ設定</h1>

      <h2>メッセージ編集</h2>
      <form onSubmit={handleOnSubmit}>
        <textarea className="top-msg-editor" value={topMessage} onChange={onChangeTopMsg}></textarea>
        <button type="submit">TOP画面のメッセージを変更する</button>
      </form>

      <h2>設定項目</h2>
      <div className="btn-container">
        <button className="btn read-student-list" onClick={onReadStudentsFile}>生徒情報ファイルを設定する</button>
        {
          localConfig_fn.stable.eraceAppDataTodayAll &&
          <button className="btn erace-today-data-all" onClick={onEraceAppData}>アプリ内部データを削除する</button>
        }
      </div>

      <h2>機能のon/off</h2>

      {/* <div className="toggle-btn-wrapper btn__toggle">
        <p>座席を移動する</p>
        <button
          id="toggle_changeSeatID"
          className={`${"toggle-wrapper "}${localConfig_fn.stable.changeSeatID ? "active" : "unactive"}`}
          onClick={handleChangeAppConfig}>
          <span className="toggle"></span>
        </button>
      </div> */}

      <div className="toggle-btn-wrapper btn__toggle">
        <p>直前の操作を取り消す</p>
        <button
          id="toggle_cancelOperation"
          className={`${"toggle-wrapper "}${localConfig_fn.stable.cancelOperation ? "active" : "unactive"}`}
          onClick={handleChangeAppConfig}>
          <span className="toggle"></span>
        </button>
      </div>

      <div className="toggle-btn-wrapper btn__toggle">
        <p>アプリ内部データ(1日分)を削除する</p>
        <button
          id="toggle_eraceAppDataTodayAll"
          className={`${"toggle-wrapper "}${localConfig_fn.stable.eraceAppDataTodayAll ? "active" : "unactive"}`}
          onClick={handleChangeAppConfig}>
          <span className="toggle"></span>
        </button>
      </div>

      <button className="btn btn__typeC" onClick={handleBackToTop}>トップページに戻る</button>
    </div>
  );
};

export { Config };

/**
 * function readXLSXFileByUser()
 *
 * xlsx読み込み用関数
 * inputを用いてユーザーが手動で読み込む
 * config専用の関数
 *
 * @returns {object:Promise}
 */
// const readXLSXFileByUser = async () => {
//   console.log("xlsxファイルの読み込みを行ってください。");
//   return new Promise((resolve) => {
//     const debugInput = document.createElement("input");
//     const acceptFileTypeList = [".xlsx", ".csv"];

//     debugInput.type = "file";
//     debugInput.click();
//     debugInput.addEventListener("change", e => {
//       const file = e.target.files[0];

//       //ファイルの拡張子をチェック
//       const fileTypeCheckResult = acceptFileTypeList.filter((val) => {
//         return file.name.indexOf(val) !== -1;
//       });

//       if (fileTypeCheckResult.length === 0) {
//         setModalState({
//           active: true,
//           name: appConfig.modalCodeList["1002"],
//           content: {
//             errorCode: appConfig.errorCodeList["2001"],
//             onHandleAppState: handleAppState,
//           },
//         });
//       }

//       file.arrayBuffer().then((buffer) => {
//         const workbook = XLSX.read(buffer, { type: 'buffer', bookVBA: true })
//         const firstSheetName = workbook.SheetNames[1]
//         const worksheet = workbook.Sheets[firstSheetName]
//         const data = XLSX.utils.sheet_to_json(worksheet)

//         setStudentsList(data);

//         setModalState({
//           active: true,
//           name: appConfig.modalCodeList["1001"],
//           content: {
//             confirmCode: appConfig.confirmCodeList["2003"],
//             onHandleAppState: handleAppState,
//           },
//         });
//       });

//       //return Promise.resolve
//       return resolve();
//     });
//   })
// };
