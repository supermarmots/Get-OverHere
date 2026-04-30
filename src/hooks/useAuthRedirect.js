import { ROUTES, isProtectedRoute } from '../routes/paths'
import { getPostAuthRedirect } from '../routes/routeState'

export function useAuthRedirect({ location, user }) {
  if (isProtectedRoute(location.pathname) && !user) {
    return {
      replace: true,
      state: { redirectTo: location.pathname },
      to: ROUTES.login,
    }
  }

  if ((location.pathname === ROUTES.login || location.pathname === ROUTES.signup) && user) {
    return {
      replace: true,
      to: getPostAuthRedirect(location.state),
    }
  }

  return null
}
