import PopulationChart from './PopulationChart'
import HealthScoreBar from './HealthScoreBar'
import RecurrenceCounter from './RecurrenceCounter'
import TreatmentControls from './TreatmentControls'
import TimeControls from './TimeControls'
import EventLog from './EventLog'
import GameSummary from './GameSummary'
import ParameterSliders from './ParameterSliders'
import SequenceSampler from './SequenceSampler'

export default function PatientDashboard() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <HealthScoreBar />
          <RecurrenceCounter />
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
      </div>
    </div>
  )
}
