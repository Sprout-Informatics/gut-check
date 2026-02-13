import { useSimulation } from '../state/SimulationContext'

export default function GameSummary() {
  const { state, dispatch } = useSimulation()
  const sim = state.simulation

  if (!sim.outcome) return null

  const isDeath = sim.outcome === 'patient_death'

  // Average health over the simulation (0-100)
  const avgHealth = sim.tick > 0 ? sim.cumulativeHealth / sim.tick : 0

  // Score: weighted combination of average health and recurrence penalty
  // avgHealth contributes up to 70 points, recurrences subtract up to 30
  const healthComponent = Math.round(avgHealth * 0.7)
  const recurrencePenalty = Math.min(30, sim.recurrenceCount * 10)
  const score = Math.max(0, healthComponent - recurrencePenalty)

  const title = isDeath
    ? 'Patient Died'
    : score >= 60
      ? 'Excellent Outcome'
      : score >= 40
        ? 'Moderate Outcome'
        : 'Poor Outcome'

  const educationalMessage = isDeath
    ? 'The patient succumbed to overwhelming C. difficile toxin damage. Unchecked C. difficile produces toxins that destroy the intestinal lining. Early intervention with antibiotics followed by microbiome therapy is critical to prevent this outcome.'
    : sim.recurrenceCount >= 3
      ? 'Repeated C. difficile recurrences caused significant patient harm. Each recurrence damages the gut lining and delays recovery. Consider using a microbiome therapeutic earlier to break the recurrence cycle.'
      : avgHealth >= 80
        ? 'Your patient maintained strong health throughout the simulation. Competitive exclusion by a healthy microbiome is the key to keeping C. difficile in check.'
        : avgHealth >= 50
          ? 'Your patient experienced some health challenges but survived. Timely use of microbiome therapeutics after antibiotic treatment can help restore the gut ecosystem faster.'
          : 'Your patient struggled significantly. C. difficile toxin damage accumulated over time. A combination of targeted antibiotics and microbiome restoration is essential for good outcomes.'

  const isGood = score >= 50 && !isDeath

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-lg w-full rounded-xl shadow-2xl p-8 ${isGood ? 'bg-green-50' : 'bg-red-50'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${isGood ? 'text-green-800' : 'text-red-800'}`}>
          {title}
        </h2>

        <div className="bg-white/70 rounded-lg p-4 mb-4 text-center">
          <span className="text-xs text-gray-500">Patient Score</span>
          <p className={`text-4xl font-bold ${isGood ? 'text-green-700' : 'text-red-700'}`}>{score}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/70 rounded-lg p-3">
            <span className="text-xs text-gray-500">Avg Health</span>
            <p className="text-xl font-bold text-gray-800">{avgHealth.toFixed(1)}</p>
          </div>
          <div className="bg-white/70 rounded-lg p-3">
            <span className="text-xs text-gray-500">Recurrences</span>
            <p className="text-xl font-bold text-gray-800">{sim.recurrenceCount}</p>
          </div>
          <div className="bg-white/70 rounded-lg p-3">
            <span className="text-xs text-gray-500">Days Survived</span>
            <p className="text-xl font-bold text-gray-800">{sim.tick}</p>
          </div>
          <div className="bg-white/70 rounded-lg p-3">
            <span className="text-xs text-gray-500">Antibiotic Courses</span>
            <p className="text-xl font-bold text-gray-800">{sim.antibioticCoursesGiven}</p>
          </div>
        </div>

        <div className="bg-white/70 rounded-lg p-3 mb-4 text-xs text-gray-500">
          <p>Score = avg health × 0.7 − recurrences × 10 (max penalty 30)</p>
        </div>

        <p className={`text-sm mb-6 leading-relaxed ${isGood ? 'text-green-700' : 'text-red-700'}`}>
          {educationalMessage}
        </p>

        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
            isGood ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
