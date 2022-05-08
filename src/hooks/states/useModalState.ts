import { useState, useCallback } from "react";

export const modalState_initialValue: modalState = {
  active: false,
  name: "",
  content: {},
};

const useModalState = () => {
  const [modalState, setModalState] = useState<modalState>(
    modalState_initialValue
  );

  /**
   * function handleModalState()
   *
   * モーダルの表示を管理する関数
   * 引数tはactive, nameキーと、モーダルごとに異なるcontentキーを持つオブジェクトとする
   *
   * @param {object} t
   * @returns {void}
   */
  const handleModalState = useCallback((t: modalState) => {
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
  }, []);

  return { modalState, setModalState, handleModalState };
};

export default useModalState;
