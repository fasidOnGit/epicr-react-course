// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {withErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    error: null,
    pokemon: null,
    status: pokemonName ? 'pending' : 'idle',
  })
  React.useEffect(() => {
    if (pokemonName) {
      setState({error: null, pokemon: null, status: 'pending'})
      fetchPokemon(pokemonName)
        .then(pokemonData => {
          setState({error: null, pokemon: pokemonData, status: 'resolved'})
        })
        .catch(err => {
          setState({error: err.message, pokemon: null, status: 'rejected'})
          return Promise.reject(err)
        })
    }
  }, [pokemonName])

  switch (state.status) {
    case 'idle':
      return 'Submit a pokemon'
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />
    case 'rejected':
      throw state.error
    default:
      return <PokemonInfoFallback name={pokemonName} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }
  function ErrorFallback({error, resetErrorBoundary}) {
    return (
      <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error}</pre>
        <button onClick={resetErrorBoundary}>Try Again</button>
      </div>
    )
  }
  function handleReset() {
    setPokemonName('')
  }
  const PokemonInfoWithErrorBoundary = withErrorBoundary(PokemonInfo, {
    FallbackComponent: ErrorFallback,
    resetKeys: [pokemonName],
    onReset() {
      handleReset()
    },
    onError(error, info) {
      console.log(error, info)
    },
  })

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfoWithErrorBoundary pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
