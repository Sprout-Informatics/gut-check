import { useState } from 'react'
import { useSimulation } from '../state/SimulationContext'
import PopulationChart from './PopulationChart'
import HealthScoreBar from './HealthScoreBar'
import RecurrenceCounter from './RecurrenceCounter'
import PhaseIndicator from './PhaseIndicator'
import TreatmentControls from './TreatmentControls'
import TimeControls from './TimeControls'
import EventLog from './EventLog'
import GameSummary from './GameSummary'
import ParameterSliders from './ParameterSliders'
import SamplingModal from './SamplingModal'
import { generateSample } from '../simulation/sampling'
import { createRNG } from '../simulation/random'
import type { MicrobiomeSample } from '../simulation/types'

export default function PatientDashboard() {
  const { state } = useSimulation()
  const sim = state.simulation
  const [activeSample, setActiveSample] = useState<MicrobiomeSample | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GUT CHECK</h1>
            <p className="text-sm text-gray-500">The Microbiome Game — Why More Antibiotics Can Make Things Worse</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Day {sim.tick}</span>
            <PhaseIndicator />
          </div>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <PopulationChart />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <HealthScoreBar />
          <RecurrenceCounter />
          <TimeControls />
        </div>

        {/* Treatment Controls + Sampling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <TreatmentControls />
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Metagenomic Sampling</h3>
              <p className="text-xs text-gray-500 mb-3">
                Sequence a stool sample and classify the DNA reads to determine the
                bacterial composition of the gut.
              </p>
            </div>
            <button
              onClick={() => {
                const rng = createRNG(sim.rngSeed + sim.tick * 31)
                setActiveSample(generateSample(sim, rng))
              }}
              disabled={sim.outcome !== null}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Take Sample
            </button>
          </div>
        </div>

        {/* Event Log */}
        <div className="mb-6">
          <EventLog />
        </div>

        {/* Advanced Settings */}
        <ParameterSliders />

        {/* Game Summary Modal */}
        <GameSummary />

        {/* Sampling Modal */}
        {activeSample && (
          <SamplingModal sample={activeSample} onClose={() => setActiveSample(null)} />
        )}
      </div>
    </div>
  )
}
