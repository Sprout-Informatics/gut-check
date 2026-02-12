import { useSimulation } from '../state/SimulationContext'

export default function HealthScoreBar() {
  const { state } = useSimulation()
  const health = state.simulation.healthScore

  const color = health > 70 ? 'bg-green-500' : health > 40 ? 'bg-yellow-500' : 'bg-red-500'
  const textColor = health > 70 ? 'text-green-700' : health > 40 ? 'text-yellow-700' : 'text-red-700'

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">Patient Health</span>
        <span className={`text-lg font-bold ${textColor}`}>{Math.round(health)}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.max(0, Math.min(100, health))}%` }}
        />
      </div>
    </div>
  )
}
