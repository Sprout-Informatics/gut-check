import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { AppState, AppAction } from './reducer'
import { simulationReducer } from './reducer'
import { createRNG } from '../simulation/random'
import { createInitialState } from '../simulation/engine'

interface SimulationContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const SimulationContext = createContext<SimulationContextValue | null>(null)

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(simulationReducer, null, () => {
    const seed = Date.now()
    const rng = createRNG(seed)
    return { simulation: createInitialState(rng, seed) }
  })

  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation(): SimulationContextValue {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider')
  }
  return context
}
