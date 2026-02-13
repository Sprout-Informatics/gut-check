import { useEffect, useRef } from 'react'
import { useSimulation } from '../state/SimulationContext'

const TYPE_STYLES = {
  info: 'text-blue-700 bg-blue-50 border-blue-200',
  warning: 'text-amber-700 bg-amber-50 border-amber-200',
  critical: 'text-red-700 bg-red-50 border-red-200',
  success: 'text-green-700 bg-green-50 border-green-200',
} as const

const TYPE_ICONS = {
  info: 'i',
  warning: '!',
  critical: '!!',
  success: '\u2713',
} as const

export default function EventLog() {
  const { state } = useSimulation()
  const events = state.simulation.events
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [events.length])

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Event Log</h3>
      <div ref={scrollRef} className="max-h-48 overflow-y-auto space-y-1">
        {events.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No events yet.</p>
        ) : (
          [...events].reverse().map((event, i) => (
            <div
              key={`${event.tick}-${i}`}
              className={`text-xs px-3 py-2 rounded border ${TYPE_STYLES[event.type]}`}
            >
              <span className="font-mono font-bold mr-2">[{TYPE_ICONS[event.type]}]</span>
              <span className="font-medium mr-2">Day {event.tick}:</span>
              {event.message}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
