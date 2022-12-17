// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
function countReducer(oldValue, action) {
  switch(action.type) {
    case 'INCREMENT':
      return {...oldValue, count: oldValue.count + action.step}
  }
}
function countReducerFn(oldValue, action) {
  return {...oldValue, ...action(oldValue)};
}

function countReducerObj(oldValue, {count}) {
  return {...oldValue, count};
}

function countReducerStepper(oldValue, step) {
  return oldValue + step
}

function countReducerUpdater(oldValue, newValue) {
  return newValue;
}

function Counter({initialCount = 0, step = 1}) {
  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const {count} = state
  // const increment = () =>
  //   setState(currentState => ({count: currentState.count + step}))
  const increment = () => dispatch({type: 'INCREMENT', step})
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
