export interface BacterialPopulation {
  name: string
  abundance: number
  isCommensal: boolean
  isTherapeutic?: boolean
  antibioticSensitivity: number
  growthRate: number
  competitiveStrength: number
}

// --- Metagenomic sampling types ---

export type SpeciesCategory = 'commensal' | 'cdiff' | 'therapeutic'

export interface SampleSpecies {
  name: string
  category: SpeciesCategory
  abundance: number   // 0–100; all species sum to 100
  readCount: number
}

export interface SequencingRead {
  id: number
  species: string
  category: SpeciesCategory
  sequence: string         // 24-bp deterministic fake sequence
  userLabel: SpeciesCategory | null
}

export interface MicrobiomeSample {
  tick: number
  species: SampleSpecies[]
  reads: SequencingRead[]  // all reads, pre-shuffled
  totalReads: number
}

export interface CDiffState {
  spores: number
  vegetative: number
  toxinLevel: number
  germinationRate: number
}

export type SimulationPhase =
  | 'healthy_baseline'
  | 'antibiotic_disruption'
  | 'cdiff_bloom'
  | 'antibiotic_trap'
  | 'microbiome_therapeutic'
  | 'resolved'
  | 'chronic_infection'

export interface HistoryEntry {
  tick: number
  totalCommensalAbundance: number
  cdiffAbundance: number
  toxinLevel: number
  diversityIndex: number
  healthScore: number
}

export interface GameEvent {
  tick: number
  type: 'info' | 'warning' | 'critical' | 'success'
  message: string
}

export type PlayerAction =
  | { type: 'ADMINISTER_ANTIBIOTICS'; intensity?: number }
  | { type: 'ADMINISTER_THERAPEUTIC'; dose?: number }
  | { type: 'WAIT_AND_MONITOR' }

export type SimulationOutcome = 'simulation_complete' | 'patient_death'

export interface SimulationState {
  tick: number
  phase: SimulationPhase
  commensals: BacterialPopulation[]
  cdiff: CDiffState
  totalCommensalAbundance: number
  diversityIndex: number
  healthScore: number
  antibioticActive: boolean
  antibioticTicksRemaining: number
  antibioticCoursesGiven: number
  therapeuticApplied: boolean
  recurrenceCount: number
  cdiffVirulence: number
  history: HistoryEntry[]
  events: GameEvent[]
  rngSeed: number
  cumulativeHealth: number
  outcome: SimulationOutcome | null
}
