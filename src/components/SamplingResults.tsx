import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { MicrobiomeSample, SpeciesCategory } from '../simulation/types'

interface SamplingResultsProps {
  sample: MicrobiomeSample
  correctCount: number
  totalClassified: number
}

const CATEGORY_COLORS: Record<SpeciesCategory, string> = {
  commensal: '#22c55e',
  cdiff: '#ef4444',
  therapeutic: '#a855f7',
}

const CATEGORY_LABELS: Record<SpeciesCategory, string> = {
  commensal: 'Commensal',
  cdiff: 'C. difficile',
  therapeutic: 'Therapeutic',
}

export default function SamplingResults({ sample, correctCount, totalClassified }: SamplingResultsProps) {
  const accuracy = totalClassified > 0 ? Math.round((correctCount / totalClassified) * 100) : 0

  // Aggregate by category for the pie chart
  const categoryData = useMemo(() => {
    const totals: Record<SpeciesCategory, number> = { commensal: 0, cdiff: 0, therapeutic: 0 }
    for (const sp of sample.species) {
      totals[sp.category] += sp.abundance
    }
    return (['commensal', 'cdiff', 'therapeutic'] as SpeciesCategory[])
      .filter(cat => totals[cat] > 0.1)
      .map(cat => ({
        name: CATEGORY_LABELS[cat],
        value: Math.round(totals[cat] * 10) / 10,
        color: CATEGORY_COLORS[cat],
      }))
  }, [sample])

  // Top species for bar chart (top 10 by abundance)
  const topSpecies = useMemo(() => {
    return sample.species
      .slice(0, 10)
      .map(sp => ({
        name: sp.name.length > 14 ? sp.name.slice(0, 12) + '…' : sp.name,
        fullName: sp.name,
        abundance: Math.round(sp.abundance * 10) / 10,
        reads: sp.readCount,
        fill: CATEGORY_COLORS[sp.category],
      }))
  }, [sample])

  const accuracyColor = accuracy >= 80 ? 'text-green-600' : accuracy >= 50 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="text-center">
        <div className={`text-5xl font-bold ${accuracyColor}`}>{accuracy}%</div>
        <p className="text-sm text-gray-500 mt-1">
          {correctCount} of {totalClassified} reads classified correctly
        </p>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Composition pie */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">True Sample Composition</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Species bar chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Top Species by Read Count</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topSpecies} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value, _name, props) => [`${value} reads`, props.payload.fullName]}
              />
              <Legend content={() => null} />
              <Bar dataKey="reads" name="Reads">
                {topSpecies.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Educational text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <h4 className="font-semibold mb-2">How does this work in the real world?</h4>
        <p className="mb-2">
          In a real metagenomic sequencing experiment, millions of short DNA fragments ("reads")
          are generated from a patient's stool sample. Bioinformatics software like{' '}
          <strong>Kraken2</strong> or <strong>MetaPhlAn</strong> compares each read against a
          reference database of known bacterial genomes to identify which species it came from
          — the same task you just performed by hand.
        </p>
        <p className="mb-2">
          Notice the <strong>long-tailed distribution</strong>: a few species dominate the
          sample while many others are present at low abundance. This is a hallmark of real
          microbiome data and means that rare but clinically important organisms (like toxin-producing{' '}
          <em>C. difficile</em>) can be difficult to detect without sufficient sequencing depth.
        </p>
        <p>
          By determining the bacterial composition, scientists can assess whether a patient's gut
          is dominated by healthy commensals, overtaken by <em>C. difficile</em>, or successfully
          engrafted with therapeutic species — guiding clinical decisions about treatment.
        </p>
      </div>
    </div>
  )
}
