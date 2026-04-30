import { useNavigate } from 'react-router-dom'
import DashboardPage from '../../features/dashboard/pages/DashboardPage'
import { ROUTES, getMeetingDetailPath } from '../paths'

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

export default DashboardRoute
