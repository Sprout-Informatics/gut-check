import { useSimulation } from '../state/SimulationContext'

export default function RecurrenceCounter() {
  const { state } = useSimulation()
  const { recurrenceCount, antibioticCoursesGiven } = state.simulation

  const recurrenceColor =
    recurrenceCount === 0 ? 'text-green-600' : recurrenceCount === 1 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-600">C. diff Recurrences</span>
        <p className={`text-2xl font-bold ${recurrenceColor}`}>{recurrenceCount}</p>
      </div>
      <div>
        <span className="text-sm font-medium text-gray-600">Antibiotic Courses</span>
        <p className="text-2xl font-bold text-gray-800">{antibioticCoursesGiven}</p>
      </div>
    </div>
  )
}
