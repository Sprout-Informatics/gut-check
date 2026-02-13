import type {
  SimulationState,
  SimulationPhase,
  SimulationOutcome,
  PlayerAction,
  HistoryEntry,
  GameEvent,
} from './types'
import type { RNG } from './random'
import { DEFAULTS } from './constants'
import { generateInitialProfile, generateInitialCDiffState } from './profiles'
import { updateCDiff } from './cdiff'
import { updateHealthScore, shannonDiversity } from './health'
import { applyAntibioticTick } from './antibiotics'
import { applyNaturalRegrowthTick, applyTherapeuticIntervention } from './regrowth'

function makeHistoryEntry(state: SimulationState): HistoryEntry {
  return {
    tick: state.tick,
    totalCommensalAbundance: state.totalCommensalAbundance,
    cdiffAbundance: state.cdiff.spores + state.cdiff.vegetative,
    toxinLevel: state.cdiff.toxinLevel,
    diversityIndex: state.diversityIndex,
    healthScore: state.healthScore,
  }
}

export function determinePhase(state: SimulationState): SimulationPhase {
  if (state.outcome === 'durable_cure') return 'resolved'
  if (state.outcome === 'chronic_cdiff') return 'chronic_infection'
  if (state.therapeuticApplied && state.totalCommensalAbundance > 0.5) return 'microbiome_therapeutic'
  if (state.antibioticActive && state.antibioticCoursesGiven > 1) return 'antibiotic_trap'
  if (state.cdiff.vegetative > DEFAULTS.RECURRENCE_THRESHOLD) return 'cdiff_bloom'
  if (state.antibioticActive) return 'antibiotic_disruption'
  return 'healthy_baseline'
}

export function checkOutcome(state: SimulationState): SimulationOutcome | null {
  // Durable cure: C. diff abundance below threshold for DURABLE_CURE_TICKS consecutive ticks
  // AND commensals above 0.5
  if (state.history.length >= DEFAULTS.DURABLE_CURE_TICKS) {
    const recentHistory = state.history.slice(-DEFAULTS.DURABLE_CURE_TICKS)
    const allLow = recentHistory.every((h) => h.cdiffAbundance < 0.08)
    const commensalsHealthy = state.totalCommensalAbundance > 0.5
    if (allLow && commensalsHealthy && state.antibioticCoursesGiven > 0) {
      return 'durable_cure'
    }
  }

  // Chronic infection: exceeded max ticks
  if (state.tick >= DEFAULTS.MAX_SIMULATION_TICKS) {
    return 'chronic_cdiff'
  }

  return null
}

export function tick(state: SimulationState, rng: RNG): SimulationState {
  let newState = { ...state, tick: state.tick + 1 }
  const newEvents: GameEvent[] = [...newState.events]

  // 1. Antibiotics
  if (newState.antibioticActive) {
    newState = applyAntibioticTick(newState, rng)
    newState = { ...newState, antibioticTicksRemaining: newState.antibioticTicksRemaining - 1 }
    if (newState.antibioticTicksRemaining <= 0) {
      newState = { ...newState, antibioticActive: false }
      newEvents.push({
        tick: newState.tick,
        type: 'info',
        message: 'Antibiotic course completed.',
      })
    }
  } else {
    // 2. Natural regrowth (only when not on antibiotics)
    newState = applyNaturalRegrowthTick(newState, rng)
  }

  // 3. Recalculate totals
  const totalCommensalAbundance = newState.commensals.reduce((sum, s) => sum + s.abundance, 0)
  const diversityIndex = shannonDiversity(newState.commensals)
  newState = { ...newState, totalCommensalAbundance, diversityIndex }

  // 4. C. diff dynamics
  const prevVegetative = newState.cdiff.vegetative
  const newCdiff = updateCDiff(newState, rng)
  newState = { ...newState, cdiff: newCdiff }

  // 5. Health score
  const healthScore = updateHealthScore(newState.healthScore, newState.cdiff.toxinLevel)
  newState = { ...newState, healthScore }

  // 6. Recurrence check
  if (
    prevVegetative < DEFAULTS.RECURRENCE_THRESHOLD
    && newState.cdiff.vegetative >= DEFAULTS.RECURRENCE_THRESHOLD
    && newState.antibioticCoursesGiven > 0
  ) {
    newState = { ...newState, recurrenceCount: newState.recurrenceCount + 1 }
    newEvents.push({
      tick: newState.tick,
      type: 'critical',
      message: `C. difficile recurrence detected! (Episode ${newState.recurrenceCount})`,
    })
  }

  newState = { ...newState, events: newEvents }

  // 7. Phase
  const phase = determinePhase(newState)
  newState = { ...newState, phase }

  // 8. History
  const history = [...newState.history, makeHistoryEntry(newState)]
  newState = { ...newState, history }

  // 9. Outcome
  const outcome = checkOutcome(newState)
  if (outcome && !state.outcome) {
    const outcomeEvents = [...newState.events]
    if (outcome === 'durable_cure') {
      outcomeEvents.push({
        tick: newState.tick,
        type: 'success',
        message: 'Durable cure achieved! The microbiome has been restored.',
      })
    } else if (outcome === 'chronic_cdiff') {
      outcomeEvents.push({
        tick: newState.tick,
        type: 'critical',
        message: 'The patient developed chronic C. difficile infection.',
      })
    }
    newState = { ...newState, outcome, events: outcomeEvents, phase: determinePhase({ ...newState, outcome }) }
  }

  return newState
}

export function applyAction(state: SimulationState, action: PlayerAction, rng: RNG): SimulationState {
  const newEvents = [...state.events]

  switch (action.type) {
    case 'ADMINISTER_ANTIBIOTICS': {
      newEvents.push({
        tick: state.tick,
        type: 'warning',
        message: `Antibiotic course #${state.antibioticCoursesGiven + 1} initiated.`,
      })
      return {
        ...state,
        antibioticActive: true,
        antibioticTicksRemaining: DEFAULTS.ANTIBIOTIC_COURSE_DURATION,
        antibioticCoursesGiven: state.antibioticCoursesGiven + 1,
        events: newEvents,
      }
    }
    case 'ADMINISTER_THERAPEUTIC': {
      return applyTherapeuticIntervention(state, rng)
    }
    case 'WAIT_AND_MONITOR': {
      return state
    }
  }
}

export function createInitialState(rng: RNG, seed: number): SimulationState {
  const commensals = generateInitialProfile(rng)
  const cdiff = generateInitialCDiffState(rng)
  const totalCommensalAbundance = commensals.reduce((sum, s) => sum + s.abundance, 0)
  const diversityIndex = shannonDiversity(commensals)

  const state: SimulationState = {
    tick: 0,
    phase: 'healthy_baseline',
    commensals,
    cdiff,
    totalCommensalAbundance,
    diversityIndex,
    healthScore: DEFAULTS.HEALTH_BASELINE,
    antibioticActive: false,
    antibioticTicksRemaining: 0,
    antibioticCoursesGiven: 0,
    therapeuticApplied: false,
    recurrenceCount: 0,
    history: [],
    events: [
      {
        tick: 0,
        type: 'info',
        message: 'Simulation started. Your patient has a healthy gut microbiome.',
      },
    ],
    rngSeed: seed,
    outcome: null,
  }

  // Add initial history entry
  state.history.push(makeHistoryEntry(state))

  return state
}
