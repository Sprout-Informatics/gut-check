import { useState } from 'react'
import type { SequencingRead, SpeciesCategory } from '../simulation/types'

interface ReadCardProps {
  read: SequencingRead
  index: number
  onClassify: (readId: number, label: SpeciesCategory) => void
}

const CATEGORY_LABELS: Record<SpeciesCategory, string> = {
  commensal: 'Commensal',
  cdiff: 'C. difficile',
  therapeutic: 'Therapeutic',
}

const CATEGORY_COLORS: Record<SpeciesCategory, { bg: string; border: string; text: string }> = {
  commensal: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-700' },
  cdiff: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700' },
  therapeutic: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700' },
}

export default function ReadCard({ read, index, onClassify }: ReadCardProps) {
  const [selected, setSelected] = useState<SpeciesCategory | null>(null)
  const locked = selected !== null
  const correct = locked && selected === read.category

  function handleClick(label: SpeciesCategory) {
    if (locked) return
    setSelected(label)
    onClassify(read.id, label)
  }

  const resultColor = locked
    ? correct
      ? 'border-green-500 bg-green-50'
      : 'border-red-500 bg-red-50'
    : 'border-gray-200 bg-white'

  return (
    <div className={`rounded-lg border-2 p-3 transition-colors ${resultColor}`}>
      {/* Read header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">Read #{index + 1}</span>
        {locked && (
          <span className={`text-xs font-semibold ${correct ? 'text-green-600' : 'text-red-600'}`}>
            {correct ? '✓ Correct' : `✗ Was ${CATEGORY_LABELS[read.category]}`}
          </span>
        )}
      </div>

      {/* DNA sequence */}
      <div className="font-mono text-xs tracking-wider text-gray-700 bg-gray-100 rounded px-2 py-1.5 mb-3 break-all select-all">
        {read.sequence}
      </div>

      {/* Classification buttons */}
      <div className="flex gap-2">
        {(['commensal', 'cdiff', 'therapeutic'] as SpeciesCategory[]).map((cat) => {
          const colors = CATEGORY_COLORS[cat]
          const isSelected = selected === cat
          return (
            <button
              key={cat}
              onClick={() => handleClick(cat)}
              disabled={locked}
              className={`flex-1 text-xs font-medium py-1.5 px-2 rounded border-2 transition-colors
                ${isSelected
                  ? `${colors.bg} ${colors.border} ${colors.text}`
                  : locked
                    ? 'opacity-30 border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : `border-gray-200 hover:${colors.border} hover:${colors.bg} ${colors.text} cursor-pointer`
                }
              `}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
