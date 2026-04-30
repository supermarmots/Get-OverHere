import { useNavigate } from 'react-router-dom'
import LandingPage from '../../features/landing/pages/LandingPage'
import { ROUTES } from '../paths'

function LandingRoute() {
  const navigate = useNavigate()

  return (
    <LandingPage
      onLogin={() => navigate(ROUTES.login)}
      onSignup={() => navigate(ROUTES.signup)}
    />
  )
}

export default LandingRoute
