import { useLocation, useNavigate } from 'react-router-dom'
import LoginPage from '../../features/auth/pages/LoginPage'
import { ROUTES } from '../paths'
import { getAuthRouteState, getPostAuthRedirect } from '../routeState'

function LoginRoute() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <LoginPage
      onBack={() => navigate(ROUTES.landing)}
      onSignup={() => navigate(ROUTES.signup, { state: getAuthRouteState(location.state) })}
      onSuccess={() => navigate(getPostAuthRedirect(location.state))}
    />
  )
}

export default LoginRoute
