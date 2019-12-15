import React, { useImperativeHandle } from "react";
import ReactDom from "react-dom"
import "./index.css";

function helper(squares) {
    const lines = [
        // 가로 인덱스 번호
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // 세로 인덱스 번호
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // 대각선 인덱스 번호
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
            return squares[a]
    }
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick ={() => this.props.onClick(i)}
            />
        );
    }
    render() {
        return (
            <div>                
                <div className="row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            user: true,
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            user: (step % 2) === 0,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        // 누가 이겼거나 또는 클릭한곳이 값이 있을경우
        if (helper(squares) || squares[i])
            return;
        // 스퀘워에 값을 할당할당 
        squares[i] = this.state.user ? 'X' : 'O';
        // 사각형의 값을 바꿔줍니다.
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            user: !this.state.user,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = helper(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
            'Go to move #' + move :
            'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
        })

        let status;

        if (winner)
            status = 'Winner  ' + winner;
        else
            status = 'Next player: ' + (this.state.user ? 'X' : 'O');

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        )
    }
}

// 가상 버츄얼 돔
ReactDom.render(<Game/>, document.getElementById("root"));