export const ROUTES = {
  landing: '/',
  login: '/login',
  signup: '/signup',
}

const routeValues = Object.values(ROUTES)

export function normalizeRoute(pathname) {
  return routeValues.includes(pathname) ? pathname : ROUTES.landing
}

export function isKnownRoute(pathname) {
  return routeValues.includes(pathname)
}

export function getRedirectPath(pathname) {
  return isKnownRoute(pathname) ? pathname : ROUTES.landing
}
