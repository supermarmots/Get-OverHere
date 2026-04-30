import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuthRedirect } from '../hooks/useAuthRedirect'
import { useAuthStore } from '../stores/authStore'
import DashboardRoute from './adapters/DashboardRoute'
import CreateMeetingRoute from './adapters/CreateMeetingRoute'
import EditMeetingRoute from './adapters/EditMeetingRoute'
import InviteShareRoute from './adapters/InviteShareRoute'
import JoinMeetingRoute from './adapters/JoinMeetingRoute'
import LandingRoute from './adapters/LandingRoute'
import LoginRoute from './adapters/LoginRoute'
import MeetingDetailRoute from './adapters/MeetingDetailRoute'
import SignupRoute from './adapters/SignupRoute'
import { ROUTES } from './paths'

function AppRoutes() {
  const isAuthReady = useAuthStore((state) => state.isAuthReady)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  const redirect = useAuthRedirect({ location, user })

  if (!isAuthReady) {
    return (
      <main className="landing">
        <p className="landing__eyebrow">Get Over Here</p>
      </main>
    )
  }

  if (redirect) {
    return <Navigate to={redirect.to} state={redirect.state} replace={redirect.replace} />
  }

  return (
    <Routes>
      <Route path={ROUTES.landing} element={<LandingRoute />} />
      <Route path={ROUTES.dashboard} element={<DashboardRoute />} />
      <Route path={ROUTES.meetingNew} element={<CreateMeetingRoute />} />
      <Route path="/meetings/:meetingId" element={<MeetingDetailRoute />} />
      <Route path="/meetings/:meetingId/edit" element={<EditMeetingRoute />} />
      <Route path="/meetings/:meetingId/invite" element={<InviteShareRoute />} />
      <Route path="/meetings/:meetingId/join" element={<JoinMeetingRoute />} />
      <Route path={ROUTES.signup} element={<SignupRoute />} />
      <Route path={ROUTES.login} element={<LoginRoute />} />
      <Route path="*" element={<Navigate to={ROUTES.landing} replace />} />
    </Routes>
  )
}

export default AppRoutes
