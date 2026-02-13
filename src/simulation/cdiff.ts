import type { SimulationState, CDiffState } from './types'
import type { RNG } from './random'
import { DEFAULTS } from './constants'

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Derive effective growth rate from virulence (1-10) */
export function virulenceGrowthRate(virulence: number): number {
  const t = (virulence - 1) / 9
  return lerp(DEFAULTS.CDIFF_GROWTH_RATE_MIN, DEFAULTS.CDIFF_GROWTH_RATE_MAX, t)
}

/** Derive effective toxin production rate from virulence (1-10) */
export function virulenceToxinRate(virulence: number): number {
  const t = (virulence - 1) / 9
  return lerp(DEFAULTS.CDIFF_TOXIN_RATE_MIN, DEFAULTS.CDIFF_TOXIN_RATE_MAX, t)
}

export function updateCDiff(state: SimulationState, rng: RNG): CDiffState {
  let { spores, vegetative, toxinLevel: prevToxin } = state.cdiff
  const totalCommensal = state.totalCommensalAbundance
  const growthRate = virulenceGrowthRate(state.cdiffVirulence)
  const toxinRate = virulenceToxinRate(state.cdiffVirulence)

  // 1. Competitive exclusion factor
  const exclusionRatio = clamp(totalCommensal / DEFAULTS.COMPETITIVE_EXCLUSION_THRESHOLD, 0, 1)
  const exclusionFactor = clamp(1 - exclusionRatio * DEFAULTS.COMPETITIVE_EXCLUSION_STRENGTH, 0, 1)

  // 2. Germination (spores -> vegetative)
  // Spores stay dormant during antibiotic treatment (hostile environment)
  const antibioticSuppression = state.antibioticActive ? 0.05 : 1.0
  const germinationRate = lerp(
    DEFAULTS.CDIFF_SPORE_GERMINATION_BASE,
    DEFAULTS.CDIFF_SPORE_GERMINATION_EMPTY,
    exclusionFactor,
  ) * antibioticSuppression * (1 + rng.gaussian(0, 0.05))
  const clampedGerminationRate = Math.max(0, germinationRate)
  const germinating = spores * clampedGerminationRate
  spores -= germinating
  vegetative += germinating

  // 3. Vegetative growth (logistic, into available shared capacity)
  const totalCdiff = spores + vegetative
  const available = DEFAULTS.COMMENSAL_TOTAL_CAPACITY - totalCommensal - totalCdiff
  if (available > 0) {
    const growth = growthRate
      * vegetative
      * (available / DEFAULTS.COMMENSAL_TOTAL_CAPACITY)
      * (1 + rng.gaussian(0, 0.03))
    vegetative += Math.max(0, growth)
  }

  // 4. Colonization resistance: healthy commensals actively displace C. diff
  //    and produce secondary bile acids that clear spores
  if (totalCommensal > DEFAULTS.COMPETITIVE_EXCLUSION_THRESHOLD) {
    const excess = totalCommensal - DEFAULTS.COMPETITIVE_EXCLUSION_THRESHOLD
    const displacementRate = 0.25 * excess
    vegetative *= (1 - displacementRate)
    // Secondary bile acids from commensals inhibit and clear spores
    const sporeClearanceRate = 0.06 * excess
    spores *= (1 - sporeClearanceRate)
  }

  // 5. Sporulation (vegetative -> spores)
  const sporulating = vegetative * DEFAULTS.CDIFF_SPORULATION_RATE
  vegetative -= sporulating
  spores += sporulating

  // 6. Toxin production — accumulation/decay model so toxin trails the bloom
  const toxinLevel = prevToxin * (1 - DEFAULTS.CDIFF_TOXIN_DECAY_RATE)
    + vegetative * toxinRate

  // Clamp all values
  spores = Math.max(0, spores)
  vegetative = Math.max(0, vegetative)

  return {
    spores,
    vegetative,
    toxinLevel: Math.min(1, Math.max(0, toxinLevel)),
    germinationRate: clampedGerminationRate,
  }
}
