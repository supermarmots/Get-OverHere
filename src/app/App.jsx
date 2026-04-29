import { useCallback, useEffect, useState } from 'react'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import LoginPage from '../features/auth/pages/LoginPage'
import SignupPage from '../features/auth/pages/SignupPage'
import LandingPage from '../features/landing/pages/LandingPage'
import { ROUTES, getRedirectPath, normalizeRoute } from '../routes/paths'
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

  useEffect(() => {
    function syncRouteWithLocation() {
      const redirectPath = getRedirectPath(window.location.pathname)

      if (redirectPath !== window.location.pathname) {
        window.history.replaceState({}, '', redirectPath)
      }

      setRoute(normalizeRoute(redirectPath))
    }

    window.addEventListener('popstate', syncRouteWithLocation)

    return () => window.removeEventListener('popstate', syncRouteWithLocation)
  }, [])

  const navigate = useCallback((nextRoute) => {
    const normalizedRoute = normalizeRoute(nextRoute)
    window.history.pushState({}, '', normalizedRoute)
    setRoute(normalizedRoute)
  }, [])

  useEffect(() => {
    if (!isAuthReady) {
      return
    }

    if (route === ROUTES.dashboard && !user) {
      queueMicrotask(() => navigate(ROUTES.login))
      return
    }

    if ((route === ROUTES.login || route === ROUTES.signup) && user) {
      queueMicrotask(() => navigate(ROUTES.dashboard))
    }
  }, [isAuthReady, navigate, route, user])

  if (!isAuthReady) {
    return (
      <main className="landing">
        <p className="landing__eyebrow">Get Over Here</p>
      </main>
    )
  }

  if (route === ROUTES.dashboard && !user) {
    return null
  }

  if ((route === ROUTES.login || route === ROUTES.signup) && user) {
    return null
  }

  if (route === ROUTES.dashboard) {
    return <DashboardPage onLogout={() => navigate(ROUTES.landing)} />
  }

  if (route === ROUTES.signup) {
    return (
      <SignupPage
        onBack={() => navigate(ROUTES.landing)}
        onLogin={() => navigate(ROUTES.login)}
        onSuccess={() => navigate(ROUTES.dashboard)}
      />
    )
  }

  if (route === ROUTES.login) {
    return (
      <LoginPage
        onBack={() => navigate(ROUTES.landing)}
        onSignup={() => navigate(ROUTES.signup)}
        onSuccess={() => navigate(ROUTES.dashboard)}
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

export default App
