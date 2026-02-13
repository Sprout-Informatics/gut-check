import { useState } from 'react'
import { SimulationProvider } from './state/SimulationContext'
import PatientDashboard from './components/PatientDashboard'
import LandingPage from './components/LandingPage'

function App() {
  const [started, setStarted] = useState(false)

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />
  }

  return (
    <SimulationProvider>
      <PatientDashboard />
    </SimulationProvider>
  )
}

export default App
