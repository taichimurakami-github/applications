import { useCallback, useContext } from "react";
import { appConfig } from "../../app.config";
import { AppStateContext } from "../../AppContainer";

const useStudentsFileReader = () => {
  const { setStudentsList, handleModalState }: AppStateContext =
    useContext(AppStateContext);

  const studentsFileReader = useCallback(() => {
    const debugInput = document.createElement("input");
    // const acceptFileTypeList = [".xlsx", ".csv"];

    debugInput.type = "file";
    debugInput.click();
    debugInput.addEventListener("change", async (e) => {
      const input = e.target as HTMLInputElement;
      const result = await window.electron.ipcRenderer.invoke(
        "handle_studentsList",
        {
          mode: "changeConfigPath",
          data: input.files === null ? null : input.files[0].path,
        }
      );

      // console.log(result);
      //成功した場合
      if (result === true) {
        handleModalState({
          active: true,
          name: appConfig.modalCodeList["1001"],
          content: {
            confirmCode: appConfig.confirmCodeList["2004"],
          },
        });
        const studentsList_loadedData =
          await window.electron.ipcRenderer.invoke("handle_studentsList", {
            mode: "read",
          });
        studentsList_loadedData && setStudentsList(studentsList_loadedData);
      }
      //失敗した場合
      else {
        handleModalState({
          active: true,
          name: appConfig.modalCodeList["1002"],
          content: {
            errorCode: appConfig.errorCodeList["2001"],
          },
        });
      }
    });
  }, []);

  return studentsFileReader;
};

export default useStudentsFileReader;
