import { useSimulation } from '../state/SimulationContext'
import type { SimulationPhase } from '../simulation/types'

const PHASE_CONFIG: Record<SimulationPhase, { label: string; color: string; description: string }> = {
  healthy_baseline: {
    label: 'Healthy Baseline',
    color: 'bg-green-100 text-green-800 border-green-300',
    description: "Your patient's gut is healthy with diverse commensal bacteria.",
  },
  antibiotic_disruption: {
    label: 'Antibiotic Disruption',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Antibiotics are killing bacteria — both good and bad.',
  },
  cdiff_bloom: {
    label: 'C. diff Bloom',
    color: 'bg-red-100 text-red-800 border-red-300',
    description: 'C. difficile is expanding into the empty gut niche!',
  },
  antibiotic_trap: {
    label: 'Antibiotic Trap',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Antibiotics kill C. diff temporarily, but also prevent commensal recovery.',
  },
  microbiome_therapeutic: {
    label: 'Microbiome Therapeutic',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Therapeutic commensal spores are restoring the gut ecosystem.',
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Durable cure achieved! The microbiome has recovered.',
  },
  chronic_infection: {
    label: 'Chronic Infection',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'The patient developed chronic C. difficile infection.',
  },
}

export default function PhaseIndicator() {
  const { state } = useSimulation()
  const phase = state.simulation.phase
  const config = PHASE_CONFIG[phase]

  return (
    <div className={`inline-flex flex-col rounded-lg border px-4 py-2 ${config.color}`}>
      <span className="text-sm font-bold">{config.label}</span>
      <span className="text-xs opacity-80">{config.description}</span>
    </div>
  )
}
