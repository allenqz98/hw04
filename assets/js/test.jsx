import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: _.shuffle(["A","A","B","B","C","C","D","D",
      "E","E","F","F","G","G","H","H"]),
      selected: [],
      correct: []
    };
  }

  on_clicked(index) {
    console.log(index);

    const {board, selected, correct} = this.state;

    if(selected.length == 0) {
      this.setState({selected: selected.concat(index)});
    } else if (selected.length === 1) {
      if (board[selected[0]] === board[index]) {
        this.setState({correct: correct.concat(selected[0], index),selected: []});
      } else {
        //doesnt match
        this.setState(
          {selected: [selected[0], index]}
        );
        setTimeout(() => {
          this.setState({selected: []})
        }, 1500);
      }
    }
  }

  render() {
    const {board, selected, correct} = this.state;
    return(
      <div className="column">
        <p>Memory Game</p>
        <div className="board container">
          <div className="row">
            {board.slice(0,4).map((letter,i) =>
              <Card letter={letter} onClick={this.on_clicked.bind(this,i)} isSelected={selected.includes(i)} isCorrect={correct.includes(i)} key={i} />)}
          </div>

          <div className="row">
            {board.slice(4,8).map((letter,i) =>
              <Card letter={letter} onClick={this.on_clicked.bind(this,4+i)} isSelected={selected.includes(4+i)} isCorrect={correct.includes(4+i)} key={4+i} />)}
          </div>

          <div className="row">
            {board.slice(8,12).map((letter,i) =>
            <Card letter={letter} onClick={this.on_clicked.bind(this,8+i)} isSelected={selected.includes(8+i)} isCorrect={correct.includes(8+i)} key={8+i} />)}
          </div>

          <div className="row">
            {board.slice(12,16).map((letter,i) =>
              <Card letter={letter} onClick={this.on_clicked.bind(this,12+i)} isSelected={selected.includes(12+i)} isCorrect={correct.includes(12+i)} key={12+i} />)}
          </div>
        </div>
      </div>);
    }
}

let Card = (props) => {
  let display;
  if (props.isSelected || props.isCorrect) {
    display = props.letter;
  } else {
    display = "_";
  }

  let selectedClass;
  if (props.isSelected) {
    selectedClass = "button isSelected"
  } else if (props.isCorrect) {
    selectedClass = "button correct"
  } else {
    selectedClass = "button"
  }

  return (
    <div className="column" onClick={() => {
      if (!props.isSelected && !props.isCorrect) {
        props.onClick();
      }
    }}>
      <div className={selectedClass}>
        {display}
      </div>
    </div>)
}
