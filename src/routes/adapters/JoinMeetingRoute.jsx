import { useNavigate, useParams } from 'react-router-dom'
import JoinMeetingPage from '../../features/meetings/pages/JoinMeetingPage'
import { ROUTES } from '../paths'

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

export default JoinMeetingRoute
