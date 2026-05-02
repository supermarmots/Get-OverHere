import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuthRedirect } from '../hooks/useAuthRedirect'
import { useAuthStore } from '../stores/authStore'
import LoginPage from '../features/auth/pages/LoginPage'
import SignupPage from '../features/auth/pages/SignupPage'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import LandingPage from '../features/landing/pages/LandingPage'
import CreateMeetingPage from '../features/meetings/pages/CreateMeetingPage'
import EditMeetingPage from '../features/meetings/pages/EditMeetingPage'
import InviteSharePage from '../features/meetings/pages/InviteSharePage'
import JoinMeetingPage from '../features/meetings/pages/JoinMeetingPage'
import MeetingDetailPage from '../features/meetings/pages/MeetingDetailPage'
import {
  ROUTES,
  getMeetingDetailPath,
  getMeetingEditPath,
  getMeetingInvitePath,
  getMeetingJoinPath,
} from './paths'
import { getAuthRouteState, getPostAuthRedirect } from './routeState'

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

function LandingRoute() {
  const navigate = useNavigate()

  return (
    <LandingPage
      onLogin={() => navigate(ROUTES.login)}
      onSignup={() => navigate(ROUTES.signup)}
    />
  )
}

function DashboardRoute() {
  const navigate = useNavigate()

  return (
    <DashboardPage
      onCreateMeeting={() => navigate(ROUTES.meetingNew)}
      onJoinWithInvite={(joinPath) => navigate(joinPath)}
      onLogout={() => navigate(ROUTES.landing)}
      onOpenMeeting={(meetingId) => navigate(getMeetingDetailPath(meetingId))}
    />
  )
}

function CreateMeetingRoute() {
  const navigate = useNavigate()

  return (
    <CreateMeetingPage
      onCancel={() => navigate(ROUTES.dashboard)}
      onSuccess={(meeting) => {
        navigate(getMeetingInvitePath(meeting.id), { state: { meetingTitle: meeting.title } })
      }}
    />
  )
}

function MeetingDetailRoute() {
  const navigate = useNavigate()
  const { meetingId } = useParams()

  return (
    <MeetingDetailPage
      meetingId={meetingId}
      onDashboard={() => navigate(ROUTES.dashboard)}
      onEdit={(meetingId) => navigate(getMeetingEditPath(meetingId))}
      onJoin={(meetingId) => navigate(getMeetingJoinPath(meetingId))}
    />
  )
}

function EditMeetingRoute() {
  const navigate = useNavigate()
  const { meetingId } = useParams()

  return (
    <EditMeetingPage
      meetingId={meetingId}
      onCancel={() => navigate(getMeetingDetailPath(meetingId))}
      onSaved={(savedMeetingId) => navigate(getMeetingDetailPath(savedMeetingId))}
    />
  )
}

function InviteShareRoute() {
  const navigate = useNavigate()
  const location = useLocation()
  const { meetingId } = useParams()

  return (
    <InviteSharePage
      meetingId={meetingId}
      meetingTitle={location.state?.meetingTitle}
      onDashboard={() => navigate(ROUTES.dashboard)}
    />
  )
}

function JoinMeetingRoute() {
  const navigate = useNavigate()
  const { meetingId } = useParams()

  return (
    <JoinMeetingPage
      meetingId={meetingId}
      onDashboard={() => navigate(ROUTES.dashboard)}
    />
  )
}

function LoginRoute() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <LoginPage
      onBack={() => navigate(ROUTES.landing)}
      onSignup={() => navigate(ROUTES.signup, { state: getAuthRouteState(location.state) })}
      onSuccess={() => navigate(getPostAuthRedirect(location.state))}
    />
  )
}

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

export default AppRoutes
