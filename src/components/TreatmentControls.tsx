import { useSimulation } from '../state/SimulationContext'

export default function TreatmentControls() {
  const { state, dispatch } = useSimulation()
  const sim = state.simulation
  const gameOver = sim.outcome !== null

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Treatment Decisions</h3>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => dispatch({ type: 'PLAYER_ACTION', action: { type: 'ADMINISTER_ANTIBIOTICS' } })}
          disabled={gameOver || sim.antibioticActive}
          className="w-full text-left px-4 py-3 rounded-lg border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="font-semibold text-amber-800">Give Antibiotics</span>
          <p className="text-xs text-amber-600 mt-1">Kills bacteria broadly — commensals and C. diff alike.</p>
        </button>

        <button
          onClick={() => dispatch({ type: 'PLAYER_ACTION', action: { type: 'ADMINISTER_THERAPEUTIC' } })}
          disabled={gameOver}
          className="w-full text-left px-4 py-3 rounded-lg border-2 border-green-300 bg-green-50 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="font-semibold text-green-800">Give Microbiome Therapy</span>
          <p className="text-xs text-green-600 mt-1">Delivers commensal spores to restore competitive exclusion.</p>
        </button>

        <button
          onClick={() => {
            dispatch({ type: 'PLAYER_ACTION', action: { type: 'WAIT_AND_MONITOR' } })
            // Also advance a week
            for (let i = 0; i < 6; i++) {
              dispatch({ type: 'ADVANCE_ONE_TICK' })
            }
          }}
          disabled={gameOver}
          className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="font-semibold text-gray-800">Wait and Monitor (1 week)</span>
          <p className="text-xs text-gray-600 mt-1">Observe for 7 days without intervention.</p>
        </button>
      </div>
    </div>
  )
}
