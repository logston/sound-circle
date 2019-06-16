import axios from 'axios';
import React from "react";
import ReactDOM from "react-dom";


const WS_DOMAIN = 'ws://' + window.location.host + '/ws/';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        status: '',
        device_sound_name: '',
        sounds_by_name: {},
        ws: this.setupWebSocket(new WebSocket(WS_DOMAIN)),
    }
  }

  componentDidMount() {
    this.loadSounds();
  }

  setupWebSocket(ws) {
   ws.onopen = this.onOpen.bind(this);
   ws.onmessage = this.onMessage.bind(this);
   ws.onclose = this.onClose.bind(this);
   return ws
  }

  onOpen() {
    // on connecting, do nothing but log it to the console
    console.log('connected')
  }

  onMessage(e) {
    // on receiving a message, add it to the list of messages
    const message = JSON.parse(e.data)
  }

  onClose() {
     console.log('disconnected')
    // automatically try to reconnect on connection loss
    this.setState({
        ws: this.setupWebSocket(new WebSocket(WS_DOMAIN))
    });
  }

  loadSounds() {
    this.setState({status: 'Loading sounds...'});

    axios('/game-data').then(response=>{
      let sound_names = response.data['sound_names'];
      let sounds_by_name = {};

      sound_names.forEach((name) => {
        sounds_by_name[name] = this.loadSound(name);
      })

      let device_sound_name = sound_names[Math.floor(Math.random() * sound_names.length)]; 

      this.setState({
        sounds_by_name: sounds_by_name,
        device_sound_name: device_sound_name,
        status: 'Done loading sounds'
      });

    }).catch(error=>{
      this.setState({
        status: 'Error loading sounds'
      });
    });
  }

  loadSound(sound_name){
    return new Audio(['/static/app/sounds/' + sound_name]);
  }

  onClick(e){
    let button = e.target;
    button.disabled = true;

    let sound = this.state.sounds_by_name[this.state.device_sound_name];
    sound.addEventListener('ended', function(){
      button.disabled = false;
    });

    sound.play();
  }

  playSound() {
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

