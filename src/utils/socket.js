import socketIo from "socket.io-client";
import events from "./events";
import peers from './peers'

const serverHost = 'http://127.0.0.1:3000';
const socketHost = '127.0.0.1:3001';

let socket = socketIo(socketHost);

socket.on('connect', () => {
  events.callEvent('addServerMessage', 'Соединение с сервером успешно установлено.');
  if (socket.name) {
    enterRoom(socket.roomId, socket.name);
  }
});

socket.on('disconnect', () => {
  events.callEvent('addServerMessage', 'Соединение с сервером потеряно.');
});

socket.on('newUser', data => {
  if (data.id === socket.id) return;
  events.callEvent('addUser', {users: data});
  events.callEvent('addServerMessage', `Пользователь ${data.name} присоеденился к комнате.`);
});

socket.on('newMessage', data => {
  events.callEvent('addMessage', {text: data.text, id: data.id, date: data.date, author: data.userName, isMine: data.userId === socket.id});
});

socket.on('userLeaved', data => {
  events.callEvent('addServerMessage', `Пользователь ${data.name} покинул комнату.`);
  events.callEvent('dropUser', {scId: socket.id, data});
});

function sendMessage({value}) {
  if (!socket.connected) {
    events.callEvent('addServerMessage', 'Не удаётся соедениться с сервером');
    return;
  }
  socket.emit('addMessage', {text: value});
}

function enterRoom(roomId, name) {
  socket.name = name;
  socket.roomId = roomId;
  if (!socket.connected) {
    events.callEvent('addServerMessage', 'Не удаётся соедениться с сервером');
    return;
  }
  socket.emit('enterRoom', {name, roomId}, (data) => {
    events.callEvent('addServerMessage', `Вы присоеденились к комнате. Для приглашения других участников отправьте им ссылку: ${serverHost}/?roomId=${data.roomId}`);
    events.callEvent('addUser', {users: data.users, id: socket.id});
    if (data.users.length < 2) {
      events.callEvent('enableMediaButtons');
      return;
    }
    peers.connectToPeers(data.users);
  });
}

function sendOffer(offerData) {
  socket.emit('offer', offerData);
}

function sendAnswer(answerData) {
  socket.emit('answer', answerData);
}

socket.on('offerReq', peers.processOffer);

socket.on('answerReq', peers.processAnswer);

export default {sendMessage, enterRoom, sendOffer, sendAnswer, id: socket.id};


