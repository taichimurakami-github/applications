import React, { useContext } from "react";
import { AppStateContext } from "../../AppContainer";

interface NewsModalProps {
  onCloseModal: () => void;
}

const NewsModal: React.VFC<NewsModalProps> = (props) => {
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
