import { modalState_initialValue } from "../app.config";

const useModalStateController = (
  t: modalState,
  setModalState: React.Dispatch<React.SetStateAction<modalState>>
) => {
  //t.active = falseだった場合：modalStateをリセットする
  if (!t.active) {
    setModalState(modalState_initialValue);
    return;
  }

  //その他：引数に従ってモーダルを起動
  if (t.active && t.name !== "" && t.content !== {}) {
    setModalState({
      active: true,
      name: t.name,
      content: t.content,
    });
    return;
  }

  //正しく引数が指定されていない場合はエラー
  throw new Error(
    "handleModal argument type error in App.js: you need to include active, name, content properties those are truthy."
  );
};

export default useModalStateController;
