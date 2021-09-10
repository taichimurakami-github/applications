interface TopMessageProps {
  msg: string
}

export const TopMessage: React.VFC<TopMessageProps> = (props) => {
  return (
    <div className="top-message-wrapper">
      <h2 className="title">お知らせ</h2>
      <div className="inner">
        <p className="message">{props.msg}</p>
      </div>
    </div>
  )
}