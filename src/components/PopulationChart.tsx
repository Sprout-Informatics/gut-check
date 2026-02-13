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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Population Dynamics</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="tick"
            label={{ value: 'Day', position: 'insideBottomRight', offset: -5 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 1]}
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
            formatter={(value, name) => {
              const v = Number(value)
              if (name === 'Health' || name === 'Diversity') return v.toFixed(1)
              return v.toFixed(4)
            }}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Legend />

          <Area
            yAxisId="left"
            type="monotone"
            dataKey="totalCommensalAbundance"
            name="Commensals"
            stroke="#16a34a"
            fill="#22c55e"
            fillOpacity={0.6}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="cdiffVegetative"
            name="C. diff (active)"
            stroke="#dc2626"
            fill="#ef4444"
            fillOpacity={0.5}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="cdiffSpores"
            name="C. diff (spores)"
            stroke="#f97316"
            strokeDasharray="5 5"
            dot={false}
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
            dataKey="diversityIndex"
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
