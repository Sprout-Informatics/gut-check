import type { SimulationState } from './types'
import type { RNG } from './random'
import { DEFAULTS } from './constants'

export function applyAntibioticTick(state: SimulationState, rng: RNG): SimulationState {
  // Kill commensals proportional to each species' sensitivity
  const newCommensals = state.commensals.map((species) => {
    const killEffect = species.antibioticSensitivity
      * DEFAULTS.COMMENSAL_ANTIBIOTIC_KILL_RATE
      * (1 + rng.gaussian(0, 0.02))
    const newAbundance = Math.max(0, species.abundance * (1 - killEffect))
    return { ...species, abundance: newAbundance }
  })

  // Kill C. diff vegetative cells — but NOT spores
  const newVegetative = Math.max(
    0,
    state.cdiff.vegetative * (1 - DEFAULTS.CDIFF_ANTIBIOTIC_KILL_VEGETATIVE),
  )

  return {
    ...state,
    commensals: newCommensals,
    cdiff: {
      ...state.cdiff,
      vegetative: newVegetative,
      // Spores are explicitly unchanged — this is the key biological insight
    },
  }
}
