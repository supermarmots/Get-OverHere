export const ROUTES = {
  dashboard: '/dashboard',
  landing: '/',
  login: '/login',
  meetingNew: '/meetings/new',
  signup: '/signup',
}

const routeValues = Object.values(ROUTES)
const meetingInvitePattern = /^\/meetings\/([^/]+)\/invite$/

export function normalizeRoute(pathname) {
  return isKnownRoute(pathname) ? pathname : ROUTES.landing
}

export function isKnownRoute(pathname) {
  return routeValues.includes(pathname) || meetingInvitePattern.test(pathname)
}

export function getRedirectPath(pathname) {
  return isKnownRoute(pathname) ? pathname : ROUTES.landing
}

export function getMeetingInviteId(pathname) {
  const match = pathname.match(meetingInvitePattern)

  if (!match) {
    return ''
  }

  return match[1]
}

export function getMeetingInvitePath(meetingId) {
  return `/meetings/${meetingId}/invite`
}

export function getMeetingJoinUrl(meetingId, origin = window.location.origin) {
  return `${origin}/meetings/${meetingId}/join`
}

export function isProtectedRoute(pathname) {
  return pathname === ROUTES.dashboard
    || pathname === ROUTES.meetingNew
    || meetingInvitePattern.test(pathname)
}
