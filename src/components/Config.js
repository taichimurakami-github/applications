import { appConfig } from "../app.config";

const Config = (props) => {

  const handleBackToTop = () => {
    props.onHandleAppState({ now: "TOP" });
  };

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
      <h1>アプリ設定メニュー</h1>
      <div className="btn-container">
        <button className="btn read-student-list" onClick={onReadStudentsFile}>生徒情報ファイルを設定する</button>
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
