import React from "react";
import { useAppStateCtx } from "~/hooks/states/useAppContext";

export const NewsModalContainer = (props: { onCloseModal: () => void }) => {
  const appState = useAppStateCtx();

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
