import { useEffect, useState } from 'react'
import LoginPage from '../features/auth/pages/LoginPage'
import SignupPage from '../features/auth/pages/SignupPage'
import LandingPage from '../features/landing/pages/LandingPage'
import { ROUTES, getRedirectPath, normalizeRoute } from '../routes/paths'

function App() {
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

  function navigate(nextRoute) {
    const normalizedRoute = normalizeRoute(nextRoute)
    window.history.pushState({}, '', normalizedRoute)
    setRoute(normalizedRoute)
  }

  if (route === ROUTES.signup) {
    return (
      <SignupPage
        onBack={() => navigate(ROUTES.landing)}
        onLogin={() => navigate(ROUTES.login)}
      />
    )
  }

  if (route === ROUTES.login) {
    return (
      <LoginPage
        onBack={() => navigate(ROUTES.landing)}
        onSignup={() => navigate(ROUTES.signup)}
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
