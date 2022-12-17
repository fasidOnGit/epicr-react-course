// useState: tic tac toe
// 💯 (alternate) migrate from classes
// http://localhost:3000/isolated/exercise/04-classes.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

// If you'd rather practice refactoring a class component to a function
// component with hooks, then go ahead and do this exercise.

// 🦉 You've learned all the hooks you need to know to refactor this Board
// component to hooks. So, let's make it happen!

// function Board() {
//   const [squares, setSquares] = useLocalStorageState('squares', Array(9).fill(null))

//   const selectSquare = square => {
//     const nextValue = calculateNextValue(squares)
//     if (calculateWinner(squares) || squares[square]) {
//       return
//     }
//     const squaresCopy = [...squares]
//     squaresCopy[square] = nextValue
//     setSquares(squaresCopy)
//   }
//   const renderSquare = i => (
//     <button className='square' onClick={() => selectSquare(i)}>
//       {squares[i]}
//     </button>
//   )

//   const restart = () => {
//     setSquares(Array(9).fill(null))
//   }

//   const nextValue = calculateNextValue(squares)
//   const winner = calculateWinner(squares)
//   let status = calculateStatus(winner, squares, nextValue)

//   return (
//     <div>
//       <div className='status'>{status}</div>
//       <div className='board-row'>
//         {renderSquare(0)}
//         {renderSquare(1)}
//         {renderSquare(2)}
//       </div>
//       <div className='board-row'>
//         {renderSquare(3)}
//         {renderSquare(4)}
//         {renderSquare(5)}
//       </div>
//       <div className='board-row'>
//         {renderSquare(6)}
//         {renderSquare(7)}
//         {renderSquare(8)}
//       </div>
//       <button className='restart' onClick={restart}>
//         restart
//       </button>
//     </div>
//   )
// }

function BoardV1({onClick, squares = Array(9).fill(null)}) {
  const renderSquare = i => (
    <button className={'square'} onClick={() => onClick(i)}>
      {squares[i]}
    </button>
  )

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [
    Array(9).fill(null),
  ])
  const [index, setIndex] = useLocalStorageState(
    'tic-tac-toe:index',
    history.length - 1,
  )
  const currentSquares = history[index]

  const selectSquare = square => {
    const nextValue = calculateNextValue(currentSquares)
    if (calculateWinner(currentSquares) || currentSquares[square]) {
      return
    }
    const squaresCopy = [...currentSquares]
    squaresCopy[square] = nextValue
    history.length = index + 1
    setIndex(history.push(squaresCopy) - 1)
    setHistory([...history])
  }

  const restart = () => {
    setHistory([Array(9).fill(null)])
    setIndex(0)
  }

  const moves = history.map((h, i) => (
    <li key={i}>
      <button onClick={() => setIndex(i)} disabled={index === i}>
        {i === 0 ? 'Go to game start' : `Go to move #${i}`}{' '}
        {index === i ? ' (current)' : ''}
      </button>
    </li>
  ))

  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  let status = calculateStatus(winner, currentSquares, nextValue)
  return (
    <div className="game">
      <div className="game-board">
        <BoardV1 onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className={'game-info'}>
        <div className="status">{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
