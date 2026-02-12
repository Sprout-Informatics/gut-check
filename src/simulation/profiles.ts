import type { BacterialPopulation, CDiffState } from './types'
import type { RNG } from './random'
import { fisherYatesShuffle } from './random'
import { DEFAULTS } from './constants'

const COMMENSAL_POOL = [
  'Bacteroides',
  'Faecalibacterium',
  'Roseburia',
  'Bifidobacterium',
  'Lactobacillus',
  'Eubacterium',
  'Ruminococcus',
  'Prevotella',
  'Akkermansia',
  'Clostridium_commensal',
  'Blautia',
  'Coprococcus',
  'Dorea',
  'Streptococcus',
  'Enterococcus',
]

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function generateInitialProfile(rng: RNG): BacterialPopulation[] {
  const shuffled = fisherYatesShuffle(COMMENSAL_POOL, rng)
  const count = DEFAULTS.INITIAL_COMMENSAL_SPECIES_COUNT
  const selected = shuffled.slice(0, count)

  // Generate raw abundances and normalize
  const rawAbundances = selected.map(() => rng.range(0.1, 1.0))
  const rawTotal = rawAbundances.reduce((sum, a) => sum + a, 0)
  const targetTotal = 0.85 * DEFAULTS.COMMENSAL_TOTAL_CAPACITY
  const scale = targetTotal / rawTotal

  return selected.map((name, i) => ({
    name,
    abundance: rawAbundances[i] * scale,
    isCommensal: true,
    growthRate: Math.max(0.01, rng.gaussian(DEFAULTS.COMMENSAL_BASE_GROWTH_RATE, DEFAULTS.GROWTH_RATE_VARIANCE)),
    antibioticSensitivity: clamp(rng.gaussian(0.7, DEFAULTS.SENSITIVITY_VARIANCE), 0.1, 1.0),
    competitiveStrength: rng.range(0.3, 0.9),
  }))
}

export function generateInitialCDiffState(rng: RNG): CDiffState {
  return {
    spores: DEFAULTS.INITIAL_CDIFF_SPORES * (1 + rng.gaussian(0, 0.1)),
    vegetative: DEFAULTS.INITIAL_CDIFF_VEGETATIVE,
    toxinLevel: 0,
    germinationRate: DEFAULTS.CDIFF_SPORE_GERMINATION_BASE,
  }
}
