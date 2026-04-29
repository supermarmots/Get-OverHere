import { useCallback, useEffect, useState } from 'react'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import LoginPage from '../features/auth/pages/LoginPage'
import CreateMeetingPage from '../features/meetings/pages/CreateMeetingPage'
import EditMeetingPage from '../features/meetings/pages/EditMeetingPage'
import InviteSharePage from '../features/meetings/pages/InviteSharePage'
import JoinMeetingPage from '../features/meetings/pages/JoinMeetingPage'
import MeetingDetailPage from '../features/meetings/pages/MeetingDetailPage'
import SignupPage from '../features/auth/pages/SignupPage'
import LandingPage from '../features/landing/pages/LandingPage'
import {
  ROUTES,
  getMeetingDetailId,
  getMeetingDetailPath,
  getMeetingEditId,
  getMeetingEditPath,
  getMeetingInviteId,
  getMeetingInvitePath,
  getMeetingJoinId,
  getRedirectPath,
  isProtectedRoute,
  normalizeRoute,
} from '../routes/paths'
import { useAuthStore } from '../stores/authStore'
import { useFirebaseAuth } from './useFirebaseAuth'

function App() {
  useFirebaseAuth()

  const isAuthReady = useAuthStore((state) => state.isAuthReady)
  const user = useAuthStore((state) => state.user)
  const [route, setRoute] = useState(() => {
    const redirectPath = getRedirectPath(window.location.pathname)

    if (redirectPath !== window.location.pathname) {
      window.history.replaceState({}, '', redirectPath)
    }

    return normalizeRoute(redirectPath)
  })
  const [routeState, setRouteState] = useState(() => window.history.state ?? {})

  useEffect(() => {
    function syncRouteWithLocation() {
      const redirectPath = getRedirectPath(window.location.pathname)

      if (redirectPath !== window.location.pathname) {
        window.history.replaceState({}, '', redirectPath)
      }

      setRoute(normalizeRoute(redirectPath))
      setRouteState(window.history.state ?? {})
    }

    window.addEventListener('popstate', syncRouteWithLocation)

    return () => window.removeEventListener('popstate', syncRouteWithLocation)
  }, [])

  const navigate = useCallback((nextRoute, state = {}) => {
    const normalizedRoute = normalizeRoute(nextRoute)
    window.history.pushState(state, '', normalizedRoute)
    setRoute(normalizedRoute)
    setRouteState(state)
  }, [])

  useEffect(() => {
    if (!isAuthReady) {
      return
    }

    if (isProtectedRoute(route) && !user) {
      queueMicrotask(() => navigate(ROUTES.login, { redirectTo: route }))
      return
    }

    if ((route === ROUTES.login || route === ROUTES.signup) && user) {
      queueMicrotask(() => navigate(getPostAuthRedirect(routeState)))
    }
  }, [isAuthReady, navigate, route, routeState, user])

  if (!isAuthReady) {
    return (
      <main className="landing">
        <p className="landing__eyebrow">Get Over Here</p>
      </main>
    )
  }

  if (isProtectedRoute(route) && !user) {
    return null
  }

  if ((route === ROUTES.login || route === ROUTES.signup) && user) {
    return null
  }

  if (route === ROUTES.dashboard) {
    return (
      <DashboardPage
        onCreateMeeting={() => navigate(ROUTES.meetingNew)}
        onJoinWithInvite={(joinPath) => navigate(joinPath)}
        onLogout={() => navigate(ROUTES.landing)}
        onOpenMeeting={(meetingId) => navigate(getMeetingDetailPath(meetingId))}
      />
    )
  }

  if (route === ROUTES.meetingNew) {
    return (
      <CreateMeetingPage
        onCancel={() => navigate(ROUTES.dashboard)}
        onSuccess={(meeting) => {
          navigate(getMeetingInvitePath(meeting.id), { meetingTitle: meeting.title })
        }}
      />
    )
  }

  if (getMeetingEditId(route)) {
    const meetingId = getMeetingEditId(route)

    return (
      <EditMeetingPage
        meetingId={meetingId}
        onCancel={() => navigate(getMeetingDetailPath(meetingId))}
        onSaved={(savedMeetingId) => navigate(getMeetingDetailPath(savedMeetingId))}
      />
    )
  }

  if (getMeetingDetailId(route)) {
    return (
      <MeetingDetailPage
        meetingId={getMeetingDetailId(route)}
        onDashboard={() => navigate(ROUTES.dashboard)}
        onEdit={(meetingId) => navigate(getMeetingEditPath(meetingId))}
      />
    )
  }

  if (getMeetingInviteId(route)) {
    return (
      <InviteSharePage
        meetingId={getMeetingInviteId(route)}
        meetingTitle={routeState.meetingTitle}
        onDashboard={() => navigate(ROUTES.dashboard)}
      />
    )
  }

  if (getMeetingJoinId(route)) {
    return (
      <JoinMeetingPage
        meetingId={getMeetingJoinId(route)}
        onDashboard={() => navigate(ROUTES.dashboard)}
      />
    )
  }

  if (route === ROUTES.signup) {
    return (
      <SignupPage
        onBack={() => navigate(ROUTES.landing)}
        onLogin={() => navigate(ROUTES.login, getAuthRouteState(routeState))}
        onSuccess={() => navigate(getPostAuthRedirect(routeState))}
      />
    )
  }

  if (route === ROUTES.login) {
    return (
      <LoginPage
        onBack={() => navigate(ROUTES.landing)}
        onSignup={() => navigate(ROUTES.signup, getAuthRouteState(routeState))}
        onSuccess={() => navigate(getPostAuthRedirect(routeState))}
      />
    )
  }

  return (
    <LandingPage
      onLogin={() => navigate(ROUTES.login)}
      onSignup={() => navigate(ROUTES.signup)}
    />
  )
}

function getAuthRouteState(routeState) {
  const redirectTo = getPostAuthRedirect(routeState)

  if (redirectTo === ROUTES.dashboard) {
    return {}
  }

  return { redirectTo }
}

function getPostAuthRedirect(routeState) {
  if (isProtectedRoute(routeState.redirectTo)) {
    return routeState.redirectTo
  }

  return ROUTES.dashboard
}

export default App
