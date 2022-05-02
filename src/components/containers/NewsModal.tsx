import React from "react"

interface NewsModalProps {
  onCloseModal: () => void,
  appState: appState
}

const NewsModal: React.VFC<NewsModalProps> = (props) => {

  return (
    <div className="news-modal-wrapper">
      <h2 className="title">生徒の皆さんへのお知らせ</h2>
      <p className="message">{props.appState.localConfig.msg}</p>
      <button className="btn btn__close" onClick={props.onCloseModal}>閉じる</button>
    </div>
  )
}

export { NewsModal };