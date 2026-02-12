import { describe, it, expect } from 'vitest'
import { updateHealthScore, shannonDiversity } from '../../src/simulation/health'
import type { BacterialPopulation } from '../../src/simulation/types'

describe('updateHealthScore', () => {
  it('high toxin causes health to decrease', () => {
    const result = updateHealthScore(100, 0.5)
    expect(result).toBeLessThan(100)
  })

  it('low/zero toxin allows health recovery', () => {
    const result = updateHealthScore(80, 0.01)
    expect(result).toBeGreaterThan(80)
  })

  it('health never goes below 0', () => {
    const result = updateHealthScore(5, 1.0)
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it('health never goes above 100', () => {
    const result = updateHealthScore(99, 0.0)
    expect(result).toBeLessThanOrEqual(100)
  })

  it('toxin at exactly threshold (0.05) allows recovery', () => {
    const result = updateHealthScore(80, 0.05)
    expect(result).toBeGreaterThan(80)
  })
})

describe('shannonDiversity', () => {
  it('equal abundances yield maximum diversity', () => {
    const commensals: BacterialPopulation[] = Array.from({ length: 4 }, (_, i) => ({
      name: `Species_${i}`,
      abundance: 0.25,
      isCommensal: true,
      growthRate: 0.08,
      antibioticSensitivity: 0.7,
      competitiveStrength: 0.5,
    }))
    const H = shannonDiversity(commensals)
    // log2(4) = 2 for 4 equal species
    expect(H).toBeCloseTo(2, 5)
  })

  it('single species yields zero diversity', () => {
    const commensals: BacterialPopulation[] = [
      { name: 'A', abundance: 1.0, isCommensal: true, growthRate: 0.08, antibioticSensitivity: 0.7, competitiveStrength: 0.5 },
      { name: 'B', abundance: 0, isCommensal: true, growthRate: 0.08, antibioticSensitivity: 0.7, competitiveStrength: 0.5 },
    ]
    const H = shannonDiversity(commensals)
    expect(H).toBe(0)
  })

  it('empty gut yields zero diversity', () => {
    const commensals: BacterialPopulation[] = [
      { name: 'A', abundance: 0, isCommensal: true, growthRate: 0.08, antibioticSensitivity: 0.7, competitiveStrength: 0.5 },
    ]
    const H = shannonDiversity(commensals)
    expect(H).toBe(0)
  })

  it('unequal abundances yield lower diversity than equal', () => {
    const equal: BacterialPopulation[] = Array.from({ length: 4 }, (_, i) => ({
      name: `Species_${i}`,
      abundance: 0.25,
      isCommensal: true,
      growthRate: 0.08,
      antibioticSensitivity: 0.7,
      competitiveStrength: 0.5,
    }))
    const unequal: BacterialPopulation[] = [
      { name: 'A', abundance: 0.9, isCommensal: true, growthRate: 0.08, antibioticSensitivity: 0.7, competitiveStrength: 0.5 },
      { name: 'B', abundance: 0.04, isCommensal: true, growthRate: 0.08, antibioticSensitivity: 0.7, competitiveStrength: 0.5 },
      { name: 'C', abundance: 0.03, isCommensal: true, growthRate: 0.08, antibioticSensitivity: 0.7, competitiveStrength: 0.5 },
      { name: 'D', abundance: 0.03, isCommensal: true, growthRate: 0.08, antibioticSensitivity: 0.7, competitiveStrength: 0.5 },
    ]
    expect(shannonDiversity(unequal)).toBeLessThan(shannonDiversity(equal))
  })
})
