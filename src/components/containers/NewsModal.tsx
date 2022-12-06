import React, { useContext } from "react";
import { AppStateContext } from "../../AppContainer";

const NewsModal = (props: { onCloseModal: () => void }) => {
  const { appState } = useContext(AppStateContext);

  return (
    <div className="news-modal-wrapper">
      <h2 className="title">生徒の皆さんへのお知らせ</h2>
      <p className="message">{appState.localConfig.msg}</p>
      <button className="btn btn__close" onClick={props.onCloseModal}>
        閉じる
      </button>
    </div>
  );
};

export { NewsModal };
