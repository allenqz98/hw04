import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel={channel}/>, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);

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
    if(view.game.selected.length == 2)
      this.canMatch()
  }


  on_guess(i) {
    var self = this;
    var resp= this.channel.push("guess", {index: i})
          .receive("ok", this.got_view.bind(this)
        );
          console.log("in matching");
          console.log(this.state.selected.length);

  }

canMatch(){
setTimeout(()=>{this.channel.push("match", {})
        .receive("ok",this.got_view.bind(this))},1000)

}
  // timeout() {
  //   setTimeout(this.got_view(this)
  // }


  restart() {

  }


  render() {
    const {board, selected, correct} = this.state;
    return(
      <div className="column">
        <p>Memory Game</p>
        <div className="board container">
          <div className="row">
            {board.slice(0,4).map((letter, i) =>
              <Card index={i} letter={board[i]} on_guess={this.on_guess.bind(this, i)} isSelected={selected.includes(i)} isCorrected={correct.includes(i)} />)}
          </div>

          <div className="row">
            {board.slice(0,4).map((letter, i) =>
              <Card index={i+4} letter={board[i+4]} on_guess={this.on_guess.bind(this, i+4)} isSelected={selected.includes(i+4)} isCorrected={correct.includes(i+4)} />)}
          </div>

          <div className="row">
            {board.slice(0,4).map((letter, i) =>
              <Card index={i+8} letter={board[i+8]} on_guess={this.on_guess.bind(this, i+8)} isSelected={selected.includes(i+8)} isCorrected={correct.includes(i+8)} />)}
          </div>

          <div className="row">
            {board.slice(0,4).map((letter, i) =>
              <Card index={i+12} letter={board[i+12]} on_guess={this.on_guess.bind(this, i+12)} isSelected={selected.includes(i+12)} isCorrected={correct.includes(i+12)} />)}
          </div>
        </div>
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
