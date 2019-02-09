import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel={channel}/>, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.allow_input = true;
    this.channel = props.channel;
    this.state = {
      board: [],
      selected: [],
      correct: [],
    };

    this.channel
        .join()
        .receive("ok", this.got_view.bind(this))
        .receive("error", resp => {console.log("Unable to join", resp); })

  }

  got_view(view) {
    console.log("new view", view);
    console.log(view.game.selected.length);
    this.setState(view.game);
    if(view.game.selected.length == 2) {
      this.allow_input = false;
      console.log(this.allow_input);
      this.canMatch()
      console.log(this.allow_input);
    }
  }


  on_guess(i) {
    if (this.allow_input && !this.state.selected.includes(i) && !this.state.correct.includes(i)) {
      var self = this;
      var resp= this.channel.push("guess", {index: i})
            .receive("ok", this.got_view.bind(this));
    }
  }

  canMatch(){
    setTimeout(()=>{this.channel.push("match", {})
                                .receive("ok",this.got_view.bind(this));
                              this.allow_input = true;},1000)
  }


  restart() {
    this.channel.push("restart", {})
                .receive("ok", this.got_view.bind(this));
  }


  render() {
    const {board, selected, correct} = this.state;
    return(
      <div className="column">
        <p>Memory Game</p>
        <h3> Corrected: {correct.length}/16 </h3>
        <div className="board container">
          <div className="row">
            {board.slice(0,4).map((letter, i) =>
              <Card className="Button" index={i} letter={board[i]} on_guess={this.on_guess.bind(this, i)} isSelected={selected.includes(i)} isCorrected={correct.includes(i)} />)}
          </div>

          <div className="row">
            {board.slice(0,4).map((letter, i) =>
              <Card className="Button" index={i+4} letter={board[i+4]} on_guess={this.on_guess.bind(this, i+4)} isSelected={selected.includes(i+4)} isCorrected={correct.includes(i+4)} />)}
          </div>

          <div className="row">
            {board.slice(0,4).map((letter, i) =>
              <Card className="Button" index={i+8} letter={board[i+8]} on_guess={this.on_guess.bind(this, i+8)} isSelected={selected.includes(i+8)} isCorrected={correct.includes(i+8)} />)}
          </div>

          <div className="row">
            {board.slice(0,4).map((letter, i) =>
              <Card className="Button" index={i+12} letter={board[i+12]} on_guess={this.on_guess.bind(this, i+12)} isSelected={selected.includes(i+12)} isCorrected={correct.includes(i+12)} />)}
          </div>
        </div>
        <p><button onClick={this.restart.bind(this)}>Restart</button></p>
      </div>);
    }
}

let Card = (props) => {
  let selectedClass;
  if (props.isSelected) {
    selectedClass = "button isSelected"
  } else if (props.isCorrect) {
    selectedClass = "button correct"
  } else {
    selectedClass = "button"
  }
  return (
    <div className="column">
      <div className={selectedClass} onClick={props.on_guess}>
        {props.letter}
      </div>
    </div>)
}
