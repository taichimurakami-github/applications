import { useState, useEffect } from "react";
import { useIpcEventsSender } from "../controllers/useIpcEventsSender";

export const studentsList_initialValue: [] = [];

const useStudentsListState = () => {
  const { readStudentsList } = useIpcEventsSender();

  //エクセルから取得した生徒情報(生徒名簿リストデータ)を格納しておく変数
  const [studentsList, setStudentsList] = useState<studentsList>(
    studentsList_initialValue
  );

  useEffect(() => {
    // console.log("バックアップファイルの読み込みを開始します");

    (async () => {
      //生徒情報ファイルが存在していれば自動読み込み
      //grade, idが整数値で取得されるので、文字列型に変換しておく
      const studentsList_autoloadedData: studentsList | undefined =
        await readStudentsList();

      console.log(studentsList_autoloadedData);
      if (studentsList_autoloadedData) {
        //keyが数値のオブジェクトが手渡されるので、
        //grade, idを文字列に変換
        for (let i = 0; i < studentsList_autoloadedData.length; i++) {
          studentsList_autoloadedData[i].grade = String(
            studentsList_autoloadedData[i].grade
          );
          studentsList_autoloadedData[i].id = String(
            studentsList_autoloadedData[i].id
          );
        }

        setStudentsList(studentsList_autoloadedData);
      } else {
        setStudentsList(studentsList_initialValue);
      }
    })();
  }, []);

  return { studentsList, setStudentsList };
};

export default useStudentsListState;
