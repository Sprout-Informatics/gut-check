import type { SimulationState, CDiffState } from './types'
import type { RNG } from './random'
import { DEFAULTS } from './constants'

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function updateCDiff(state: SimulationState, rng: RNG): CDiffState {
  let { spores, vegetative } = state.cdiff
  const totalCommensal = state.totalCommensalAbundance

  // 1. Competitive exclusion factor
  const exclusionRatio = clamp(totalCommensal / DEFAULTS.COMPETITIVE_EXCLUSION_THRESHOLD, 0, 1)
  const exclusionFactor = clamp(1 - exclusionRatio * DEFAULTS.COMPETITIVE_EXCLUSION_STRENGTH, 0, 1)

  // 2. Germination (spores -> vegetative)
  const germinationRate = lerp(
    DEFAULTS.CDIFF_SPORE_GERMINATION_BASE,
    DEFAULTS.CDIFF_SPORE_GERMINATION_EMPTY,
    exclusionFactor,
  ) * (1 + rng.gaussian(0, 0.05))
  const clampedGerminationRate = Math.max(0, germinationRate)
  const germinating = spores * clampedGerminationRate
  spores -= germinating
  vegetative += germinating

  // 3. Vegetative growth (logistic, into available capacity)
  const available = DEFAULTS.COMMENSAL_TOTAL_CAPACITY - totalCommensal - vegetative
  if (available > 0) {
    const growth = DEFAULTS.CDIFF_VEGETATIVE_GROWTH_RATE
      * vegetative
      * (available / DEFAULTS.COMMENSAL_TOTAL_CAPACITY)
      * (1 + rng.gaussian(0, 0.03))
    vegetative += Math.max(0, growth)
  }

  // 4. Sporulation (vegetative -> spores)
  const sporulating = vegetative * DEFAULTS.CDIFF_SPORULATION_RATE
  vegetative -= sporulating
  spores += sporulating

  // 5. Toxin production
  const toxinLevel = vegetative * DEFAULTS.CDIFF_TOXIN_PRODUCTION_RATE

  // Clamp all values
  spores = Math.max(0, spores)
  vegetative = Math.max(0, vegetative)

  return {
    spores,
    vegetative,
    toxinLevel: Math.max(0, toxinLevel),
    germinationRate: clampedGerminationRate,
  }
}
