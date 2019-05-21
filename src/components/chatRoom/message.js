import React from 'react'

export default (props) => {
  const {isMine, text, date, author, isServer} = props;
  return (
    <div className={`message ${isMine ? 'mine' : ''} ${isServer ? 'server' : ''}`}>
      {date && <span className="messageDate">{date}</span>}
      {!isServer && <span className="messageAuthor">{author}:</span>}
      <p className="messageText">{text}</p>
    </div>
  )
}
