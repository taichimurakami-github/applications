import { appConfig } from "../app.config";

//style import
import "./styles/modules/Config.scss";

const Config = (props) => {

  const handleBackToTop = () => {
    props.onHandleAppState({ now: "TOP" });
  };

  const handleChangeAppConfig = (e) => {
    console.log(e.target.id);
    console.log(appConfig.fn.stable.eraceAppDataTodayAll, !appConfig.fn.stable.eraceAppDataTodayAll);
    switch (e.target.id) {

      case "toggle_cancelOperation":
        props.onHandleChangeAppLocalConfig({
          id: "appConfig_fn_cancelOperation",
          status: "nightly",
          value: !props.appState.localConfig.fn.nightly.cancelOperation,
        });
        break;

      case "toggle_eraceAppDataTodayAll":
        props.onHandleChangeAppLocalConfig({
          id: "appConfig_fn_eraceAppDataTodayAll",
          status: "stable",
          value: !props.appState.localConfig.fn.stable.eraceAppDataTodayAll,
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
      const result = await window.electron.ipcRenderer.invoke("handle_studentsList", { mode: "changeConfigPath", data: e.target.files[0].path });
      console.log(result);
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

  return (
    <div className="component-config-wrapper">
      <h1>アプリ設定</h1>

      <h2>設定項目</h2>
      <div className="btn-container">
        <button className="btn read-student-list" onClick={onReadStudentsFile}>生徒情報ファイルを設定する</button>
        {
          props.appState.localConfig.fn.stable.eraceAppDataTodayAll &&
          <button className="btn erace-today-data-all" onClick={onEraceAppData}>アプリ内部データを削除する</button>
        }
      </div>

      <h2>機能のon/off</h2>

      <div className="toggle-btn-wrapper btn__toggle">
        <p>直前の操作を取り消す</p>
        <button
          id="toggle_cancelOperation"
          className={`${"toggle-wrapper "}${props.appState.localConfig.fn.nightly.cancelOperation ? "active" : "unactive"}`}
          onClick={handleChangeAppConfig}>
          <span className="toggle"></span>
        </button>
      </div>

      <div className="toggle-btn-wrapper btn__toggle">
        <p>アプリ内部データ(1日分)を削除する</p>
        <button
          id="toggle_eraceAppDataTodayAll"
          className={`${"toggle-wrapper "}${props.appState.localConfig.fn.stable.eraceAppDataTodayAll ? "active" : "unactive"}`}
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
