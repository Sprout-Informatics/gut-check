import { useSimulation } from '../state/SimulationContext'
import PopulationChart from './PopulationChart'
import HealthScoreBar from './HealthScoreBar'
import RecurrenceCounter from './RecurrenceCounter'
import PhaseIndicator from './PhaseIndicator'
import TreatmentControls from './TreatmentControls'
import TimeControls from './TimeControls'
import EventLog from './EventLog'
import GameSummary from './GameSummary'

export default function PatientDashboard() {
  const { state } = useSimulation()
  const sim = state.simulation

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

        {/* Treatment Controls */}
        <div className="mb-6">
          <TreatmentControls />
        </div>

        {/* Event Log */}
        <EventLog />

        {/* Game Summary Modal */}
        <GameSummary />
      </div>
    </div>
  )
}
