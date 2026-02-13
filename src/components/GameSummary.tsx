import { useSimulation } from '../state/SimulationContext'

export default function GameSummary() {
  const { state, dispatch } = useSimulation()
  const sim = state.simulation

  if (!sim.outcome) return null

  const isCure = sim.outcome === 'durable_cure'
  const isDeath = sim.outcome === 'patient_death'

  // Calculate a simple score for durable cure
  const score = isCure
    ? Math.max(0, 100 - sim.recurrenceCount * 20 - sim.antibioticCoursesGiven * 10 - Math.floor(sim.tick / 10))
    : 0

  const title = isCure
    ? 'Durable Cure Achieved!'
    : isDeath
      ? 'Patient Died'
      : 'Chronic C. difficile Infection'

  const educationalMessage = isCure
    ? 'By restoring the commensal bacteria, competitive exclusion pushed C. difficile out of the gut permanently. This is how microbiome therapeutics like Vowst work — they don\'t kill the pathogen directly, they restore the ecosystem that keeps it in check.'
    : isDeath
      ? 'The patient succumbed to overwhelming C. difficile toxin damage. Unchecked C. difficile produces toxins that destroy the intestinal lining. Early intervention with antibiotics followed by microbiome therapy is critical to prevent this outcome.'
      : sim.antibioticCoursesGiven > 2
        ? 'Repeated antibiotic courses kept killing the recovering commensals, creating a cycle of recurrence. The microbiome therapeutic could have broken this cycle by directly repopulating the gut.'
        : !sim.therapeuticApplied
          ? 'Without therapeutic intervention, the depleted microbiome couldn\'t recover fast enough to prevent C. difficile from taking over. A microbiome therapeutic restores competitive exclusion directly.'
          : 'The simulation reached its time limit. Consider adjusting your treatment strategy — timing matters when managing C. difficile infections.'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-lg w-full rounded-xl shadow-2xl p-8 ${isCure ? 'bg-green-50' : 'bg-red-50'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${isCure ? 'text-green-800' : 'text-red-800'}`}>
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/70 rounded-lg p-3">
            <span className="text-xs text-gray-500">Days</span>
            <p className="text-xl font-bold text-gray-800">{sim.tick}</p>
          </div>
          <div className="bg-white/70 rounded-lg p-3">
            <span className="text-xs text-gray-500">Recurrences</span>
            <p className="text-xl font-bold text-gray-800">{sim.recurrenceCount}</p>
          </div>
          <div className="bg-white/70 rounded-lg p-3">
            <span className="text-xs text-gray-500">Antibiotic Courses</span>
            <p className="text-xl font-bold text-gray-800">{sim.antibioticCoursesGiven}</p>
          </div>
          <div className="bg-white/70 rounded-lg p-3">
            <span className="text-xs text-gray-500">Therapeutic Used</span>
            <p className="text-xl font-bold text-gray-800">{sim.therapeuticApplied ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {isCure && (
          <div className="bg-white/70 rounded-lg p-3 mb-4 text-center">
            <span className="text-xs text-gray-500">Score</span>
            <p className="text-3xl font-bold text-green-700">{score}</p>
          </div>
        )}

        <p className={`text-sm mb-6 leading-relaxed ${isCure ? 'text-green-700' : 'text-red-700'}`}>
          {educationalMessage}
        </p>

        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
            isCure ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
