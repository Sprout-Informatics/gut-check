import { SimulationProvider, useSimulation } from './state/SimulationContext'

function SimulationDebug() {
  const { state, dispatch } = useSimulation()
  const sim = state.simulation

  return (
    <div className="min-h-screen bg-white p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">Gut Check</h1>
      <p className="text-gray-600 mb-6">The Microbiome Game</p>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-500">Day</span>
          <p className="text-xl font-bold">{sim.tick}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-500">Phase</span>
          <p className="text-xl font-bold">{sim.phase.replace(/_/g, ' ')}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-500">Health</span>
          <p className="text-xl font-bold">{sim.healthScore.toFixed(1)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-500">Commensals</span>
          <p className="text-xl font-bold">{sim.totalCommensalAbundance.toFixed(3)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-500">C. diff Vegetative</span>
          <p className="text-xl font-bold">{sim.cdiff.vegetative.toFixed(4)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-500">C. diff Spores</span>
          <p className="text-xl font-bold">{sim.cdiff.spores.toFixed(4)}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => dispatch({ type: 'ADVANCE_ONE_TICK' })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={sim.outcome !== null}
        >
          +1 Day
        </button>
        <button
          onClick={() => dispatch({ type: 'ADVANCE_WEEK' })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={sim.outcome !== null}
        >
          +1 Week
        </button>
        <button
          onClick={() => dispatch({ type: 'PLAYER_ACTION', action: { type: 'ADMINISTER_ANTIBIOTICS' } })}
          className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50"
          disabled={sim.outcome !== null || sim.antibioticActive}
        >
          Give Antibiotics
        </button>
        <button
          onClick={() => dispatch({ type: 'PLAYER_ACTION', action: { type: 'ADMINISTER_THERAPEUTIC' } })}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          disabled={sim.outcome !== null}
        >
          Give Therapeutic
        </button>
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {sim.outcome && (
        <div className={`mt-4 p-4 rounded ${sim.outcome === 'durable_cure' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <strong>{sim.outcome === 'durable_cure' ? 'Durable Cure Achieved!' : 'Chronic C. diff Infection'}</strong>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <SimulationProvider>
      <SimulationDebug />
    </SimulationProvider>
  )
}

export default App
