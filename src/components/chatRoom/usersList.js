import React from 'react'
import events from '../../utils/events'

export default class extends React.Component {
  state = {
    users: []
  };

  componentWillMount() {
    events.listenEvent('addUser', this.appendUser);
    events.listenEvent('dropUser', this.dropUser);
    events.listenEvent('setConnectedUser', this.setConnectedUser);
  }

  render() {
    let users = this.state.users.map(u => {
      return (<li key={u.id} style={{color: u.connected ? '#009500' : '', fontWeight: u.i ? 600 : 500}}>{u.name}</li>)
    });
    return (
      <div id="usersList">
        <ol>
          {users}
        </ol>
      </div>
    )
  }

  setConnectedUser = ({userId, connected}) => {
    let stateUsers = this.state.users.slice();
    let userIndex = stateUsers.findIndex(u => {
      return u.id === userId
    });
    if (userIndex < 0) return;
    stateUsers[userIndex].connected = connected;
    this.setState({
      users: stateUsers
    })
  };

  appendUser = ({users, id}) => {
    if (Array.isArray(users)) {
      let i = users.findIndex(u => u.id === id);
      users[i].i = true;
      this.setState({users});
      return;
    }
    let stateUsers = this.state.users.slice();
    stateUsers.push(users);
    this.setState({users: stateUsers});
  };

  dropUser = ({scId, data}) => {
    let stateUsers = this.state.users.filter(u => {
      return u.id !== data.id
    });
    if(stateUsers[0].id == scId){
      events.callEvent('enableMediaButtons');
    }
    this.setState({users: stateUsers});
  }
}
