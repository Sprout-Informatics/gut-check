import type { BacterialPopulation } from './types'
import { DEFAULTS } from './constants'

export function updateHealthScore(currentHealth: number, toxinLevel: number): number {
  let health = currentHealth
  if (toxinLevel > 0.05) {
    health -= DEFAULTS.HEALTH_TOXIN_DAMAGE_RATE * toxinLevel
  } else {
    health += DEFAULTS.HEALTH_RECOVERY_RATE
  }
  return Math.min(100, Math.max(0, health))
}

export function shannonDiversity(commensals: BacterialPopulation[]): number {
  const total = commensals.reduce((sum, s) => sum + s.abundance, 0)
  if (total <= 0) return 0

  let H = 0
  for (const species of commensals) {
    if (species.abundance <= 0) continue
    const p = species.abundance / total
    H -= p * Math.log2(p)
  }
  return H
}
