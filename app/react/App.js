import axios from 'axios';
import React from "react";
import ReactDOM from "react-dom";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        status: '',
        device_sound_name: '',
        sounds_by_name: {}
    }
  }

  componentDidMount() {
    this.loadSounds();
  }

  loadSoundNames() {
    return [
      'bass-drum__025_forte_bass-drum-mallet.mp3',
      'bell-tree__025_forte_struck-singly.mp3',
      'chinese-hand-cymbals__15_forte_struck-together.mp3',
      'cowbell__025_mezzo-forte_damped.mp3',
      'djundjun__05_mezzo-forte_medium-sticks.mp3',
      'french-horn_A2_1_fortissimo_normal.mp3',
      'guiro__1_mezzo-forte_scraped.mp3',
      'motor-horn__05_forte_squeezed.mp3',
      'sleigh-bells__05_mezzo-forte_shaken.mp3',
      'snare-drum__025_fortissimo_with-snares.mp3',
      'squeaker__05_forte_squeezed.mp3',
      'surdo__05_forte_undamped.mp3',
      'swanee-whistle__05_forte_effect.mp3',
      'tam-tam__long_fortissimo_damped.mp3',
      'tenor-drum__phrase_forte_damped.mp3',
      'thai-gong__long_forte_damped.mp3',
      'train-whistle__025_forte_clean.mp3',
      'woodblock__025_mezzo-forte_struck-singly.mp3'
    ];
  }

  loadSounds() {
    this.setState({status: 'Loading sounds...'});

    let sound_names = this.loadSoundNames();
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

    console.log(sounds_by_name);
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

