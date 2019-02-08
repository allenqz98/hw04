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
    this.setState(view.game);
  }

  on_guess(i) {
    this.channel.push("guess", {index: i})
        .receive("ok", this.got_view.bind(this));
  }


  render() {
    const {board, selected, correct} = this.state;
    return(
      <div className="column">
        <p>Memory Game</p>
        <div className="board container">
          <div className="row">
            {board.slice(0,4).map((letter, i) =>
              <Card index={i} letter={board[i]} isSelected={selected.includes(i)} isCorrected={correct.includes(i)} />)}
          </div>

          <div className="row">
            {board.slice(4,8).map((letter, i) =>
              <Card index={i+4} letter={board[i+4]} isSelected={selected.includes(i+4)} isCorrected={correct.includes(i+4)} />)}
          </div>

          <div className="row">
            {board.slice(8,12).map((letter, i) =>
              <Card index={i+8} letter={board[i+8]} isSelected={selected.includes(i+8)} isCorrected={correct.includes(i+8)} />)}
          </div>

          <div className="row">
            {board.slice(12,16).map((letter, i) =>
              <Card index={i+12} letter={board[i=12]} isSelected={selected.includes(i+12)} isCorrected={correct.includes(i+12)} />)}
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
  console.log(letter)
  return (
    <div className="column">
      <div className={selectedClass} onClick={on_guess(i)}>
        {letter}
      </div>
    </div>)
}
