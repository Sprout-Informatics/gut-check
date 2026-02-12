import { describe, it, expect } from 'vitest'
import { createRNG } from '../../src/simulation/random'
import { generateInitialProfile, generateInitialCDiffState } from '../../src/simulation/profiles'
import { DEFAULTS } from '../../src/simulation/constants'

describe('generateInitialProfile', () => {
  it('returns correct number of species', () => {
    const rng = createRNG(42)
    const profile = generateInitialProfile(rng)
    expect(profile).toHaveLength(DEFAULTS.INITIAL_COMMENSAL_SPECIES_COUNT)
  })

  it('all abundances are positive', () => {
    const rng = createRNG(42)
    const profile = generateInitialProfile(rng)
    for (const species of profile) {
      expect(species.abundance).toBeGreaterThan(0)
    }
  })

  it('total abundance is in [0.7, 1.0] range', () => {
    const rng = createRNG(42)
    const profile = generateInitialProfile(rng)
    const total = profile.reduce((sum, s) => sum + s.abundance, 0)
    expect(total).toBeGreaterThanOrEqual(0.7)
    expect(total).toBeLessThanOrEqual(1.0)
  })

  it('all growth rates are positive', () => {
    const rng = createRNG(42)
    const profile = generateInitialProfile(rng)
    for (const species of profile) {
      expect(species.growthRate).toBeGreaterThan(0)
    }
  })

  it('all antibiotic sensitivities are in [0.1, 1.0]', () => {
    const rng = createRNG(42)
    const profile = generateInitialProfile(rng)
    for (const species of profile) {
      expect(species.antibioticSensitivity).toBeGreaterThanOrEqual(0.1)
      expect(species.antibioticSensitivity).toBeLessThanOrEqual(1.0)
    }
  })

  it('all species are marked as commensal', () => {
    const rng = createRNG(42)
    const profile = generateInitialProfile(rng)
    for (const species of profile) {
      expect(species.isCommensal).toBe(true)
    }
  })

  it('different seeds produce different profiles', () => {
    const profile1 = generateInitialProfile(createRNG(42))
    const profile2 = generateInitialProfile(createRNG(99))
    const names1 = profile1.map((s) => s.name)
    const names2 = profile2.map((s) => s.name)
    // Very unlikely to be identical with different seeds
    const abundances1 = profile1.map((s) => s.abundance)
    const abundances2 = profile2.map((s) => s.abundance)
    expect(abundances1).not.toEqual(abundances2)
  })
})

describe('generateInitialCDiffState', () => {
  it('returns low spores and zero vegetative', () => {
    const rng = createRNG(42)
    const cdiff = generateInitialCDiffState(rng)
    expect(cdiff.spores).toBeGreaterThan(0)
    expect(cdiff.spores).toBeLessThan(0.1)
    expect(cdiff.vegetative).toBe(0)
    expect(cdiff.toxinLevel).toBe(0)
    expect(cdiff.germinationRate).toBe(DEFAULTS.CDIFF_SPORE_GERMINATION_BASE)
  })
})
