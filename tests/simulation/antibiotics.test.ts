import { describe, it, expect } from 'vitest'
import { createRNG } from '../../src/simulation/random'
import { applyAntibioticTick } from '../../src/simulation/antibiotics'
import { generateInitialProfile, generateInitialCDiffState } from '../../src/simulation/profiles'
import type { SimulationState } from '../../src/simulation/types'

function makeHealthyState(seed = 42): SimulationState {
  const rng = createRNG(seed)
  const commensals = generateInitialProfile(rng)
  return {
    tick: 0,
    phase: 'healthy_baseline',
    commensals,
    cdiff: { spores: 0.05, vegetative: 0.2, toxinLevel: 0, germinationRate: 0.01 },
    totalCommensalAbundance: commensals.reduce((sum, s) => sum + s.abundance, 0),
    diversityIndex: 0,
    healthScore: 100,
    antibioticActive: true,
    antibioticTicksRemaining: 10,
    antibioticCoursesGiven: 1,
    therapeuticApplied: false,
    recurrenceCount: 0,
    history: [],
    events: [],
    rngSeed: seed,
    outcome: null,
  }
}

describe('applyAntibioticTick', () => {
  it('commensal abundances decrease after one tick', () => {
    const state = makeHealthyState()
    const rng = createRNG(100)
    const result = applyAntibioticTick(state, rng)
    const oldTotal = state.commensals.reduce((sum, s) => sum + s.abundance, 0)
    const newTotal = result.commensals.reduce((sum, s) => sum + s.abundance, 0)
    expect(newTotal).toBeLessThan(oldTotal)
  })

  it('more sensitive species decrease more than less sensitive ones', () => {
    const state = makeHealthyState()
    // Find the most and least sensitive species
    const sorted = [...state.commensals].sort((a, b) => a.antibioticSensitivity - b.antibioticSensitivity)
    const leastSensitive = sorted[0]
    const mostSensitive = sorted[sorted.length - 1]

    const rng = createRNG(100)
    const result = applyAntibioticTick(state, rng)

    const leastResult = result.commensals.find((s) => s.name === leastSensitive.name)!
    const mostResult = result.commensals.find((s) => s.name === mostSensitive.name)!

    // Least sensitive retains a higher fraction of its original abundance
    const leastRetention = leastResult.abundance / leastSensitive.abundance
    const mostRetention = mostResult.abundance / mostSensitive.abundance
    expect(leastRetention).toBeGreaterThan(mostRetention)
  })

  it('C. diff vegetative cells decrease', () => {
    const state = makeHealthyState()
    const rng = createRNG(100)
    const result = applyAntibioticTick(state, rng)
    expect(result.cdiff.vegetative).toBeLessThan(state.cdiff.vegetative)
  })

  it('C. diff spores remain unchanged', () => {
    const state = makeHealthyState()
    const rng = createRNG(100)
    const result = applyAntibioticTick(state, rng)
    expect(result.cdiff.spores).toBe(state.cdiff.spores)
  })

  it('multiple ticks drive commensals toward zero', () => {
    let state = makeHealthyState()
    for (let i = 0; i < 10; i++) {
      const rng = createRNG(100 + i)
      state = applyAntibioticTick(state, rng)
    }
    const total = state.commensals.reduce((sum, s) => sum + s.abundance, 0)
    expect(total).toBeLessThan(0.05)
  })
})
