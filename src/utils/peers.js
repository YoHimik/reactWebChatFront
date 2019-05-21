import Peer from 'simple-peer';
import socket from './socket'
import events from './events'

const turnAddress = '127.0.0.1:5432';
const turnLogin = 'admin1';
const turnPassword = 'badboy';
const peerConfig = {iceServers: [{urls: 'stun:stun.aeta-audio.com:3478'}, {urls: `turn:${turnAddress}`, credential: turnPassword, username: turnLogin}]};

let peers = {};
events.listenEvent('addStreamToPeers', addStreamToPeers);

function connectToPeers(users) {
  try {
    if (!Peer.WEBRTC_SUPPORT) return;
    for (let user of users) {
      if (user.id == socket.id) continue;
      let peer = initPeer(user.id, true);
      if (!peer) continue;
      peer.once('signal', offer => socket.sendOffer({offer, to: user.id}));
    }
  } catch (e) {
    console.log({error: e});
  }
}

function processOffer({offer, from}) {
  try {
    if (!Peer.WEBRTC_SUPPORT) return;
    let peer = initPeer(from);
    if (!peer) return;
    peer.once('signal', answer => {
      socket.sendAnswer({to: from, answer});
    });
    peer.signal(offer);
  } catch (e) {
    console.log({error: e});
  }
}

function processAnswer({answer, from}) {
  peers[from].signal(answer);
}

function addStreamToPeers(stream) {
  try {
    for (let id in peers) {
      peers[id].addStream(stream);
    }
  } catch (e) {
    console.log({error: e});
  }
}

function initPeer(id, initiator) {
  if (peers[id]) return;
  let peer = new Peer({initiator, config: peerConfig});
  peer.on('connect', () => {
    events.callEvent('setConnectedUser', {userId: id, connected: true});
  });
  peer.on('close', () => {
    delete peers[id];
    events.callEvent('setConnectedUser', {userId: id, connected: false});
  });
  peer.on('error', error => {
    console.log({error});
    delete peers[id];
    events.callEvent('setConnectedUser', {userId: id, connected: false});
  });
  peer.on('stream', stream => {
    events.callEvent('addStream', stream);
  });
  peers[id] = peer;
  return peers[id];
}

export default {connectToPeers, processAnswer, processOffer, addStreamToPeers}
