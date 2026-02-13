import { useMemo } from 'react'
import {
  AreaChart,
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
  const chartData = useMemo(
    () =>
      history.map((h) => ({
        tick: h.tick,
        commensals: h.totalCommensalAbundance * 100,
        cdiffAbundance: h.cdiffAbundance * 100,
        toxinLevel: h.toxinLevel * 100,
        healthScore: h.healthScore,
      })),
    [history],
  )

  return (
    <div className="space-y-4">
      {/* Population chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Population Dynamics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            stackOffset="none"
          >
            <XAxis
              dataKey="tick"
              label={{ value: 'Day', position: 'insideBottomRight', offset: -5 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              label={{ value: 'Abundance', angle: -90, position: 'insideLeft', offset: 10 }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => Number(value).toFixed(1)}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Legend />

            <Area
              type="monotone"
              dataKey="commensals"
              name="Commensals"
              stackId="1"
              stroke="#16a34a"
              fill="#22c55e"
              fillOpacity={0.7}
            />
            <Area
              type="monotone"
              dataKey="cdiffAbundance"
              name="C. diff"
              stackId="1"
              stroke="#dc2626"
              fill="#ef4444"
              fillOpacity={0.7}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Health & Toxin chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Patient Health & Toxin</h2>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis
              dataKey="tick"
              label={{ value: 'Day', position: 'insideBottomRight', offset: -5 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => Number(value).toFixed(1)}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Legend />

            <Line
              type="monotone"
              dataKey="healthScore"
              name="Health"
              stroke="#a855f7"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="toxinLevel"
              name="Toxin"
              stroke="#f97316"
              strokeDasharray="5 5"
              dot={false}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
