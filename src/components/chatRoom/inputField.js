import React from 'react'
import events from './../../utils/events'

export default (props) => {
  return (
    <div>
      <Input name={props.name} placeholder={props.placeholder} eventName={props.eventName} addClass={props.addClass}/>
      <div style={{height: 102.5}}></div>
    </div>
  );
}

class Input extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }

  changeText = (e) => {
    e.preventDefault();
    this.setState({text: e.target.value})

  }

  render() {
    return (
      <div id="inputField" style={{bottom: this.props.name ? '-15px' : '50%'}}>
        <textarea type="text" value={this.state.text} onChange={this.changeText} id="input" placeholder={this.props.placeholder} className={this.props.addClass}/>
        <button disabled={this.state.text === ''} id="sendButton" onClick={this.click}>Отправить</button>
      </div>
    );
  }

  click = (e) => {
    if (this.state.text === '') return;
    e.preventDefault();
    events.callEvent(this.props.eventName, {value: this.state.text});
    this.setState({
      text: ''
    });
  }
}
