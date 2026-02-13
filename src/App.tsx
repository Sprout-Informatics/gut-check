import { SimulationProvider } from './state/SimulationContext'
import PatientDashboard from './components/PatientDashboard'

function App() {
  return (
    <SimulationProvider>
      <PatientDashboard />
    </SimulationProvider>
  )
}

export default App
