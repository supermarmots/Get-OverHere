import { ROUTES, isProtectedRoute } from './paths'

export function getAuthRouteState(routeState) {
  const redirectTo = getPostAuthRedirect(routeState)

  if (redirectTo === ROUTES.dashboard) {
    return {}
  }

  return { redirectTo }
}

export function getPostAuthRedirect(routeState) {
  if (isProtectedRoute(routeState?.redirectTo)) {
    return routeState.redirectTo
  }

  return ROUTES.dashboard
}
