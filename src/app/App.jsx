import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '../routes/AppRoutes'
import { useFirebaseAuth } from './useFirebaseAuth'

function App() {
  useFirebaseAuth()

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
