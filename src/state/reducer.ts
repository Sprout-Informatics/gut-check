import type { SimulationState, PlayerAction } from '../simulation/types'
import { createRNG } from '../simulation/random'
import { createInitialState, applyAction, tick } from '../simulation/engine'
import { takeSamples, type SampleResult } from '../simulation/sequenceSampler'

export interface AppState {
  simulation: SimulationState
  lastSample: SampleResult[] | null
}

export type AppAction =
  | { type: 'INIT_SIMULATION'; seed?: number; virulence?: number }
  | { type: 'PLAYER_ACTION'; action: PlayerAction }
  | { type: 'ADVANCE_ONE_TICK' }
  | { type: 'ADVANCE_WEEK' }
  | { type: 'SET_VIRULENCE'; virulence: number }
  | { type: 'TAKE_SAMPLE' }
  | { type: 'RESET' }

export function simulationReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'INIT_SIMULATION': {
      const seed = action.seed ?? Date.now()
      const rng = createRNG(seed)
      return { simulation: createInitialState(rng, seed, action.virulence), lastSample: null }
    }

    case 'PLAYER_ACTION': {
      if (state.simulation.outcome) return state
      const rng = createRNG(state.simulation.rngSeed + state.simulation.tick)
      let sim = applyAction(state.simulation, action.action, rng)
      // Advance one tick after applying the action
      const tickRng = createRNG(state.simulation.rngSeed + sim.tick + 1)
      sim = tick(sim, tickRng)
      return { ...state, simulation: sim }
    }

    case 'ADVANCE_ONE_TICK': {
      if (state.simulation.outcome) return state
      const rng = createRNG(state.simulation.rngSeed + state.simulation.tick)
      return { ...state, simulation: tick(state.simulation, rng) }
    }

    case 'ADVANCE_WEEK': {
      if (state.simulation.outcome) return state
      let sim = state.simulation
      for (let i = 0; i < 7; i++) {
        if (sim.outcome) break
        const rng = createRNG(sim.rngSeed + sim.tick)
        sim = tick(sim, rng)
      }
      return { ...state, simulation: sim }
    }

    case 'SET_VIRULENCE': {
      return {
        ...state,
        simulation: { ...state.simulation, cdiffVirulence: action.virulence },
      }
    }

    case 'TAKE_SAMPLE': {
      const rng = createRNG(state.simulation.rngSeed + state.simulation.tick + 999)
      const samples = takeSamples(state.simulation, rng)
      return { ...state, lastSample: samples }
    }

    case 'RESET': {
      const seed = Date.now()
      const rng = createRNG(seed)
      return { simulation: createInitialState(rng, seed, state.simulation.cdiffVirulence), lastSample: null }
    }
  }
}
