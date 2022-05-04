import React, { useContext, useState } from "react";
import { appConfig } from "../../app.config";
import { AppStateContext } from "../../AppContainer";
import useStudentsFileReader from "../../hooks/controllers/useStudentsFileReader";

//style import
import "../styles/modules/Config.scss";
import ConfigView from "../views/ConfigView";

interface ConfigContainerProps {
  onHandleAppState: (d: { [index: string]: any }) => void;
  onHandleChangeAppLocalConfig: (arg: {
    fn_id?: string;
    fn_status?: string;
    fn_value?: boolean;
    msg?: string;
  }) => Promise<void>;
  // appState: appState;
}

const Config: React.VFC<ConfigContainerProps> = (props) => {
  const { appState, handleModalState }: AppStateContext =
    useContext(AppStateContext);

  const studentsFileReader = useStudentsFileReader();

  const [topMessage, setTopMessage] = useState<string>(
    appState.localConfig.msg
  );

  const localConfig_fn = appState.localConfig.fn;

  const changeTopMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setTopMessage(e.target.value);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    //submitボタンを押したときの自動リロードを停止
    e.preventDefault();

    //appLocalConfigファイルを更新
    props.onHandleChangeAppLocalConfig({
      msg: topMessage,
    });

    const changedAppState = { ...appState };

    changedAppState.localConfig.msg = topMessage;
    changedAppState.now = "TOP";
    props.onHandleAppState({
      ...changedAppState,
    });

    handleModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        confirmCode: appConfig.confirmCodeList["2009"],
      },
    });
  };

  const backToTop = () => {
    props.onHandleAppState({ now: "TOP" });
  };

  const changeAppConfig = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const modalContents = {
      fn_id: "",
      fn_value: false,
    };

    switch (e.currentTarget.id) {
      case "toggle_cancelOperation":
        console.log(!localConfig_fn.stable.cancelOperation);
        modalContents.fn_id = "appConfig_fn_cancelOperation";
        modalContents.fn_value = !localConfig_fn.stable.cancelOperation;

        await props.onHandleChangeAppLocalConfig({
          fn_id: "appConfig_fn_cancelOperation",
          fn_status: "stable",
          fn_value: !localConfig_fn.stable.cancelOperation,
        });

        break;

      case "toggle_eraceAppDataTodayAll":
        modalContents.fn_id = "toggle_eraceAppDataTodayAll";
        modalContents.fn_value = !localConfig_fn.stable.eraceAppDataTodayAll;

        await props.onHandleChangeAppLocalConfig({
          fn_id: "appConfig_fn_eraceAppDataTodayAll",
          fn_status: "stable",
          fn_value: !localConfig_fn.stable.eraceAppDataTodayAll,
        });
        break;

      default:
        throw new Error(
          "an Error has occued in handleChangeAppConfig: invalid target id"
        );
    }

    //モーダル表示
    handleModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        confirmCode: appConfig.confirmCodeList["2007"],
        ...modalContents,
      },
    });
  };

  const eraceAppData = () => {
    handleModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        confirmCode: appConfig.confirmCodeList["1003"],
      },
    });
  };

  return (
    <ConfigView
      onHandleBackToTop={backToTop}
      onReadStudentsFile={studentsFileReader}
      onEraceAppData={eraceAppData}
      onChangeAppConfig={changeAppConfig}
      onChangeTopMessage={changeTopMessage}
      onSubmit={submit}
      topMessage={topMessage}
      isEraceAppDataTodayAllEnabled={localConfig_fn.stable.eraceAppDataTodayAll}
      isCancelOperationEnabled={localConfig_fn.stable.cancelOperation}
    />
  );
};

export { Config };

//デバッグ用関数
// useEffect(() => { console.log(topMessage) }, [topMessage]);

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
