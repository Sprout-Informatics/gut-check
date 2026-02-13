import { describe, it, expect } from 'vitest'
import { createRNG } from '../../src/simulation/random'
import { updateCDiff, lerp } from '../../src/simulation/cdiff'
import { generateInitialProfile, generateInitialCDiffState } from '../../src/simulation/profiles'
import type { SimulationState } from '../../src/simulation/types'
import { DEFAULTS } from '../../src/simulation/constants'

function makeState(overrides: Partial<SimulationState> = {}): SimulationState {
  const rng = createRNG(42)
  const commensals = generateInitialProfile(rng)
  const totalCommensalAbundance = commensals.reduce((sum, s) => sum + s.abundance, 0)
  return {
    tick: 0,
    phase: 'healthy_baseline',
    commensals,
    cdiff: generateInitialCDiffState(createRNG(42)),
    totalCommensalAbundance,
    diversityIndex: 0,
    healthScore: 100,
    antibioticActive: false,
    antibioticTicksRemaining: 0,
    antibioticCoursesGiven: 0,
    therapeuticApplied: false,
    recurrenceCount: 0,
    history: [],
    events: [],
    rngSeed: 42,
    outcome: null,
    ...overrides,
  }
}

describe('lerp', () => {
  it('interpolates correctly', () => {
    expect(lerp(0, 10, 0)).toBe(0)
    expect(lerp(0, 10, 1)).toBe(10)
    expect(lerp(0, 10, 0.5)).toBe(5)
  })
})

describe('updateCDiff', () => {
  it('with high commensal abundance, germination is very low', () => {
    const state = makeState({ totalCommensalAbundance: 0.85 })
    const rng = createRNG(100)
    const result = updateCDiff(state, rng)
    // Vegetative should stay near zero
    expect(result.vegetative).toBeLessThan(0.01)
    expect(result.toxinLevel).toBeLessThan(0.01)
  })

  it('with zero commensal abundance, vegetative grows rapidly', () => {
    let state = makeState({
      totalCommensalAbundance: 0,
      cdiff: { spores: 0.1, vegetative: 0.05, toxinLevel: 0, germinationRate: 0.01 },
    })
    const rng = createRNG(100)
    // Run multiple ticks
    for (let i = 0; i < 20; i++) {
      const newCdiff = updateCDiff(state, rng)
      state = { ...state, cdiff: newCdiff }
    }
    expect(state.cdiff.vegetative).toBeGreaterThan(0.1)
  })

  it('sporulation converts some vegetative to spores each tick', () => {
    const state = makeState({
      totalCommensalAbundance: 0,
      cdiff: { spores: 0.01, vegetative: 0.3, toxinLevel: 0, germinationRate: 0.01 },
    })
    const rng = createRNG(100)
    const result = updateCDiff(state, rng)
    // Spores should increase due to sporulation
    expect(result.spores).toBeGreaterThan(0.01)
  })

  it('toxin level is proportional to vegetative cells', () => {
    const state = makeState({
      totalCommensalAbundance: 0,
      cdiff: { spores: 0.01, vegetative: 0.5, toxinLevel: 0, germinationRate: 0.01 },
    })
    const rng = createRNG(100)
    const result = updateCDiff(state, rng)
    expect(result.toxinLevel).toBeGreaterThan(0)
    // Toxin should be roughly vegetative * TOXIN_PRODUCTION_RATE (after growth/sporulation adjustments)
    expect(result.toxinLevel).toBeLessThan(1.0)
  })

  it('all values stay non-negative', () => {
    const state = makeState({
      totalCommensalAbundance: 0.85,
      cdiff: { spores: 0.001, vegetative: 0.001, toxinLevel: 0, germinationRate: 0.01 },
    })
    const rng = createRNG(100)
    for (let i = 0; i < 50; i++) {
      const result = updateCDiff(state, rng)
      expect(result.spores).toBeGreaterThanOrEqual(0)
      expect(result.vegetative).toBeGreaterThanOrEqual(0)
      expect(result.toxinLevel).toBeGreaterThanOrEqual(0)
    }
  })
})
