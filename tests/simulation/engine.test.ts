import { describe, it, expect } from 'vitest'
import { createRNG } from '../../src/simulation/random'
import { tick, applyAction, createInitialState, determinePhase, checkOutcome } from '../../src/simulation/engine'
import { DEFAULTS } from '../../src/simulation/constants'

function advanceTicks(state: ReturnType<typeof createInitialState>, n: number, baseSeed: number) {
  let s = state
  for (let i = 0; i < n; i++) {
    const rng = createRNG(baseSeed + s.tick)
    s = tick(s, rng)
  }
  return s
}

describe('createInitialState', () => {
  it('creates a healthy baseline state', () => {
    const rng = createRNG(42)
    const state = createInitialState(rng, 42)
    expect(state.tick).toBe(0)
    expect(state.phase).toBe('healthy_baseline')
    expect(state.healthScore).toBe(100)
    expect(state.totalCommensalAbundance).toBeGreaterThan(0.7)
    expect(state.cdiff.vegetative).toBe(0)
    expect(state.antibioticActive).toBe(false)
    expect(state.history).toHaveLength(1)
    expect(state.events).toHaveLength(1)
    expect(state.outcome).toBeNull()
  })
})

describe('5-phase narrative arc', () => {
  it('Phase 1: healthy baseline — commensals stay near capacity', () => {
    const rng = createRNG(42)
    const initial = createInitialState(rng, 42)
    const state = advanceTicks(initial, 10, 42)

    expect(state.totalCommensalAbundance).toBeGreaterThan(0.7)
    expect(state.cdiff.vegetative).toBeLessThan(0.05)
    expect(state.healthScore).toBeGreaterThan(95)
  })

  it('Phase 2: antibiotic disruption — commensals drop, spores survive', () => {
    const rng = createRNG(42)
    const initial = createInitialState(rng, 42)

    // Apply antibiotics
    const actionRng = createRNG(42 + initial.tick)
    let state = applyAction(initial, { type: 'ADMINISTER_ANTIBIOTICS' }, actionRng)

    // Run through the antibiotic course
    state = advanceTicks(state, 10, 42)

    expect(state.totalCommensalAbundance).toBeLessThan(0.1)
    expect(state.cdiff.spores).toBeGreaterThan(0) // Spores survived!
    expect(state.antibioticCoursesGiven).toBe(1)
  })

  it('Phase 3: C. diff bloom — vegetative cells expand post-antibiotics', () => {
    const rng = createRNG(42)
    const initial = createInitialState(rng, 42)

    // Apply antibiotics
    let state = applyAction(initial, { type: 'ADMINISTER_ANTIBIOTICS' }, createRNG(1000))
    state = advanceTicks(state, 10, 42)

    // Now wait without intervention — C. diff should bloom quickly in depleted gut
    state = advanceTicks(state, 15, 42)

    // C. diff blooms faster now with increased germination/growth rates
    expect(state.cdiff.vegetative).toBeGreaterThan(0.01)
    expect(state.healthScore).toBeLessThan(100)
  })

  it('Phase 4: antibiotic trap — retreating kills commensals again, causes recurrence', () => {
    const rng = createRNG(42)
    const initial = createInitialState(rng, 42)

    // First antibiotic course
    let state = applyAction(initial, { type: 'ADMINISTER_ANTIBIOTICS' }, createRNG(1000))
    state = advanceTicks(state, 10, 42)

    // Brief wait for C. diff bloom to start
    state = advanceTicks(state, 10, 42)

    // Second antibiotic course (wipes both recovering commensals and C. diff vegetative)
    const cdiffBefore2ndCourse = state.cdiff.vegetative
    state = applyAction(state, { type: 'ADMINISTER_ANTIBIOTICS' }, createRNG(2000))
    state = advanceTicks(state, 10, 42)

    // C. diff vegetative should be reduced by antibiotics
    expect(state.cdiff.vegetative).toBeLessThan(cdiffBefore2ndCourse)
    expect(state.antibioticCoursesGiven).toBe(2)

    // Wait — C. diff should recur (spores survived, commensals were set back again)
    state = advanceTicks(state, 15, 42)
    expect(state.cdiff.vegetative).toBeGreaterThan(0.005)
  })

  it('Phase 5: therapeutic restores commensals and achieves durable cure', () => {
    const rng = createRNG(42)
    const initial = createInitialState(rng, 42)

    // Antibiotic disruption
    let state = applyAction(initial, { type: 'ADMINISTER_ANTIBIOTICS' }, createRNG(1000))
    state = advanceTicks(state, 10, 42)

    // Wait for C. diff bloom
    state = advanceTicks(state, 15, 42)

    // Apply therapeutic
    state = applyAction(state, { type: 'ADMINISTER_THERAPEUTIC' }, createRNG(3000))
    expect(state.therapeuticApplied).toBe(true)

    // Total should have jumped up
    const postTherapeuticTotal = state.commensals.reduce((sum, s) => sum + s.abundance, 0)
    expect(postTherapeuticTotal).toBeGreaterThan(0.3)

    // Run enough ticks for competitive exclusion to suppress C. diff
    state = advanceTicks(state, 80, 42)

    expect(state.totalCommensalAbundance).toBeGreaterThan(0.5)
    expect(state.cdiff.vegetative).toBeLessThan(0.1)
    expect(state.healthScore).toBeGreaterThan(50)
  })
})

describe('durable cure outcome', () => {
  it('outcome becomes durable_cure after sustained low C. diff', () => {
    const rng = createRNG(42)
    const initial = createInitialState(rng, 42)

    // Disrupt and restore
    let state = applyAction(initial, { type: 'ADMINISTER_ANTIBIOTICS' }, createRNG(1000))
    state = advanceTicks(state, 10, 42)
    state = advanceTicks(state, 10, 42)
    state = applyAction(state, { type: 'ADMINISTER_THERAPEUTIC' }, createRNG(3000))

    // Run many ticks to achieve durable cure (stronger C. diff needs more time)
    state = advanceTicks(state, 120, 42)

    expect(state.outcome).toBe('durable_cure')
    expect(state.phase).toBe('resolved')
  })
})

describe('determinism', () => {
  it('same seed produces identical state after N ticks', () => {
    const seed = 42

    const rng1 = createRNG(seed)
    const state1 = createInitialState(rng1, seed)
    const final1 = advanceTicks(state1, 30, seed)

    const rng2 = createRNG(seed)
    const state2 = createInitialState(rng2, seed)
    const final2 = advanceTicks(state2, 30, seed)

    expect(final1.tick).toBe(final2.tick)
    expect(final1.totalCommensalAbundance).toBe(final2.totalCommensalAbundance)
    expect(final1.cdiff.vegetative).toBe(final2.cdiff.vegetative)
    expect(final1.healthScore).toBe(final2.healthScore)
    expect(final1.history).toEqual(final2.history)
  })
})
