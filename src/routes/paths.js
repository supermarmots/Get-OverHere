export const ROUTES = {
  dashboard: '/dashboard',
  landing: '/',
  login: '/login',
  meetingNew: '/meetings/new',
  signup: '/signup',
}

const routeValues = Object.values(ROUTES)
const meetingDetailPattern = /^\/meetings\/([^/]+)$/
const meetingEditPattern = /^\/meetings\/([^/]+)\/edit$/
const meetingInvitePattern = /^\/meetings\/([^/]+)\/invite$/

export function normalizeRoute(pathname) {
  return isKnownRoute(pathname) ? pathname : ROUTES.landing
}

export function isKnownRoute(pathname) {
  return routeValues.includes(pathname)
    || meetingDetailPattern.test(pathname)
    || meetingEditPattern.test(pathname)
    || meetingInvitePattern.test(pathname)
}

export function getRedirectPath(pathname) {
  return isKnownRoute(pathname) ? pathname : ROUTES.landing
}

export function getMeetingInviteId(pathname) {
  return getPatternId(pathname, meetingInvitePattern)
}

export function getMeetingDetailId(pathname) {
  return getPatternId(pathname, meetingDetailPattern)
}

export function getMeetingEditId(pathname) {
  return getPatternId(pathname, meetingEditPattern)
}

export function getMeetingDetailPath(meetingId) {
  return `/meetings/${meetingId}`
}

export function getMeetingEditPath(meetingId) {
  return `/meetings/${meetingId}/edit`
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
    || meetingDetailPattern.test(pathname)
    || meetingEditPattern.test(pathname)
    || meetingInvitePattern.test(pathname)
}

function getPatternId(pathname, pattern) {
  const match = pathname.match(pattern)

  if (!match) {
    return ''
  }

  return match[1]
}
