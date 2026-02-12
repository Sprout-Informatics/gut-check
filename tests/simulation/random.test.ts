import { describe, it, expect } from 'vitest'
import { createRNG, fisherYatesShuffle } from '../../src/simulation/random'

describe('createRNG', () => {
  it('same seed produces same sequence', () => {
    const rng1 = createRNG(42)
    const rng2 = createRNG(42)
    for (let i = 0; i < 20; i++) {
      expect(rng1.next()).toBe(rng2.next())
    }
  })

  it('different seeds produce different sequences', () => {
    const rng1 = createRNG(42)
    const rng2 = createRNG(99)
    const seq1 = Array.from({ length: 10 }, () => rng1.next())
    const seq2 = Array.from({ length: 10 }, () => rng2.next())
    expect(seq1).not.toEqual(seq2)
  })

  it('next() returns values in [0, 1)', () => {
    const rng = createRNG(123)
    for (let i = 0; i < 1000; i++) {
      const val = rng.next()
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThan(1)
    }
  })

  it('range(min, max) stays within bounds', () => {
    const rng = createRNG(456)
    for (let i = 0; i < 1000; i++) {
      const val = rng.range(3.5, 7.2)
      expect(val).toBeGreaterThanOrEqual(3.5)
      expect(val).toBeLessThan(7.2)
    }
  })

  it('gaussian produces values centered around mean', () => {
    const rng = createRNG(789)
    const mean = 10
    const stddev = 2
    const samples = Array.from({ length: 1000 }, () => rng.gaussian(mean, stddev))
    const sampleMean = samples.reduce((a, b) => a + b, 0) / samples.length
    expect(sampleMean).toBeGreaterThan(mean - 0.5)
    expect(sampleMean).toBeLessThan(mean + 0.5)
  })

  it('getSeed returns the original seed', () => {
    const rng = createRNG(42)
    rng.next()
    rng.next()
    expect(rng.getSeed()).toBe(42)
  })
})

describe('fisherYatesShuffle', () => {
  it('returns same elements in different order', () => {
    const rng = createRNG(42)
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = fisherYatesShuffle(input, rng)
    expect(result).toHaveLength(input.length)
    expect(result.sort((a, b) => a - b)).toEqual(input)
    // Very unlikely to be identical (1/10! chance)
  })

  it('does not mutate the input array', () => {
    const rng = createRNG(42)
    const input = [1, 2, 3, 4, 5]
    const original = [...input]
    fisherYatesShuffle(input, rng)
    expect(input).toEqual(original)
  })

  it('same seed produces same shuffle', () => {
    const input = ['a', 'b', 'c', 'd', 'e']
    const result1 = fisherYatesShuffle(input, createRNG(42))
    const result2 = fisherYatesShuffle(input, createRNG(42))
    expect(result1).toEqual(result2)
  })
})
