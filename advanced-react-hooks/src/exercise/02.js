// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function asyncReducer(state, action) {
  switch (action.status) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.status}`)
    }
  }
}
function useSafeDispatch(dispatch) {
  const mountedRef = React.useRef(false);
  React.useLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    }
  })
  return React.useCallback((...args) => {
    if (mountedRef.current) {
      dispatch(...args)
    }
  }, [dispatch])
}
function useAsync(initialState) {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, initialState)
  const dispatch = useSafeDispatch(unsafeDispatch)
  const run = React.useCallback(promise => {
    if (!promise) {
      return
    }
    dispatch({status: 'pending'})
    promise.then(
      data => dispatch({status: 'resolved', error: null, data})
    ).catch(err => dispatch({status: 'rejected', error: err, data: null}))
  }, [])
  return {...state, run};
}

function PokemonInfo({pokemonName}: {pokemonName: string}) {

  // 🐨 here's how you'll use the new useAsync hook you're writing:
  const {data, status, error, run} = useAsync({
    status: 'idle',
    data: null,
    error: null,
  })
  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    const promise = fetchPokemon(pokemonName)
    run(promise)
  }, [pokemonName, run])

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={data} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
