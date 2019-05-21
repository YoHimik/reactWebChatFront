import React from 'react'
import events from '../../utils/events'

export default class extends React.Component {
  state = {
    videoStream: null,
    audioStream: null,
    buttonsEnabled: false
  };

  componentWillMount() {
    events.listenEvent('enableMediaButtons', this.enableButtons);
    events.listenEvent('addStream', this.appendStream);
  }

  render() {
    return (
      <div id="mediaBlock">
        {this.state.audioStream && <audio ref={ref => this.audio = ref}/>}
        {this.state.videoStream && <video ref={ref => this.video = ref}/>}
        {this.state.buttonsEnabled &&
        <div>
          <button onClick={this.enableSound}>{this.state.audioStream ? 'Выключить микрофон' : 'Включить микрофон'}</button>
          <button onClick={this.enableVideo}>{this.state.videoStream ? 'Выключить веб-камеру' : 'Включить веб-камеру'}</button>
        </div>}
      </div>
    )
  }

  enableButtons = () => {
    let {state} = this;
    state.buttonsEnabled = true;
    this.setState(state);
  };

  enableSound = () => {
    let {state} = this;
    if (state.audioStream) {
      stopStream(state.audioStream);
      state.audioStream = null;
      this.setState(state);
      return;
    }
    this.addMedia({audio: true});
  };

  enableVideo = () => {
    let {state} = this;
    if (state.videoStream) {
      stopStream(state.videoStream);
      state.videoStream = null;
      this.setState(state);
      return;
    }
    this.addMedia({video: true});
  };

  appendStream = (stream) => {
    let res = checkStream(stream);
    let {state} = this;
    if (res.video) {
      state.videoStream = stream;
      this.setState(state);
      if ('srcObject' in this.video) {
        this.video.srcObject = stream
      } else {
        this.video.src = window.URL.createObjectURL(stream);
      }
      this.video.play();

    }
    if (res.audio) {
      state.audioStream = stream;
      this.setState(state);
      if ('srcObject' in this.audio) {
        this.audio.srcObject = stream
      } else {
        this.audio.src = window.URL.createObjectURL(stream);
      }
      this.audio.play();
    }
  };

  addMedia = async (opts) => {
    let stream = await navigator.mediaDevices.getUserMedia(opts);
    events.callEvent('addStreamToPeers', stream);
    this.appendStream(stream);
  };
}

function stopStream(stream) {
  let tracks = stream.getTracks();
  for (let track of tracks) {
    track.stop();
  }
}

function checkStream(stream) {
  let res = {video: false, audio: false};
  if (stream.getAudioTracks().length) res.audio = true;
  if (stream.getVideoTracks().length) res.video = true;
  return res;
}
