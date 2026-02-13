import { useMemo } from 'react'
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useSimulation } from '../state/SimulationContext'

export default function PopulationChart() {
  const { state } = useSimulation()
  const history = state.simulation.history

  // Scale internal 0-1 values to 0-100 for display
  const maxDiversity = Math.log2(12) // max Shannon diversity for 12 species
  const chartData = useMemo(
    () =>
      history.map((h) => ({
        tick: h.tick,
        commensals: h.totalCommensalAbundance * 100,
        cdiffAbundance: h.cdiffAbundance * 100,
        toxinLevel: h.toxinLevel * 100,
        diversity: (h.diversityIndex / maxDiversity) * 100,
        healthScore: h.healthScore,
      })),
    [history, maxDiversity],
  )

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Population Dynamics</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="tick"
            label={{ value: 'Day', position: 'insideBottomRight', offset: -5 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 100]}
            label={{ value: 'Abundance', angle: -90, position: 'insideLeft', offset: 10 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            label={{ value: 'Score', angle: 90, position: 'insideRight', offset: 10 }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => {
              return Number(value).toFixed(1)
            }}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Legend />

          <Area
            yAxisId="left"
            type="monotone"
            dataKey="commensals"
            name="Commensals"
            stroke="#16a34a"
            fill="#22c55e"
            fillOpacity={0.6}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="cdiffAbundance"
            name="C. diff"
            stroke="#dc2626"
            fill="#ef4444"
            fillOpacity={0.5}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="toxinLevel"
            name="Toxin"
            stroke="#f97316"
            strokeDasharray="5 5"
            dot={false}
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="healthScore"
            name="Health"
            stroke="#a855f7"
            dot={false}
            strokeWidth={2}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="diversity"
            name="Diversity"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={1.5}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
