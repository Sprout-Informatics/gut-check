import type { SimulationState, SampleSpecies, SequencingRead, MicrobiomeSample, SpeciesCategory } from './types'
import type { RNG } from './random'
import { fisherYatesShuffle } from './random'
import { COMMENSAL_SPECIES_POOL } from './commensal-species'

const TOTAL_READS = 500
const CHALLENGE_READ_COUNT = 20

/**
 * Generate a deterministic 24-bp DNA sequence for a species.
 * Uses a simple hash of the species name to seed the bases so
 * the same species always produces the same motif.
 */
function speciesSequence(name: string): string {
  const bases = ['A', 'T', 'G', 'C']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
  }
  let seq = ''
  for (let i = 0; i < 24; i++) {
    hash = ((hash * 1103515245 + 12345) & 0x7fffffff)
    seq += bases[hash % 4]
  }
  return seq
}

/**
 * Given the current simulation state, produce a MicrobiomeSample:
 * - Extracts commensal / C. diff / therapeutic percentages
 * - Distributes commensals across the 30-species pool using a log-normal distribution
 * - Generates sequencing reads proportional to species abundance
 */
export function generateSample(state: SimulationState, rng: RNG): MicrobiomeSample {
  // 1. Compute raw totals from simulation state
  const cdiffRaw = state.cdiff.vegetative + state.cdiff.spores
  const commensalRaw = state.totalCommensalAbundance
  const grandTotal = cdiffRaw + commensalRaw || 1 // avoid /0

  // 2. Split commensals into native vs therapeutic
  let therapeuticRaw = 0
  let nativeRaw = 0
  for (const sp of state.commensals) {
    if (sp.isTherapeutic) {
      therapeuticRaw += sp.abundance
    } else {
      nativeRaw += sp.abundance
    }
  }

  // Normalize everything to sum to 100
  const cdiffPct = (cdiffRaw / grandTotal) * 100
  const therapeuticPct = (therapeuticRaw / grandTotal) * 100
  const nativePct = (nativeRaw / grandTotal) * 100

  // 3. Distribute native commensal percentage across species with log-normal weights
  const speciesCount = Math.min(COMMENSAL_SPECIES_POOL.length, Math.max(10, Math.floor(rng.range(12, 22))))
  const shuffledPool = fisherYatesShuffle(COMMENSAL_SPECIES_POOL, rng)
  const selectedCommensals = shuffledPool.slice(0, speciesCount)

  const logNormalWeights = selectedCommensals.map(() => {
    const g = rng.gaussian(0, 1.2)
    return Math.exp(g)
  })
  const weightTotal = logNormalWeights.reduce((s, w) => s + w, 0) || 1

  const allSpecies: SampleSpecies[] = []

  // Add native commensals
  for (let i = 0; i < selectedCommensals.length; i++) {
    const abundance = (logNormalWeights[i] / weightTotal) * nativePct
    if (abundance >= 0.01) {
      allSpecies.push({
        name: selectedCommensals[i],
        category: 'commensal',
        abundance,
        readCount: 0, // set below
      })
    }
  }

  // 4. Add therapeutic species
  const therapeuticSpecies = state.commensals.filter(s => s.isTherapeutic)
  if (therapeuticSpecies.length > 0 && therapeuticPct > 0) {
    const therapeuticWeights = therapeuticSpecies.map(() => Math.exp(rng.gaussian(0, 0.8)))
    const tWeightTotal = therapeuticWeights.reduce((s, w) => s + w, 0) || 1
    for (let i = 0; i < therapeuticSpecies.length; i++) {
      const abundance = (therapeuticWeights[i] / tWeightTotal) * therapeuticPct
      if (abundance >= 0.01) {
        allSpecies.push({
          name: therapeuticSpecies[i].name,
          category: 'therapeutic',
          abundance,
          readCount: 0,
        })
      }
    }
  }

  // 5. Add C. difficile
  if (cdiffPct >= 0.01) {
    allSpecies.push({
      name: 'C. difficile',
      category: 'cdiff',
      abundance: cdiffPct,
      readCount: 0,
    })
  }

  // 6. Normalize abundances to sum to exactly 100
  const abundanceSum = allSpecies.reduce((s, sp) => s + sp.abundance, 0) || 1
  for (const sp of allSpecies) {
    sp.abundance = (sp.abundance / abundanceSum) * 100
  }

  // 7. Assign read counts proportional to abundance
  let assignedReads = 0
  for (const sp of allSpecies) {
    sp.readCount = Math.round((sp.abundance / 100) * TOTAL_READS)
    assignedReads += sp.readCount
  }
  // Fix rounding remainder: add/subtract from the largest species
  if (allSpecies.length > 0) {
    const largest = allSpecies.reduce((a, b) => a.abundance > b.abundance ? a : b)
    largest.readCount += TOTAL_READS - assignedReads
  }

  // 8. Generate reads
  const reads: SequencingRead[] = []
  for (const sp of allSpecies) {
    const baseSeq = speciesSequence(sp.name)
    for (let i = 0; i < sp.readCount; i++) {
      reads.push({
        id: reads.length,
        species: sp.name,
        category: sp.category,
        sequence: baseSeq,
        userLabel: null,
      })
    }
  }

  // Shuffle reads so they appear in random order
  const shuffledReads = fisherYatesShuffle(reads, rng)
  // Re-assign IDs after shuffle
  for (let i = 0; i < shuffledReads.length; i++) {
    shuffledReads[i].id = i
  }

  // Sort species by abundance descending for display
  allSpecies.sort((a, b) => b.abundance - a.abundance)

  return {
    tick: state.tick,
    species: allSpecies,
    reads: shuffledReads,
    totalReads: TOTAL_READS,
  }
}

/**
 * Select a stratified subset of reads for the classification challenge.
 * Picks reads so the category ratios roughly mirror the true composition,
 * ensuring at least 1 read from each present category.
 */
export function selectChallengeReads(sample: MicrobiomeSample, rng: RNG): SequencingRead[] {
  const n = Math.min(CHALLENGE_READ_COUNT, sample.reads.length)

  // Group reads by category
  const byCategory: Record<SpeciesCategory, SequencingRead[]> = {
    commensal: [],
    cdiff: [],
    therapeutic: [],
  }
  for (const r of sample.reads) {
    byCategory[r.category].push(r)
  }

  const result: SequencingRead[] = []
  const categories: SpeciesCategory[] = ['commensal', 'cdiff', 'therapeutic']

  // Ensure at least 1 from each present category
  for (const cat of categories) {
    if (byCategory[cat].length > 0) {
      const shuffled = fisherYatesShuffle(byCategory[cat], rng)
      result.push(shuffled[0])
      byCategory[cat] = shuffled.slice(1)
    }
  }

  // Fill remaining slots proportionally
  const remaining = n - result.length
  if (remaining > 0) {
    const pool = [...byCategory.commensal, ...byCategory.cdiff, ...byCategory.therapeutic]
    const shuffled = fisherYatesShuffle(pool, rng)
    result.push(...shuffled.slice(0, remaining))
  }

  return fisherYatesShuffle(result, rng)
}

export { TOTAL_READS, CHALLENGE_READ_COUNT }
