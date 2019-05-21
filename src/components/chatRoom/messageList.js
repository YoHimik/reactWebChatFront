import React from 'react'
import Message from './message'
import events from "../../utils/events";

export default class MessageList extends React.Component {
  state = {
    messages: []
  };

  appendServerMessage = (text) => {
    this.appendMessage({text, isServer: true, id: Math.floor(Math.random() * 100000)});
  }

  appendMessage = ({text, author, isServer, isMine, id, date}) => {
    let messages = this.state.messages.slice();
    const maxMessages = 50;
    messages.push({
      id,
      text,
      author,
      isServer,
      isMine,
      date
    });
    if (messages.length >= maxMessages + 1) {
      messages = messages.slice(messages.length - maxMessages, messages.length);
    }
    this.setState({
      messages
    });
  };

  componentDidMount() {
    events.listenEvent('addMessage', this.appendMessage);
    events.listenEvent('addServerMessage', this.appendServerMessage);
  }

  render() {
    let messages = this.state.messages.map(m => (<Message isServer={m.isServer} key={m.id} isMine={m.isMine} author={m.author} text={m.text} date={m.date}/>));
    return (
      <div id="messageList">
        {messages}
      </div>
    )
  }
}
