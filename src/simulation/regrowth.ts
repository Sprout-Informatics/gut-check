import type { SimulationState, BacterialPopulation } from './types'
import type { RNG } from './random'
import { DEFAULTS } from './constants'

export function applyNaturalRegrowthTick(state: SimulationState, rng: RNG): SimulationState {
  const totalCommensal = state.commensals.reduce((sum, s) => sum + s.abundance, 0)

  const newCommensals = state.commensals.map((species) => {
    let { abundance } = species

    if (abundance < 0.001) {
      // Nearly extinct: 20% chance per tick to begin recovering
      if (rng.next() < 0.20) {
        abundance = 0.02
      }
      return { ...species, abundance }
    }

    // Logistic growth toward carrying capacity (shared with all C. diff)
    const available = DEFAULTS.COMMENSAL_TOTAL_CAPACITY - totalCommensal - state.cdiff.vegetative - state.cdiff.spores
    if (available > 0) {
      const growth = species.growthRate
        * abundance
        * (available / DEFAULTS.COMMENSAL_TOTAL_CAPACITY)
        * (1 + rng.gaussian(0, 0.02))
      abundance += Math.max(0, growth)
    }

    return { ...species, abundance: Math.max(0, abundance) }
  })

  return { ...state, commensals: newCommensals }
}

export function applyTherapeuticIntervention(state: SimulationState, rng: RNG): SimulationState {
  const boostPerSpecies = DEFAULTS.THERAPEUTIC_COMMENSAL_BOOST / DEFAULTS.THERAPEUTIC_SPECIES_ADDED

  // Find depleted commensal species
  const depleted = state.commensals
    .map((s, i) => ({ species: s, index: i }))
    .filter((s) => s.species.abundance < 0.05)

  const newCommensals = [...state.commensals.map((s) => ({ ...s }))]
  let boosted = 0

  // Boost existing depleted species first
  for (const { index } of depleted) {
    if (boosted >= DEFAULTS.THERAPEUTIC_SPECIES_ADDED) break
    const boost = boostPerSpecies * (1 + rng.gaussian(0, 0.05))
    newCommensals[index].abundance += Math.max(0, boost)
    newCommensals[index].growthRate += DEFAULTS.THERAPEUTIC_ENGRAFTMENT_BONUS
    boosted++
  }

  // If fewer depleted species than needed, add new therapeutic species
  let therapeuticNum = 1
  while (boosted < DEFAULTS.THERAPEUTIC_SPECIES_ADDED) {
    const newSpecies: BacterialPopulation = {
      name: `Therapeutic_${therapeuticNum}`,
      abundance: boostPerSpecies * (1 + rng.gaussian(0, 0.05)),
      isCommensal: true,
      growthRate: DEFAULTS.COMMENSAL_BASE_GROWTH_RATE + DEFAULTS.THERAPEUTIC_ENGRAFTMENT_BONUS,
      antibioticSensitivity: rng.range(0.4, 0.8),
      competitiveStrength: rng.range(0.4, 0.8),
    }
    newCommensals.push(newSpecies)
    therapeuticNum++
    boosted++
  }

  // Clamp total abundance to carrying capacity
  const total = newCommensals.reduce((sum, s) => sum + s.abundance, 0)
  if (total > DEFAULTS.COMMENSAL_TOTAL_CAPACITY) {
    const scale = DEFAULTS.COMMENSAL_TOTAL_CAPACITY / total
    for (const species of newCommensals) {
      species.abundance *= scale
    }
  }

  const newEvents = [
    ...state.events,
    {
      tick: state.tick,
      type: 'success' as const,
      message: 'Microbiome therapeutic administered. Commensal spores delivered to the gut.',
    },
  ]

  return {
    ...state,
    commensals: newCommensals,
    therapeuticApplied: true,
    events: newEvents,
  }
}
