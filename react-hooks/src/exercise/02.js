// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState({itemName: 'name', initialName})
  function handleChange(event) {
    const {value} = event.target
    setName(value)
    
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App

function useLocalStorageState({itemName, defaultValue = '', serialize = JSON.stringify, deserialize = JSON.parse}) {
  const [state, setState] = React.useState(() => {
    const valueinLocalStorage = window.localStorage.getItem(itemName);
    if (valueinLocalStorage) {
      return deserialize(valueinLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  })
  const prevKeyRef = React.useRef(itemName);
  
  React.useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== itemName) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = itemName;
    window.localStorage.setItem(itemName, serialize(state))
  }, [state, itemName, serialize]);
  return [state, setState]
}