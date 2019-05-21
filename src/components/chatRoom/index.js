import React from "react";
import Peer from 'simple-peer'
import MessageList from './messageList'
import InputField from './inputField'
import UsersList from './usersList'
import MediaBlock from './mediaBlock'
import events from '../../utils/events'
import socket from '../../utils/socket'
import './chatRoom.css'

export default class ChatRoom extends React.Component {
  state = {name: null};

  componentDidMount() {
    events.listenEvent("enterRoom", this.enterRoom);
    events.listenEvent("sendMessage", socket.sendMessage);
  }

  render() {
    return (
      <div id="chatRoom">
        {this.state.name && <UsersList/>}
        {Peer.WEBRTC_SUPPORT && navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && this.state.name && <MediaBlock/>}
        {this.state.name && <MessageList/>}
        <InputField name={this.state.name} addClass={this.state.name ? 'enterMessage' : ''} placeholder={this.state.name ? "Введите сообщение" : "Введите ваше имя"} eventName={this.state.name ? "sendMessage" : "enterRoom"}/>
      </div>
    )
  }

  enterRoom = ({value}) => {
    this.setState({
      name: value
    });
    socket.enterRoom(new URLSearchParams(window.location.search).get('roomId'), value);
  };
}
