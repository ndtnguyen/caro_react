import React, {Component} from 'react';
import Board from './Board';

class Game extends Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(25).fill(null),
        moveLocation: '', 
      }],
      xIsNext: true,
      stepNumber: 0,
      isReverse: false, 
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }

    const matrixSize = Math.sqrt(history[0].squares.length);
    const moveLocation = [Math.floor(i / matrixSize) + 1, (i % matrixSize) + 1].join(", ");
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveLocation: moveLocation,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }
  
  jumpTo(move){
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) ? false : true,
    });
  }

  changeReverse(isReverse){
    this.setState({
      isReverse: !isReverse
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares;
    const winner = calculateWinner(squares);
    const moves = history.map((step, move) => {
    const description = move ? `Move #${move} (${step.moveLocation})` : 'Game start'; 
      return <li key={move}><button type="button" onClick={() => this.jumpTo(move)}>{description}</button></li>
    });
    const isReverse = this.state.isReverse;
    let status;
        if(winner){
          status = "Winner is: " + winner.winnerPlayer; 
        }else if(this.state.stepNumber === 9){
          status = "No one win";
        }else{
          status = "Next player is: " + (this.state.xIsNext ? 'X' : 'O');
        }
     return(
          <div>
            <div className="game">
              <Board squares={squares} onClick={i => this.handleClick(i)} winner={winner && winner.winnerLocation}/></div>
            <div className="game-info">
              <p>{status}</p>
              <ol reversed={isReverse ? 'reverse' :''}>{isReverse ? moves.reverse() : moves}</ol>
              <button onClick={() => this.changeReverse(isReverse)}>Reverse list</button>
            </div>
          </div>
        );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [0, 6, 12, 18, 24],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [4, 8, 12, 16, 20],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return { 
        winnerLocation: [a,b,c,d,e],
        winnerPlayer: squares[a]
      };
    }
  }
  return null;
}
export default Game;