import PopulationChart from './PopulationChart'
import HealthScoreBar from './HealthScoreBar'
import TreatmentControls from './TreatmentControls'
import TimeControls from './TimeControls'
import EventLog from './EventLog'
import GameSummary from './GameSummary'
import ParameterSliders from './ParameterSliders'
import SequenceSampler from './SequenceSampler'
import { useSimulation } from '../state/SimulationContext'
import { DEFAULTS } from '../simulation/constants'

export default function PatientDashboard() {
  const { state } = useSimulation()
  const day = state.simulation.tick

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SPORE WARS</h1>
            <p className="text-sm text-gray-500">The Microbiome Game</p>
          </div>
        </div>

        {/* Patient Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <HealthScoreBar />
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-sm font-medium text-gray-600">Day</span>
            <p className="text-3xl font-bold text-gray-900">{day}</p>
            <span className="text-xs text-gray-400">/ {DEFAULTS.MAX_SIMULATION_TICKS}</span>
          </div>
        </div>

        {/* Charts and Right Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <PopulationChart />
          </div>
          <div className="md:col-span-1 flex flex-col gap-4">
            <TreatmentControls />
            <TimeControls />
            <SequenceSampler />
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

        {/* Disclaimer */}
        <footer className="mt-8 py-6 text-center text-xs text-gray-400 border-t border-gray-200">
          <p>
            <strong>Disclaimer:</strong> This is an educational exercise only. Spore Wars is not affiliated
            with Seres Therapeutics and is not related to, endorsed by, or representative of the actual
            VOWST&trade; product in any way. All simulation mechanics are simplified for educational purposes.
          </p>
          <div className="mt-6 flex flex-col items-center gap-2">
            <img src="/images/sprout_informatics_logo_only.png" alt="Sprout Informatics Logo" className="h-10 w-auto opacity-70" />
            <p>Developed by Sprout Informatics</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
