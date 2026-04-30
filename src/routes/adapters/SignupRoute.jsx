import { useLocation, useNavigate } from 'react-router-dom'
import SignupPage from '../../features/auth/pages/SignupPage'
import { ROUTES } from '../paths'
import { getAuthRouteState, getPostAuthRedirect } from '../routeState'

function SignupRoute() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <SignupPage
      onBack={() => navigate(ROUTES.landing)}
      onLogin={() => navigate(ROUTES.login, { state: getAuthRouteState(location.state) })}
      onSuccess={() => navigate(getPostAuthRedirect(location.state))}
    />
  )
}

export default SignupRoute
