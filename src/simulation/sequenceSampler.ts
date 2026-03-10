/**
 * Sequence Sampling Module
 *
 * When a student "takes a sample" from the patient, this module:
 * 1. Looks at the current gut microbiome state (abundances of all species)
 * 2. Probabilistically selects a bacterium proportional to its abundance
 * 3. Extracts a random ~500 bp subsequence from that bacterium's 16S rRNA gene
 * 4. Returns a FASTA-formatted sequence that students can BLAST at NCBI
 *
 * Students then classify the sequence as:
 * - Host commensal bacteria (healthy microbiome species)
 * - SER-109 / Vowst therapeutic bacteria (Firmicutes spore-formers)
 * - Clostridioides difficile (the pathogen)
 */

import type { SimulationState } from './types'
import type { RNG } from './random'
import { getSequenceForOrganism, type BacterialSequenceData, type BacterialCategory } from '../data/bacterialSequences'

/** Length of the subsequence to extract for BLAST (mimics Sanger or short-read sequencing) */
const SAMPLE_SEQUENCE_LENGTH = 500

export interface SampleResult {
  /** The FASTA-formatted sequence to BLAST */
  fastaSequence: string
  /** Which organism was sampled (hidden from students until they BLAST) */
  sourceOrganism: string
  /** The sequence category — for answer key / educator view */
  category: BacterialCategory
  /** Display name of the organism */
  displayName: string
  /** Starting position within the 16S rRNA gene */
  sequenceStart: number
  /** Ending position within the 16S rRNA gene */
  sequenceEnd: number
  /** Tick at which the sample was taken */
  tick: number
  /** Brief hint for students */
  blastHint: string
}

/**
 * Select a bacterium from the current gut state, weighted by abundance.
 * C. diff vegetative cells are included in the pool if abundant enough.
 */
function selectOrganism(state: SimulationState, rng: RNG): { name: string; isCdiff: boolean } {
  // Build a weighted pool of all organisms present at detectable levels
  const pool: Array<{ name: string; weight: number; isCdiff: boolean }> = []

  for (const species of state.commensals) {
    if (species.abundance > 0.001) {
      pool.push({ name: species.name, weight: species.abundance, isCdiff: false })
    }
  }

  // Include C. diff vegetative cells if present (they're the actively growing form)
  const cdiffVegetative = state.cdiff.vegetative
  if (cdiffVegetative > 0.001) {
    pool.push({ name: 'cdiff', weight: cdiffVegetative * 2, isCdiff: true }) // multiply to account for high cell density
  }

  if (pool.length === 0) {
    // Fallback: sample C. diff spores
    return { name: 'cdiff', isCdiff: true }
  }

  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0)
  let target = rng.next() * totalWeight
  for (const item of pool) {
    target -= item.weight
    if (target <= 0) {
      return { name: item.name, isCdiff: item.isCdiff }
    }
  }

  // Fallback to last item
  const last = pool[pool.length - 1]
  return { name: last.name, isCdiff: last.isCdiff }
}

/**
 * Extract a random subsequence of the given length from a full-length 16S sequence.
 * Positions are weighted to favor variable regions (V1-V4) which are most diagnostic.
 */
function extractSubsequence(
  fullSequence: string,
  length: number,
  rng: RNG,
): { subsequence: string; start: number; end: number } {
  const maxStart = fullSequence.length - length
  if (maxStart <= 0) {
    return { subsequence: fullSequence, start: 0, end: fullSequence.length }
  }

  // Bias toward the first half of the gene (V1-V4 regions are most BLAST-diagnostic)
  // Use a beta-like distribution: mostly 0-70% of the gene
  const rawPos = rng.next()
  const biasedPos = rawPos * rawPos // Square to bias toward start
  const start = Math.floor(biasedPos * maxStart)
  const end = start + length

  return {
    subsequence: fullSequence.slice(start, end),
    start,
    end,
  }
}

/**
 * Format a nucleotide sequence in standard FASTA format (60 chars per line).
 */
function formatFasta(header: string, sequence: string): string {
  const lines = [header]
  for (let i = 0; i < sequence.length; i += 60) {
    lines.push(sequence.slice(i, i + 60))
  }
  return lines.join('\n')
}

/**
 * Generate a BLAST hint for students based on the category.
 */
function getBlastHint(category: BacterialCategory): string {
  switch (category) {
    case 'commensal':
      return 'Paste this sequence into NCBI BLAST (blastn) to identify which gut bacterium was detected in this sample.'
    case 'ser109':
      return 'Paste this sequence into NCBI BLAST (blastn). Hint: this organism is related to those found in microbiome therapeutics.'
    case 'cdiff':
      return 'Paste this sequence into NCBI BLAST (blastn). Is this a commensal or a pathogen?'
  }
}

/** Number of sequences returned per sample to show community diversity */
export const SEQUENCES_PER_SAMPLE = 10

/**
 * Take multiple samples from the current gut state and return BLAST-ready FASTA sequences.
 * Returns SEQUENCES_PER_SAMPLE results so students can observe the diversity (or dominance)
 * of species in the current microbiome.
 */
export function takeSamples(state: SimulationState, rng: RNG): SampleResult[] {
  return Array.from({ length: SEQUENCES_PER_SAMPLE }, () => takeSample(state, rng))
}

/**
 * Take a sample from the current gut state and generate a BLAST-ready FASTA sequence.
 *
 * @param state - Current simulation state (used to determine which organisms are present)
 * @param rng - Seeded random number generator for reproducibility
 * @returns A SampleResult with FASTA sequence and metadata
 */
function takeSample(state: SimulationState, rng: RNG): SampleResult {
  const { name, isCdiff } = selectOrganism(state, rng)

  // Look up the sequence data
  const seqData: BacterialSequenceData | null = getSequenceForOrganism(isCdiff ? 'cdiff' : name)

  // Fallback: if we don't have a sequence for this exact organism, pick a commensal
  let resolvedData: BacterialSequenceData
  if (seqData) {
    resolvedData = seqData
  } else {
    // Find any commensal in the pool that has a sequence
    const fallbackName = state.commensals.find((s) => getSequenceForOrganism(s.name) !== null)?.name
    const fallback = fallbackName ? getSequenceForOrganism(fallbackName) : null
    if (!fallback) {
      // Last resort: use C. diff
      resolvedData = getSequenceForOrganism('cdiff')!
    } else {
      resolvedData = fallback
    }
  }

  const { subsequence, start, end } = extractSubsequence(resolvedData.sequence16S, SAMPLE_SEQUENCE_LENGTH, rng)

  const fastaHeader = `>Sample_Day${state.tick} | unknown bacterium | 16S rRNA partial | ${end - start} bp`
  const fastaSequence = formatFasta(fastaHeader, subsequence)

  return {
    fastaSequence,
    sourceOrganism: resolvedData.simulationName,
    category: resolvedData.category,
    displayName: resolvedData.displayName,
    sequenceStart: start,
    sequenceEnd: end,
    tick: state.tick,
    blastHint: getBlastHint(resolvedData.category),
  }
}
