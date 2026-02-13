import { useEffect, useRef, useState } from 'react'
import { useSimulation } from '../state/SimulationContext'
import { DEFAULTS } from '../simulation/constants'

export default function TimeControls() {
  const { state, dispatch } = useSimulation()
  const sim = state.simulation
  const gameOver = sim.outcome !== null
  const [autoPlaying, setAutoPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (autoPlaying && !gameOver) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'ADVANCE_ONE_TICK' })
      }, 300)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [autoPlaying, gameOver, dispatch])

  useEffect(() => {
    if (gameOver) setAutoPlaying(false)
  }, [gameOver])

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Time Controls</h3>
        <span className="text-sm text-gray-500">
          Day {sim.tick} / {DEFAULTS.MAX_SIMULATION_TICKS}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: 'ADVANCE_ONE_TICK' })}
          disabled={gameOver || autoPlaying}
          className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          +1 Day
        </button>
        <button
          onClick={() => dispatch({ type: 'ADVANCE_WEEK' })}
          disabled={gameOver || autoPlaying}
          className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          +1 Week
        </button>
        <button
          onClick={() => setAutoPlaying(!autoPlaying)}
          disabled={gameOver}
          className={`px-3 py-2 text-sm rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            autoPlaying
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-indigo-500 text-white hover:bg-indigo-600'
          }`}
        >
          {autoPlaying ? 'Stop' : 'Auto-play'}
        </button>
      </div>
    </div>
  )
}
