import { useState } from 'react'
import { useSimulation } from '../state/SimulationContext'

interface SliderProps {
  label: string
  description: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}

function Slider({ label, description, min, max, step, value, onChange }: SliderProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-mono text-gray-500">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  )
}

export default function ParameterSliders() {
  const { dispatch } = useSimulation()
  const [open, setOpen] = useState(false)
  const [seedInput, setSeedInput] = useState('')

  // These are display-only defaults since we restart on change
  const [antibioticIntensity, setAntibioticIntensity] = useState(0.7)
  const [therapeuticDose, setTherapeuticDose] = useState(0.4)
  const [cdiffGrowth, setCdiffGrowth] = useState(0.15)
  const [commensalRecovery, setCommensalRecovery] = useState(0.08)

  const handleStartWithSeed = () => {
    const seed = parseInt(seedInput, 10)
    if (!isNaN(seed)) {
      dispatch({ type: 'INIT_SIMULATION', seed })
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
      >
        <span>Advanced Settings</span>
        <span className="text-gray-400">{open ? '\u25B2' : '\u25BC'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-5 border-t border-gray-100 pt-4">
          {/* Seed Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Simulation Seed</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                placeholder="Enter seed number..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button
                onClick={handleStartWithSeed}
                className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Start with Seed
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Use the same seed as your classmates for identical starting conditions.
            </p>
          </div>

          {/* Sliders */}
          <Slider
            label="Antibiotic Intensity"
            description="How destructive antibiotics are to gut bacteria. Higher = more collateral damage."
            min={0.3}
            max={1.0}
            step={0.05}
            value={antibioticIntensity}
            onChange={setAntibioticIntensity}
          />
          <Slider
            label="Therapeutic Dose"
            description="Amount of commensal spores delivered by the microbiome therapeutic."
            min={0.1}
            max={0.8}
            step={0.05}
            value={therapeuticDose}
            onChange={setTherapeuticDose}
          />
          <Slider
            label="C. diff Growth Rate"
            description="How aggressively C. difficile expands when the gut is vacant."
            min={0.05}
            max={0.3}
            step={0.01}
            value={cdiffGrowth}
            onChange={setCdiffGrowth}
          />
          <Slider
            label="Commensal Recovery Rate"
            description="How quickly commensal bacteria regrow naturally after disruption."
            min={0.03}
            max={0.15}
            step={0.01}
            value={commensalRecovery}
            onChange={setCommensalRecovery}
          />

          <p className="text-xs text-gray-400 italic">
            Parameter tuning will be applied in a future update. Currently, the seed input is functional.
          </p>
        </div>
      )}
    </div>
  )
}
