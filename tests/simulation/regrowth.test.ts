import { describe, it, expect } from 'vitest'
import { createRNG } from '../../src/simulation/random'
import { applyNaturalRegrowthTick, applyTherapeuticIntervention } from '../../src/simulation/regrowth'
import type { SimulationState, BacterialPopulation } from '../../src/simulation/types'
import { DEFAULTS } from '../../src/simulation/constants'

function makeDepleted(seed = 42): SimulationState {
  // Create a state where all commensals are nearly extinct (post-antibiotics)
  const commensals: BacterialPopulation[] = Array.from({ length: 12 }, (_, i) => ({
    name: `Species_${i}`,
    abundance: 0.0005,
    isCommensal: true,
    growthRate: 0.08,
    antibioticSensitivity: 0.7,
    competitiveStrength: 0.5,
  }))
  return {
    tick: 20,
    phase: 'cdiff_bloom',
    commensals,
    cdiff: { spores: 0.05, vegetative: 0.3, toxinLevel: 0.15, germinationRate: 0.2 },
    totalCommensalAbundance: commensals.reduce((sum, s) => sum + s.abundance, 0),
    diversityIndex: 0,
    healthScore: 60,
    antibioticActive: false,
    antibioticTicksRemaining: 0,
    antibioticCoursesGiven: 1,
    therapeuticApplied: false,
    recurrenceCount: 1,
    history: [],
    events: [],
    rngSeed: seed,
    outcome: null,
  }
}

describe('applyNaturalRegrowthTick', () => {
  it('from depleted state, natural rebound starts within days and recovers significantly by 30 ticks', () => {
    let state = makeDepleted()
    for (let i = 0; i < 30; i++) {
      const rng = createRNG(state.rngSeed + i)
      state = applyNaturalRegrowthTick(state, rng)
      // Update total for next tick's calculation
      state = {
        ...state,
        totalCommensalAbundance: state.commensals.reduce((sum, s) => sum + s.abundance, 0),
      }
    }
    const total = state.commensals.reduce((sum, s) => sum + s.abundance, 0)
    // With faster kinetics, significant recovery after 30 days
    expect(total).toBeGreaterThan(0.2)
    // But not yet at full capacity
    expect(total).toBeLessThan(0.95)
  })

  it('nearly-extinct species begin recovering stochastically', () => {
    const state = makeDepleted()
    const rng = createRNG(100)
    const result = applyNaturalRegrowthTick(state, rng)
    // With 20% chance per tick, some species start recovering each day
    const stillExtinct = result.commensals.filter((s) => s.abundance < 0.01)
    expect(stillExtinct.length).toBeGreaterThan(3) // Some still extinct after 1 tick
  })

  it('living species grow logistically', () => {
    const state = makeDepleted()
    // Give one species a meaningful abundance
    state.commensals[0].abundance = 0.1
    state.totalCommensalAbundance = state.commensals.reduce((sum, s) => sum + s.abundance, 0)

    const rng = createRNG(100)
    const result = applyNaturalRegrowthTick(state, rng)
    expect(result.commensals[0].abundance).toBeGreaterThan(0.1)
  })
})

describe('applyTherapeuticIntervention', () => {
  it('immediately increases total commensal abundance', () => {
    const state = makeDepleted()
    const rng = createRNG(100)
    const result = applyTherapeuticIntervention(state, rng)
    const oldTotal = state.commensals.reduce((sum, s) => sum + s.abundance, 0)
    const newTotal = result.commensals.reduce((sum, s) => sum + s.abundance, 0)
    expect(newTotal - oldTotal).toBeGreaterThan(DEFAULTS.THERAPEUTIC_COMMENSAL_BOOST * 0.7)
    expect(newTotal - oldTotal).toBeLessThan(DEFAULTS.THERAPEUTIC_COMMENSAL_BOOST * 1.3)
  })

  it('sets therapeuticApplied flag', () => {
    const state = makeDepleted()
    const rng = createRNG(100)
    const result = applyTherapeuticIntervention(state, rng)
    expect(result.therapeuticApplied).toBe(true)
  })

  it('adds event to log', () => {
    const state = makeDepleted()
    const rng = createRNG(100)
    const result = applyTherapeuticIntervention(state, rng)
    expect(result.events.length).toBeGreaterThan(state.events.length)
    const lastEvent = result.events[result.events.length - 1]
    expect(lastEvent.type).toBe('success')
    expect(lastEvent.message).toContain('therapeutic')
  })

  it('therapeutic + 10 ticks of natural regrowth beats natural-only', () => {
    // Therapeutic path
    let therapeuticState = makeDepleted()
    let rng = createRNG(100)
    therapeuticState = applyTherapeuticIntervention(therapeuticState, rng)
    therapeuticState = {
      ...therapeuticState,
      totalCommensalAbundance: therapeuticState.commensals.reduce((sum, s) => sum + s.abundance, 0),
    }
    for (let i = 0; i < 10; i++) {
      rng = createRNG(200 + i)
      therapeuticState = applyNaturalRegrowthTick(therapeuticState, rng)
      therapeuticState = {
        ...therapeuticState,
        totalCommensalAbundance: therapeuticState.commensals.reduce((sum, s) => sum + s.abundance, 0),
      }
    }

    // Natural-only path
    let naturalState = makeDepleted()
    for (let i = 0; i < 10; i++) {
      rng = createRNG(200 + i)
      naturalState = applyNaturalRegrowthTick(naturalState, rng)
      naturalState = {
        ...naturalState,
        totalCommensalAbundance: naturalState.commensals.reduce((sum, s) => sum + s.abundance, 0),
      }
    }

    const therapeuticTotal = therapeuticState.commensals.reduce((sum, s) => sum + s.abundance, 0)
    const naturalTotal = naturalState.commensals.reduce((sum, s) => sum + s.abundance, 0)
    expect(therapeuticTotal).toBeGreaterThan(naturalTotal)
  })
})
