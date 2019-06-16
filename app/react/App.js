import axios from 'axios';
import React from "react";
import ReactDOM from "react-dom";


const WS_DOMAIN = 'ws://' + window.location.host + '/ws/';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        status: 'Loading...',
        device_sound_name: '',
        sounds_by_name: {},
        ws: null,
    }
  }

  componentDidMount() {
    this.setState({status: 'Loading sounds...'});

    axios.get('/game-data').then(response=>{
      let sound_names = response.data['sound_names'];
      let sounds_by_name = {};

      sound_names.forEach((name) => {
        sounds_by_name[name] = new Audio(['/static/app/sounds/' + name]);
      })

      this.setState({
        status: 'Done loading sounds',
        sounds_by_name: sounds_by_name,
      });

    }).catch(error=>{
      console.log(error);
      this.setState({
        status: 'Error loading sounds'
      });
    });

    this.setState({
      ws: this.setupWebSocket(new WebSocket(WS_DOMAIN))
    });
  }

  setupWebSocket(ws) {
    ws.onopen = this.onOpen.bind(this);
    ws.onmessage = this.onMessage.bind(this);
    ws.onclose = this.onClose.bind(this);
    return ws
  }

  onOpen(e) {
    // on connecting, do nothing but log it to the console
    console.log('connected')
  }

  onMessage(e) {
    // on receiving a message, add it to the list of messages
    const message = JSON.parse(e.data);
    if (message.just_connected) {
      this.setState({
        device_sound_name: message.device_sound_name,
      })
    } else {
      this.playSound(message.sound_name);
    }
  }

  onClose() {
     console.log('disconnected')
    // automatically try to reconnect on connection loss
    this.setState({
        ws: this.setupWebSocket(new WebSocket(WS_DOMAIN))
    });
  }

  onClick(e){
    const button = e.target;
    button.disabled = true;

    let sound = this.state.sounds_by_name[this.state.device_sound_name];
    sound.addEventListener('ended', function(){
      button.disabled = false;
    });

    this.state.ws.send(JSON.stringify({sound_name: this.state.device_sound_name}));
  }

  playSound(sound_name) {
    this.state.sounds_by_name[sound_name].play();
  }

  render() {
    return (
      <div>
        <div>{this.state.status}</div>
        <div>Your sound: {this.state.device_sound_name}</div>
        <button type="button" onClick={(e) => this.onClick(e)}>Make Sound</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

